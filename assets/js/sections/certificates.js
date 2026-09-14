/**
 * CERTIFICATE PREVIEW & SCANNED ATTACHMENT SYSTEM MODULE
 */

const certDetailsData = {
  'nss-camp': {
    title: 'NSS 7-Days Special Residential Camp',
    authority: 'National Service Scheme (NSS) • Ministry of Youth Affairs & Sports',
    heading: 'Certificate of NSS 7-Days Camp',
    subHeading: 'Community Development, Swachh Bharat & Social Leadership',
    desc: 'Awarded to Neeraj Kumar Patel for successfully completing the intensive 7-Days Special Residential Camp with distinction in rural community development, Swachh Bharat sanitation drives, and leadership.',
    serial: 'NSS-CAMP-2025-0842',
    date: 'Special Residential Camp • Verified Volunteer',
    sig1Title: 'NSS Programme Officer',
    sig2Title: 'University Coordinator'
  },
  'blood-donation': {
    title: 'Blood Donation Camp & Voluntary Donor',
    authority: 'Indian Red Cross Society & University NSS Unit',
    heading: 'Certificate of Blood Donation & Service',
    subHeading: 'Voluntary Blood Donor & Camp Organization',
    desc: 'Presented to Neeraj Kumar Patel in recognition of voluntary blood donation and distinguished coordination in organizing the Campus Blood Donation Camp for emergency healthcare reserves.',
    serial: 'BDC-RED-CROSS-9104',
    date: 'Campus Blood Donation Drive • Certified Donor',
    sig1Title: 'Chief Medical Officer',
    sig2Title: 'NSS Convener'
  },
  'annual-fest': {
    title: 'University Annual Fest — NSS Stall & Event Management',
    authority: 'University Annual Fest Organizing Committee & Student Affairs',
    heading: 'Certificate of Event Management',
    subHeading: 'NSS Awareness Stall, Discipline & Stage Handling',
    desc: 'Awarded to Neeraj Kumar Patel for exemplary leadership in managing the official NSS Awareness Stall, ensuring audience discipline, and coordinating auditorium entry logistics during the University Annual Fest.',
    serial: 'UAF-DISC-MGNT-3321',
    date: 'University Annual Fest • Lead Coordinator',
    sig1Title: 'Dean of Student Welfare',
    sig2Title: 'Fest General Secretary'
  },
  'quiz-python': {
    title: 'College Python Quiz Competition',
    authority: 'Department of Computer Applications • Tech Society',
    heading: 'Certificate of Merit & Participation',
    subHeading: 'College Python Programming Quiz Contest',
    desc: 'Awarded to Neeraj Kumar Patel for active participation and competitive problem-solving in the College Python Quiz Competition covering core Python syntax, OOP logic, and data structures.',
    serial: 'TECH-PY-QUIZ-5512',
    date: 'Inter-Departmental Tech Symposium',
    sig1Title: 'Head of Department (BCA)',
    sig2Title: 'Tech Society Convener'
  },
  'quiz-sql': {
    title: '"Query Quest" SQL Database Competition',
    authority: 'Department of Computer Applications • Database Club',
    heading: 'Certificate of Participation — "Query Quest"',
    subHeading: 'Advanced SQL Querying & Database Challenge',
    desc: 'Awarded to Neeraj Kumar Patel for participation in the "Query Quest" SQL Database Competition, demonstrating high proficiency in relational schema design, complex multi-table JOINs, and query optimization.',
    serial: 'DB-QQ-SQL-7729',
    date: 'Departmental Database Coding Challenge',
    sig1Title: 'Faculty Coordinator (DBMS)',
    sig2Title: 'Student Event Lead'
  }
};

let activeCertKey = 'nss-camp';
let storedCertificates = {};

try {
  const saved = localStorage.getItem('portfolio_attached_certs');
  if (saved) {
    storedCertificates = JSON.parse(saved);
  }
} catch (e) {
  storedCertificates = {};
}

function updateModalUploadView() {
  const uploadedCertImg = document.getElementById('uploadedCertImg');
  const uploadedCertWrap = document.getElementById('uploadedCertWrap');
  const removeCertBtn = document.getElementById('removeCertBtn');
  const uploadPromptText = document.getElementById('uploadPromptText');

  const attached = storedCertificates[activeCertKey];
  if (attached && attached.imgData) {
    if (uploadedCertImg) uploadedCertImg.src = attached.imgData;
    if (uploadedCertWrap) uploadedCertWrap.style.display = 'block';
    if (removeCertBtn) removeCertBtn.style.display = 'inline-flex';
    if (uploadPromptText) uploadPromptText.innerHTML = `<strong>${attached.fileName || 'Certificate Attached'}</strong> — Click or drag to replace`;
  } else {
    if (uploadedCertImg) uploadedCertImg.src = '';
    if (uploadedCertWrap) uploadedCertWrap.style.display = 'none';
    if (removeCertBtn) removeCertBtn.style.display = 'none';
    if (uploadPromptText) uploadPromptText.innerHTML = '<strong>Click to Browse</strong> or Drag & Drop scanned certificate image (PNG, JPG)';
  }
}

window.switchCertTab = function(tabName) {
  const tabBtnPreview = document.getElementById('tabBtnPreview');
  const tabBtnUpload = document.getElementById('tabBtnUpload');
  const certPanePreview = document.getElementById('certPanePreview');
  const certPaneUpload = document.getElementById('certPaneUpload');

  if (tabName === 'upload') {
    if (tabBtnUpload) tabBtnUpload.classList.add('active');
    if (tabBtnPreview) tabBtnPreview.classList.remove('active');
    if (certPaneUpload) certPaneUpload.classList.add('active');
    if (certPanePreview) certPanePreview.classList.remove('active');
  } else {
    if (tabBtnPreview) tabBtnPreview.classList.add('active');
    if (tabBtnUpload) tabBtnUpload.classList.remove('active');
    if (certPanePreview) certPanePreview.classList.add('active');
    if (certPaneUpload) certPaneUpload.classList.remove('active');
  }
};

