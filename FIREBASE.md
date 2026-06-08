# Firebase configurado — projeto `secom-app`

O app já está conectado ao Firebase pelo arquivo `src/lib/firebaseConfig.ts`.
A configuração usada é a do projeto `secom-app`, com Firestore para sincronizar os dados entre todos os celulares/computadores que abrirem o mesmo link.

Importante: o código de configuração web do Firebase não publica o app sozinho. Ele apenas conecta o app ao projeto Firebase. Para o app ficar online em uma “nuvem”, você ainda precisa publicar pelo Firebase Hosting ou pelo GitHub Pages.

## O que já foi feito neste projeto

- Firebase App inicializado.
- Firestore conectado.
- Login anônimo preparado.
- Analytics iniciado de forma segura no navegador.
- Configuração de Firebase Hosting adicionada:
  - `firebase.json`
  - `.firebaserc`
  - script `npm run deploy:firebase`

## 1. Ativar login anônimo

No Firebase Console:

1. Entre no projeto `secom-app`.
2. Vá em **Authentication**.
3. Clique em **Get started / Vamos começar**, se ainda não estiver ativo.
4. Vá em **Sign-in method / Método de login**.
5. Ative o provedor **Anonymous / Anônimo**.
6. Salve.

O app usa esse login anônimo automaticamente. Não aparece tela de login para o usuário.

## 2. Criar o Firestore Database

No Firebase Console:

1. Vá em **Firestore Database**.
2. Clique em **Create database / Criar banco de dados**.
3. Escolha **Production mode / modo de produção**.
4. Escolha a região **southamerica-east1 (São Paulo)**, se estiver disponível.
5. Crie o banco.

## 3. Publicar as regras do Firestore

Dentro do Firestore, abra a aba **Rules / Regras**, apague o conteúdo atual e cole isto:

```txt
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /secom/{documento} {
      allow read, write: if request.auth != null;
    }

    match /notificationTokens/{token} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Depois clique em **Publish / Publicar**.

Essas regras permitem leitura e gravação apenas para sessões autenticadas. Como o app faz autenticação anônima automática, os usuários conseguem usar sem senha, mas acessos totalmente não autenticados são bloqueados.

## 4. Publicar pelo Firebase Hosting

No terminal, dentro da pasta do projeto:

```bash
npm install
npm run firebase:login
npm run deploy:firebase
```

No final, o Firebase vai mostrar o link público do app. Normalmente será algo parecido com:

```txt
https://secom-app.web.app
```

Esse é o link que você compartilha com a equipe.

## 5. Como testar a sincronização

Abra o app em dois lugares ao mesmo tempo: por exemplo, uma aba no computador e outra no celular. Crie ou altere uma agenda em um deles. Em alguns segundos, a mudança deve aparecer no outro.

## Observação importante

Com login anônimo, qualquer pessoa que tiver o link do app pode acessar e editar. Para teste e uso interno simples, funciona. Para uma versão mais controlada, o próximo passo é criar login por e-mail/senha ou restringir o acesso por usuários autorizados.
