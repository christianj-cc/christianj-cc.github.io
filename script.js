<<<<<<< HEAD
"use strict";

/**
 * ============================================================
 *  MAIN – Wait for DOM to be ready
 * ============================================================
 */
document.addEventListener("DOMContentLoaded", function () {
  // ============================================================
  // 1. SCRAMBLE EFFECT (Name animation)
  // ============================================================
  function scrambleText(id, original, delay = 0) {
    const el = document.getElementById(id);

    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=";

    let iteration = 0;
    const speed = 200;

    // start as pure random text
    el.textContent = Array.from(
      { length: original.length },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join("");

    function scramble() {
      let output = "";

      for (let i = 0; i < original.length; i++) {
        if (i < iteration) {
          output += original[i];
        } else {
          output += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      el.textContent = output;

      if (iteration < original.length) {
        iteration++;
        setTimeout(scramble, speed);
      } else {
        el.textContent = original;
      }
    }

    setTimeout(scramble, delay);
  }

  scrambleText("scrambleFirst", "Christian", 600);
  scrambleText("scrambleLast", "Cahilig", 1100);

  // ============================================================
  // 2. TYPING EFFECT (Subtitle cycling)
  // ============================================================
  (function typingEffect() {
    const subtitles = [
      "Software Developer",
      "Computer Science Student",
      "Graphic Designer",
    ];
    let subIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeElement = document.getElementById("subtitle-typing");

    function type() {
      const current = subtitles[subIndex];
      if (!isDeleting) {
        typeElement.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          setTimeout(() => (isDeleting = true), 1800);
        }
      } else {
        typeElement.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          subIndex = (subIndex + 1) % subtitles.length;
        }
      }
      setTimeout(type, isDeleting ? 40 : 100);
    }
    type();
  })();

  // ============================================================
  // 3. CUSTOM CURSOR + TRAILS
  // ============================================================
  const cursor = document.getElementById("custom-cursor");
  const trails = document.querySelectorAll(".cursor-trail");

  if (cursor && trails.length) {
    let mouseX = 0,
      mouseY = 0;
    let cursorX = 0,
      cursorY = 0;

    // Track mouse position
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Animate main cursor with smooth lag
    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursor.style.left = cursorX - 8 + "px";
      cursor.style.top = cursorY - 8 + "px";
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Animate trails with increasing lag
    const positions = [];
    for (let i = 0; i < trails.length; i++) {
      positions.push({ x: mouseX, y: mouseY });
    }

    function animateTrail() {
      positions[0].x += (mouseX - positions[0].x) * 0.25;
      positions[0].y += (mouseY - positions[0].y) * 0.25;

      for (let i = 1; i < positions.length; i++) {
        positions[i].x += (positions[i - 1].x - positions[i].x) * 0.25;
        positions[i].y += (positions[i - 1].y - positions[i].y) * 0.25;
      }

      trails.forEach((trail, index) => {
        trail.style.left = positions[index].x + "px";
        trail.style.top = positions[index].y + "px";
        trail.style.scale = 1 - index * 0.08;
        trail.style.opacity = 1 - index * 0.12;
      });

      requestAnimationFrame(animateTrail);
    }
    animateTrail();

    // --- HOVER EFFECT (cursor + trails) ---
    const interactive = document.querySelectorAll(
      "a, button, .btn, .project-card, .cert-card, .nav-resume-btn, .credly-btn",
    );

    interactive.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.classList.add("hover");
        trails.forEach((t) => t.classList.add("hover"));
      });
      el.addEventListener("mouseleave", () => {
        cursor.classList.remove("hover");
        trails.forEach((t) => t.classList.remove("hover"));
      });
    });

    // Hide cursor on touch devices
    if ("ontouchstart" in window) {
      cursor.style.display = "none";
      trails.forEach((t) => (t.style.display = "none"));
    }
  }

  // ============================================================
  // 4. NAV: ACTIVE SECTION + PROGRESS BAR
  // ============================================================
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");
  const progressBar = document.getElementById("progress-bar");
  const navbar = document.getElementById("navbar");

  function updateNavAndProgress() {
    const scrollY = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    progressBar.style.width = progress + "%";

    // Add "scrolled" class to navbar after passing hero
    const heroHeight = document.getElementById("hero").offsetHeight;
    if (scrollY > heroHeight * 0.8) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Determine which section is in view
    let currentSection = "";
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const triggerPoint = scrollY + window.innerHeight * 0.3;

      if (triggerPoint >= top && triggerPoint < top + height) {
        currentSection = sec.id;
      }
    });

    // Highlight corresponding nav link
    navLinks.forEach((link) => {
      const section = link.dataset.section;
      link.classList.toggle("active", section === currentSection);
    });
  }

  window.addEventListener("scroll", updateNavAndProgress);
  window.addEventListener("load", updateNavAndProgress);

  // ============================================================
  // 5. HAMBURGER MENU (Mobile toggle)
  // ============================================================
  const hamburger = document.getElementById("hamburger");
  const navLinksContainer = document.getElementById("navLinks");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinksContainer.classList.toggle("open");
  });

  // Close menu when a nav link is clicked
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinksContainer.classList.remove("open");
    });
  });

  // ============================================================
  // 6. TOAST NOTIFICATION
  // ============================================================
  function showToast(msg) {
    const toast = document.getElementById("toast");
    const toastMsg = document.getElementById("toastMsg");
    toastMsg.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toast._hide);
    toast._hide = setTimeout(() => toast.classList.remove("show"), 3500);
  }

  // ============================================================
  // 7. SCROLL REVEAL (Intersection Observer)
  // ============================================================
  const revealEls = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .reveal-scale",
  );
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -20px 0px" },
  );
  revealEls.forEach((el) => observer.observe(el));

  // ============================================================
  // 8. CURSOR GLOW INSIDE CARDS (CSS custom properties)
  // ============================================================
  document.querySelectorAll(".project-card, .cert-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--x", `${e.clientX - rect.left}px`);
      card.style.setProperty("--y", `${e.clientY - rect.top}px`);
    });
  });

  // ============================================================
  // 9. BACKGROUND BLOBS (Parallax following mouse)
  // ============================================================
  const blobs = document.querySelectorAll(".blob");

  window.addEventListener("mousemove", (e) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;

    blobs.forEach((blob, index) => {
      const factor = (index + 1) * 20;
      blob.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  });

  // ============================================================
  // 10. PROJECT CARD IMAGE GALLERY (Previous / Next buttons)
  // ============================================================
  document.querySelectorAll(".card-image").forEach((gallery) => {
    const images = JSON.parse(gallery.dataset.images);
    const img = gallery.querySelector("img");
    const current = gallery.querySelector(".current-image");
    let index = 0;

    gallery.querySelector(".img-next").addEventListener("click", (e) => {
      e.stopPropagation();
      index = (index + 1) % images.length;
      img.src = images[index];
      current.textContent = index + 1;
    });

    gallery.querySelector(".img-prev").addEventListener("click", (e) => {
      e.stopPropagation();
      index = (index - 1 + images.length) % images.length;
      img.src = images[index];
      current.textContent = index + 1;
    });
  });

  // ============================================================
  // 11. PROJECT MODAL (Expand view)
  // ============================================================
  const modal = document.getElementById("projectModal");
  const modalImage = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalCategory = document.getElementById("modalCategory");
  const modalLongDescription = document.getElementById("modalLongDescription");
  const modalTechStack = document.getElementById("modalTechStack");
  const modalLinks = document.getElementById("modalLinks");
  const modalCurrent = document.getElementById("modalCurrent");
  const modalTotal = document.getElementById("modalTotal");
  const modalPrev = document.getElementById("modalPrev");
  const modalNext = document.getElementById("modalNext");
  const modalClose = document.getElementById("modalClose");
  
  const modalDate = document.getElementById("modal-date");


  let modalImages = [];
  let modalIndex = 0;

  function updateModalImage() {
    modalImage.style.opacity = 0;
    setTimeout(() => {
      modalImage.src = modalImages[modalIndex];
      modalCurrent.textContent = modalIndex + 1;
      modalImage.style.opacity = 1;
    }, 150);
  }

  // Open modal on "Expand" button click
  document.querySelectorAll(".img-expand").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      const card = btn.closest(".project-card");
      const imageWrap = card.querySelector(".card-image");

      modalImages = JSON.parse(imageWrap.dataset.images);
      modalIndex = 0;

      modalTitle.textContent = card.querySelector(".project-title").textContent;
      modalCategory.textContent = card.querySelector(".category").textContent;
      modalDate.innerHTML = card.querySelector(".project-date").innerHTML;
      modalLongDescription.innerHTML = card.dataset.longDescription;

      const techs = [...card.querySelectorAll(".tech")]
        .map((tech) => tech.textContent.trim())
        .join(" • ");
      modalTechStack.textContent = techs;

      modalLinks.innerHTML = card.querySelector(".project-links").innerHTML;
      modalTotal.textContent = modalImages.length;

      updateModalImage();
      modal.classList.add("active");
    });
  });

  // Modal navigation
  modalPrev.addEventListener("click", () => {
    modalIndex = (modalIndex - 1 + modalImages.length) % modalImages.length;
    updateModalImage();
  });

  modalNext.addEventListener("click", () => {
    modalIndex = (modalIndex + 1) % modalImages.length;
    updateModalImage();
  });

  // Close modal
  modalClose.addEventListener("click", () => {
    modal.classList.remove("active");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });

  // ============================================================
  // 12. CERTIFICATE LINK BUTTON 
  // ============================================================
  document.querySelectorAll(".cert-link-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      console.log("Certificate link clicked:", e.currentTarget.href);
    });
  });
  
  // ============================================================
  // 13. DESIGN PROJECTS TAB
  // ============================================================
  const tabs = document.querySelectorAll(".project-tab");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t =>
        t.classList.remove("active")
      );

      contents.forEach(c =>
        c.classList.remove("active")
      );

      tab.classList.add("active");

      document
        .getElementById(
          tab.dataset.tab + "-tab"
        )
        .classList.add("active");

    });

  });
});
=======
"use strict";

