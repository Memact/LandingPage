const video = document.querySelector('.demo-video');
const progressFill = document.getElementById('demo-progress-fill');
const controlButton = document.getElementById('demo-control');
const demoWindow = document.querySelector('.demo-window');

if (video && progressFill) {
  let rafId = null;

  const updateProgress = () => {
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    const current = Number.isFinite(video.currentTime) ? video.currentTime : 0;
    const value = duration > 0 ? Math.max(0, Math.min(100, (current / duration) * 100)) : 0;
    progressFill.style.width = `${value}%`;
  };

  const syncControl = () => {
    if (!controlButton) return;
    const paused = video.paused || video.ended;
    controlButton.dataset.state = paused ? 'play' : 'pause';
    controlButton.setAttribute('aria-label', paused ? 'Play demo video' : 'Pause demo video');
  };

  const stopTicker = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  const tick = () => {
    updateProgress();
    if (!video.paused && !video.ended) {
      rafId = requestAnimationFrame(tick);
    } else {
      stopTicker();
    }
  };

  const flashControl = () => {
    if (!demoWindow) return;
    demoWindow.classList.add('is-control-visible');
    window.clearTimeout(flashControl._timer);
    flashControl._timer = window.setTimeout(() => {
      demoWindow.classList.remove('is-control-visible');
    }, 1800);
  };

  const togglePlayback = async () => {
    try {
      if (video.paused || video.ended) {
        await video.play();
      } else {
        video.pause();
      }
      syncControl();
      flashControl();
    } catch (_) {
      syncControl();
    }
  };

  video.addEventListener('loadedmetadata', () => {
    updateProgress();
    syncControl();
  });
  video.addEventListener('timeupdate', updateProgress);
  video.addEventListener('seeking', updateProgress);
  video.addEventListener('seeked', updateProgress);
  video.addEventListener('play', () => {
    syncControl();
    stopTicker();
    rafId = requestAnimationFrame(tick);
  });
  video.addEventListener('pause', () => {
    syncControl();
    stopTicker();
    updateProgress();
  });
  video.addEventListener('ended', () => {
    syncControl();
    stopTicker();
    updateProgress();
  });
  video.addEventListener('emptied', () => {
    syncControl();
    stopTicker();
    progressFill.style.width = '0%';
  });
  video.addEventListener('click', togglePlayback);
  video.addEventListener('touchstart', flashControl, { passive: true });

  if (controlButton) {
    controlButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      togglePlayback();
    });
  }

  if (demoWindow) {
    demoWindow.addEventListener('mouseenter', flashControl);
    demoWindow.addEventListener('focusin', flashControl);
  }

  updateProgress();
  syncControl();
}
