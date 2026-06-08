# Firebase configurado — próximos passos

O arquivo `src/lib/firebaseConfig.ts` já está preenchido com o projeto `central-secom`.

Agora falta apenas configurar o Console do Firebase para permitir que o app leia e grave os dados.

## 1. Ativar login anônimo

No Firebase Console:

1. Entre no projeto `central-secom`.
2. Vá em **Authentication**.
3. Clique em **Get started** / **Vamos começar**, se ainda não estiver ativo.
4. Vá em **Sign-in method**.
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
  }
}
```

Depois clique em **Publish / Publicar**.

Essas regras permitem leitura e gravação apenas para sessões autenticadas. Como o app faz autenticação anônima automática, os usuários conseguem usar sem senha, mas acessos totalmente não autenticados são bloqueados.

## 4. Subir no GitHub

Depois de configurar Authentication e Firestore, suba este projeto atualizado no GitHub, substituindo os arquivos atuais.

A Action vai rodar de novo. Quando ficar verde, abra o link do GitHub Pages e teste em duas abas ou dois aparelhos.

## 5. Como testar

Abra o app em dois lugares ao mesmo tempo. Crie ou altere uma agenda em um deles. Em alguns segundos, a mudança deve aparecer no outro.

## Observação importante

Com login anônimo, qualquer pessoa que tiver o link do app pode acessar e editar. Para teste e uso interno simples funciona. Para uma versão mais controlada, o próximo passo é criar login por e-mail/senha ou restringir o acesso por usuários autorizados.
