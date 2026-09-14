/**
 * PROJECTS FILTER, REAL-TIME SEARCH & DETAILS MODAL MODULE
 */

const projectDatabase = {
  'sms': {
    title: 'Student Management System (Flagship Project)',
    category: 'Full Stack & Database Web Application',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    badge: 'Placement Star Project',
    problem: 'Educational institutions struggle with tedious manual attendance logging, delayed grade calculations, scattered student profiles, and prone-to-error paper records.',
    solution: 'An end-to-end centralized academic management platform featuring role-based authentication (Admin, Faculty, Student), real-time attendance tracking, automated GPA/CGPA grading calculation, instant report generation, and robust SQL Server backend.',
    techStack: ['HTML5 / CSS3', 'JavaScript ES6+', 'React.js', 'SQL Server / MySQL', 'PHP / Node.js Backend', 'REST APIs'],
    features: [
      'Secure Role-based Authentication & Profile Management',
      'Student Enrollment & Dynamic CRUD Operations',
      'Automated Attendance Tracker with percentage analytics',
      'Examination Marks & Grade Card / Transcript Generation',
      'Course & Subject Allocation Module',
      'Exportable CSV / PDF Student Reports & Filter Engine'
    ],
    implemented: [
      'Designed normalized Relational Database Schema in SQL Server with foreign keys and optimized indexes.',
      'Developed interactive, responsive frontend views with quick filtering, searching, and pagination.',
      'Implemented secure input sanitization and parameterized queries to prevent SQL injections.',
      'Engineered dynamic chart visualization for student attendance and score trends.'
    ],
    github: 'https://github.com/nirajofficial0/student-management-system',
    demo: '#sms-preview'
  },
  'ecommerce': {
    title: 'NextGen E-Commerce Web Store',
    category: 'Frontend & Modern Web Application',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&auto=format&fit=crop&q=80',
    badge: 'React & JS Showcase',
    problem: 'Traditional small business websites have clunky navigation, slow load times, and poor mobile checkout flows that cause high cart abandonment.',
    solution: 'A high-speed, modern E-Commerce web experience with lightning-fast catalog filtering, interactive cart state management, persistent LocalStorage cart sync, coupon engine, and seamless checkout workflow simulation.',
    techStack: ['React.js', 'JavaScript ES6+', 'Modern Vanilla CSS', 'LocalStorage API', 'Responsive Grid'],
    features: [
      'Dynamic Product Catalog with multi-attribute filtering (Price, Category, Rating)',
      'Real-time Cart with quantity adjust, subtotal calculation, and promo code discounts',
      'Quick View product modal with image carousel',
      'Wishlist management & saved items',
      'Checkout simulation with address validation and UPI payment flow'
    ],
    implemented: [
      'Engineered responsive CSS Flexbox/Grid catalog with smooth image transitions.',
      'Built state management architecture for instant cart updates without page reload.',
      'Integrated local storage persistence to retain user cart items across sessions.'
    ],
    github: 'https://github.com/nirajofficial0/ecommerce-store-web',
    demo: '#ecommerce-preview'
  },
  'admin-dashboard': {
    title: 'Enterprise Analytics & Admin Dashboard',
    category: 'UI/UX & Dashboard Engineering',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    badge: 'Data & Charts UI',
    problem: 'Managers need clear, real-time visual insights on user engagement, sales metrics, and server health without overwhelming technical clutter.',
    solution: 'A dark/light responsive admin panel with real-time Chart.js visual analytics, user management table with search and pagination, recent activity logs, and metric cards.',
    techStack: ['JavaScript ES6+', 'HTML5 Canvas', 'Chart.js', 'CSS Glassmorphism', 'FontAwesome 6'],
    features: [
      'Interactive Revenue, Traffic & User Growth Charts',
      'Data table with multi-column sorting, search & status badges',
      'Dark & Light Mode switchable interface',
      'System notifications dropdown and quick action modals',
      'Export data to CSV / JSON'
    ],
    implemented: [
      'Integrated interactive Chart.js line and bar graphs with custom tooltip themes.',
      'Crafted a responsive sidebar navigation with collapse states for mobile devices.',
      'Built data filtering algorithms to query tabular records in under 10ms.'
    ],
    github: 'https://github.com/nirajofficial0/admin-analytics-dashboard',
    demo: '#admin-preview'
  },
  'auth-system': {
    title: 'Secure Authentication & User Access System',
    category: 'Security & Backend Integration',
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&auto=format&fit=crop&q=80',
    badge: 'Full Stack Security',
    problem: 'Insecure web forms risk credential theft, weak passwords, and session hijacking if proper client & server validations are missing.',
    solution: 'A robust Login & Registration system featuring client-side real-time regex password validation, strength meters, password visibility toggle, simulated OTP verification, and secure token handling.',
    techStack: ['JavaScript', 'HTML5 Form Validation', 'PHP / Node.js Backend', 'SQL Server / MySQL', 'CSS3 Animations'],
    features: [
      'Real-time Password Strength Indicator (Length, Special chars, Numbers)',
      'OTP Verification code flow with countdown timer',
      'Remember Me & Session token handling',
      'Password Reset & Email validation workflow',
      'Custom error boundary and toast alerts'
    ],
    implemented: [
      'Built regex-based dynamic input validation with instant visual feedback cues.',
      'Designed intuitive UI tabs for switching smoothly between Login and Signup modes.',
      'Implemented CSRF token simulation and password hashing conceptual workflow.'
    ],
    github: 'https://github.com/nirajofficial0/secure-auth-system',
    demo: '#auth-preview'
  },
  'portfolio-v2': {
    title: 'Ultra-Modern Placement Portfolio Experience',
    category: 'Creative UI & Frontend Engineering',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    badge: 'Live Experience',
    problem: 'Standard resumes and generic static portfolios get ignored by recruiters within 5 seconds due to poor aesthetics, slow loading, and lack of interactive depth.',
    solution: 'A state-of-the-art interactive digital portfolio equipped with Dark/Light theme, dynamic UPI QR payment engine, built-in ATS resume viewer, live search filters, and recruiter conversion highlights.',
    techStack: ['HTML5', 'Vanilla CSS3', 'JavaScript ES6+', 'Web3Forms API', 'QR Engine'],
    features: [
      'Dual Theme System (Dark / Light) with LocalStorage memory',
      'Dynamic UPI QR Payment Generator with preset & custom amount support',
      'Interactive ATS Printable Resume Modal',
      'Project Deep-dive modals with architecture breakdown',
      '1-Click Clipboard copy utilities with toast alerts'
    ],
    implemented: [
      'Crafted a cohesive CSS design system with custom properties and glassmorphism.',
      'Built custom lightweight Vanilla JS modules without bloated external framework dependencies.',
      'Optimized responsive layouts and accessibility scores for peak performance.'
    ],
    github: 'https://github.com/nirajofficial0/portfolio-design',
    demo: '#home'
  }
};

