# Central SECOM — App da Secretaria de Comunicação

PWA instalável para a equipe da SECOM organizar agendas, acompanhar coberturas ao vivo, gerenciar a equipe e a escala de plantão.

Esta versão já está conectada ao Firebase do projeto `secom-app`, para que os dados fiquem sincronizados em nuvem entre todos que acessarem o mesmo link.

## O que o app faz

- Funciona como site/app instalável no celular.
- Salva agendas, equipe e escala de plantão.
- Sincroniza os dados com Firebase Firestore.
- Pode ser publicado no Firebase Hosting.
- Também pode rodar em GitHub Pages, se preferir.

## Publicar no Firebase Hosting

Antes de publicar, no Firebase Console do projeto `secom-app`, ative:

1. **Authentication > Sign-in method > Anonymous**.
2. **Firestore Database**.
3. As regras indicadas no arquivo `FIREBASE.md` ou `REGRAS-FIRESTORE.txt`.

Depois, no terminal, dentro da pasta do projeto:

```bash
npm install
npm run firebase:login
npm run deploy:firebase
```

Ao final, o Firebase vai mostrar o link público do app, normalmente parecido com:

```txt
https://secom-app.web.app
```

Esse link pode ser compartilhado com a equipe.

## Rodar no computador antes de publicar

Precisa do Node.js 18+ instalado.

```bash
npm install
npm run dev
```

Depois abra:

```txt
http://localhost:3000
```

## Instalar como aplicativo no celular

Android, pelo Chrome: abra o link, toque no menu de três pontos e escolha **Adicionar à tela inicial**.

 iPhone, pelo Safari: abra o link, toque em **Compartilhar** e escolha **Adicionar à Tela de Início**.

## Áudio personalizado

O botão de áudio toca o arquivo `public/audio/abertura.mp3`. Para trocar a gravação, substitua esse arquivo por outro `.mp3` com o mesmo nome.

## Segurança

A chave web do Firebase fica no front-end e é pública por natureza. A proteção real está nas regras do Firestore. A regra recomendada neste projeto exige usuário autenticado, e o app faz autenticação anônima automaticamente.

Com esse modelo, qualquer pessoa com o link consegue acessar e editar. Para uso restrito, será necessário implementar login por e-mail/senha ou autorização por lista de usuários.
