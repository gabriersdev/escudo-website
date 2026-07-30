# Regras de Negócio do Journal

## Metadados do Post (Frontmatter)
Todo arquivo `.mdx` em `app/posts` DEVE conter os seguintes metadados em seu cabeçalho (*frontmatter*):
- `title`: (Obrigatório) Título da matéria.
- `description`: (Obrigatório) Resumo da matéria, usado nos cards e na página inicial.
- `date`: (Obrigatório) Data de publicação. DEVE seguir rigorosamente o formato `DD MMM YYYY` (ex: `28 JUL 2026`) para que o sistema consiga interpretá-la corretamente sem gerar erros de *fallback* na biblioteca de datas (`moment`).
- `author`: (Opcional, Padrão = "The Journal") Autor da matéria. Deve corresponder a um autor cadastrado em `libs/authors.ts`.
- `readTime`: (Opcional, Padrão = "1 MIN READ") Tempo de leitura estimado.
- `image`: (Opcional) URL da imagem de capa. Se não fornecida, exibe-se um placeholder genérico.
- `featured`: (Opcional, booleano) Se verdadeiro (`true`), a matéria será exibida com destaque na página inicial (a primeira que tiver true é escolhida).
- `topic`: (Opcional, Padrão = "General") A categoria/tópico ao qual a matéria pertence.

## Sistema de Autores
- Todos os autores da plataforma devem estar centralizados no arquivo `libs/authors.ts`.
- O sistema disponibiliza um diretório de autores em `/authors`.
- Cada autor possui uma página individual gerada de forma dinâmica em `/author/[slug]`, que filtra e lista todos os posts cuja autoria coincida com o nome dele.
- Na página individual de um autor, a `Sidebar` substitui o bloco "About" pelo perfil (nome, biografia, foto) do autor correspondente.
- Nas páginas `/about` e `/authors`, a seção "About" da `Sidebar` é ocultada automaticamente para evitar redundância de informações.

## Geração de Tópicos
O componente lateral (Sidebar) coleta a lista de tópicos dinamicamente:
- A função lê todos os posts e agrupa pela propriedade `topic`.
- Apenas tópicos que possuem 1 ou mais posts cadastrados aparecerão na lista lateral.
- A contagem apresentada ao lado do nome do tópico (ex: "7 issues") reflete o total de matérias publicadas no formato mdx com aquele tópico exato.

## Comportamento da Página Inicial
- O maior post de destaque (`FeaturedPost`) escolhe automaticamente o post mais recente marcado com `featured: true`. Se nenhum post tiver a flag `featured`, o post mais recente no geral será usado.
- A sessão "MORE ISSUES" carrega os posts restantes (excluindo o principal).
- A sessão "Features" da barra lateral (Sidebar) apresenta no máximo os 4 posts mais recentes (excluindo o principal).

## Busca Dinâmica e Navegação por Tópicos
- **Slugificação de Tópicos**: Para garantir a correspondência precisa entre a URL e o conteúdo, tanto o parâmetro da rota de tópicos quanto o tópico do post são normalizados durante a filtragem (letras minúsculas e espaços convertidos em hífens).
- **Exibição do Tópico**: Na página de listagem (`/topic/[topic-name]`), o sistema tenta resgatar a grafia e capitalização originais a partir da propriedade `topic` do primeiro post encontrado. Como plano de contingência (*fallback*), os hífens são convertidos em espaços com a primeira letra maiúscula.
- **Sugestões de Tópicos**: O modal de pesquisa exibe dinamicamente até 10 "badges" únicos de tópicos reais extraídos do repositório de posts caso a pesquisa atual do usuário não retorne correspondências, servindo como uma sugestão rápida de navegação. Ao clicar nessas sugestões, o modal se encerra automaticamente e o usuário é redirecionado para a respectiva página do tópico, evitando "becos sem saída" na navegação.

