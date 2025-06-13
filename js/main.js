// ====================================
// POST APOCALYPTIC OS - COMPLETE JS
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const bootBeep = document.getElementById('boot-beep');
    const macChime = document.getElementById('mac-chime');
    const bootScreen = document.getElementById('boot-screen');
    const startOverlay = document.getElementById('start-overlay');
    const startButton = document.getElementById('start-button');
    const crtBgContainer = document.getElementById('crt-bg-container');
    const qrContainer = document.getElementById('qr-container');
    const captchaContainer = document.getElementById('captcha-container');
    const buddyFolderUI = document.getElementById('buddy-folder-ui');
    const buddyWindows = document.getElementById('buddy-windows');
    
    // Drag elements
    const draggableZuck = document.getElementById('draggable-zuck');
    const dropTarget = document.getElementById('drop-target');
    
    // State variables
    let currentZuckMusic = null;
    let animationInterval = null;
    let windowZIndex = 11000;
    let touchItem = null;
    let touchOffset = { x: 0, y: 0 };
    
    // Audio setup
    const zuckSounds = [
        new Audio('./assets/zuck2.mp3'),
        new Audio('./assets/zuck3.mp3'),
        new Audio('./assets/humanzuck.mp3')
    ];
    const windowOpenSound = new Audio('./assets/windowopen.wav');
    const windowCloseSound = new Audio('./assets/windowclose.wav');
    const zuckFailSound = new Audio('./assets/zuckfail.wav');
    
    // ============================
    // INITIALIZATION
    // ============================
    
    function init() {
        preloadAssets();
        setupAudioErrorHandling();
        setupEventListeners();
    }
    
    function preloadAssets() {
        const assets = {
            images: [
                './assets/bud-hot.gif',
                './assets/bud-info.gif',
                './assets/bud-online.gif',
                './assets/bud-special.gif',
                './assets/bud-adhd.gif',
                './assets/bud-pissed.gif',
                './assets/qr.jpg',
                './assets/zuck.png',
                './assets/opentrash.png',
                './assets/closetrash.png',
                './assets/open_bg.jpg',
                './assets/bg_crt.jpg'
            ],
            videos: ['./assets/pasf_trailer.MOV']
        };
        
        // Preload images
        assets.images.forEach(src => {
            const img = new Image();
            img.onerror = () => console.warn(`Failed to preload image: ${src}`);
            img.src = src;
        });
        
        // Preload video
        const video = document.createElement('video');
        video.src = assets.videos[0];
        video.preload = 'metadata';
    }
    
    function setupAudioErrorHandling() {
        const allAudio = [...zuckSounds, windowOpenSound, windowCloseSound, zuckFailSound];
        allAudio.forEach(audio => {
            audio.addEventListener('error', () => {
                console.warn(`Failed to load audio: ${audio.src}`);
            });
            audio.load();
        });
    }
    
    function setupEventListeners() {
        // Start button
        startButton.addEventListener('click', handleStartClick);
        
        // Drag and drop - Desktop
        setupDesktopDragDrop();
        
        // Drag and drop - Mobile
        setupMobileDragDrop();
    }
    
    // ============================
    // START SEQUENCE
    // ============================
    function handleStartClick() {
        // Button multiplication effect
        createButtonClones();
        
        // Hide start overlay
        startOverlay.style.display = 'none';
        
        // Hide boot screen - ADD THIS LINE
        bootScreen.style.display = 'none';
        
        // Start Zuck music
        currentZuckMusic = getRandomZuckMusic();
        playAudio(currentZuckMusic);
        
        // Show CAPTCHA
        captchaContainer.classList.remove('hidden');
        
        // Start Zuck bouncing animation
        startBouncingAnimation();
    }
    function createButtonClones() {
        for (let i = 0; i < 100; i++) {
            const clone = startButton.cloneNode(true);
            clone.style.position = 'absolute';
            clone.style.left = `${Math.random() * window.innerWidth}px`;
            clone.style.top = `${Math.random() * window.innerHeight}px`;
            clone.style.opacity = '0.7';
            clone.style.pointerEvents = 'none';
            clone.style.zIndex = '29999';
            document.body.appendChild(clone);
            
            setTimeout(() => {
                clone.style.transition = 'all 1s ease';
                clone.style.transform = `translate(${Math.random() * 500 - 250}px, ${Math.random() * 500 - 250}px)`;
                clone.style.opacity = '0';
            }, 50);
            
            setTimeout(() => clone.remove(), 2000);
        }
    }
    
    function getRandomZuckMusic() {
        return zuckSounds[Math.floor(Math.random() * zuckSounds.length)];
    }
    
    function playAudio(audio) {
        if (audio && audio.paused) {
            audio.play().catch(() => {
                console.warn('Audio playback blocked');
            });
        }
    }
    
    // ============================
    // DRAG AND DROP - DESKTOP
    // ============================
    
    function setupDesktopDragDrop() {
        draggableZuck.addEventListener('dragstart', handleDragStart);
        dropTarget.addEventListener('dragover', handleDragOver);
        dropTarget.addEventListener('dragleave', handleDragLeave);
        document.addEventListener('dragover', (e) => e.preventDefault());
        document.addEventListener('drop', handleDrop);
    }
    
    function handleDragStart(e) {
        clearInterval(animationInterval);
        draggableZuck.classList.add('dragging');
        e.dataTransfer.setData('text/plain', 'zuck');
    }
    
    function handleDragOver(e) {
        e.preventDefault();
        dropTarget.style.backgroundColor = '#d0ffd0';
    }
    
    function handleDragLeave() {
        dropTarget.style.backgroundColor = '';
    }
    
    function handleDrop(e) {
        e.preventDefault();
        
        const isInsideDropZone = dropTarget.contains(e.target);
        
        if (isInsideDropZone) {
            handleSuccessfulDrop(e.clientX, e.clientY);
        } else {
            handleFailedDrop(e.clientX, e.clientY);
        }
        
        draggableZuck.classList.remove('dragging');
        dropTarget.style.backgroundColor = '';
    }
    
    // ============================
    // DRAG AND DROP - MOBILE
    // ============================
    
    function setupMobileDragDrop() {
        draggableZuck.addEventListener('touchstart', handleTouchStart, { passive: false });
        draggableZuck.addEventListener('touchmove', handleTouchMove, { passive: false });
        draggableZuck.addEventListener('touchend', handleTouchEnd, { passive: false });
    }
    
    function handleTouchStart(e) {
        e.preventDefault();
        clearInterval(animationInterval);
        
        const touch = e.touches[0];
        const rect = draggableZuck.getBoundingClientRect();
        
        touchItem = draggableZuck;
        touchOffset.x = touch.clientX - rect.left;
        touchOffset.y = touch.clientY - rect.top;
        
        draggableZuck.style.position = 'fixed';
        draggableZuck.style.zIndex = '21000';
        draggableZuck.classList.add('dragging');
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        createTrailEffect(draggableZuck);
    }
    
    function handleTouchMove(e) {
        if (!touchItem) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        touchItem.style.left = `${touch.clientX - touchOffset.x}px`;
        touchItem.style.top = `${touch.clientY - touchOffset.y}px`;
        
        // Check if over drop zone
        const dropRect = dropTarget.getBoundingClientRect();
        const itemRect = touchItem.getBoundingClientRect();
        
        const isOverDropZone = rectsOverlap(itemRect, dropRect);
        dropTarget.style.backgroundColor = isOverDropZone ? '#d0ffd0' : '';
    }
    
    function handleTouchEnd(e) {
        if (!touchItem) return;
        
        const touch = e.changedTouches[0];
        const dropRect = dropTarget.getBoundingClientRect();
        
        // Check if touch point is within drop zone
        const isDropped = (
            touch.clientX >= dropRect.left &&
            touch.clientX <= dropRect.right &&
            touch.clientY >= dropRect.top &&
            touch.clientY <= dropRect.bottom
        );
        
        if (isDropped) {
            handleSuccessfulDrop(touch.clientX, touch.clientY);
        } else {
            handleFailedDrop(touch.clientX, touch.clientY);
        }
        
        // Cleanup
        touchItem.classList.remove('dragging');
        touchItem = null;
        dropTarget.style.backgroundColor = '';
    }
    
    // ============================
    // DROP HANDLERS
    // ============================
    
    function handleSuccessfulDrop(x, y) {
        // Show success message
        showSuccessMessage(x, y);
        
        // Trigger success effects
        triggerSuccessParticles(x, y);
        
        // Hide CAPTCHA
        captchaContainer.style.display = 'none';
        
        // Play boot beep
        bootBeep.load();
        playAudio(bootBeep);
        
        // Stop Zuck music
        if (currentZuckMusic) {
            currentZuckMusic.pause();
            currentZuckMusic.currentTime = 0;
        }
        
        // Update drop target
        dropTarget.classList.add('closed');
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
        
        // Transition to CRT
        setTimeout(() => {
            transitionToCRT();
        }, 1000);
    }
    
    function handleFailedDrop(x, y) {
        // Play fail sound
        playAudio(zuckFailSound);
        
        // Visual feedback
        draggableZuck.classList.add('fail-drop');
        dropTarget.classList.add('fail-highlight');
        
        // Show fail message
        showFailMessage(x, y);
        
        // Trigger glitch effect
        triggerGlitchEffect();
        
        // Reset visual states
        setTimeout(() => {
            draggableZuck.classList.remove('fail-drop');
            dropTarget.classList.remove('fail-highlight');
        }, 600);
        
        // Position draggable at drop location
        draggableZuck.style.position = 'fixed';
        draggableZuck.style.left = `${x - draggableZuck.offsetWidth / 2}px`;
        draggableZuck.style.top = `${y - draggableZuck.offsetHeight / 2}px`;
    }
    
    // ============================
    // PHASE TRANSITIONS
    // ============================
    
    function transitionToCRT() {
        // Hide boot screen
        bootScreen.style.display = 'none';
        
        // Show CRT background
        crtBgContainer.classList.remove('hidden');
        crtBgContainer.classList.add('fade-in');
        
        // Show QR after animation
        setTimeout(() => {
            showQRContainer();
        }, 1200);
    }
    
    function showQRContainer() {
        // Play Mac chime
        playAudio(macChime);
        
        // Show QR container
        qrContainer.classList.remove('hidden');
        qrContainer.classList.add('fade-in');
        
        // Show buddy folder UI
        if (buddyFolderUI) {
            buddyFolderUI.classList.remove('hidden');
        }
        
        // Setup buddy icons
        setupBuddyIcons();
        
        // Create countdown timer
        createCountdownTimer();
    }
    
    // ============================
    // BUDDY SYSTEM
    // ============================
    
    function setupBuddyIcons() {
        const buddyIcons = document.querySelectorAll('.buddy-icon');
        buddyIcons.forEach(icon => {
            icon.addEventListener('click', handleBuddyClick);
        });
    }
    
    function handleBuddyClick(e) {
        const type = e.currentTarget.getAttribute('data-window');
        openBuddyWindow(type);
    }
    
    function openBuddyWindow(type) {
        // Check if window already exists
        const existingWindow = document.querySelector(`.buddy-window[data-window="${type}"]`);
        if (existingWindow) {
            // Bring to front and bounce
            existingWindow.style.zIndex = ++windowZIndex;
            existingWindow.style.animation = 'windowBounce 0.3s ease-out';
            setTimeout(() => {
                existingWindow.style.animation = '';
            }, 300);
            return;
        }
        
        // Create new window
        const windowDiv = createBuddyWindow(type);
        
        // Add to DOM
        buddyWindows.appendChild(windowDiv);
        
        // Play open sound
        playAudio(windowOpenSound);
        
        // Entry animation
        windowDiv.style.animation = 'windowOpen 0.4s ease-out';
    }
    
    function createBuddyWindow(type) {
        const windowDiv = document.createElement('div');
        windowDiv.className = 'buddy-window';
        windowDiv.setAttribute('data-window', type);
        
        // Random rotation
        const rotation = (Math.random() - 0.5) * 6;
        windowDiv.style.setProperty('--rotation', `${rotation}deg`);
        windowDiv.style.transform = `rotate(${rotation}deg)`;
        windowDiv.style.zIndex = ++windowZIndex;
        
        // Position
        const position = getWindowPosition();
        windowDiv.style.left = `${position.x}px`;
        windowDiv.style.top = `${position.y}px`;
        
        // Create title bar
        const titleBar = createTitleBar(type);
        
        // Create content
        const content = createWindowContent(type);
        
        // Assemble window
        windowDiv.appendChild(titleBar);
        windowDiv.appendChild(content);
        
        // Make draggable
        makeDraggable(windowDiv);
        
        return windowDiv;
    }
    
    function createTitleBar(type) {
        const titleBar = document.createElement('div');
        titleBar.className = 'window-title-bar';
        titleBar.textContent = getWindowTitle(type);
        
        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.className = 'close-button';
        closeButton.onclick = (e) => {
            const window = e.target.closest('.buddy-window');
            closeWindow(window);
        };
        
        titleBar.appendChild(closeButton);
        return titleBar;
    }
    
    function closeWindow(windowDiv) {
        playAudio(windowCloseSound);
        windowDiv.style.animation = 'windowClose 0.3s ease-in forwards';
        setTimeout(() => {
            windowDiv.remove();
        }, 300);
    }
    
    function createWindowContent(type) {
        const content = document.createElement('div');
        content.className = 'buddy-content';
        
        // Add loading state for certain types
        if (type === 'special' || type === 'hot') {
            content.innerHTML = '<div class="loading">Loading...</div>';
            setTimeout(() => {
                content.innerHTML = getWindowContent(type);
            }, 500);
        } else if (type === 'online') {
            content.innerHTML = getWindowContent(type);
            setTimeout(() => {
                startLiveCountdown(content);
            }, 100);
        } else {
            content.innerHTML = getWindowContent(type);
        }
        
        return content;
    }
    
    // ============================
    // WINDOW DRAGGING
    // ============================
    
    function makeDraggable(windowDiv) {
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };
        
        const titleBar = windowDiv.querySelector('.window-title-bar');
        
        titleBar.addEventListener('mousedown', startDrag);
        titleBar.addEventListener('touchstart', startDrag, { passive: false });
        
        function startDrag(e) {
            isDragging = true;
            windowDiv.style.zIndex = ++windowZIndex;
            
            const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
            const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
            const rect = windowDiv.getBoundingClientRect();
            
            dragOffset.x = clientX - rect.left;
            dragOffset.y = clientY - rect.top;
            
            document.addEventListener('mousemove', drag);
            document.addEventListener('touchmove', drag, { passive: false });
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchend', stopDrag);
            
            windowDiv.style.transition = 'none';
        }
        
        function drag(e) {
            if (!isDragging) return;
            
            e.preventDefault();
            const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
            const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
            
            let newX = clientX - dragOffset.x;
            let newY = clientY - dragOffset.y;
            
            // Keep window on screen
            const rect = windowDiv.getBoundingClientRect();
            newX = Math.max(0, Math.min(newX, window.innerWidth - rect.width));
            newY = Math.max(0, Math.min(newY, window.innerHeight - rect.height));
            
            windowDiv.style.left = newX + 'px';
            windowDiv.style.top = newY + 'px';
        }
        
        function stopDrag() {
            isDragging = false;
            windowDiv.style.transition = '';
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchend', stopDrag);
        }
    }
    
    // ============================
    // ANIMATIONS
    // ============================
    
    function startBouncingAnimation() {
        const container = captchaContainer;
        const zuck = draggableZuck;
        
        let posX = 100;
        let posY = 100;
        let dx = 2;
        let dy = 2;
        
        zuck.style.position = 'absolute';
        
        animationInterval = setInterval(() => {
            const maxX = container.clientWidth - zuck.offsetWidth;
            const maxY = container.clientHeight - zuck.offsetHeight;
            
            posX += dx;
            posY += dy;
            
            if (posX <= 0 || posX >= maxX) {
                dx = -dx;
                posX = Math.max(0, Math.min(posX, maxX));
            }
            if (posY <= 0 || posY >= maxY) {
                dy = -dy;
                posY = Math.max(0, Math.min(posY, maxY));
            }
            
            zuck.style.left = posX + 'px';
            zuck.style.top = posY + 'px';
            
            createTrailEffect(zuck);
        }, 20);
    }
    
    // ============================
    // EFFECTS
    // ============================
    
    function showSuccessMessage(x, y) {
        const message = document.createElement('p');
        message.textContent = '✅ Zuckerberg successfully docked.';
        message.className = 'success-msg';
        message.style.left = `${x}px`;
        message.style.top = `${y}px`;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
    
    function showFailMessage(x, y) {
        const failMessages = [
            '💸 META dropped -1000 pts',
            '📉 META stock crashes -1000 pts',
            '🔥 META burns -1000 pts',
            '💀 META loses -1000 pts',
            '⚡ META zapped -1000 pts'
        ];
        
        const randomMessage = failMessages[Math.floor(Math.random() * failMessages.length)];
        
        const message = document.createElement('p');
        message.textContent = randomMessage;
        message.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            z-index: 21000;
            font-family: 'Geneva', 'Lucida Grande', sans-serif;
            font-size: 18px;
            color: #ff0000;
            background: #fff;
            padding: 8px 12px;
            border: 2px solid #ff0000;
            border-radius: 4px;
            pointer-events: none;
            transform: translate(-50%, -50%);
            animation: failPop 2s ease-out forwards;
        `;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 2000);
    }
    
    function triggerSuccessParticles(x, y) {
        const colors = ['#00e969', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'];
        
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            const angle = (Math.PI * 2 * i) / 15;
            const distance = 50 + Math.random() * 50;
            
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 8px;
                height: 8px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 21000;
                animation: particleExplode 1s ease-out forwards;
                transform: translate(-50%, -50%);
            `;
            
            particle.style.setProperty('--end-x', Math.cos(angle) * distance + 'px');
            particle.style.setProperty('--end-y', Math.sin(angle) * distance + 'px');
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    }
    
    function triggerGlitchEffect() {
        const glitchDiv = document.createElement('div');
        glitchDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(255, 0, 0, 0.1) 2px,
                rgba(255, 0, 0, 0.1) 4px
            );
            pointer-events: none;
            z-index: 29000;
            animation: glitchFlash 0.5s ease-out;
            mix-blend-mode: overlay;
        `;
        document.body.appendChild(glitchDiv);
        
        setTimeout(() => {
            glitchDiv.remove();
        }, 500);
        
        // Screen distortion
        captchaContainer.style.filter = 'hue-rotate(180deg) contrast(150%)';
        setTimeout(() => {
            captchaContainer.style.filter = '';
        }, 300);
    }
    
    function createTrailEffect(element) {
        const trail = document.createElement('div');
        const rect = element.getBoundingClientRect();
        
        trail.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width/2}px;
            top: ${rect.top + rect.height/2}px;
            width: 4px;
            height: 4px;
            background: rgba(0, 233, 105, 0.6);
            border-radius: 50%;
            pointer-events: none;
            z-index: 20999;
            animation: trailFade 0.8s ease-out forwards;
            transform: translate(-50%, -50%);
        `;
        
        document.body.appendChild(trail);
        
        setTimeout(() => {
            trail.remove();
        }, 800);
    }
    
    // ============================
    // COUNTDOWN TIMERS
    // ============================
    
    function createCountdownTimer() {
        const countdown = document.createElement('div');
        countdown.id = 'qr-countdown';
        qrContainer.appendChild(countdown);
        
        function updateCountdown() {
            const now = new Date();
            const target = new Date('2025-06-20T00:00:00-07:00');
            const diff = target - now;
            
            if (diff <= 0) {
                countdown.textContent = '🚪 Portal is open!';
                return;
            }
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);
            
            countdown.textContent = `🚪 Portal opens in ${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
    
    function startLiveCountdown(container) {
        const countdownElement = container.querySelector('.live-countdown-display');
        if (!countdownElement) return;
        
        function updateLiveCountdown() {
            const now = new Date();
            const target = new Date('2025-06-26T00:00:00-07:00');
            const diff = target - now;
            
            if (diff <= 0) {
                countdownElement.textContent = '🎮 Game has started!';
                return;
            }
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);
            
            countdownElement.textContent = `🎮 Game starts in ${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
        
        updateLiveCountdown();
        setInterval(updateLiveCountdown, 1000);
    }
    
    // ============================
    // HELPER FUNCTIONS
    // ============================
    
    function rectsOverlap(rect1, rect2) {
        return !(
            rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom
        );
    }
    
    function getWindowPosition() {
        const isMobile = window.innerWidth <= 768;
        const padding = isMobile ? 10 : 50;
        const maxWidth = isMobile ? 300 : 400;
        const maxHeight = isMobile ? 400 : 500;
        
        const safeX = window.innerWidth - maxWidth - padding;
        const safeY = window.innerHeight - maxHeight - padding;
        
        const x = Math.random() * Math.max(safeX, padding) + padding;
        const y = Math.random() * Math.max(safeY, padding) + padding;
        
        return { x, y };
    }
    
    function getWindowTitle(type) {
        const titles = {
            'info': 'Too Much Info',
            'online': 'Still Online',
            'pissed': 'Got Priced',
            'special': 'Special',
            'adhd': 'A.D.H.D.',
            'hot': "I'm Hot You're Not"
        };
        return titles[type] || 'BUDDY™️';
    }
    
    function getWindowContent(type) {
        switch (type) {
            case 'info':
                return `
                    <h3>POST APOCALYPTIC: SAN FRANCISCO</h3>
                    <p>A live experiment in behavior, identity, and social logic.</p>
                    <p>No skill required. Play from anywhere. Not an RPG..it's cooler <img src="./assets/smile.gif" alt="smile" class="inline-emoji" onerror="this.style.display='none';" /></p>
                    <p><strong>You can join the waitlist for the price of an Arizona Iced Tea (.99 cents!) <img src="./assets/coin.gif" alt="coin" class="inline-emoji" onerror="this.style.display='none';" /></strong></p>
                    <img src="./assets/qr.jpg" alt="QR Code" class="qr-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
                    <div style="display:none; padding:20px; border:1px solid #ccc; text-align:center;">QR Code failed to load</div>
                    <p><a href="https://venmo.com/?txn=pay&recipients=worksucksdotnet&amount=1&note=Post%20Apocalyptic%20SF%20@INSERT_IG_HANDLE" target="_blank">Scan QR or Click Here to join waitlist</a></p>
                `;
                
            case 'online':
                return '<div class="live-countdown-display">🎮 Game starts in calculating...</div>';
                
            case 'pissed':
                return `
                    <p><strong>TERMS & CONDITIONS:</strong></p>
                    <p>No refunds. No complaints. No lawsuits. Seriously — by paying, you agree you cannot sue us under any circumstances. OK? Swear? Swear on it?</p>
                `;
                
            case 'special':
                return `
                    <video controls autoplay style="width: 100%; max-width: 250px; height: auto;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                        <source src="./assets/pasf_trailer.MOV" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    <div style="display:none; padding:20px; border:1px solid #ccc; text-align:center;">Video failed to load</div>
                `;
                
            case 'adhd':
                return `
                    <p><a href="https://en.wikipedia.org/wiki/Adderall" target="_blank">Read more about Adderall on Wikipedia</a></p>
                `;
                
            case 'hot':
                return `
                    <iframe style="width: 100%; max-width: 250px; height: 188px;" src="https://www.youtube.com/embed/tcsrsGJN_YA?si=NUrlsosgA477nXUs" title="YouTube video player" frameborder="0" allowfullscreen onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"></iframe>
                    <div style="display:none; padding:20px; border:1px solid #ccc; text-align:center;">Video failed to load</div>
                `;
                
            default:
                return `<p>Content for <strong>${type}</strong> window goes here.</p>`;
        }
    }
    
    // Initialize everything
    init();
});