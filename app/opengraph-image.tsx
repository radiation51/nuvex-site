import { ImageResponse } from "next/og";

// Image d'aperçu quand le lien du site est partagé (WhatsApp, Facebook, Instagram…).
// Reprend le style de l'accueil : ciel bleu, fines colonnes, titre blanc, fenêtre du site.
export const alt = "NUVEX — Création de sites web en Algérie";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const N_PATH = "M17 15h8.5l13 21V15H47v34h-8.5l-13-21v21H17Z";
const COLUMNS = 13;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          overflow: "hidden",
          color: "#fff",
          background: "linear-gradient(180deg, #1f5c9c 0%, #3377b4 42%, #6aa8dd 78%, #b4d6f1 100%)",
        }}
      >
        {/* Nuages flous */}
        <div style={{ position: "absolute", top: 250, left: -160, width: 760, height: 260, borderRadius: 999, display: "flex", background: "radial-gradient(ellipse at center, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 70%)" }} />
        <div style={{ position: "absolute", top: 330, right: -200, width: 860, height: 300, borderRadius: 999, display: "flex", background: "radial-gradient(ellipse at center, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%)" }} />
        <div style={{ position: "absolute", top: 40, right: 120, width: 420, height: 150, borderRadius: 999, display: "flex", background: "radial-gradient(ellipse at center, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 70%)" }} />

        {/* Fines colonnes verticales, comme sur l'accueil */}
        <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center" }}>
          {Array.from({ length: COLUMNS }, (_, i) => (
            <div
              key={i}
              style={{
                width: 92,
                height: "100%",
                display: "flex",
                borderLeft: "1px solid rgba(255,255,255,0.13)",
                borderRight: i === COLUMNS - 1 ? "1px solid rgba(255,255,255,0.13)" : "none",
              }}
            />
          ))}
        </div>

        {/* Texte à gauche */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", padding: "64px 0 0 80px", width: 700 }}>
          {/* Logo (identique au site) */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ display: "flex", width: 84, height: 84, borderRadius: 20, background: "#fff", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px rgba(16,20,51,0.25)" }}>
              <svg width="64" height="64" viewBox="0 0 64 64">
                <path d={N_PATH} fill="#3448e8" />
              </svg>
            </div>
            <div style={{ display: "flex", fontSize: 58, fontWeight: 700, letterSpacing: -1 }}>NUVEX</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginTop: 54, fontSize: 60, lineHeight: 1.08, letterSpacing: -1.5 }}>
            <span>Votre site web pro,</span>
            <span>prêt en 7 jours.</span>
          </div>
          <div style={{ display: "flex", marginTop: 22, fontSize: 24, color: "rgba(255,255,255,0.92)", whiteSpace: "nowrap" }}>
            Dès 25 000 DA · Adapté au mobile · Devis 100 % gratuit
          </div>

          {/* Boutons arrondis, comme sur le site */}
          <div style={{ display: "flex", gap: 14, marginTop: 38 }}>
            <div style={{ display: "flex", alignItems: "center", padding: "14px 26px", borderRadius: 999, background: "#fff", color: "#101433", fontSize: 22, fontWeight: 700, whiteSpace: "nowrap", boxShadow: "0 10px 24px rgba(16,20,51,0.18)" }}>
              Demander un devis gratuit →
            </div>
            <div style={{ display: "flex", alignItems: "center", padding: "14px 24px", borderRadius: 999, background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.4)", fontSize: 22, fontWeight: 700, whiteSpace: "nowrap" }}>
              Agence web en Algérie
            </div>
          </div>
        </div>

        {/* Fenêtre du site qui monte depuis le bas, comme sur l'accueil */}
        <div
          style={{
            position: "absolute",
            right: 70,
            top: 150,
            width: 380,
            height: 560,
            display: "flex",
            flexDirection: "column",
            borderRadius: 26,
            background: "#fff",
            overflow: "hidden",
            boxShadow: "0 40px 90px rgba(10,40,90,0.45)",
            border: "1px solid rgba(255,255,255,0.6)",
          }}
        >
          {/* Barre du navigateur */}
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "14px 16px", background: "#f4f6fa", borderBottom: "1px solid #e6e9f2" }}>
            <div style={{ width: 11, height: 11, borderRadius: 99, background: "#ff5f57", display: "flex" }} />
            <div style={{ width: 11, height: 11, borderRadius: 99, background: "#febc2e", display: "flex" }} />
            <div style={{ width: 11, height: 11, borderRadius: 99, background: "#28c840", display: "flex" }} />
            <div style={{ display: "flex", marginLeft: 12, padding: "5px 12px", borderRadius: 8, background: "#fff", color: "#5b6078", fontSize: 15 }}>
              nuvex-algerie.netlify.app
            </div>
          </div>
          {/* Mini accueil du site */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "30px 26px", height: "100%", background: "linear-gradient(180deg, #2a66a0, #3377b4 55%, #7fb5e3)" }}>
            <div style={{ display: "flex", width: 200, height: 16, borderRadius: 8, background: "rgba(255,255,255,0.9)" }} />
            <div style={{ display: "flex", width: 150, height: 16, borderRadius: 8, background: "rgba(255,255,255,0.9)", marginTop: 10 }} />
            <div style={{ display: "flex", width: 220, height: 8, borderRadius: 8, background: "rgba(255,255,255,0.55)", marginTop: 18 }} />
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <div style={{ display: "flex", width: 96, height: 26, borderRadius: 99, background: "#fff" }} />
              <div style={{ display: "flex", width: 76, height: 26, borderRadius: 99, background: "rgba(255,255,255,0.25)" }} />
            </div>
            {/* Cartes d'offres */}
            <div style={{ display: "flex", gap: 10, marginTop: 34 }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: 96,
                    height: 150,
                    borderRadius: 16,
                    padding: "14px 0",
                    background: i === 1 ? "#3448e8" : "#fff",
                    boxShadow: "0 10px 24px rgba(16,20,51,0.15)",
                  }}
                >
                  <div style={{ display: "flex", width: 28, height: 28, borderRadius: 9, background: i === 1 ? "rgba(255,255,255,0.18)" : "#e8ebfd" }} />
                  <div style={{ display: "flex", width: 58, height: 9, borderRadius: 9, marginTop: 12, background: i === 1 ? "#fff" : "#101433" }} />
                  <div style={{ display: "flex", width: 44, height: 7, borderRadius: 9, marginTop: 8, background: i === 1 ? "#c6f36b" : "#c9cee0" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
