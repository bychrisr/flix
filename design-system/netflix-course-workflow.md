# 🎬 WORKFLOW ANTIGRAVITY - PLATAFORMA DE CURSOS ESTILO NETFLIX

## 📋 VISÃO GERAL DO SISTEMA

Sistema de lançamento de cursos digitais com interface inspirada na Netflix, incluindo controle de liberação de aulas por data, player de vídeo protegido, geração automática de logos com IA e área administrativa completa.

---

## 🗄️ ESTRUTURA DO BANCO DE DADOS

### Tabela: **admins**
- id (PK)
- username (unique)
- password (hash bcrypt)
- email
- created_at

### Tabela: **eventos**
- id (PK)
- nome_evento
- descricao_top1 (texto curto hero)
- descricao_completa (texto longo)
- video_capa_url (URL do vídeo de fundo)
- logo_url (gerada pelo Gemini)
- nome_logo (ex: ELEITOFLIX)
- config_estilo (JSON: {fonte, cor, tamanho})
- slug (unique, para URLs amigáveis)
- ativo (boolean)
- created_at

### Tabela: **aulas**
- id (PK)
- evento_id (FK → eventos)
- ordem (1, 2, 3...)
- nome_aula
- descricao_aula
- data_liberacao (datetime)
- data_limite_acesso (datetime)
- video_url (link YouTube/Vimeo/etc)
- thumbnail_url
- duracao_minutos
- visualizacoes (contador)
- created_at

### Tabela: **materiais_apoio**
- id (PK)
- aula_id (FK → aulas)
- nome_arquivo
- tipo_arquivo (pdf, docx, xlsx, etc)
- url_arquivo
- tamanho_bytes
- created_at

### Tabela: **quizzes**
- id (PK)
- aula_id (FK → aulas)
- titulo
- descricao
- pontuacao_minima
- created_at

### Tabela: **quiz_perguntas**
- id (PK)
- quiz_id (FK → quizzes)
- ordem
- pergunta (texto)
- tipo (multipla_escolha, verdadeiro_falso)

### Tabela: **quiz_opcoes**
- id (PK)
- pergunta_id (FK → quiz_perguntas)
- texto_opcao
- correta (boolean)
- ordem

### Tabela: **usuarios** (opcional, para tracking)
- id (PK)
- email
- nome
- progresso (JSON com aulas assistidas)
- created_at

---

## 🎯 FLUXO 1: AUTENTICAÇÃO ADMINISTRATIVA

### 1.1 Tela de Login Admin
**Rota:** `/admin/login`

**Elementos da Página:**
- Logo do sistema
- Formulário de login (username + password)
- Botão "Entrar"
- Mensagens de erro (caso credenciais inválidas)

**Validações:**
- Campo username: obrigatório, min 3 caracteres
- Campo password: obrigatório, min 6 caracteres
- Verificar hash no banco
- Criar sessão/JWT após sucesso

**Ações Antigravity:**
```
TRIGGER: Clique no botão "Entrar"
ACTION: POST /api/admin/login
BODY: {username, password}
RESPONSE SUCCESS: Redirecionar para /admin/dashboard
RESPONSE ERROR: Exibir mensagem de erro
```

---

## 🎯 FLUXO 2: DASHBOARD ADMINISTRATIVO

### 2.1 Painel Principal
**Rota:** `/admin/dashboard`

**Proteção:** Verificar autenticação (middleware)

**Elementos da Página:**
- Header com logo e botão "Sair"
- Menu lateral:
  - 📊 Dashboard
  - 🎬 Eventos
  - 📚 Aulas
  - 📝 Quizzes
  - 👥 Usuários (opcional)

**Cards de Métricas:**
- Total de eventos
- Total de aulas
- Aulas liberadas hoje
- Usuários ativos (se implementado)

---

## 🎯 FLUXO 3: CADASTRO DE EVENTO

### 3.1 Listagem de Eventos
**Rota:** `/admin/eventos`

**Elementos:**
- Botão "+ Novo Evento"
- Tabela com eventos cadastrados:
  - Nome
  - Status (Ativo/Inativo)
  - Nº de Aulas
  - Data Criação
  - Ações (Editar, Ver, Deletar)

**Ações Antigravity:**
```
TRIGGER: Carregar página
ACTION: GET /api/eventos
RESPONSE: Renderizar lista
```

### 3.2 Formulário de Criação/Edição de Evento
**Rota:** `/admin/eventos/novo` ou `/admin/eventos/:id/editar`

**SEÇÃO 1: Informações Básicas**
- Campo: Nome do Evento (text, required)
- Campo: Slug (auto-gerado, editável)
- Campo: Descrição Top 1 (textarea, max 200 chars)
- Campo: Descrição Completa (textarea rich text)

**SEÇÃO 2: Geração de Logo com Gemini**
- Campo: Nome para Logo (ex: ELEITOFLIX)
- Botão: "🤖 Gerar Logo com IA"
- Preview da logo gerada
- Botão: "Regenerar" (caso não goste)

**Ações Antigravity - Geração de Logo:**
```
TRIGGER: Clique em "Gerar Logo com IA"
ACTION: POST /api/gemini/generate-logo
BODY: {nome_logo: "ELEITOFLIX", estilo: "netflix"}
PROCESSO BACKEND:
  1. Chamar API Gemini com prompt:
     "Create a Netflix-style logo with the text '[NOME]FLIX' 
      using bold red letters on transparent background, 
      high quality, PNG format"
  2. Receber imagem base64
  3. Converter e salvar em /uploads/logos/
  4. Retornar URL
RESPONSE: {logo_url: "/uploads/logos/eleitoflix_123.png"}
UPDATE: Exibir preview e salvar URL no campo
```

**SEÇÃO 3: Customização Visual do Nome do Evento**
- Select: Fonte Google (Roboto, Montserrat, Bebas Neue, Oswald, etc)
- Color Picker: Cor do texto (com input HEX manual)
- Slider: Tamanho da fonte (24px - 120px)
- **LIVE PREVIEW:** Card mostrando como ficaria na tela hero

**Estrutura do Preview:**
```html
<div style="
  background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), 
  url([video_thumbnail]); 
  background-size: cover;
  padding: 40px;
  border-radius: 8px;
">
  <h1 style="
    font-family: [fonte_selecionada];
    color: [cor_selecionada];
    font-size: [tamanho_selecionado]px;
  ">
    [NOME_DO_EVENTO]
  </h1>
</div>
```

**SEÇÃO 4: Vídeo de Capa**
- Upload de vídeo OU URL de vídeo (YouTube, Vimeo)
- Preview do vídeo
- Opção: Extrair thumbnail automaticamente

**Botões de Ação:**
- "💾 Salvar Evento"
- "👁️ Pré-visualizar"
- "❌ Cancelar"

**Ações Antigravity - Salvar Evento:**
```
TRIGGER: Clique em "Salvar Evento"
VALIDATION: Validar todos os campos obrigatórios
ACTION: POST /api/eventos (ou PUT /api/eventos/:id)
BODY: {
  nome_evento,
  descricao_top1,
  descricao_completa,
  video_capa_url,
  logo_url,
  nome_logo,
  config_estilo: {fonte, cor, tamanho},
  slug,
  ativo
}
RESPONSE SUCCESS: 
  - Mostrar toast "Evento salvo com sucesso!"
  - Redirecionar para /admin/eventos
RESPONSE ERROR: Exibir erros de validação
```

---

## 🎯 FLUXO 4: CADASTRO DE AULAS

### 4.1 Listagem de Aulas
**Rota:** `/admin/aulas`

**Filtros:**
- Select: Filtrar por evento
- Input: Buscar por nome

**Tabela:**
- Evento
- Ordem
- Nome da Aula
- Data Liberação
- Status (Liberada/Bloqueada/Expirada)
- Ações (Editar, Deletar)

### 4.2 Formulário de Criação/Edição de Aula
**Rota:** `/admin/aulas/novo` ou `/admin/aulas/:id/editar`

