/* =====================================================
   PETALS CONTAINER
===================================================== */
const petalsCont = document.createElement('div');
petalsCont.className = 'petals-cont';
document.body.appendChild(petalsCont);

const EMOJIS = ['❤️','🩷','💕','💗','💖','🌸','✨','🌺','💝','🌼'];

function spawnPetal() {
    const el = document.createElement('div');
    el.className = 'petal';
    el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    el.style.left         = Math.random() * 100 + 'vw';
    el.style.fontSize     = (Math.random() * 14 + 9) + 'px';
    const dur             = Math.random() * 12 + 10;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay   = (Math.random() * 3) + 's';
    petalsCont.appendChild(el);
    setTimeout(() => el.remove(), (dur + 5) * 1000);
}

/* =====================================================
   SLIDES DATA
===================================================== */
const SLIDES = [
    {
        type:      'photo',
        bg:        'assets/photos/1.jpeg',
        img:       'assets/photos/1.jpeg',
        label:     '★ La primera foto ★',
        caption:   'Cusco — sin saber aún que te volverías mi mundo 🌿',
        text:      'Esta fue la primera foto que te tomé... sin saber todavía que te ibas a volver la persona más importante en mi vida.',
        accent:    '#ffd93d',
        landscape: false
    },
    {
        type:      'photo',
        bg:        'assets/photos/2.jpeg',
        img:       'assets/photos/2.jpeg',
        label:     'La primera foto juntos',
        caption:   '"El turista sabía cosas" 🏔️',
        text:      'Aún no éramos nada oficial, pero ya estábamos juntos. Ya sentía que iba a ser algo especial.',
        accent:    '#a29bfe',
        landscape: true
    },
    {
        type:      'photo',
        bg:        'assets/photos/3.jpeg',
        img:       'assets/photos/3.jpeg',
        label:     'Ya éramos novios',
        caption:   'La primera foto siendo tuyos 💕',
        text:      'Saber que eras mía y yo era tuyo... eso era todo lo que necesitaba.',
        accent:    '#ff6b9d',
        landscape: false
    },
    {
        type:      'photo',
        bg:        'assets/photos/4.jpeg',
        img:       'assets/photos/4.jpeg',
        label:     'Nuestro primer viaje',
        caption:   'El primero de muchos 🌇',
        text:      'Ese atardecer contigo me hizo pensar en todos los lugares que quiero ver a tu lado.',
        accent:    '#55efc4',
        landscape: true
    },
    {
        type:      'photo',
        bg:        'assets/photos/5.jpeg',
        img:       'assets/photos/5.jpeg',
        label:     'El mismo viaje',
        caption:   'No quiero que sea el último 🌙',
        text:      'Hay demasiados lugares que quiero conocer contigo. No quiero que este sea el último.',
        accent:    '#74b9ff',
        landscape: false
    },
    {
        type:   'break',
        accent: '#ff6b9d',
        title:  '"Aquí es donde me equivoqué."',
        quote:  'Y no quiero que nuestra historia se detenga aquí...',
        text:   'Sé que fallé. No busco excusas. Solo sé que lo que vivimos es demasiado bonito para terminarlo así.'
    },
    {
        type:   'final',
        bg:     'assets/photos/3.jpeg',
        img:    'assets/photos/3.jpeg',
        accent: '#ff6b9d',
        title:  'Todavía quiero escribir esto contigo',
        text:   'No como terminamos, sino como merecemos.'
    }
];

