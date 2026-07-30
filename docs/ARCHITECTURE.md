# Arquitetura do Journal

O projeto utiliza Next.js com App Router. Os conteúdos das matérias são escritos em formato MDX e processados em Server Components.

## Fluxo de Renderização MDX
1. Os arquivos de conteúdo (matérias) são armazenados em `app/posts/` com a extensão `.mdx`.
2. O utilitário `libs/mdx.ts` utiliza o pacote `gray-matter` para extrair os meta-dados (*Frontmatter*) e o corpo do texto de cada arquivo.
3. A página de listagem `app/page.tsx` lê todos os posts, ordena-os por data e exibe resumos em componentes como `FeaturedPost` e `PostCard`.
4. A página de leitura `app/[slug]/page.tsx` faz o matching dinâmico do *slug* na URL com o nome do arquivo, e usa o `next-mdx-remote` para compilar o conteúdo MDX para HTML.

## Estrutura de Componentes
Seguindo o design limpo:
- `header.tsx`: Navegação principal.
- `footer.tsx`: Rodapé.
- `sidebar.tsx`: Coluna lateral da home com tópicos e posts em destaque.
- `featured-post.tsx`: Post grande da página inicial.
- `post-card.tsx`: Lista de posts menores.
- `newsletter.tsx`: Bloco de conversão de emails.
- `share-button.tsx`: Botão de compartilhamento que utiliza Web Share API ou a área de transferência.

## Estilização
Utilizamos TailwindCSS. A formatação visual dos conteúdos MDX não utiliza plugins externos como o `@tailwindcss/typography`. Em vez disso, a renderização do MDX é envelopada pela classe `markdown-content` em `app/[slug]/page.tsx`. Todas as definições de tipografia, espaçamento de parágrafos, cores de cabeçalhos, listas, imagens e blocos de código correspondentes a essa classe encontram-se estritamente definidas de forma manual no arquivo global `style/styles.css`, para manter um controle apurado do *design system*.

## Pesquisa e Filtros (Modal de Busca)
- `search-modal.tsx`: Componente utilizando a tag nativa `<dialog>` HTML5.
  - **Controle de Estado:** A abertura e fechamento são controlados nativamente via métodos de DOM (`showModal()` e `close()`) acessados por meio de um `useRef`. Um event listener nativo monitora o evento `close` da tag `<dialog>` para garantir sincronia bidirecional com o estado React (como fechamentos via tecla `Esc`).
  - **Otimização:** A lista de tópicos únicos para sugestão é derivada e memoizada com `useMemo`, evitando recálculo de array em iterações de filtro.
  - **Estilização e Acessibilidade:** A visibilidade é controlada garantindo perfeita acessibilidade e foco. A interface com efeito de desfoque é atingida de forma nativa e semântica através da pseudo-classe `backdrop:` (ex: `backdrop:backdrop-blur-sm`). A listagem permite busca em tempo real nos metadados (*title*, *description* e *topic*).

## Roteamento de Tópicos
- `app/topic/[topic-name]/page.tsx`: Página de arquivo que lista todos os posts de um tópico específico. Recebe o parâmetro dinâmico da URL de forma assíncrona (Next.js 15+), realiza um processo de "slugificação" para garantir a comparação resiliente entre o nome da URL e os tópicos declarados nos MDXs, e exibe as listagens num formato espelhado à seção principal.

## Roteamento de Autores
- `libs/authors.ts`: Configuração centralizada dos autores.
- `app/authors/page.tsx`: Página que lista todos os autores cadastrados.
- `app/author/[slug]/page.tsx`: Rota dinâmica (Next.js 15+) que lista os posts específicos de um autor. Reutiliza o componente `Sidebar`, porém injeta os dados do autor (foto, nome e bio) no lugar das informações gerais do "The Journal".

## Centralização de Recursos (Single Source of Truth)
- `resources/resources.ts`: Arquivo que atua como a única fonte da verdade para as configurações globais estáticas do sistema (nome do site, URLs, fuso horário, metadados de contato e configurações de formatação).
- `resources/dictionary.ts`: Arquivo centralizado que armazena todos os pequenos textos (strings) da interface de usuário (UI). Desacopla as *hardcoded strings* dos componentes React, garantindo que o sistema possua infraestrutura nativa e imediata para internacionalização e localização (i18n).
- **Conteúdos Base em Markdown**: Textos extensos (como os da página *About*, *Privacy* e o guia no rodapé dos posts) foram isolados em arquivos `.md` puros (`about.md`, `privacy.md`, `guide.md`) dentro da pasta `resources`. Diferente dos posts regulares, esses arquivos não possuem metadados (Frontmatter) e são lidos sincronicamente no servidor via módulo nativo `fs` (ex: `fs.readFileSync`), sendo então injetados dinamicamente no componente `MDXRemote`.
- **Objetivo Arquitetural**: A existência desta pasta e seus respectivos arquivos evita o uso de valores "chumbados" no código. Qualquer alteração de idioma, formatações base, metadados ou páginas estáticas reflete instantaneamente em toda a aplicação sem a necessidade de modificar múltiplos arquivos da interface visual.

## Geração Automática de Feeds (RSS)
- `app/rss.xml/route.ts`: Rota de API (Route Handler) nativa do Next.js responsável por interceptar requisições ao arquivo `rss.xml`.
- **Dinamicidade**: Lê os conteúdos MDX através de `getPosts()` e os metadados globais em `resources.ts`, gerando o arquivo XML do RSS Feed na versão 2.0 dinamicamente, mantendo o feed sempre atualizado com as novas publicações e dados do autor sem a necessidade de compilação estática manual prévia.
- **Tratamento de Datas**: O parser de datas (`moment`) recebe um formato de entrada explícito (`DD MMM YYYY`) correspondente aos metadados dos posts para evitar alertas de *fallback* e inconsistências de conversão na engine de build do Next.js.

## Geração Automática de Sitemap (SEO)
- `app/sitemap.ts`: Rota especial do ecossistema Next.js (`MetadataRoute.Sitemap`) que intercepta requisições para `sitemap.xml`.
- **Funcionamento**: A função de renderização coleta programaticamente todas as postagens publicadas através do método `getPosts()` e combina suas URLs (junto a rotas estáticas como a homepage e `/blog`) retornando um objeto iterável estruturado. O Next.js então formata esse retorno nativamente para o padrão XML de SEO utilizado pelos indexadores globais.
- **Tratamento de Datas**: Assim como na geração de RSS, a extração do `lastModified` especifica explicitamente o formato `DD MMM YYYY` ao transformar a string do arquivo MDX, prevenindo o comportamento padrão instável do construtor de `Date` que gera avisos de *deprecation*.
