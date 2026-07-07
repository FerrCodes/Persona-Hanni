// ========================================
// PERFORMANCE OPTIMIZATIONS FOR MOBILE
// ========================================

// Detect mobile and low-end devices
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isLowEnd = isMobile && (navigator.hardwareConcurrency <= 4 || navigator.deviceMemory <= 4);

// Throttle function for scroll events
function throttle(func, wait) {
    let lastTime = 0;
    return function executedFunction(...args) {
        const now = Date.now();
        if (now - lastTime >= wait) {
            func.apply(this, args);
            lastTime = now;
        }
    };
}

// Intersection Observer for lazy load and animation control
const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            if (element.tagName === 'IMG' && element.loading === 'lazy') {
                element.classList.add('loaded');
            }
        }
    });
}, observerOptions);

// ========================================
// OPTIMIZED PARTICLES
// ========================================
const particlesContainer = document.getElementById('particles');

// Drastically reduce particles on mobile & low-end devices
let particleCount;
if (isLowEnd) {
    particleCount = 0;
} else if (isMobile) {
    particleCount = 2;
} else {
    particleCount = 8;
}

const particleEmojis = ['✨', '💕', '🎀', '⭐', '💙'];

function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.innerText = particleEmojis[Math.floor(Math.random() * particleEmojis.length)];
    
    particle.style.left = Math.random() * 100 + '%';
    particle.style.setProperty('--duration', (20 + Math.random() * 10) + 's');
    particle.style.setProperty('--delay', Math.random() * 5 + 's');
    
    if (particlesContainer) {
        particlesContainer.appendChild(particle);
    }
    
    // Remove after animation completes
    const duration = parseFloat(particle.style.getPropertyValue('--duration'));
    setTimeout(() => {
        if (particle.parentNode) {
            particle.remove();
        }
    }, duration * 1000);
}

// Only create particles if not reduced motion AND not low-end
if (particlesContainer && 
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    particleCount > 0) {
    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => createParticle(), i * 1000);
    }
}

// ========================================
// STATE DATA
// ========================================
const normalState = {
    subtitle: "Hanni the Idol 🌟",
    bubble: "Naurrr~!",
    cards: [
        { title: "Viet-Aussie", text: "Logat Australia yang ikonik & multibahasa jenius.", icon: "🇦🇺" },
        { title: "Honey Voice", text: "Suara yang manis seperti madu & dance yang swag.", icon: "🎤" },
        { title: "Bread Lover", text: "Sangat terobsesi dengan roti. Roti is life.", icon: "🥖" }
    ]
};

const potatoState = {
    subtitle: "Soft & Cozy Hanni 💕",
    bubble: "Feels like a warm hug~",
    cards: [
        { title: "Sweet Soul", text: "Kepribadian yang hangat dan menenangkan seperti secangkir teh.", icon: "🫖" },
        { title: "Gentle Heart", text: "Selalu memberikan vibes yang lembut dan caring ke semua orang.", icon: "🌸" },
        { title: "Cozy Vibes", text: "Kehadiran yang bikin nyaman, seperti pelukan di hari yang dingin.", icon: "🧸" }
    ]
};

const darkState = {
    subtitle: "Night Owl Hanni 🌙",
    bubble: "Midnight vibes~",
    cards: [
        { title: "Moon Child", text: "Energi malam yang tenang, perfect untuk late night talks.", icon: "🌙" },
        { title: "Starlight", text: "Bersinar lembut di kegelapan, memberikan cahaya yang menenangkan.", icon: "⭐" },
        { title: "Dream Maker", text: "Menciptakan suasana yang peaceful dan dreamy di malam hari.", icon: "💫" }
    ]
};

let isPotatoMode = false;
let isDarkMode = false;

// ========================================
// DOM ELEMENTS
// ========================================
const body = document.body;
const modeBtn = document.getElementById('mode-btn');
const darkModeBtn = document.getElementById('dark-mode-btn');
const hanniImg = document.getElementById('hanni-img');
const heroSubtitle = document.getElementById('hero-subtitle');
const speechBubble = document.getElementById('speech-bubble');
const cards = [
    document.getElementById('card-1'),
    document.getElementById('card-2'),
    document.getElementById('card-3')
];

