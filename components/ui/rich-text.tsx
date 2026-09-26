import * as React from "react";

/** Affiche un texte où « **mot** » est mis en gras (textes traduits et page légale). */
export function RichText({ text, strongClassName = "text-foreground" }: { text: string; strongClassName?: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className={strongClassName}>
            {part.slice(2, -2)}
          </strong>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}
