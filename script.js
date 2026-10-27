/**
 * REPAIR & REUSE CAFÉ — Interactive Script
 * Lightweight, accessible vanilla JS for navigation, category filtering, and booking intake
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initSmoothScroll();
  initScrollSpy();
  initServiceTileConnectors();
  initBookingForm();
});

/* ==========================================================================
   1. Header Sticky Effect
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ==========================================================================
   2. Mobile Navigation Toggle
   ========================================================================== */
function initMobileNav() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !header) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = header.classList.contains('mobile-open');
    if (isOpen) {
      header.classList.remove('mobile-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    } else {
      header.classList.add('mobile-open');
      toggleBtn.setAttribute('aria-expanded', 'true');
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      header.classList.remove('mobile-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   3. Smooth Scrolling with Offset
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 70;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: targetPos - headerOffset,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   4. Scroll Spy for Active Navigation Link
   ========================================================================== */
function initScrollSpy() {
  const links = document.querySelectorAll('.nav-link[href^="#"]');
  const sections = document.querySelectorAll('section[id], footer[id]');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 100;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   5. Connect Service Tiles to Booking Dropdown
   ========================================================================== */
function initServiceTileConnectors() {
  const serviceTiles = document.querySelectorAll('.service-item-tile[data-category]');
  const categorySelect = document.getElementById('itemCategory');

  serviceTiles.forEach(tile => {
    tile.addEventListener('click', () => {
      const category = tile.getAttribute('data-category');
      if (categorySelect && category) {
        categorySelect.value = category;

        const bookSection = document.getElementById('book');
        if (bookSection) {
          bookSection.scrollIntoView({ behavior: 'smooth' });
          categorySelect.focus();
          categorySelect.style.borderColor = 'var(--terracotta)';
          categorySelect.style.boxShadow = '0 0 0 3px var(--terracotta-soft)';
          setTimeout(() => {
            categorySelect.style.boxShadow = '';
          }, 1400);
        }
      }
    });
  });
}

/* ==========================================================================
   6. Booking Form Validation & Interactive Ticket Modal
   ========================================================================== */
function initBookingForm() {
  const form = document.getElementById('repairForm');
  const modal = document.getElementById('confirmDialog');
  const closeBtns = document.querySelectorAll('.close-modal-action');

  if (!form) return;

  const nameInput = document.getElementById('userName');
  const emailInput = document.getElementById('userEmail');
  const categorySelect = document.getElementById('itemCategory');
  const messageInput = document.getElementById('userMessage');
  const submitBtn = document.getElementById('submitBtn');

  // Input listener to clear errors
  [nameInput, emailInput, categorySelect, messageInput].forEach(input => {
    if (!input) return;
    input.addEventListener('input', () => {
      input.classList.remove('has-error');
      const errEl = document.getElementById(`${input.id}Err`);
      if (errEl) errEl.classList.remove('show');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      flagError(nameInput, 'userNameErr', 'Please enter your full name (at least 2 characters).');
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      flagError(emailInput, 'userEmailErr', 'Please enter a valid email address.');
      isValid = false;
    }

    // Validate Category
    if (!categorySelect.value) {
      flagError(categorySelect, 'itemCategoryErr', 'Please select an item category.');
      isValid = false;
    }

    // Validate Message
    if (!messageInput.value.trim() || messageInput.value.trim().length < 8) {
      flagError(messageInput, 'userMessageErr', 'Please provide a brief description of the item and required repair.');
      isValid = false;
    }

    if (!isValid) return;

    // Loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Logging Intake...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      // Populate Ticket Data
      const randRef = '#RRC-2026-' + Math.floor(1000 + Math.random() * 9000);
      const refEl = document.getElementById('ticketRefNumber');
      const nameEl = document.getElementById('ledgerName');
      const emailEl = document.getElementById('ledgerEmail');
      const catEl = document.getElementById('ledgerCategory');

      if (refEl) refEl.textContent = randRef;
      if (nameEl) nameEl.textContent = nameInput.value.trim();
      if (emailEl) emailEl.textContent = emailInput.value.trim();
      if (catEl) catEl.textContent = categorySelect.options[categorySelect.selectedIndex].text;

      // Open Modal Dialog
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      form.reset();
    }, 600);
  });

  // Close handlers
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}

function flagError(inputEl, errId, message) {
  inputEl.classList.add('has-error');
  const errEl = document.getElementById(errId);
  if (errEl) {
    errEl.textContent = message;
    errEl.classList.add('show');
  }
}
