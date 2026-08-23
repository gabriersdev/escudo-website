# Changelog

## [Atualização Recente] - Correção de Parseamento de Datas com Moment.js

### Modificado
- **Parseamento Explícito de Datas em MDX**: A função de leitura e listagem de postagens (`libs/mdx.ts`) foi corrigida para usar importação estática do locale `pt-br` do *Moment.js* e definir a máscara de formato explícita `['DD MMM YYYY', moment.ISO_8601]` durante o *parsing* da data de publicação (`metadata.date`). Isso resolve o problema onde matérias antigas com data em português (ex: "20 AGO 2026") resultavam em *Invalid Date* devido ao fallback silencioso para a API nativa de Date do JS, impedindo que as postagens fossem listadas na página inicial.
- **Limpeza de TODO**: Remoção do comentário `TODO` pendente no post `como-funciona-um-antivirus-e-por-que-e-preciso-usar-um.mdx`, validando que a postagem agora é corretamente parseada, listada e renderizada.

## [Atualização Recente] - Manipulação Segura de Datas e Cálculo Autônomo de Leitura (MDX)

### Adicionado
- **Cálculo Autônomo de Tempo de Leitura**: O parser primário de postagens (`libs/mdx.ts`) foi expandido para calcular inteligentemente e em tempo real a estimativa de tempo de leitura baseada no peso textual da matéria (`words / 200`). Este cálculo consome a nova máscara injetada `dictionary.post.readingTime`, substituindo valores *hardcoded* legados e viabilizando a adaptação via i18n sem conflitos arquiteturais.

### Modificado
- **Manipulação Segura de Datas (MDX)**: A lógica de filtro, ordenação e conversão de datas nativas das publicações passou a utilizar exclusivamente a API do `Moment.js`, importando dinamicamente a constante `appConfigs.locale` (`pt-BR`). Isso resolve flutuações, datas mal formatadas e deságios de fuso horário, substituindo o antigo e errático construtor `new Date()`.
- **Diretrizes Atualizadas**: Em resposta à arquitetura imposta pelas correções acima, foram adicionados dois novos parágrafos em `docs/CODING-GUIDELINES.md` documentando explicitamente os requerimentos rigorosos para `Manipulação de Datas` e `Estimativa de Tempo de Leitura`.

## [Atualização Recente] - Centralização de Textos na Página de Privacidade

### Modificado
- **Textos Institucionais Dinâmicos**: A página de Privacidade (`app/privacy/page.tsx`) foi atualizada para consumir os textos estáticos do componente `<PageHeading>` (título e descrição) diretamente da estrutura do `dictionary.ts`. Isso substitui o texto *hardcoded* "Data + privacy" e resolve a pendência arquitetural de alinhamento com as convenções de i18n do projeto.

## [Atualização Recente] - Resiliência e Validação no Sitemap

### Modificado
- **Validação Estrita de Datas (Sitemap)**: O gerador de sitemap (`app/sitemap.ts`) foi refatorado para assegurar que apenas datas válidas sejam fornecidas aos mecanismos de busca. Utilizando o método `.isValid()` do *Moment.js*, o sistema agora verifica se a data informada nos metadados do post (`metadata.date`) é parseável (nos formatos esperados). Caso contrário, ele realiza um *fallback* inteligente e seguro para a data e hora atuais da build (variável `lastModified`), prevenindo o erro de geração de *"Invalid date"* no XML final.

## [Atualização Recente] - Responsividade dos Banners no Componente Base

### Modificado
- **Responsividade dos Banners (Base)**: O componente `components/base.tsx` foi atualizado para gerenciar a responsividade condicional das seções de *Newsletter* e *Instagram*. O layout padrão agora flui em colunas (uma sobre a outra) em dispositivos menores que 1120px e altera dinamicamente para exibição lado-a-lado (linhas) em resoluções maiores, resolvendo a pendência deixada anteriormente.

## [Atualização Recente] - Refatoração de Navegação e Estilização Ativa

### Adicionado
- **Estilização Ativa de Navegação**: Criação do componente cliente `components/header-nav.tsx` que utiliza `usePathname()` para aplicar dinamicamente o estilo de foco (cor azul, idêntica ao estado de _hover_) ao link correspondente à página atualmente acessada.

### Modificado
- **Centralização de Links de Navegação**: Extração da lista *hardcoded* de itens de navegação do componente `Header` para o arquivo de recursos central `resources/resources.ts`, integrando as definições do dicionário (i18n) conforme as diretrizes do projeto.
- **Refatoração do Cabeçalho**: O componente `components/header.tsx` foi atualizado para consumir o novo `<HeaderNav />`, removendo a lógica excessiva do componente e resolvendo as pendências (TODOs) deixadas anteriormente.

## [Atualização Recente] - Refatoração de Layout e Otimizações de Componentes

