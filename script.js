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
            // Add visible class for scroll animations
            if (element.classList.contains('animate-on-scroll')) {
                element.classList.add('visible');
                // Optional: unobserve after animation for performance
                // observer.unobserve(element);
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
    badge: { icon: "🐰", text: "Vibing" },
    cards: [
        { title: "Viet-Aussie", text: "Iconic Australian accent & multilingual genius.", icon: "🇦🇺" },
        { title: "Honey Voice", text: "Sweet voice like honey & swag dance moves.", icon: "🎤" },
        { title: "Bread Lover", text: "Obsessed with bread. Bread is life.", icon: "🥖" }
    ]
};

const potatoState = {
    subtitle: "Soft & Cozy Hanni 💕",
    badge: { icon: "🧸", text: "Cozy" },
    cards: [
        { title: "Sweet Soul", text: "Warm and calming personality like a cup of tea.", icon: "🫖" },
        { title: "Gentle Heart", text: "Always giving soft and caring vibes to everyone.", icon: "🌸" },
        { title: "Cozy Vibes", text: "A comforting presence like a hug on a cold day.", icon: "🧸" }
    ]
};

const darkState = {
    subtitle: "Night Owl Hanni 🌙",
    badge: { icon: "🌙", text: "Dreaming" },
    cards: [
        { title: "Moon Child", text: "Calm night energy, perfect for late night talks.", icon: "🌙" },
        { title: "Starlight", text: "Shining softly in the darkness, a soothing light.", icon: "⭐" },
        { title: "Dream Maker", text: "Creating peaceful and dreamy vibes at night.", icon: "💫" }
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
const statusBadge = document.getElementById('status-badge');
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
        // If Dark Mode is active, disable it first
        if (isDarkMode) {
            body.classList.remove('dark-mode');
            isDarkMode = false;
            darkModeBtn.innerText = "🌙 Dark";
        }

        // Toggle Cozy status
        isPotatoMode = !isPotatoMode;
        const currentState = isPotatoMode ? potatoState : normalState;

        // Update class & button text
        if (isPotatoMode) {
            body.classList.add('potato-mode');
            modeBtn.innerText = "✨ default";
        } else {
            body.classList.remove('potato-mode');
            modeBtn.innerText = "💕 Cozy";
        }

        // Call UI update function (avoid duplication)
        updateUI(currentState);
    });
}

// ========================================
// UI UPDATE FUNCTION (avoid duplication)
// ========================================
function updateUI(state) {
    // Update subtitle
    if (heroSubtitle) heroSubtitle.innerText = state.subtitle;
    
    // Update status badge
    if (statusBadge && state.badge) {
        const icon = statusBadge.querySelector('.status-icon');
        const text = statusBadge.querySelector('.status-text');
        if (icon) icon.innerText = state.badge.icon;
        if (text) text.innerText = state.badge.text;
    }

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
        // If Cozy Mode is active, disable it first
        if (isPotatoMode) {
            body.classList.remove('potato-mode');
            isPotatoMode = false;
            modeBtn.innerText = "💕 Cozy";
        }

        // Toggle Dark status
        isDarkMode = !isDarkMode;
        const currentState = isDarkMode ? darkState : normalState;

        // Update class & button text
        if (isDarkMode) {
            body.classList.add('dark-mode');
            darkModeBtn.innerText = "☀️ Light";
        } else {
            body.classList.remove('dark-mode');
            darkModeBtn.innerText = "🌙 Dark";
        }

        // Call UI update function (avoid duplication)
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

// ========================================
// PHOTO NAVIGATION (Arrow Buttons)
// ========================================
const photoList = [
    'assets/img/home.jpg',
    'assets/img/default.jpg',
    'assets/img/hanni.jpg',
    'assets/img/hn22.jpg',
];
let currentPhotoIndex = 0;

const prevBtn = document.getElementById('photo-prev-btn');
const nextBtn = document.getElementById('photo-next-btn');

function changePhoto(index) {
    if (!boothImg) return;
    // Loop indeks
    if (index < 0) index = photoList.length - 1;
    if (index >= photoList.length) index = 0;
    currentPhotoIndex = index;

    // Efek fade
    boothImg.style.opacity = '0';
    setTimeout(() => {
        boothImg.src = photoList[currentPhotoIndex];
        boothImg.style.opacity = '1';
    }, 200);
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        changePhoto(currentPhotoIndex - 1);
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        changePhoto(currentPhotoIndex + 1);
    });
}

