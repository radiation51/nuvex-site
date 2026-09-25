import { Loader } from "@/components/ui/loader";

/** Affiché pendant l'ouverture de l'espace admin. */
export default function AdminLoading() {
  return (
    <main className="grid min-h-screen place-items-center bg-muted/40 p-6">
      <Loader secure title="Espace admin" messages={["Ouverture de votre espace…", "Chargement de vos données…", "Encore un instant…"]} />
    </main>
  );
}