## Geração de Sitemap (SEO)
O sistema mantém uma listagem XML padronizada de URLs dinamicamente atualizada para motores de busca:
- **Rotas Mapeadas**: O sitemap engloba rotas institucionais e principais (ex: a homepage principal com peso máximo, e o índice do `/blog`), adicionadas estaticamente.
- **Injeção Dinâmica de Postagens**: Todo post convertido de `.mdx` ganha instantaneamente uma entrada correspondente no sitemap sem intervenção manual.
- **Data de Atualização (`lastModified`)**: A marcação de tempo reflete a data estipulada no *frontmatter* (`date`) de cada post, indicando ao motor de busca o frescor exato do conteúdo. Caso um artigo não exiba data explícita, a data atual do momento de construção é empregada como fallback (baseada no utilitário de formatação central configurado em `resources.ts`).
- **Indexação Limpa**: O sitemap prioriza o uso estrito do domínio canônico (o `siteUrl`), garantindo que barras extras de concatenação ou domínios inconsistentes não provoquem quebras de link ou duplicidade SEO.

## Formatação Visual dos Posts
Todos os artigos escritos nos arquivos MDX utilizam o conjunto de regras globais definidas na classe `.markdown-content`. Novas postagens não exigem inclusão de classes embutidas em HTML, devendo utilizar puramente a notação padrão do Markdown (como `#` para títulos, `*` para listas, `> ` para citações, aspas tortas para código, etc), visto que o design system da página cuidará de estilizá-los perfeitamente no momento da renderização.

## Navegação e Compartilhamento de Posts
- Ao final de cada leitura de post (`/[slug]`), o sistema exibe dinamicamente links para o "Post Anterior" (mais antigo cronologicamente) e "Próximo Post" (mais novo). Essa conta é feita com base na posição do post atual dentro do array gerado por `getPosts()`, que já vem ordenado descrescentemente por data.
- Se o usuário estiver no post mais antigo, o botão de "Post Anterior" desaparece (e vice-versa para o mais novo).
- Cada post contém um botão de Compartilhamento. Este botão deve tentar invocar a Web Share API (`navigator.share()`). Em navegadores ou dispositivos não suportados, ele deve atuar como um botão de "Copiar Link", salvando a URL do post na área de transferência (`navigator.clipboard`) e alterando o status visual para "Copiado!" temporariamente por 2 segundos.

## Parâmetros e Configurações Globais (Resources)
- **Proibição de Hardcode**: Toda configuração estática de sistema (como nome do app, idioma, regras de formatação de datas, contatos e fuso horário) NÃO PODE ser inserida como valor literal (*hardcoded*) diretamente nos componentes React ou funções utilitárias.
- **Uso Obrigatório**: Estes dados DEVEM obrigatoriamente ser importados e consultados a partir dos objetos globais exportados em `resources/resources.ts`.
- **Novas Configurações**: Quaisquer novas configurações não-dinâmicas que impactem o projeto como um todo devem ser incluídas nesse mesmo diretório e arquivo para manter a padronização e facilitar futuras manutenções unificadas.

## RSS Feed Automático
- O arquivo `rss.xml` é mapeado de forma dinâmica. A plataforma disponibiliza o conteúdo mais recente na forma de um feed (RSS 2.0) sem exigir novos *builds* de produção exclusivos.
- **Sem Intervenção Manual**: Nenhuma intervenção manual é necessária para a atualização deste arquivo XML. Todos os dados da estrutura XML (*title*, *description*, *author* e *date*) são injetados de forma automática em tempo real através do uso das propriedades declaradas em `resources.ts` e do *frontmatter* dos arquivos `.mdx`.
- **Consistência de Data**: Para efeitos de padronização, a publicação RSS sempre usará a conversão universal UTC oriunda das informações literais de data presentes no cabeçalho das postagens. O sistema de *parsing* (`moment`) é explicitamente configurado para ler as datas no formato exato `DD MMM YYYY` das matérias, garantindo que não haja avisos de depreciação (*deprecation warnings*) ou falhas na conversão da string original.
