(() => {
  const viewer = document.querySelector(".viewer");
  const photos = Array.from(document.querySelectorAll("a[data-photo]"));
  if (!viewer || typeof viewer.showModal !== "function" || !photos.length) return;

  const image = viewer.querySelector(".viewer-figure img");
  const caption = viewer.querySelector("#viewer-caption");
  const counter = viewer.querySelector(".photo-counter");
  const original = viewer.querySelector(".original");
  const previous = viewer.querySelector(".viewer-prev");
  const next = viewer.querySelector(".viewer-next");
  const closeButton = viewer.querySelector(".viewer-close");
  let active = 0;
  let opener;
  let touchStart;

  function display(index) {
    active = (index + photos.length) % photos.length;
    const photo = photos[active];
    const position = `${active + 1} / ${photos.length}`;
    const label = photo.dataset.caption;
    image.alt = photo.querySelector("img").alt;
    image.src = photo.dataset.large || photo.href;
    counter.textContent = position;
    caption.textContent = label;
    caption.setAttribute("aria-label", `Photo ${position} — ${label}`);
    original.href = photo.href;
  }

  previous.disabled = next.disabled = photos.length < 2;
  photos.forEach((photo, index) => {
    photo.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      event.preventDefault();
      opener = photo;
      display(index);
      viewer.showModal();
      closeButton.focus({ preventScroll: true });
    });
  });

  previous.addEventListener("click", () => display(active - 1));
  next.addEventListener("click", () => display(active + 1));
  closeButton.addEventListener("click", () => viewer.close());
  viewer.addEventListener("click", (event) => {
    if (event.target === viewer) viewer.close();
  });
  viewer.addEventListener("close", () => {
    touchStart = undefined;
    opener?.focus({ preventScroll: true });
  });
  viewer.addEventListener("keydown", (event) => {
    if (photos.length < 2 || event.altKey || event.metaKey || event.ctrlKey || event.shiftKey) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      display(active + (event.key === "ArrowLeft" ? -1 : 1));
    }
  });

  // A single horizontal swipe moves through the photos. Two fingers retain native pinch zoom.
  image.addEventListener("touchstart", (event) => {
    touchStart = event.touches.length === 1 ? event.touches[0] : undefined;
  }, { passive: true });
  image.addEventListener("touchcancel", () => { touchStart = undefined; });
  image.addEventListener("touchend", (event) => {
    if (!touchStart || event.touches.length || photos.length < 2) return;
    const stop = event.changedTouches[0];
    const dx = stop.clientX - touchStart.clientX;
    const dy = stop.clientY - touchStart.clientY;
    touchStart = undefined;
    if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.8) {
      display(active + (dx > 0 ? -1 : 1));
    }
  }, { passive: true });
})();
