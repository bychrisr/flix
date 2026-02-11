# Project Brief: Flix

## Executive Summary
Flix e uma plataforma de cursos digitais com experiencia visual inspirada em streaming, focada em infoprodutores que precisam lancar jornadas de conteudo com controle de liberacao por data, player de video, area administrativa e experiencia de consumo moderna. O objetivo do MVP e entregar um produto funcional fim-a-fim para publicacao e consumo de aulas com alto controle operacional.

## Problem Statement
Infoprodutores normalmente dependem de stacks fragmentadas para publicar cursos (plataforma de video, area de membros, quiz, materiais, controle manual de datas), o que aumenta custo operacional, reduz consistencia da experiencia e dificulta escala de lancamentos. Flix resolve isso com um fluxo unificado de cadastro, agendamento e consumo de aulas.

## Proposed Solution
Construir uma plataforma web com:
- painel administrativo para autenticacao e gestao de eventos, aulas, quizzes e materiais;
- jornadas/eventos com visibilidade publica ou privada;
- catalogo com hero, cards e logica de bloqueio/liberacao por data;
- pagina de aula com player e validacoes de acesso;
- base de design system reutilizavel para consistencia entre apps.

## Target Users
### Primary User Segment: Infoprodutores
- Criadores e equipes de lancamento que precisam publicar cursos em formato jornada/episodios.
- Precisam de controle granular de liberacao de aulas, materiais e acompanhamento de progresso.
- Valorizam velocidade de operacao, padrao visual forte e menor dependencia de multiplas ferramentas.

### Secondary User Segment: Alunos/Consumidores do Curso
- Usuarios finais que consomem aulas em sequencia.
- Precisam de experiencia clara de navegacao, status das aulas e acesso simples aos materiais.

## Goals & Success Metrics
### Business Objectives
- Entregar o MVP funcional conforme escopo definido no documento base.
- Permitir operacao completa de um lancamento por infoprodutor sem ferramentas externas para os fluxos nucleares.
- Reduzir friccao entre configuracao do evento e experiencia de consumo.

### User Success Metrics
- Usuarios administradores conseguem cadastrar evento e trilha de aulas sem suporte tecnico.
- Alunos conseguem identificar claramente o status de cada aula (liberada, bloqueada, expirada).
- Fluxo de consumo (catalogo -> aula -> materiais/quiz) ocorre sem ruptura de UX.

### Key Performance Indicators (KPIs)
- Pendente definicao (usuario informou que respondera depois).
- Pendente definicao (usuario informou que respondera depois).
- Pendente definicao (usuario informou que respondera depois).

## MVP Scope
### Core Features (Must Have)
- Autenticacao administrativa.
- Dashboard administrativo base.
- CRUD de eventos.
- Configuracao de visibilidade da jornada/evento (`publica` ou `privada`).
- CRUD de aulas (com data de liberacao e data limite de acesso).
- Upload e vinculacao de materiais de apoio.
- CRUD de quizzes e execucao do quiz na area do usuario.
- Catalogo estilo streaming com acesso condicionado por visibilidade (`publica` ou `privada`) e status de aulas.
- Pagina da aula com player e validacao de acesso por janela temporal.
- Responsividade desktop/tablet/mobile.

### Out of Scope for MVP
- Nenhum item explicitamente excluido pelo solicitante.

### MVP Success Criteria
O MVP sera considerado concluido quando um infoprodutor conseguir configurar e publicar um evento completo (publico ou privado) com aulas agendadas, materiais e quiz, e um aluno conseguir consumir o conteudo respeitando as regras de visibilidade e acesso temporal, em fluxo estavel de ponta a ponta.

## Post-MVP Vision
### Phase 2 Features
- Integracoes adicionais (telegram/youtube/instagram).
- Notificacoes, busca global e funcionalidades avancadas de engajamento.
- Analytics mais avancado e relatorios operacionais.

