const siteUrl = "https://your-url.com";

const contacts = {
  "mail": "your-email@domain.com",
  "repo": "#",
}

const appConfigs = {
  "app-name": "The Journal",
  "app-name-slug": "the-journal",
  "title": "The Journal - Thoughts, stories and ideas",
  "description": "The latest issues, stories, and ideas from The Journal.",
  
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
  newsletterConfigs,
  numberConfigs,
  siteUrl,
}