**Campos do Formulário:**

1. **Select: Evento** (required, lista eventos cadastrados)

2. **Number: Ordem da Aula** (1, 2, 3... - auto-sugerido)

3. **Text: Nome da Aula** (required, max 200 chars)

4. **Textarea: Descrição da Aula** (rich text editor)

5. **DateTime: Data de Liberação** (required)
   - Calendário + hora
   - Validação: não pode ser no passado

6. **DateTime: Data Limite de Acesso** (optional)
   - Se preenchida: usuário só pode assistir até essa data
   - Se vazia: acesso ilimitado após liberação

7. **Text: Link do Vídeo** (required)
   - Aceitar URLs: YouTube, Vimeo, Wistia, Panda Video, etc
   - Validação automática do formato
   - Preview do vídeo

8. **Upload: Thumbnail** (optional, auto-extrair se vazio)

9. **Upload: Materiais de Apoio** (múltiplos arquivos)
   - Aceitar: PDF, DOCX, XLSX, PPTX, ZIP, etc
   - Preview de cada arquivo
   - Botão para remover individualmente
   - Lista com:
     - Nome do arquivo
     - Tipo
     - Tamanho

**Ações Antigravity - Salvar Aula:**
```
TRIGGER: Clique em "Salvar Aula"
VALIDATION: 
  - Evento selecionado
  - Nome preenchido
  - Data liberação válida
  - Link de vídeo válido
ACTION: POST /api/aulas (ou PUT /api/aulas/:id)
BODY: FormData com todos os campos + arquivos
PROCESSO BACKEND:
  1. Fazer upload dos materiais de apoio
  2. Validar e parsear URL do vídeo
  3. Salvar aula no banco
  4. Salvar materiais_apoio na tabela relacionada
RESPONSE SUCCESS: Redirecionar para /admin/aulas
```

---

## 🎯 FLUXO 5: CADASTRO DE QUIZ

### 5.1 Listagem de Quizzes
**Rota:** `/admin/quizzes`

**Tabela:**
- Aula vinculada
- Título do Quiz
- Nº de Perguntas
- Pontuação Mínima
- Ações (Editar, Deletar, Ver Respostas)

### 5.2 Formulário de Quiz
**Rota:** `/admin/quizzes/novo` ou `/admin/quizzes/:id/editar`

**Estrutura:**

**SEÇÃO: Informações do Quiz**
- Select: Aula vinculada (required)
- Text: Título do Quiz
- Textarea: Descrição
- Number: Pontuação mínima para aprovação (0-100)

**SEÇÃO: Perguntas (dinâmica)**
- Botão "+ Adicionar Pergunta"
- Para cada pergunta:
  - Número da pergunta
  - Textarea: Texto da pergunta
  - Select: Tipo (Múltipla Escolha, Verdadeiro/Falso)
  - **Opções de resposta:**
    - Botão "+ Adicionar Opção"
    - Para cada opção:
      - Input: Texto da opção
      - Checkbox: Esta é a resposta correta
      - Botão remover opção
  - Botão remover pergunta

**Ações Antigravity - Salvar Quiz:**
```
TRIGGER: Clique em "Salvar Quiz"
VALIDATION: 
  - Pelo menos 1 pergunta
  - Cada pergunta tem pelo menos 2 opções
  - Cada pergunta tem 1 resposta correta marcada
ACTION: POST /api/quizzes
BODY: {
  aula_id,
  titulo,
  descricao,
  pontuacao_minima,
  perguntas: [
    {
      ordem: 1,
      pergunta: "texto",
      tipo: "multipla_escolha",
      opcoes: [
        {texto: "Opção A", correta: true},
        {texto: "Opção B", correta: false}
      ]
    }
  ]
}
PROCESSO BACKEND:
  1. Criar quiz
  2. Criar perguntas vinculadas
  3. Criar opções vinculadas
RESPONSE SUCCESS: Redirecionar para /admin/quizzes
```

---

## 🎯 FLUXO 6: ÁREA DO USUÁRIO - CATÁLOGO NETFLIX

### 6.1 Hero Section (Tela Principal)
**Rota:** `/` ou `/eventos/:slug`

**Elementos da Página:**

**HEADER:**
- Logo gerada pelo Gemini (canto superior esquerdo)
- Menu: Início | Comentários | Materiais de Apoio | Quiz
- Ícones: Notificações | Perfil

**HERO SECTION (Fullscreen):**
- Vídeo de fundo (do evento) em autoplay muted loop
- Overlay gradient (preto transparente)
- Conteúdo sobre o vídeo:
  - Tag: "JORNADA" ou categoria
  - Título do Evento (com estilo customizado)
  - Descrição Top 1
  - Descrição completa (primeiras 3 linhas)
  - Botão primário: "▶ ASSISTIR"
  - Botão secundário: "ℹ Mais Informações"
  - Badge: Data/Status da primeira aula

**LÓGICA DE COUNTDOWN:**
```javascript
if (primeira_aula.data_liberacao > now) {
  // Exibir countdown
  mostrar_countdown({
    titulo: "Primeira aula liberada em:",
    data_alvo: primeira_aula.data_liberacao,
    formato: "X dias Y horas Z minutos"
  });
  desabilitar_botao_assistir();
} else if (primeira_aula.data_liberacao <= now) {
  // Aula liberada
  habilitar_botao_assistir();
}
```

**SEÇÃO DE AULAS (Estilo Netflix):**
- Título: "Aulas do Evento" ou "Episódios"
- Carrossel horizontal de cards de aulas
- Cada card contém:
  - Thumbnail da aula
  - Badge "AULA X" (canto superior esquerdo)
  - Duração (canto inferior direito)
  - Título da aula
  - Hover: 
    - Escala aumenta (transform: scale(1.1))
    - Aparece overlay com:
      - Botão play
      - Título
      - Breve descrição
      - Badge de status (Liberada/Bloqueada/Expirada)

**LÓGICA DE BLOQUEIO DE AULAS:**
```javascript
para cada aula:
  if (aula.data_liberacao > now) {
    status = "BLOQUEADA";
    mostrar_cadeado_no_card();
    desabilitar_click();
    mostrar_tooltip("Liberada em: [data]");
  } else if (aula.data_limite_acesso && aula.data_limite_acesso < now) {
    status = "EXPIRADA";
    mostrar_overlay_escuro();
    desabilitar_click();
    mostrar_tooltip("Acesso expirado");
  } else {
    status = "LIBERADA";
    habilitar_click();
  }
```

**Ações Antigravity - Carregar Catálogo:**
```
TRIGGER: Carregar página
ACTION: GET /api/eventos/:slug/completo
RESPONSE: {
  evento: {...},
  aulas: [...],
  config_estilo: {...}
}
RENDERIZAR:
  1. Aplicar estilos customizados (fonte, cor, tamanho)
  2. Iniciar vídeo de fundo
  3. Renderizar cards de aulas com status correto
  4. Iniciar countdown se necessário
```

### 6.2 Responsividade Mobile
**Breakpoints:**
- Desktop: >= 1024px (layout original Netflix)
- Tablet: 768px - 1023px (ajustar grid)
- Mobile: < 768px
  - Hero menor (60vh)
  - Título menor
  - Botões empilhados
  - Carrossel vertical de aulas
  - Cards maiores e mais espaçados

---

## 🎯 FLUXO 7: PÁGINA DA AULA

### 7.1 Player de Vídeo
**Rota:** `/aulas/:id` ou `/eventos/:slug/aulas/:ordem`

**Verificações antes de renderizar:**
```javascript
VALIDAR:
  1. Aula está liberada? (data_liberacao <= now)
  2. Aula não expirou? (data_limite_acesso > now ou null)
  3. Se não: Redirecionar para catálogo com mensagem

SE VÁLIDO: Renderizar página
```

**Layout da Página:**