// ========================================
// COZY MODE TOGGLE
// ========================================
if (modeBtn) {
    modeBtn.addEventListener('click', () => {
        // Jika Dark Mode aktif, matikan dulu
        if (isDarkMode) {
            body.classList.remove('dark-mode');
            isDarkMode = false;
            darkModeBtn.innerText = "🌙 Dark";
        }

        // Toggle status Cozy
        isPotatoMode = !isPotatoMode;
        const currentState = isPotatoMode ? potatoState : normalState;

        // Update class & teks tombol
        if (isPotatoMode) {
            body.classList.add('potato-mode');
            modeBtn.innerText = "✨ Idol";
        } else {
            body.classList.remove('potato-mode');
            modeBtn.innerText = "💕 Cozy";
        }

        // Panggil fungsi update UI (tanpa duplikasi)
        updateUI(currentState);
    });
}

// ========================================
// UI UPDATE FUNCTION (untuk menghindari duplikasi)
// ========================================
function updateUI(state) {
    // Update subtitle
    if (heroSubtitle) heroSubtitle.innerText = state.subtitle;
    
    // Update speech bubble
    if (speechBubble) speechBubble.innerText = state.bubble;

    // Update 3 personality cards
    cards.forEach((card, index) => {
        if (!card) return;
        const data = state.cards[index];
        if (!data) return;
        
        const h3 = card.querySelector('h3');
        const p = card.querySelector('p');
        const icon = card.querySelector('.card-icon');
        
        if (h3) h3.innerText = data.title;
        if (p) p.innerText = data.text;
        if (icon) icon.innerText = data.icon;
    });
}

// ========================================
// DARK MODE TOGGLE
// ========================================
if (darkModeBtn) {
    darkModeBtn.addEventListener('click', () => {
        // Jika Cozy Mode aktif, matikan dulu
        if (isPotatoMode) {
            body.classList.remove('potato-mode');
            isPotatoMode = false;
            modeBtn.innerText = "💕 Cozy";
        }

        // Toggle status Dark
        isDarkMode = !isDarkMode;
        const currentState = isDarkMode ? darkState : normalState;

        // Update class & teks tombol
        if (isDarkMode) {
            body.classList.add('dark-mode');
            darkModeBtn.innerText = "☀️ Light";
        } else {
            body.classList.remove('dark-mode');
            darkModeBtn.innerText = "🌙 Dark";
        }

        // Panggil fungsi update UI (tanpa duplikasi)
        updateUI(currentState);
    });
}

// ========================================
// STICKER DECO AREA
// ========================================
const stickerCanvas = document.querySelector('.sticker-canvas');
const stickers = ["🎀", "🐰", "💖", "🧢", "✨", "💙", "🍞", "🔥", "⭐", "🌸"];

if(stickerCanvas) {
    stickerCanvas.addEventListener('click', (e) => {
        const rect = stickerCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const el = document.createElement('div');
        el.classList.add('sticker');
        el.innerText = stickers[Math.floor(Math.random() * stickers.length)];
        
        const randomRot = Math.random() * 40 - 20;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.transform = `rotate(${randomRot}deg)`;

        stickerCanvas.appendChild(el);

        // Limit stickers
        if (stickerCanvas.children.length > 25) {
            stickerCanvas.removeChild(stickerCanvas.children[1]); 
        }
    });
}

// ========================================
// PHOTO BOOTH
// ========================================
const photoFrame = document.getElementById('photo-frame');
const boothImg = document.getElementById('booth-img');
const frameOverlay = document.getElementById('frame-overlay');
const photoStickersContainer = document.getElementById('photo-stickers');

// Frame buttons
const frameBtns = document.querySelectorAll('.frame-btn');
frameBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        frameBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const frame = btn.getAttribute('data-frame');
        
        if (frameOverlay) {
            frameOverlay.className = 'frame-overlay';
            if (frame !== 'none') {
                frameOverlay.classList.add(`frame-${frame}`);
            }
        }
    });
});

// Filter buttons
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        if (boothImg) {
            boothImg.classList.remove('filter-vintage', 'filter-warm', 'filter-cool', 'filter-dream', 'filter-pastel', 'filter-mocha', 'filter-neon', 'filter-glow', 'filter-aesthetic');
            
            if (filter !== 'none') {
                boothImg.classList.add(`filter-${filter}`);
            }
        }
    });
});