### Adicionado
- **Componente Base (Layout)**: Criação do componente estrito `components/base.tsx` com propriedades de comportamento visual (`hideNewsletter`, `hideInstagram`) para padronizar e encapsular a estrutura base das páginas.
- **Geração Dinâmica de Mídia (ImageGrid)**: Adicionadas propriedades `baseUrl`, `fileName` (com o placeholder `[]`) e `range` no componente `ImageGrid` para processamento e geração de URLs dinâmicas para postagens ricas em mídia, reduzindo blocos massivos de texto em MDX.
- **Feedback Visual Avançado (ImageGrid)**: Inclusão de um bloco de alerta visual (UI *fallback*) acionado caso a declaração de metadados do grid de imagens contenha divergências ou desrespeite validações do sistema.
- **Acessibilidade Dinâmica de Imagens**: Introdução da propriedade opcional `altContext` no `ImageGrid` para fornecer suporte unificado e dinâmico às tags `alt` geradas para leitores de tela.

### Modificado
- **Refatoração Estrutural das Páginas**: Atualização em lote de todas as rotas primárias e dinâmicas (`app/page.tsx`, `app/[slug]/page.tsx`, `app/author/`, `app/topic/`, etc) para adoção irrestrita do componente `<Base>`, eliminando imports dispersos e redundância sintática.
- **Centralização SEO e Metadados**: Extração final e localização de textos estáticos e lógicas de SEO (`title`, `description` e formatadores plurais de pesquisas) das páginas e de tópicos (`topic/[topic-name]`) para armazenamento direto e padronizado em `resources/dictionary.ts`.
- **Diretrizes de Projeto**: Documentação e formalização da convenção estrita de metadados no arquivo de regras do projeto (`docs/CODING-GUIDELINES.md`).


## [Atualização Recente] - Componentes Interativos no MDX (ImageGrid)

### Adicionado
- **Renderização Dinâmica no MDX**: Criação do dicionário `components/mdx-components.tsx` para injetar componentes React customizados nativamente dentro dos arquivos de postagem.
- **Componente ImageGrid**: Implementação de um layout dinâmico em grade para os posts. Suporta recebimento resiliente de parâmetros em string (`urls="img1,img2"`) para contornar limitações e bugs silenciosos do compilador interno de MDX.
- **Efeito Lightbox (Expansão de Mídia)**: Integração de visualização expandida de imagens (modo "tela cheia") através da tag nativa `<dialog>`, reaproveitando as garantias de acessibilidade e isolamento (com foco e travamento de tela) da aplicação central.
- **Placeholder Nativo de Carregamento**: Implementação de renderização imediata com uma minúscula imagem Base64 cinza (via propriedade `blurDataURL` do `next/image`), resolvendo os pulos e flashes visuais comuns durante o *lazy loading*.

### Modificado
- **Páginas Híbridas e Institucionais**: Atualização das rotas base `app/[slug]/page.tsx`, `app/about/page.tsx` e `app/privacy/page.tsx` para passar o dicionário de componentes globais (`mdxComponents`) diretamente à camada do `<MDXRemote>`.

## [Atualização Recente] - Segurança e Validação de Newsletter

### Adicionado
- **Arquitetura de Honeypot**: Inclusão de um input invisível no componente `NewsletterForm` (`components/newsletter.tsx`) para capturar submissões feitas por robôs de spam automatizados.
- **Token Criptografado (AES-256-CBC)**: Implementação de assinatura e verificação criptográfica estrita entre o cliente e o servidor. A submissão da newsletter exige uma transação assinada e validada antes de ser encaminhada, impedindo abusos via engenharia reversa.
- **Rota de API do Back-end**: Criação de `app/api/newsletter/route.ts` atuando como a camada de validação e *proxy* que desencripta a transação e encaminha o e-mail validado para o endpoint real (`NEWSLETTER_ENDPOINT`).
- **Utilitário de Chaves**: Criação de um script Node.js (`scripts/generate-newsletter-keys.mjs`) que gera automaticamente as chaves fortes (`NEXT_PUBLIC_HASH_VALIDATION_TRANSACTION` e `HASH_VALIDATION_TRANSACTION`) para implantação no ambiente de produção (`.env`).

### Modificado
- **Componente Newsletter**: Refatoração estrutural de `components/newsletter.tsx` para abandonar o comportamento passivo de alerta, controlando gerencialmente os estados de UI (`idle`, `loading`, `success`, `error`) e o novo payload criptografado baseado na inatividade da armadilha *honeypot*.
- **Dicionário (i18n)**: Atualização do `resources/dictionary.ts` para suportar nativamente as mensagens das novas validações e estados.
## [Atualização Recente] - Internacionalização (i18n) e Centralização de Textos

