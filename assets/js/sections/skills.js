/**
 * SKILLS TAB FILTERING MODULE
 */
function initSkills() {
  const skillTabs = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      skillTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const category = tab.getAttribute('data-skill-cat');

      skillCards.forEach(card => {
        const cardCats = card.getAttribute('data-category') || '';
        if (category === 'all' || cardCats.includes(category)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSkills);
} else {
  initSkills();
}