// Make stickers draggable
function makeStickerDraggable(sticker) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    sticker.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    sticker.addEventListener('touchstart', dragStart, { passive: false });
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', dragEnd);

    function dragStart(e) {
        if (e.type === "touchstart") {
            e.preventDefault();
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }

        if (e.target === sticker) {
            isDragging = true;
            sticker.style.zIndex = 1000;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();

            if (e.type === "touchmove") {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }

            xOffset = currentX;
            yOffset = currentY;

            const rotation = sticker.style.getPropertyValue('--rot') || '0deg';
            setTranslate(currentX, currentY, sticker, rotation);
        }
    }

    function dragEnd(e) {
        if (isDragging) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
            sticker.style.zIndex = '';
        }
    }

    function setTranslate(xPos, yPos, el, rotation) {
        el.style.transform = `translate(${xPos}px, ${yPos}px) rotate(${rotation})`;
    }
}

// Add stickers to photo
const addStickerBtns = document.querySelectorAll('.add-sticker-btn');
addStickerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (!photoStickersContainer) return;
        
        const stickerText = btn.getAttribute('data-sticker');
        
        const sticker = document.createElement('div');
        sticker.className = 'photo-sticker';
        sticker.innerText = stickerText;
        
        const randomX = Math.random() * 70 + 10;
        const randomY = Math.random() * 70 + 10;
        const randomRot = Math.random() * 40 - 20;
        
        sticker.style.left = randomX + '%';
        sticker.style.top = randomY + '%';
        sticker.style.transform = `rotate(${randomRot}deg)`;
        sticker.style.setProperty('--rot', `${randomRot}deg`);
        
        photoStickersContainer.appendChild(sticker);
        makeStickerDraggable(sticker);
        
        btn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 200);
    });
});

// ========================================
// PHOTO BOOTH DOWNLOAD (OPTIMIZED + MOBILE FALLBACK)
// ========================================
const downloadPhotoBtn = document.getElementById('download-photo');
if (downloadPhotoBtn) {
    downloadPhotoBtn.addEventListener('click', async () => {
        const photoFrame = document.getElementById('photo-frame');
        if (!photoFrame) return alert('❌ Photo frame tidak ditemukan!');

        const originalText = downloadPhotoBtn.innerText;
        downloadPhotoBtn.innerText = "⏳ Processing...";
        downloadPhotoBtn.disabled = true;

        // ⚡ Smart scale berdasarkan device
        const isMobile = window.innerWidth < 768 || navigator.hardwareConcurrency <= 4;
        const renderScale = isMobile ? 2 : 3;
        const timeoutMs = isMobile ? 5000 : 8000;

        let timeoutId;
        const timeoutPromise = new Promise((_, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout: Render terlalu lama')), timeoutMs);
        });

        try {
            const canvas = await Promise.race([
                html2canvas(photoFrame, {
                    scale: renderScale,
                    useCORS: true,
                    allowTaint: false, // Lebih aman, hindari tainted canvas
                    backgroundColor: null,
                    logging: false,
                    windowWidth: photoFrame.offsetWidth,
                    windowHeight: photoFrame.offsetHeight,
                    onclone: (clonedDoc) => {
                        const clone = clonedDoc.getElementById('photo-frame');
                        if (clone) {
                            // 🧹 Strip CSS yang berat & sering bug di html2canvas
                            clone.style.transform = 'none';
                            clone.style.boxShadow = 'none';
                            clone.style.backdropFilter = 'none';
                            clone.style.webkitBackdropFilter = 'none';
                            clone.style.overflow = 'visible';
                            // Hapus animasi agar tidak freeze saat render
                            clone.querySelectorAll('*').forEach(el => el.style.animation = 'none');
                        }
                    }
                }),
                timeoutPromise
            ]);

            // Wrap toBlob dalam try-catch untuk tangkap SecurityError (CORS)
            try {
                canvas.toBlob((blob) => {
                    clearTimeout(timeoutId);
                    if (!blob) throw new Error('Blob generation failed');

                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `hanni-booth-${Date.now()}.png`;
                    document.body.appendChild(link);
                    link.click();
                    
                    setTimeout(() => {
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);
                    }, 100);

                    downloadPhotoBtn.innerText = "✅ Saved!";
                }, 'image/png', 0.9); // 0.9 lebih cepat, kualitas masih sangat baik
            } catch (blobErr) {
                throw new Error('Canvas tainted/CORS block');
            }
        } catch (error) {
            console.warn('⚠️ html2canvas fallback triggered:', error.message);
            showManualScreenshotGuide();
        } finally {
            downloadPhotoBtn.innerText = originalText;
            downloadPhotoBtn.disabled = false;
        }
    });

    function showManualScreenshotGuide() {
        const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const guide = isiOS 
            ? "📱 iOS: Tekan Power + Volume Up bersamaan" 
            : "📱 Android: Tekan Power + Volume Down bersamaan";
        
        alert(`⚠️ Auto-download dilewati (CORS/performa).\n\n${guide}\n💡 Tip: Pastikan foto sudah load penuh sebelum screenshot.`);
    }
}

