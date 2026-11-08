// Inline SVG keeps control icons independent of OS fonts and emoji substitution.
const paths = {
  'arrow-right': '<path d="M4 10h12m-5-5 5 5-5 5"/>',
  'arrow-left': '<path d="M16 10H4m5-5-5 5 5 5"/>',
  'arrow-down': '<path d="M10 4v12m-5-5 5 5 5-5"/>',
  'arrow-up': '<path d="M10 16V4m-5 5 5-5 5 5"/>',
  'arrow-up-right': '<path d="M5 15 15 5M5 5h10v10"/>',
  'arrows-horizontal': '<path d="M3 10h14M6 7l-3 3 3 3M14 7l3 3-3 3"/>',
  play: '<path d="m7 4 9 6-9 6Z" fill="currentColor" stroke="none"/>',
  pause: '<path d="M6 4h3v12H6Zm5 0h3v12h-3Z" fill="currentColor" stroke="none"/>',
  replay: '<path d="M4 8a6 6 0 1 1 0 5M4 3v5h5"/>',
  expand: '<path d="M7 3H3v4M13 3h4v4M17 13v4h-4M7 17H3v-4"/>',
  volume: '<path d="M3 8h3l4-3v10l-4-3H3Z"/><path d="M13 7.5a3.5 3.5 0 0 1 0 5M15 5a7 7 0 0 1 0 10"/>',
  muted: '<path d="M3 8h3l4-3v10l-4-3H3Z"/><path d="m13 8 4 4m0-4-4 4"/>',
  close: '<path d="m5 5 10 10M15 5 5 15"/>',
  plus: '<path d="M10 4v12M4 10h12"/>',
  minus: '<path d="M4 10h12"/>',
};

export function icon(name) {
  if (!paths[name]) throw new Error(`Unknown UI icon: ${name}`);
  return `<svg class="ui-icon" viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name]}</svg>`;
}
