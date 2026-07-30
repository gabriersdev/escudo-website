# Versionamento Automático (Semantic Release)

Este documento descreve o funcionamento do processo de versionamento automático do projeto utilizando o **semantic-release**, detalhando os arquivos de configuração `.releaserc` e o workflow do GitHub Actions `.github/workflows/auto-version.yaml`, bem como as configurações necessárias no repositório.

## 1. O Workflow do GitHub Actions (`auto-version.yaml`)

O workflow configurado em [auto-version.yaml](../.github/workflows/auto-version.yaml) automatiza o processo de versionamento e criação de releases toda vez que um código é integrado à branch principal.

### Como funciona:
- **Gatilho (Triggers):** O workflow é executado automaticamente em eventos de `push` para a branch `main`.
- **Permissões (`permissions`):** O job necessita de permissões elevadas para poder criar tags, publicar releases e possivelmente interagir com pull requests e issues. No arquivo, estão configuradas:
  - `contents: write` (necessário para criar a tag git e a release).
  - `issues: write`
  - `pull-requests: write`
- **Passos (Steps):**
  1. **Checkout:** Utiliza `actions/checkout@v4` com `fetch-depth: 0`. O `fetch-depth: 0` é essencial pois o semantic-release precisa de todo o histórico do Git (commits e tags anteriores) para conseguir analisar e definir a próxima versão corretamente.
  2. **Setup Node:** Configura o ambiente com o Node.js versão 22.
  3. **Instalação:** Executa `npm ci` para instalar as dependências do projeto.
  4. **Execução:** Roda `npx semantic-release`. O script utiliza a variável de ambiente `GITHUB_TOKEN` injetada pelo GitHub Actions para autenticar as operações do bot na plataforma.

## 2. O Arquivo de Apoio (`.releaserc`)

O arquivo [.releaserc](../.releaserc) na raiz do projeto é responsável por definir o comportamento da ferramenta `semantic-release`.

### Configurações principais:
- **`branches`**: Define em quais branches o semantic-release deve atuar e monitorar.
  > [!WARNING]
  > Atualmente o `.releaserc` está configurado para `["master"]`, porém o gatilho do GitHub Actions (`auto-version.yaml`) aponta para a branch `main`. **Para o processo funcionar, ambos devem apontar para a mesma branch** (recomenda-se alterar `"master"` para `"main"` no `.releaserc`).
- **`tagFormat`**: Define o formato da tag Git gerada. Com `${version}`, as tags criadas seguirão apenas o formato numérico sem prefixo (ex: `1.0.0`). Caso quisesse usar um prefixo `v`, a configuração seria `v${version}`.
- **`plugins`**: A lista de plugins determina os passos do pipeline executado pelo `semantic-release`:
  1. **`@semantic-release/commit-analyzer`**: Analisa as mensagens de commit (utilizando o padrão [Conventional Commits](https://www.conventionalcommits.org/)) para determinar qual será o impacto da próxima versão (`patch` para correções com `fix:`, `minor` para features com `feat:`, ou `major` para `BREAKING CHANGE`).
  2. **`@semantic-release/release-notes-generator`**: Gera as "release notes" (notas de lançamento) automaticamente com base nas mensagens de commit formatadas, agregando e categorizando as mudanças.
  3. **`@semantic-release/changelog`**: Cria ou atualiza automaticamente o arquivo `CHANGELOG.md` na raiz do repositório, garantindo um histórico de versões contínuo.
  4. **`@semantic-release/github`**: Interage com a API do GitHub para criar de fato a tag no Git, publicar a Release na aba "Releases" do GitHub e, opcionalmente, comentar nas issues e PRs que foram solucionados na versão recém-lançada.

## 3. Configurações Necessárias no GitHub

Para que o workflow do `semantic-release` funcione adequadamente, sem falhar por questões de segurança ou falta de permissões, é necessário verificar as seguintes configurações no repositório do GitHub:

1. **Permissões de Workflow (Workflow Permissions):**
   - Acesse **Settings > Actions > General** no repositório.
   - Na seção *Workflow permissions*, a opção **"Read and write permissions"** deve estar obrigatoriamente selecionada. Se estiver configurado como "Read repository contents and packages permissions", o workflow falhará no momento de publicar a tag, criar a release ou atualizar o `CHANGELOG.md`.
   - Adicionalmente, verifique se a caixa **"Allow GitHub Actions to create and approve pull requests"** está marcada logo abaixo, caso o fluxo de CI envolva PRs ou o bot de release precise criar PRs.

2. **Uso de Conventional Commits:**
   - O modelo do projeto depende do padrão **Conventional Commits** (ex: `feat: adiciona login`, `fix: resolve falha na api`). Se os desenvolvedores inserirem commits na branch principal que não sigam essa convenção (ou se as pull requests forem mergeadas usando *Squash and merge* com uma mensagem arbitrária), o `commit-analyzer` não considerará a mudança digna de uma nova versão e **nenhuma release será disparada**.

3. **Consistência do Nome das Branches:**
   - Assegure-se de que a branch principal utilizada no ambiente do GitHub seja rigorosamente a mesma definida no array `branches` do `.releaserc` e no gatilho `on.push.branches` do workflow `auto-version.yaml`.
