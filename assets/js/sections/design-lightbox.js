/**
 * UI / DESIGN LIGHTBOX MODAL MODULE
 */

const uiDesignsData = {
  'saas-landing': {
    title: 'Modern SaaS AI Platform Landing Page',
    platform: 'Figma & Web Design',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
    desc: 'High-converting dark glassmorphic landing page designed for an AI Developer Tool with feature grid, interactive pricing, and testimonial slider.'
  },
  'fintech-app': {
    title: 'Neo-Bank Mobile Banking App UI',
    platform: 'Figma Mobile UI',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80',
    desc: 'Minimalist iOS/Android mobile wallet experience featuring instant UPI transfers, card management, spend analytics, and biometric auth screens.'
  },
  'student-portal-ui': {
    title: 'Academic Student Portal & LMS Dashboard',
    platform: 'Figma & UI Systems',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80',
    desc: 'Clean, user-centric dashboard UI crafted for college students to view lecture schedules, GPA progression, assignment submissions, and attendance alerts.'
  },
  'ecommerce-ui': {
    title: 'Luxury Streetwear E-Commerce Experience',
    platform: 'Figma & Responsive UI',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
    desc: 'Aesthetic, typography-driven shopping interface featuring 3D product viewports, dynamic size guides, and one-tap checkout UX.'
  }
};

window.openUiLightbox = function(designKey) {
  const item = uiDesignsData[designKey];
  const uiLightboxModal = document.getElementById('uiLightboxModal');
  const uiLightboxContent = document.getElementById('uiLightboxContent');
  if (!item || !uiLightboxModal || !uiLightboxContent) return;

  uiLightboxContent.innerHTML = `
    <div>
      <span class="section-tag" style="margin-bottom:0.6rem;">${item.platform}</span>
      <h2 style="font-size:1.75rem; margin-bottom:1rem;">${item.title}</h2>
      <div style="border-radius:14px; overflow:hidden; margin-bottom:1.2rem; max-height:420px; background:#000;">
        <img src="${item.image}" alt="${item.title}" style="width:100%; height:100%; object-fit:cover;">
      </div>
      <p style="font-size:0.95rem; color:var(--text-secondary); line-height:1.7; margin-bottom:1.5rem;">${item.desc}</p>
      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-color); padding-top:1rem;">
        <span style="font-size:0.85rem; color:var(--text-muted);"><i class="fa-brands fa-figma"></i> Designed in Figma & Modern CSS</span>
        <button class="btn btn-outline btn-sm" onclick="closeModal('uiLightboxModal')">Close Preview</button>
      </div>
    </div>
  `;

  uiLightboxModal.classList.add('open');
};
