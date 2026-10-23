// Shared navigation for Home, Company, Blog and Research.
const header = document.querySelector('.site-header');
const menu = header.querySelector('.menu-button');
const navigation = header.querySelector('#primary-nav');
const page = document.body.dataset.page;

document.querySelectorAll('[data-site-page]').forEach((link) => {
  if (link.dataset.sitePage === page) link.setAttribute('aria-current', 'page');
  else link.removeAttribute('aria-current');
});

function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', '打开导航');
  navigation.classList.remove('is-open');
}

menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? '关闭导航' : '打开导航');
  navigation.classList.toggle('is-open', open);
});
navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});

function updateHeader() {
  header.classList.toggle('is-scrolled', page !== 'home' || window.scrollY > 48);
}
window.addEventListener('scroll', updateHeader, { passive: true });
window.addEventListener('pageshow', () => {
  closeMenu();
  updateHeader();
});
updateHeader();