window.openProjectModal = function(projectId) {
  const data = projectDatabase[projectId];
  const projectModal = document.getElementById('projectModal');
  const projectModalContent = document.getElementById('projectModalContent');
  if (!data || !projectModal || !projectModalContent) return;

  projectModalContent.innerHTML = `
    <div style="position:relative;">
      <span class="section-tag" style="margin-bottom:0.6rem;">${data.category}</span>
      <h2 style="font-size:1.85rem; margin-bottom:1rem;">${data.title}</h2>
      <div style="border-radius:14px; overflow:hidden; margin-bottom:1.5rem; height:240px; background:#000;">
        <img src="${data.image}" alt="${data.title}" style="width:100%; height:100%; object-fit:cover;">
      </div>

      <div style="margin-bottom:1.5rem;">
        <h4 style="font-size:1rem; color:var(--accent-secondary); margin-bottom:0.4rem;"><i class="fa-solid fa-triangle-exclamation"></i> Problem Statement:</h4>
        <p style="font-size:0.92rem; color:var(--text-secondary); line-height:1.6;">${data.problem}</p>
      </div>

      <div style="margin-bottom:1.5rem;">
        <h4 style="font-size:1rem; color:var(--accent-success); margin-bottom:0.4rem;"><i class="fa-solid fa-lightbulb"></i> Solution & Overview:</h4>
        <p style="font-size:0.92rem; color:var(--text-secondary); line-height:1.6;">${data.solution}</p>
      </div>

      <div style="margin-bottom:1.5rem;">
        <h4 style="font-size:1rem; margin-bottom:0.6rem;"><i class="fa-solid fa-layer-group"></i> Technologies Used:</h4>
        <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
          ${data.techStack.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
      </div>

      <div style="margin-bottom:1.5rem;">
        <h4 style="font-size:1rem; margin-bottom:0.6rem;"><i class="fa-solid fa-check-double"></i> Key Features:</h4>
        <ul style="padding-left:1.2rem; font-size:0.9rem; color:var(--text-secondary); line-height:1.7;">
          ${data.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
      </div>

      <div style="margin-bottom:2rem; background:rgba(99,102,241,0.08); padding:1rem 1.2rem; border-radius:12px; border-left:3px solid var(--accent-primary);">
        <h4 style="font-size:1rem; color:var(--text-primary); margin-bottom:0.5rem;"><i class="fa-solid fa-code-commit"></i> What I Implemented (My Contribution):</h4>
        <ul style="padding-left:1.2rem; font-size:0.88rem; color:var(--text-secondary); line-height:1.6;">
          ${data.implemented.map(imp => `<li>${imp}</li>`).join('')}
        </ul>
      </div>

      <div style="display:flex; gap:1rem; flex-wrap:wrap; border-top:1px solid var(--border-color); padding-top:1.2rem;">
        <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
          <i class="fa-brands fa-github"></i> View GitHub Repository
        </a>
        <a href="${data.demo}" class="btn btn-primary btn-sm" onclick="closeModal('projectModal')">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> Explore in Portfolio
        </a>
      </div>
    </div>
  `;

  projectModal.classList.add('open');
};

function initProjects() {
  const projFilterBtns = document.querySelectorAll('.proj-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const projectSearchInput = document.getElementById('projectSearchInput');

  let activeProjectCategory = 'all';

  function filterProjects() {
    const searchTerm = projectSearchInput ? projectSearchInput.value.toLowerCase().trim() : '';

    projectCards.forEach(card => {
      const categoryMatch = activeProjectCategory === 'all' || card.getAttribute('data-category').includes(activeProjectCategory);
      const title = card.querySelector('.project-name')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('.project-desc')?.textContent.toLowerCase() || '';
      const tags = Array.from(card.querySelectorAll('.tech-tag')).map(t => t.textContent.toLowerCase()).join(' ');

      const searchMatch = !searchTerm || title.includes(searchTerm) || desc.includes(searchTerm) || tags.includes(searchTerm);

      if (categoryMatch && searchMatch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  projFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeProjectCategory = btn.getAttribute('data-filter');
      filterProjects();
    });
  });

  if (projectSearchInput) {
    projectSearchInput.addEventListener('input', filterProjects);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProjects);
} else {
  initProjects();
}
