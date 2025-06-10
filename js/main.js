document.addEventListener('DOMContentLoaded', () => {
    const bootBeep = document.getElementById('boot-beep');
    const macChime = document.getElementById('mac-chime');
    const bootScreen = document.getElementById('boot-screen');
    const startOverlay = document.getElementById('start-overlay');
    const startButton = document.getElementById('start-button');
    const background = document.getElementById('crt-bg');
    const qrContainer = document.getElementById('qr-container');
    const crtUI = document.getElementById('crt-ui');
    const glenMusic = new Audio('./assets/humanzuck.mp3'); // Ensure the path is relative to the script
    glenMusic.addEventListener('error', () => {
        console.error('Failed to load glenMusic audio file. Please check the file path.');
    });

    let crtVisible = false;
    let backgroundReady = false;
    let qrShown = false;
    let animationInterval;

    qrContainer.classList.add('hidden');

    // Drag and drop CAPTCHA setup
    const draggable = document.getElementById('draggable-zuck');
    const dropZone = document.getElementById('drop-target');

    draggable.style.backgroundColor = '#fff';

    draggable.addEventListener('dragstart', (e) => {
        clearInterval(animationInterval);
        draggable.classList.add('dragging');
        e.dataTransfer.setData('text/plain', 'zuck');
        // Let browser handle default drag image
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.backgroundColor = '#d0ffd0';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.backgroundColor = '';
    });

    document.addEventListener('dragover', (e) => {
        e.preventDefault(); // REQUIRED to allow drop event to fire on document
    });

    document.addEventListener('drop', (e) => {
        e.preventDefault();

        const isInside = dropZone.contains(e.target);

        if (isInside) {
            const successMessage = document.createElement('p');
            successMessage.textContent = '✅ Zuckerberg successfully docked.';
            successMessage.classList.add('success-msg');
            successMessage.style.fontFamily = "'Geneva', 'Lucida Grande', sans-serif";
            successMessage.style.fontSize = '20px';
            successMessage.style.color = '#000';
            successMessage.style.backgroundColor = '#fff';
            successMessage.style.padding = '8px 12px';
            successMessage.style.border = '2px solid #000';
            successMessage.style.borderRadius = '4px';
            successMessage.style.position = 'absolute';
            successMessage.style.zIndex = '9999';
            successMessage.style.left = `${e.clientX}px`;
            successMessage.style.top = `${e.clientY}px`;
            document.body.appendChild(successMessage);
            document.getElementById('captcha-container').style.display = 'none';

            bootBeep.load();
            bootBeep.play().catch(() => {
                console.warn('Boot beep blocked.');
            });

            glenMusic.pause();
            glenMusic.currentTime = 0;

            draggable.classList.remove('dragging');
            dropZone.classList.add('closed');

            setTimeout(() => {
                bootScreen.style.display = 'none';
                crtUI.classList.remove('hidden');
                crtUI.classList.add('fade-in');

                setTimeout(maybeShowQR, 100);

                crtVisible = true;
                backgroundReady = true;
                maybeShowQR();
            }, 1000);
        } else {
            dropZone.style.backgroundColor = '';
            draggable.classList.remove('dragging');
            draggable.classList.add('fail-drop');
            setTimeout(() => {
                draggable.classList.remove('fail-drop');
            }, 400);
            draggable.style.cursor = 'grab';
            draggable.style.position = 'absolute';
            draggable.style.left = `${e.clientX - draggable.offsetWidth / 2}px`;
            draggable.style.top = `${e.clientY - draggable.offsetHeight / 2}px`;

            dropZone.style.outline = '7px solid #e66';
            setTimeout(() => {
                dropZone.style.outline = '';
            }, 600);
        }
    });

    // Mobile touch support for drag-and-drop
    let touchOffsetX = 0;
    let touchOffsetY = 0;
    let successMessage;

    draggable.addEventListener('touchstart', (e) => {
        e.preventDefault();
        clearInterval(animationInterval);
        const touch = e.touches[0];
        const rect = draggable.getBoundingClientRect();
        touchOffsetX = touch.clientX - rect.left;
        touchOffsetY = touch.clientY - rect.top;

        draggable.style.position = 'absolute';
        draggable.style.zIndex = 1000;
        draggable.classList.add('dragging');
    }, { passive: false });

    draggable.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        draggable.style.left = `${touch.clientX - touchOffsetX}px`;
        draggable.style.top = `${touch.clientY - touchOffsetY}px`;

        const dropRect = dropZone.getBoundingClientRect();
        const dragRect = draggable.getBoundingClientRect();

        if (
            dragRect.right > dropRect.left &&
            dragRect.left < dropRect.right &&
            dragRect.bottom > dropRect.top &&
            dragRect.top < dropRect.bottom
        ) {
            dropZone.style.backgroundColor = '#d0ffd0';
        } else {
            dropZone.style.backgroundColor = '';
        }
    }, { passive: false });

    draggable.addEventListener('touchend', (e) => {
        const dropRect = dropZone.getBoundingClientRect();
        const dragRect = draggable.getBoundingClientRect();

        if (
            dragRect.right > dropRect.left &&
            dragRect.left < dropRect.right &&
            dragRect.bottom > dropRect.top &&
            dragRect.top < dropRect.bottom
        ) {
            const touch = e.changedTouches[0];
            successMessage = document.createElement('p');
            successMessage.textContent = '✅ Zuckerberg successfully docked.';
            successMessage.classList.add('success-msg');
            successMessage.style.fontFamily = "'Geneva', 'Lucida Grande', sans-serif";
            successMessage.style.fontSize = '20px';
            successMessage.style.color = '#000';
            successMessage.style.backgroundColor = '#fff';
            successMessage.style.padding = '8px 12px';
            successMessage.style.border = '2px solid #000';
            successMessage.style.borderRadius = '4px';
            successMessage.style.position = 'absolute';
            successMessage.style.zIndex = '9999';
            successMessage.style.left = `${touch.clientX}px`;
            successMessage.style.top = `${touch.clientY}px`;
            document.body.appendChild(successMessage);
            document.getElementById('captcha-container').style.display = 'none';

            bootBeep.load();
            bootBeep.play().catch(() => {
                console.warn('Boot beep blocked.');
            });

            glenMusic.pause();
            glenMusic.currentTime = 0;

            setTimeout(() => {
                bootScreen.style.display = 'none';
                crtUI.classList.remove('hidden');
                crtUI.classList.add('fade-in');

                setTimeout(maybeShowQR, 100);

                crtVisible = true;
                backgroundReady = true;
                maybeShowQR();
            }, 1000);
        }
        draggable.classList.remove('dragging');
        dropZone.style.backgroundColor = '';
        setTimeout(() => {
            if (successMessage && successMessage.parentNode) {
                successMessage.parentNode.removeChild(successMessage);
            }
        }, 5000);
    });

    startButton.addEventListener('click', () => {
        // Animated "start button multiply" effect
        for (let i = 0; i < 100; i++) {
            const clone = startButton.cloneNode(true);
            clone.classList.add('start-clone');
            clone.style.position = 'absolute';
            clone.style.left = `${Math.random() * window.innerWidth}px`;
            clone.style.top = `${Math.random() * window.innerHeight}px`;
            clone.style.opacity = '0.7';
            clone.style.pointerEvents = 'none';
            document.body.appendChild(clone);

            setTimeout(() => {
                clone.style.transition = 'transform 1s ease, opacity 1s ease';
                clone.style.transform = `translate(${Math.random() * 500 - 250}px, ${Math.random() * 500 - 250}px) scale(0.5)`;
                clone.style.opacity = '0';
            }, 50);

            setTimeout(() => {
                clone.remove();
            }, 2000);
        }
        startOverlay.style.display = 'none';

        if (glenMusic.paused) {
            glenMusic.play().catch(() => {
                console.warn('Glen music blocked.');
            });
        }

        document.getElementById('captcha-container').classList.remove('hidden');
        startBouncing();
    });


    function maybeShowQR() {
        if (crtVisible && backgroundReady && !qrShown) {
            setTimeout(() => {
                macChime.play().catch(() => {
                    console.warn('Mac chime blocked.');
                });

                qrContainer.classList.remove('hidden');
                qrContainer.classList.add('fade-in');

                // Create and insert the countdown timer element
                let countdown = document.getElementById('qr-countdown');
                if (!countdown) {
                    countdown = document.createElement('div');
                    countdown.id = 'qr-countdown';
                    qrContainer.appendChild(countdown);
                }

                function updateCountdown() {
                    const now = new Date();
                    const target = new Date('2025-06-13T00:00:00-07:00'); 
                    const diff = target - now;

                    if (diff <= 0) {
                        countdown.textContent = '🚪 Portal is open!';
                        return;
                    }

                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                    const minutes = Math.floor((diff / (1000 * 60)) % 60);
                    const seconds = Math.floor((diff / 1000) % 60);

                    countdown.textContent = `⏳ Portal opens in ${days}d ${hours}h ${minutes}m ${seconds}s`;
                }

                updateCountdown();
                setInterval(updateCountdown, 1000);

                qrShown = true;
            }, 2000);
        }
    }

    function startBouncing() {
        const zuck = document.getElementById('draggable-zuck');
        const container = document.getElementById('captcha-container');

        let posX = 100;
        let posY = 100;
        let dx = 2;
        let dy = 2;

        container.style.position = 'relative';
        zuck.style.position = 'absolute';
        container.appendChild(zuck);

        animationInterval = setInterval(() => {
            const zuckWidth = zuck.offsetWidth;
            const zuckHeight = zuck.offsetHeight;
            const maxX = container.clientWidth - zuckWidth;
            const maxY = container.clientHeight - zuckHeight;

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
        }, 20);
    }
});