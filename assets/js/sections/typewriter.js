/**
 * HERO TYPEWRITER EFFECT MODULE
 */
function initTypewriter() {
  const typewriterElement = document.getElementById('typewriterText');
  if (typewriterElement) {
    const roles = [
      'Frontend Developer',
      'Data Analyst & SQL Specialist',
      'Web Developer',
      'UI/UX Designer',
      'BCA Student @ 2024-2027',
      'React & Modern JS Developer',
      'Problem Solver & Builder'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const delayBetweenRoles = 1800;

    function typeLoop() {
      const currentRole = roles[roleIndex];
      if (isDeleting) {
        typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }

      let timeout = isDeleting ? deleteSpeed : typeSpeed;

      if (!isDeleting && charIndex === currentRole.length) {
        timeout = delayBetweenRoles;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        timeout = 400;
      }

      setTimeout(typeLoop, timeout);
    }

    typeLoop();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTypewriter);
} else {
  initTypewriter();
}