**SEÇÃO DO PLAYER (16:9 responsive):**
- Player de vídeo (iframe embutido)
- Controles nativos do player
- IMPORTANTE: Usar técnicas anti-scraping:
  - Iframe sandbox
  - CSP headers
  - Referrer policy
  - Desabilitar right-click no player
  - Overlay invisível sobre o player (pointer-events: none no vídeo)

**Integração de Players:**
```javascript
function renderPlayer(url) {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return <iframe src={getYoutubeEmbedUrl(url)} />;
  } else if (url.includes('vimeo.com')) {
    return <iframe src={getVimeoEmbedUrl(url)} />;
  } else if (url.includes('wistia.com')) {
    return <iframe src={getWistiaEmbedUrl(url)} />;
  }
  // ... outros players
}
```

**SEÇÃO DE INFORMAÇÕES:**
- Título da aula (h1)
- Badge: AULA X
- Duração
- Data de liberação
- Descrição completa da aula (rich text)

**SEÇÃO DE NAVEGAÇÃO:**
- Botão: "⬅ Aula Anterior" (se existir)
- Botão: "Aula Seguinte ➡" (se liberada)
- Botão: "📚 Materiais de Apoio"
- Botão: "📝 Fazer Quiz" (se existir)

**SEÇÃO DE PROGRESSO:**
- Barra de progresso das aulas do evento
- "Você completou X de Y aulas"

**Ações Antigravity - Tracking:**
```
TRIGGER: Usuário assiste 80% do vídeo
ACTION: POST /api/progresso
BODY: {aula_id, usuario_id, percentual_assistido: 80}
UPDATE: Marcar aula como concluída
```

---

## 🎯 FLUXO 8: MATERIAIS DE APOIO

### 8.1 Listagem de Materiais
**Rota:** `/aulas/:id/materiais` ou menu "Materiais de Apoio"

**Layout:**
- Breadcrumb: Evento > Aula X > Materiais
- Título: "Materiais de Apoio - [Nome da Aula]"
- Grid de cards de materiais:
  - Ícone do tipo de arquivo (PDF, DOCX, etc)
  - Nome do arquivo
  - Tamanho
  - Botão "⬇ Download"

**Ações Antigravity:**
```
TRIGGER: Clique em Download
VALIDATION: Usuário tem acesso à aula?
ACTION: GET /api/materiais/:id/download
RESPONSE: Stream do arquivo ou redirect para URL assinada
```

### 8.2 Página Global de Materiais
**Rota:** `/materiais` (menu principal)

**Listagem agrupada por aula:**
- Accordion para cada aula
- Dentro: lista de materiais
- Filtros: Por evento, por tipo de arquivo

---

## 🎯 FLUXO 9: QUIZ DO USUÁRIO

### 9.1 Página do Quiz
**Rota:** `/aulas/:id/quiz`

**Verificação:**
- Usuário já fez o quiz? Mostrar resultado anterior
- Quiz tem limite de tentativas? Verificar

**Layout:**

**HEADER:**
- Título do Quiz
- Descrição
- Pontuação mínima para aprovação
- Tempo limite (se houver)

**CORPO:**
- Renderizar perguntas uma por vez OU todas de uma vez (configurável)
- Para cada pergunta:
  - Número da pergunta
  - Texto da pergunta
  - Opções de resposta (radio buttons ou checkboxes)
- Botão: "Enviar Respostas"

**Ações Antigravity - Submeter Quiz:**
```
TRIGGER: Clique em "Enviar Respostas"
VALIDATION: Todas as perguntas respondidas?
ACTION: POST /api/quizzes/:id/submeter
BODY: {
  usuario_id,
  respostas: [
    {pergunta_id: 1, opcao_id: 3},
    {pergunta_id: 2, opcao_id: 7}
  ]
}
PROCESSO BACKEND:
  1. Comparar com respostas corretas
  2. Calcular pontuação (% de acertos)
  3. Determinar aprovação
  4. Salvar resultado
RESPONSE: {
  pontuacao: 80,
  total_perguntas: 10,
  acertos: 8,
  aprovado: true,
  respostas_detalhadas: [...]
}
RENDERIZAR: Página de resultado
```

### 9.2 Página de Resultado do Quiz
**Elementos:**
- Badge grande: "APROVADO ✓" ou "REPROVADO ✗"
- Pontuação obtida vs mínima
- Número de acertos
- Revisão pergunta por pergunta:
  - Sua resposta
  - Resposta correta
  - Feedback (se configurado)
- Botões:
  - "Refazer Quiz" (se permitido)
  - "Voltar para Aula"
  - "Próxima Aula"

---

## 🎯 FLUXO 10: MELHORIAS E FUNCIONALIDADES EXTRAS

### 10.1 Sistema de Comentários (similar ao da imagem)
**Rota:** `/eventos/:slug` (seção na página)

**Elementos:**
- Título: "0 comentários"
- Textarea: "Adicione um comentário..."
- Plugin de comentários do Facebook (como na imagem)
- Ordenação: Mais antigos / Mais recentes

### 10.2 Integração com Telegram/YouTube/Instagram
**Seção lateral ou footer:**
- Card: "Junte-se ao Telegram"
  - Descrição
  - Botão "ACESSE O TELEGRAM"
- Card: "Inscreva-se no YouTube"
  - Descrição
  - Botão "INSCREVA-SE NO CANAL"
- Card: "Siga no Instagram"
  - Descrição
  - Botão "SIGA NO INSTAGRAM"

### 10.3 Notificações
**Implementar sistema de notificações:**
- Nova aula liberada
- Quiz disponível
- Novo material de apoio
- Badge no ícone do header

### 10.4 Busca
**Barra de busca global:**
- Buscar por: aulas, materiais, quizzes
- Resultados agrupados por tipo

### 10.5 Modo Teatro/Fullscreen
**No player de vídeo:**
- Botão para modo teatro (player ocupa mais espaço)
- Botão fullscreen nativo

### 10.6 Download em Lote
**Página de materiais:**
- Checkbox para selecionar múltiplos
- Botão "Download Selecionados" (gera ZIP)

### 10.7 Certificado de Conclusão
**Ao completar todas as aulas + quizzes:**
- Gerar certificado PDF
- Personalizado com nome do usuário
- Assinatura digital

---

## 🎨 GUIA DE ESTILO (Netflix-like)

### Paleta de Cores
- **Primária:** #E50914 (vermelho Netflix)
- **Background:** #141414 (preto Netflix)
- **Background cards:** #2F2F2F
- **Texto principal:** #FFFFFF
- **Texto secundário:** #B3B3B3
- **Hover:** #F40612

### Tipografia
- **Títulos:** Netflix Sans ou Bebas Neue (bold, uppercase)
- **Corpo:** Helvetica, Arial, sans-serif
- **Tamanhos:**
  - Hero title: 48-72px (desktop), 32-48px (mobile)
  - Card title: 18-24px
  - Body: 14-16px

### Animações
- Transições suaves: 0.3s ease
- Hover nos cards: transform scale(1.05)
- Fade in ao carregar: opacity 0 to 1
- Carrossel: scroll suave com inércia

### Componentes Reutilizáveis
1. **Button Primary**
   - Background: #E50914
   - Padding: 12px 32px
   - Border-radius: 4px
   - Font-weight: bold
   - Hover: background lighten 10%

2. **Button Secondary**
   - Background: rgba(255, 255, 255, 0.3)
   - Backdrop-filter: blur(10px)

3. **Card de Aula**
   - Aspect ratio: 16:9
   - Border-radius: 8px
   - Box-shadow: 0 4px 12px rgba(0,0,0,0.5)
   - Hover: shadow aumenta

