// Caminho base para funcionar tanto na raiz (usuario.github.io) quanto
// em repositorio de projeto (usuario.github.io/repo). Injetado no build.
export const BP = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const asset = (p: string) => `${BP}${p.startsWith("/") ? p : "/" + p}`;