// ========================================
// MUSIC PLAYER
// ========================================
const audio = document.getElementById('bg-music');
const playBtn = document.getElementById('play-pause-btn');
const visualizer = document.getElementById('visualizer');
const volumeSlider = document.getElementById('volume-slider');

let isPlaying = false;

function toggleMusic() {
    if (!audio) return; 

    if (isPlaying) {
        audio.pause();
        if (playBtn) playBtn.innerText = "▶";
        if (visualizer) visualizer.classList.remove('playing');
        isPlaying = false;
    } else {
        audio.play().then(() => {
            if (playBtn) playBtn.innerText = "⏸";
            if (visualizer) visualizer.classList.add('playing');
            isPlaying = true;
        }).catch(error => {
            console.log("Autoplay dicegah browser. Klik tombol play untuk mulai.");
        });
    }
}

if(playBtn) {
    playBtn.addEventListener('click', toggleMusic);
}

if(volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
        if(audio) audio.volume = e.target.value;
    });
}

// Auto-play on load (if browser allows)
window.addEventListener('load', () => {
    if(audio) {
        audio.volume = 0.5;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                if (playBtn) playBtn.innerText = "⏸";
                if (visualizer) visualizer.classList.add('playing');
                isPlaying = true;
            }).catch(error => {
                console.log("Menunggu interaksi user untuk play musik.");
            });
        }
    }
});

// ========================================
// OUTFIT SELECTOR
// ========================================
const outfitBtns = document.querySelectorAll('.outfit-btn');
const mainImg = document.getElementById('hanni-img');

outfitBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const newSrc = btn.getAttribute('data-img');
        if (!mainImg) return;

        // 🔥 Preload gambar terlebih dahulu
        const preloader = new Image();
        preloader.src = newSrc;
        
        preloader.onload = () => {
            // Saat gambar sudah siap, baru kita fade-in
            mainImg.style.opacity = "0";
            mainImg.style.transform = "scale(0.9)";
            
            setTimeout(() => {
                mainImg.src = newSrc;
                mainImg.style.opacity = "1";
                mainImg.style.transform = "scale(1)";
            }, 150);
        };

        // Jika gagal load (misal file hilang), tetap coba tampilkan
        preloader.onerror = () => {
            mainImg.src = newSrc;
        };
    });
});

// ========================================
// THEME SELECTOR
// ========================================
const themeModal = document.getElementById('theme-modal');
const themeSelectorBtn = document.getElementById('theme-selector-btn');
const closeModal = document.querySelector('.close-modal');
const themeCards = document.querySelectorAll('.theme-card');

if (themeSelectorBtn) {
    themeSelectorBtn.addEventListener('click', () => {
        if (themeModal) themeModal.style.display = 'block';
    });
}

if (closeModal) {
    closeModal.addEventListener('click', () => {
        if (themeModal) themeModal.style.display = 'none';
    });
}

window.addEventListener('click', (e) => {
    if (e.target === themeModal) {
        themeModal.style.display = 'none';
    }
});

themeCards.forEach(card => {
    card.addEventListener('click', () => {
        themeCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        
        const theme = card.getAttribute('data-theme');
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('hanniTheme', theme);
    });
});

// Load saved theme
const savedTheme = localStorage.getItem('hanniTheme');
if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
    themeCards.forEach(card => {
        if (card.getAttribute('data-theme') === savedTheme) {
            card.classList.add('active');
        }
    });
}

// ========================================
// MEMORY MATCH GAME
// ========================================
const memoryGrid = document.getElementById('memory-grid');
const startMemoryBtn = document.getElementById('start-memory-game');
const memoryMovesDisplay = document.getElementById('memory-moves');
const memoryTimeDisplay = document.getElementById('memory-time');

