import { getQueryString } from './querystring.js';

const locales = {
  'en-US': '../locale/en-US.json',
  'zh-TW': '../locale/zh-TW.json'
};

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export async function i18n(language) {
  for (var x in locales) {
    const data = await fetchData(locales[x])
    locales[x] = data
  }

  const lang = language || getQueryString('hl') || navigator.language;
  const keysData = locales[lang] || locales['en-US'];
  const getLangKey = (key, obj) => {
    if (obj) {
      return keysData[key].replace(/\{(\w+)\}/g, (match, key) => obj[key]);
    } else {
      return keysData[key];
    }
  }
  return { getLangKey };
}

/**
 *
 * @param {*} domScope
 * this is for i18n content render
 * use in loadFetch & html content load
 * avoid call before i18n()
 */
export function i18nContentRender(domScope) {
  domScope.forEach((item, index) => {
    let key = item.getAttribute('data-i18n-key');
    let value = item.getAttribute('data-i18n-value');
    let placeholder = item.getAttribute('data-i18n-placeholder');
    let title = item.getAttribute('data-i18n-title');
    if (key) {
      item.innerText = window.translate.getLangKey(key);
    }
    if (value) {
      item.setAttribute('value', window.translate.getLangKey(value));
    }
    if (placeholder) {
      item.setAttribute('placeholder', window.translate.getLangKey(placeholder));
    }
    if (title) {
      item.setAttribute('title', window.translate.getLangKey(title));
    }
  })
}
