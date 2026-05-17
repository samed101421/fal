"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export default function QubbeFalPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<{file: File; preview: string}[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    relationship: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files);
    if (photos.length + newFiles.length > 3) {
      alert("En fazla 3 fotoğraf yükleyebilirsiniz.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
      
      const newPhotos = newFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      
      setPhotos((prev) => [...prev, ...newPhotos]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      // Free up memory
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (photos.length === 0) {
      alert("Lütfen en az bir fincan fotoğrafı yükleyin.");
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Falınız yorumlanıyor! Çok yakında burada olacak...");
    }, 2000);
  };

  return (
    <main className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="w-full max-w-2xl text-center space-y-6 mb-12">
        <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full border-2 border-gold-500 shadow-[0_0_30px_rgba(212,175,55,0.2)] bg-wood-900 flex items-center justify-center overflow-hidden transform transition hover:scale-105 duration-500">
          {/* We can place QUBBE logo here later. For now, a stylish text fallback */}
          <span className="font-cinzel text-5xl text-gold-500">Q</span>
        </div>
        <div className="space-y-2">
          <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold text-gold-500 tracking-wider drop-shadow-lg">
            QUBBE
          </h1>
          <p className="font-inter text-gold-400 text-sm sm:text-base tracking-[0.3em] uppercase">
            Düğün Salonu
          </p>
        </div>
        <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-6"></div>
      </div>

      {/* Form Section */}
      <div className="w-full max-w-xl backdrop-blur-xl bg-wood-900/40 p-6 sm:p-10 rounded-3xl border border-gold-600/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="text-center mb-8">
          <h2 className="font-cinzel text-2xl text-gold-300 mb-2">Özel Kahve Falı</h2>
          <p className="font-inter text-sm text-gold-600/80">
            Fincanınızın gizemini keşfedin.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Photo Upload Area */}
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {photos.map((photo, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-gold-500/30 group">
                  <img 
                    src={photo.preview} 
                    alt={`Fincan ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="bg-red-500/80 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-500 transition-colors"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))}
              
              {photos.length < 3 && (
                <div className="relative aspect-square rounded-2xl border-2 border-dashed border-gold-600/30 hover:border-gold-400 bg-wood-800/20 flex flex-col items-center justify-center transition-all hover:bg-wood-800/40 group overflow-hidden">
                  {/* Invisible file input covering the entire area */}
                  <input 
                    ref={fileInputRef}
                    id="coffee-upload"
                    type="file" 
                    accept="image/*" 
                    multiple 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50" 
                    onChange={handlePhotoUpload}
                  />
                  
                  {/* Visual content underneath the invisible input */}
                  <div className="flex flex-col items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-wood-950/50 flex items-center justify-center mb-2 group-hover:bg-gold-500/20 transition-colors">
                      <span className="text-2xl text-gold-500 font-light">+</span>
                    </div>
                    <span className="text-xs text-gold-500/70 font-inter uppercase tracking-wider">Fotoğraf</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gold-600/20 to-transparent my-8"></div>

          {/* User Details Form */}
          <div className="space-y-6">
            <div className="relative">
              <label htmlFor="name" className="block font-cinzel text-sm tracking-widest text-gold-400 mb-2 uppercase">Adınız Soyadınız</label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-wood-950/50 border border-gold-600/20 rounded-xl px-5 py-4 text-gold-300 font-inter focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all placeholder-gold-600/30"
                placeholder="Örn: Ayşe Yılmaz"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="relative">
                <label htmlFor="gender" className="block font-cinzel text-sm tracking-widest text-gold-400 mb-2 uppercase">Cinsiyet</label>
                <select
                  id="gender"
                  required
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full bg-wood-950/50 border border-gold-600/20 rounded-xl px-5 py-4 text-gold-300 font-inter focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all appearance-none"
                >
                  <option value="" disabled>Seçiniz</option>
                  <option value="kadin">Kadın</option>
                  <option value="erkek">Erkek</option>
                  <option value="diger">Belirtmek İstemiyorum</option>
                </select>
                {/* Custom dropdown arrow */}
                <div className="absolute right-5 top-[2.5rem] pointer-events-none">
                  <svg className="w-4 h-4 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
              
              <div className="relative">
                <label htmlFor="relationship" className="block font-cinzel text-sm tracking-widest text-gold-400 mb-2 uppercase">İlişki Durumu</label>
                <select
                  id="relationship"
                  required
                  value={formData.relationship}
                  onChange={(e) => setFormData({...formData, relationship: e.target.value})}
                  className="w-full bg-wood-950/50 border border-gold-600/20 rounded-xl px-5 py-4 text-gold-300 font-inter focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all appearance-none"
                >
                  <option value="" disabled>Seçiniz</option>
                  <option value="bekar">Bekar</option>
                  <option value="iliski">İlişkisi Var</option>
                  <option value="nisanli">Nişanlı</option>
                  <option value="evli">Evli</option>
                  <option value="karisik">Karmaşık</option>
                </select>
                <div className="absolute right-5 top-[2.5rem] pointer-events-none">
                  <svg className="w-4 h-4 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 text-wood-950 font-cinzel font-bold text-lg py-5 transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] disabled:opacity-70 disabled:hover:scale-100 mt-8"
          >
            <span className="relative z-10 tracking-widest">
              {isSubmitting ? "YORUMLANIYOR..." : "FALIMI YORUMLA"}
            </span>
          </button>
        </form>
      </div>
      
      {/* Footer */}
      <div className="mt-16 text-center pb-8 opacity-60">
        <div className="w-8 h-8 mx-auto mb-4 opacity-50">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gold-500"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 8l-8 5-8-5V6l8 5 8-5m0 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V10"></path></svg>
        </div>
        <p className="font-cinzel text-xs text-gold-400 tracking-widest uppercase">
          Powered by AI
        </p>
      </div>
    </main>
  );
}
