document.addEventListener('DOMContentLoaded', () => {
    const bootBeep = document.getElementById('boot-beep');
    const macChime = document.getElementById('mac-chime');
    const bootScreen = document.getElementById('boot-screen');
    const startOverlay = document.getElementById('start-overlay');
    const startButton = document.getElementById('start-button');
    const background = document.getElementById('crt-bg');
    const qrContainer = document.getElementById('qr-container');
    const crtUI = document.getElementById('crt-ui');
    const glenMusic = new Audio('assets/glenim.mp3');

    let crtVisible = false;
    let backgroundReady = false;
    let qrShown = false;

    qrContainer.classList.add('hidden');

    // Drag and drop CAPTCHA setup
    const draggable = document.getElementById('draggable-zuck');
    const dropZone = document.getElementById('drop-target');

    // Bouncing logic for draggable
    let dx = 2;
    let dy = 2;
    let posX = 100;
    let posY = 100;
    let animationInterval;

    function startBouncing() {
        draggable.style.position = 'absolute';
        // Add scale variables
        let scaleDirection = 1;
        let scale = 1;
        draggable.style.left = `${posX}px`;
        draggable.style.top = `${posY}px`;
        animationInterval = setInterval(() => {
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const elementWidth = draggable.offsetWidth;
            const elementHeight = draggable.offsetHeight;

            posX += dx * 0.5;
            posY += dy * 0.5;

            if (posX + elementWidth >= screenWidth || posX <= 0) {
                dx = -dx;
            }
            if (posY + elementHeight >= screenHeight || posY <= 0) {
                dy = -dy;
            }

            draggable.style.left = `${posX}px`;
            draggable.style.top = `${posY}px`;

            // Scale animation
            scale += 0.005 * scaleDirection;
            if (scale >= 1.2 || scale <= 0.8) {
                scaleDirection *= -1;
            }
            draggable.style.transform = `scale(${scale})`;
        }, 16);
    }

    draggable.addEventListener('dragstart', (e) => {
        clearInterval(animationInterval);
        e.dataTransfer.setData('text/plain', 'zuck');
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.backgroundColor = '#d0ffd0';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.backgroundColor = '';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
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

        setTimeout(() => {
            bootScreen.style.display = 'none';
            crtUI.classList.remove('hidden');
            crtUI.classList.add('fade-in');

            setTimeout(maybeShowQR, 100);

            crtVisible = true;
            backgroundReady = true;
            maybeShowQR();
        }, 1000);
    });

    // Mobile touch support for drag-and-drop
    let touchOffsetX = 0;
    let touchOffsetY = 0;
    let successMessage;

    draggable.addEventListener('touchstart', (e) => {
        clearInterval(animationInterval);
        const touch = e.touches[0];
        const rect = draggable.getBoundingClientRect();
        touchOffsetX = touch.clientX - rect.left;
        touchOffsetY = touch.clientY - rect.top;

        draggable.style.position = 'absolute';
        draggable.style.zIndex = 1000;
    });

    draggable.addEventListener('touchmove', (e) => {
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
    });

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
        glenMusic.play().catch(() => {
            console.warn('Glen music blocked.');
        });
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

                qrShown = true;
            }, 2000);
        }
    }
});