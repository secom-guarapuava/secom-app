# Publicar no GitHub Pages

Este projeto é Next.js, então ele não tem um `index.html` pronto na raiz. O `index.html` é gerado automaticamente quando o GitHub Actions roda o build.

## Como subir

1. Suba este projeto completo no repositório do GitHub.
2. No GitHub, entre em **Settings > Pages**.
3. Em **Source**, deixe **GitHub Actions**.
4. Faça commit/push na branch `main`.
5. Entre na aba **Actions** e aguarde o workflow **Deploy Next.js to GitHub Pages** terminar.
6. Quando terminar, o link aparece em **Settings > Pages**.

## O que já foi configurado

- `next.config.mjs` já está com `output: "export"`, que gera a pasta `out`.
- `.github/workflows/deploy.yml` faz o build e publica a pasta `out` no GitHub Pages.
- O workflow detecta automaticamente o nome do repositório e aplica o caminho correto, por exemplo `/central-comunicacao`.
- `.nojekyll` é criado para o GitHub Pages não bloquear arquivos internos do Next.

## Firebase depois

O projeto já tem Firebase preparado em `src/lib/firebaseConfig.ts`. Depois que o GitHub Pages estiver funcionando, basta preencher esse arquivo com as chaves do Firebase e fazer novo commit/push. O GitHub Actions vai publicar novamente.


## OBSERVAÇÃO FIREBASE

Esta versão também pode ser publicada pelo Firebase Hosting. Para isso, use as instruções do arquivo `FIREBASE.md`. O GitHub Pages continua funcionando como hospedagem estática, mas o Firebase Hosting é o caminho mais direto para usar o projeto `secom-app`.