### Long-term Vision
Plataforma de cursos com identidade visual premium, operacao escalavel para multiplos eventos e trilhas, e capacidade de extensao para automacoes de lancamento e recursos de retencao.

### Expansion Opportunities
- Gamificacao.
- Certificados automatizados.
- Recursos sociais e comunidade.
- Aplicacao mobile dedicada.

## Technical Considerations
### Platform Requirements
- **Target Platforms:** Web (apps publica e admin) + API backend.
- **Browser/OS Support:** navegadores modernos desktop e mobile.
- **Performance Requirements:** experiencia fluida no catalogo e player, com foco em tempo de carregamento competitivo.

### Technology Preferences
- **Frontend:** apps separadas para web e admin em monorepo.
- **Backend:** servico API dedicado em monorepo.
- **Database:** relacional (modelagem orientada a eventos/aulas/quizzes/materiais).
- **Hosting/Infrastructure:** a definir em fase de implementacao.
- **External API inicial:** Gemini (geracao de logo e capacidades IA iniciais do produto).

### Architecture Considerations
- **Repository Structure:** monorepo com `apps/`, `services/`, `packages/`.
- **Service Architecture:** API unica para auth, eventos, aulas, quiz e materiais.
- **Integration Requirements:** design system central em `packages/design-system` usando pasta legado `design-system/` como referencia.
- **Security/Compliance:** auth segura, validacao de inputs, controle de acesso por data e protecoes de player.

## Constraints & Assumptions
### Constraints
- **Budget:** nao informado.
- **Timeline:** nao informado.
- **Resources:** nao informado.
- **Technical:** evolucao incremental do design system sem tratar material legado como canonical.

### Key Assumptions
- O escopo descrito no documento legado representa o MVP desejado.
- A audiencia principal inicial e infoprodutores.
- O projeto seguira arquitetura monorepo desde o inicio.

## Risks & Open Questions
### Key Risks
- **Escopo amplo para MVP:** grande quantidade de fluxos pode impactar prazo e qualidade se nao houver priorizacao operacional por sprint.
- **Dependencia de integracoes externas:** player e servicos de midia podem introduzir variabilidade de comportamento.
- **Definicao tardia de KPIs:** sem metas objetivas cedo, avaliacao de sucesso pode ficar subjetiva.

### Open Questions
- Quais KPIs de 90 dias vao definir sucesso da primeira versao?
- Qual stack final de frontend/backend sera adotada para aceleracao inicial?
- Quais requisitos nao-funcionais sao obrigatorios na primeira release (SLA, observabilidade, seguranca)?

### Areas Needing Further Research
- Estrategia de protecao de conteudo de video com melhor custo-beneficio.
- Modelo de armazenamento e distribuicao de materiais de apoio.
- Padrao final de autenticacao e autorizacao para admin e usuario final.
- Estrategia de prompts, custo por uso e fallback para indisponibilidade da API Gemini.

## Appendices
### A. Research Summary
- Documento base: `netflix-course-workflow.md` (fluxos, escopo funcional, roadmap e requisitos visuais).
- Documento de extracao: `docs/design-system-extraction.md` (insumos de tokens/componentes para migracao ao pacote canonico).

### B. Stakeholder Input
- Usuario definiu modo YOLO.
- Nome do produto: Flix.
- Publico primario: infoprodutores.
- Escopo MVP: integralmente descrito no documento legado.
- Itens fora de escopo: nenhum explicitamente definido.

### C. References
- `netflix-course-workflow.md`
- `docs/design-system-extraction.md`
- `README.md`

## Next Steps
1. Definir KPIs de 90 dias para fechar criterios quantitativos de sucesso.
2. Gerar PRD a partir deste brief.
3. Quebrar MVP em milestones tecnicos por sprint no monorepo (`apps/web`, `apps/admin`, `services/api`, `packages/design-system`).
4. Iniciar implementacao pelo nucleo operacional (auth + eventos + aulas + catalogo + player + bloqueio temporal).