/* =====================================================
   BUILD SLIDE HTML
===================================================== */
function buildSlide(s, idx) {
    const el = document.createElement('div');
    el.className = 'slide';
    el.dataset.idx = idx;

    if (s.type === 'photo') {
        el.innerHTML = `
            <div class="slide-bg" style="background-image:url('${s.bg}')"></div>
            <div class="slide-inner">
                <div class="slide-polaroid">
                    <img src="${s.img}" alt="" class="${s.landscape ? 'landscape' : ''}">
                    <p class="slide-polaroid-caption">${s.caption}</p>
                </div>
                <div class="slide-card">
                    <div class="slide-label" style="color:${s.accent}">${s.label}</div>
                    <p class="slide-text">${s.text}</p>
                </div>
            </div>`;

    } else if (s.type === 'break') {
        el.innerHTML = `
            <div class="slide-bg" style="background:radial-gradient(ellipse at 50% 60%,rgba(100,20,60,0.55) 0%,#04030a 80%)"></div>
            <div class="break-slide-inner">
                <div class="break-frame">
                    <div class="break-frame-icon">📷</div>
                    <p>Aquí debería haber<br>más fotos...<br>Pero me equivoqué.</p>
                </div>
                <h2 class="break-title">${s.title}</h2>
                <div class="break-quote"><p>${s.quote}</p></div>
                <p class="break-body">${s.text}</p>
            </div>`;

    } else { // final
        el.innerHTML = `
            <div class="slide-bg" style="background-image:url('${s.bg}')"></div>
            <div class="final-slide-inner">
                <img src="${s.img}" alt="" class="final-photo">
                <h2 class="final-title">${s.title}</h2>
                <p class="final-body">${s.text}</p>
                <div class="btn-group">
                    <button class="forgive-btn" id="forgiveBtn">¿Me perdonas y seguimos escribiendo esto? ❤️</button>
                    <button class="no-btn" id="noBtn">No</button>
                </div>
                <div class="no-response" id="noResponse"></div>
                <div class="yes-response" id="yesResp">
                    <h2>Te quiero, Sandra ❤️</h2>
                    <p>Gracias por darme otra oportunidad para hacerlo bien.</p>
                </div>
            </div>`;
    }

    return el;
}

/* =====================================================
   STORY INIT
===================================================== */
const storyEl   = document.getElementById('story');
const storyBars = document.getElementById('storyBars');
const slidesWrap = document.getElementById('slidesWrap');
const tapPrev   = document.getElementById('tapPrev');
const tapNext   = document.getElementById('tapNext');
const tapHint   = document.getElementById('tapHint');

let current  = 0;
let animating = false;

// Build progress bars
SLIDES.forEach(() => {
    const bar = document.createElement('div');
    bar.className = 'story-bar';
    bar.innerHTML = '<div class="story-bar-fill"></div>';
    storyBars.appendChild(bar);
});

// Build slides — all off-screen except first
const slideEls = SLIDES.map((s, i) => {
    const el = buildSlide(s, i);
    slidesWrap.appendChild(el);
    if (i !== 0) gsap.set(el, { xPercent: 100, opacity: 0 });
    return el;
});

/* =====================================================
   PROGRESS BARS UPDATE
===================================================== */
function updateBars(idx) {
    storyBars.querySelectorAll('.story-bar-fill').forEach((f, i) => {
        f.style.width = i <= idx ? '100%' : '0%';
    });
}

updateBars(0);

/* =====================================================
   NAVIGATION
===================================================== */
function navigate(dir) {
    if (animating) return;
    const next = current + dir;
    if (next < 0 || next >= SLIDES.length) return;

    animating = true;

    const curEl  = slideEls[current];
    const nextEl = slideEls[next];

    // Position incoming slide off-screen
    gsap.set(nextEl, { xPercent: dir > 0 ? 105 : -105, opacity: 0 });

    // Outgoing slide
    gsap.to(curEl, {
        xPercent: dir > 0 ? -40 : 40,
        opacity:  0,
        duration: 0.45,
        ease:     'power3.in'
    });

    // Incoming slide
    gsap.to(nextEl, {
        xPercent: 0,
        opacity:  1,
        duration: 0.52,
        ease:     'power3.out',
        delay:    0.05
    });

    current = next;
    updateBars(current);

    // Hide tap hint after first advance
    if (current > 0) gsap.to(tapHint, { opacity: 0, duration: 0.5 });

    // Final slide: disable tap zones (buttons handle interaction)
    const isFinal = current === SLIDES.length - 1;
    tapPrev.style.display = isFinal ? 'none' : '';
    tapNext.style.display = isFinal ? 'none' : '';
    tapHint.style.display = isFinal ? 'none' : '';

    if (isFinal) {
        setTimeout(() => {
            initForgiveBtn();
            initNoBtn();
        }, 600);
    }

    setTimeout(() => { animating = false; }, 600);
}

