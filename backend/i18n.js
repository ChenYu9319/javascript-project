// i18n.js
const i18next = require('i18next');
const middleware = require('i18next-http-middleware');
const zh = require('./locales/zh.json');
const en = require('./locales/en.json');

i18next
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'zh',
    resources: {
      zh: { translation: zh },
      en: { translation: en }
    },
    detection: {
      order: ['header', 'querystring'], // 优先从 Header (Accept-Language) 读取，其次是 URL 参数 ?lng=en
      lookupHeader: 'accept-language'
    }
  });

module.exports = { i18next, middleware };