// DOM ELEMENTS
document.addEventListener("DOMContentLoaded", function () {
  // ========== MENU HAMBURGER MOBILE ==========
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (hamburger) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });
  }

  // Fermer le menu quand on clique sur un lien
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // ========== COMPTEUR DE CLIENTS SATISFAITS ==========
  function animateCounter() {
    const counter = document.getElementById("client-counter");
    if (!counter) return;

    const target = 15247; // Nombre de clients satisfaits
    let current = 0;
    const increment = target / 100; // Incrémentation rapide

    const updateCounter = () => {
      if (current < target) {
        current += increment;
        if (current > target) current = target;
        counter.textContent = Math.floor(current).toLocaleString("fr-FR");
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString("fr-FR");
      }
    };

    // Vérifier si le compteur est visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            updateCounter();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );

    observer.observe(counter);
  }

  animateCounter();

  // ========== ANIMATIONS AU DÉFILEMENT ==========
  const fadeElements = document.querySelectorAll(".fade-in");

  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    { threshold: 0.2 },
  );

  fadeElements.forEach((element) => {
    fadeObserver.observe(element);
  });

  // ========== BOUTON RÉSERVER MAINTENANT (SCROLL) ==========
  const reserveButtons = document.querySelectorAll(
    ".btn-reservation, .btn-submit",
  );

  reserveButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      if (!button.classList.contains("btn-submit")) {
        e.preventDefault();
        const bookingSection = document.getElementById("contact");
        bookingSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // ========== VALIDATION DU FORMULAIRE DE RÉSERVATION ==========
  const bookingForm = document.getElementById("bookingForm");

  if (bookingForm) {
    // Définir la date minimale (aujourd'hui)
    const today = new Date().toISOString().split("T")[0];
    const dateInput = document.getElementById("date");
    if (dateInput) {
      dateInput.setAttribute("min", today);
    }

    // Fonctions de validation
    function validateName(name) {
      return name && name.trim().length >= 2;
    }

    function validatePhone(phone) {
      // Format français: 06/07, 10 chiffres, espaces autorisés
      const phoneRegex = /^(0[1-9])(?:[ _.-]?[0-9]{2}){4}$|^(0[1-9][0-9]{8})$/;
      return phoneRegex.test(phone.trim());
    }

    function validateService(service) {
      return service && service !== "";
    }

    function validateDate(date) {
      if (!date) return false;
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }

    function validateTime(time) {
      if (!time) return false;
      const [hours, minutes] = time.split(":");
      const hour = parseInt(hours);
      return hour >= 9 && hour < 19;
    }

    // Afficher les erreurs
    function showError(inputId, message) {
      const errorElement = document.getElementById(inputId + "Error");
      const input = document.getElementById(inputId);
      if (errorElement) {
        errorElement.textContent = message;
      }
      if (input) {
        input.classList.add("error");
      }
    }

    function clearError(inputId) {
      const errorElement = document.getElementById(inputId + "Error");
      const input = document.getElementById(inputId);
      if (errorElement) {
        errorElement.textContent = "";
      }
      if (input) {
        input.classList.remove("error");
      }
    }

    // Validation en temps réel
    const nameInput = document.getElementById("name");
    const phoneInput = document.getElementById("phone");
    const serviceSelect = document.getElementById("service");
    const dateInputField = document.getElementById("date");
    const timeInput = document.getElementById("time");

    if (nameInput) {
      nameInput.addEventListener("input", function () {
        if (validateName(this.value)) {
          clearError("name");
        } else {
          showError("name", "Le nom doit contenir au moins 2 caractères");
        }
      });
    }

    if (phoneInput) {
      phoneInput.addEventListener("input", function () {
        if (validatePhone(this.value)) {
          clearError("phone");
        } else {
          showError(
            "phone",
            "Numéro de téléphone français invalide (ex: 0612345678)",
          );
        }
      });
    }

    if (serviceSelect) {
      serviceSelect.addEventListener("change", function () {
        if (validateService(this.value)) {
          clearError("service");
        } else {
          showError("service", "Veuillez sélectionner un service");
        }
      });
    }

    if (dateInputField) {
      dateInputField.addEventListener("change", function () {
        if (validateDate(this.value)) {
          clearError("date");
        } else {
          showError("date", "La date ne peut pas être dans le passé");
        }
      });
    }

    if (timeInput) {
      timeInput.addEventListener("change", function () {
        if (validateTime(this.value)) {
          clearError("time");
        } else {
          showError("time", "L'heure doit être entre 9h et 19h");
        }
      });
    }

    // Soumission du formulaire
    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Récupérer les valeurs
      const name = document.getElementById("name").value;
      const phone = document.getElementById("phone").value;
      const service = document.getElementById("service").value;
      const date = document.getElementById("date").value;
      const time = document.getElementById("time").value;
      const message = document.getElementById("message").value;

      // Valider tous les champs
      let isValid = true;

      if (!validateName(name)) {
        showError("name", "Le nom doit contenir au moins 2 caractères");
        isValid = false;
      } else {
        clearError("name");
      }

      if (!validatePhone(phone)) {
        showError("phone", "Numéro de téléphone français invalide");
        isValid = false;
      } else {
        clearError("phone");
      }

      if (!validateService(service)) {
        showError("service", "Veuillez sélectionner un service");
        isValid = false;
      } else {
        clearError("service");
      }

      if (!validateDate(date)) {
        showError("date", "La date ne peut pas être dans le passé");
        isValid = false;
      } else {
        clearError("date");
      }

      if (!validateTime(time)) {
        showError("time", "L'heure doit être entre 9h et 19h");
        isValid = false;
      } else {
        clearError("time");
      }

      if (isValid) {
        // Formater la date en français
        const dateObj = new Date(date);
        const formattedDate = dateObj.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        // Créer le message WhatsApp
        let whatsappMessage = `*NOUVELLE RÉSERVATION - VICTORIA COIFFURE*%0a%0a`;
        whatsappMessage += `*Client:* ${name}%0a`;
        whatsappMessage += `*Téléphone:* ${phone}%0a`;
        whatsappMessage += `*Service:* ${service}%0a`;
        whatsappMessage += `*Date:* ${formattedDate}%0a`;
        whatsappMessage += `*Heure:* ${time}%0a`;

        if (message && message.trim() !== "") {
          whatsappMessage += `*Message:* ${message}%0a`;
        }

        whatsappMessage += `%0a_Réservation effectuée via le site web_`;

        // Numéro WhatsApp du salon (à remplacer par le vrai numéro)
        const whatsappNumber = "2290153007134"; // Format international sans +

        // Ouvrir WhatsApp
        window.open(
          `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`,
          "_blank",
        );

        // Message de confirmation
        alert(
          "✅ Votre demande de réservation a bien été prise en compte !\n\nVous allez être redirigé vers WhatsApp pour finaliser votre réservation.\n\nNotre équipe vous répondra sous 15 minutes.",
        );

        // Réinitialiser le formulaire
        bookingForm.reset();

        // Effacer toutes les erreurs
        clearError("name");
        clearError("phone");
        clearError("service");
        clearError("date");
        clearError("time");

        // Incrémenter le compteur de clients
        const counter = document.getElementById("client-counter");
        if (counter) {
          const currentCount =
            parseInt(counter.textContent.replace(/\s/g, "")) || 15247;
          counter.textContent = (currentCount + 1).toLocaleString("fr-FR");
        }
      }
    });
  }

  // ========== EFFET DE SCROLL SUR LE HEADER ==========
  window.addEventListener("scroll", function () {
    const header = document.querySelector(".header");
    if (window.scrollY > 50) {
      header.style.background = "rgba(10, 10, 10, 0.98)";
      header.style.padding = "10px 0";
    } else {
      header.style.background = "rgba(10, 10, 10, 0.95)";
      header.style.padding = "15px 0";
    }
  });

  // ========== LIENS ACTIFS AU SCROLL ==========
  const sections = document.querySelectorAll("section[id]");

  function highlightNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll(".nav-link").forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", highlightNavLink);

  // ========== PRÉ-REMPLIR LA DATE DU FORMULAIRE ==========
  function setDefaultDate() {
    const dateInput = document.getElementById("date");
    if (dateInput) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const defaultDate = tomorrow.toISOString().split("T")[0];
      dateInput.value = defaultDate;
    }
  }

  setDefaultDate();

  // ========== PLACEHOLDER POUR L'HEURE ==========
  const timeInput = document.getElementById("time");
  if (timeInput) {
    timeInput.setAttribute("min", "09:00");
    timeInput.setAttribute("max", "19:00");

    // Définir une heure par défaut
    const defaultTime = "10:00";
    timeInput.value = defaultTime;
  }

  // ========== INITIALISATION DES SLIDERS SWIPER ==========
  function initSliders() {
    // Slider Services
    const servicesSwiper = new Swiper(".services-swiper", {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".services-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".services-next",
        prevEl: ".services-prev",
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        1200: {
          slidesPerView: 4,
          spaceBetween: 30,
        },
      },
    });

    // Slider Galerie
    const gallerySwiper = new Swiper(".gallery-swiper", {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".gallery-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".gallery-next",
        prevEl: ".gallery-prev",
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      },
    });
  }

  // Appeler l'initialisation des sliders
  initSliders();

  // ========== BANDEAU D'URGENCE - COMPTEUR DE PLACES ==========
  function updateUrgencyMessage() {
    const urgencyBanner = document.querySelector(".urgency-banner p");
    if (urgencyBanner) {
      const availableSpots = Math.floor(Math.random() * 5) + 3; // 3-7 places
      urgencyBanner.innerHTML = `<i class="fas fa-exclamation-circle"></i> <strong>Plus que ${availableSpots} places disponibles aujourd'hui</strong> - Réservez vite votre créneau`;
    }
  }

  updateUrgencyMessage();
  // Mettre à jour toutes les 30 minutes
  setInterval(updateUrgencyMessage, 1800000);
});