4. **Badge de Status**
   - Liberada: verde (#46D369)
   - Bloqueada: cinza (#6E6E6E)
   - Expirada: vermelho (#E50914)

---

## 🔧 TECNOLOGIAS RECOMENDADAS

### Frontend
- **Framework:** React.js ou Next.js
- **Estilização:** Tailwind CSS + CSS Modules
- **Player:** react-player (suporta múltiplos players)
- **Carrossel:** Swiper.js ou Keen Slider
- **Formulários:** React Hook Form + Zod
- **State:** Zustand ou Context API
- **Requisições:** Axios ou Fetch API

### Backend
- **API:** Node.js + Express ou FastAPI (Python)
- **ORM:** Prisma ou TypeORM
- **Banco:** PostgreSQL ou MySQL
- **Storage:** AWS S3 ou Cloudflare R2
- **Auth:** JWT + bcrypt

### IA
- **Gemini API:** Google Generative AI SDK
- **Geração de imagens:** Gemini Pro Vision

### DevOps
- **Hosting:** Vercel (frontend) + Railway (backend)
- **CDN:** Cloudflare
- **CI/CD:** GitHub Actions

---

## 📱 CHECKLIST DE RESPONSIVIDADE

### Desktop (>= 1024px)
- [ ] Hero fullscreen com vídeo
- [ ] Carrossel horizontal de 4-5 cards
- [ ] Menu completo no header
- [ ] Player 16:9 centralizado

### Tablet (768px - 1023px)
- [ ] Hero 70vh
- [ ] Carrossel de 2-3 cards
- [ ] Menu colapsável (hamburger)
- [ ] Player responsivo

### Mobile (< 768px)
- [ ] Hero 60vh
- [ ] Título menor (32-40px)
- [ ] Botões empilhados verticalmente
- [ ] Carrossel vertical de 1 card
- [ ] Menu drawer lateral
- [ ] Player fullwidth
- [ ] Formulários adaptados (inputs maiores)

---

## 🚀 ROADMAP DE IMPLEMENTAÇÃO

### FASE 1: Core (MVP)
1. Setup do projeto e banco de dados
2. Sistema de autenticação admin
3. CRUD de eventos (sem Gemini)
4. CRUD de aulas
5. Página de catálogo básica
6. Player de vídeo com proteção
7. Sistema de liberação por data

### FASE 2: Estilização Netflix
1. Implementar design Netflix no catálogo
2. Hero section com vídeo de fundo
3. Carrossel de aulas
4. Animações e transições
5. Responsividade mobile
6. Countdown de liberação

### FASE 3: Customização
1. Integração Gemini para logos
2. Editor de estilos (fonte, cor, tamanho)
3. Live preview
4. Salvar configurações no banco

### FASE 4: Funcionalidades Extras
1. Materiais de apoio (upload e download)
2. Sistema de quiz completo
3. Comentários
4. Notificações
5. Busca global

### FASE 5: Otimizações
1. Caching de vídeos
2. Lazy loading
3. SEO
4. Analytics
5. Testes automatizados

---

## 🔒 SEGURANÇA

### Proteção de Vídeos
1. **Embedding:** Usar iframes com sandbox
2. **CSP:** Content Security Policy restritiva
3. **Referrer:** Controlar referrer policy
4. **Overlay:** Camada invisível sobre o player
5. **Desabilitar:** Right-click, DevTools (parcial)
6. **Token temporário:** Gerar URLs assinadas com expiração
7. **Watermark:** Adicionar marca d'água com identificação do usuário

### Validações de Backend
1. **Rate limiting:** Limitar requisições por IP/usuário
2. **CORS:** Configurar origens permitidas
3. **Validação de sessão:** JWT com expiração curta
4. **Log de acessos:** Rastrear tentativas suspeitas
5. **Sanitização:** Validar todos os inputs (XSS, SQL Injection)

---

## 📊 ANALYTICS E MÉTRICAS

### Métricas para Admin
**Dashboard com gráficos:**
- Total de visualizações por aula
- Taxa de conclusão de aulas
- Tempo médio assistido
- Taxa de aprovação em quizzes
- Horários de pico de acesso
- Downloads de materiais
- Engajamento por evento

**Gráficos recomendados:**
- Linha: Visualizações ao longo do tempo
- Barra: Ranking de aulas mais assistidas
- Pizza: Distribuição de status das aulas
- Funil: Progressão dos usuários no curso

### Tracking de Usuário
```javascript
EVENTOS A TRACKEAR:
- video_start: Iniciou vídeo
- video_progress: A cada 25% assistido
- video_complete: Completou vídeo
- material_download: Baixou material
- quiz_start: Iniciou quiz
- quiz_complete: Completou quiz
- page_view: Visualizou página
- button_click: Clicou em CTA

ESTRUTURA:
{
  usuario_id,
  evento,
  aula_id,
  timestamp,
  metadata: {duracao, percentual, etc}
}
```

---

## 🎬 DETALHAMENTO DO PLAYER DE VÍDEO

### Estrutura do Player Component

```javascript
// Componente VideoPlayer
export function VideoPlayer({ videoUrl, aulaId }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Detectar tipo de player
  const playerType = detectPlayerType(videoUrl);
  
  // Tracking de progresso
  const handleProgress = (state) => {
    setProgress(state.played * 100);
    
    // Salvar progresso a cada 10%
    if (state.played % 0.1 === 0) {
      saveProgress(aulaId, state.played * 100);
    }
    
    // Marcar como concluído em 80%
    if (state.played >= 0.8 && !completed) {
      markAsCompleted(aulaId);
    }
  };
  
  return (
    <div className="player-wrapper">
      {/* Overlay anti-scraping */}
      <div className="player-overlay" />
      
      <ReactPlayer
        url={videoUrl}
        controls={true}
        playing={playing}
        onProgress={handleProgress}
        config={{
          youtube: {
            playerVars: {
              modestbranding: 1,
              rel: 0,
              showinfo: 0
            }
          },
          vimeo: {
            playerOptions: {
              byline: false,
              portrait: false,
              title: false
            }
          }
        }}
      />
    </div>
  );
}
```

### CSS de Proteção

```css
.player-wrapper {
  position: relative;
  padding-top: 56.25%; /* 16:9 */
  background: #000;
}

.player-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Overlay invisível para bloquear right-click */
.player-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none; /* Não bloqueia controles */
}

/* Desabilitar seleção */
.player-wrapper * {
  user-select: none;
  -webkit-user-select: none;
}
```

---

## 🎨 COMPONENTES UI DETALHADOS

### 1. Countdown Component

```javascript
export function Countdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  function calculateTimeLeft() {
    const difference = new Date(targetDate) - new Date();
    
    if (difference > 0) {
      return {
        dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
        horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((difference / 1000 / 60) % 60),
        segundos: Math.floor((difference / 1000) % 60)
      };
    }
    return null;
  }
  
  if (!timeLeft) return <div>Aula liberada!</div>;
  
  return (
    <div className="countdown-container">
      <h3>Primeira aula liberada em:</h3>
      <div className="countdown-timer">
        <div className="time-unit">
          <span className="time-value">{timeLeft.dias}</span>
          <span className="time-label">dias</span>
        </div>
        <div className="time-separator">:</div>
        <div className="time-unit">
          <span className="time-value">{timeLeft.horas}</span>
          <span className="time-label">horas</span>
        </div>
        <div className="time-separator">:</div>
        <div className="time-unit">
          <span className="time-value">{timeLeft.minutos}</span>
          <span className="time-label">minutos</span>
        </div>
        <div className="time-separator">:</div>
        <div className="time-unit">
          <span className="time-value">{timeLeft.segundos}</span>
          <span className="time-label">segundos</span>
        </div>
      </div>
    </div>
  );
}
```

### 2. Card de Aula Component

```javascript
export function AulaCard({ aula }) {
  const status = getAulaStatus(aula);
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`aula-card ${status}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail */}
      <div className="card-thumbnail">
        <img src={aula.thumbnail_url} alt={aula.nome_aula} />
        
        {/* Badge de ordem */}
        <div className="card-badge">AULA {aula.ordem}</div>
        
        {/* Duração */}
        <div className="card-duration">{aula.duracao_minutos} min</div>
        
        {/* Status icon */}
        {status === 'bloqueada' && (
          <div className="card-lock">🔒</div>
        )}
      </div>
      
      {/* Hover overlay */}
      {isHovered && status === 'liberada' && (
        <div className="card-hover-overlay">
          <button className="play-button">▶</button>
          <h4>{aula.nome_aula}</h4>
          <p>{aula.descricao_aula.substring(0, 100)}...</p>
          <div className="card-actions">
            <button>Assistir</button>
            <button>+ Minha Lista</button>
          </div>
        </div>
      )}
      
      {/* Info básica */}
      <div className="card-info">
        <h3>{aula.nome_aula}</h3>
      </div>
    </div>
  );
}

