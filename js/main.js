document.body.classList.add('js-enabled');
const toggle = document.querySelector('.mobile-nav-toggle');
const navigation = document.querySelector('#navigation');
toggle.hidden = false;
function closeNavigation() {
  navigation.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open navigation');
}
toggle.addEventListener('click', () => {
  const open = navigation.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNavigation));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    closeNavigation();
    toggle.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeNavigation();
});
window.matchMedia('(min-width: 761px)').addEventListener('change', closeNavigation);
document.querySelector('#year').textContent = new Date().getFullYear();
if ('IntersectionObserver' in window) {
  const links = Array.from(navigation.querySelectorAll('a'));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => {
        const active = link.hash === `#${entry.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
  document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
}
