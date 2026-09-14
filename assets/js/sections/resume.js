/**
 * ATS RESUME MODAL & PRINT CONTROLLER MODULE
 */

window.openResumeModal = function() {
  const resumeModal = document.getElementById('resumeModal');
  if (resumeModal) resumeModal.classList.add('open');
};

window.printResume = function() {
  document.body.classList.remove('printing-cert');
  document.body.classList.add('printing-resume');
  window.openResumeModal();
  setTimeout(() => {
    window.print();
  }, 150);
};

window.downloadResumePDF = function() {
  document.body.classList.remove('printing-cert');
  document.body.classList.add('printing-resume');
  window.openResumeModal();
  if (typeof window.showToast === 'function') {
    window.showToast('Preparing 1-Page ATS Resume PDF...', 'info');
  }
  setTimeout(() => {
    window.print();
  }, 300);
};

window.addEventListener('afterprint', () => {
  document.body.classList.remove('printing-resume');
  document.body.classList.remove('printing-cert');
});

