import { env } from './utils/env.js';
import { loadFetch } from './utils/loadFetch.js';
import { SimpleStore } from './utils/simpleStore.js';
import { i18n, i18nContentRender } from './utils/i18n.js';

export async function initialize() {
  window.env = env();
  window.loadFetch = loadFetch;
  window.simpleStore = new SimpleStore();
  window.translate = await i18n();

  i18nContentRender(document.querySelectorAll('body *'));
}