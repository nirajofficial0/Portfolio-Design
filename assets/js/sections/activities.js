/**
 * EXTRACURRICULAR ACTIVITIES & LEADERSHIP FILTER MODULE
 */
function initActivities() {
  const activityFilterBtns = document.querySelectorAll('.activity-filter-btn');
  const activityCards = document.querySelectorAll('.activity-card');

  activityFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activityFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-activity-filter');

      activityCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initActivities);
} else {
  initActivities();
}
