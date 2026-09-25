import { Loader } from "@/components/ui/loader";

/** Affiché pendant le chargement d'une page du site. */
export default function PageLoading() {
  return (
    <main className="grid min-h-screen place-items-center bg-background p-6">
      <Loader title="NUVEX" messages={["Chargement de la page…", "Encore un instant…"]} />
    </main>
  );
}
