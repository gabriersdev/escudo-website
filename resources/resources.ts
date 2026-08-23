const siteUrl = "https://escudo.sabara.com";

const contacts = {
  "mail": "gabriel@lts.app.br",
  "repo": "https://github.com/gabriersdev/escudo-website",
}

import { dictionary } from "./dictionary";

const headerNavigation = [
  [dictionary.header.home, '/'],
  [dictionary.header.about, '/about'],
  [dictionary.header.authors, '/authors'],
  [dictionary.header.collection, '/collection'],
];

const appConfigs = {
  "app-name": "Escudo",
  "app-name-slug": "escudo-website",
  "title": "Escudo - Educação em Segurança Cibernética para uso digital online",
  "description": "As notícias, artigos e postagens do Escudo.",
  
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
