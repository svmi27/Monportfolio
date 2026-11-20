const menu = document.querySelector('#main-nav');
const toggle = document.querySelector('.menu-toggle');
const compact = window.matchMedia('(max-width:640px)');

function setMenu(open) {
  menu.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
}
function syncMenu() {
  document.documentElement.classList.toggle('js-menu', compact.matches);
  toggle.hidden = !compact.matches;
  setMenu(false);
}
syncMenu();
compact.addEventListener('change', syncMenu);
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') === 'false'));
menu.addEventListener('click', () => setMenu(false));
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    toggle.focus();
  }
});

const filters = document.querySelector('.filters');
const projects = [...document.querySelectorAll('.project')];
const status = document.querySelector('#filter-status');
filters.hidden = false;
filters.addEventListener('click', event => {
  const selected = event.target.closest('button[data-filter]');
  if (!selected) return;
  for (const button of filters.querySelectorAll('button')) {
    button.setAttribute('aria-pressed', String(button === selected));
  }
  const group = selected.dataset.filter;
  let count = 0;
  for (const project of projects) {
    project.hidden = group !== 'tous' && !project.dataset.groups.split(' ').includes(group);
    if (!project.hidden) count++;
  }
  status.textContent = count + (count === 1 ? ' projet affiché' : ' projets affichés');
});

const links = [...menu.querySelectorAll('a')];
if ('IntersectionObserver' in window) {
  const sections = links.map(link => document.querySelector(link.hash));
  const observer = new IntersectionObserver(() => {
    const marker = window.innerHeight * 0.36;
    const active = sections.find(section => {
      const rect = section.getBoundingClientRect();
      return rect.top <= marker && rect.bottom > marker;
    });
    for (const link of links) {
      if (active && link.hash === '#' + active.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }, { rootMargin: '-35% 0px -63% 0px' });
  sections.forEach(section => observer.observe(section));
}

const copy = document.querySelector('.copy');
if (navigator.clipboard && window.isSecureContext) {
  copy.hidden = false;
  copy.addEventListener('click', async () => {
    const message = document.querySelector('.copy-result');
    const address = document.querySelector('.email-row a').textContent.trim();
    try {
      await navigator.clipboard.writeText(address);
      message.textContent = 'Adresse e-mail copiée.';
    } catch {
      message.textContent = 'Tu peux sélectionner l’adresse pour la copier.';
    }
  });
}
