document.querySelectorAll('[data-current-path]').forEach((link) => {
  const target = link.getAttribute('href') || '';
  if (target && location.pathname.endsWith(target.replace(/^\.\//, ''))) {
    link.setAttribute('aria-current', 'page');
  }
});
