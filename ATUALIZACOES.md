# Central SECOM — o que mudou nesta rodada

## ✅ Correções pedidas

**1. Botão "+" não atrapalha mais o Assistente**
O "+" agora some nas telas de Assistente, Equipe e Plantão (onde ele não fazia sentido) e fica ancorado dentro da moldura do app. Assim ele não cobre mais o microfone nem o botão de enviar.

**2. Áudio do Assistente refeito (gravar + transcrever)**
O microfone agora:
- grava de verdade e mostra a gravação como uma mensagem com player (play/pausa + duração);
- transcreve a fala em paralelo e já responde à sua pergunta;
- mostra o estado "Ouvindo…" com cronômetro, e botões de **cancelar** e **enviar**;
- avisa quando o navegador não permite (em vez de falhar calado).

**3. Atualizar status ficou claro e com ação**
- Toda mudança de status mostra uma confirmação (aviso no topo).
- No card de cada agenda há um botão direto para avançar ("Iniciar deslocamento" → "Iniciar cobertura" → "Finalizar").
- No detalhe há botões com ícone e estado ativo, além de **Cancelar agenda** e **Reabrir**.
- A tela **Agendas** agora separa tudo em seções: **Ao vivo agora · A caminho · Agendadas · Finalizadas · Canceladas**. Ao mudar o status, a agenda migra de seção automaticamente (com animação).

## 🎨 Visual
Mantive a identidade (azul-marinho + laranja), mas com mais vida: cabeçalho com gradiente, cards com sombra e cantos mais suaves, ícones no lugar de alguns emojis, barra inferior com destaque animado na aba ativa, métricas com ícone e micro-animações. Tipografia um pouco maior, mais fácil de ler.

## 🧹 Base unificada
O projeto tinha **duas versões** do mesmo app (o Next.js em `src/` e um `index.html` avulso na raiz). Removi o `index.html`/`404.html` avulsos — agora a fonte é uma só (Next.js), que é a versão que o GitHub Pages publica. Isso evita correções em dobro e telas diferentes.

## 📱 Como testar o áudio (importante)
- O microfone só funciona em **HTTPS** (ou seja, já valendo no GitHub Pages / Firebase) e pede **permissão de microfone** — aceite quando o navegador perguntar.
- **Android/Chrome:** grava o áudio **e** transcreve automaticamente.
- **iPhone/Safari:** grava e envia o áudio normalmente, mas a transcrição automática é limitada pelo próprio sistema. A transcrição "de verdade" para todos os aparelhos vem na fase do Firebase (servidor).

## 🚀 Publicar (igual antes)
Suba a pasta para o GitHub e deixe o Pages em **Settings → Pages → Source: GitHub Actions**. O robô compila e publica sozinho. (No build do GitHub a fonte do Google carrega normalmente.)

## 💡 Sugestões para somar (quando quiser)
- **Multiusuário em tempo real (Firebase):** seu objetivo de "cada alteração valer para todos". É a evolução natural — dá para abstrair os dados agora para facilitar essa migração.
- **Compartilhar a agenda do dia no WhatsApp** com 1 toque (ótimo para a equipe).
- **Notificação "começa em 15 min"** (vocês já têm os áudios nomeados para isso).
- **Busca** por agenda e **filtro por data** (hoje tudo aparece junto).
- **Transcrição automática de áudio** para todos os aparelhos (via servidor/Firebase).
