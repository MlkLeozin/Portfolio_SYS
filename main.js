// ===================================================
//  SUNG LEOZIN WOO — main.js
// ===================================================

// ===== STICKY HEADER =====
window.addEventListener('scroll', () => {
    document.getElementById('header').classList.toggle('sticky', window.scrollY > 50);
});

// ===== MOBILE MENU =====
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('navigation');

menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    nav.classList.toggle('active');
});

nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        nav.classList.remove('active');
    });
});

// ===================================================
//  THEME TOGGLE — 3 ESTADOS
//  0 = Dark (padrão)
//  1 = Light
//  2 = Sung Woo System
// ===================================================
const themeBtn   = document.getElementById('themeBtn');
const bootScreen = document.getElementById('system-boot');
const bootBar    = document.getElementById('bootBar');
const bootLines  = [
    document.getElementById('bl1'),
    document.getElementById('bl2'),
    document.getElementById('bl3'),
    document.getElementById('bl4'),
];

const ICONS   = ['☀', '月', '系'];
const TITLES  = ['Mudar para Claro', 'Mudar para Sistema Sung', 'Voltar ao Dark'];

let themeState   = 0;
let matrixTimer  = null;

// -- Helper: sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// -- Boot sequence animation
async function bootSequence() {
    bootScreen.classList.add('active');
    bootBar.style.width = '0%';
    bootLines.forEach(l => l.classList.remove('show'));

    for (let i = 0; i < bootLines.length; i++) {
        await sleep(350);
        bootLines[i].classList.add('show');
        bootBar.style.width = ((i + 1) / bootLines.length * 100) + '%';
    }

    await sleep(600);
    bootScreen.classList.remove('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// -- Apply theme
async function applyTheme(state) {
    // Remove previous
    document.documentElement.removeAttribute('data-theme');
    stopMatrix();

    if (state === 1) {
        document.documentElement.setAttribute('data-theme', 'light');
    } else if (state === 2) {
        await bootSequence();
        document.documentElement.setAttribute('data-theme', 'system');
        startMatrix();
    }
    // state 0 = dark (no attribute needed)

    themeBtn.textContent = ICONS[state];
    themeBtn.title = TITLES[state];
}

themeBtn.addEventListener('click', async () => {
    themeState = (themeState + 1) % 3;
    await applyTheme(themeState);
});

// ===================================================
//  MATRIX RAIN
// ===================================================
const canvas = document.getElementById('matrix-canvas');
const ctx    = canvas.getContext('2d');
const CHARS  = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ開発者デザイナー宋月系01アカサタナハマヤラワ';

function startMatrix() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const cols  = Math.floor(canvas.width / 18);
    const drops = Array(cols).fill(1);

    matrixTimer = setInterval(() => {
        ctx.fillStyle = 'rgba(0, 13, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00ff88';
        ctx.font = '14px Space Mono, monospace';

        for (let i = 0; i < drops.length; i++) {
            const char = CHARS[Math.floor(Math.random() * CHARS.length)];
            ctx.fillText(char, i * 18, drops[i] * 18);

            if (drops[i] * 18 > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }, 50);
}

function stopMatrix() {
    if (matrixTimer) {
        clearInterval(matrixTimer);
        matrixTimer = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

window.addEventListener('resize', () => {
    if (matrixTimer) {
        stopMatrix();
        startMatrix();
    }
});

// ===================================================
//  JAPANESE TYPEWRITER ANIMATION
// ===================================================
const roles = [
    { kanji: '開発者',      roman: 'Desenvolvedor Web'      },
    { kanji: 'デザイナー',  roman: 'Designer de Interfaces'  },
    { kanji: 'プログラマー', roman: 'Programador'             },
    { kanji: '創造者',      roman: 'Criador Digital'         },
];

const kanjiEl   = document.getElementById('jpKanji');
const romanEl   = document.getElementById('jpRoman');
let   roleIndex = 0;

async function typeLoop() {
    while (true) {
        const role = roles[roleIndex];

        // Phase 1 — type kanji char by char
        kanjiEl.classList.add('visible');
        romanEl.classList.remove('visible');

        for (let i = 0; i <= role.kanji.length; i++) {
            kanjiEl.innerHTML = role.kanji.slice(0, i) + '<span class="cursor-bar"></span>';
            await sleep(120);
        }

        // Phase 2 — reveal roman translation
        await sleep(300);
        romanEl.textContent = role.roman;
        romanEl.classList.add('visible');
        await sleep(1800);

        // Phase 3 — hide roman
        romanEl.classList.remove('visible');
        await sleep(300);

        // Phase 4 — delete kanji char by char
        for (let i = role.kanji.length; i >= 0; i--) {
            kanjiEl.innerHTML = role.kanji.slice(0, i) + '<span class="cursor-bar"></span>';
            await sleep(80);
        }

        await sleep(400);
        roleIndex = (roleIndex + 1) % roles.length;
    }
}

// Start typewriter when DOM is ready
typeLoop();

