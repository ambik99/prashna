// Landing Page behaviour: scroll reveals, the rotating hero line, and the
// product tour. Motion timings follow Resurf's.

(function () {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Launch animation (once per session; see the page's <head>). The hero's
  // reveals wait until the layer starts to fade, so they play in view.
  const root = document.documentElement;
  const launch = document.querySelector(".launch");
  let revealsStarted = false;
  if (root.classList.contains("launching") && launch) {
    const LAUNCH_FADE_AT = 1200;
    const revealTimer = setTimeout(startReveals, LAUNCH_FADE_AT);
    const end = () => {
      root.classList.remove("launching");
      launch.remove();
      removeEventListener("pointerdown", skip);
      removeEventListener("keydown", skip);
    };
    const skip = () => {
      clearTimeout(revealTimer);
      startReveals();
      launch.classList.add("is-skipping");
      setTimeout(end, 250);
    };
    launch.addEventListener("animationend", (e) => {
      if (e.target === launch) end();
    });
    // A safety net in case animation events never fire.
    setTimeout(end, 2000);
    addEventListener("pointerdown", skip);
    addEventListener("keydown", skip);
  } else {
    startReveals();
  }

  // Scroll reveals: blur, fade and slide in once, as each element enters.
  function startReveals() {
    if (revealsStarted) return;
    revealsStarted = true;
    const reveals = document.querySelectorAll(".reveal");
    if (reduced || !("IntersectionObserver" in window)) {
      reveals.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    reveals.forEach((el) => io.observe(el));
  }

  // Hero: the grey second line changes every few seconds. The old line
  // leaves (0.4s ease-in) while the new one arrives (0.6s ease-out).
  const lines = [...document.querySelectorAll(".hero-line")];
  let lineIndex = 0;
  if (!reduced && lines.length > 1) {
    setInterval(() => {
      if (document.hidden) return;
      const prev = lines[lineIndex];
      lineIndex = (lineIndex + 1) % lines.length;
      prev.dataset.state = "out";
      lines[lineIndex].dataset.state = "in";
    }, 3200);
  }

  // Product tour: four steps, advancing on their own until paused.
  const slides = [...document.querySelectorAll(".tour-slide")];
  const thumbs = [...document.querySelectorAll(".tour-thumb")];
  const caption = document.querySelector(".tour-caption");
  const play = document.querySelector(".tour-play");
  const CAPTIONS = [
    ["Set up", "Enter the school, examination, class and subject, or start from a Template."],
    ["Add questions", "Pick a Section and a question type, then write the Question and its answer."],
    ["Preview", "Watch the A4 Paper fill in as you type, with the marks added up for you."],
    ["Print", "Print, save as PDF or export to Word, with the Marking Scheme on its own."],
  ];
  let current = 0;
  let playing = !reduced;
  let timer = null;

  function show(i) {
    current = (i + slides.length) % slides.length;
    slides.forEach((slide, j) => {
      slide.hidden = j !== current;
      slide.classList.toggle("is-active", j === current);
    });
    thumbs.forEach((thumb, j) => thumb.setAttribute("aria-selected", String(j === current)));
    const [title, text] = CAPTIONS[current];
    caption.innerHTML = `<strong>${title}</strong> ${text}`;
    caption.classList.remove("is-new");
    void caption.offsetWidth;
    caption.classList.add("is-new");
    // Keep the active thumbnail in view without scrolling the page.
    const strip = thumbs[current].parentElement;
    const t = thumbs[current];
    if (t.offsetLeft < strip.scrollLeft || t.offsetLeft + t.offsetWidth > strip.scrollLeft + strip.clientWidth) {
      strip.scrollTo({ left: t.offsetLeft - 16, behavior: reduced ? "auto" : "smooth" });
    }
    schedule();
  }

  function schedule() {
    clearTimeout(timer);
    if (playing) timer = setTimeout(() => show(current + 1), 5000);
  }

  function setPlaying(on) {
    playing = on;
    play.setAttribute("aria-label", on ? "Pause tour" : "Play tour");
    play.innerHTML = `<svg><use href="#i-${on ? "pause" : "play"}"/></svg><span>${on ? "Pause" : "Play"}</span>`;
    schedule();
  }

  document.querySelector(".tour-prev").addEventListener("click", () => show(current - 1));
  document.querySelector(".tour-next").addEventListener("click", () => show(current + 1));
  thumbs.forEach((thumb, i) => thumb.addEventListener("click", () => show(i)));
  play.addEventListener("click", () => setPlaying(!playing));
  setPlaying(playing);
})();
