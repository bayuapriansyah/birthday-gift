// 1. UTILITIES & CONFIG
const CONFIG = {
  // Set to your target date (Year, Month (0-11), Day, Hour, Minute, Second)
  // Note: Month is 0-indexed (0 = January, 11 = December)
  targetDate: new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() + 0,
    0,
    0,
    0,
  ),
  loveLetter: `Untuk orang yang paling spesial,\n\nSelamat ulang tahun! 🎉\n\nHari ini adalah hari di mana dunia menjadi sedikit lebih indah karena kamu lahir. Aku sangat bersyukur bisa mengenalmu dan menjadi bagian dari hidupmu.\nSemoga semua doa, harapan, dan impianmu perlahan menjadi nyata. Jangan pernah berubah, tetaplah menjadi seseorang yang ceria, penuh kasih, dan selalu membawa kebahagiaan bagi orang-orang di sekitarmu.\nTerima kasih atas segala kenangan indah yang telah kita buat bersama. Mari buat lebih banyak lagi di tahun-tahun mendatang.\n\nI love you more than words can say. ❤️`,
  galleryImages: [
    { src: "assets/images/placeholder1.jpg", caption: "Our First Meeting" },
    { src: "assets/images/placeholder2.jpg", caption: "Sweet Smile" },
    { src: "assets/images/placeholder1.jpg", caption: "Beautiful Day" },
    { src: "assets/images/placeholder2.jpg", caption: "Together" },
    { src: "assets/images/placeholder1.jpg", caption: "Memories" },
    { src: "assets/images/placeholder2.jpg", caption: "Forever" },
    { src: "assets/images/placeholder2.jpg", caption: "Forever" },
    { src: "assets/images/placeholder2.jpg", caption: "Forever" },
    { src: "assets/images/placeholder2.jpg", caption: "Forever" },
    { src: "assets/images/placeholder2.jpg", caption: "Forever" },
    { src: "assets/images/placeholder2.jpg", caption: "Forever" },
    { src: "assets/images/placeholder2.jpg", caption: "Forever" },
    { src: "assets/images/placeholder2.jpg", caption: "Forever" },
    { src: "assets/images/placeholder2.jpg", caption: "Forever" },
    { src: "assets/images/placeholder2.jpg", caption: "Forever" },
  ],
};

// ==========================================
// 2. CLASSES
// ==========================================

class CursorController {
  constructor() {
    this.cursor = document.getElementById("cursor");
    this.ripple = document.getElementById("cursor-ripple");
    this.hoverElements = document.querySelectorAll(
      'button, .gallery-item, .polaroid-inner, input[type="range"]',
    );

    this.init();
  }

  init() {
    if (window.innerWidth <= 480) return; // Disable on mobile

    document.addEventListener("mousemove", (e) => {
      requestAnimationFrame(() => {
        this.cursor.style.left = `${e.clientX}px`;
        this.cursor.style.top = `${e.clientY}px`;
      });
    });

    document.addEventListener("mousedown", (e) => {
      this.ripple.style.left = `${e.clientX}px`;
      this.ripple.style.top = `${e.clientY}px`;
      this.ripple.classList.remove("active");
      void this.ripple.offsetWidth; // trigger reflow
      this.ripple.classList.add("active");
    });

    this.addHoverEffects();
  }

  addHoverEffects() {
    this.hoverElements.forEach((el) => {
      el.addEventListener("mouseenter", () =>
        this.cursor.classList.add("hover"),
      );
      el.addEventListener("mouseleave", () =>
        this.cursor.classList.remove("hover"),
      );
    });
  }

  refreshHoverElements() {
    this.hoverElements = document.querySelectorAll(
      'button, .gallery-item, .polaroid-inner, input[type="range"]',
    );
    this.addHoverEffects();
  }
}

