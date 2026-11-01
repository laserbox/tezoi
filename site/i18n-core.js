export function resolveLanguage(search = '', stored) {
  const query = new URLSearchParams(search).get('lang');
  if (query === 'zh' || query === 'en') return query;
  return stored === 'en' ? 'en' : 'zh';
}

const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export function createTranslator(catalog) {
  const direct = new Map(Object.entries(catalog));
  const patterns = [];
  for (const entry of Object.values(catalog)) {
    for (const value of [entry.zh, entry.en]) if (!direct.has(value)) direct.set(value, entry);
  }
  for (const [source, entry] of direct) {
    if (!/\{\d+\}/.test(source) || source.replace(/\{\d+\}/g, '').length < 2) continue;
    const slots = [];
    const expression = source.split(/(\{\d+\})/g).map(part => {
      if (/^\{\d+\}$/.test(part)) { slots.push(Number(part.slice(1, -1))); return '(.*?)'; }
      return escapeRegex(part);
    }).join('');
    patterns.push({ regex: new RegExp(`^${expression}$`, 's'), slots, entry, specificity: source.replace(/\{\d+\}/g, '').length });
  }
  patterns.sort((a, b) => b.specificity - a.specificity);
  function translate(value, language, depth = 0) {
    if (typeof value !== 'string' || !value.trim()) return value;
    const text = value.trim();
    const locale = language === 'en' ? 'en' : 'zh';
    let result = direct.get(text)?.[locale];
    if (result === undefined && depth < 2) {
      for (const pattern of patterns) {
        const match = pattern.regex.exec(text);
        if (!match) continue;
        const values = new Map(pattern.slots.map((slot, i) => [slot, translate(match[i + 1], locale, depth + 1)]));
        result = pattern.entry[locale].replace(/\{(\d+)\}/g, (_, slot) => values.get(Number(slot)) ?? '');
        break;
      }
    }
    if (result === undefined && depth < 2) {
      const numbered = text.match(/^(\d+(?:\s*\/\s*\d+)?[. \t]+)(.+)$/s);
      if (numbered) {
        const label = translate(numbered[2], locale, depth + 1);
        if (label !== numbered[2]) result = numbered[1] + label;
      }
      if (result === undefined) {
        const parts = text.split(/(\s+\/\s+| · |：|: )/);
        if (parts.length > 1) {
          const translated = parts.map((part, i) => i % 2 ? part : translate(part, locale, depth + 1)).join('');
          if (translated !== text) result = translated;
        }
      }
    }
    if (result === undefined) return value;
    return value.slice(0, value.indexOf(text)) + result + value.slice(value.indexOf(text) + text.length);
  }
  return translate;
}

export function localizeHref(href, language, baseURL, sitePath) {
  if (!href || /^(?:#|mailto:|tel:|data:|blob:|javascript:)/i.test(href)) return href;
  let url;
  try { url = new URL(href, baseURL); } catch { return href; }
  const base = new URL(baseURL);
  if (url.origin !== base.origin || !url.pathname.startsWith(sitePath) || !/(?:\/|\.html)$/.test(url.pathname)) return href;
  url.searchParams.set('lang', language === 'en' ? 'en' : 'zh');
  return url.pathname + url.search + url.hash;
}
