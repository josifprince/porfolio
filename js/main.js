document.body.classList.add('js-enabled');
document.querySelector('#year').textContent = new Date().getFullYear();
const guide = document.querySelector('.section-guide');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (guide) {
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const stops = guide.querySelector('.guide-stops');
  const sectionNames = { home: 'Home', about: 'About', projects: 'Work', experience: 'Experience', skills: 'Skills', communication: 'Communication', education: 'Education', contact: 'Contact' };
  sections.forEach(section => {
    const link = document.createElement('a');
    link.className = 'guide-stop';
    link.href = `#${section.id}`;
    link.textContent = sectionNames[section.id] || section.id;
    stops.append(link);
  });
  const updateStopPositions = () => {
    const range = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const scrollPadding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    sections.forEach((section, index) => {
      const pageTop = section.getBoundingClientRect().top + scrollY;
      const sectionScroll = index === sections.length - 1
        ? range
        : Math.max(0, Math.min(range, pageTop - scrollPadding));
      stops.children[index].style.setProperty('--stop-position', `${sectionScroll / range * 100}%`);
    });
  };
  const setActiveSection = section => {
    guide.querySelector('.guide-current').textContent = sectionNames[section.id] || section.id;
    guide.querySelectorAll('.guide-stop').forEach(link => {
      const active = link.hash === `#${section.id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  const moveSection = direction => {
    const center = innerHeight / 2;
    let current = 0;
    sections.forEach((section, index) => {
      const bounds = section.getBoundingClientRect();
      if (Math.abs(bounds.top + bounds.height / 2 - center) < Math.abs(sections[current].getBoundingClientRect().top + sections[current].getBoundingClientRect().height / 2 - center)) current = index;
    });
    const next = Math.max(0, Math.min(sections.length - 1, current + direction));
    sections[next].scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
  };
  guide.querySelector('.guide-up').addEventListener('click', () => moveSection(-1));
  guide.querySelector('.guide-down').addEventListener('click', () => moveSection(1));
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        setActiveSection(entry.target);
      });
    }, { rootMargin: '-42% 0px -42% 0px' });
    sections.forEach(section => sectionObserver.observe(section));
  }
  let guideFrame = 0;
  const updateGuide = () => {
    if (guideFrame) return;
    guideFrame = requestAnimationFrame(() => {
      const range = document.documentElement.scrollHeight - innerHeight;
      const progress = range > 0 ? Math.min(1, Math.max(0, scrollY / range)) : 0;
      const track = guide.querySelector('.guide-track');
      const trackTop = track.offsetTop;
      const character = guide.querySelector('.guide-character');
      const markerTop = trackTop + track.offsetHeight * progress - character.offsetHeight / 2;
      guide.style.setProperty('--guide-progress', `${markerTop}px`);
      guideFrame = 0;
    });
  };
  const scrollFromPointer = event => {
    const bounds = guide.querySelector('.guide-track').getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));
    const range = document.documentElement.scrollHeight - innerHeight;
    scrollTo({ top: range * progress, behavior: 'auto' });
  };
  let draggingGuide = false;
  guide.addEventListener('pointerdown', event => {
    if (event.target.closest('.guide-stop, .guide-arrow')) return;
    draggingGuide = true;
    guide.classList.add('is-dragging');
    guide.setPointerCapture(event.pointerId);
    scrollFromPointer(event);
    event.preventDefault();
  });
  guide.addEventListener('pointermove', event => {
    if (draggingGuide) scrollFromPointer(event);
  });
  const stopDraggingGuide = () => {
    draggingGuide = false;
    guide.classList.remove('is-dragging');
  };
  guide.addEventListener('pointerup', stopDraggingGuide);
  guide.addEventListener('pointercancel', stopDraggingGuide);
  guide.addEventListener('keydown', event => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      moveSection(event.key === 'ArrowUp' ? -1 : 1);
      event.preventDefault();
      return;
    }
    const range = document.documentElement.scrollHeight - innerHeight;
    const step = event.key.startsWith('Page') ? innerHeight * 0.85 : 80;
    if (event.key === 'Home') scrollTo({ top: 0, behavior: 'auto' });
    else if (event.key === 'End') scrollTo({ top: range, behavior: 'auto' });
    else if (event.key === 'ArrowUp' || event.key === 'PageUp') scrollBy({ top: -step, behavior: 'auto' });
    else if (event.key === 'ArrowDown' || event.key === 'PageDown') scrollBy({ top: step, behavior: 'auto' });
    else return;
    event.preventDefault();
  });
  addEventListener('scroll', updateGuide, { passive: true });
  addEventListener('resize', () => { updateStopPositions(); updateGuide(); }, { passive: true });
  new ResizeObserver(() => { updateStopPositions(); updateGuide(); }).observe(document.querySelector('main'));
  updateStopPositions();
  updateGuide();
}
const experience = document.querySelector('#experience');
if (experience) {
  const tabs = Array.from(experience.querySelectorAll('[role="tab"]'));
  const panels = Array.from(experience.querySelectorAll('[role="tabpanel"]'));
  const selectExperiencePage = (tab, moveFocus = false) => {
    tabs.forEach(item => {
      const selected = item === tab;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      if (selected && moveFocus) item.focus();
    });
    panels.forEach(panel => {
      const selected = panel.id === tab.getAttribute('aria-controls');
      panel.hidden = !selected;
      panel.classList.toggle('is-active', selected);
    });
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectExperiencePage(tab));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      selectExperiencePage(tabs[next], true);
    });
  });
}
const projects = document.querySelector('#projects');
if (projects) {
  const tabs = Array.from(projects.querySelectorAll('[role="tab"]'));
  const panels = Array.from(projects.querySelectorAll('[role="tabpanel"]'));
  const selectProject = (tab, moveFocus = false) => {
    tabs.forEach(item => {
      const selected = item === tab;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      if (selected && moveFocus) item.focus();
    });
    panels.forEach(panel => {
      const selected = panel.id === tab.getAttribute('aria-controls');
      panel.hidden = !selected;
      panel.classList.toggle('is-active', selected);
    });
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectProject(tab));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      selectProject(tabs[next], true);
    });
  });
}
const depthObjects = document.querySelectorAll('.depth-object');
const sceneSections = document.querySelectorAll('main section[id]');
if (depthObjects.length || sceneSections.length) {
  let depthScrollFrame = 0;
  const updateDepthScroll = () => {
    if (depthScrollFrame) return;
    depthScrollFrame = requestAnimationFrame(() => {
      sceneSections.forEach(section => {
        const bounds = section.getBoundingClientRect();
        const distance = (bounds.top + bounds.height / 2 - innerHeight / 2) / innerHeight;
        const offset = reducedMotion.matches ? 0 : Math.max(-1, Math.min(1, distance)) * -30;
        section.style.setProperty('--scene-depth', `${offset}px`);
        const chapterDistance = reducedMotion.matches ? 0 : Math.max(-1, Math.min(1, distance));
        const chapterIntensity = innerWidth < 761 ? 0.62 : 1;
        const chapterAmount = Math.abs(chapterDistance) * chapterIntensity;
        section.style.setProperty('--chapter-shift', `${-chapterDistance * 20 * chapterIntensity}px`);
        section.style.setProperty('--chapter-depth', `${-chapterAmount * 90}px`);
        section.style.setProperty('--chapter-tilt', `${-chapterDistance * 8 * chapterIntensity}deg`);
        section.style.setProperty('--chapter-scale', String(1 - chapterAmount * 0.025));
      });
      depthObjects.forEach(object => {
        const bounds = object.closest('section').getBoundingClientRect();
        const distance = (bounds.top + bounds.height / 2 - innerHeight / 2) / innerHeight;
        const offset = reducedMotion.matches ? 0 : Math.max(-1, Math.min(1, distance)) * -34;
        object.style.setProperty('--depth-scroll', `${offset}px`);
      });
      depthScrollFrame = 0;
    });
  };
  addEventListener('scroll', updateDepthScroll, { passive: true });
  addEventListener('resize', updateDepthScroll, { passive: true });
  updateDepthScroll();

  if (!reducedMotion.matches && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let depthFrame = 0;
    let pointerX = 0;
    let pointerY = 0;
    addEventListener('pointermove', event => {
      pointerX = (event.clientX / innerWidth - 0.5) * 2;
      pointerY = (event.clientY / innerHeight - 0.5) * 2;
      if (depthFrame) return;
      depthFrame = requestAnimationFrame(() => {
        sceneSections.forEach(section => {
          section.style.setProperty('--scene-tilt-x', `${-pointerY * 1.4}deg`);
          section.style.setProperty('--scene-tilt-y', `${pointerX * 1.8}deg`);
          section.style.setProperty('--scene-pan-x', `${pointerX * 8}px`);
        });
        depthObjects.forEach(object => {
          object.style.setProperty('--depth-x', `${-pointerY * 5}deg`);
          object.style.setProperty('--depth-y', `${pointerX * 7}deg`);
        });
        depthFrame = 0;
      });
    }, { passive: true });
  }
}
if ('IntersectionObserver' in window) {
  const revealGroups = [
    ['.split-grid > *', '.section-heading > *', '.case-study', '.additional-projects article', '.timeline article', '.skill-card', '.credentials article', '.contact-grid > *'],
    ['.proof-points > div', '.case-details > div', '.communication-tags span']
  ];
  revealGroups.forEach(selectors => {
    document.querySelectorAll(selectors.join(',')).forEach((element, index) => {
      element.classList.add('reveal-item');
      if (selectors.length > 1) element.style.setProperty('--reveal-delay', `${(index % 5) * 85}ms`);
    });
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  document.querySelectorAll('.reveal-item').forEach(item => revealObserver.observe(item));
}
