# Central SECOM — App da Secretaria de Comunicação

PWA (aplicativo web instalável) para a equipe da SECOM organizar agendas,
acompanhar coberturas ao vivo, gerenciar a equipe e a escala de plantão.

- 100% estático — roda no **GitHub Pages** (gratuito), sem servidor e sem login.
- Instalável na tela inicial do celular (Android e iPhone).
- Os dados são salvos **no próprio aparelho** (veja "Importante" no fim).

---

## 🚀 Como publicar no GitHub Pages (passo a passo)

> Recomendação: para evitar qualquer complicação de caminho, crie o
> repositório com o nome **`SEU-USUARIO.github.io`** (troque `SEU-USUARIO`
> pelo seu nome de usuário do GitHub). Assim o site abre direto na raiz.

### 1. Criar o repositório
1. Entre em https://github.com e clique em **New repository**.
2. Em **Repository name**, digite `SEU-USUARIO.github.io`.
3. Deixe como **Public** e clique em **Create repository**.

### 2. Enviar os arquivos do projeto
**Opção A — pelo navegador (mais fácil):**
1. Na página do repositório, clique em **uploading an existing file**.
2. Arraste **todos os arquivos e pastas desta pasta** (inclusive a pasta
   `.github`) para a área de upload.
3. Clique em **Commit changes**.

**Opção B — pelo Git (se você usa terminal):**
```bash
git init
git add .
git commit -m "Central SECOM"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-USUARIO.github.io.git
git push -u origin main
```

### 3. Ligar o GitHub Pages
1. No repositório, vá em **Settings -> Pages**.
2. Em **Build and deployment -> Source**, selecione **GitHub Actions**.
3. Pronto. O robô do GitHub vai **construir o site e gerar o index
   automaticamente** (acompanhe na aba **Actions**).

### 4. Abrir o app
Após alguns minutos, o app estará em:
```
https://SEU-USUARIO.github.io/
```
Esse link é o que você compartilha com a equipe.

> Se você usar um repositório com outro nome (ex.: `secom-app`), o app
> abrirá em `https://SEU-USUARIO.github.io/secom-app/`. O workflow já ajusta
> o caminho sozinho — mas é mais simples com o nome `.github.io`.

---

## 📱 Instalar como aplicativo (PWA)

**Android (Chrome):** abra o link -> menu **⋮** -> **Adicionar à tela inicial**.

**iPhone (Safari):** abra o link -> botão **Compartilhar** -> **Adicionar à
Tela de Início**.

Depois disso o app abre em tela cheia, com ícone próprio, como um aplicativo
normal. Não precisa de App Store nem Play Store.

---

## 🎙️ Áudio personalizado

O botão de áudio (no topo e na aba Agendas) toca o arquivo
`public/audio/abertura.mp3`. Para trocar pela gravação do chefe, basta
substituir esse arquivo por outro `.mp3` com o mesmo nome.

---

## ⚙️ Rodar no seu computador (opcional, para testar antes)
Precisa do Node.js 18+ instalado.
```bash
npm install
npm run dev      # abre em http://localhost:3000
```

---

## ❗ Importante: onde os dados ficam salvos

Como não há servidor (é tudo GitHub Pages estático), cada agenda, membro de
equipe ou escala que você cadastra fica salva **no navegador daquele
aparelho**. Isso significa:

- ✅ Perfeito para **apresentar** o app e para uso individual.
- ✅ Funciona offline e instala como aplicativo.
- ⚠️ Os dados **não sincronizam automaticamente** entre celulares
  diferentes. Cada pessoa tem a sua cópia.

Quando quiserem que **toda a equipe veja exatamente as mesmas agendas em
tempo real** (e o alerta de "nova agenda" apareça no celular de todos), o
próximo passo é ligar um banco de dados compartilhado (ex.: Firebase
Firestore) — funciona junto com o GitHub Pages, sem servidor próprio. O app
já está organizado para receber isso.