// Helper function
function getAulaStatus(aula) {
  const now = new Date();
  const dataLiberacao = new Date(aula.data_liberacao);
  const dataLimite = aula.data_limite_acesso 
    ? new Date(aula.data_limite_acesso) 
    : null;
  
  if (dataLiberacao > now) return 'bloqueada';
  if (dataLimite && dataLimite < now) return 'expirada';
  return 'liberada';
}
```

### 3. Hero Section Component

```javascript
export function HeroSection({ evento, primeiraAula }) {
  const videoRef = useRef(null);
  const [showCountdown, setShowCountdown] = useState(false);
  
  useEffect(() => {
    // Verificar se deve mostrar countdown
    const now = new Date();
    const dataLiberacao = new Date(primeiraAula.data_liberacao);
    setShowCountdown(dataLiberacao > now);
  }, [primeiraAula]);
  
  return (
    <div className="hero-section">
      {/* Vídeo de fundo */}
      <video
        ref={videoRef}
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={evento.video_capa_url} type="video/mp4" />
      </video>
      
      {/* Overlay gradient */}
      <div className="hero-overlay" />
      
      {/* Conteúdo */}
      <div className="hero-content">
        {/* Logo customizada */}
        {evento.logo_url && (
          <img 
            src={evento.logo_url} 
            alt={evento.nome_logo}
            className="hero-logo"
          />
        )}
        
        {/* Categoria */}
        <div className="hero-category">JORNADA</div>
        
        {/* Título com estilo customizado */}
        <h1 
          className="hero-title"
          style={{
            fontFamily: evento.config_estilo.fonte,
            color: evento.config_estilo.cor,
            fontSize: `${evento.config_estilo.tamanho}px`
          }}
        >
          {evento.nome_evento}
        </h1>
        
        {/* Descrição top */}
        <p className="hero-description-top">
          {evento.descricao_top1}
        </p>
        
        {/* Descrição completa (primeiras linhas) */}
        <p className="hero-description">
          {evento.descricao_completa.substring(0, 250)}...
        </p>
        
        {/* Countdown ou botões */}
        {showCountdown ? (
          <Countdown targetDate={primeiraAula.data_liberacao} />
        ) : (
          <div className="hero-buttons">
            <button className="btn-primary">
              ▶ ASSISTIR
            </button>
            <button className="btn-secondary">
              ℹ Mais Informações
            </button>
          </div>
        )}
        
        {/* Badge de status */}
        <div className="hero-badge">
          {showCountdown 
            ? `Liberação: ${formatDate(primeiraAula.data_liberacao)}`
            : `${evento.aulas_count} aulas disponíveis`
          }
        </div>
      </div>
      
      {/* Fade no final */}
      <div className="hero-fade-bottom" />
    </div>
  );
}
```

---

## 🔄 FLUXOS ANTIGRAVITY DETALHADOS

### Fluxo: Geração de Logo com Gemini

```
PÁGINA: /admin/eventos/novo

CAMPO: Input "Nome para Logo"
VALOR EXEMPLO: "ELEITOFLIX"

BOTÃO: "🤖 Gerar Logo com IA"

===== AÇÃO ANTIGRAVITY =====

TRIGGER: onClick do botão
CONDITION: Nome preenchido (min 3 caracteres)

ACTION 1: Mostrar loading spinner
  UPDATE UI: 
    - Desabilitar botão
    - Mostrar texto "Gerando logo com IA..."
    - Animação de loading

ACTION 2: Requisição ao backend
  METHOD: POST
  ENDPOINT: /api/gemini/generate-logo
  HEADERS: {
    "Authorization": "Bearer {JWT_TOKEN}",
    "Content-Type": "application/json"
  }
  BODY: {
    "nome_logo": "ELEITOFLIX",
    "estilo": "netflix",
    "fundo": "transparente"
  }

===== PROCESSAMENTO BACKEND =====

STEP 1: Validar token e permissões

STEP 2: Montar prompt para Gemini
  PROMPT: `
    Create a high-quality logo in Netflix style with these requirements:
    - Text: "${nome_logo}" in bold red letters
    - Style: Modern, bold, premium streaming platform aesthetic
    - Font: Similar to Netflix's Bebas Neue (bold, condensed)
    - Color: Bright red (#E50914) with subtle gradient
    - Background: Fully transparent (PNG)
    - Resolution: 1000x400px minimum
    - Format: PNG with transparency
    - Additional: Slight shadow or glow effect for depth
  `

STEP 3: Chamar Gemini API
  API: Google Generative AI
  MODEL: gemini-pro-vision
  REQUEST: {
    prompt: [prompt_montado],
    parameters: {
      temperature: 0.7,
      output_format: "image/png"
    }
  }

STEP 4: Processar resposta
  - Receber imagem em base64
  - Validar formato e tamanho
  - Gerar nome único: `logo_${timestamp}_${random}.png`

STEP 5: Salvar imagem
  - Upload para storage (S3/R2/local)
  - Caminho: /uploads/logos/${filename}
  - Gerar URL pública

STEP 6: Salvar no banco (temporário)
  - Inserir em tabela temp_logos
  - Associar com sessão do admin
  - TTL: 1 hora (caso não salve o evento)

STEP 7: Retornar resposta
  RESPONSE: {
    "success": true,
    "logo_url": "/uploads/logos/logo_1234567890_abc.png",
    "filename": "logo_1234567890_abc.png"
  }

===== AÇÃO ANTIGRAVITY (continuação) =====

ACTION 3: Processar resposta
  ON SUCCESS:
    - Ocultar loading
    - Atualizar campo hidden "logo_url"
    - Renderizar preview da logo
    - Mostrar botão "Regenerar"
    - Habilitar botão "Salvar Evento"
  
  ON ERROR:
    - Ocultar loading
    - Mostrar mensagem de erro
    - Sugerir tentar novamente
    - Log do erro para debug

ACTION 4: Preview interativo
  ELEMENT: <div id="logo-preview">
    <img src="{logo_url}" alt="Logo gerada" />
    <button id="regenerate">🔄 Regenerar</button>
    <button id="remove">🗑️ Remover</button>
  </div>

TRIGGER REGENERAR: onClick regenerate button
  - Executar novamente ACTION 2
  - Manter mesmo nome ou permitir edição

TRIGGER REMOVER: onClick remove button
  - Limpar campo logo_url
  - Ocultar preview
  - Habilitar botão gerar novamente
```

### Fluxo: Customização Visual com Live Preview

```
PÁGINA: /admin/eventos/novo

SEÇÃO: "Customização do Nome do Evento"

CAMPOS:
1. Select "Fonte Google" (id: font-select)
2. Color Picker "Cor do Texto" (id: color-picker)
3. Input HEX manual (id: color-hex)
4. Slider "Tamanho da Fonte" (id: font-size, min: 24, max: 120)

PREVIEW AREA: <div id="live-preview">

===== AÇÃO ANTIGRAVITY =====

TRIGGER 1: onChange do font-select
  ACTION:
    - Capturar valor selecionado (ex: "Bebas Neue")
    - Carregar fonte do Google Fonts dinamicamente
    - UPDATE preview:
        document.getElementById('preview-title').style.fontFamily = valor
    - Salvar em state/form: config_estilo.fonte = valor

