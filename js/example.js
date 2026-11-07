const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
  header.addEventListener('click', () => {
    const answerPanel = header.nextElementSibling;

    if (!answerPanel) {
      return;
    }

    const isExpanded = header.getAttribute('aria-expanded') === 'true';
    header.setAttribute('aria-expanded', String(!isExpanded));
    answerPanel.classList.toggle('hidden', isExpanded);
  });
});
// Service Data Structure
const services = [
  {
    title: 'Commercial Plumbing',
    description: 'Full-scale commercial pipe installation, backflow prevention, and water main maintenance for industrial properties.',
    category: 'commercial'
  },
  {
    title: 'Geyser Repair & Replacement',
    description: '24-hour geyser repairs, pressure valve fixes, and energy-efficient geyser replacements.',
    category: 'geyser'
  },
  {
    title: 'Leak Detection & Pipe Repair',
    description: 'Advanced non-invasive acoustic leak detection technology to trace and fix hidden underground leaks.',
    category: 'pipe-repair'
  },
  {
    title: 'Hot Water Line Installation',
    description: 'Specialized high-temperature CPVC and PPR pipe installations connecting solar geysers, heat pumps, and traditional geysers safely to your fixtures.',
    category: 'pipe-repair' 
  },
  {
    title: 'Drain Unblocking',
    description: 'High-pressure hydro-jetting and drain cleaning services for severe residential and commercial blockages.',
    category: 'drain'
  },
  {
    title: 'Bathroom',
    description: 'Complete plumbing fixture installations for new builds and renovations, including toilets, showers, bathtubs, vanities, and custom pipe re-routing.',
    category: 'residents'
  },
  {
    title: 'Kitchen',
    description: 'Expert plumbing services for modern kitchens, covering sink installations, tap fittings, water filtration links, and appliance connections for dishwashers or washing machines.',
    category: 'residents'
  },
  {
    title: 'Water Filtration & Purification',
    description: 'Installation of advanced water filtration systems to ensure clean and safe water for residential and commercial use.',
    category: 'water'
  },
  {
    title: 'Emergency Plumbing',
    description: 'Rapid response teams on standby across Gauteng for burst pipes and emergency water shut-offs.',
    category: 'emergency'
  }
];

const serviceState = {
  category: 'all',
  search: '',
  sort: 'title-asc'
};
// Function to render services based on the data structure
const renderServices = () => {
  const serviceList = document.getElementById('service-list');

  if (!serviceList) {
    return;
  }

  serviceList.insertAdjacentHTML('afterbegin', services.map(service => `
    <div class="card service-card animate-on-scroll" data-category="${service.category}" data-title="${service.title}">
      <h3>${service.title}</h3>
      <p>${service.description}</p>
    </div>
  `).join(''));
};

const setServiceCardInteractions = () => {
  const serviceList = document.getElementById('service-list');

  if (!serviceList) {
    return;
  }
// Add click event listeners to each service card to open a modal with more details
  const serviceCards = serviceList.querySelectorAll('.service-card');

  serviceCards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const title = card.getAttribute('data-title');
      const description = card.querySelector('p')?.textContent || '';
      const category = card.getAttribute('data-category');

      const modalOverlay = document.createElement('div');
      modalOverlay.className = 'service-modal-overlay';

      const modalBox = document.createElement('div');
      modalBox.className = 'service-modal-content';

      modalBox.innerHTML = `
        <button class="service-modal-close" aria-label="Close modal">&times;</button>
        <span style="font-size: 0.85rem; text-transform: uppercase; font-weight: bold; color: #b91c1c; letter-spacing: 0.05em;">Category: ${category}</span>
        <h2 style="margin-top: 0.5rem; margin-bottom: 1rem; font-size: 1.5rem;">${title}</h2>
        <p style="color: #4b5563; line-height: 1.6; margin-bottom: 1.5rem;">${description}</p>
        <a href="enquiry.html?service=${encodeURIComponent(title)}" class="btn btn-primary" style="display: inline-block; padding: 0.5rem 1rem; background: #b91c1c; color: white; border: none; border-radius: 4px; cursor: pointer; text-decoration: none;">Book This Service</a>
      `;

      modalOverlay.appendChild(modalBox);
      document.body.appendChild(modalOverlay);

      const closeModal = () => {
        modalOverlay.remove();
      };

      modalBox.querySelector('.service-modal-close').addEventListener('click', closeModal);
      
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
          closeModal();
        }
      });

      document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
          closeModal();
          document.removeEventListener('keydown', escapeHandler);
        }
      });
    });
  });
};

