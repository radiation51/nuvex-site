import { ImageResponse } from "next/og";

// Image d'aperçu quand le lien du site est partagé (WhatsApp, Facebook, Instagram…).
export const alt = "NUVEX — Création de sites web en Algérie";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const N_PATH = "M17 15h8.5l13 21V15H47v34h-8.5l-13-21v21H17Z";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 90px",
          color: "#fff",
          background: "linear-gradient(135deg, #1f5c9c 0%, #3448e8 55%, #2a2fb0 100%)",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div style={{ display: "flex", width: 120, height: 120, borderRadius: 28, background: "#fff", alignItems: "center", justifyContent: "center" }}>
            <svg width="92" height="92" viewBox="0 0 64 64">
              <path d={N_PATH} fill="#3448e8" />
            </svg>
          </div>
          <div style={{ display: "flex", fontSize: 88, fontWeight: 800, letterSpacing: -2 }}>NUVEX</div>
        </div>

        <div style={{ display: "flex", marginTop: 56, fontSize: 60, fontWeight: 700, lineHeight: 1.1 }}>
          Votre site web pro, prêt en 7 jours.
        </div>
        <div style={{ display: "flex", marginTop: 24, fontSize: 34, color: "rgba(255,255,255,0.85)" }}>
          Dès 25 000 DA · Adapté au mobile · Devis 100 % gratuit
        </div>

        <div style={{ display: "flex", marginTop: 48 }}>
          <div style={{ display: "flex", padding: "12px 26px", borderRadius: 999, background: "#c6f36b", color: "#101433", fontSize: 28, fontWeight: 700 }}>
            Agence web en Algérie
          </div>
        </div>
      </div>
    ),
    size
  );
}