TRIGGER 2: onChange do color-picker
  ACTION:
    - Capturar cor selecionada (ex: #E50914)
    - Sincronizar com input HEX
    - UPDATE preview:
        document.getElementById('preview-title').style.color = cor
    - Salvar em state: config_estilo.cor = cor

TRIGGER 3: onInput do color-hex
  ACTION:
    - Validar formato HEX (regex: ^#[0-9A-Fa-f]{6}$)
    - Se válido: sincronizar com color-picker
    - UPDATE preview
    - Salvar em state

TRIGGER 4: onInput do font-size (slider)
  ACTION:
    - Capturar valor (ex: 64)
    - Mostrar valor em label (ex: "64px")
    - UPDATE preview:
        document.getElementById('preview-title').style.fontSize = valor + 'px'
    - Salvar em state: config_estilo.tamanho = valor

===== ESTRUTURA DO PREVIEW =====

HTML:
<div id="live-preview" class="preview-container">
  <div class="preview-background">
    <!-- Thumbnail ou vídeo de fundo simulado -->
    <img src="/placeholder-hero.jpg" />
    
    <!-- Overlay escuro -->
    <div class="preview-overlay"></div>
    
    <!-- Título do evento (estilizado) -->
    <h1 id="preview-title" style="
      font-family: Bebas Neue;
      color: #FFFFFF;
      font-size: 64px;
      text-transform: uppercase;
      margin: 0;
      text-shadow: 2px 2px 8px rgba(0,0,0,0.8);
    ">
      SEJA ELEITO 2024
    </h1>
    
    <!-- Descrição de exemplo -->
    <p class="preview-description">
      Aprenda as estratégias vencedoras...
    </p>
  </div>
  
  <div class="preview-info">
    ℹ️ Esta é uma prévia de como o título aparecerá na página
  </div>
</div>

CSS:
.preview-container {
  margin-top: 20px;
  border: 2px solid #333;
  border-radius: 8px;
  overflow: hidden;
}

.preview-background {
  position: relative;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background: #000;
}

.preview-background img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.4;
}

.preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.3),
    rgba(0,0,0,0.7)
  );
}

#preview-title {
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

===== SALVAR CONFIGURAÇÃO =====

TRIGGER: Submit do formulário

ACTION: Incluir no payload
  BODY: {
    ...outros_campos,
    config_estilo: {
      fonte: "Bebas Neue",
      cor: "#E50914",
      tamanho: 64
    }
  }

ARMAZENAMENTO: JSON no campo config_estilo (TEXT/JSON no banco)

RECUPERAÇÃO: Na página pública
  - Ler config_estilo do evento
  - Aplicar estilos dinamicamente ao título
  - Garantir fallback se config não existir
```

### Fluxo: Sistema de Bloqueio de Aulas

```
PÁGINA: / (Catálogo de aulas)

===== CARREGAMENTO INICIAL =====

ACTION: Fetch das aulas
  METHOD: GET
  ENDPOINT: /api/eventos/:slug/aulas
  RESPONSE: {
    evento: {...},
    aulas: [
      {
        id: 1,
        ordem: 1,
        nome_aula: "Aula 1",
        data_liberacao: "2024-01-20T10:00:00Z",
        data_limite_acesso: null,
        video_url: "...",
        thumbnail_url: "..."
      },
      {...}
    ]
  }

===== PROCESSAMENTO CLIENT-SIDE =====

STEP 1: Para cada aula, calcular status

FUNCTION: getAulaStatus(aula) {
  const agora = new Date();
  const dataLib = new Date(aula.data_liberacao);
  const dataLim = aula.data_limite_acesso 
    ? new Date(aula.data_limite_acesso) 
    : null;
  
  if (dataLib > agora) {
    return {
      status: 'bloqueada',
      mensagem: `Liberada em ${formatDate(dataLib)}`,
      clicavel: false,
      icone: '🔒',
      cor: '#6E6E6E'
    };
  }
  
  if (dataLim && dataLim < agora) {
    return {
      status: 'expirada',
      mensagem: 'Acesso expirado',
      clicavel: false,
      icone: '⏱️',
      cor: '#E50914'
    };
  }
  
  return {
    status: 'liberada',
    mensagem: 'Disponível',
    clicavel: true,
    icone: '✓',
    cor: '#46D369'
  };
}

STEP 2: Renderizar cards com status correto

FOR EACH aula IN aulas:
  status = getAulaStatus(aula)
  
  RENDER:
    <AulaCard
      aula={aula}
      status={status.status}
      onClick={status.clicavel ? () => navigate(`/aulas/${aula.id}`) : null}
      className={`aula-card ${status.status}`}
    >
      <Badge color={status.cor} icon={status.icone}>
        {status.mensagem}
      </Badge>
      
      {status.status === 'bloqueada' && (
        <Countdown targetDate={aula.data_liberacao} compact />
      )}
    </AulaCard>

===== TENTATIVA DE ACESSO DIRETO =====

PÁGINA: /aulas/:id

ACTION: Verificação de acesso (middleware)
  METHOD: GET
  ENDPOINT: /api/aulas/:id/verificar-acesso
  
  PROCESS BACKEND:
    1. Buscar aula no banco
    2. Verificar data_liberacao
    3. Verificar data_limite_acesso
    4. Retornar permissão

  RESPONSE CASOS:
  
  CASO 1: Aula bloqueada
    STATUS: 403
    BODY: {
      erro: "aula_nao_liberada",
      mensagem: "Esta aula ainda não está disponível",
      data_liberacao: "2024-01-20T10:00:00Z"
    }
    
    ACTION CLIENT:
      - Redirecionar para catálogo
      - Mostrar toast: "Aula será liberada em X dias"
  
  CASO 2: Aula expirada
    STATUS: 403
    BODY: {
      erro: "aula_expirada",
      mensagem: "O prazo para assistir esta aula expirou"
    }
    
    ACTION CLIENT:
      - Redirecionar para catálogo
      - Mostrar toast: "Esta aula não está mais disponível"
  
  CASO 3: Aula liberada
    STATUS: 200
    BODY: {
      permissao: true,
      aula: {...dados completos}
    }
    
    ACTION CLIENT:
      - Renderizar página da aula
      - Iniciar player

===== ATUALIZAÇÃO EM TEMPO REAL =====

IMPLEMENTAR: Verificação periódica

FUNCTION: useAulaStatusCheck(aulaId, dataLiberacao) {
  useEffect(() => {
    // Se aula está bloqueada
    if (new Date(dataLiberacao) > new Date()) {
      // Verificar a cada 60 segundos
      const interval = setInterval(() => {
        const agora = new Date();
        const dataLib = new Date(dataLiberacao);
        
        if (dataLib <= agora) {
          // Aula foi liberada!
          clearInterval(interval);
          // Atualizar UI
          refreshAulaStatus();
          // Mostrar notificação
          showToast("Aula liberada! Clique para assistir");
        }
      }, 60000); // 60 segundos
      
      return () => clearInterval(interval);
    }
  }, [aulaId, dataLiberacao]);
}
```

---

## 📤 FLUXO DE UPLOAD DE MATERIAIS

```
PÁGINA: /admin/aulas/:id/editar

SEÇÃO: Materiais de Apoio

===== COMPONENT =====

<FileUploader 
  multiple={true}
  acceptedTypes={['.pdf', '.docx', '.xlsx', '.pptx', '.zip', '.jpg', '.png']}
  maxSize={50 * 1024 * 1024} // 50MB
  onUpload={handleUpload}
/>

===== AÇÃO ANTIGRAVITY =====

TRIGGER: onChange do input file

ACTION 1: Validar arquivos
  FOR EACH file IN selectedFiles:
    - Verificar extensão permitida
    - Verificar tamanho < maxSize
    - Verificar quantidade < 20 arquivos
    
    IF inválido:
      - Remover da lista
      - Mostrar erro específico