// (Opsional) Keyboard support: panah kiri/kanan
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        changePhoto(currentPhotoIndex - 1);
        e.preventDefault();
    } else if (e.key === 'ArrowRight') {
        changePhoto(currentPhotoIndex + 1);
        e.preventDefault();
    }
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
// PHOTO BOOTH DOWNLOAD
// ========================================
const downloadPhotoBtn = document.getElementById('download-photo');
if (downloadPhotoBtn) {
    downloadPhotoBtn.addEventListener('click', async () => {
        const photoFrame = document.getElementById('photo-frame');
        if (!photoFrame) {
            showToast('❌ Frame not found!', 'error');
            return;
        }

        const originalText = downloadPhotoBtn.innerText;
        downloadPhotoBtn.innerText = "⏳ Processing...";
        downloadPhotoBtn.disabled = true;

        try {
            const canvas = await html2canvas(photoFrame, {
                scale: 2,
                useCORS: true,
                backgroundColor: null,
                logging: false,
            });

            canvas.toBlob((blob) => {
                if (!blob) throw new Error('Failed to create blob');
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `hanni-booth-${Date.now()}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                showToast('📸 Photo saved successfully!', 'success');
            }, 'image/png');
        } catch (error) {
            console.error(error);
            showToast('❌ Failed to save. Try manual screenshot.', 'error');
        } finally {
            downloadPhotoBtn.innerText = originalText;
            downloadPhotoBtn.disabled = false;
        }
    });
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
        
        // Update status badge back to default
        updateStatusBadge(false);
        isPlaying = false;
    } else {
        audio.play().then(() => {
            if (playBtn) playBtn.innerText = "⏸";
            if (visualizer) visualizer.classList.add('playing');
            
            // Update status badge to playing
            updateStatusBadge(true);
            isPlaying = true;
        }).catch(error => {
            console.log("Autoplay prevented by browser. Click play button to start.");
        });
    }
}

// Function to update status badge based on music state
function updateStatusBadge(isPlaying) {
    if (!statusBadge) return;
    
    const icon = statusBadge.querySelector('.status-icon');
    const text = statusBadge.querySelector('.status-text');
    
    if (isPlaying) {
        statusBadge.classList.add('playing');
        if (icon) icon.innerText = "🎵";
        if (text) text.innerText = "Playing music";
    } else {
        statusBadge.classList.remove('playing');
        // Restore based on current mode
        if (isPotatoMode) {
            if (icon) icon.innerText = potatoState.badge.icon;
            if (text) text.innerText = potatoState.badge.text;
        } else if (isDarkMode) {
            if (icon) icon.innerText = darkState.badge.icon;
            if (text) text.innerText = darkState.badge.text;
        } else {
            if (icon) icon.innerText = normalState.badge.icon;
            if (text) text.innerText = normalState.badge.text;
        }
    }
}

// Random status updates (cute feature!)
const randomStatuses = [
    { icon: "🥖", text: "Bread time" },
    { icon: "✨", text: "Shining" },
    { icon: "💕", text: "Happy" },
    { icon: "🐰", text: "Bunny mode" },
    { icon: "🎤", text: "Singing" },
    { icon: "😊", text: "Smiling" }
];

let statusInterval = null;

function startRandomStatus() {
    // Only change status if music is not playing
    statusInterval = setInterval(() => {
        if (!isPlaying && statusBadge) {
            const randomStatus = randomStatuses[Math.floor(Math.random() * randomStatuses.length)];
            const icon = statusBadge.querySelector('.status-icon');
            const text = statusBadge.querySelector('.status-text');
            
            if (icon) icon.innerText = randomStatus.icon;
            if (text) text.innerText = randomStatus.text;
            
            // Return to normal after 3 seconds
            setTimeout(() => {
                if (!isPlaying) {
                    updateStatusBadge(false);
                }
            }, 3000);
        }
    }, 15000); // Change every 15 seconds
}

// Start random status on load (optional, you can disable this)
if (!isMobile) {
    window.addEventListener('load', () => {
        setTimeout(startRandomStatus, 5000); // Start after 5 seconds
    });
}

// Click interaction on status badge (fun feature!)
if (statusBadge) {
    statusBadge.addEventListener('click', () => {
        const icon = statusBadge.querySelector('.status-icon');
        const text = statusBadge.querySelector('.status-text');
        
        // Cycle through cute reactions
        const reactions = [
            { icon: "🐰", text: "Bunny!" },
            { icon: "🥖", text: "Bread!" },
            { icon: "😊", text: "Hehe~" },
            { icon: "💕", text: "Love u!" },
            { icon: "✨", text: "Sparkle!" }
        ];
        
        const reaction = reactions[Math.floor(Math.random() * reactions.length)];
        
        if (icon) icon.innerText = reaction.icon;
        if (text) text.innerText = reaction.text;
        
        // Add bounce effect
        statusBadge.style.transform = 'scale(1.15)';
        setTimeout(() => {
            statusBadge.style.transform = '';
        }, 200);
        
        // Return to normal after 2 seconds
        setTimeout(() => {
            if (!isPlaying) {
                updateStatusBadge(false);
            }
        }, 2000);
    });
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
                updateStatusBadge(true); // Update status badge
                isPlaying = true;
            }).catch(error => {
                console.log("Waiting for user interaction to play music.");
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

        // 🔥 Preload image first
        const preloader = new Image();
        preloader.src = newSrc;
        
        preloader.onload = () => {
            // Once image is ready, fade in
            mainImg.style.opacity = "0";
            mainImg.style.transform = "scale(0.9)";
            
            setTimeout(() => {
                mainImg.src = newSrc;
                mainImg.style.opacity = "1";
                mainImg.style.transform = "scale(1)";
            }, 150);
        };

        // If load fails (e.g., file missing), still try to display
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
// HANNI'S PLAYLIST
// ========================================
const playlistData = [
    { title: "Right Here Waiting", artist: "Richard Marx", emoji: "⭐" },
    { title: "clementine cover by Hanni", artist: "Hanni", emoji: "🧸" },
    { title: "Soft", artist: "Lany", emoji: "🌷" },
    { title: "pink", artist: "wave to earth", emoji: "🌸" },
    { title: "favorite lesson", artist: "yaeow", emoji: "👀" },
];

const playlistGrid = document.getElementById('playlist-grid');

if (playlistGrid) {
    playlistGrid.innerHTML = '';
    playlistData.forEach((song, index) => {
        const item = document.createElement('div');
        item.className = 'playlist-item animate-on-scroll';
        item.style.animationDelay = `${index * 0.1}s`;
        item.innerHTML = `
            <span class="playlist-num">${String(index + 1).padStart(2, '0')}</span>
            <span class="playlist-title">${song.title}</span>
            <span class="playlist-artist">${song.artist}</span>
            <span class="playlist-emoji">${song.emoji}</span>
        `;
        playlistGrid.appendChild(item);
        
        // Observe the newly created item
        if (observer) {
            observer.observe(item);
        }
    });
}

// ========================================
// DRAGGABLE BUBBLE — COMEBACK
// ========================================
(function() {
    const bubble = document.getElementById('comeback-bubble');
    if (!bubble) return;

    // State
    let isDragging = false;
    let startX, startY, startLeft, startTop;
    let offsetX = 0, offsetY = 0;
    const storageKey = 'bubblePosition';

    // --- Load saved position ---
    function loadPosition() {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const pos = JSON.parse(saved);
                // Pastikan posisi valid (tidak keluar viewport)
                const maxX = window.innerWidth - bubble.offsetWidth;
                const maxY = window.innerHeight - bubble.offsetHeight;
                const left = Math.max(0, Math.min(pos.left, maxX));
                const top = Math.max(0, Math.min(pos.top, maxY));
                bubble.style.left = left + 'px';
                bubble.style.top = top + 'px';
                bubble.style.right = 'auto';
                bubble.style.bottom = 'auto';
                return true;
            }
        } catch (e) { /* ignore */ }
        return false;
    }

    // Jika tidak ada posisi tersimpan, tetap pakai default (right: 30px; bottom: 30px;)
    const hasSaved = loadPosition();

    // --- Save position ---
    function savePosition(left, top) {
        try {
            localStorage.setItem(storageKey, JSON.stringify({ left, top }));
        } catch (e) { /* ignore */ }
    }

    // --- Boundary clamping ---
    function clampPosition(left, top) {
        const maxX = window.innerWidth - bubble.offsetWidth;
        const maxY = window.innerHeight - bubble.offsetHeight;
        return {
            left: Math.max(0, Math.min(left, maxX)),
            top: Math.max(0, Math.min(top, maxY))
        };
    }

    // --- Drag Start ---
    function onDragStart(e) {
        // Cegah jika klik pada link atau button di dalam bubble (tidak ada di sini, tapi jaga-jaga)
        if (e.target.closest('a, button')) return;

        isDragging = true;
        bubble.classList.add('dragging');

        // Ambil posisi awal
        const rect = bubble.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;

        if (e.type === 'mousedown') {
            startX = e.clientX;
            startY = e.clientY;
        } else if (e.type === 'touchstart') {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }

        // Simpan offset untuk menghindari lompatan
        offsetX = startX - startLeft;
        offsetY = startY - startTop;

        // Pastikan bubble menggunakan left/top
        bubble.style.right = 'auto';
        bubble.style.bottom = 'auto';
        bubble.style.left = startLeft + 'px';
        bubble.style.top = startTop + 'px';

        e.preventDefault();
    }

    // --- Drag Move ---
    function onDragMove(e) {
        if (!isDragging) return;

        let clientX, clientY;
        if (e.type === 'mousemove') {
            clientX = e.clientX;
            clientY = e.clientY;
        } else if (e.type === 'touchmove') {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }

        let newLeft = clientX - offsetX;
        let newTop = clientY - offsetY;

        // Clamp ke viewport
        const clamped = clampPosition(newLeft, newTop);
        bubble.style.left = clamped.left + 'px';
        bubble.style.top = clamped.top + 'px';

        e.preventDefault();
    }

    // --- Drag End ---
    function onDragEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        bubble.classList.remove('dragging');

        // Simpan posisi akhir
        const rect = bubble.getBoundingClientRect();
        savePosition(rect.left, rect.top);

        // Kembalikan animasi float (dengan jeda kecil)
        setTimeout(() => {
            bubble.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        }, 50);
    }

    // --- Window resize: adjust position agar tetap di viewport ---
    function onResize() {
        const rect = bubble.getBoundingClientRect();
        const maxX = window.innerWidth - bubble.offsetWidth;
        const maxY = window.innerHeight - bubble.offsetHeight;
        let newLeft = Math.max(0, Math.min(rect.left, maxX));
        let newTop = Math.max(0, Math.min(rect.top, maxY));
        if (newLeft !== rect.left || newTop !== rect.top) {
            bubble.style.left = newLeft + 'px';
            bubble.style.top = newTop + 'px';
            savePosition(newLeft, newTop);
        }
    }

    // --- Event Listeners ---
    // Desktop (Mouse)
    bubble.addEventListener('mousedown', onDragStart);
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);

    // Mobile (Touch)
    bubble.addEventListener('touchstart', onDragStart, { passive: false });
    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('touchend', onDragEnd, { passive: false });

    // Window resize
    window.addEventListener('resize', onResize);

    // Cleanup (optional, untuk mencegah memory leak)
    // Tidak diperlukan untuk fanpage, tapi bagus jika ada.
})();

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
    
    // Observe elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
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
// LOADING SCREEN + CREDIT CRAFTED BY FERI
// ========================================
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingText = loadingScreen?.querySelector('p');
    const spinner = loadingScreen?.querySelector('.spinner');

    if (loadingScreen && loadingText) {
        // Tunggu sebentar agar loading awal terlihat
        setTimeout(() => {
            // Sembunyikan spinner
            if (spinner) {
                spinner.style.display = 'none';
            }

            // Change loading text to credit
            loadingText.textContent = '✨ Crafted by Feri';
            
            // Smooth fade-in effect for text
            loadingText.style.transition = 'opacity 0.5s ease';
            loadingText.style.opacity = '0';
            setTimeout(() => {
                loadingText.style.opacity = '1';
            }, 50);

            // Setelah 1.5 detik, hilangkan seluruh loading screen
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 2900);
        }, 3180); // Jeda 900ms agar loading awal terlihat sebentar
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

        // Remove all elements with class 'sticker' inside canvas
        const stickers = canvas.querySelectorAll('.sticker');
        stickers.forEach(el => el.remove());

        showToast('🧹 All stickers have been removed!', 'info');
        // Kasih efek feedback sebentar
        clearStickersBtn.textContent = '✅ Cleaned!';
        setTimeout(() => {
            clearStickersBtn.textContent = 'Clear All Stickers';
        }, 1000);
    });
}

// ========================================
// CLEAR PHOTO STICKERS BUTTON
// ========================================
const clearPhotoStickersBtn = document.getElementById('clear-photo-stickers-btn');
if (clearPhotoStickersBtn) {
    clearPhotoStickersBtn.addEventListener('click', () => {
        const container = document.getElementById('photo-stickers');
        if (!container) return;

        // Remove all elements inside photo-stickers
        const stickers = container.querySelectorAll('.photo-sticker');
        stickers.forEach(el => el.remove());

        showToast('🧹 All stickers have been removed!', 'info');
        // Feedback tombol sebentar
        clearPhotoStickersBtn.textContent = '✅ Cleaned!';
        setTimeout(() => {
            clearPhotoStickersBtn.textContent = 'Clear All Stickers';
        }, 1000);
    });
}

// ========================================
// TOAST NOTIFICATION SYSTEM
// ========================================
function showToast(message, type = 'info') {
    // Remove old toast if exists
    const oldToast = document.querySelector('.custom-toast');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.className = `custom-toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger appearance with slight delay for transition
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Disappear after 1.8 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 1800);
}