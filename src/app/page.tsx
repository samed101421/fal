"use client";

import { useState, useRef } from "react";

type FalState = "idle" | "loading" | "result" | "error";

export default function QubbeFalPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [formData, setFormData] = useState({ name: "", gender: "", relationship: "" });
  const [falState, setFalState] = useState<FalState>("idle");
  const [falText, setFalText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const newFiles = Array.from(e.target.files);
    if (photos.length + newFiles.length > 3) {
      alert("En fazla 3 fotoğraf yükleyebilirsiniz.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    const newPhotos = newFiles.map((file) => ({ file, preview: URL.createObjectURL(file) }));
    setPhotos((prev) => [...prev, ...newPhotos]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => { URL.revokeObjectURL(prev[index].preview); return prev.filter((_, i) => i !== index); });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (photos.length === 0) { alert("Lütfen en az bir fincan fotoğrafı yükleyin."); return; }
    setFalState("loading");
    setFalText("");
    setErrorMsg("");
    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("gender", formData.gender);
      fd.append("relationship", formData.relationship);
      photos.forEach((p, i) => fd.append(`photo_${i}`, p.file));
      const res = await fetch("/api/fal", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || data.error) { setErrorMsg(data.error || "Bir hata oluştu."); setFalState("error"); return; }
      setFalText(data.fal);
      setFalState("result");
    } catch { setErrorMsg("Sunucuya bağlanılamadı. Lütfen tekrar deneyin."); setFalState("error"); }
  };

  const resetForm = () => {
    photos.forEach((p) => URL.revokeObjectURL(p.preview));
    setPhotos([]); setFormData({ name: "", gender: "", relationship: "" });
    setFalState("idle"); setFalText(""); setErrorMsg("");
  };

  const formatFalText = (text: string) => text.split("\n").map((line, i) => (
    <p key={i} className={line.trim() === "" ? "mt-4" : "mb-1"} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
  ));

  return (
    <main className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl text-center space-y-6 mb-12">
        <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full border-2 border-gold-500 shadow-[0_0_30px_rgba(212,175,55,0.2)] bg-wood-900 flex items-center justify-center overflow-hidden transform transition hover:scale-105 duration-500">
          <span className="font-cinzel text-5xl text-gold-500">Q</span>
        </div>
        <div className="space-y-2">
          <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold text-gold-500 tracking-wider drop-shadow-lg">QUBBE</h1>
          <p className="font-inter text-gold-400 text-sm sm:text-base tracking-[0.3em] uppercase">Düğün Salonu</p>
        </div>
        <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-6"></div>
      </div>

      {falState === "loading" && (
        <div className="w-full max-w-xl backdrop-blur-xl bg-wood-900/40 p-10 rounded-3xl border border-gold-600/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-center">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto relative">
              <div className="absolute inset-0 rounded-full border-2 border-gold-500/20 animate-ping"></div>
              <div className="absolute inset-2 rounded-full border-2 border-gold-400/40 animate-ping" style={{animationDelay:'0.3s'}}></div>
              <div className="absolute inset-4 rounded-full bg-gold-500/10 flex items-center justify-center"><span className="text-2xl">☕</span></div>
            </div>
          </div>
          <h2 className="font-cinzel text-2xl text-gold-300 mb-3">Falınız Okunuyor...</h2>
          <p className="font-inter text-sm text-gold-500/60">Fincanınızdaki gizler yorumlanıyor.</p>
          <div className="flex justify-center gap-2 mt-6">
            {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-gold-500/60 animate-bounce" style={{animationDelay:`${i*0.2}s`}}></div>)}
          </div>
        </div>
      )}

      {falState === "result" && (
        <div className="w-full max-w-xl backdrop-blur-xl bg-wood-900/40 p-8 sm:p-10 rounded-3xl border border-gold-600/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🔮</div>
            <h2 className="font-cinzel text-2xl text-gold-300 mb-1">Falınız Hazır</h2>
            <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto"></div>
          </div>
          <div className="font-inter text-gold-200/90 text-sm leading-relaxed bg-wood-950/30 rounded-2xl p-6 border border-gold-600/10">
            {formatFalText(falText)}
          </div>
          <button onClick={resetForm} className="w-full mt-8 rounded-xl border border-gold-600/30 text-gold-400 font-cinzel text-sm py-4 hover:bg-gold-500/10 transition-all tracking-widest uppercase">Yeni Fal Bak</button>
        </div>
      )}

      {falState === "error" && (
        <div className="w-full max-w-xl backdrop-blur-xl bg-wood-900/40 p-10 rounded-3xl border border-red-600/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="font-cinzel text-xl text-red-400 mb-3">Bir Hata Oluştu</h2>
          <p className="font-inter text-sm text-gold-500/60 mb-6">{errorMsg}</p>
          <button onClick={resetForm} className="font-cinzel text-sm text-gold-400 border border-gold-600/30 px-6 py-3 rounded-xl hover:bg-gold-500/10 transition-all">Tekrar Dene</button>
        </div>
      )}

      {falState === "idle" && (
        <div className="w-full max-w-xl backdrop-blur-xl bg-wood-900/40 p-6 sm:p-10 rounded-3xl border border-gold-600/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="text-center mb-8">
            <h2 className="font-cinzel text-2xl text-gold-300 mb-2">Özel Kahve Falı</h2>
            <p className="font-inter text-sm text-gold-600/80">Fincanınızın gizemini keşfedin.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {photos.map((photo, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-gold-500/30 group">
                  <img src={photo.preview} alt={`Fincan ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => removePhoto(idx)} className="bg-red-500/80 text-white rounded-full w-8 h-8 flex items-center justify-center">&times;</button>
                  </div>
                </div>
              ))}
              {photos.length < 3 && (
                <div className="relative aspect-square rounded-2xl border-2 border-dashed border-gold-600/30 hover:border-gold-400 bg-wood-800/20 flex flex-col items-center justify-center transition-all hover:bg-wood-800/40 group overflow-hidden">
                  <input ref={fileInputRef} id="coffee-upload" type="file" accept="image/*" multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50" onChange={handlePhotoUpload} />
                  <div className="flex flex-col items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-wood-950/50 flex items-center justify-center mb-2"><span className="text-2xl text-gold-500 font-light">+</span></div>
                    <span className="text-xs text-gold-500/70 font-inter uppercase tracking-wider">Fotoğraf</span>
                  </div>
                </div>
              )}
            </div>
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gold-600/20 to-transparent"></div>
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block font-cinzel text-sm tracking-widest text-gold-400 mb-2 uppercase">Adınız Soyadınız</label>
                <input type="text" id="name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-wood-950/50 border border-gold-600/20 rounded-xl px-5 py-4 text-gold-300 font-inter focus:outline-none focus:border-gold-500 transition-all" placeholder="Örn: Ayşe Yılmaz" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="relative">
                  <label htmlFor="gender" className="block font-cinzel text-sm tracking-widest text-gold-400 mb-2 uppercase">Cinsiyet</label>
                  <select id="gender" required value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full bg-wood-950/50 border border-gold-600/20 rounded-xl px-5 py-4 text-gold-300 font-inter focus:outline-none focus:border-gold-500 transition-all appearance-none">
                    <option value="" disabled>Seçiniz</option>
                    <option value="kadin">Kadın</option>
                    <option value="erkek">Erkek</option>
                    <option value="diger">Belirtmek İstemiyorum</option>
                  </select>
                  <div className="absolute right-5 top-[2.85rem] pointer-events-none"><svg className="w-4 h-4 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></div>
                </div>
                <div className="relative">
                  <label htmlFor="relationship" className="block font-cinzel text-sm tracking-widest text-gold-400 mb-2 uppercase">İlişki Durumu</label>
                  <select id="relationship" required value={formData.relationship} onChange={(e) => setFormData({ ...formData, relationship: e.target.value })} className="w-full bg-wood-950/50 border border-gold-600/20 rounded-xl px-5 py-4 text-gold-300 font-inter focus:outline-none focus:border-gold-500 transition-all appearance-none">
                    <option value="" disabled>Seçiniz</option>
                    <option value="bekar">Bekar</option>
                    <option value="iliski">İlişkisi Var</option>
                    <option value="nisanli">Nişanlı</option>
                    <option value="evli">Evli</option>
                    <option value="karisik">Karmaşık</option>
                  </select>
                  <div className="absolute right-5 top-[2.85rem] pointer-events-none"><svg className="w-4 h-4 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></div>
                </div>
              </div>
            </div>
            <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 text-wood-950 font-cinzel font-bold text-lg py-5 transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] mt-8 tracking-widest">
              FALIMI YORUMLA
            </button>
          </form>
        </div>
      )}

      <div className="mt-16 text-center pb-8 opacity-60">
        <p className="font-cinzel text-xs text-gold-400 tracking-widest uppercase">Powered by AI</p>
      </div>
    </main>
  );
}
