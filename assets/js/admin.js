/**
 * MASTER ADMIN DASHBOARD CONTROLLER
 * Full management of Messages, Mail, Reach, Reviews, Profile Visits, and Auth
 * Real-Time 0-Base Tracking with Live Cross-Tab Sync & Multi-Channel Reply Hub
 */

(function () {
  'use strict';

  // --- CRYPTO HELPER FOR SECURE LOCAL PASSWORD ---
  async function hashPassword(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str + '_salt_neeraj_portfolio_2026');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // --- LOCAL STORAGE HELPERS ---
  function getStorage(key, defaultVal) {
    try {
      const data = localStorage.getItem(key);
      return data !== null ? JSON.parse(data) : defaultVal;
    } catch (e) {
      return defaultVal;
    }
  }

  function setStorage(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.warn('Storage write error:', e);
    }
  }

  // --- REAL-TIME BROADCAST CHANNEL & STORAGE LISTENER ---
  let syncChannel = null;
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      syncChannel = new BroadcastChannel('admin_realtime_sync');
      syncChannel.onmessage = function (event) {
        const { type, payload } = event.data || {};
        if (type === 'NEW_VISIT') {
          showToast(`Live Visitor Connected! Total visits: ${payload.totalVisits} (+1)`, 'info');
          loadAllDashboardData();
        } else if (type === 'NEW_MESSAGE') {
          showToast(`New Portfolio Message from ${payload.name || 'Visitor'}!`, 'success');
          loadAllDashboardData();
        } else if (type === 'NEW_REVIEW') {
          showToast(`New ${payload.rating || 5}★ Review submitted by ${payload.author || 'Visitor'}!`, 'success');
          loadAllDashboardData();
        } else if (type === 'REACH_ACTION') {
          loadAllDashboardData();
        }
      };
    }
  } catch (e) {
    console.warn('BroadcastChannel not initialized:', e);
  }

  // Fallback storage event listener for cross-tab updates
  window.addEventListener('storage', function (e) {
    if (e.key === 'admin_visits_log' || e.key === 'admin_messages' || e.key === 'admin_reach_stats' || e.key === 'admin_reviews') {
      loadAllDashboardData();
    }
  });

  // --- TOAST NOTIFICATIONS ---
  function showToast(message, type = 'info') {
    const container = document.getElementById('adminToastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `admin-toast toast-${type}`;
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-circle-exclamation';

    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // --- STATE ---
  let currentActiveTab = 'overview';
  let activeMessageDetailId = null;

  // --- AUTHENTICATION ENGINE ---
  function initAuth() {
    const authWrapper = document.getElementById('authWrapper');
    const adminLayout = document.getElementById('adminLayout');
    const setupCard = document.getElementById('setupCard');
    const loginCard = document.getElementById('loginCard');

    const storedHash = localStorage.getItem('admin_pwd_hash');
    const isAuthenticated = sessionStorage.getItem('admin_authenticated_session') === 'true' ||
                            localStorage.getItem('admin_authenticated_persistent') === 'true';

    if (isAuthenticated && storedHash) {
      authWrapper.classList.add('hidden');
      adminLayout.classList.remove('hidden');
      loadAllDashboardData();
      return;
    }

    authWrapper.classList.remove('hidden');
    adminLayout.classList.add('hidden');

    if (!storedHash) {
      // First time setup - create personalized password
      setupCard.classList.remove('hidden');
      loginCard.classList.add('hidden');
    } else {
      // Password already personalized, show login
      setupCard.classList.add('hidden');
      loginCard.classList.remove('hidden');
    }
  }

  // Handle First-Time Password Setup
  async function handleSetupSubmit(e) {
    e.preventDefault();
    const newPwd = document.getElementById('setupPassword').value;
    const confirmPwd = document.getElementById('setupConfirmPassword').value;
    const email = document.getElementById('setupEmail').value.trim();

    if (newPwd.length < 5) {
      showToast('Password should be at least 5 characters.', 'error');
      return;
    }
    if (newPwd !== confirmPwd) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    if (!email) {
      showToast('Please provide a recovery email.', 'error');
      return;
    }

    const hash = await hashPassword(newPwd);
    localStorage.setItem('admin_pwd_hash', hash);
    localStorage.setItem('admin_recovery_email', email);
    sessionStorage.setItem('admin_authenticated_session', 'true');

    showToast('Personalized password saved successfully!', 'success');
    document.getElementById('authWrapper').classList.add('hidden');
    document.getElementById('adminLayout').classList.remove('hidden');
    loadAllDashboardData();
  }

  // Handle Login Submit
  async function handleLoginSubmit(e) {
    e.preventDefault();
    const enteredPwd = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMeCheckbox').checked;
    const storedHash = localStorage.getItem('admin_pwd_hash');

    const enteredHash = await hashPassword(enteredPwd);
    if (enteredHash === storedHash) {
      sessionStorage.setItem('admin_authenticated_session', 'true');
      if (rememberMe) {
        localStorage.setItem('admin_authenticated_persistent', 'true');
      }
      showToast('Welcome back, Admin!', 'success');
      document.getElementById('authWrapper').classList.add('hidden');
      document.getElementById('adminLayout').classList.remove('hidden');
      loadAllDashboardData();
    } else {
      showToast('Incorrect password. Please try again.', 'error');
    }
  }

  // Logout
  function handleLogout() {
    sessionStorage.removeItem('admin_authenticated_session');
    localStorage.removeItem('admin_authenticated_persistent');
    showToast('Logged out of Admin Dashboard.', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 400);
  }

  // Forgot Password Modal & Mock Email Simulation
  function openForgotModal() {
    const modal = document.getElementById('forgotModal');
    const storedEmail = localStorage.getItem('admin_recovery_email') || 'nirajpatel12052003@gmail.com';
    document.getElementById('forgotEmailInput').value = storedEmail;
    document.getElementById('mockEmailBox').classList.add('hidden');
    document.getElementById('forgotStep1').classList.remove('hidden');
    document.getElementById('forgotStep2').classList.add('hidden');
    modal.classList.remove('hidden');
  }

  function closeForgotModal() {
    document.getElementById('forgotModal').classList.add('hidden');
  }

  function triggerMockRecoveryEmail() {
    const email = document.getElementById('forgotEmailInput').value.trim();
    if (!email) {
      showToast('Please enter your recovery email.', 'error');
      return;
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    sessionStorage.setItem('active_reset_code', resetCode);

    document.getElementById('forgotStep1').classList.add('hidden');
    document.getElementById('mockEmailBox').classList.remove('hidden');

    document.getElementById('mockRecipient').textContent = email;
    document.getElementById('mockOtpCode').textContent = resetCode;

    showToast(`Simulation: Password reset email dispatched to ${email}!`, 'success');
  }

  function proceedToReset() {
    const inputCode = document.getElementById('resetCodeInput').value.trim();
    const actualCode = sessionStorage.getItem('active_reset_code');

    if (inputCode !== actualCode) {
      showToast('Invalid recovery code. Check simulated email.', 'error');
      return;
    }

    document.getElementById('mockEmailBox').classList.add('hidden');
    document.getElementById('forgotStep2').classList.remove('hidden');
  }

  function quickResetFromEmail() {
    const actualCode = sessionStorage.getItem('active_reset_code');
    document.getElementById('resetCodeInput').value = actualCode;
    proceedToReset();
  }

  async function finalizePasswordReset(e) {
    e.preventDefault();
    const newPwd = document.getElementById('resetNewPassword').value;
    const confirmPwd = document.getElementById('resetConfirmPassword').value;

    if (newPwd.length < 5) {
      showToast('Password must be at least 5 characters.', 'error');
      return;
    }
    if (newPwd !== confirmPwd) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    const hash = await hashPassword(newPwd);
    localStorage.setItem('admin_pwd_hash', hash);
    closeForgotModal();
    showToast('Password updated! You can now log in with your new password.', 'success');
  }

  // --- TAB NAVIGATION ---
  function switchTab(tabId) {
    currentActiveTab = tabId;

    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });

    document.querySelectorAll('.tab-section').forEach(sec => {
      sec.classList.toggle('hidden', sec.id !== `tab-${tabId}`);
    });

    const titles = {
      overview: 'Dashboard Overview',
      messages: 'Messages & Contact Leads',
      mail: 'Direct Mail Launcher',
      reach: 'Reach & Traffic Analytics',
      visits: 'Live Profile Visits Log',
      reviews: 'Reviews & Ratings Management',
      settings: 'Security & Settings'
    };
    const titleEl = document.getElementById('pageTitleText');
    if (titleEl) titleEl.textContent = titles[tabId] || 'Admin Dashboard';

    document.getElementById('adminSidebar')?.classList.remove('open');
  }

  // --- DATA LOADING & RENDERING (100% REAL-TIME FROM ZERO) ---
  function loadAllDashboardData() {
    renderOverviewStats();
    renderMessagesTable();
    renderReachAnalytics();
    renderVisitsLog();
    renderReviewsList();
    renderSettingsInfo();
  }

  // 1. OVERVIEW STATS (0 BASE REAL-TIME)
  function renderOverviewStats() {
    const reach = getStorage('admin_reach_stats', {
      totalVisits: 0,
      uniqueVisitors: 0,
      resumeClicks: 0,
      projectClicks: 0,
      githubClicks: 0,
      contactSubmissions: 0
    });
    const visits = getStorage('admin_visits_log', []);
    const messages = getStorage('admin_messages', []);
    const reviews = getStorage('admin_reviews', []);

    // Metric 1: Total Visits (Accurate Real-Time Count)
    const totalVisitsCount = Math.max(reach.totalVisits || 0, visits.length);
    const reachEl = document.getElementById('statTotalReach');
    if (reachEl) reachEl.textContent = totalVisitsCount.toLocaleString();

    // Metric 2: Unique Profile Visitors
    const uniqueCount = reach.uniqueVisitors || (visits.length > 0 ? 1 : 0);
    const visitsEl = document.getElementById('statProfileVisits');
    if (visitsEl) visitsEl.textContent = uniqueCount.toLocaleString();

    // Metric 3: Messages & Inquiries Count
    const unreadCount = messages.filter(m => !m.read).length;
    const msgCountEl = document.getElementById('statMessagesCount');
    if (msgCountEl) msgCountEl.textContent = messages.length;

    const unreadBadge = document.getElementById('statUnreadBadge');
    if (unreadBadge) unreadBadge.textContent = `${unreadCount} unread`;

    const sidebarBadge = document.getElementById('sidebarMessagesBadge');
    if (sidebarBadge) sidebarBadge.textContent = unreadCount || messages.length;

    // Metric 4: Real-time Rating & Review stats
    const avgRatingEl = document.getElementById('statAvgRating');
    const reviewsCountEl = document.getElementById('statReviewsCount');

    if (reviews.length > 0) {
      const avg = (reviews.reduce((acc, r) => acc + Number(r.rating || 5), 0) / reviews.length).toFixed(1);
      if (avgRatingEl) avgRatingEl.textContent = `${avg} ★`;
      if (reviewsCountEl) reviewsCountEl.textContent = `Based on ${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'}`;
    } else {
      if (avgRatingEl) avgRatingEl.textContent = '0.0 ★';
      if (reviewsCountEl) reviewsCountEl.textContent = '0 reviews recorded';
    }

    // Recent Messages in Overview
    const recentList = document.getElementById('overviewRecentMessages');
    if (recentList) {
      if (messages.length === 0) {
        recentList.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:1.5rem; color:var(--text-muted);"><i class="fa-solid fa-inbox" style="margin-right:0.4rem;"></i> No messages received yet. New messages submitted on your portfolio will show here real-time.</td></tr>`;
      } else {
        recentList.innerHTML = messages.slice(0, 5).map(msg => `
          <tr>
            <td><strong>${escapeHtml(msg.name)}</strong></td>
            <td><a href="mailto:${escapeHtml(msg.email)}" style="color:var(--accent-cyan);">${escapeHtml(msg.email)}</a></td>
            <td>${escapeHtml(msg.subject)}</td>
            <td><span class="badge ${msg.read ? (msg.status === 'replied' ? 'badge-replied' : 'badge-read') : 'badge-new'}">${msg.status === 'replied' ? 'Replied' : (msg.read ? 'Read' : 'New')}</span></td>
            <td>
              <button class="btn-secondary" style="padding:0.35rem 0.75rem; font-size:0.8rem;" onclick="adminApp.openMessageDetail('${msg.id}')">
                <i class="fa-solid fa-reply"></i> View & Reply
              </button>
            </td>
          </tr>
        `).join('');
      }
    }
  }

  // 2. MESSAGES TAB WITH MULTI-CHANNEL CONTACT & REPLY
  function renderMessagesTable(searchQuery = '', filterStatus = 'all') {
    const messages = getStorage('admin_messages', []);
    const tableBody = document.getElementById('messagesTableBody');
    if (!tableBody) return;

    let filtered = messages;
    if (filterStatus === 'unread') {
      filtered = filtered.filter(m => !m.read);
    } else if (filterStatus === 'replied') {
      filtered = filtered.filter(m => m.status === 'replied');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(m => 
        (m.name && m.name.toLowerCase().includes(q)) ||
        (m.email && m.email.toLowerCase().includes(q)) ||
        (m.phone && m.phone.toLowerCase().includes(q)) ||
        (m.subject && m.subject.toLowerCase().includes(q)) ||
        (m.message && m.message.toLowerCase().includes(q))
      );
    }

    if (filtered.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2.5rem; color:var(--text-muted);"><i class="fa-solid fa-envelope-open" style="font-size:1.5rem; display:block; margin-bottom:0.5rem; color:var(--text-dim);"></i> No messages found. Inquiries submitted via portfolio contact form appear here.</td></tr>`;
      return;
    }

    tableBody.innerHTML = filtered.map(msg => {
      const timeStr = new Date(msg.timestamp).toLocaleDateString() + ' ' + new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const badgeClass = msg.status === 'replied' ? 'badge-replied' : (msg.read ? 'badge-read' : 'badge-new');
      const badgeText = msg.status === 'replied' ? 'Replied' : (msg.read ? 'Read' : 'New');

      return `
        <tr>
          <td><span class="badge ${badgeClass}">${badgeText}</span></td>
          <td><strong>${escapeHtml(msg.name)}</strong></td>
          <td>
            <a href="mailto:${escapeHtml(msg.email)}" style="color:var(--accent-cyan);">${escapeHtml(msg.email)}</a>
            ${msg.phone ? `<br><small style="color:var(--accent-emerald);"><i class="fa-brands fa-whatsapp"></i> ${escapeHtml(msg.phone)}</small>` : ''}
          </td>
          <td>${escapeHtml(msg.subject)}</td>
          <td style="font-family:var(--font-mono); font-size:0.8rem; color:var(--text-muted);">${timeStr}</td>
          <td>
            <div style="display:flex; gap:0.4rem;">
              <button class="table-btn" title="View & Reply" onclick="adminApp.openMessageDetail('${msg.id}')">
                <i class="fa-solid fa-reply"></i>
              </button>
              <button class="table-btn" title="Reply via Gmail" onclick="adminApp.replyToSender('${msg.id}')">
                <i class="fa-brands fa-google" style="color:#ea4335;"></i>
              </button>
              <button class="table-btn btn-delete" title="Delete Message" onclick="adminApp.deleteMessage('${msg.id}')">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Open Message Detail Modal & Setup Direct Multi-Channel Reply
  function openMessageDetail(id) {
    const messages = getStorage('admin_messages', []);
    const msg = messages.find(m => m.id === id);
    if (!msg) return;

    activeMessageDetailId = id;
    if (!msg.read && msg.status !== 'replied') {
      msg.read = true;
      setStorage('admin_messages', messages);
      renderOverviewStats();
      renderMessagesTable();
    }

    document.getElementById('modalMsgSender').textContent = msg.name || 'Anonymous Visitor';
    document.getElementById('modalMsgEmail').textContent = msg.email || 'No email';
    document.getElementById('modalMsgEmailLink').href = `mailto:${msg.email || ''}`;
    document.getElementById('modalMsgSubject').textContent = msg.subject || 'Portfolio Inquiry';
    document.getElementById('modalMsgDate').textContent = new Date(msg.timestamp).toLocaleString();
    document.getElementById('modalMsgBody').textContent = msg.message || '(Empty message)';

    // Phone / WhatsApp row
    const phoneRow = document.getElementById('modalMsgPhoneRow');
    const phoneVal = document.getElementById('modalMsgPhone');
    const waBtn = document.getElementById('modalWhatsAppBtn');

    if (msg.phone && msg.phone.trim()) {
      phoneRow.classList.remove('hidden');
      phoneVal.textContent = msg.phone;
      if (waBtn) waBtn.title = `Chat with ${msg.name} on WhatsApp (${msg.phone})`;
    } else {
      phoneRow.classList.add('hidden');
      if (waBtn) waBtn.title = 'Reply via WhatsApp';
    }

    // Default reply text in composer
    const quickReplyBox = document.getElementById('modalQuickReplyText');
    if (quickReplyBox) {
      quickReplyBox.value = `Hi ${msg.name},\n\nThank you for reaching out through my developer portfolio regarding "${msg.subject}".\n\n`;
    }

    document.getElementById('messageDetailModal').classList.remove('hidden');
  }

  function closeMessageDetail() {
    document.getElementById('messageDetailModal').classList.add('hidden');
  }

  // DIRECT MULTI-CHANNEL REPLY ACTIONS
  function getActiveMessage() {
    const messages = getStorage('admin_messages', []);
    return messages.find(m => m.id === activeMessageDetailId);
  }

  function markMessageAsReplied(msgId) {
    const messages = getStorage('admin_messages', []);
    const target = messages.find(m => m.id === msgId);
    if (target) {
      target.status = 'replied';
      target.read = true;
      setStorage('admin_messages', messages);
      renderOverviewStats();
      renderMessagesTable();
    }
  }

  // 1. Reply via Gmail Web Direct
  function replyViaGmailDirect() {
    const msg = getActiveMessage();
    if (!msg || !msg.email) {
      showToast('No recipient email available for this message.', 'error');
      return;
    }

    const replyText = document.getElementById('modalQuickReplyText')?.value.trim() || `Hi ${msg.name},\n\nThank you for reaching out through my portfolio!\n\nBest regards,\nNeeraj Kumar Patel`;
    const subject = msg.subject.startsWith('Re:') ? msg.subject : `Re: ${msg.subject}`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(msg.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(replyText)}`;
    
    window.open(gmailUrl, '_blank');
    markMessageAsReplied(msg.id);
    showToast(`Gmail Web opened to reply directly to ${msg.email}`, 'success');
  }

  // 2. Reply via Mailto / Default Mail App (Outlook, Apple Mail, etc.)
  function replyViaMailtoDirect() {
    const msg = getActiveMessage();
    if (!msg || !msg.email) {
      showToast('No recipient email available.', 'error');
      return;
    }

    const replyText = document.getElementById('modalQuickReplyText')?.value.trim() || `Hi ${msg.name},\n\nThank you for reaching out!\n\nBest regards,\nNeeraj Kumar Patel`;
    const subject = msg.subject.startsWith('Re:') ? msg.subject : `Re: ${msg.subject}`;
    const mailtoUrl = `mailto:${encodeURIComponent(msg.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(replyText)}`;

    window.location.href = mailtoUrl;
    markMessageAsReplied(msg.id);
    showToast(`Launching default email client for ${msg.email}`, 'success');
  }

  // 3. Reply via WhatsApp Direct
  function replyViaWhatsAppDirect() {
    const msg = getActiveMessage();
    if (!msg) return;

    let phone = (msg.phone || '').replace(/[^0-9]/g, '');
    if (!phone) {
      const promptedPhone = prompt(`Enter phone/WhatsApp number for ${msg.name}:`, '');
      if (!promptedPhone) return;
      phone = promptedPhone.replace(/[^0-9]/g, '');
      msg.phone = promptedPhone;
      const messages = getStorage('admin_messages', []);
      const target = messages.find(m => m.id === msg.id);
      if (target) target.phone = promptedPhone;
      setStorage('admin_messages', messages);
    }

    const text = `Hi ${msg.name}, I am Neeraj Kumar Patel. I received your portfolio message regarding "${msg.subject}". Let's connect!`;
    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
    markMessageAsReplied(msg.id);
    showToast(`Opening WhatsApp chat with ${msg.name}...`, 'success');
  }

  // 4. Copy Email Address
  function copySenderEmail() {
    const msg = getActiveMessage();
    if (!msg || !msg.email) return;
    navigator.clipboard.writeText(msg.email).then(() => {
      showToast(`Copied email to clipboard: ${msg.email}`, 'info');
    });
  }

  // 5. In-Modal Quick Reply Sender
  function sendQuickReply(channel = 'gmail') {
    if (channel === 'gmail') {
      replyViaGmailDirect();
    } else {
      replyViaMailtoDirect();
    }
  }

  // 6. Template Injector in Modal
  function insertReplyTemplate(type) {
    const msg = getActiveMessage();
    const box = document.getElementById('modalQuickReplyText');
    if (!box) return;

    const senderName = msg ? msg.name : 'there';
    if (type === 'interview') {
      box.value = `Hi ${senderName},\n\nThank you for considering me for this opportunity! I would be delighted to connect for an interview round.\n\nI am available on weekdays between 10:00 AM - 6:00 PM IST.\n\nLooking forward to speaking with the team.\n\nBest regards,\nNeeraj Kumar Patel\nFrontend Developer & UI Designer\nPhone: +91 7348541169`;
    } else if (type === 'project') {
      box.value = `Hi ${senderName},\n\nThank you for reaching out regarding your project requirements. I reviewed your note and would love to build this web application for you.\n\nCould you please share any existing design mockups or feature specifications so I can provide an estimated timeline and tech stack overview?\n\nWarm regards,\nNeeraj Kumar Patel`;
    }
    showToast('Reply template loaded into composer!', 'info');
  }

  function replyToSender(id) {
    openMessageDetail(id);
    replyViaGmailDirect();
  }

  function deleteMessage(id) {
    if (!confirm('Are you sure you want to delete this message?')) return;
    let messages = getStorage('admin_messages', []);
    messages = messages.filter(m => m.id !== id);
    setStorage('admin_messages', messages);
    showToast('Message deleted.', 'info');
    renderOverviewStats();
    renderMessagesTable();
    closeMessageDetail();
  }

  // 3. MAIL TAB (Quick Composer & Presets)
  function sendCustomEmail() {
    const recipient = document.getElementById('mailRecipient').value.trim();
    const subject = document.getElementById('mailSubject').value.trim();
    const message = document.getElementById('mailBody').value.trim();

    if (!recipient || !subject) {
      showToast('Recipient email and subject are required.', 'error');
      return;
    }

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.open(gmailUrl, '_blank');
    showToast('Opening Gmail web composer with your message...', 'success');
  }

  function loadMailTemplate(templateKey) {
    const subjectEl = document.getElementById('mailSubject');
    const bodyEl = document.getElementById('mailBody');

    if (templateKey === 'interview') {
      subjectEl.value = 'Re: Technical Interview Availability - Neeraj Kumar Patel';
      bodyEl.value = `Hi [Recruiter Name],\n\nThank you for inviting me to interview for the Frontend Developer role!\n\nI am available for an interview on [Days / Times]. Looking forward to speaking with the team.\n\nBest regards,\nNeeraj Kumar Patel\nPhone: +91 7348541169\nPortfolio: https://github.com/nirajofficial0`;
    } else if (templateKey === 'freelance') {
      subjectEl.value = 'Web Development Project Proposal & Timeline - Neeraj Kumar Patel';
      bodyEl.value = `Hello [Client Name],\n\nThank you for reaching out about your project. I reviewed your requirements and would love to build this web application.\n\nHere is a brief overview of my proposed tech stack, timeline, and deliverables...\n\nBest regards,\nNeeraj Kumar Patel`;
    } else if (templateKey === 'inquiry') {
      subjectEl.value = 'Thank you for exploring my Portfolio - Neeraj Kumar Patel';
      bodyEl.value = `Hi [Name],\n\nThank you for reaching out through my developer portfolio! I am delighted to connect with you.\n\nLet me know if you would like to schedule a quick call.\n\nWarm regards,\nNeeraj Kumar Patel`;
    }
    showToast('Mail template loaded into composer.', 'info');
    document.getElementById('mailComposerCard').scrollIntoView({ behavior: 'smooth' });
  }

  // 4. REACH TAB (0 BASE REAL-TIME)
  function renderReachAnalytics() {
    const stats = getStorage('admin_reach_stats', {
      totalVisits: 0,
      uniqueVisitors: 0,
      resumeClicks: 0,
      projectClicks: 0,
      githubClicks: 0,
      contactSubmissions: 0
    });
    const visits = getStorage('admin_visits_log', []);
    const messages = getStorage('admin_messages', []);

    const totalV = Math.max(stats.totalVisits || 0, visits.length);
    document.getElementById('reachTotalVisits').textContent = totalV.toLocaleString();
    document.getElementById('reachUniqueVisitors').textContent = (stats.uniqueVisitors || (visits.length > 0 ? 1 : 0)).toLocaleString();
    document.getElementById('reachResumeClicks').textContent = (stats.resumeClicks || 0).toLocaleString();
    document.getElementById('reachProjectClicks').textContent = (stats.projectClicks || 0).toLocaleString();
    document.getElementById('reachGithubClicks').textContent = (stats.githubClicks || 0).toLocaleString();
    document.getElementById('reachContactSubmissions').textContent = (messages.length || stats.contactSubmissions || 0).toLocaleString();
  }

  // 5. PROFILE VISITS TAB (LIVE REAL-TIME RECORD)
  function renderVisitsLog() {
    const visits = getStorage('admin_visits_log', []);
    const tableBody = document.getElementById('visitsTableBody');
    if (!tableBody) return;

    if (visits.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2.5rem; color:var(--text-muted);"><i class="fa-solid fa-users-viewfinder" style="font-size:1.5rem; display:block; margin-bottom:0.5rem; color:var(--text-dim);"></i> No recorded visit logs yet. Visits to your portfolio (index.html) appear here in real time.</td></tr>`;
      return;
    }

    tableBody.innerHTML = visits.map((v, idx) => {
      const timeStr = new Date(v.timestamp).toLocaleString();
      let deviceIcon = 'fa-desktop';
      if (v.device === 'Mobile') deviceIcon = 'fa-mobile-screen';
      if (v.device === 'Tablet') deviceIcon = 'fa-tablet-screen-button';

      return `
        <tr>
          <td style="font-family:var(--font-mono); font-size:0.85rem;">#${visits.length - idx}</td>
          <td style="font-family:var(--font-mono); font-size:0.8rem; color:var(--text-muted);">${timeStr}</td>
          <td><i class="fa-solid ${deviceIcon}"></i> ${v.device || 'Desktop'}</td>
          <td><span style="font-family:var(--font-mono); font-size:0.85rem;">${v.screen || '1920x1080'}</span></td>
          <td><span class="badge badge-read">${escapeHtml(v.browser || 'Chrome')}</span></td>
          <td style="color:var(--text-muted); font-size:0.85rem;">${escapeHtml(v.referrer || 'Direct')}</td>
        </tr>
      `;
    }).join('');
  }

  function clearVisitsLog() {
    if (!confirm('Are you sure you want to clear the visit history logs and reset visit counter to 0?')) return;
    localStorage.removeItem('admin_visits_log');
    const stats = getStorage('admin_reach_stats', {});
    stats.totalVisits = 0;
    stats.uniqueVisitors = 0;
    setStorage('admin_reach_stats', stats);
    renderVisitsLog();
    renderOverviewStats();
    showToast('Visit logs and counters reset to 0.', 'info');
  }

  // 6. REVIEWS & RATINGS TAB
  function renderReviewsList() {
    const reviews = getStorage('admin_reviews', []);
    const container = document.getElementById('reviewsAdminList');
    if (!container) return;

    if (reviews.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding:2rem; color:var(--text-muted);"><i class="fa-solid fa-star-half-stroke" style="font-size:1.5rem; display:block; margin-bottom:0.5rem; color:var(--text-dim);"></i> No reviews currently added. Use the form on the left to add your first client/recruiter review.</div>`;
      return;
    }

    container.innerHTML = reviews.map(rev => {
      const stars = '★'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating);
      return `
        <div class="card-panel" style="margin-bottom:1rem; border-left: 3px solid var(--accent-cyan);">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem; flex-wrap:wrap; gap:0.5rem;">
            <div>
              <h4 style="font-size:1.05rem; font-weight:700;">${escapeHtml(rev.author)}</h4>
              <p style="font-size:0.85rem; color:var(--text-muted);">${escapeHtml(rev.role || 'Client')} • ${escapeHtml(rev.company || '')}</p>
            </div>
            <div style="text-align:right;">
              <span class="star-rating-display" style="font-size:1.1rem; letter-spacing:2px;">${stars}</span>
              <span class="badge ${rev.status === 'approved' ? 'badge-approved' : 'badge-read'}" style="margin-left:0.5rem;">${rev.status || 'approved'}</span>
            </div>
          </div>
          <p style="font-size:0.9rem; color:var(--text-main); margin-bottom:0.75rem; font-style:italic;">"${escapeHtml(rev.comment)}"</p>
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.8rem; color:var(--text-dim);">
            <span>Category: <strong>${escapeHtml(rev.category || 'General')}</strong> | Date: ${rev.date || 'Recent'}</span>
            <div style="display:flex; gap:0.5rem;">
              <button class="table-btn" onclick="adminApp.toggleReviewStatus('${rev.id}')" title="Toggle Visibility">
                <i class="fa-solid fa-eye-slash"></i> Toggle
              </button>
              <button class="table-btn btn-delete" onclick="adminApp.deleteReview('${rev.id}')" title="Delete Review">
                <i class="fa-solid fa-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function handleAddReview(e) {
    e.preventDefault();
    const author = document.getElementById('reviewAuthor').value.trim();
    const role = document.getElementById('reviewRole').value.trim();
    const company = document.getElementById('reviewCompany').value.trim();
    const rating = parseInt(document.getElementById('reviewRatingSelect').value, 10);
    const category = document.getElementById('reviewCategory').value;
    const comment = document.getElementById('reviewComment').value.trim();

    if (!author || !comment) {
      showToast('Please provide reviewer name and feedback comment.', 'error');
      return;
    }

    const reviews = getStorage('admin_reviews', []);
    const newRev = {
      id: 'rev-' + Date.now(),
      author: author,
      role: role || 'Client / Recruiter',
      company: company || 'Organization',
      rating: rating || 5,
      category: category,
      comment: comment,
      date: new Date().toISOString().split('T')[0],
      status: 'approved'
    };

    reviews.unshift(newRev);
    setStorage('admin_reviews', reviews);
    showToast('New review added to portfolio database!', 'success');

    document.getElementById('addReviewForm').reset();
    renderReviewsList();
    renderOverviewStats();
  }

  function toggleReviewStatus(id) {
    const reviews = getStorage('admin_reviews', []);
    const rev = reviews.find(r => r.id === id);
    if (!rev) return;
    rev.status = rev.status === 'approved' ? 'hidden' : 'approved';
    setStorage('admin_reviews', reviews);
    renderReviewsList();
    showToast(`Review visibility updated to ${rev.status}.`, 'info');
  }

  function deleteReview(id) {
    if (!confirm('Are you sure you want to delete this review?')) return;
    let reviews = getStorage('admin_reviews', []);
    reviews = reviews.filter(r => r.id !== id);
    setStorage('admin_reviews', reviews);
    renderReviewsList();
    renderOverviewStats();
    showToast('Review removed.', 'info');
  }

  // 7. SETTINGS TAB
  function renderSettingsInfo() {
    const recoveryEmail = localStorage.getItem('admin_recovery_email') || 'nirajpatel12052003@gmail.com';
    const emailInput = document.getElementById('settingsRecoveryEmail');
    if (emailInput) emailInput.value = recoveryEmail;
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    const currentPwd = document.getElementById('currentPassword').value;
    const newPwd = document.getElementById('newPassword').value;
    const confirmPwd = document.getElementById('confirmNewPassword').value;

    const storedHash = localStorage.getItem('admin_pwd_hash');
    const enteredCurrentHash = await hashPassword(currentPwd);

    if (enteredCurrentHash !== storedHash) {
      showToast('Current password does not match.', 'error');
      return;
    }
    if (newPwd.length < 5) {
      showToast('New password must be at least 5 characters.', 'error');
      return;
    }
    if (newPwd !== confirmPwd) {
      showToast('New passwords do not match.', 'error');
      return;
    }

    const newHash = await hashPassword(newPwd);
    localStorage.setItem('admin_pwd_hash', newHash);
    document.getElementById('changePasswordForm').reset();
    showToast('Password changed successfully!', 'success');
  }

  function handleSaveRecoveryEmail(e) {
    e.preventDefault();
    const email = document.getElementById('settingsRecoveryEmail').value.trim();
    if (!email) {
      showToast('Please enter a valid recovery email.', 'error');
      return;
    }
    localStorage.setItem('admin_recovery_email', email);
    showToast('Recovery email updated.', 'success');
  }

  function resetAllDemoData() {
    if (!confirm('Reset all analytics counters to 0, clear messages and reviews for a clean fresh start?')) return;
    localStorage.removeItem('admin_messages');
    localStorage.removeItem('admin_reviews');
    localStorage.removeItem('admin_visits_log');
    setStorage('admin_reach_stats', {
      totalVisits: 0,
      uniqueVisitors: 0,
      resumeClicks: 0,
      projectClicks: 0,
      githubClicks: 0,
      contactSubmissions: 0
    });
    showToast('Data reset to 0. Reloading clean dashboard...', 'info');
    setTimeout(() => window.location.reload(), 500);
  }

  // --- PASSWORD TOGGLE VISIBILITY ---
  function setupPasswordToggles() {
    document.querySelectorAll('.toggle-pwd-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const inputId = this.getAttribute('data-target');
        const input = document.getElementById(inputId);
        if (!input) return;
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        this.innerHTML = isPassword ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
      });
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- BOOTSTRAP ---
  document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    setupPasswordToggles();

    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', function () {
        const tab = this.getAttribute('data-tab');
        if (tab) switchTab(tab);
      });
    });

    document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
      document.getElementById('adminSidebar')?.classList.toggle('open');
    });

    document.getElementById('setupForm')?.addEventListener('submit', handleSetupSubmit);
    document.getElementById('loginForm')?.addEventListener('submit', handleLoginSubmit);
    document.getElementById('forgotFormStep2')?.addEventListener('submit', finalizePasswordReset);
    document.getElementById('changePasswordForm')?.addEventListener('submit', handleChangePassword);
    document.getElementById('recoveryEmailForm')?.addEventListener('submit', handleSaveRecoveryEmail);
    document.getElementById('addReviewForm')?.addEventListener('submit', handleAddReview);

    document.getElementById('messageSearchInput')?.addEventListener('input', (e) => {
      renderMessagesTable(e.target.value);
    });

    setInterval(() => {
      const clockEl = document.getElementById('liveClockText');
      if (clockEl) {
        clockEl.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      }
    }, 1000);
  });

  // Global API exposure
  window.adminApp = {
    switchTab,
    handleLogout,
    openForgotModal,
    closeForgotModal,
    triggerMockRecoveryEmail,
    quickResetFromEmail,
    proceedToReset,
    openMessageDetail,
    closeMessageDetail,
    replyToSender,
    replyViaGmailDirect,
    replyViaMailtoDirect,
    replyViaWhatsAppDirect,
    copySenderEmail,
    sendQuickReply,
    insertReplyTemplate,
    deleteMessage,
    sendCustomEmail,
    loadMailTemplate,
    clearVisitsLog,
    toggleReviewStatus,
    deleteReview,
    resetAllDemoData,
    filterMessages: (status) => renderMessagesTable('', status)
  };

})();
