"use client";

import { useState, useRef, useEffect } from "react";
import type { CafeConfig } from "@/cafes.config";

type FalState = "idle" | "loading" | "result" | "error";

interface Props {
  config: CafeConfig;
}

export default function CafeFalPage({ config }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    relationship: "",
  });
  const [falState, setFalState] = useState<FalState>("idle");
  const [falText, setFalText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Sadece özel isimle girilmiş demo sayfasındaysak tetikle
    if (config.slug === "demo" && config.name !== "ÖRNEK KAFE") {
      const trackedKey = `tracked_demo_${config.name}`;
      if (!sessionStorage.getItem(trackedKey)) {
        sessionStorage.setItem(trackedKey, "true");
        fetch("/api/track-demo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cafeName: config.name })
        }).catch(e => console.error(e));
      }
    }
  }, [config.slug, config.name]);

  // ─── Renk değişkenlerini inline style olarak uygula ───
  const cssVars = {
    "--primary": config.primaryColor,
    "--primary-light": config.primaryLight,
    "--primary-dark": config.primaryDark,
    "--bg": config.bgColor,
    "--bg-mid": config.bgMid,
    "--bg-deep": config.bgDeep,
  } as React.CSSProperties;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const newFiles = Array.from(e.target.files);
    if (photos.length + newFiles.length > 3) {
      alert("En fazla 3 fotoğraf yükleyebilirsiniz.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    const newPhotos = newFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (photos.length === 0) {
      alert("Lütfen en az bir fincan fotoğrafı yükleyin.");
      return;
    }
    setFalState("loading");
    setFalText("");
    setErrorMsg("");

    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("gender", formData.gender);
      fd.append("relationship", formData.relationship);
      fd.append("cafeContext", config.promptContext);
      photos.forEach((p, i) => fd.append(`photo_${i}`, p.file));

      const res = await fetch("/api/fal", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMsg(data.error || "Bir hata oluştu.");
        setFalState("error");
        return;
      }

      setFalText(data.fal);
      setFalState("result");
    } catch {
      setErrorMsg("Sunucuya bağlanılamadı. Lütfen tekrar deneyin.");
      setFalState("error");
    }
  };

  const resetForm = () => {
    photos.forEach((p) => URL.revokeObjectURL(p.preview));
    setPhotos([]);
    setFormData({ name: "", gender: "", relationship: "" });
    setFalState("idle");
    setFalText("");
    setErrorMsg("");
  };

  const formatFalText = (text: string) =>
    text.split("\n").map((line, i) => {
      const boldLine = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return (
        <p
          key={i}
          className={line.trim() === "" ? "mt-4" : "mb-1"}
          dangerouslySetInnerHTML={{ __html: boldLine }}
        />
      );
    });

  return (
    <main
      className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8"
      style={{
        ...cssVars,
        background: `radial-gradient(ellipse at top, color-mix(in srgb, var(--bg-mid) 40%, transparent), var(--bg))`,
        backgroundColor: config.bgColor,
        color: config.primaryLight,
      }}
    >
      {/* ── Header ── */}
      <div className="w-full max-w-2xl text-center space-y-6 mb-12">
        <div
          className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full flex items-center justify-center overflow-hidden transform transition hover:scale-105 duration-500"
          style={{
            border: `2px solid ${config.primaryColor}`,
            boxShadow: `0 0 30px ${config.primaryColor}33`,
            backgroundColor: config.bgMid,
          }}
        >
          <span
            className="font-cinzel text-5xl"
            style={{ color: config.primaryColor }}
          >
            {config.logoChar}
          </span>
        </div>
        <div className="space-y-2">
          <h1
            className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider drop-shadow-lg"
            style={{ color: config.primaryColor }}
          >
            {config.name}
          </h1>
          <p
            className="font-inter text-sm sm:text-base tracking-[0.3em] uppercase"
            style={{ color: config.primaryLight }}
          >
            {config.subtitle}
          </p>
        </div>
        <div
          className="w-32 h-[1px] mx-auto mt-6"
          style={{
            background: `linear-gradient(to right, transparent, ${config.primaryColor}, transparent)`,
          }}
        />
      </div>

      {/* ── LOADING ── */}
      {falState === "loading" && (
        <div
          className="w-full max-w-xl backdrop-blur-xl p-10 rounded-3xl text-center"
          style={{
            backgroundColor: `${config.bgMid}66`,
            border: `1px solid ${config.primaryDark}33`,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto relative">
              <div
                className="absolute inset-0 rounded-full border-2 animate-ping"
                style={{ borderColor: `${config.primaryColor}33` }}
              />
              <div
                className="absolute inset-2 rounded-full border-2 animate-ping"
                style={{
                  borderColor: `${config.primaryColor}66`,
                  animationDelay: "0.3s",
                }}
              />
              <div
                className="absolute inset-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${config.primaryColor}1a` }}
              >
                <span className="text-2xl">☕</span>
              </div>
            </div>
          </div>
          <h2
            className="font-cinzel text-2xl mb-3"
            style={{ color: config.primaryLight }}
          >
            Falınız Okunuyor...
          </h2>
          <p className="font-inter text-sm" style={{ color: `${config.primaryColor}99` }}>
            Fincanınızdaki gizler yorumlanıyor. Lütfen bekleyin.
          </p>
          <div className="flex justify-center gap-2 mt-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full animate-bounce"
                style={{
                  backgroundColor: `${config.primaryColor}99`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── RESULT ── */}
      {falState === "result" && (
        <div
          className="w-full max-w-xl backdrop-blur-xl p-8 sm:p-10 rounded-3xl animate-[fadeIn_0.8s_ease-in]"
          style={{
            backgroundColor: `${config.bgMid}66`,
            border: `1px solid ${config.primaryDark}33`,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🔮</div>
            <h2 className="font-cinzel text-2xl mb-1" style={{ color: config.primaryLight }}>
              Falınız Hazır
            </h2>
            <div
              className="w-20 h-[1px] mx-auto"
              style={{
                background: `linear-gradient(to right, transparent, ${config.primaryColor}, transparent)`,
              }}
            />
          </div>

          <div
            className="font-inter text-sm leading-relaxed space-y-1 rounded-2xl p-6"
            style={{
              color: `${config.primaryLight}e6`,
              backgroundColor: `${config.bgDeep}4d`,
              border: `1px solid ${config.primaryDark}1a`,
            }}
          >
            {formatFalText(falText)}
          </div>

          <button
            onClick={resetForm}
            className="w-full mt-8 rounded-xl font-cinzel text-sm py-4 transition-all tracking-widest uppercase hover:scale-[1.02]"
            style={{
              border: `1px solid ${config.primaryDark}4d`,
              color: config.primaryColor,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = `${config.primaryColor}1a`)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            Yeni Fal Bak
          </button>

          {config.slug === "demo" && (
            <div className="mt-8 pt-6 border-t border-dashed" style={{ borderColor: `${config.primaryDark}4d` }}>
              <p className="font-inter text-xs text-center mb-4" style={{ color: `${config.primaryLight}b3` }}>
                Sistem Altyapısı: Antigravity AI.<br /> Bu dijital fal menüsünü kendi işletmenize kurmak ister misiniz?
              </p>
              <a
                href="https://wa.me/905320000000?text=Merhaba,%20Kahve%20Falı%20sistemini%20kafeme%20kurmak%20istiyorum."
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center rounded-xl font-cinzel text-sm py-4 transition-all tracking-widest uppercase hover:scale-[1.02]"
                style={{
                  backgroundColor: config.primaryColor,
                  color: config.bgDeep,
                  fontWeight: "bold",
                  boxShadow: `0 4px 15px ${config.primaryColor}4d`,
                }}
              >
                SİSTEMİ KAFEME KUR
              </a>
            </div>
          )}
        </div>
      )}

      {/* ── ERROR ── */}
      {falState === "error" && (
        <div
          className="w-full max-w-xl backdrop-blur-xl p-10 rounded-3xl text-center"
          style={{
            backgroundColor: `${config.bgMid}66`,
            border: "1px solid rgba(220,38,38,0.2)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="font-cinzel text-xl text-red-400 mb-3">Bir Hata Oluştu</h2>
          <p className="font-inter text-sm mb-6" style={{ color: `${config.primaryColor}99` }}>
            {errorMsg}
          </p>
          <button
            onClick={resetForm}
            className="font-cinzel text-sm px-6 py-3 rounded-xl transition-all"
            style={{
              border: `1px solid ${config.primaryDark}4d`,
              color: config.primaryColor,
            }}
          >
            Tekrar Dene
          </button>
        </div>
      )}

      {/* ── FORM ── */}
      {falState === "idle" && (
        <div
          className="w-full max-w-xl backdrop-blur-xl p-6 sm:p-10 rounded-3xl"
          style={{
            backgroundColor: `${config.bgMid}66`,
            border: `1px solid ${config.primaryDark}33`,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <div className="text-center mb-8">
            <h2 className="font-cinzel text-2xl mb-2" style={{ color: config.primaryLight }}>
              {config.tagline}
            </h2>
            <p className="font-inter text-sm" style={{ color: `${config.primaryDark}cc` }}>
              Fincanınızın gizemini keşfedin.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Fotoğraf yükleme */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {photos.map((photo, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-2xl overflow-hidden group"
                  style={{ border: `1px solid ${config.primaryColor}4d` }}
                >
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
                <div
                  className="relative aspect-square rounded-2xl flex flex-col items-center justify-center transition-all group overflow-hidden"
                  style={{
                    border: `2px dashed ${config.primaryDark}4d`,
                    backgroundColor: `${config.bgMid}33`,
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLDivElement).style.borderColor = config.primaryColor)
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLDivElement).style.borderColor = `${config.primaryDark}4d`)
                  }
                >
                  <input
                    ref={fileInputRef}
                    id="coffee-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                    onChange={handlePhotoUpload}
                  />
                  <div className="flex flex-col items-center justify-center pointer-events-none">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                      style={{ backgroundColor: `${config.bgDeep}80` }}
                    >
                      <span className="text-2xl font-light" style={{ color: config.primaryColor }}>
                        +
                      </span>
                    </div>
                    <span
                      className="text-xs font-inter uppercase tracking-wider"
                      style={{ color: `${config.primaryColor}b3` }}
                    >
                      Fotoğraf
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div
              className="h-[1px] w-full"
              style={{
                background: `linear-gradient(to right, transparent, ${config.primaryDark}33, transparent)`,
              }}
            />

            {/* Form alanları */}
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block font-cinzel text-sm tracking-widest mb-2 uppercase"
                  style={{ color: config.primaryColor }}
                >
                  Adınız Soyadınız
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl px-5 py-4 font-inter focus:outline-none transition-all"
                  style={{
                    backgroundColor: `${config.bgDeep}80`,
                    border: `1px solid ${config.primaryDark}33`,
                    color: config.primaryLight,
                  }}
                  placeholder="Örn: Ayşe Yılmaz"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Cinsiyet */}
                <div className="relative">
                  <label
                    htmlFor="gender"
                    className="block font-cinzel text-sm tracking-widest mb-2 uppercase"
                    style={{ color: config.primaryColor }}
                  >
                    Cinsiyet
                  </label>
                  <select
                    id="gender"
                    required
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full rounded-xl px-5 py-4 font-inter focus:outline-none transition-all appearance-none"
                    style={{
                      backgroundColor: `${config.bgDeep}80`,
                      border: `1px solid ${config.primaryDark}33`,
                      color: config.primaryLight,
                    }}
                  >
                    <option value="" disabled>Seçiniz</option>
                    <option value="kadin">Kadın</option>
                    <option value="erkek">Erkek</option>
                    <option value="diger">Belirtmek İstemiyorum</option>
                  </select>
                  <div className="absolute right-5 top-[2.85rem] pointer-events-none">
                    <svg className="w-4 h-4" style={{ color: config.primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* İlişki Durumu */}
                <div className="relative">
                  <label
                    htmlFor="relationship"
                    className="block font-cinzel text-sm tracking-widest mb-2 uppercase"
                    style={{ color: config.primaryColor }}
                  >
                    İlişki Durumu
                  </label>
                  <select
                    id="relationship"
                    required
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    className="w-full rounded-xl px-5 py-4 font-inter focus:outline-none transition-all appearance-none"
                    style={{
                      backgroundColor: `${config.bgDeep}80`,
                      border: `1px solid ${config.primaryDark}33`,
                      color: config.primaryLight,
                    }}
                  >
                    <option value="" disabled>Seçiniz</option>
                    <option value="bekar">Bekar</option>
                    <option value="iliski">İlişkisi Var</option>
                    <option value="nisanli">Nişanlı</option>
                    <option value="evli">Evli</option>
                    <option value="karisik">Karmaşık</option>
                  </select>
                  <div className="absolute right-5 top-[2.85rem] pointer-events-none">
                    <svg className="w-4 h-4" style={{ color: config.primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full relative overflow-hidden rounded-xl font-cinzel font-bold text-lg py-5 transition-all hover:scale-[1.02] mt-8 tracking-widest"
              style={{
                background: `linear-gradient(to right, ${config.primaryDark}, ${config.primaryColor}, ${config.primaryDark})`,
                color: config.bgDeep,
                boxShadow: `0 0 0 rgba(${config.primaryColor}, 0)`,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = `0 0 30px ${config.primaryColor}4d`)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = "none")
              }
            >
              FALIMI YORUMLA
            </button>
          </form>
        </div>
      )}

      {/* Footer */}
      <div className="mt-16 text-center pb-8 opacity-60">
        <p
          className="font-cinzel text-xs tracking-widest uppercase"
          style={{ color: config.primaryColor }}
        >
          Powered by AI · {config.name}
        </p>
      </div>
    </main>
  );
}