/* =====================================================
   TAP ZONES
===================================================== */
tapPrev.addEventListener('click', () => navigate(-1));
tapNext.addEventListener('click', () => navigate(1));

/* =====================================================
   SWIPE SUPPORT
===================================================== */
let touchStartX = 0;
let touchStartY = 0;

storyEl.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: true });

storyEl.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    // Only treat as swipe if horizontal movement dominates
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 44) {
        navigate(dx < 0 ? 1 : -1);
    }
}, { passive: true });

/* =====================================================
   KEYBOARD (desktop)
===================================================== */
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') navigate(1);
    if (e.key === 'ArrowLeft')  navigate(-1);
});

/* =====================================================
   AUDIO
===================================================== */
const audio   = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const eq      = document.getElementById('eq');
let playing   = false;

audio.volume = 0.5;

function setPlay(state) {
    playing = state;
    playBtn.textContent = state ? '⏸' : '▶';
    eq.classList.toggle('stopped', !state);
}

audio.addEventListener('play',  () => setPlay(true));
audio.addEventListener('pause', () => setPlay(false));

playBtn.addEventListener('click', () => {
    playing ? audio.pause() : audio.play().catch(() => {});
});

/* =====================================================
   TAP OVERLAY (autoplay gate)
===================================================== */
const overlay = document.getElementById('tapOverlay');

gsap.from('#tapPhoto',       { scale: 0.7, opacity: 0, duration: 1.2, ease: 'back.out(1.6)', delay: 0.2 });
gsap.from('.tap-overlay h2', { y: 30,      opacity: 0, duration: 1.0, ease: 'power3.out',    delay: 0.6 });
gsap.from('.tap-overlay p',  { y: 20,      opacity: 0, duration: 0.9, ease: 'power3.out',    delay: 0.9 });
gsap.from('.tap-circle',     { scale: 0,   opacity: 0, duration: 0.8, ease: 'back.out(2)',   delay: 1.1 });

function dismissOverlay() {
    audio.play().catch(() => {});
    gsap.to(overlay, {
        opacity: 0,
        duration: 0.85,
        ease: 'power2.inOut',
        onComplete: () => overlay.remove()
    });
}

audio.play().then(dismissOverlay).catch(() => {
    overlay.addEventListener('click', dismissOverlay, { once: true });
});

/* =====================================================
   FORGIVE BUTTON
===================================================== */
function initForgiveBtn() {
    const btn = document.getElementById('forgiveBtn');
    if (!btn || btn._inited) return;
    btn._inited = true;

    const colors = ['#ff6b9d','#ffd93d','#a29bfe','#ff9cc4','#ffffff','#ffb3d1'];

    btn.addEventListener('click', function () {
        // Save answer
        localStorage.setItem('respuesta', 'si');
        localStorage.setItem('respuesta_fecha', new Date().toLocaleString('es-PE'));

        confetti({ particleCount: 80,  spread: 80,  origin: { y: 0.7 }, colors });
        setTimeout(() => confetti({ particleCount: 60, spread: 110, origin: { y: 0.65 }, colors }), 250);
        setTimeout(() => confetti({ particleCount: 40, angle: 60,  spread: 70, origin: { x: 0, y: 0.7 }, colors }), 400);
        setTimeout(() => confetti({ particleCount: 40, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, colors }), 400);

        for (let i = 0; i < 25; i++) spawnPetal();

        // Remove the No button
        const noBtn = document.getElementById('noBtn');
        if (noBtn) gsap.to(noBtn, { opacity: 0, duration: 0.4, onComplete: () => noBtn.remove() });

        // Show yes response
        const resp = document.getElementById('yesResp');
        resp.style.display = 'block';
        gsap.from(resp, { y: 40, opacity: 0, duration: 1.2, ease: 'power3.out', delay: 0.2 });

        // Bump volume
        audio.play().catch(() => {});
        let v = audio.volume;
        const bump = setInterval(() => {
            if (v < 0.75) { v = Math.min(v + 0.05, 0.75); audio.volume = v; }
            else clearInterval(bump);
        }, 100);

        setTimeout(() => resp.scrollIntoView({ behavior: 'smooth', block: 'center' }), 350);
        this.disabled = true;
    });
}

