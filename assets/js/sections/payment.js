/**
 * PAYMENT & UPI QR GATEWAY ENGINE MODULE
 */

const defaultUpiId = '7348541169@upi';
const defaultPayeeName = 'Neeraj Kumar Patel';
let currentAmount = '100';

function updatePaymentQR(amount) {
  currentAmount = amount || '100';
  const qrAmountIndicator = document.getElementById('qrAmountIndicator');
  const qrImageElem = document.getElementById('upiQrCodeImage');
  const qrImageModalElem = document.getElementById('upiQrCodeImageModal');
  const gpayLink = document.getElementById('gpayDeepLink');
  const phonepeLink = document.getElementById('phonepeDeepLink');
  const paytmLink = document.getElementById('paytmDeepLink');

  if (qrAmountIndicator) {
    qrAmountIndicator.textContent = `₹${currentAmount}`;
  }

  // Standard UPI URI Scheme
  const upiUri = `upi://pay?pa=${encodeURIComponent(defaultUpiId)}&pn=${encodeURIComponent(defaultPayeeName)}&am=${encodeURIComponent(currentAmount)}&cu=INR&tn=${encodeURIComponent('Freelance/Support Payment')}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUri)}&margin=4`;

  // Dynamic QR Image URL via QR Server API for both main section and popup modal
  if (qrImageElem) {
    qrImageElem.src = qrUrl;
  }
  if (qrImageModalElem) {
    qrImageModalElem.src = qrUrl;
  }

  // Update Deep Links for Mobile Apps
  if (gpayLink) gpayLink.href = upiUri;
  if (phonepeLink) phonepeLink.href = upiUri;
  if (paytmLink) paytmLink.href = upiUri;
}

window.openPaymentModal = function(presetAmt) {
  const amt = presetAmt || currentAmount || '100';
  updatePaymentQR(amt);
  const paymentModal = document.getElementById('paymentModal');
  const customAmountInput = document.getElementById('customAmountInput');
  const amountButtons = document.querySelectorAll('.amount-btn');

  if (customAmountInput) customAmountInput.value = amt;
  amountButtons.forEach(b => {
    if (b.getAttribute('data-amount') === amt) {
      b.classList.add('active');
    } else {
      b.classList.remove('active');
    }
  });
  if (paymentModal) paymentModal.classList.add('open');
};

window.setModalPaymentAmount = function(amt) {
  updatePaymentQR(amt);
  if (typeof window.showToast === 'function') {
    window.showToast(`Payment QR updated to ₹${amt}`, 'success');
  }
};

function initPayment() {
  const customAmountInput = document.getElementById('customAmountInput');
  const amountButtons = document.querySelectorAll('.amount-btn');

  // Handle Preset Amount Buttons in Main Section
  amountButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      amountButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const amt = btn.getAttribute('data-amount');
      if (customAmountInput) customAmountInput.value = amt;
      updatePaymentQR(amt);
      if (typeof window.showToast === 'function') {
        window.showToast(`Payment amount set to ₹${amt}`, 'success');
      }
    });
  });

  // Handle Custom Amount Input
  if (customAmountInput) {
    customAmountInput.addEventListener('input', (e) => {
      const val = e.target.value.replace(/[^0-9]/g, '');
      e.target.value = val;
      amountButtons.forEach(b => b.classList.remove('active'));
      if (val && parseInt(val) > 0) {
        updatePaymentQR(val);
      }
    });
  }

  // Initialize Default QR Code
  updatePaymentQR('100');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPayment);
} else {
  initPayment();
}
