import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const gender = formData.get('gender') as string;
    const relationship = formData.get('relationship') as string;

    const photoFiles: File[] = [];
    for (let i = 0; i < 3; i++) {
      const photo = formData.get(`photo_${i}`) as File | null;
      if (photo) photoFiles.push(photo);
    }

    if (photoFiles.length === 0) {
      return NextResponse.json({ error: 'En az bir fotoğraf gerekli.' }, { status: 400 });
    }

    const imageMessages = await Promise.all(
      photoFiles.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const base64 = Buffer.from(bytes).toString('base64');
        const mimeType = file.type || 'image/jpeg';
        return {
          type: 'image_url' as const,
          image_url: { url: `data:${mimeType};base64,${base64}`, detail: 'high' as const },
        };
      })
    );

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const genderText = gender === 'kadin' ? 'kadın' : gender === 'erkek' ? 'erkek' : 'bireyin';
    const relationshipMap: Record<string, string> = {
      bekar: 'bekâr', iliski: 'bir ilişkisi olan', nisanli: 'nişanlı',
      evli: 'evli', karisik: 'karmaşık bir aşk hayatı olan',
    };
    const relationshipText = relationshipMap[relationship] || relationship;

    const prompt = `Sen yüzyıllık bir geleneğin temsilcisi, mistik ve bilge bir kahve falı ustasısın. Sana ${name} isimli, ${genderText} ve ${relationshipText} bir kişinin kahve fincanı gösterildi.

Fincanı dikkatle incele. Kahve tortusu desenlerini, şekilleri, sembolleri ve konumlarını yorumla. Aşağıdaki başlıkları kullanarak kişiye özel, derin ve büyüleyici bir fal yaz:

✨ **Genel Enerji**
Fincanın genel havasını ve ${name}'in yakın geleceğini anlat. 2-3 cümle.

💫 **Aşk & Kalp**
Duygusal dünya, aşk ve ilişkiler hakkında özel yorum. ${name}'in adını kullan. 2-3 cümle.

💼 **Kariyer & Bereket**
İş hayatı, para ve fırsatlar. 2-3 cümle.

🔮 **Gizli Mesaj**
Fincanın en güçlü sembolünden ${name}'e özel, mistik ve çarpıcı bir mesaj. 2-3 cümle.

Türkçe yaz. Gizemli, umut verici ve kişisel bir dil kullan. Toplam yaklaşık 220-260 kelime olsun.`;

    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: [...imageMessages, { type: 'text', text: prompt }] }],
      max_tokens: 900,
    });

    const falText = response.choices[0]?.message?.content || 'Falınız şu an okunamamaktadır.';
    return NextResponse.json({ fal: falText });
  } catch (error) {
    console.error('Fal API hatası:', error);
    return NextResponse.json({ error: 'Fal yorumlanırken bir hata oluştu.' }, { status: 500 });
  }
}