/* =====================================================
   NO BUTTON
===================================================== */
function initNoBtn() {
    const noBtn  = document.getElementById('noBtn');
    const noResp = document.getElementById('noResponse');
    if (!noBtn || noBtn._inited) return;
    noBtn._inited = true;

    let noCount = 0;

    const messages = [
        { icon: '🥺', text: '¿En serio no me vas a perdonar?',   cls: '' },
        { icon: '💔', text: '¿De verdad no me perdonas?',         cls: '' },
        {
            icon: '❤️',
            text: 'Lo siento por no poder darte la calma y el apoyo que necesitabas... Igual siempre te querré.',
            cls: 'final'
        }
    ];

    function showNoMessage(idx) {
        const m = messages[idx];
        noResp.className = 'no-response ' + m.cls;
        noResp.innerHTML = `<span class="no-icon">${m.icon}</span><p>${m.text}</p>`;
        noResp.style.display = 'block';
        gsap.fromTo(noResp,
            { y: 20, opacity: 0 },
            { y: 0,  opacity: 1, duration: 0.9, ease: 'power3.out' }
        );
    }

    noBtn.addEventListener('click', () => {
        if (noCount >= 3) return;
        showNoMessage(noCount);
        noCount++;

        if (noCount >= 3) {
            // Save answer on final No message
            localStorage.setItem('respuesta', 'no');
            localStorage.setItem('respuesta_fecha', new Date().toLocaleString('es-PE'));

            setTimeout(() => {
                gsap.to(noBtn, {
                    opacity: 0, scale: 0.5, duration: 0.6,
                    ease: 'power2.in',
                    onComplete: () => noBtn.remove()
                });
            }, 800);
        }
    });
}

/* =====================================================
   CHECK PANEL — visita la página con ?check en la URL
===================================================== */
if (new URLSearchParams(window.location.search).has('check')) {
    const resp   = localStorage.getItem('respuesta');
    const fecha  = localStorage.getItem('respuesta_fecha') || '—';
    const emoji  = resp === 'si' ? '❤️' : resp === 'no' ? '💔' : '🕐';
    const texto  = resp === 'si'
        ? 'Dijo que <strong>Sí</strong> ❤️'
        : resp === 'no'
        ? 'Dijo que <strong>No</strong> 💔'
        : 'Todavía no ha respondido';

    const panel = document.createElement('div');
    panel.style.cssText = `
        position:fixed;inset:0;z-index:99999;
        background:#07050f;
        display:flex;flex-direction:column;
        align-items:center;justify-content:center;
        text-align:center;padding:40px;
        font-family:'Crimson Text',serif;color:#fff;
    `;
    panel.innerHTML = `
        <div style="font-size:4rem;margin-bottom:24px">${emoji}</div>
        <p style="font-family:'Playfair Display',serif;font-style:italic;font-size:clamp(1.4rem,5vw,2.2rem);margin-bottom:12px">${texto}</p>
        <p style="font-size:14px;color:rgba(255,255,255,0.35);margin-bottom:36px">${fecha !== '—' ? 'el ' + fecha : ''}</p>
        <button onclick="localStorage.clear();location.reload()" style="
            padding:10px 28px;border-radius:100px;border:1px solid rgba(255,255,255,0.15);
            background:transparent;color:rgba(255,255,255,0.35);font-size:13px;cursor:pointer;
        ">Borrar respuesta</button>
    `;
    document.body.appendChild(panel);
}

/* =====================================================
   PETALS — start a few
===================================================== */
for (let i = 0; i < 6; i++) spawnPetal();
setInterval(spawnPetal, 1100);
