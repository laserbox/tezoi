import { createTranslator, resolveLanguage, localizeHref } from './i18n-core.js';
import ui from './translations-ui.js?v=rigid-contact-20261106';
import runtime from './translations-runtime.js?v=physical-titles-20261102';
import extra from './translations-runtime-extra.js';
import reports1 from './translations-reports1.js';
import reports2 from './translations-reports2.js';

const translate = createTranslator({ ...reports1, ...reports2, ...runtime, ...extra, ...ui });
const sitePath = new URL('./', import.meta.url).pathname;
const textState = new WeakMap();
const attributeState = new WeakMap();
const hrefState = new WeakMap();
const attributes = ['title', 'alt', 'aria-label', 'aria-valuetext', 'placeholder', 'data-tooltip'];
let remembered;
try { remembered = localStorage.getItem('tezoi-language'); } catch { /* Storage is optional. */ }
let language = resolveLanguage(location.search, remembered);
const excluded = element => !element || !!element.closest('script,style,pre,code,kbd,samp,svg,[translate="no"],[data-i18n-skip]');

function renderText(node) {
  if (excluded(node.parentElement)) return;
  const previous = textState.get(node);
  const source = previous && node.data === previous.rendered ? previous.source : node.data;
  const rendered = translate(source, language);
  if (node.data !== rendered) node.data = rendered;
  textState.set(node, { source, rendered });
}
function renderElement(element) {
  if (excluded(element)) return;
  let state = attributeState.get(element);
  if (!state) { state = new Map(); attributeState.set(element, state); }
  const names = element.tagName === 'META' && /^(?:description|og:title|og:description|twitter:title|twitter:description)$/.test(element.name || element.getAttribute('property') || '') ? [...attributes, 'content'] : attributes;
  for (const name of names) {
    const current = element.getAttribute(name);
    if (current === null) continue;
    const previous = state.get(name);
    const source = previous && current === previous.rendered ? previous.source : current;
    const rendered = translate(source, language);
    if (current !== rendered) element.setAttribute(name, rendered);
    state.set(name, { source, rendered });
  }
  if (element.tagName === 'A' && element.hasAttribute('href') && !element.hasAttribute('download')) {
    const current = element.getAttribute('href');
    const previous = hrefState.get(element);
    const source = previous && current === previous.rendered ? previous.source : current;
    const rendered = localizeHref(source, language, location.href, sitePath);
    if (rendered !== current) element.setAttribute('href', rendered);
    hrefState.set(element, { source, rendered });
  }
}
function renderTree(root) {
  if (root.nodeType === Node.TEXT_NODE) { renderText(root); return; }
  if (root.nodeType === Node.ELEMENT_NODE) renderElement(root);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  let node;
  while ((node = walker.nextNode())) {
    if (node.nodeType === Node.TEXT_NODE) renderText(node);
    else renderElement(node);
  }
}

const controls = document.createElement('div');
controls.className = 'language-switch';
controls.setAttribute('role', 'group');
controls.setAttribute('data-i18n-skip', '');
controls.innerHTML = '<button type="button" data-language="zh" lang="zh-CN">中</button><button type="button" data-language="en" lang="en">EN</button>';
function mountControls() {
  const header = document.querySelector('.site-header');
  if (header) {
    header.append(controls);
    const demo = header.querySelector('.header-cta');
    const nav = header.querySelector('#primary-nav');
    if (demo && nav) {
      const mobileDemo = document.createElement('a');
      mobileDemo.className = 'language-mobile-demo';
      mobileDemo.href = demo.getAttribute('href');
      mobileDemo.textContent = demo.textContent.trim();
      mobileDemo.addEventListener('click', () => {
        const menu = header.querySelector('.menu-button');
        if (menu?.getAttribute('aria-expanded') === 'true') menu.click();
      });
      nav.append(mobileDemo);
    }
  } else {
    controls.classList.add('language-switch-floating');
    document.body.classList.add('language-standalone');
    document.body.prepend(controls);
    for (const table of document.querySelectorAll('table')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'language-table-scroll';
      table.before(wrapper);
      wrapper.append(table);
    }
  }
}

const observer = new MutationObserver(records => {
  observer.disconnect();
  try {
    for (const record of records) {
      if (record.type === 'characterData') renderText(record.target);
      else if (record.type === 'attributes') renderElement(record.target);
      else for (const node of record.addedNodes) renderTree(node);
    }
  } finally { observe(); }
});
function observe() {
  observer.observe(document.documentElement, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: [...attributes, 'content', 'href'] });
}
function setLanguage(next, updateURL = true) {
  language = next === 'en' ? 'en' : 'zh';
  observer.disconnect();
  try {
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
    controls.setAttribute('aria-label', language === 'en' ? 'Website language' : '网站语言');
    for (const button of controls.querySelectorAll('button')) {
      button.setAttribute('aria-pressed', String(button.dataset.language === language));
      button.setAttribute('aria-label', button.dataset.language === 'zh' ? (language === 'en' ? 'Switch to Chinese' : '切换为中文') : (language === 'en' ? 'Switch to English' : '切换为英文'));
    }
    if (updateURL) {
      const url = new URL(location.href); url.searchParams.set('lang', language);
      history.replaceState(history.state, '', url);
    }
    try { localStorage.setItem('tezoi-language', language); } catch { /* Selection still works without persistence. */ }
    renderTree(document.documentElement);
  } finally { observe(); }
  document.dispatchEvent(new CustomEvent('languagechange', { detail: { language } }));
}
controls.addEventListener('click', event => {
  const button = event.target.closest('[data-language]');
  if (button) setLanguage(button.dataset.language);
});
window.addEventListener('popstate', () => setLanguage(resolveLanguage(location.search, language), false));
// Wait for complete text nodes: translating while the HTML parser is appending
// a streamed text node can mix a translated prefix with an untranslated suffix.
const root = document.documentElement;
let reveal = () => {};
function start() {
  if (document.readyState === 'loading') return;
  document.removeEventListener('readystatechange', start);
  try {
    mountControls();
    setLanguage(language);
  } finally {
    reveal();
  }
}
if (document.readyState === 'loading') {
  const display = root.style.getPropertyValue('display');
  const priority = root.style.getPropertyPriority('display');
  reveal = () => display ? root.style.setProperty('display', display, priority) : root.style.removeProperty('display');
  // The early bundle is already loaded. Reveal at parser completion, before
  // unrelated deferred modules finish; no timer or network-dependent overlay.
  document.addEventListener('readystatechange', start);
  root.style.setProperty('display', 'none', 'important');
} else start();
