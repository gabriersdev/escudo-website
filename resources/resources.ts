const siteUrl = "https://escudo.sabara.app.br";

const contacts = {
  "mail": "gabriel@lts.app.br",
  "repo": "https://github.com/gabriersdev/escudo-website",
}

import {dictionary} from "./dictionary";

const headerNavigation = [
  [dictionary.header.home, '/'],
  [dictionary.header.about, '/about'],
  [dictionary.header.authors, '/authors'],
  [dictionary.header.collection, '/collection'],
];

const appConfigs = {
  "app-name": "Escudo",
  "app-name-slug": "escudo-website",
  "title": "Escudo - Educação em Segurança Cibernética para uso digital online | Siga @escudo.ifmg no Instagram",
  "description": "O projeto Escudo tem como objetivo conscientizar a comunidade externa sobre a importância de adotar práticas seguras no uso da internet. A iniciativa aborda os principais riscos presentes no ambiente digital e apresenta formas de prevenção para uma navegação mais segura e responsável. Aqui no nosso site, você pode conferir notícias, artigos e conteúdos do Escudo com mais detalhes e informações do que nas nossas publicações do Instagram.",
  "locale": "pt-BR",
  "timezone": "America/Sao_Paulo",
  "datetime-format": "YYYY-MM-DD HH:mm:ss",
  "UTC": -3,
  "UTC2": -180,
  "timeFormat": "HH:mm",
  "timeFormatFriendly": "HH[h]mm"
}

const numberConfigs = {
  lang: "pt-BR",
  fixed: 2
}

const newsletterConfigs = {
  "visible": true,
  "endpoint": "",
  "method": "POST",
  "params": "",
}

export {
  appConfigs,
  contacts,
  headerNavigation,
  newsletterConfigs,
  numberConfigs,
  siteUrl,
}
