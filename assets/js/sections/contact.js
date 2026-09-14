/**
 * CONTACT FORM & DIRECT EMAIL ENGINE MODULE
 */

// DIRECT GMAIL WEB COMPOSER
window.sendViaGmailWeb = function() {
  const name = document.getElementById('contactName')?.value.trim() || '';
  const email = document.getElementById('contactEmail')?.value.trim() || '';
  const subject = document.getElementById('contactSubject')?.value.trim() || 'Job Opportunity / Project Inquiry';
  const message = document.getElementById('contactMessage')?.value.trim() || '';

  let bodyText = '';
  if (name) bodyText += `Sender Name: ${name}\n`;
  if (email) bodyText += `Sender Email: ${email}\n\n`;
  if (message) {
    bodyText += `Message:\n${message}\n\n`;
  } else {
    bodyText += `Hi Neeraj,\n\nI visited your developer portfolio and would like to discuss a project / role with you.\n\nBest regards,\n${name || '[Your Name]'}`;
  }

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=nirajpatel12052003@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
  
  if (typeof window.showToast === 'function') {
    window.showToast('Opening Gmail web composer...', 'info');
  }
  window.open(gmailUrl, '_blank');
};

// DIRECT EMAIL APP HELPER FROM CONTACT FORM
window.sendDirectMailFromForm = function() {
  const name = document.getElementById('contactName')?.value.trim() || '';
  const email = document.getElementById('contactEmail')?.value.trim() || '';
  const subject = document.getElementById('contactSubject')?.value.trim() || 'Project Inquiry / Job Opportunity';
  const message = document.getElementById('contactMessage')?.value.trim() || '';

  let bodyText = '';
  if (name) bodyText += `From: ${name}\n`;
  if (email) bodyText += `Email: ${email}\n\n`;
  if (message) {
    bodyText += `Message:\n${message}\n\n`;
  } else {
    bodyText += `Hi Neeraj,\n\nI visited your developer portfolio and would like to discuss an opportunity / project with you.\n\nBest regards,\n${name || '[Your Name]'}`;
  }

  const mailtoUrl = `mailto:nirajpatel12052003@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
  
  if (typeof window.showToast === 'function') {
    window.showToast('Opening your default email app...', 'info');
  }
  window.location.href = mailtoUrl;
};

function initContact() {
  const contactForm = document.getElementById('mainContactForm');
  const formSubmitBtn = document.getElementById('formSubmitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = contactForm.querySelector('input[name="name"]')?.value.trim() || '';
      const email = contactForm.querySelector('input[name="email"]')?.value.trim() || '';
      const subject = contactForm.querySelector('input[name="subject"]')?.value.trim() || 'Portfolio Project Inquiry';
      const message = contactForm.querySelector('textarea[name="message"]')?.value.trim() || '';

      if (!name || !email || !message) {
        if (typeof window.showToast === 'function') {
          window.showToast('Please fill out Name, Email, and Message.', 'error');
        }
        return;
      }

      if (formSubmitBtn) {
        formSubmitBtn.disabled = true;
        formSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending to Neeraj\'s Gmail...';
      }

      try {
        const response = await fetch('https://formsubmit.co/ajax/nirajpatel12052003@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            _replyto: email,
            subject: `Portfolio Message from ${name}: ${subject}`,
            _subject: `Portfolio Message from ${name}: ${subject}`,
            message: message,
            _template: 'table',
            _captcha: 'false'
          })
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok || data.success === 'true' || data.success === true) {
          if (typeof window.showToast === 'function') {
            window.showToast(`Thank you, ${name}! Your message was delivered directly to Neeraj's Gmail inbox.`, 'success');
          }
          contactForm.reset();
        } else {
          if (typeof window.showToast === 'function') {
            window.showToast(`Message processed! Opening email client backup...`, 'info');
          }
          window.location.href = `mailto:nirajpatel12052003@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
          contactForm.reset();
        }
      } catch (err) {
        if (typeof window.showToast === 'function') {
          window.showToast(`Launching direct email app for delivery...`, 'info');
        }
        window.location.href = `mailto:nirajpatel12052003@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
      } finally {
        if (formSubmitBtn) {
          formSubmitBtn.disabled = false;
          formSubmitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Direct to Neeraj\'s Gmail';
        }
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContact);
} else {
  initContact();
}
