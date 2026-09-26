// Remembers the language picked with the language switch. Until one is picked, the English home page
// sends visitors whose browser is set to Lithuanian to the Lithuanian page (see the inline script in its head).
document.querySelectorAll('[data-lang]').forEach(link => {
  link.addEventListener('click', () => {
    try {
      localStorage.setItem('sl-lang', link.dataset.lang);
    } catch {
      // Storage can be blocked, the switch still works as a plain link
    }
  });
});
