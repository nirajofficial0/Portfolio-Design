/**
 * PORTFOLIO REAL-TIME TRACKER & BRIDGE
 * 100% Real-Time Visitor Logging, Reach Tracking, and Contact Synchronization
 */
(function() {
  'use strict';

  // BroadcastChannel for instant multi-tab live sync
  let syncChannel = null;
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      syncChannel = new BroadcastChannel('admin_realtime_sync');
    }
  } catch (e) {
    console.warn('BroadcastChannel not supported');
  }

  function broadcastLiveUpdate(actionType, payload) {
    if (syncChannel) {
      try {
        syncChannel.postMessage({ type: actionType, payload: payload, timestamp: Date.now() });
      } catch (err) {}
    }
  }

  // Safe LocalStorage helpers
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
      console.warn('LocalStorage write error:', e);
    }
  }

  // Clean old legacy dummy stats if present (e.g. 1420 / 890)
  function sanitizeLegacyData() {
    const existingStats = getStorage('admin_reach_stats', null);
    if (existingStats && (existingStats.totalVisits >= 1420 || existingStats.uniqueVisitors >= 890)) {
      // Reset to actual clean logs count
      const existingLogs = getStorage('admin_visits_log', []);
      const existingMsgs = getStorage('admin_messages', []);
      const cleanStats = {
        totalVisits: existingLogs.length,
        uniqueVisitors: existingLogs.length > 0 ? Math.min(existingLogs.length, 1) : 0,
        resumeClicks: 0,
        projectClicks: 0,
        githubClicks: 0,
        contactSubmissions: existingMsgs.length
      };
      setStorage('admin_reach_stats', cleanStats);
    }

    // Clean legacy dummy messages if user wants 0 start
    const existingMsgs = getStorage('admin_messages', null);
    if (existingMsgs && existingMsgs.some(m => m.id === 'msg-101' || m.id === 'msg-102')) {
      // Remove placeholder seed messages so inbox starts clean
      const realMsgs = existingMsgs.filter(m => !m.id.startsWith('msg-10'));
      setStorage('admin_messages', realMsgs);
    }

    // Clean legacy dummy reviews if user wants 0 start
    const existingReviews = getStorage('admin_reviews', null);
    if (existingReviews && existingReviews.some(r => r.id === 'rev-201' || r.id === 'rev-202')) {
      const realReviews = existingReviews.filter(r => !r.id.startsWith('rev-20'));
      setStorage('admin_reviews', realReviews);
    }
  }

  sanitizeLegacyData();

  // 1. RECORD REAL-TIME PROFILE VISIT (Starts at 0 and increments +1 per visit)
  function recordProfileVisit() {
    const sessionKey = 'portfolio_visited_active_session';
    const isReturningInSession = sessionStorage.getItem(sessionKey);

    const visitsLog = getStorage('admin_visits_log', []);
    const reachStats = getStorage('admin_reach_stats', {
      totalVisits: 0,
      uniqueVisitors: 0,
      resumeClicks: 0,
      projectClicks: 0,
      githubClicks: 0,
      contactSubmissions: 0
    });

    // Always increment total visits +1
    reachStats.totalVisits = (reachStats.totalVisits || 0) + 1;

    // Increment unique visitors if first time this session
    if (!isReturningInSession) {
      reachStats.uniqueVisitors = (reachStats.uniqueVisitors || 0) + 1;
      sessionStorage.setItem(sessionKey, 'true');
    }

    // Determine device category
    const width = window.innerWidth;
    let deviceType = 'Desktop';
    if (width < 768) deviceType = 'Mobile';
    else if (width < 1024) deviceType = 'Tablet';

    // Determine browser
    const ua = navigator.userAgent;
    let browser = 'Chrome';
    if (ua.indexOf('Firefox') > -1) browser = 'Firefox';
    else if (ua.indexOf('Edg') > -1) browser = 'Microsoft Edge';
    else if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) browser = 'Safari';
    else if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) browser = 'Opera';

    // Determine referrer
    let referrer = 'Direct / Portfolio Link';
    if (document.referrer) {
      try {
        const refUrl = new URL(document.referrer);
        referrer = refUrl.hostname;
      } catch (e) {
        referrer = document.referrer;
      }
    }

    const newVisitRecord = {
      id: 'vis-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      device: deviceType,
      screen: `${window.screen.width}x${window.screen.height}`,
      browser: browser,
      referrer: referrer,
      url: window.location.pathname || '/'
    };

    // Prepend to visit log (keep up to 150 recent records)
    visitsLog.unshift(newVisitRecord);
    if (visitsLog.length > 150) visitsLog.pop();

    setStorage('admin_visits_log', visitsLog);
    setStorage('admin_reach_stats', reachStats);

    // Notify open dashboard tabs in real-time
    broadcastLiveUpdate('NEW_VISIT', {
      totalVisits: reachStats.totalVisits,
      uniqueVisitors: reachStats.uniqueVisitors,
      latestVisit: newVisitRecord
    });
  }

  // 2. TRACK REAL-TIME REACH ACTIONS (Resume clicks, Project views, GitHub clicks)
  window.trackReachAction = function(actionType) {
    const reachStats = getStorage('admin_reach_stats', {
      totalVisits: 0,
      uniqueVisitors: 0,
      resumeClicks: 0,
      projectClicks: 0,
      githubClicks: 0,
      contactSubmissions: 0
    });

    if (actionType === 'resume') {
      reachStats.resumeClicks = (reachStats.resumeClicks || 0) + 1;
    } else if (actionType === 'project') {
      reachStats.projectClicks = (reachStats.projectClicks || 0) + 1;
    } else if (actionType === 'github') {
      reachStats.githubClicks = (reachStats.githubClicks || 0) + 1;
    } else if (actionType === 'contact') {
      reachStats.contactSubmissions = (reachStats.contactSubmissions || 0) + 1;
    }

    setStorage('admin_reach_stats', reachStats);
    broadcastLiveUpdate('REACH_ACTION', { action: actionType, stats: reachStats });
  };

  // 3. REAL-TIME CONTACT FORM HOOK (Logs message & phone/WhatsApp contact)
  function hookContactForm() {
    const contactForm = document.getElementById('mainContactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function() {
      const name = contactForm.querySelector('input[name="name"]')?.value.trim() || 'Anonymous';
      const email = contactForm.querySelector('input[name="email"]')?.value.trim() || '';
      const phone = contactForm.querySelector('input[name="phone"]')?.value.trim() || '';
      const subject = contactForm.querySelector('input[name="subject"]')?.value.trim() || 'Portfolio Inquiry';
      const message = contactForm.querySelector('textarea[name="message"]')?.value.trim() || '';

      const messages = getStorage('admin_messages', []);
      const newMsg = {
        id: 'msg-' + Date.now(),
        name: name,
        email: email,
        phone: phone,
        subject: subject,
        message: message,
        timestamp: new Date().toISOString(),
        read: false,
        status: 'new'
      };

      messages.unshift(newMsg);
      setStorage('admin_messages', messages);

      // Increment contact submissions count
      window.trackReachAction('contact');

      // Broadcast instant live update to admin dashboard
      broadcastLiveUpdate('NEW_MESSAGE', newMsg);
    });
  }

  // 4. ATTACH AUTOMATIC CLICK LISTENERS TO PORTFOLIO CTAs
  function attachReachListeners() {
    // Resume modal/buttons
    document.querySelectorAll('[onclick*="openResumeModal"], a[href*="resume"]').forEach(btn => {
      btn.addEventListener('click', () => window.trackReachAction('resume'));
    });

    // Project cards / detail triggers
    document.querySelectorAll('[onclick*="openProjectModal"], .project-card, .project-card-link').forEach(btn => {
      btn.addEventListener('click', () => window.trackReachAction('project'));
    });

    // GitHub external links
    document.querySelectorAll('a[href*="github.com"]').forEach(btn => {
      btn.addEventListener('click', () => window.trackReachAction('github'));
    });
  }

  // 5. STEALTH ADMIN ACCESS FOR OWNER (NEERAJ KUMAR PATEL)
  // Completely hidden from ordinary visitors. Accessible via shortcut or secret footer trigger.
  function initStealthAdminAccess() {
    // Hotkey: Ctrl + Shift + A or Alt + A
    window.addEventListener('keydown', function(e) {
      if ((e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) ||
          (e.altKey && (e.key === 'A' || e.key === 'a'))) {
        e.preventDefault();
        window.location.href = 'admin.html';
      }
    });

    // Hidden footer trigger: Double click on copyright symbol '©'
    const footerText = document.querySelector('.footer-bottom p');
    if (footerText) {
      footerText.addEventListener('dblclick', function() {
        window.location.href = 'admin.html';
      });
    }
  }

  // Admin session helper
  window.checkAdminSession = function() {
    return sessionStorage.getItem('admin_authenticated_session') === 'true' ||
           localStorage.getItem('admin_authenticated_persistent') === 'true';
  };

  // Initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      recordProfileVisit();
      hookContactForm();
      attachReachListeners();
      initStealthAdminAccess();
    });
  } else {
    recordProfileVisit();
    hookContactForm();
    attachReachListeners();
    initStealthAdminAccess();
  }
})();
