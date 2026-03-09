const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

function initCarousels() {
  const carousels = document.querySelectorAll("[data-carousel]");
  carousels.forEach((carousel) => {
    const viewport = carousel.querySelector(".carousel-viewport");
    const track = carousel.querySelector(".carousel-track");
    const items = Array.from(carousel.querySelectorAll(".video-item"));
    const prevBtn = carousel.querySelector(".carousel-btn.prev");
    const nextBtn = carousel.querySelector(".carousel-btn.next");
    let index = 0;

    function visibleCount() {
      return window.innerWidth <= 720 ? 1 : 2;
    }

    function update() {
      const count = visibleCount();
      const maxIndex = Math.max(0, items.length - count);
      index = Math.min(index, maxIndex);
      const gap = 12;
      const itemWidth = (viewport.clientWidth - gap * (count - 1)) / count;
      items.forEach((item) => {
        item.style.flexBasis = `${itemWidth}px`;
      });
      track.style.transform = `translateX(-${index * (itemWidth + gap)}px)`;
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === maxIndex;
    }

    prevBtn.addEventListener("click", () => {
      index -= 1;
      update();
    });

    nextBtn.addEventListener("click", () => {
      index += 1;
      update();
    });

    window.addEventListener("resize", update);
    update();
  });
}

function renderVideoInstructions() {
  const videos = document.querySelectorAll("video[data-instruction]");
  videos.forEach((video) => {
    const instruction = video.dataset.instruction?.trim();
    if (!instruction) return;
    const container = video.closest(".video-item");
    if (!container || container.querySelector(".video-instruction")) return;

    const textEl = document.createElement("p");
    textEl.className = "video-instruction";
    textEl.textContent = `Instruction: ${instruction}`;
    container.appendChild(textEl);
  });
}

function syncVlnInstructionHeights() {
  const vlnBlock = document.querySelector(".vln-task");
  if (!vlnBlock) return;

  const instructionEls = Array.from(vlnBlock.querySelectorAll(".video-instruction"));
  if (instructionEls.length === 0) return;

  let maxHeight = 0;
  instructionEls.forEach((el) => {
    el.style.minHeight = "0";
    maxHeight = Math.max(maxHeight, el.scrollHeight);
  });

  instructionEls.forEach((el) => {
    el.style.minHeight = `${maxHeight}px`;
  });
}

initCarousels();
renderVideoInstructions();
syncVlnInstructionHeights();
window.addEventListener("resize", syncVlnInstructionHeights);
