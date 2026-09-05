/**
 * ItsBenzo_TV — Chaos Control Center
 * Vanilla JavaScript | 100% Zero Bloat | High Performance
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTwitchPlayer();
  initCommandsCopy();
  initRetroAudioEffects();
  initScheduleLoader();
});

/* -------------------------------------------------------------------------- */
/* 1. Navbar & Scroll State                                                   */
/* -------------------------------------------------------------------------- */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      toggleBtn.innerHTML = isOpen ? '✕' : '☰';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          toggleBtn.innerHTML = '☰';
        }
      });
    });
  }
}

/* -------------------------------------------------------------------------- */
/* 2. Privacy-Friendly Twitch Player Embed                                    */
/* -------------------------------------------------------------------------- */
function initTwitchPlayer() {
  const loadBtn = document.getElementById('load-player-btn');
  const playerContainer = document.getElementById('twitch-player-container');
  const placeholder = document.getElementById('player-placeholder');

  if (!loadBtn || !playerContainer) return;

  loadBtn.addEventListener('click', () => {
    const currentHost = window.location.hostname || 'benzjeremy.github.io';
    
    const iframe = document.createElement('iframe');
    iframe.src = `https://player.twitch.tv/?channel=itsbenzo_tv&parent=${encodeURIComponent(currentHost)}&parent=benzjeremy.github.io&muted=false&autoplay=true`;
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('frameborder', '0');
    iframe.title = 'ItsBenzo_TV Twitch Stream';

    if (placeholder) {
      placeholder.style.display = 'none';
    }
    playerContainer.appendChild(iframe);
    showToast('📺 Twitch Stream wird geladen...');
  });
}

/* -------------------------------------------------------------------------- */
/* 3. Interactive Commands Copy & Toast                                       */
/* -------------------------------------------------------------------------- */
function initCommandsCopy() {
  const commandItems = document.querySelectorAll('.cmd-item');

  commandItems.forEach(item => {
    item.addEventListener('click', () => {
      const cmdText = item.getAttribute('data-command') || item.querySelector('.cmd-trigger').textContent.trim();
      navigator.clipboard.writeText(cmdText).then(() => {
        playBeep(520, 0.08);
        showToast(`📋 Befehl "${cmdText}" in Zwischenablage kopiert!`);
      }).catch(() => {
        showToast(`📋 ${cmdText}`);
      });
    });
  });
}

function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

/* -------------------------------------------------------------------------- */
/* 4. Retro Cyber Web Audio Blips (Pure Synth)                                */
/* -------------------------------------------------------------------------- */
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  return audioCtx;
}

function playBeep(freq = 440, duration = 0.06) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Graceful fallback
  }
}

function initRetroAudioEffects() {
  const interactiveButtons = document.querySelectorAll('.btn, .friend-card, .link-pill');
  interactiveButtons.forEach(el => {
    el.addEventListener('mouseenter', () => {
      playBeep(700, 0.02);
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 5. Dynamic Schedule Loader from events.json                                 */
/* -------------------------------------------------------------------------- */
async function initScheduleLoader() {
  const container = document.getElementById('events-container');
  if (!container) return;

  try {
    const res = await fetch('events.json?' + Date.now());
    if (!res.ok) return;
    const events = await res.json();
    if (!events || events.length === 0) return;

    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    container.innerHTML = '';
    events.forEach(ev => {
      const card = document.createElement('div');
      card.className = 'event-card';

      let formattedDate = 'Geplant';
      if (ev.date) {
        const d = new Date(ev.date);
        formattedDate = d.toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' Uhr';
      }

      card.innerHTML = `
        <div class="event-meta">
          <span class="event-date">📅 ${formattedDate}</span>
          <span class="event-category">${escapeHtml(ev.category || 'Stream')}</span>
        </div>
        <h3 class="event-title">${escapeHtml(ev.title)}</h3>
        <p class="event-desc">${escapeHtml(ev.description)}</p>
      `;
      container.appendChild(card);
    });
  } catch (e) {
    // Keep fallback static events
  }
}

function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