class MusicPlayer {
  constructor() {
    this.audio = document.getElementById("bg-music");
    this.btnToggle = document.getElementById("btn-music-toggle");
    this.iconPlay = document.getElementById("icon-play");
    this.iconPause = document.getElementById("icon-pause");
    this.volumeSlider = document.getElementById("volume-slider");
    this.isPlaying = false;

    // Waktu mulai reff
    this.chorusStartTime = 90;
    this.hasStarted = false;

    this.init();
  }

  init() {
    this.btnToggle.addEventListener("click", () => this.toggleMusic());
    this.volumeSlider.addEventListener("input", (e) => {
      if (this.fadeInterval) clearInterval(this.fadeInterval);
      this.audio.volume = e.target.value;
    });
  }

  fadeInMusic(targetVolume, duration = 3000) {
    this.audio.volume = 0;
    const stepTime = 50; // Update every 50ms
    const volumeStep = targetVolume / (duration / stepTime);
    let currentVolume = 0;

    if (this.fadeInterval) clearInterval(this.fadeInterval);

    this.fadeInterval = setInterval(() => {
      currentVolume += volumeStep;
      if (currentVolume >= targetVolume) {
        this.audio.volume = targetVolume;
        clearInterval(this.fadeInterval);
      } else {
        this.audio.volume = currentVolume;
      }
    }, stepTime);
  }

  async tryAutoplay() {
    try {
      const targetVol = parseFloat(this.volumeSlider.value);
      if (!this.hasStarted) {
        this.audio.volume = 0;
        this.audio.currentTime = this.chorusStartTime;
      }
      await this.audio.play();

      if (!this.hasStarted) {
        this.hasStarted = true;
        this.fadeInMusic(targetVol);
      } else {
        this.audio.volume = targetVol;
      }

      this.isPlaying = true;
      this.updateIcons();
      return true;
    } catch (error) {
      console.log("Autoplay prevented by browser.");
      return false;
    }
  }

  toggleMusic() {
    if (this.isPlaying) {
      if (this.fadeInterval) clearInterval(this.fadeInterval);
      this.audio.pause();
      this.isPlaying = false;
      this.updateIcons();
    } else {
      const targetVol = parseFloat(this.volumeSlider.value);
      if (!this.hasStarted) {
        this.audio.volume = 0;
        this.audio.currentTime = this.chorusStartTime;
        this.audio
          .play()
          .then(() => {
            this.hasStarted = true;
            this.fadeInMusic(targetVol);
            this.isPlaying = true;
            this.updateIcons();
          })
          .catch((e) => console.error(e));
      } else {
        this.audio.volume = targetVol;
        this.audio.play();
        this.isPlaying = true;
        this.updateIcons();
      }
    }
  }

  updateIcons() {
    if (this.isPlaying) {
      this.iconPlay.style.display = "none";
      this.iconPause.style.display = "block";
    } else {
      this.iconPlay.style.display = "block";
      this.iconPause.style.display = "none";
    }
  }
}

class Particles {
  constructor() {
    this.container = document.getElementById("particles-container");
    this.types = ["heart", "star", "sparkle"];
    this.count = 40;
    this.init();
  }

  init() {
    for (let i = 0; i < this.count; i++) {
      this.createParticle();
    }
  }

