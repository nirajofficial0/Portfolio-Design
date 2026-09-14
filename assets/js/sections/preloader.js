/**
 * PRELOADER MODULE (0% - 100%)
 */
function initPreloader() {
  const preloader = document.getElementById('sitePreloader');
  const progressBar = document.getElementById('preloaderProgressBar');
  const percentText = document.getElementById('preloaderPercent');
  const statusText = document.getElementById('preloaderStatusText');

  if (preloader && progressBar && percentText) {
    document.body.classList.add('preload-locked');
    let currentProgress = 0;
    let targetProgress = 12;

    const statusPhases = [
      { threshold: 0, text: 'Initializing Design System & Themes...' },
      { threshold: 22, text: 'Compiling Core Projects & Tech Stack...' },
      { threshold: 52, text: 'Mounting Verified Activities & Certificates...' },
      { threshold: 78, text: 'Optimizing Responsive Viewports & Performance...' },
      { threshold: 96, text: 'Ready! Launching Experience...' }
    ];

    function updatePreloaderDisplay(val) {
      const rounded = Math.min(100, Math.floor(val));
      progressBar.style.width = `${rounded}%`;
      percentText.textContent = `${rounded}%`;

      if (statusText) {
        for (let i = statusPhases.length - 1; i >= 0; i--) {
          if (rounded >= statusPhases[i].threshold) {
            if (statusText.textContent !== statusPhases[i].text) {
              statusText.style.opacity = '0';
              setTimeout(() => {
                statusText.textContent = statusPhases[i].text;
                statusText.style.opacity = '1';
              }, 120);
            }
            break;
          }
        }
      }
    }

    // Smooth incremental animation loop
    const progressInterval = setInterval(() => {
      if (currentProgress < targetProgress) {
        const step = Math.max(1, (targetProgress - currentProgress) * 0.22);
        currentProgress += step;
        if (currentProgress > targetProgress) currentProgress = targetProgress;
        updatePreloaderDisplay(currentProgress);
      }

      if (currentProgress >= 100) {
        clearInterval(progressInterval);
        setTimeout(finishPreloader, 320);
      }
    }, 25);

    // Increment targets progressively for realistic natural loading
    setTimeout(() => { targetProgress = 38; }, 150);
    setTimeout(() => { targetProgress = 68; }, 380);
    setTimeout(() => { targetProgress = 90; }, 700);

    function triggerFinalComplete() {
      targetProgress = 100;
    }

    if (document.readyState === 'complete') {
      setTimeout(triggerFinalComplete, 600);
    } else {
      window.addEventListener('load', () => {
        setTimeout(triggerFinalComplete, 450);
      });
    }

    // Safety fallback: maximum 2.4s
    setTimeout(triggerFinalComplete, 2200);

    function finishPreloader() {
      preloader.classList.add('loaded');
      document.body.classList.remove('preload-locked');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 700);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPreloader);
} else {
  initPreloader();
}