/**
 * ============================================================
 *  MAIN – Wait for DOM to be ready
 * ============================================================
 */
document.addEventListener("DOMContentLoaded", function () {
  // ============================================================
  // 1. SCRAMBLE EFFECT (Name animation)
  // ============================================================
  function scrambleText(id, original, delay = 0) {
    const el = document.getElementById(id);

    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=";

    let iteration = 0;
    const speed = 200;

    // start as pure random text
    el.textContent = Array.from(
      { length: original.length },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");

    function scramble() {
      let output = "";

      for (let i = 0; i < original.length; i++) {
        if (i < iteration) {
          output += original[i];
        } else {
          output += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      el.textContent = output;

      if (iteration < original.length) {
        iteration++;
        setTimeout(scramble, speed);
      } else {
        el.textContent = original;
      }
    }

    setTimeout(scramble, delay);
  }

  scrambleText("scrambleFirst", "Christian", 600);
  scrambleText("scrambleLast", "Cahilig", 1100);

  // ============================================================
  // 2. TYPING EFFECT (Subtitle cycling)
  // ============================================================
  (function typingEffect() {
    const subtitles = [
      "Software Developer",
      "Computer Science Student",
      "Graphic Designer",
    ];
    let subIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeElement = document.getElementById("subtitle-typing");

    function type() {
      const current = subtitles[subIndex];
      if (!isDeleting) {
        typeElement.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          setTimeout(() => (isDeleting = true), 1800);
        }
      } else {
        typeElement.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          subIndex = (subIndex + 1) % subtitles.length;
        }
      }
      setTimeout(type, isDeleting ? 40 : 100);
    }
    type();
  })();

  // ============================================================
  // 3. CUSTOM CURSOR + TRAILS
  // ============================================================
  const cursor = document.getElementById("custom-cursor");
  const trails = document.querySelectorAll(".cursor-trail");

  if (cursor && trails.length) {
    let mouseX = 0,
      mouseY = 0;
    let cursorX = 0,
      cursorY = 0;

    // Track mouse position
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Animate main cursor with smooth lag
    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursor.style.left = cursorX - 8 + "px";
      cursor.style.top = cursorY - 8 + "px";
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Animate trails with increasing lag
    const positions = [];
    for (let i = 0; i < trails.length; i++) {
      positions.push({ x: mouseX, y: mouseY });
    }

    function animateTrail() {
      positions[0].x += (mouseX - positions[0].x) * 0.25;
      positions[0].y += (mouseY - positions[0].y) * 0.25;

      for (let i = 1; i < positions.length; i++) {
        positions[i].x += (positions[i - 1].x - positions[i].x) * 0.25;
        positions[i].y += (positions[i - 1].y - positions[i].y) * 0.25;
      }

      trails.forEach((trail, index) => {
        trail.style.left = positions[index].x + "px";
        trail.style.top = positions[index].y + "px";
        trail.style.scale = 1 - index * 0.08;
        trail.style.opacity = 1 - index * 0.12;
      });

      requestAnimationFrame(animateTrail);
    }
    animateTrail();

    // --- HOVER EFFECT (cursor + trails) ---
    const interactive = document.querySelectorAll(
      "a, button, .btn, .project-card, .cert-card, .nav-resume-btn, .credly-btn",
    );

    interactive.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.classList.add("hover");
        trails.forEach((t) => t.classList.add("hover"));
      });
      el.addEventListener("mouseleave", () => {
        cursor.classList.remove("hover");
        trails.forEach((t) => t.classList.remove("hover"));
      });
    });

    // Hide cursor on touch devices
    if ("ontouchstart" in window) {
      cursor.style.display = "none";
      trails.forEach((t) => (t.style.display = "none"));
    }
  }

  // ============================================================
  // 4. NAV: ACTIVE SECTION + PROGRESS BAR
  // ============================================================
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");
  const progressBar = document.getElementById("progress-bar");
  const navbar = document.getElementById("navbar");

  function updateNavAndProgress() {
    const scrollY = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    progressBar.style.width = progress + "%";

    // Add "scrolled" class to navbar after passing hero
    const heroHeight = document.getElementById("hero").offsetHeight;
    if (scrollY > heroHeight * 0.8) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Determine which section is in view
    let currentSection = "";
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const triggerPoint = scrollY + window.innerHeight * 0.3;

      if (triggerPoint >= top && triggerPoint < top + height) {
        currentSection = sec.id;
      }
    });

    // Highlight corresponding nav link
    navLinks.forEach((link) => {
      const section = link.dataset.section;
      link.classList.toggle("active", section === currentSection);
    });
  }

  window.addEventListener("scroll", updateNavAndProgress);
  window.addEventListener("load", updateNavAndProgress);

  // ============================================================
  // 5. HAMBURGER MENU (Mobile toggle)
  // ============================================================
  const hamburger = document.getElementById("hamburger");
  const navLinksContainer = document.getElementById("navLinks");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinksContainer.classList.toggle("open");
  });

  // Close menu when a nav link is clicked
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinksContainer.classList.remove("open");
    });
  });

  // ============================================================
  // 6. TOAST NOTIFICATION
  // ============================================================
  function showToast(msg) {
    const toast = document.getElementById("toast");
    const toastMsg = document.getElementById("toastMsg");
    toastMsg.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toast._hide);
    toast._hide = setTimeout(() => toast.classList.remove("show"), 3500);
  }

  // ============================================================
  // 7. SCROLL REVEAL (Intersection Observer)
  // ============================================================
  const revealEls = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .reveal-scale",
  );
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -20px 0px" },
  );
  revealEls.forEach((el) => observer.observe(el));

  // ============================================================
  // 8. CURSOR GLOW INSIDE CARDS (CSS custom properties)
  // ============================================================
  document.querySelectorAll(".project-card, .cert-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--x", `${e.clientX - rect.left}px`);
      card.style.setProperty("--y", `${e.clientY - rect.top}px`);
    });
  });

  // ============================================================
  // 9. BACKGROUND BLOBS (Parallax following mouse)
  // ============================================================
  const blobs = document.querySelectorAll(".blob");

  window.addEventListener("mousemove", (e) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;

    blobs.forEach((blob, index) => {
      const factor = (index + 1) * 20;
      blob.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  });

  // ============================================================
  // 10. PROJECT CARD IMAGE GALLERY (Previous / Next buttons)
  // ============================================================
  document.querySelectorAll(".card-image").forEach((gallery) => {
    const images = JSON.parse(gallery.dataset.images);
    const img = gallery.querySelector("img");
    const current = gallery.querySelector(".current-image");
    let index = 0;

    gallery.querySelector(".img-next").addEventListener("click", (e) => {
      e.stopPropagation();
      index = (index + 1) % images.length;
      img.src = images[index];
      current.textContent = index + 1;
    });

    gallery.querySelector(".img-prev").addEventListener("click", (e) => {
      e.stopPropagation();
      index = (index - 1 + images.length) % images.length;
      img.src = images[index];
      current.textContent = index + 1;
    });
  });

  // ============================================================
  // 11. PROJECT MODAL (Expand view)
  // ============================================================
  const modal = document.getElementById("projectModal");
  const modalImage = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalCategory = document.getElementById("modalCategory");
  const modalLongDescription = document.getElementById("modalLongDescription");
  const modalTechStack = document.getElementById("modalTechStack");
  const modalLinks = document.getElementById("modalLinks");
  const modalCurrent = document.getElementById("modalCurrent");
  const modalTotal = document.getElementById("modalTotal");
  const modalPrev = document.getElementById("modalPrev");
  const modalNext = document.getElementById("modalNext");
  const modalClose = document.getElementById("modalClose");

  const modalDate = document.getElementById("modal-date");

  let modalImages = [];
  let modalIndex = 0;

  function updateModalImage() {
    modalImage.style.opacity = 0;
    setTimeout(() => {
      modalImage.src = modalImages[modalIndex];
      modalCurrent.textContent = modalIndex + 1;
      modalImage.style.opacity = 1;
    }, 150);
  }

  // Open modal on "Expand" button click
  document.querySelectorAll(".img-expand").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      const card = btn.closest(".project-card");
      const imageWrap = card.querySelector(".card-image");

      modalImages = JSON.parse(imageWrap.dataset.images);
      modalIndex = 0;

      modalTitle.textContent = card.querySelector(".project-title").textContent;
      modalCategory.textContent = card.querySelector(".category").textContent;
      modalDate.innerHTML = card.querySelector(".project-date").innerHTML;
      modalLongDescription.innerHTML = card.dataset.longDescription;

      const techs = [...card.querySelectorAll(".tech")]
        .map((tech) => tech.textContent.trim())
        .join(" • ");
      modalTechStack.textContent = techs;

      modalLinks.innerHTML = card.querySelector(".project-links").innerHTML;
      modalTotal.textContent = modalImages.length;

      updateModalImage();
      modal.classList.add("active");
    });
  });

  // Modal navigation
  modalPrev.addEventListener("click", () => {
    modalIndex = (modalIndex - 1 + modalImages.length) % modalImages.length;
    updateModalImage();
  });

  modalNext.addEventListener("click", () => {
    modalIndex = (modalIndex + 1) % modalImages.length;
    updateModalImage();
  });

  // Close modal
  modalClose.addEventListener("click", () => {
    modal.classList.remove("active");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });

  // ============================================================
  // 12. CERTIFICATE LINK BUTTON
  // ============================================================
  document.querySelectorAll(".cert-link-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      console.log("Certificate link clicked:", e.currentTarget.href);
    });
  });

  // ============================================================
  // 13. DESIGN PROJECTS TAB
  // ============================================================
  const tabs = document.querySelectorAll(".project-tab");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));

      contents.forEach((c) => c.classList.remove("active"));

      tab.classList.add("active");

      document.getElementById(tab.dataset.tab + "-tab").classList.add("active");
    });
  });
});
>>>>>>> e6bf2d9 (Test commit)