### Adicionado
- **Dicionário Centralizado**: Criação do arquivo `resources/dictionary.ts` para armazenar todas as pequenas strings (textos da interface) do projeto de forma centralizada e estruturada.
- **Conteúdos Base em Markdown**: Criação dos arquivos `.md` independentes (`about.md`, `privacy.md` e `guide.md`) dentro da pasta `resources` para extrair e gerenciar grandes blocos de textos, separados da interface visual.

### Modificado
- **Componentes e Páginas Dinâmicos**: Refatoração de todos os componentes (Header, Footer, Sidebar, Newsletter, Modais de Busca) e páginas principais (Home, About, Privacy, Postagens) para consumirem os textos via propriedades do dicionário ou leitura direta dos arquivos `.md` utilizando a API nativa `fs` e `MDXRemote`, eliminando *hardcoded strings*. Isso prepara totalmente a fundação do projeto para a implementação de múltiplos idiomas (i18n).

## [Atualização Recente] - Sistema de Autores e Navegação de Posts

### Adicionado
- **Sistema de Autores**:
  - Configuração centralizada de autores em `libs/authors.ts`.
  - Página de diretório de autores em `/authors`.
  - Páginas individuais dinâmicas para cada autor em `/author/[slug]`, listando apenas os posts criados por eles.
- **Navegação de Posts**:
  - Adicionado links de navegação para o "Post Anterior" e "Próximo Post" ao final de cada leitura de post (`/[slug]`).
- **Botão de Compartilhamento**:
  - Criação do componente `ShareButton` que utiliza primariamente a Web Share API nativa e possui fallback robusto para copiar o link via `navigator.clipboard`.

### Modificado
- **Componentização da Sidebar**: O componente `Sidebar` teve suas seções internas extraídas para componentes menores (`SidebarAbout`, `SidebarFeatures`, `SidebarTopics`). Adicionadas propriedades dinâmicas (`author` e `hideAbout`) para maior flexibilidade.
- **Personalização de Contexto (Sidebar)**:
  - Nas páginas de `About` e `Authors`, a seção "About" da barra lateral foi ocultada para evitar redundância visual.
  - Na página de perfil do Autor (`/author/[slug]`), a seção "About" foi substituída dinamicamente pelas informações e foto do autor.
- **Metadados**: Título e descrições otimizados (SEO) para as páginas de `About` e `Authors`.

### Corrigido
- **Next.js 15 Compatibility (Sync Dynamic APIs)**: Resolvido o erro que quebrava o acesso aos parâmetros de rotas dinâmicas (`params.slug`) na rota de autor. Agora, a `Promise` de `params` é corretamente aguardada (`await`) na geração de metadados e na renderização principal do Server Component, conforme padrão estabelecido no Next.js 15.## [Atualização Recente] - Customização de Estilos MDX

### Adicionado
- **Estilos Customizados para MDX**: Criação de regras CSS centralizadas no arquivo `style/styles.css` (aninhadas na classe `.markdown-content`) com suporte a tipografia, cores, espaçamento de parágrafos, listas organizadas, elementos de citação, manipulação de imagens e renderização visual refinada de blocos de código nativos do MDX.

### Modificado
- **Substituição do Renderizador Visual MDX**: A classe `prose` (provinda do plugin oficial de tipografia do Tailwind) foi integralmente substituída pelo wrapper `markdown-content` na leitura dos posts (`app/[slug]/page.tsx`). Com isso, a aplicação passa a ter maior controle autônomo sobre todos os espaçamentos, permitindo estilos específicos e isolados que independem da configuração do Tailwind Typography.

## [Atualização Anterior] - Modal de Pesquisa

### Adicionado
- **Sugestões de Tópicos**: O modal agora exibe badges interativos com sugestões de tópicos (limitado a 10) caso a pesquisa do usuário não retorne nenhum post. Esses badges utilizam as cores do sistema e redirecionam o usuário para a página de tópicos correspondente.
- **Integração com Elemento Nativo**: O modal foi refatorado para utilizar a tag HTML nativa `<dialog>`, garantindo melhor acessibilidade nativa, controle de foco e semântica.
- **Sincronização de Estado**: Adicionado um ouvinte de evento `close` nativo para garantir que o estado do React (`isOpen`) seja sincronizado corretamente caso o modal seja fechado por meios nativos (como a tecla `Esc`).

### Modificado
- **Lógica de Renderização do Modal**: O componente `SearchModal` agora utiliza o método `showModal()` e `close()` do `HTMLDialogElement` através de uma referência (`useRef`), substituindo a renderização condicional baseada em `div` fixa.
- **Estilização do Backdrop**: A camada de fundo opaca com desfoque agora utiliza os pseudo-elementos e utilitários modernos do Tailwind específicos para o elemento de diálogo (`backdrop:bg-gray-900/20 backdrop:backdrop-blur-sm`).
- **Otimização de Performance**: A derivação da lista de tópicos únicos a partir da lista de posts foi otimizada utilizando o hook `useMemo`, prevenindo recálculos desnecessários a cada renderização.
