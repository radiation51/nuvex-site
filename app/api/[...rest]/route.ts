// Adresse d'API qui n'existe pas : réponse JSON claire (au lieu d'une page HTML 404).
const notFound = () => Response.json({ error: "Adresse d'API introuvable." }, { status: 404 });

export { notFound as GET, notFound as POST, notFound as PUT, notFound as PATCH, notFound as DELETE };