const updateVisibleServices = () => {
  const searchText = serviceState.search.trim().toLowerCase();
  const serviceCards = Array.from(document.querySelectorAll('.service-card'));
  const emptyState = document.getElementById('service-empty-state');
  const resultsCount = document.getElementById('service-results-count');

  const filteredCards = serviceCards.filter(card => {
    const category = card.getAttribute('data-category');
    const title = card.getAttribute('data-title') || '';
    const description = card.querySelector('p')?.textContent || '';
    const matchesCategory = serviceState.category === 'all' || category === serviceState.category;
    const matchesSearch = !searchText || `${title} ${description}`.toLowerCase().includes(searchText);

    return matchesCategory && matchesSearch;
  });

  serviceCards.forEach(card => {
    card.style.display = filteredCards.includes(card) ? 'block' : 'none';
  });
  if (emptyState) {
    emptyState.hidden = filteredCards.length > 0;
  }
  if (resultsCount) {
    const count = filteredCards.length;
    resultsCount.textContent = `Showing ${count} ${count === 1 ? 'service' : 'services'}`;
  }

  if (serviceState.sort === 'title-desc') {
    const sortedCards = [...filteredCards].sort((a, b) => {
      const aTitle = (a.getAttribute('data-title') || '').toLowerCase();
      const bTitle = (b.getAttribute('data-title') || '').toLowerCase();
      return bTitle.localeCompare(aTitle);
    });

    const list = document.getElementById('service-list');
    sortedCards.forEach(card => list.appendChild(card));
  } else {
    const sortedCards = [...filteredCards].sort((a, b) => {
      const aTitle = (a.getAttribute('data-title') || '').toLowerCase();
      const bTitle = (b.getAttribute('data-title') || '').toLowerCase();
      return aTitle.localeCompare(bTitle);
    });

    const list = document.getElementById('service-list');
    sortedCards.forEach(card => list.appendChild(card));
  }
};

//  Scroll Animations & Smooth Scroll