window.openCertModal = function(key, requestedTab = 'preview') {
  activeCertKey = key || 'nss-camp';
  const data = certDetailsData[activeCertKey];
  const certModal = document.getElementById('certModal');
  const certModalTitle = document.getElementById('certModalTitle');
  const certModalAuthority = document.getElementById('certModalAuthority');
  const officialCertHeading = document.getElementById('officialCertHeading');
  const officialCertSub = document.getElementById('officialCertSub');
  const officialCertDesc = document.getElementById('officialCertDesc');
  const officialCertSerial = document.getElementById('officialCertSerial');
  const officialCertDate = document.getElementById('officialCertDate');
  const officialCertSig1 = document.getElementById('officialCertSig1');
  const officialCertSig2 = document.getElementById('officialCertSig2');

  if (!data || !certModal) return;

  if (certModalTitle) certModalTitle.textContent = data.title;
  if (certModalAuthority) certModalAuthority.textContent = data.authority;
  if (officialCertHeading) officialCertHeading.textContent = data.heading;
  if (officialCertSub) officialCertSub.textContent = data.subHeading;
  if (officialCertDesc) officialCertDesc.textContent = data.desc;
  if (officialCertSerial) officialCertSerial.textContent = `Serial: ${data.serial}`;
  if (officialCertDate) officialCertDate.textContent = `Status: ${data.date}`;
  if (officialCertSig1) officialCertSig1.textContent = data.sig1Title;
  if (officialCertSig2) officialCertSig2.textContent = data.sig2Title;

  updateModalUploadView();

  window.switchCertTab(requestedTab);
  certModal.classList.add('open');
};

window.removeAttachedCert = function() {
  if (activeCertKey && storedCertificates[activeCertKey]) {
    delete storedCertificates[activeCertKey];
    try {
      localStorage.setItem('portfolio_attached_certs', JSON.stringify(storedCertificates));
    } catch (err) {}
    updateModalUploadView();
    updateAllCertAttachmentBadges();
    if (typeof window.showToast === 'function') {
      window.showToast('Attached certificate removed.', 'info');
    }
  }
};

window.printCertificate = function() {
  document.body.classList.remove('printing-resume');
  document.body.classList.add('printing-cert');
  setTimeout(() => {
    window.print();
  }, 150);
};

function updateAllCertAttachmentBadges() {
  for (const key in certDetailsData) {
    const isAttached = !!(storedCertificates[key] && storedCertificates[key].imgData);
    
    // Main Extracurricular section buttons
    const mainBtns = document.querySelectorAll(`[data-cert-btn="${key}"]`);
    mainBtns.forEach(btn => {
      if (isAttached) {
        btn.classList.add('attached');
        btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Attached';
        btn.title = 'Certificate Attached! Click to View or Replace';
      } else {
        btn.classList.remove('attached');
        btn.innerHTML = '<i class="fa-solid fa-paperclip"></i> Certificate';
        btn.title = 'View or Attach Certificate';
      }
    });

    // ATS Resume modal inline buttons
    const resumeBtns = document.querySelectorAll(`[data-resume-cert="${key}"]`);
    resumeBtns.forEach(btn => {
      if (isAttached) {
        btn.classList.add('attached');
        btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Attached';
      } else {
        btn.classList.remove('attached');
        btn.innerHTML = '<i class="fa-solid fa-paperclip"></i> Certificate';
      }
    });
  }
}

function handleSelectedCertFile(file) {
  if (!file || !activeCertKey) return;
  if (!file.type.startsWith('image/')) {
    if (typeof window.showToast === 'function') {
      window.showToast('Please upload an image file (PNG, JPG, JPEG).', 'error');
    }
    return;
  }

  const reader = new FileReader();
  reader.onload = function(evt) {
    storedCertificates[activeCertKey] = {
      imgData: evt.target.result,
      fileName: file.name,
      uploadedAt: new Date().toLocaleDateString()
    };

    try {
      localStorage.setItem('portfolio_attached_certs', JSON.stringify(storedCertificates));
    } catch (err) {
      console.error('Storage quota exceeded or error:', err);
    }

    updateModalUploadView();
    updateAllCertAttachmentBadges();
    if (typeof window.showToast === 'function') {
      window.showToast(`Certificate attached for "${certDetailsData[activeCertKey].title}"!`, 'success');
    }
  };
  reader.readAsDataURL(file);
}

function initCertificates() {
  const tabBtnPreview = document.getElementById('tabBtnPreview');
  const tabBtnUpload = document.getElementById('tabBtnUpload');
  const certFileInput = document.getElementById('certFileInput');
  const certUploadDropzone = document.getElementById('certUploadDropzone');

  if (tabBtnPreview) tabBtnPreview.addEventListener('click', () => window.switchCertTab('preview'));
  if (tabBtnUpload) tabBtnUpload.addEventListener('click', () => window.switchCertTab('upload'));

  if (certUploadDropzone && certFileInput) {
    certUploadDropzone.addEventListener('click', () => {
      certFileInput.click();
    });

    certFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) handleSelectedCertFile(file);
    });

    certUploadDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      certUploadDropzone.classList.add('dragover');
    });

    certUploadDropzone.addEventListener('dragleave', () => {
      certUploadDropzone.classList.remove('dragover');
    });

    certUploadDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      certUploadDropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleSelectedCertFile(e.dataTransfer.files[0]);
      }
    });
  }

  updateAllCertAttachmentBadges();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCertificates);
} else {
  initCertificates();
}
