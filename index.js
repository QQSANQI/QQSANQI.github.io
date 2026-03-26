document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");
  const openVideo = document.getElementById("openVideo");
  const videoModal = document.getElementById("videoModal");
  const closeVideo = document.getElementById("closeVideo");
  const introVideo = document.getElementById("introVideo");
  const statusCard = document.getElementById("statusCard");
  const statusLine = document.getElementById("statusLine");
  const focusMeter = document.getElementById("focusMeter");
  const toast = document.getElementById("toast");
  const focusMessage = document.getElementById("focusMessage");
  const featureCards = Array.from(document.querySelectorAll(".feature-card"));
  const meter = statusCard?.querySelector(".meter");

  const statusIdeas = [
    "让页面在细节里呼吸，让交互带来一点点惊喜。",
    "把复杂的概念拆成一段段可感知的动画。",
    "喜欢让按钮有按下的弹性，光标有追光的尾巴。",
    "专注在节奏：先引导，再解释，最后留白。",
  ];
  let ideaIndex = 0;

  const MIN_PERCENTAGE = 0;
  const MAX_PERCENTAGE = 100;

  const updateMeter = () => {
    if (!meter || !focusMeter) return;
    const percentage = Number(meter.dataset.progress || "78");
    requestAnimationFrame(() => {
      const clamped = Math.min(MAX_PERCENTAGE, Math.max(MIN_PERCENTAGE, percentage));
      focusMeter.style.width = `${clamped}%`;
    });
  };

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove("hidden");
    toast.classList.add("visible");
    setTimeout(() => toast.classList.remove("visible"), 2200);
  };

  const toggleTheme = () => {
    body.classList.toggle("theme-dark");
    const isDark = body.classList.contains("theme-dark");
    themeToggle.textContent = isDark ? "切换日间模式" : "切换夜间模式";
    showToast(isDark ? "夜间模式 ON" : "日间模式 ON");
  };

  const cycleStatus = () => {
    ideaIndex = (ideaIndex + 1) % statusIdeas.length;
    statusLine.textContent = statusIdeas[ideaIndex];
    const nextProgress = 65 + ideaIndex * 8;
    if (meter) {
      meter.dataset.progress = String(nextProgress);
      updateMeter();
    }
    statusCard?.setAttribute("aria-pressed", "true");
  };

  const openVideoModal = () => {
    if (!videoModal) return;
    videoModal.classList.remove("hidden");
    videoModal.setAttribute("aria-hidden", "false");
    introVideo
      ?.play()
      .catch((error) => {
        console.error("Video playback failed:", error);
        showToast("视频自动播放失败，请手动播放");
      });
  };

  const closeVideoModal = () => {
    if (!videoModal) return;
    videoModal.classList.add("hidden");
    videoModal.setAttribute("aria-hidden", "true");
    introVideo?.pause();
    introVideo && (introVideo.currentTime = 0);
  };

  // Feature cards interaction
  featureCards.forEach((card) => {
    const selectCard = () => {
      featureCards.forEach((item) => item.classList.remove("active"));
      card.classList.add("active");
      const focus = card.dataset.focus;
      if (focusMessage && focus) focusMessage.textContent = focus;
    };
    card.addEventListener("click", selectCard);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectCard();
      }
    });
  });

  // Animated stats using IntersectionObserver
  const statNumbers = Array.from(document.querySelectorAll("[data-target]"));
  const animateStat = (el) => {
    const target = Number(el.dataset.target);
    let current = 0;
    const step = Math.max(1, Math.round(target / 40));
    const tick = () => {
      current += step;
      if (current >= target) {
        el.textContent = target.toString();
        return;
      }
      el.textContent = current.toString();
      requestAnimationFrame(tick);
    };
    tick();
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateStat(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    statNumbers.forEach((el) => observer.observe(el));
  } else {
    statNumbers.forEach(animateStat);
  }

  // Event bindings
  themeToggle?.addEventListener("click", toggleTheme);
  openVideo?.addEventListener("click", openVideoModal);
  closeVideo?.addEventListener("click", closeVideoModal);
  videoModal?.addEventListener("click", (event) => {
    if (event.target === videoModal) closeVideoModal();
  });
  statusCard?.addEventListener("click", cycleStatus);
  statusCard?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      cycleStatus();
    }
  });

  updateMeter();
});