let memoryCards = ['🐰', '💕', '⭐', '🍞', '🎀', '💙', '🌸', '✨'];
let memoryDeck = [...memoryCards, ...memoryCards];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let memoryTimer = 0;
let memoryInterval = null;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createMemoryGame() {
    if (!memoryGrid) return;
    
    memoryGrid.innerHTML = '';
    memoryDeck = shuffleArray([...memoryCards, ...memoryCards]);
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    memoryTimer = 0;
    
    if (memoryMovesDisplay) memoryMovesDisplay.innerText = '0';
    if (memoryTimeDisplay) memoryTimeDisplay.innerText = '0';
    
    if (memoryInterval) clearInterval(memoryInterval);
    memoryInterval = setInterval(() => {
        memoryTimer++;
        if (memoryTimeDisplay) memoryTimeDisplay.innerText = memoryTimer;
    }, 1000);
    
    memoryDeck.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.index = index;
        card.dataset.symbol = symbol;
        card.innerText = '?';
        card.addEventListener('click', flipMemoryCard);
        memoryGrid.appendChild(card);
    });
}

function flipMemoryCard(e) {
    const card = e.target;
    
    if (flippedCards.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }
    
    card.classList.add('flipped');
    card.innerText = card.dataset.symbol;
    flippedCards.push(card);
    
    if (flippedCards.length === 2) {
        moves++;
        if (memoryMovesDisplay) memoryMovesDisplay.innerText = moves;
        
        setTimeout(() => {
            if (flippedCards[0].dataset.symbol === flippedCards[1].dataset.symbol) {
                flippedCards.forEach(c => c.classList.add('matched'));
                matchedPairs++;
                
                if (matchedPairs === memoryCards.length) {
                    if (memoryInterval) clearInterval(memoryInterval);
                    setTimeout(() => {
                        alert(`🎉 You won! Time: ${memoryTimer}s, Moves: ${moves}`);
                    }, 300);
                }
            } else {
                flippedCards.forEach(c => {
                    c.classList.remove('flipped');
                    c.innerText = '?';
                });
            }
            flippedCards = [];
        }, 800);
    }
}

if (startMemoryBtn) {
    startMemoryBtn.addEventListener('click', createMemoryGame);
}

// ========================================
// SLIDE PUZZLE GAME
// ========================================
const puzzleGrid = document.getElementById('puzzle-grid');
const startPuzzleBtn = document.getElementById('start-puzzle-game');
const puzzleMovesDisplay = document.getElementById('puzzle-moves');

let puzzleState = [1, 2, 3, 4, 5, 6, 7, 8, 0];
let puzzleMoves = 0;

function createPuzzle() {
    if (!puzzleGrid) return;
    
    puzzleGrid.innerHTML = '';
    puzzleMoves = 0;
    if (puzzleMovesDisplay) puzzleMovesDisplay.innerText = '0';
    
    // Shuffle
    for (let i = 0; i < 100; i++) {
        const emptyIndex = puzzleState.indexOf(0);
        const possibleMoves = getPossibleMoves(emptyIndex);
        const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        [puzzleState[emptyIndex], puzzleState[randomMove]] = [puzzleState[randomMove], puzzleState[emptyIndex]];
    }
    
    renderPuzzle();
}

function getPossibleMoves(emptyIndex) {
    const moves = [];
    const row = Math.floor(emptyIndex / 3);
    const col = emptyIndex % 3;
    
    if (row > 0) moves.push(emptyIndex - 3);
    if (row < 2) moves.push(emptyIndex + 3);
    if (col > 0) moves.push(emptyIndex - 1);
    if (col < 2) moves.push(emptyIndex + 1);
    
    return moves;
}

function renderPuzzle() {
    if (!puzzleGrid) return;
    
    puzzleGrid.innerHTML = '';
    
    puzzleState.forEach((num, index) => {
        const tile = document.createElement('div');
        tile.className = num === 0 ? 'puzzle-tile empty' : 'puzzle-tile';
        tile.innerText = num === 0 ? '' : num;
        tile.dataset.index = index;
        
        if (num !== 0) {
            tile.addEventListener('click', () => movePuzzleTile(index));
        }
        
        puzzleGrid.appendChild(tile);
    });
}