document.addEventListener('DOMContentLoaded', () => {
  const enquiryService = new URLSearchParams(window.location.search).get('service');
  const enquiryServiceSelect = document.getElementById('service');

  if (enquiryService && enquiryServiceSelect) {
    let serviceOption = Array.from(enquiryServiceSelect.options)
      .find(option => option.value === enquiryService || option.textContent === enquiryService);

    if (!serviceOption) {
      serviceOption = new Option(enquiryService, enquiryService, true, true);
      enquiryServiceSelect.add(serviceOption);
    }

    enquiryServiceSelect.value = serviceOption.value;
  }

  renderServices();
  setServiceCardInteractions();
  updateVisibleServices();
  setServiceControls();

  // 1. Intersection Observer for Scroll-Triggered Fade-In
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.15 // Triggers when 15% of the element is visible
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Runs animation once per element
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => scrollObserver.observe(el));
  } else {
    animatedElements.forEach(el => el.classList.add('visible'));
  }
   // Animate statistics once they enter the viewport.
  const counters = document.querySelectorAll('[data-counter]');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animateCounter = counter => {
    const target = Number(counter.dataset.target);
    const suffix = counter.dataset.suffix || '';

    if (!Number.isFinite(target)) {
      return;
    }

    const duration = 1600;
    const startTime = performance.now();

    const updateCounter = currentTime => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(target * easedProgress);

      counter.textContent = `${currentValue.toLocaleString()}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = `${target.toLocaleString()}${suffix}`;
      }
    };

    requestAnimationFrame(updateCounter);
  };

  if (!prefersReducedMotion && counters.length > 0) {
    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      counters.forEach(counter => counterObserver.observe(counter));
    } else {
      counters.forEach(animateCounter);
    }
  }


  // 2. Smooth Scrolling for Navigation & Links
  const scrollLinks = document.querySelectorAll('a[href^="#"]');

  scrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

});

// Advanced DOM Manipulation: Dynamic Service Filtering
const setServiceControls = () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('service-search');
  const sortSelect = document.getElementById('service-sort');

  if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        serviceState.category = button.getAttribute('data-filter') || 'all';
        updateVisibleServices();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      serviceState.search = event.target.value;
      updateVisibleServices();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (event) => {
      serviceState.sort = event.target.value;
      updateVisibleServices();
    });
  }
};

// Lightbox Gallery Functionality
  const galleryImages = document.querySelectorAll('.gallery-item img');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxTarget = document.getElementById('lightbox-target');
  const lightboxClose = document.querySelector('.lightbox-close');

  if (galleryImages.length > 0 && lightboxModal) {
    // Open Lightbox on Image Click
    galleryImages.forEach(img => {
      img.addEventListener('click', () => {
        const fullSrc = img.getAttribute('data-lightbox-src') || img.src;
        lightboxTarget.src = fullSrc;
        lightboxModal.style.display = 'flex';
      });
    });

    // Close Lightbox Function
    const closeLightbox = () => {
      lightboxModal.style.display = 'none';
      lightboxTarget.src = '';
    };

    // Close on 'X' button click
    lightboxClose.addEventListener('click', closeLightbox);

    // Close when clicking outside the image on the dark background
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    // Close when pressing the 'Escape' key on keyboard
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.style.display === 'flex') {
        closeLightbox();
      }
    });
  }
document.addEventListener("DOMContentLoaded", () => {
    const enquiryForm = document.getElementById("enquiryForm");

    if (enquiryForm) {
        enquiryForm.addEventListener("submit", function(event) {
            event.preventDefault();

            // Retrieve and sanitize inputs
            const nameField = document.getElementById("name");
            const phoneField = document.getElementById("phone");
            const serviceField = document.getElementById("service");
            const messageField = document.getElementById("message");

            const nameValue = nameField ? nameField.value.trim() : "";
            const phoneValue = phoneField ? phoneField.value.trim() : "";
            const serviceValue = serviceField ? serviceField.value.trim() : "";
            const messageValue = messageField ? messageField.value.trim() : "";

            // 1. Check for empty or space-only submissions
            if (!nameValue || !phoneValue || !serviceValue || !messageValue) {
                alert("Error: All fields must contain valid information and cannot be empty spaces.");
                return;
            }

            // 2. Validate Phone Number (Must be 10 digits starting with 0, ignoring spaces/dashes)
            const cleanPhone = phoneValue.replace(/[\s-]/g, ""); // Removes spaces and dashes
            const phonePattern = /^0[0-9]{9}$/; // Starts with 0 followed by 9 digits
            if (!phonePattern.test(cleanPhone)) {
                alert("Error: Please enter a valid 10-digit South African phone number (e.g., 060 875 0393).");
                return;
            }

            // 3. Validate Job Details (Must be at least 15 characters long to avoid gibberish spam)
            if (messageValue.length < 15) {
                alert("Error: Please provide more detailed job descriptions so we can assist you properly.");
                return;
            }

            // Safe: Treats input strictly as plain text, neutralizing scripts
            const welcomeMsg = document.getElementById("welcome-msg");
            if (welcomeMsg) {
                welcomeMsg.textContent = `Thank you, ${nameValue}. We will contact you shortly regarding ${serviceValue}.`;
            }

            // If all checks pass, show success feedback
            alert("Thank you for your enquiry! We will get back to you shortly.");
            enquiryForm.reset();
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", function(event) {
            event.preventDefault();

            // Retrieve and trim values
            const nameField = document.getElementById("contactName");
            const emailField = document.getElementById("contactEmail");
            const messageTypeField = document.getElementById("messageType");
            const messageField = document.getElementById("contactMessage");

            const name = nameField ? nameField.value.trim() : "";
            const email = emailField ? emailField.value.trim() : "";
            const messageType = messageTypeField ? messageTypeField.value.trim() : "";
            const message = messageField ? messageField.value.trim() : "";

            // 1. Check for empty fields
            if (!name || !email || !messageType || !message) {
                alert("Error: All fields must be filled out.");
                return;
            }

            // 2. Validate Email Format using Regex
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert("Error: Please enter a valid email address (e.g., name@example.com).");
                return;
            }

            // 3. Validate Message Length (prevents short spam/gibberish)
            if (message.length < 10) {
                alert("Error: Please provide a more detailed message so we can assist you properly.");
                return;
            }

            // 4. Compile into an email sent to the recipient stated in the code
            const recipientEmail = "info@masterflow.co.za";
            const subject = encodeURIComponent(`${messageType} from ${name}`);
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nMessage Type: ${messageType}\n\nMessage:\n${message}`);

            // Trigger the email client with compiled data[cite: 11]
            window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
        });
    }
});