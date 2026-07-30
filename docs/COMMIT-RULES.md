# Regras de Commit

Este documento descreve as regras de commit para o projeto.

## Padrão de Commits

Utilizamos o padrão [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) para as mensagens de commit. Isso nos ajuda a ter um histórico de commits mais legível e a automatizar a geração de changelogs.

O formato geral de uma mensagem de commit é:

```
<tipo>[escopo opcional]: <descrição>

[corpo opcional]

[rodapé opcional]
```

## Automação com Husky

O projeto utiliza o [Husky](https://typicode.github.io/husky/) para automatizar a verificação das regras de commit através de hooks do Git. Os hooks ativados estão na pasta `.husky/`.

### Hook `pre-commit`

Antes de cada commit, o hook em `.husky/pre-commit` é executado. Ele dispara o seguinte comando:

```bash
npm run test
```

Isso garante que todos os testes automatizados passem antes que uma alteração seja integrada ao histórico do projeto, prevenindo a introdução de regressões.

### Hook `commit-msg`

Após a mensagem de commit ser escrita, o hook em `.husky/commit-msg` é acionado. Ele utiliza o [commitlint](https://commitlint.js.org/) para validar se a mensagem segue o padrão Conventional Commits. O comando executado é:

```bash
npx --no -- commitlint --edit $1
```

Se a mensagem de commit não estiver no formato correto, o commit será abortado.

### Tipos de Commit Permitidos

A configuração do `commitlint` se encontra no arquivo `commitlint.config.js` e define os seguintes tipos de commit permitidos:

*   `feat`: Uma nova feature
*   `fix`: Uma correção de bug
*   `docs`: Mudanças na documentação
*   `test`: Adicionando ou corrigindo testes
*   `build`: Mudanças que afetam o sistema de build ou dependências externas
*   `perf`: Uma mudança de código que melhora a performance
*   `style`: Mudanças que não afetam o significado do código (espaços em branco, formatação, etc)
*   `refactor`: Uma mudança de código que não corrige um bug nem adiciona uma feature
*   `chore`: Outras mudanças que não modificam o código fonte ou os testes
*   `del`: Remoção de código
*   `ci`: Mudanças nos arquivos e scripts de CI
*   `raw`: Commits brutos
*   `cleanup`: Limpeza de código
*   `remove`: Remoção de arquivos
*   `dev`: Commits de desenvolvimento
