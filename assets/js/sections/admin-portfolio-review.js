/**
 * PORTFOLIO REVIEWS & RATINGS CONTROLLER
 * Handles Visitor Rating/Review Submissions & Admin-Protected Reviews Vault
 */

(function () {
  'use strict';

  // Hashing helper for admin password verification
  async function hashPassword(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str + '_salt_neeraj_portfolio_2026');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

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

  // Broadcast sync helper
  let syncChannel = null;
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      syncChannel = new BroadcastChannel('admin_realtime_sync');
      syncChannel.onmessage = function (event) {
        if (event.data?.type === 'NEW_REVIEW' || event.data?.type === 'REVIEW_UPDATE') {
          renderPortfolioReviews();
        }
      };
    }
  } catch (e) {}

  // 1. STAR RATING PICKER LOGIC FOR VISITORS
  let selectedRating = 5;
  const ratingLabels = {
    5: '★★★★★ (5.0 / 5) - Exceptional Work & Design',
    4: '★★★★☆ (4.0 / 5) - Very Good / Highly Recommended',
    3: '★★★☆☆ (3.0 / 5) - Good / Satisfied',
    2: '★★☆☆☆ (2.0 / 5) - Fair Experience',
    1: '★☆☆☆☆ (1.0 / 5) - Needs Improvement'
  };

  function initStarRatingPicker() {
    const starContainer = document.getElementById('visitorStarPicker');
    const ratingLabel = document.getElementById('visitorRatingLabel');
    const hiddenInput = document.getElementById('visitorRatingValue');
    if (!starContainer) return;

    const stars = starContainer.querySelectorAll('.star-rating-star');

    function updateStarsDisplay(val) {
      stars.forEach(s => {
        const starVal = parseInt(s.getAttribute('data-value'), 10);
        if (starVal <= val) {
          s.classList.add('selected');
        } else {
          s.classList.remove('selected');
        }
      });
      if (ratingLabel) ratingLabel.textContent = ratingLabels[val] || `${val} Stars`;
      if (hiddenInput) hiddenInput.value = val;
    }

    stars.forEach(star => {
      star.addEventListener('mouseover', function () {
        const val = parseInt(this.getAttribute('data-value'), 10);
        stars.forEach(s => {
          const sVal = parseInt(s.getAttribute('data-value'), 10);
          s.classList.toggle('hovered', sVal <= val);
        });
      });

      star.addEventListener('mouseout', function () {
        stars.forEach(s => s.classList.remove('hovered'));
      });

      star.addEventListener('click', function () {
        selectedRating = parseInt(this.getAttribute('data-value'), 10);
        updateStarsDisplay(selectedRating);
      });
    });

    updateStarsDisplay(selectedRating);
  }

  // 2. VISITOR REVIEW FORM SUBMISSION
  function initVisitorReviewForm() {
    const form = document.getElementById('visitorReviewForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('visitorName')?.value.trim() || '';
      const role = document.getElementById('visitorRole')?.value.trim() || 'Portfolio Visitor';
      const category = document.getElementById('visitorCategory')?.value || 'Frontend Development';
      const comment = document.getElementById('visitorComment')?.value.trim() || '';
      const rating = selectedRating || 5;

      if (!name || !comment) {
        if (typeof window.showToast === 'function') {
          window.showToast('Please enter your name and a brief review.', 'error');
        } else {
          alert('Please enter your name and a brief review.');
        }
        return;
      }

      const reviews = getStorage('admin_reviews', []);
      const newReview = {
        id: 'rev-' + Date.now(),
        author: name,
        role: role,
        company: role.includes('@') ? role.split('@')[1].trim() : 'External Visitor',
        rating: rating,
        category: category,
        comment: comment,
        date: new Date().toISOString().split('T')[0],
        status: 'approved'
      };

      reviews.unshift(newReview);
      setStorage('admin_reviews', reviews);

      // Broadcast to Admin Dashboard in real time
      if (syncChannel) {
        try {
          syncChannel.postMessage({ type: 'NEW_REVIEW', payload: newReview });
        } catch (err) {}
      }

      // Success feedback
      const toastMsg = `Thank you, ${name}! Your ${rating}★ review was submitted directly to the Admin Dashboard.`;
      if (typeof window.showToast === 'function') {
        window.showToast(toastMsg, 'success');
      } else {
        alert(toastMsg);
      }

      // Reset form
      form.reset();
      selectedRating = 5;
      initStarRatingPicker();

      // Refresh reviews display
      renderPortfolioReviews();
    });
  }

  // 3. RENDER REVIEWS & RATINGS SUMMARY
  function renderPortfolioReviews() {
    const isAuth = sessionStorage.getItem('admin_authenticated_session') === 'true' ||
                   localStorage.getItem('admin_authenticated_persistent') === 'true';

    const lockedView = document.getElementById('portfolioReviewsLockedView');
    const unlockedView = document.getElementById('portfolioReviewsUnlockedView');
    const scoreEl = document.getElementById('portfolioAvgScore');
    const totalCountEl = document.getElementById('portfolioReviewsTotalCount');
    const visitorAvgDisplay = document.getElementById('visitorReviewsAvgSummary');

    const reviews = getStorage('admin_reviews', []);
    let avg = '0.0';

    if (reviews.length > 0) {
      avg = (reviews.reduce((acc, r) => acc + Number(r.rating || 5), 0) / reviews.length).toFixed(1);
    }

    // Update public summary badge
    if (visitorAvgDisplay) {
      visitorAvgDisplay.innerHTML = `
        <span style="color:#fbbf24; font-size:1.3rem;">★</span> 
        <strong style="color:#fff; font-size:1.1rem;">${avg} / 5.0</strong> 
        <span style="color:var(--text-muted); font-size:0.85rem; margin-left:0.35rem;">(${reviews.length} ${reviews.length === 1 ? 'rating' : 'ratings'} received)</span>
      `;
    }

    if (scoreEl) scoreEl.textContent = avg;
    if (totalCountEl) totalCountEl.textContent = `${reviews.length} Verified Endorsement${reviews.length === 1 ? '' : 's'}`;

    if (!lockedView || !unlockedView) return;

    if (isAuth) {
      lockedView.classList.add('hidden');
      unlockedView.classList.remove('hidden');

      const grid = document.getElementById('portfolioReviewsGrid');
      if (grid) {
        const approved = reviews.filter(r => r.status !== 'hidden');
        if (approved.length === 0) {
          grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:2rem; color:var(--text-muted);"><i class="fa-solid fa-star-half-stroke" style="font-size:1.5rem; display:block; margin-bottom:0.5rem; color:var(--text-dim);"></i> No reviews submitted yet. Submit one using the form above!</div>`;
        } else {
          grid.innerHTML = approved.map(rev => {
            const stars = '★'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating);
            const initials = rev.author ? rev.author.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'V';
            return `
              <div class="portfolio-review-card">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
                  <div class="portfolio-review-rating">${stars}</div>
                  <span class="badge badge-approved" style="font-size:0.75rem; padding:0.2rem 0.5rem; background:rgba(6,182,212,0.15); color:var(--accent-secondary); border-radius:999px;">${escapeHtml(rev.category || 'Client')}</span>
                </div>
                <p class="portfolio-review-text">"${escapeHtml(rev.comment)}"</p>
                <div class="portfolio-review-author">
                  <div class="review-author-avatar">${initials}</div>
                  <div>
                    <div class="review-author-name">${escapeHtml(rev.author)}</div>
                    <div class="review-author-role">${escapeHtml(rev.role || 'Visitor')}</div>
                  </div>
                </div>
              </div>
            `;
          }).join('');
        }
      }
    } else {
      lockedView.classList.remove('hidden');
      unlockedView.classList.add('hidden');
    }
  }

  // 4. ADMIN UNLOCK / LOCK ACTIONS
  window.openAdminReviewUnlockModal = function () {
    const storedHash = localStorage.getItem('admin_pwd_hash');
    if (!storedHash) {
      if (typeof window.showToast === 'function') {
        window.showToast('Please create your personalized password in Admin Dashboard first.', 'info');
      }
      setTimeout(() => {
        window.location.href = 'admin.html';
      }, 700);
      return;
    }

    const modal = document.getElementById('adminReviewUnlockModal');
    if (modal) modal.classList.add('active');
  };

  window.closeAdminReviewUnlockModal = function () {
    const modal = document.getElementById('adminReviewUnlockModal');
    if (modal) modal.classList.remove('active');
  };

  window.submitAdminReviewPassword = async function (e) {
    if (e) e.preventDefault();
    const input = document.getElementById('portfolioAdminPasswordInput');
    if (!input) return;

    const entered = input.value;
    const storedHash = localStorage.getItem('admin_pwd_hash');
    const enteredHash = await hashPassword(entered);

    if (enteredHash === storedHash) {
      sessionStorage.setItem('admin_authenticated_session', 'true');
      if (typeof window.showToast === 'function') {
        window.showToast('Admin authenticated! Vault unlocked.', 'success');
      }
      window.closeAdminReviewUnlockModal();
      renderPortfolioReviews();
      input.value = '';
    } else {
      if (typeof window.showToast === 'function') {
        window.showToast('Incorrect password. Please try again.', 'error');
      }
    }
  };

  window.lockAdminReviews = function () {
    sessionStorage.removeItem('admin_authenticated_session');
    localStorage.removeItem('admin_authenticated_persistent');
    if (typeof window.showToast === 'function') {
      window.showToast('Admin session locked.', 'info');
    }
    renderPortfolioReviews();
  };

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    initStarRatingPicker();
    initVisitorReviewForm();
    renderPortfolioReviews();
  });

  window.addEventListener('storage', function(e) {
    if (e.key === 'admin_reviews' || e.key === 'admin_authenticated_session') {
      renderPortfolioReviews();
    }
  });

  window.renderPortfolioReviews = renderPortfolioReviews;
})();
