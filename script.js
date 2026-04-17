/* ============================================================
   SpiceBite Restaurant - script.js
   Interactivity for navigation, filtering, reveal animations,
   counters, gallery preview, and booking feedback.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function handleNavbarScroll() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }

  function closeMobileMenu() {
    hamburger?.classList.remove('active');
    navMenu?.classList.remove('active');
  }

  function highlightNav() {
    const scrollPosition = window.scrollY + 120;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (link && scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        navLinks.forEach((navLink) => navLink.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', () => {
    handleNavbarScroll();
    highlightNav();
  });

  handleNavbarScroll();
  highlightNav();

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu?.classList.toggle('active');
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      closeMobileMenu();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const filterButtons = document.querySelectorAll('.filter-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter || 'all';

      filterButtons.forEach((filterButton) => filterButton.classList.remove('active'));
      button.classList.add('active');

      menuCards.forEach((card) => {
        const shouldShow = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !shouldShow);
      });
    });
  });

  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('visible'));
  }

  const counterElements = document.querySelectorAll('.stat-number');

  function animateCounter(element) {
    const target = Number.parseInt(element.dataset.target || '0', 10);
    const duration = 1800;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.floor(target * easedProgress).toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(updateCounter);
  }

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    counterElements.forEach((element) => counterObserver.observe(element));
  } else {
    counterElements.forEach(animateCounter);
  }

  const galleryImages = document.querySelectorAll('.gallery-item img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (lightbox && lightboxImg) {
    galleryImages.forEach((image) => {
      image.addEventListener('click', () => {
        lightboxImg.src = image.src;
        lightboxImg.alt = image.alt;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    lightboxClose?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeLightbox();
    });
  }

  const bookingForm = document.getElementById('bookingForm');
  const dateInput = document.getElementById('date');
  const toast = document.getElementById('toast');

  if (dateInput) {
    dateInput.min = new Date().toISOString().split('T')[0];
  }

  function showToast(message, type = 'success') {
    if (!toast) return;

    const toastMessage = document.getElementById('toastMessage');
    if (toastMessage) toastMessage.textContent = message;

    toast.classList.toggle('error', type === 'error');
    toast.classList.add('show');

    window.clearTimeout(showToast.timeoutId);
    showToast.timeoutId = window.setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const fullName = document.getElementById('fullName')?.value.trim();
      const phone = document.getElementById('phone')?.value.trim();
      const date = document.getElementById('date')?.value;
      const time = document.getElementById('time')?.value;
      const guests = document.getElementById('guests')?.value;
      const requests = document.getElementById('requests')?.value.trim() || '';
      const submitButton = bookingForm.querySelector('button[type="submit"]');

      if (!fullName || !phone || !date || !time || !guests) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }

      if (!/^[\d\s()+-]{7,20}$/.test(phone)) {
        showToast('Please enter a valid phone number.', 'error');
        return;
      }

      const selectedDate = new Date(`${date}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        showToast('Booking date cannot be in the past.', 'error');
        return;
      }

      const bookingData = {
        fullName,
        phone,
        date,
        time,
        guests,
        requests
      };

      try {
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = 'Saving Reservation...';
        }

        const response = await fetch('http://localhost:5000/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bookingData)
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Booking failed. Please try again.');
        }

        showToast(`Thanks, ${fullName}. Your table request is confirmed.`);
        bookingForm.reset();
        if (dateInput) {
          dateInput.min = new Date().toISOString().split('T')[0];
        }
      } catch (error) {
        showToast(error.message || 'Unable to save booking right now.', 'error');
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Confirm Reservation';
        }
      }
    });
  }

  const hero = document.querySelector('.hero');
  window.addEventListener('scroll', () => {
    if (!hero) return;
    hero.style.backgroundPositionY = `calc(50% + ${window.scrollY * 0.25}px)`;
  });

  const currentYear = document.getElementById('currentYear');
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }
});
