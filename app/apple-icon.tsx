import { ImageResponse } from "next/og";

// Icône utilisée quand le site est ajouté à l'écran d'accueil d'un iPhone.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#3448e8" }}>
        <svg width="120" height="120" viewBox="0 0 64 64">
          <path d="M17 15h8.5l13 21V15H47v34h-8.5l-13-21v21H17Z" fill="#fff" />
        </svg>
      </div>
    ),
    size
  );
}