ACTION 2: Upload dos arquivos válidos
  FOR EACH file IN validFiles:
    
    STEP 1: Criar FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('aula_id', aulaId);
      formData.append('tipo', file.type);
    
    STEP 2: Requisição
      METHOD: POST
      ENDPOINT: /api/materiais/upload
      HEADERS: {
        "Authorization": "Bearer {JWT_TOKEN}",
        // Não definir Content-Type (auto para FormData)
      }
      BODY: formData
      
      // Progress tracking
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        updateProgressBar(file.name, percentCompleted);
      }
    
    STEP 3: Processar resposta
      ON SUCCESS:
        RESPONSE: {
          id: 123,
          nome_arquivo: "apostila.pdf",
          url_arquivo: "/uploads/materiais/apostila_123.pdf",
          tamanho_bytes: 1024000,
          tipo_arquivo: "application/pdf"
        }
        
        ACTION:
          - Adicionar à lista de materiais salvos
          - Mostrar preview do arquivo
          - Limpar progress bar
      
      ON ERROR:
        - Mostrar erro
        - Permitir retry

ACTION 3: Renderizar lista de materiais
  <div className="materiais-list">
    {materiais.map(material => (
      <MaterialCard
        key={material.id}
        material={material}
        onDelete={() => deleteMaterial(material.id)}
      />
    ))}
  </div>

===== BACKEND PROCESSING =====

ENDPOINT: POST /api/materiais/upload

STEP 1: Validar requisição
  - Verificar autenticação
  - Verificar permissão (admin)
  - Validar aula_id existe

STEP 2: Processar arquivo
  - Gerar nome único: {original}_{timestamp}_{random}.{ext}
  - Definir destino: /uploads/materiais/{ano}/{mes}/
  - Criar diretório se não existir

STEP 3: Salvar arquivo
  - Mover de temp para destino final
  - Ou fazer upload para S3/R2

STEP 4: Criar registro no banco
  INSERT INTO materiais_apoio (
    aula_id,
    nome_arquivo,
    tipo_arquivo,
    url_arquivo,
    tamanho_bytes,
    created_at
  ) VALUES (...)

STEP 5: Retornar resposta
  RESPONSE: {dados do material salvo}
```

---

## ✅ CHECKLIST FINAL DE FUNCIONALIDADES

### Autenticação
- [ ] Login admin com JWT
- [ ] Logout
- [ ] Proteção de rotas admin
- [ ] Session timeout

### Eventos
- [ ] Criar evento
- [ ] Editar evento
- [ ] Deletar evento (soft delete)
- [ ] Listar eventos
- [ ] Ativar/desativar evento
- [ ] Geração de logo com Gemini
- [ ] Upload de vídeo de capa
- [ ] Customização visual (fonte, cor, tamanho)
- [ ] Live preview
- [ ] Slug amigável

### Aulas
- [ ] Criar aula
- [ ] Editar aula
- [ ] Deletar aula
- [ ] Ordenação de aulas
- [ ] Upload de thumbnail
- [ ] Validação de URL de vídeo
- [ ] Data de liberação
- [ ] Data limite de acesso
- [ ] Upload múltiplo de materiais
- [ ] Preview de materiais

### Quiz
- [ ] Criar quiz
- [ ] Editar quiz
- [ ] Deletar quiz
- [ ] Adicionar/remover perguntas
- [ ] Adicionar/remover opções
- [ ] Marcar resposta correta
- [ ] Pontuação mínima
- [ ] Visualizar respostas dos usuários

### Usuário (Front-end público)
- [ ] Catálogo estilo Netflix
- [ ] Hero section com vídeo
- [ ] Carrossel de aulas
- [ ] Countdown de liberação
- [ ] Filtro de status (liberada/bloqueada/expirada)
- [ ] Player de vídeo protegido
- [ ] Controles de player
- [ ] Tracking de progresso
- [ ] Marcar aula como concluída
- [ ] Navegação entre aulas
- [ ] Download de materiais
- [ ] Realizar quiz
- [ ] Ver resultado do quiz
- [ ] Comentários (integração Facebook)

### Responsividade
- [ ] Desktop (>= 1024px)
- [ ] Tablet (768px - 1023px)
- [ ] Mobile (< 768px)
- [ ] Testes em diferentes navegadores
- [ ] Testes em diferentes dispositivos

### Performance
- [ ] Lazy loading de imagens
- [ ] Lazy loading de vídeos
- [ ] Compressão de assets
- [ ] CDN para arquivos estáticos
- [ ] Cache de API responses
- [ ] Otimização de queries do banco

### Segurança
- [ ] Validação de inputs
- [ ] Sanitização de dados
- [ ] CORS configurado
- [ ] Rate limiting
- [ ] HTTPS obrigatório
- [ ] Headers de segurança
- [ ] Proteção contra XSS
- [ ] Proteção contra SQL Injection
- [ ] Proteção de vídeos
- [ ] URLs assinadas para downloads

### Analytics
- [ ] Tracking de visualizações
- [ ] Tracking de conclusões
- [ ] Tracking de progresso
- [ ] Tracking de downloads
- [ ] Tracking de quizzes
- [ ] Dashboard de métricas
- [ ] Gráficos de engajamento
- [ ] Relatórios exportáveis

### Extras
- [ ] Notificações (nova aula, quiz, etc)
- [ ] Busca global
- [ ] Favoritos/"Minha Lista"
- [ ] Compartilhamento social
- [ ] Certificado de conclusão
- [ ] Integração Telegram
- [ ] Integração YouTube
- [ ] Integração Instagram
- [ ] Sistema de badges/conquistas
- [ ] Modo dark (já é padrão Netflix)
- [ ] Modo teatro no player
- [ ] Download em lote de materiais
- [ ] Export de progresso (CSV)

---

## 🚀 SEQUÊNCIA DE IMPLEMENTAÇÃO RECOMENDADA

### SPRINT 1: Fundação (2 semanas)
**Objetivo:** Base funcional admin + banco

1. Setup do projeto (frontend + backend)
2. Estrutura do banco de dados
3. Sistema de autenticação admin
4. CRUD básico de eventos (sem Gemini)
5. CRUD básico de aulas
6. Testes unitários básicos

**Entregável:** Admin consegue criar eventos e aulas

---

### SPRINT 2: Interface Netflix (2 semanas)
**Objetivo:** Front-end público estilo Netflix

1. Design system Netflix (cores, fontes, componentes)
2. Hero section com vídeo de fundo
3. Catálogo de aulas (grid/carrossel)
4. Cards de aulas com hover effects
5. Sistema de status (liberada/bloqueada/expirada)
6. Countdown component
7. Responsividade mobile

**Entregável:** Catálogo visual funcionando

---

### SPRINT 3: Player e Proteção (1 semana)
**Objetivo:** Sistema de vídeo completo

1. Integração com players (YouTube, Vimeo, etc)
2. Página da aula com player
3. Proteção anti-scraping
4. Controles de navegação (próxima/anterior)
5. Tracking de progresso
6. Marcar como concluída

**Entregável:** Usuário consegue assistir aulas

---

### SPRINT 4: Materiais e Quiz (1-2 semanas)
**Objetivo:** Complementos da aula

1. Upload de materiais de apoio
2. Página de listagem de materiais
3. Download de materiais
4. CRUD de quiz no admin
5. Página de quiz para usuário
6. Correção automática
7. Página de resultado

**Entregável:** Sistema de quiz funcional

---

### SPRINT 5: Customização e IA (1-2 semanas)
**Objetivo:** Personalização avançada

1. Integração com Gemini API
2. Geração automática de logos
3. Editor de estilos (fonte, cor, tamanho)
4. Live preview do hero
5. Salvar e aplicar configurações
6. Fallbacks para erros da IA

**Entregável:** Customização visual completa

---

### SPRINT 6: Analytics e Admin (1 semana)
**Objetivo:** Dados e gestão

1. Sistema de tracking de eventos
2. Dashboard de métricas
3. Gráficos de visualizações
4. Relatório de progresso dos usuários
5. Relatório de quizzes
6. Export de dados (CSV)

**Entregável:** Admin tem visibilidade total

---

### SPRINT 7: Extras e Polish (1-2 semanas)
**Objetivo:** Funcionalidades extras

1. Sistema de notificações
2. Busca global
3. Comentários (integração Facebook)
4. Integrações sociais (Telegram, YouTube, Instagram)
5. Certificado de conclusão
6. Badges/conquistas (opcional)

**Entregável:** Plataforma completa

---

### SPRINT 8: Testes e Deploy (1 semana)
**Objetivo:** Produção

1. Testes end-to-end
2. Testes de carga
3. Testes de segurança
4. Otimização de performance
5. Setup de infraestrutura (hosting, CDN, banco)
6. CI/CD pipeline
7. Monitoramento e logs
8. Deploy para produção
9. Treinamento do cliente

**Entregável:** Sistema em produção

---

## 📚 DOCUMENTAÇÃO TÉCNICA

### Estrutura de Pastas Sugerida

```
projeto/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── jwt.js
│   │   │   └── gemini.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── eventosController.js
│   │   │   ├── aulasController.js
│   │   │   ├── quizzesController.js
│   │   │   ├── materiaisController.js
│   │   │   └── geminiController.js
│   │   ├── models/
│   │   │   ├── Admin.js
│   │   │   ├── Evento.js
│   │   │   ├── Aula.js
│   │   │   ├── Quiz.js
│   │   │   └── Material.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── validation.js
│   │   │   └── rateLimit.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── eventos.js
│   │   │   ├── aulas.js
│   │   │   ├── quizzes.js
│   │   │   └── materiais.js
│   │   ├── services/
│   │   │   ├── geminiService.js
│   │   │   ├── uploadService.js
│   │   │   └── analyticsService.js
│   │   ├── utils/
│   │   │   ├── validators.js
│   │   │   ├── helpers.js
│   │   │   └── constants.js
│   │   └── app.js
│   ├── uploads/
│   │   ├── logos/
│   │   ├── materiais/
│   │   └── thumbnails/
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── EventForm.jsx
│   │   │   │   ├── AulaForm.jsx
│   │   │   │   ├── QuizForm.jsx
│   │   │   │   └── Dashboard.jsx
│   │   │   ├── user/
│   │   │   │   ├── HeroSection.jsx
│   │   │   │   ├── AulaCard.jsx
│   │   │   │   ├── VideoPlayer.jsx
│   │   │   │   ├── Countdown.jsx
│   │   │   │   └── QuizPage.jsx
│   │   │   ├── shared/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Button.jsx
│   │   │   │   └── Modal.jsx
│   │   │   └── layout/
│   │   │       ├── AdminLayout.jsx
│   │   │       └── UserLayout.jsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── EventosList.jsx
│   │   │   │   ├── EventoForm.jsx
│   │   │   │   └── AulasList.jsx
│   │   │   ├── user/
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── EventoPage.jsx
│   │   │   │   ├── AulaPage.jsx
│   │   │   │   ├── MateriaisPage.jsx
│   │   │   │   └── QuizPage.jsx
│   │   │   └── NotFound.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useAulaStatus.js
│   │   │   └── useCountdown.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   └── eventosService.js
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   ├── netflix.css
│   │   │   └── admin.css
│   │   ├── utils/
│   │   │   ├── dateHelpers.js
│   │   │   ├── videoHelpers.js
│   │   │   └── formatters.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

