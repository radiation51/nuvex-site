/** Remplace les « {clé} » d'un texte : fill("dès {price}", { price: "25 000 DA" }). */
export function fill(text: string, values: Record<string, string | number>) {
  return text.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}