  createParticle() {
    const p = document.createElement("div");
    const type = this.types[Math.floor(Math.random() * this.types.length)];
    p.className = `particle ${type}`;

    // Random properties
    const size = Math.random() * 15 + 5;
    const startX = Math.random() * window.innerWidth;
    const duration = Math.random() * 10 + 10; // 10-20s
    const delay = Math.random() * -20; // Random start time

    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${startX}px`;
    p.style.bottom = `-50px`;

    // Use animation
    p.animate(
      [
        { transform: `translate(0, 0) rotate(0deg)`, opacity: 0 },
        { opacity: Math.random() * 0.5 + 0.3, offset: 0.1 },
        { opacity: Math.random() * 0.5 + 0.3, offset: 0.9 },
        {
          transform: `translate(${Math.random() * 200 - 100}px, -${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`,
          opacity: 0,
        },
      ],
      {
        duration: duration * 1000,
        delay: delay * 1000,
        iterations: Infinity,
        easing: "linear",
      },
    );

    this.container.appendChild(p);
  }
}

class FallingPetals {
  constructor() {
    this.container = document.getElementById("petals-container");
    this.count = 25;
    this.init();
  }

  init() {
    if (!this.container) return;
    for (let i = 0; i < this.count; i++) {
      this.createPetal();
    }
  }

  createPetal() {
    const p = document.createElement("div");
    p.className = "petal";

    const size = Math.random() * 8 + 8; // 8-16px
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;

    const startX = Math.random() * window.innerWidth;
    p.style.left = `${startX}px`;
    p.style.top = `-20px`;

    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * -20;

    const sway = (Math.random() * 100 + 50) * (Math.random() > 0.5 ? 1 : -1);
    const rotation = Math.random() * 360 + 180;

    p.animate(
      [
        { transform: `translate3d(0, 0, 0) rotate(0deg)`, opacity: 0 },
        { opacity: Math.random() * 0.5 + 0.3, offset: 0.1 },
        { opacity: Math.random() * 0.5 + 0.3, offset: 0.8 },
        {
          transform: `translate3d(${sway}px, ${window.innerHeight + 100}px, 0) rotate(${rotation}deg)`,
          opacity: 0,
        },
      ],
      {
        duration: duration * 1000,
        delay: delay * 1000,
        iterations: Infinity,
        easing: "linear",
      },
    );

    this.container.appendChild(p);
  }
}

class BokehHearts {
  constructor() {
    this.container = document.getElementById("bokeh-container");
    this.count = 20; // number of big hearts
    this.init();
  }

  init() {
    if (!this.container) return;
    for (let i = 0; i < this.count; i++) {
      this.createHeart();
    }
  }

  createHeart() {
    const p = document.createElement("div");
    p.className = "bokeh-heart";

    const size = Math.random() * 120 + 80; // 80px to 200px
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;

    const startX = Math.random() * 100; // use percentage to keep on screen
    const startY = Math.random() * 100;

    p.style.left = `${startX}%`;
    p.style.top = `${startY}%`;

    const duration = Math.random() * 15 + 15; // 15-30s
    const moveX = Math.random() * 150 - 75;
    const moveY = Math.random() * 150 - 75;

    p.animate(
      [
        {
          transform: `translate3d(0, 0, 0) scale(1)`,
          opacity: Math.random() * 0.1 + 0.05,
        },
        {
          transform: `translate3d(${moveX}px, ${moveY}px, 0) scale(${Math.random() * 0.5 + 1.1})`,
          opacity: Math.random() * 0.15 + 0.15,
        },
        {
          transform: `translate3d(0, 0, 0) scale(1)`,
          opacity: Math.random() * 0.1 + 0.05,
        },
      ],
      {
        duration: duration * 1000,
        iterations: Infinity,
        easing: "ease-in-out",
      },
    );

    this.container.appendChild(p);
  }
}

class Countdown {
  constructor(targetDate, onComplete) {
    this.targetDate = targetDate;
    this.onComplete = onComplete;
    this.els = {
      days: document.getElementById("cd-days"),
      hours: document.getElementById("cd-hours"),
      mins: document.getElementById("cd-mins"),
      secs: document.getElementById("cd-secs"),
      container: document.getElementById("countdown-container"),
      message: document.getElementById("birthday-message"),
    };
    this.interval = null;

    this.init();
  }

  init() {
    const now = new Date().getTime();
    // Jika sudah lewat atau hari H, berikan 5 detik kejutan!
    if (this.targetDate.getTime() - now <= 0) {
      this.targetDate = new Date(now + 5500); // 5 detik
    }

    this.update();
    this.interval = setInterval(() => this.update(), 1000);
  }

  update() {
    const now = new Date().getTime();
    const distance = this.targetDate.getTime() - now;

    if (distance <= 0) {
      clearInterval(this.interval);
      this.showComplete();
      return;
    }

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    this.updateFlip(this.els.days, d);
    this.updateFlip(this.els.hours, h);
    this.updateFlip(this.els.mins, m);
    this.updateFlip(this.els.secs, s);
  }

  updateFlip(el, val) {
    const strVal = val < 10 ? `0${val}` : `${val}`;
    if (el.innerText !== strVal) {
      el.innerText = strVal;
      // Simple flip animation effect via CSS class could be added here
      el.parentElement.animate(
        [
          { transform: "rotateX(0deg)" },
          { transform: "rotateX(180deg)", opacity: 0, offset: 0.5 },
          { transform: "rotateX(0deg)" },
        ],
        { duration: 300 },
      );
    }
  }

  showComplete() {
    const statusEl = document.getElementById("countdown-status");
    if (statusEl) statusEl.style.display = "none";

    this.els.message.classList.remove("hidden");
    if (this.onComplete) this.onComplete();
  }
}

class GiftAnimation {
  constructor(onOpen) {
    this.giftBox = document.getElementById("gift-box");
    this.onOpen = onOpen;
    this.opened = false;

    this.init();
  }

  init() {
    this.giftBox.addEventListener("click", () => {
      if (this.opened) return;
      this.opened = true;
      this.openGift();
    });
  }

  openGift() {
    this.giftBox.classList.add("shake");
    setTimeout(() => {
      this.giftBox.classList.remove("shake");
      this.giftBox.classList.add("open");
      this.createConfetti();

      setTimeout(() => {
        if (this.onOpen) this.onOpen();
      }, 1500);
    }, 800);
  }

  createConfetti() {
    const colors = [
      "#f00",
      "#0f0",
      "#00f",
      "#ff0",
      "#f0f",
      "#0ff",
      "#FFF5F7",
      "#D6A8A8",
    ];
    for (let i = 0; i < 50; i++) {
      const conf = document.createElement("div");
      conf.className = "confetti";
      conf.style.left = `${Math.random() * 100}%`;
      conf.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];

      // Random fall animation parameters
      const duration = Math.random() * 2 + 1;
      const delay = Math.random() * 0.5;

      conf.style.animation = `fall ${duration}s ${delay}s linear forwards`;
      this.giftBox.appendChild(conf);
    }
  }
}

class TypingEffect {
  constructor(element, text, speed = 50, onComplete = null) {
    this.element = document.getElementById(element);
    this.text = text;
    this.speed = speed;
    this.onComplete = onComplete;
    this.index = 0;
  }

  start() {
    this.element.innerHTML = '<span class="cursor-type"></span>';
    this.type();
  }

  type() {
    if (this.index < this.text.length) {
      const char =
        this.text.charAt(this.index) === "\n"
          ? "<br>"
          : this.text.charAt(this.index);
      const currentHTML = this.element.innerHTML;
      this.element.innerHTML = currentHTML.replace(
        '<span class="cursor-type"></span>',
        char + '<span class="cursor-type"></span>',
      );
      this.index++;
      setTimeout(() => this.type(), this.speed);
    } else {
      this.element.innerHTML = this.element.innerHTML.replace(
        '<span class="cursor-type"></span>',
        "",
      );
      if (this.onComplete) this.onComplete();
    }
  }
}

class Gallery {
  constructor() {
    this.grid = document.getElementById("gallery-grid");
    this.lightbox = document.getElementById("lightbox");
    this.lbImg = document.getElementById("lightbox-img");
    this.lbCap = document.getElementById("lightbox-caption");

    this.currentIndex = 0;

    this.init();
  }

  init() {
    this.render();
    this.setupLightbox();
  }

  render() {
    CONFIG.galleryImages.forEach((img, index) => {
      const item = document.createElement("div");
      item.className = "gallery-item";

      // Random rotation between -15 and 15 degrees
      const rot = Math.random() * 30 - 15;
      item.style.setProperty("--rot", rot);
      item.style.transform = `rotate(${rot}deg)`;

      // Setup fallback image handling
      const html = `
                <img src="${img.src}" alt="${img.caption}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOEI1QTc1Ii8+PC9zdmc+'">
                <div class="caption">${img.caption}</div>
            `;
      item.innerHTML = html;
      item.addEventListener("click", () => this.openLightbox(index));
      this.grid.appendChild(item);
    });
  }

  setupLightbox() {
    document
      .getElementById("lightbox-close")
      .addEventListener("click", () => this.closeLightbox());
    document
      .getElementById("lightbox-prev")
      .addEventListener("click", () => this.navigate(-1));
    document
      .getElementById("lightbox-next")
      .addEventListener("click", () => this.navigate(1));

    document.addEventListener("keydown", (e) => {
      if (this.lightbox.classList.contains("hidden")) return;
      if (e.key === "Escape") this.closeLightbox();
      if (e.key === "ArrowLeft") this.navigate(-1);
      if (e.key === "ArrowRight") this.navigate(1);
    });
  }

  openLightbox(index) {
    this.currentIndex = index;
    this.updateLightboxContent();
    this.lightbox.classList.remove("hidden");
  }

  closeLightbox() {
    this.lightbox.classList.add("hidden");
  }

  navigate(dir) {
    this.currentIndex += dir;
    if (this.currentIndex < 0)
      this.currentIndex = CONFIG.galleryImages.length - 1;
    if (this.currentIndex >= CONFIG.galleryImages.length) this.currentIndex = 0;
    this.updateLightboxContent();
  }

  updateLightboxContent() {
    const img = CONFIG.galleryImages[this.currentIndex];
    this.lbImg.src = img.src;
    // fallback
    this.lbImg.onerror = () => {
      this.lbImg.src =
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOEI1QTc1Ii8+PC9zdmc+";
    };
    this.lbCap.innerText = img.caption;
  }
}

class VideoPlayer {
  constructor() {
    this.video = document.getElementById("special-video");
    this.overlay = document.getElementById("video-overlay");
    this.btnPlayOverlay = document.getElementById("btn-big-play");
    this.btnPlayPause = document.getElementById("play-pause-btn");
    this.btnFullscreen = document.getElementById("fullscreen-btn");
    this.seekbar = document.getElementById("seekbar");
    this.seekbarFill = document.getElementById("seekbar-fill");
    this.timeDisplay = document.getElementById("time-display");
    this.container = document.querySelector(".custom-video-player");

    this.init();
  }

  init() {
    this.btnPlayOverlay.addEventListener("click", () => this.togglePlay());
    this.btnPlayPause.addEventListener("click", () => this.togglePlay());
    this.video.addEventListener("click", () => this.togglePlay());

    this.btnFullscreen.addEventListener("click", () => this.toggleFullscreen());

    this.video.addEventListener("timeupdate", () => this.updateProgress());
    this.video.addEventListener("loadedmetadata", () => this.updateProgress());
    this.video.addEventListener("ended", () => {
      this.container.classList.remove("playing");
      this.btnPlayPause.innerText = "►";
    });

    this.seekbar.addEventListener("click", (e) => this.seek(e));
  }

  togglePlay() {
    if (this.video.paused) {
      this.video.play();
      this.container.classList.add("playing");
      this.btnPlayPause.innerText = "⏸";
    } else {
      this.video.pause();
      this.container.classList.remove("playing");
      this.btnPlayPause.innerText = "►";
    }
  }

  updateProgress() {
    if (!this.video.duration) return;

    const current = this.video.currentTime;
    const duration = this.video.duration;
    const percent = (current / duration) * 100;

    this.seekbarFill.style.width = `${percent}%`;
    this.timeDisplay.innerText = `${this.formatTime(current)} / ${this.formatTime(duration)}`;
  }

  seek(e) {
    const rect = this.seekbar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    this.video.currentTime = pos * this.video.duration;
  }

  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" + s : s}`;
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      if (this.container.requestFullscreen) {
        this.container.requestFullscreen();
      } else if (this.container.webkitRequestFullscreen) {
        this.container.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }
}

class ScrollAnimation {
  constructor() {
    this.elements = document.querySelectorAll(".scroll-anim, .fade-in-wish");
    this.init();
  }

  init() {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.15,
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          // Optional: stop observing once animated
          // observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    this.elements.forEach((el) => observer.observe(el));
  }
}

class App {
  constructor() {
    this.loadingScreen = document.getElementById("loading-screen");
    this.mainContainer = document.getElementById("main-container");
    this.musicPrompt = document.getElementById("music-prompt-screen");

    this.sections = {
      hero: document.getElementById("hero-section"),
      gift: document.getElementById("gift-section"),
      welcome: document.getElementById("welcome-section"),
      letter: document.getElementById("letter-section"),
      gallery: document.getElementById("gallery-section"),
      video: document.getElementById("video-section"),
      wishes: document.getElementById("wishes-section"),
      ending: document.getElementById("ending-section"),
    };

    this.init();
  }

  async init() {
    // Initialize basic components
    this.cursor = new CursorController();
    this.particles = new Particles();
    this.petals = new FallingPetals();
    this.bokeh = new BokehHearts();
    this.music = new MusicPlayer();

    // Start Loading Process
    await this.simulateLoading();

    // Hide loading screen
    this.loadingScreen.style.opacity = "0";
    setTimeout(() => {
      this.loadingScreen.style.display = "none";
      this.checkAudioAutoplay();
    }, 500);
  }

  simulateLoading() {
    return new Promise((resolve) => {
      let progress = 0;
      const bar = document.getElementById("progress-bar");
      const pct = document.getElementById("loading-percentage");

      const animate = () => {
        progress += Math.random() * 2 + 1;
        if (progress > 100) progress = 100;

        bar.style.width = `${progress}%`;
        pct.innerText = `${Math.floor(progress)}%`;

        if (progress < 100) {
          requestAnimationFrame(animate);
        } else {
          setTimeout(resolve, 500);
        }
      };
      requestAnimationFrame(animate);
    });
  }

  async checkAudioAutoplay() {
    const played = await this.music.tryAutoplay();
    if (!played) {
      this.musicPrompt.classList.remove("hidden");
      document
        .getElementById("btn-start-experience")
        .addEventListener("click", () => {
          this.music.toggleMusic();
          this.musicPrompt.classList.add("hidden");
          this.startExperience();
        });
    } else {
      this.startExperience();
    }
  }

  startExperience() {
    this.mainContainer.classList.remove("hidden");

    // Apply animate classes dynamically
    const animatedEls = this.sections.hero.querySelectorAll(".animate-fade-up");
    animatedEls.forEach((el) => el.classList.add("animated"));

    // Initialize Countdown
    new Countdown(CONFIG.targetDate, () => {
      // Countdown complete logic if needed
    });

    this.setupNavigation();
  }

  transitionSection(fromSection, toSection) {
    fromSection.style.opacity = "0";
    fromSection.style.transition = "opacity 0.8s ease";

    setTimeout(() => {
      fromSection.classList.add("hidden");
      fromSection.classList.remove("active");

      toSection.classList.remove("hidden");
      toSection.style.opacity = "0";

      // Trigger reflow
      void toSection.offsetWidth;

      toSection.style.transition = "opacity 0.8s ease";
      toSection.style.opacity = "1";
      toSection.classList.add("active");

      // Add animations
      const anims = toSection.querySelectorAll('[class*="animate-"]');
      anims.forEach((el) => {
        el.classList.remove("animated");
        void el.offsetWidth;
        el.classList.add("animated");
      });

      this.cursor.refreshHoverElements();
    }, 800);
  }

  setupNavigation() {
    // Hero -> Gift
    document.getElementById("btn-open-gift").addEventListener("click", () => {
      this.transitionSection(this.sections.hero, this.sections.gift);
      new GiftAnimation(() => {
        this.transitionSection(this.sections.gift, this.sections.welcome);
      });
    });

    // Welcome -> Letter
    document.getElementById("btn-read-letter").addEventListener("click", () => {
      this.transitionSection(this.sections.welcome, this.sections.letter);
      setTimeout(() => {
        const typer = new TypingEffect(
          "typing-text",
          CONFIG.loveLetter,
          50,
          () => {
            document
              .getElementById("btn-next-gallery")
              .classList.remove("hidden");
            document
              .getElementById("btn-next-gallery")
              .classList.add("animated", "animate-fade-up");
          },
        );
        typer.start();
      }, 1000);
    });

    // Letter -> Gallery
    document
      .getElementById("btn-next-gallery")
      .addEventListener("click", () => {
        this.transitionSection(this.sections.letter, this.sections.gallery);
        new Gallery();
      });

    // Gallery -> Video
    document.getElementById("btn-next-video").addEventListener("click", () => {
      this.transitionSection(this.sections.gallery, this.sections.video);
      new VideoPlayer();
    });

    // Video -> Wishes
    document.getElementById("btn-next-wishes").addEventListener("click", () => {
      const video = document.getElementById("special-video");
      if (video && !video.paused) {
        video.pause();
        document.getElementById("video-overlay").style.opacity = "1";
        document.getElementById("play-pause-btn").innerText = "►";
      }
      this.transitionSection(this.sections.video, this.sections.wishes);

      // Trigger wish animations after transition
      setTimeout(() => {
        const wishes = document.querySelectorAll(".fade-in-wish");
        wishes.forEach((el) => {
          el.classList.remove("in-view");
          void el.offsetWidth;
          el.classList.add("in-view");
        });
      }, 800);
    });

    // Wishes -> Ending
    document.getElementById("btn-next-ending").addEventListener("click", () => {
      this.transitionSection(this.sections.wishes, this.sections.ending);
      setTimeout(() => this.fireFinalConfetti(), 800);

      const words = [
        "Happy Birthday",
        "To My Special One",
        "With All My Love ❤️",
      ];
      let currentWordIndex = 0;
      const titleEl = document.getElementById("ending-title");

      const playNextWord = () => {
        if (currentWordIndex >= words.length) {
          titleEl.innerHTML = words[words.length - 1];
          return;
        }

        const word = words[currentWordIndex];
        currentWordIndex++;

        const typer = new TypingEffect("ending-title", word, 100, () => {
          if (currentWordIndex < words.length) {
            setTimeout(() => {
              let currentText = word;
              const eraseInterval = setInterval(() => {
                currentText = currentText.slice(0, -1);
                titleEl.innerHTML =
                  currentText + '<span class="cursor-type"></span>';
                if (currentText.length === 0) {
                  clearInterval(eraseInterval);
                  setTimeout(playNextWord, 500);
                }
              }, 50);
            }, 2000);
          } else {
            titleEl.innerHTML = word;
          }
        });
        typer.start();
      };

      setTimeout(playNextWord, 1200);
    });

    // Replay
    document.getElementById("btn-replay").addEventListener("click", () => {
      location.reload();
    });
  }

  fireFinalConfetti() {
    const container = document.getElementById("confetti-container");
    const colors = ["#D6A8A8", "#FFF5F7", "#8B5A75", "#f1c40f", "#e74c3c"];

    const createConfetti = () => {
      const conf = document.createElement("div");
      conf.className = "confetti";
      conf.style.left = `${Math.random() * 100}%`;
      conf.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      conf.style.width = `${Math.random() * 10 + 5}px`;
      conf.style.height = `${Math.random() * 10 + 5}px`;

      const duration = Math.random() * 3 + 2;
      conf.style.animation = `fall ${duration}s linear forwards`;

      container.appendChild(conf);

      setTimeout(() => conf.remove(), duration * 1000);
    };

    // Fire a burst
    for (let i = 0; i < 100; i++) {
      createConfetti();
    }

    // Continue slowly
    setInterval(createConfetti, 200);
  }
}

// ==========================================
// 3. INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  // Lock scroll initially
  document.body.style.overflowY = "hidden";

  // Start App
  window.birthdayApp = new App();
});