function movePuzzleTile(tileIndex) {
    const emptyIndex = puzzleState.indexOf(0);
    const possibleMoves = getPossibleMoves(emptyIndex);
    
    if (possibleMoves.includes(tileIndex)) {
        [puzzleState[emptyIndex], puzzleState[tileIndex]] = [puzzleState[tileIndex], puzzleState[emptyIndex]];
        puzzleMoves++;
        if (puzzleMovesDisplay) puzzleMovesDisplay.innerText = puzzleMoves;
        renderPuzzle();
        
        const solved = puzzleState.every((num, idx) => num === idx + 1 || (idx === 8 && num === 0));
        if (solved) {
            setTimeout(() => {
                alert(`🎉 Puzzle solved in ${puzzleMoves} moves!`);
            }, 300);
        }
    }
}

if (startPuzzleBtn) {
    startPuzzleBtn.addEventListener('click', createPuzzle);
}

// ========================================
// BUNNY HOP GAME (CANVAS)
// ========================================
const bunnyCanvas = document.getElementById('bunny-game');
const startBunnyBtn = document.getElementById('start-bunny-game');
const bunnyScoreDisplay = document.getElementById('bunny-score');
const bunnyHighScoreDisplay = document.getElementById('bunny-high-score');

let bunnyGame = null;
let bunnyScore = 0;
let bunnyHighScore = localStorage.getItem('bunnyHighScore') || 0;

if (bunnyHighScoreDisplay) {
    bunnyHighScoreDisplay.innerText = bunnyHighScore;
}

function initBunnyGame() {
    if (!bunnyCanvas) return;
    
    const ctx = bunnyCanvas.getContext('2d');
    const canvasWidth = bunnyCanvas.width;
    const canvasHeight = bunnyCanvas.height;
    
    // Game state
    let isPlaying = false;
    let bunny = { x: 50, y: canvasHeight - 80, width: 40, height: 40, dy: 0, jumping: false };
    let obstacles = [];
    let gameLoop = null;
    let obstacleTimer = null;
    
    function drawBunny() {
        // Draw bunny body
        ctx.fillStyle = '#FFB6C1';
        ctx.fillRect(bunny.x, bunny.y, bunny.width, bunny.height);
        
        // Draw bunny ears
        ctx.fillStyle = '#FF69B4';
        ctx.fillRect(bunny.x + 5, bunny.y - 15, 10, 20);
        ctx.fillRect(bunny.x + 25, bunny.y - 15, 10, 20);
        
        // Draw bunny face
        ctx.fillStyle = '#000';
        ctx.fillRect(bunny.x + 10, bunny.y + 10, 5, 5);
        ctx.fillRect(bunny.x + 25, bunny.y + 10, 5, 5);
        ctx.fillRect(bunny.x + 15, bunny.y + 20, 10, 5);
    }
    
    function drawObstacles() {
        ctx.fillStyle = '#8B4513';
        obstacles.forEach(obs => {
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        });
    }
    
    function drawGround() {
        ctx.fillStyle = '#228B22';
        ctx.fillRect(0, canvasHeight - 40, canvasWidth, 40);
        
        // Grass details
        ctx.fillStyle = '#32CD32';
        for (let i = 0; i < canvasWidth; i += 20) {
            ctx.fillRect(i, canvasHeight - 45, 3, 10);
        }
    }
    
    function drawBackground() {
        // Sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.5, '#E0F6FF');
        gradient.addColorStop(0.5, '#90EE90');
        gradient.addColorStop(1, '#228B22');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }
    
    function update() {
        // Apply gravity
        if (bunny.jumping) {
            bunny.y += bunny.dy;
            bunny.dy += 0.8;
            
            if (bunny.y >= canvasHeight - 80) {
                bunny.y = canvasHeight - 80;
                bunny.jumping = false;
                bunny.dy = 0;
            }
        }
        
        // Move obstacles
        obstacles.forEach((obs, index) => {
            obs.x -= obs.speed;
            
            // Remove off-screen obstacles
            if (obs.x + obs.width < 0) {
                obstacles.splice(index, 1);
                bunnyScore++;
                if (bunnyScoreDisplay) bunnyScoreDisplay.innerText = bunnyScore;
            }
            
            // Collision detection
            if (bunny.x < obs.x + obs.width &&
                bunny.x + bunny.width > obs.x &&
                bunny.y < obs.y + obs.height &&
                bunny.y + bunny.height > obs.y) {
                gameOver();
            }
        });
    }
    
    function draw() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawBackground();
        drawGround();
        drawObstacles();
        drawBunny();
    }
    
    function gameLoop_fn() {
        if (!isPlaying) return;
        update();
        draw();
        gameLoop = requestAnimationFrame(gameLoop_fn);
    }
    
    function spawnObstacle() {
        if (!isPlaying) return;
        
        const height = Math.random() * 30 + 30;
        obstacles.push({
            x: canvasWidth,
            y: canvasHeight - 40 - height,
            width: 30,
            height: height,
            speed: Math.min(8, 3 + Math.floor(bunnyScore / 10))
        });
        
        obstacleTimer = setTimeout(spawnObstacle, 2000 - Math.min(1000, bunnyScore * 50));
    }
    
    function jump() {
        if (!bunny.jumping && isPlaying) {
            bunny.jumping = true;
            bunny.dy = -15;
        }
    }
    
    function gameOver() {
        isPlaying = false;
        cancelAnimationFrame(gameLoop);
        clearTimeout(obstacleTimer);
        
        // Update high score
        if (bunnyScore > bunnyHighScore) {
            bunnyHighScore = bunnyScore;
            localStorage.setItem('bunnyHighScore', bunnyHighScore);
            if (bunnyHighScoreDisplay) bunnyHighScoreDisplay.innerText = bunnyHighScore;
        }
        
        alert(`Game Over! Score: ${bunnyScore}`);
    }
    
    function startGame() {
        if (isPlaying) return;
        
        isPlaying = true;
        bunnyScore = 0;
        if (bunnyScoreDisplay) bunnyScoreDisplay.innerText = '0';
        obstacles = [];
        bunny.y = canvasHeight - 80;
        bunny.jumping = false;
        bunny.dy = 0;
        
        gameLoop_fn();
        spawnObstacle();
    }
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && isPlaying) {
            e.preventDefault();
            jump();
        }
    });
    
    // Touch controls for mobile
    bunnyCanvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (isPlaying) {
            jump();
        }
    });
    
    bunnyCanvas.addEventListener('click', () => {
        if (isPlaying) {
            jump();
        }
    });
    
    // Initial draw
    drawBackground();
    drawGround();
    drawBunny();
    
    // Return start function
    return startGame;
}

