export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'test',
        'build',
        'perf',
        'style',
        'refactor',
        'chore',
        'del',
        'ci',
        'raw',
        'cleanup',
        'remove',
        'dev'
      ]
    ]
  }
};
