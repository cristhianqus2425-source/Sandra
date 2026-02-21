/* =====================================================
   GSAP + ScrollTrigger
===================================================== */
gsap.registerPlugin(ScrollTrigger);

/* =====================================================
   FLOATING PETALS
===================================================== */
const EMOJIS    = ['❤️','🩷','💕','💗','💖','🌸','✨','🌺','💝','🌼'];
const petalsCont = document.getElementById('petals');

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

for (let i = 0; i < 10; i++) spawnPetal();
setInterval(spawnPetal, 900);

/* =====================================================
   HERO ENTRANCE
===================================================== */
gsap.timeline({ delay: 0.3 })
    .from('#heroTitle', { y: 70, opacity: 0, duration: 1.4, ease: 'power4.out' })
    .from('#heroSub',   { y: 40, opacity: 0, duration: 1.1, ease: 'power3.out' }, '-=0.8')
    .from('.scroll-hint', { opacity: 0, duration: 0.8, ease: 'power2.out' },      '-=0.4');

/* =====================================================
   SECTION HEADING
===================================================== */
gsap.from('#tlHeading', {
    scrollTrigger: { trigger: '#tlHeading', start: 'top 85%' },
    y: 50, opacity: 0, duration: 1, ease: 'power3.out'
});

/* =====================================================
   TIMELINE ITEMS
===================================================== */
document.querySelectorAll('[data-tl]').forEach(item => {
    const isRight = item.classList.contains('right');
    gsap.from(item.children, {
        scrollTrigger: { trigger: item, start: 'top 88%' },
        x:       isRight ? 70 : -70,
        opacity: 0,
        duration: 0.95,
        ease:    'power3.out',
        stagger: 0.12
    });
});

/* =====================================================
   BREAK SECTION
===================================================== */
gsap.from('#emptyFrame', {
    scrollTrigger: { trigger: '#emptyFrame', start: 'top 80%' },
    scale: 0.85, opacity: 0, duration: 1.2, ease: 'power3.out'
});

gsap.from('#sadTitle', {
    scrollTrigger: { trigger: '#sadTitle', start: 'top 85%' },
    y: 40, opacity: 0, duration: 1, ease: 'power3.out'
});

/* =====================================================
   FINAL SECTION
===================================================== */
gsap.from('#finalPhoto', {
    scrollTrigger: { trigger: '#finalPhoto', start: 'top 85%' },
    scale: 0.7, opacity: 0, duration: 1.3, ease: 'back.out(1.5)'
});

gsap.from('#finalPre', {
    scrollTrigger: { trigger: '#finalPre', start: 'top 90%' },
    y: 30, opacity: 0, duration: 1, ease: 'power3.out'
});

gsap.from('.forgive-btn', {
    scrollTrigger: { trigger: '.forgive-btn', start: 'top 90%' },
    scale: 0.8, opacity: 0, duration: 1.1, ease: 'back.out(1.8)'
});

/* =====================================================
   3D POLAROID TILT (desktop only)
===================================================== */
if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.polaroid').forEach(card => {
        card.style.transition = 'none';

        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
            const y = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
            gsap.to(card, {
                rotateY:            x * 14,
                rotateX:           -y * 14,
                scale:              1.04,
                duration:           0.35,
                ease:               'power2.out',
                transformPerspective: 600
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateY: 0, rotateX: 0, scale: 1,
                duration: 0.6, ease: 'power3.out'
            });
        });
    });
}

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
   TAP OVERLAY
===================================================== */
const overlay = document.getElementById('tapOverlay');

gsap.from('#tapPhoto',         { scale: 0.7, opacity: 0, duration: 1.2, ease: 'back.out(1.6)', delay: 0.2 });
gsap.from('.tap-overlay h2',   { y: 30,      opacity: 0, duration: 1.0, ease: 'power3.out',    delay: 0.6 });
gsap.from('.tap-overlay p',    { y: 20,      opacity: 0, duration: 0.9, ease: 'power3.out',    delay: 0.9 });
gsap.from('.tap-circle',       { scale: 0,   opacity: 0, duration: 0.8, ease: 'back.out(2)',   delay: 1.1 });

function dismissOverlay() {
    audio.play().catch(() => {});
    gsap.to(overlay, {
        opacity: 0, duration: 0.85, ease: 'power2.inOut',
        onComplete: () => overlay.remove()
    });
}

audio.play().then(dismissOverlay).catch(() => {
    overlay.addEventListener('click', dismissOverlay, { once: true });
});

/* =====================================================
   FORGIVE BUTTON
===================================================== */
document.getElementById('forgiveBtn').addEventListener('click', function () {
    const colors = ['#ff6b9d','#ffd93d','#a29bfe','#ff9cc4','#ffffff','#ffb3d1'];

    // Confetti
    confetti({ particleCount: 80,  spread: 80,  origin: { y: 0.7 }, colors });
    setTimeout(() => confetti({ particleCount: 60, spread: 110, origin: { y: 0.65 }, colors }), 250);
    setTimeout(() => confetti({ particleCount: 40, angle: 60,  spread: 70, origin: { x: 0, y: 0.7 }, colors }), 400);
    setTimeout(() => confetti({ particleCount: 40, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, colors }), 400);

    // Extra petals
    for (let i = 0; i < 25; i++) spawnPetal();

    // Show response
    const resp = document.getElementById('yesResp');
    resp.style.display = 'block';
    gsap.from(resp, { y: 40, opacity: 0, duration: 1.2, ease: 'power3.out', delay: 0.2 });

    // Raise volume gently
    audio.play().catch(() => {});
    let v = audio.volume;
    const bump = setInterval(() => {
        if (v < 0.75) { v = Math.min(v + 0.05, 0.75); audio.volume = v; }
        else clearInterval(bump);
    }, 100);

    setTimeout(() => resp.scrollIntoView({ behavior: 'smooth', block: 'center' }), 350);
    this.disabled = true;
});