// Initialize bunny game
if (bunnyCanvas) {
    bunnyGame = initBunnyGame();
}

if (startBunnyBtn && bunnyGame) {
    startBunnyBtn.addEventListener('click', bunnyGame);
}

// ========================================
// NAVBAR SCROLL BEHAVIOR
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    
    if (!navbar) return;

    let lastScrollTop = 0;
    const scrollThreshold = 50;

    const handleNavbarScroll = throttle(function() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScroll > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }, 100);

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    navbar.classList.add('show');
    
    // Observe lazy load images
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        observer.observe(img);
    });
});

// Performance logging (dev only)
if (!isMobile && location.hostname === 'localhost') {
    console.log(`🚀 Performance mode: ${isLowEnd ? 'Low-end' : isMobile ? 'Mobile' : 'Desktop'}`);
    console.log(`✨ Particles count: ${particleCount}`);
}


// Monitor performance and auto-adjust
if (isMobile && 'PerformanceObserver' in window) {
    try {
        const perfObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                // If frame takes too long (>16ms = <60fps), reduce quality
                if (entry.duration > 16 && document.body.classList.contains('dark-mode')) {
                    // Auto-disable particles if performance is bad
                    const particles = document.getElementById('particles');
                    if (particles) {
                        particles.style.display = 'none';
                    }
                }
            }
        });
        
        perfObserver.observe({ entryTypes: ['measure'] });
    } catch (e) {
        console.log('Performance monitoring not available');
    }
}

// ========================================
// HILANGKAN LOADING SCREEN SETELAH SEMUA SIAP
// ========================================
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 400); // Kasih jeda 0.4 detik biar transisi halus
    }
});

// ========================================
// CLEAR STICKERS BUTTON
// ========================================
const clearStickersBtn = document.getElementById('clear-stickers-btn');
if (clearStickersBtn) {
    clearStickersBtn.addEventListener('click', () => {
        const canvas = document.querySelector('.sticker-canvas');
        if (!canvas) return;

        // Hapus semua elemen dengan class 'sticker' di dalam canvas
        const stickers = canvas.querySelectorAll('.sticker');
        stickers.forEach(el => el.remove());

        // Kasih efek feedback sebentar
        clearStickersBtn.textContent = '✅ Bersih!';
        setTimeout(() => {
            clearStickersBtn.textContent = '🧹 Bersihkan Stiker';
        }, 1000);
    });
}