### Variáveis de Ambiente

```env
# Backend .env
DATABASE_URL=postgresql://user:pass@localhost:5432/cursos_db
JWT_SECRET=seu_secret_super_seguro_aqui
JWT_EXPIRATION=7d

GEMINI_API_KEY=sua_chave_gemini_aqui

UPLOAD_DIR=./uploads
MAX_FILE_SIZE=52428800

CORS_ORIGIN=http://localhost:5173

# Storage (S3/R2)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_BUCKET_NAME=

# Email (opcional)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

# Frontend .env
VITE_API_URL=http://localhost:3000/api
VITE_GEMINI_PUBLIC_KEY=
```

---

## 🎓 CONSIDERAÇÕES FINAIS

### Escalabilidade
- **Caching:** Implementar Redis para cache de queries frequentes
- **CDN:** Usar Cloudflare ou similar para assets estáticos
- **Load Balancer:** Para múltiplas instâncias do backend
- **Database:** Considerar sharding se muitos eventos simultâneos

### Manutenibilidade
- **Testes:** Cobertura mínima de 70%
- **Documentação:** Swagger/OpenAPI para APIs
- **Logs:** Sistema estruturado de logging
- **Monitoring:** Sentry ou similar para erros

### Acessibilidade
- **ARIA labels** em todos os componentes interativos
- **Navegação por teclado** funcional
- **Contraste de cores** WCAG AA compliant
- **Screen reader** friendly

### SEO (se aplicável)
- **Meta tags** dinâmicas por página
- **Open Graph** para compartilhamento social
- **Sitemap** XML gerado automaticamente
- **URLs amigáveis** (slugs)

---

## 🎯 MÉTRICAS DE SUCESSO

### KPIs Principais
1. **Taxa de Conclusão:** % de usuários que completam todas as aulas
2. **Tempo Médio de Visualização:** Minutos assistidos por aula
3. **Aprovação em Quizzes:** % de aprovação média
4. **Engajamento:** Retorno diário/semanal de usuários
5. **Downloads:** Quantidade de materiais baixados
6. **Performance:** Tempo de carregamento < 3s

### Benchmarks
- Conversão countdown → visualização: > 60%
- Taxa de conclusão de aula: > 70%
- Aprovação em quiz: > 65%
- Bounce rate: < 40%
- Page load time: < 2s (desktop), < 3s (mobile)

---

## 🆘 TROUBLESHOOTING COMUM

### "Logo não está sendo gerada"
- Verificar API key do Gemini
- Verificar quota da API
- Verificar logs de erro no backend
- Testar prompt manualmente na API do Gemini

### "Vídeo não carrega"
- Verificar URL do vídeo está correta
- Verificar CORS no player embedding
- Verificar se o vídeo é público (YouTube/Vimeo)
- Testar URL diretamente no navegador

### "Countdown não atualiza"
- Verificar timezone do servidor vs cliente
- Verificar formato da data no banco (ISO 8601)
- Verificar setInterval está rodando
- Limpar cache do navegador

### "Upload de arquivo falha"
- Verificar tamanho do arquivo < limit
- Verificar permissões da pasta uploads/
- Verificar espaço em disco
- Verificar timeout do servidor

### "Aulas não desbloqueiam na data correta"
- Verificar timezone do servidor
- Verificar cron job está rodando (se usar)
- Verificar cache da API
- Forçar revalidação no frontend

---

## 🌟 FEATURES FUTURAS (V2)

### Gamificação
- Sistema de pontos por aula concluída
- Badges por conquistas (speedrun, perfeccionista, etc)
- Ranking de alunos
- Desafios semanais

### Social
- Chat ao vivo durante aulas
- Fórum de discussão
- Grupos de estudo
- Perfis públicos de alunos

### Conteúdo
- Aulas ao vivo (streaming)
- Webinars integrados
- Conteúdo interativo (hotspots no vídeo)
- Ramificação de conteúdo (escolhas do usuário)

### Admin
- Editor de vídeo integrado
- Geração automática de legendas (IA)
- Análise de sentimento nos comentários
- A/B testing de thumbnails

### Mobile
- App nativo iOS/Android
- Download offline de aulas
- Notificações push
- Picture-in-picture

---

## ✉️ SUPORTE E CONTATO

**Documentação completa:** [link para docs]
**Repositório:** [link para GitHub]
**Issues:** [link para issues]
**Email:** suporte@plataforma.com

---

**FIM DO WORKFLOW ANTIGRAVITY**

Este documento serve como guia completo para implementação da plataforma de cursos estilo Netflix. Todos os fluxos, validações e integrações estão detalhados para facilitar o desenvolvimento no Antigravity ou qualquer outra plataforma no-code/low-code.

Boa sorte com o projeto! 🚀🎬