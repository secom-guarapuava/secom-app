/** @type {import('next').NextConfig} */

// Caminho base: vazio para sites na raiz (usuario.github.io) ou
// "/nome-do-repo" para repositorios de projeto. Injetado pelo workflow.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  output: "export",          // gera site estatico (index.html) -> GitHub Pages
  reactStrictMode: true,
  trailingSlash: true,       // cada rota vira pasta/index.html (refresh funciona)
  images: { unoptimized: true },
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
