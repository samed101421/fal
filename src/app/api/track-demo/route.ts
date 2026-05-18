import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { cafeName } = await req.json();
    
    if (!cafeName) {
      return NextResponse.json({ error: "No cafe name provided" }, { status: 400 });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.warn("Telegram credentials not set. Skipping tracking.");
      return NextResponse.json({ success: true, warning: "No credentials" });
    }

    const message = `🚨 *SICAK MÜŞTERİ (DEMO AÇILDI)* 🚨\n\n🎯 *${cafeName}* şu an Kahve Falı B2B demosunu inceliyor!\nLinke an itibariyle tıklandı. İzlemedeyiz! 👀`;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown"
      })
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Tracking error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
