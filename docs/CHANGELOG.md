# Changelog

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
