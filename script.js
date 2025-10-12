class DarkRedPortfolio {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.startAnimations();
        this.initializeWidgets();
    }

    init() {
        
        this.initCustomCursor();
        
        
        this.initEntryPage();
        
        
        this.initThemeToggle();
        
        
        this.initAudioControl();
        
        
        this.initTypingAnimation();
        
        
        this.initStatsCounter();
        
        
        this.initSocialLinks();
        
        
        this.initPerformanceMonitor();
    }


    
    initCustomCursor() {
        const cursor = document.querySelector('.cursor');
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorRing = document.querySelector('.cursor-ring');
        
        if (!cursor) return;

        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        
        const animateRing = () => {
            const dx = mouseX - ringX;
            const dy = mouseY - ringY;
            
            ringX += dx * 0.15;
            ringY += dy * 0.15;
            
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
            
            requestAnimationFrame(animateRing);
        };
        animateRing();

        
        const interactiveElements = document.querySelectorAll('a, button, .skill-tag, .project-card, .widget, [tabindex]');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
                this.createRedBurst(mouseX, mouseY);
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
            });
        });
    }

    
    createRedBurst(x, y) {
        const colors = ['#dc2626', '#ef4444', '#991b1b', '#7f1d1d', '#fca5a5'];
        
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.className = 'red-burst';
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                z-index: 10000;
                box-shadow: 0 0 10px currentColor;
            `;
            
            document.body.appendChild(particle);
            
            const angle = (360 / 6) * i;
            const velocity = 2 + Math.random() * 3;
            
            particle.animate([
                { 
                    transform: 'translate(0, 0) scale(1)',
                    opacity: 1
                },
                { 
                    transform: `translate(${Math.cos(angle * Math.PI / 180) * velocity * 20}px, ${Math.sin(angle * Math.PI / 180) * velocity * 20}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: 600 + Math.random() * 400,
                easing: 'ease-out'
            }).onfinish = () => particle.remove();
        }
    }

    
    initEntryPage() {
        const entryPage = document.getElementById('entry-page');
        const mainSite = document.getElementById('main-site');
        const entryButton = document.getElementById('entry-button');
        const backgroundMusic = document.getElementById('background-music');

        const enterSite = () => {
            
            this.playRedSound();

            if (window.musicPlayer && window.musicPlayer.autoPlayMusic) {
                    
                setTimeout(() => {
                window.musicPlayer.autoPlayMusic();
            }, 2000);
    }
            
            
            entryPage.style.animation = 'redFadeOut 1s ease-in-out forwards';
            
            setTimeout(() => {
                entryPage.style.display = 'none';
                mainSite.style.display = 'block';
                mainSite.style.animation = 'redFadeIn 1s ease-in-out forwards';
                
                
                this.startMainAnimations();
                
                
                if (backgroundMusic) {
                    backgroundMusic.play().catch(e => console.log('Audio autoplay prevented'));
                }

                const playBtn = document.getElementById('play-pause-btn');
                    if (playBtn && !window.musicPlayer?.isPlaying) {
                    playBtn.click();
                }
            }, 1000);
        };

        entryButton.addEventListener('click', enterSite);
        entryButton.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') enterSite();
        });
    }

    
    initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const body = document.body;
        
        let isDark = true; 

        themeToggle.addEventListener('click', () => {
            isDark = !isDark;
            
            if (isDark) {
                body.classList.remove('light-theme');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                this.showNotification('Dark red theme activated', 'theme');
            } else {
                body.classList.add('light-theme');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                this.showNotification('Light theme activated', 'theme');
            }
            
            
            themeToggle.style.transform = 'scale(0.9)';
            themeToggle.style.boxShadow = '0 0 20px rgba(220, 38, 38, 0.5)';
            setTimeout(() => {
                themeToggle.style.transform = 'scale(1)';
                themeToggle.style.boxShadow = '';
            }, 150);
        });
    }

    
    initAudioControl() {
        const audioControl = document.getElementById('audio-control');
        const backgroundMusic = document.getElementById('background-music');
        const audioIcon = document.getElementById('audio-icon');
        
        let isPlaying = false;

        audioControl.addEventListener('click', () => {
            if (isPlaying) {
                backgroundMusic.pause();
                audioIcon.className = 'fas fa-volume-mute';
                audioControl.classList.remove('playing');
                this.showNotification('Music paused', 'audio');
            } else {
                backgroundMusic.play().then(() => {
                    audioIcon.className = 'fas fa-volume-up';
                    audioControl.classList.add('playing');
                    this.showNotification('Music playing', 'audio');
                }).catch(e => {
                    this.showNotification('Unable to play audio', 'error');
                });
            }
            isPlaying = !isPlaying;
        });

        
        if (backgroundMusic) {
            backgroundMusic.addEventListener('play', () => {
                this.startRedAudioVisualizer();
            });
        }
    }
    

    
    initTypingAnimation() {
        const typingElement = document.querySelector('.typing-text');
        if (!typingElement) return;

        const texts = [
            "C++ & C# Developer",
            "Backend Developer", 
            "Star7730",
            "treeakar x razgetreal x toxicrain258 x patch <3"
        ];
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const typeWriter = () => {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }

            
            if (!isDeleting && charIndex === currentText.length) {
                typingElement.style.borderRight = '2px solid #dc2626';
                setTimeout(() => {
                    isDeleting = true;
                    typingElement.style.borderRight = '2px solid #ef4444';
                }, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typingElement.style.borderRight = '2px solid #991b1b';
            }

            const typingSpeed = isDeleting ? 50 : 100;
            setTimeout(typeWriter, typingSpeed);
        };

        typeWriter();
    }

    
    initStatsCounter() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.value) || parseInt(entry.target.textContent);
                    this.animateNumber(entry.target, 0, target, 2000);
                    observer.unobserve(entry.target);
                }
            });
        });

        statNumbers.forEach(stat => observer.observe(stat));
    }

    animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (end - start) * easeOut);
            
            element.textContent = current.toLocaleString();
            
            
            element.style.textShadow = `0 0 ${10 + progress * 20}px rgba(220, 38, 38, 0.8)`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.textShadow = '0 0 15px rgba(220, 38, 38, 0.6)';
            }
        };
        
        requestAnimationFrame(animate);
    }

    
    initSocialLinks() {
        const socialLinks = document.querySelectorAll('.social-link');
        
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const url = link.dataset.link;
                const platform = link.dataset.platform;
                
                if (url) {
                    
                    navigator.clipboard.writeText(url).then(() => {
                        this.showNotification(`${platform} link copied!`, 'success');
                        this.createRedRipple(e.target, e.clientX, e.clientY);
                    }).catch(() => {
                        
                        window.open(url, '_blank');
                    });
                } else {
                    
                    navigator.clipboard.writeText('operations@pepsreal.cc').then(() => {
                        this.showNotification('Email copied to clipboard!', 'success');
                    });
                }
            });
        });
    }

    
    createRedRipple(element, x, y) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x - rect.left - size/2}px;
            top: ${y - rect.top - size/2}px;
            background: radial-gradient(circle, rgba(220, 38, 38, 0.4) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: redRipple 0.6s ease-out;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle',
            theme: 'fas fa-palette',
            audio: 'fas fa-music'
        };
        
        notification.innerHTML = `
            <i class="${icons[type] || icons.info}"></i>
            <span>${message}</span>
        `;
        
        let stack = document.getElementById('notification-stack');
        if (!stack) {
            stack = document.createElement('div');
            stack.id = 'notification-stack';
            stack.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
            `;
            document.body.appendChild(stack);
        }
        
        stack.appendChild(notification);
        
        
        setTimeout(() => notification.classList.add('show'), 10);
        
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    
    startMainAnimations() {
        this.initParticles();
        this.initFloatingElements();
        this.updateLastSeen();
        this.startRedMatrixRain();
    }

    
    initParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        particlesContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            overflow: hidden;
        `;
        document.body.appendChild(particlesContainer);

        const colors = ['#dc2626', '#ef4444', '#991b1b', '#7f1d1d', '#fca5a5'];
        
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'red-particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 1}px;
                height: ${Math.random() * 4 + 1}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                box-shadow: 0 0 10px currentColor;
                animation: redParticleFloat ${Math.random() * 15 + 10}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
                opacity: 0.6;
            `;
            
            particlesContainer.appendChild(particle);
        }
    }

    
    startRedMatrixRain() {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -2;
            opacity: 0.08;
            pointer-events: none;
        `;
        
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
        const matrixArray = matrix.split("");
        
        const fontSize = 10;
        const columns = canvas.width / fontSize;
        const drops = [];
        
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }
        
        const draw = () => {
            ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#dc2626';
            ctx.font = fontSize + 'px monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };
        
        setInterval(draw, 35);
    }

    
    updateLastSeen() {
        const lastSeenElement = document.getElementById('last-seen');
        if (!lastSeenElement) return;

        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            });
            lastSeenElement.textContent = `Last seen: ${timeString}`;
        };

        updateTime();
        setInterval(updateTime, 1000);
    }

    
    startRedAudioVisualizer() {
        const audioControl = document.getElementById('audio-control');
        if (!audioControl) return;

        const visualizer = document.createElement('div');
        visualizer.className = 'red-audio-visualizer';
        visualizer.innerHTML = Array.from({length: 5}, () => '<div class="red-bar"></div>').join('');
        
        audioControl.appendChild(visualizer);
        
        
        const bars = visualizer.querySelectorAll('.red-bar');
        const animateBars = () => {
            bars.forEach(bar => {
                const height = Math.random() * 20 + 5;
                bar.style.height = `${height}px`;
                bar.style.background = `linear-gradient(to top, #991b1b, #dc2626, #ef4444)`;
            });
        };
        
        const interval = setInterval(animateBars, 150);
        
        
        const audio = document.getElementById('background-music');
        audio.addEventListener('pause', () => {
            clearInterval(interval);
            visualizer.remove();
        });
    }

   
    playRedSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            console.log('Audio context not available');
        }
    }

    
    initializeWidgets() {
        this.initDiscordWidget();
        this.initSpotifyWidget();
        this.initStatsWidget();
    }

    initDiscordWidget() {
       
        setTimeout(() => {
            const statusDot = document.querySelector('#discord-status-dot, .status-indicator');
            const username = document.querySelector('#discord-username, .username');
            const activity = document.querySelector('#discord-activity, .activity');
            
            if (statusDot) {
                statusDot.className = 'status-indicator online';
                statusDot.style.boxShadow = '0 0 10px #23a55a';
            }
            if (username) username.textContent = 'peps2ne';
            if (activity) activity.textContent = 'Coding in C++';
        }, 1500);
    }

    initSpotifyWidget() {
        
        setTimeout(() => {
            const trackName = document.querySelector('#spotify-track, .track-name');
            const artistName = document.querySelector('#spotify-artist, .artist-name');
            const albumArt = document.querySelector('#spotify-album, .album-art');
            
            if (trackName) trackName.textContent = 'Dark Red Dreams';
            if (artistName) artistName.textContent = 'Synthwave Artist';
            if (albumArt) {
                albumArt.style.borderColor = '#dc2626';
                albumArt.style.boxShadow = '0 0 15px rgba(220, 38, 38, 0.3)';
            }
        }, 2000);
    }

    initStatsWidget() {
        
        setTimeout(() => {
            const statItems = document.querySelectorAll('.stat-item');
            statItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.transform = 'translateY(0) scale(1)';
                    item.style.opacity = '1';
                }, index * 200);
            });
        }, 1000);
    }

    
    initPerformanceMonitor() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const checkPerformance = () => {
            frameCount++;
            const now = performance.now();
            
            if (now - lastTime >= 1000) {
                const fps = frameCount;
                frameCount = 0;
                lastTime = now;
                
               
                if (fps < 30) {
                    document.body.classList.add('low-performance');
                } else {
                    document.body.classList.remove('low-performance');
                }
            }
            
            requestAnimationFrame(checkPerformance);
        };
        
        requestAnimationFrame(checkPerformance);
    }

    
    setupEventListeners() {
        window.addEventListener('resize', this.handleResize.bind(this));
        
        document.addEventListener('keydown', this.handleKeyboard.bind(this));

        document.addEventListener('mousemove', this.handleParallax.bind(this));

        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }

    handleResize() {
        
        const particles = document.querySelectorAll('.red-particle');
        particles.forEach(particle => {
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
        });
    }

    handleKeyboard(e) {
        
        if (e.ctrlKey && e.key === 'm') {
            e.preventDefault();
            document.getElementById('audio-control')?.click();
        }
        
        if (e.ctrlKey && e.key === 't') {
            e.preventDefault();
            document.getElementById('theme-toggle')?.click();
        }
    }

    handleParallax(e) {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        const xPos = (clientX / innerWidth - 0.5) * 2;
        const yPos = (clientY / innerHeight - 0.5) * 2;
        
        
        const widgets = document.querySelectorAll('.widget');
        widgets.forEach((widget, index) => {
            const speed = (index + 1) * 0.3;
            widget.style.transform = `translate(${xPos * speed}px, ${yPos * speed}px)`;
        });
    }

    handleVisibilityChange() {
        if (document.hidden) {
            document.body.classList.add('page-hidden');
        } else {
            document.body.classList.remove('page-hidden');
        }
    }
}


const redStyle = document.createElement('style');
redStyle.textContent = `
@keyframes redFadeOut {
    0% { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(1.1); filter: blur(10px); }
}

@keyframes redFadeIn {
    0% { opacity: 0; transform: scale(0.9); filter: blur(5px); }
    100% { opacity: 1; transform: scale(1); filter: blur(0); }
}

@keyframes redRipple {
    0% { transform: scale(0); opacity: 1; }
    100% { transform: scale(4); opacity: 0; }
}

@keyframes redParticleFloat {
    0% { transform: translateY(100vh) translateX(0) rotate(0deg); }
    100% { transform: translateY(-10vh) translateX(100px) rotate(360deg); }
}

.cursor-hover .cursor-ring {
    width: 60px !important;
    height: 60px !important;
    border-color: #dc2626 !important;
    box-shadow: 0 0 20px rgba(220, 38, 38, 0.5) !important;
}

.notification {
    background: rgba(26, 17, 17, 0.95);
    color: white;
    padding: 12px 20px;
    border-radius: 12px;
    margin-bottom: 10px;
    border-left: 4px solid #dc2626;
    transform: translateX(100%);
    opacity: 0;
    transition: all 0.3s ease;
    box-shadow: 0 8px 25px rgba(220, 38, 38, 0.3);
    backdrop-filter: blur(10px);
}

.notification.show {
    transform: translateX(0);
    opacity: 1;
}

.notification-error { 
    border-color: #ef4444; 
    box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3); 
}

.notification-success { 
    border-color: #10b981; 
    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3); 
}

.notification-theme { 
    border-color: #991b1b; 
    box-shadow: 0 8px 25px rgba(153, 27, 27, 0.3); 
}

.red-audio-visualizer {
    position: absolute;
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 3px;
}

.red-audio-visualizer .red-bar {
    width: 4px;
    height: 10px;
    background: linear-gradient(to top, #991b1b, #dc2626, #ef4444);
    border-radius: 2px;
    animation: redBarPulse 0.5s ease-in-out infinite alternate;
}

@keyframes redBarPulse {
    0% { opacity: 0.4; transform: scaleY(0.5); }
    100% { opacity: 1; transform: scaleY(1.2); }
}

.low-performance * {
    animation-duration: 3s !important;
}

.page-hidden * {
    animation-play-state: paused !important;
}

/* Hide default cursor */
* {
    cursor: none !important;
}

/* Custom cursor styles */
.cursor {
    position: fixed;
    top: 0;
    left: 0;
    width: 24px;
    height: 24px;
    pointer-events: none;
    z-index: 100001;
    mix-blend-mode: difference;
}

.cursor-dot {
    width: 4px;
    height: 4px;
    background: #dc2626;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.1s ease;
    box-shadow: 0 0 8px rgba(220, 38, 38, 0.6);
}

.cursor-ring {
    width: 24px;
    height: 24px;
    border: 2px solid #dc2626;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.2s ease;
    opacity: 0.7;
}
`;

document.head.appendChild(redStyle);

function loadAvatar() {
    const avatarElements = document.querySelectorAll('.avatar, .main-avatar-img');
    
    
    const yourAvatarUrl = 'https://i.pinimg.com/1200x/a2/d0/49/a2d04901ea05b4fd83186f8eadaa9524.jpg';
    const fallbackAvatarUrl = 'https://via.placeholder.com/100x100/dc2626/ffffff?text=P';
    
    avatarElements.forEach(avatar => {
        avatar.src = yourAvatarUrl;
        avatar.alt = 'Profile Avatar';
        
        avatar.onerror = function() {
            console.log('Avatar failed to load, using fallback');
            this.src = fallbackAvatarUrl;
        };
        
        avatar.onload = function() {
            console.log('Avatar loaded successfully');
            this.style.opacity = '1';
            this.style.visibility = 'visible';
        };
        
        avatar.style.display = 'block';
        avatar.style.opacity = '1';
        avatar.style.visibility = 'visible';
    });
}


function createCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    cursor.innerHTML = `
        <div class="cursor-dot"></div>
        <div class="cursor-ring"></div>
    `;
    document.body.appendChild(cursor);
}




class PerformanceManager {
    constructor() {
        this.isLowEndDevice = false;
        this.performanceLevel = 'high'; 
        this.init();
    }

  
    detectLowEndDevice() {
        
        const hasLowCPU = navigator.hardwareConcurrency <= 4;
        const hasLowMemory = navigator.deviceMemory <= 4;
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const isTablet = window.matchMedia('(max-width: 1024px)').matches;
        
        
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        const hasLowGPU = !gl || gl.getParameter(gl.MAX_TEXTURE_SIZE) < 4096;
        
       
        const hasSlowConnection = navigator.connection && 
            (navigator.connection.effectiveType === 'slow-2g' || 
             navigator.connection.effectiveType === '2g' || 
             navigator.connection.saveData);
        
        
        let hasLowBattery = false;
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                if (battery.level < 0.2 && !battery.charging) {
                    hasLowBattery = true;
                    this.adjustForLowBattery();
                }
            });
        }
        
        
        let performanceScore = 0;
        if (hasLowCPU) performanceScore += 2;
        if (hasLowMemory) performanceScore += 2;
        if (isMobile) performanceScore += 1;
        if (isTablet) performanceScore += 1;
        if (prefersReducedMotion) performanceScore += 3;
        if (hasLowGPU) performanceScore += 2;
        if (hasSlowConnection) performanceScore += 1;
        
        
        if (performanceScore >= 6) {
            this.performanceLevel = 'low';
            this.isLowEndDevice = true;
        } else if (performanceScore >= 3) {
            this.performanceLevel = 'medium';
        } else {
            this.performanceLevel = 'high';
        }
        
        console.log(`Performance Level: ${this.performanceLevel} (Score: ${performanceScore})`);
        return this.isLowEndDevice;
    }

    
    init() {
        this.detectLowEndDevice();
        
        switch(this.performanceLevel) {
            case 'low':
                this.disableHeavyEffects();
                this.initializeBasicAnimations();
                break;
            case 'medium':
                this.optimizeForMediumPerformance();
                this.initializeReducedAnimations();
                break;
            case 'high':
                this.initializeFullAnimations();
                break;
        }
        
        this.addPerformanceIndicator();
        this.setupPerformanceMonitoring();
    }

    
    disableHeavyEffects() {
        
        const particles = document.querySelectorAll('.particle, .color-burst, .floating-particle');
        particles.forEach(particle => {
            particle.style.display = 'none';
        });
        
        
        const floatingElements = document.querySelectorAll('.floating-element, .ambient-orb');
        floatingElements.forEach(element => {
            element.style.display = 'none';
        });
        
       
        const ambientOverlay = document.querySelector('.ambient-overlay');
        if (ambientOverlay) {
            ambientOverlay.style.display = 'none';
        }
        
        
        document.body.style.setProperty('--grid-opacity', '0');
        document.body.style.setProperty('--noise-opacity', '0');
        
        
        const elementsWithBlur = document.querySelectorAll('.widget, .profile-card, .social-link, .entry-page');
        elementsWithBlur.forEach(element => {
            element.style.backdropFilter = 'blur(3px)';
            element.style.webkitBackdropFilter = 'blur(3px)';
        });
        
        
        const elementsWithShadows = document.querySelectorAll('.widget, .profile-card, .project-card');
        elementsWithShadows.forEach(element => {
            element.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
        });
        
       
        const elementsWithGradients = document.querySelectorAll('.entry-text, .stat-number');
        elementsWithGradients.forEach(element => {
            element.style.animation = 'none';
            element.style.background = '#dc2626';
            element.style.webkitBackgroundClip = 'initial';
            element.style.webkitTextFillColor = 'initial';
            element.style.color = '#dc2626';
        });
        
       
        const cursor = document.querySelector('.cursor');
        if (cursor) {
            cursor.style.display = 'none';
        }
        
        console.log('Heavy effects disabled for optimal performance');
    }


    optimizeForMediumPerformance() {
      
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            if (index % 2 === 0) {
                particle.style.display = 'none';
            }
        });
        
      
        const elementsWithBlur = document.querySelectorAll('.widget, .profile-card, .social-link');
        elementsWithBlur.forEach(element => {
            element.style.backdropFilter = 'blur(8px)';
        });
        
        
        const elementsWithShadows = document.querySelectorAll('.widget, .profile-card, .project-card');
        elementsWithShadows.forEach(element => {
            element.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
        });
        
        console.log('Medium performance optimizations applied');
    }

   
    initializeBasicAnimations() {
        const elements = document.querySelectorAll('.widget, .profile-card, .project-card, .social-link');
        
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(15px)';
            el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 50);
        });
        
        
        elements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.style.transform = 'translateY(-2px)';
            });
            
            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translateY(0)';
            });
        });
    }

    
    initializeReducedAnimations() {
        const elements = document.querySelectorAll('.widget, .profile-card, .project-card');
        
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px) scale(0.95)';
            el.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0) scale(1)';
            }, index * 75);
        });
    }

   
    initializeFullAnimations() {
        const elements = document.querySelectorAll('.widget, .profile-card, .project-card');
        
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px) scale(0.9) rotateX(10deg)';
            el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0) scale(1) rotateX(0deg)';
            }, index * 100);
        });
        
     
        this.initializeParticleSystem();
        
        console.log('Full animations and effects enabled');
    }

 
    adjustForLowBattery() {
       
        document.body.classList.add('low-battery-mode');
        
        
        const autoRefreshElements = document.querySelectorAll('[data-auto-refresh]');
        autoRefreshElements.forEach(element => {
            element.removeAttribute('data-auto-refresh');
        });
        
       
        document.documentElement.style.setProperty('--animation-duration', '2s');
        
        console.log('Low battery optimizations applied');
    }

   
    addPerformanceIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'performance-indicator';
        indicator.innerHTML = `
            <div class="performance-icon">
                ${this.performanceLevel === 'high' ? '🚀' : 
                  this.performanceLevel === 'medium' ? '⚡' : '🔋'}
            </div>
            <span>Performance: ${this.performanceLevel}</span>
        `;
        
        indicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.8rem;
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: opacity 0.3s ease;
            opacity: 0.7;
        `;
        
        document.body.appendChild(indicator);
        
       
        setTimeout(() => {
            indicator.style.opacity = '0';
            setTimeout(() => indicator.remove(), 300);
        }, 3000);
    }

    
    setupPerformanceMonitoring() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const measureFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round(frameCount * 1000 / (currentTime - lastTime));
                
                if (fps < 30 && this.performanceLevel === 'high') {
                    console.log('Performance degradation detected, switching to medium mode');
                    this.performanceLevel = 'medium';
                    this.optimizeForMediumPerformance();
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        measureFPS();
    }

    
    initializeParticleSystem() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-system';
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        
        document.body.appendChild(particleContainer);
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: rgba(220, 38, 38, 0.3);
                border-radius: 50%;
                animation: floatParticle ${5 + Math.random() * 5}s linear infinite;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 5}s;
            `;
            
            particleContainer.appendChild(particle);
        }
    }

    
    switchPerformanceMode(mode) {
        this.performanceLevel = mode;
        
       
        document.body.classList.remove('low-battery-mode');
        
        
        this.init();
    }
}


const performanceCSS = `
@keyframes floatParticle {
    0% {
        transform: translateY(100vh) rotate(0deg);
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        transform: translateY(-100vh) rotate(360deg);
        opacity: 0;
    }
}

.low-battery-mode * {
    animation-duration: 2s !important;
    transition-duration: 0.2s !important;
}

.performance-indicator:hover {
    opacity: 1 !important;
    cursor: pointer;
}
`;


const style = document.createElement('style');
style.textContent = performanceCSS;
document.head.appendChild(style);


document.addEventListener('DOMContentLoaded', () => {
    window.performanceManager = new PerformanceManager();
});


window.switchPerformanceMode = (mode) => {
    if (window.performanceManager) {
        window.performanceManager.switchPerformanceMode(mode);
    }
};


document.addEventListener('DOMContentLoaded', () => {
    console.log('🔴 Initializing Dark Red Portfolio...');
    
   
    createCustomCursor();
    
    
    loadAvatar();
    
   
    window.DarkRedPortfolio = new DarkRedPortfolio();
    
   
    const notificationStack = document.createElement('div');
    notificationStack.id = 'notification-stack';
    notificationStack.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
    `;
    document.body.appendChild(notificationStack);
});

function initializeSkillPulse() {
    const skillTags = document.querySelectorAll('.skill-tag');
    if (skillTags.length === 0) return;

    setInterval(() => {
        const randomTag = skillTags[Math.floor(Math.random() * skillTags.length)];
        randomTag.classList.add('pulse');
        setTimeout(() => randomTag.classList.remove('pulse'), 1000);
    }, 2000);
}


class MusicPlayer {
    constructor() {
        
        this.tracks = [
            {
                id: 'track-1',
                title: 'Lay with Me',
                artist: 'Fluxxwave - Anti',
                file: 'Fluxxwave - Lay with Me - Anti.mp3'
            },
            {
                id: 'track-2',
                title: 'Gözlerime Bak',
                artist: 'Şam',
                file: 'Gözlerime Bak - Şam.mp3'
            },
            {
                id: 'track-3',
                title: 'Hani',
                artist: 'LvbelC5',
                file: 'Hani - Lvbel C5.mp3'
            },
            {
                id: 'track-4',
                title: 'Jordan Logosu',
                artist: 'EGE!',
                file: 'jordan logosu - EGE!.mp3'
            },
            {
                id: 'track-5',
                title: 'Striker Story',
                artist: 'MBox',
                file: 'Striker Story - MBox.mp3'
            },
            {
                id: 'track-6',
                title: 'SHEVCHENKO',
                artist: 'Organize',
                file: 'SHEVCHENKO - Organize.mp3'
            }
        ];
        
        this.currentTrackIndex = 0;
        this.audio = null;
        this.isPlaying = false;
        this.isMuted = false;
        this.isShuffled = false;
        this.currentVolume = 0.5;
        this.isLoading = false;
        this.shouldPlayAfterLoad = false;
        this.hasAutoPlayed = false; // autoplay
        
        // elementler
        this.playPauseBtn = document.getElementById('play-pause-btn');
        this.playPauseIcon = document.getElementById('play-pause-icon');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.volumeBtn = document.getElementById('volume-btn');
        this.volumeIcon = document.getElementById('volume-icon');
        this.shuffleBtn = document.getElementById('shuffle-btn');
        this.volumeIndicator = document.getElementById('volume-indicator');
        this.progressBar = document.querySelector('.progress-bar');
        this.progressFill = document.getElementById('music-progress');
        this.currentTimeEl = document.getElementById('music-current-time');
        this.totalTimeEl = document.getElementById('music-total-time');
        this.trackTitleEl = document.getElementById('track-title');
        this.trackArtistEl = document.getElementById('track-artist');
        this.currentTrackNumberEl = document.getElementById('current-track-number');
        this.totalTracksEl = document.getElementById('total-tracks');
        this.musicCard = document.querySelector('.music-player-card');
        this.musicInfo = document.querySelector('.music-info');
        
        this.init();
        this.setupAutoplay(); 
    }
    
    init() {
       
        document.querySelectorAll('audio').forEach(audio => audio.remove());
        
        
        this.createAudio();
        
        
        this.loadTrack(0);
        
        
        this.totalTracksEl.textContent = this.tracks.length;
        
        
        this.setupEventListeners();
        
        console.log('Music Player initialized with', this.tracks.length, 'tracks');
    }
    
    
    setupAutoplay() {
        this.waitForUserInteraction();
    }
    
    waitForUserInteraction() {
        
        const startAutoplay = (e) => {
            
            if (e.target.closest('.music-controls') || e.target.closest('.music-player-card')) {
                return;
            }
            
            if (!this.hasAutoPlayed) {
                setTimeout(() => {
                    this.autoPlayMusic();
                }, 1000); 
            }
            
            
            document.removeEventListener('click', startAutoplay);
        };
        
        
        setTimeout(() => {
            document.addEventListener('click', startAutoplay);
        }, 2000); 
        
        
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const mainSite = document.getElementById('main-site');
                    if (mainSite && mainSite.style.display !== 'none' && !this.hasAutoPlayed) {
                        setTimeout(() => {
                            this.autoPlayMusic();
                        }, 3000); 
                    }
                }
            });
        });
        
        const mainSite = document.getElementById('main-site');
        if (mainSite) {
            observer.observe(mainSite, { attributes: true, attributeFilter: ['style'] });
        }
    }
    
    autoPlayMusic() {
        if (this.hasAutoPlayed || !this.audio || this.isPlaying) return;
        
        this.hasAutoPlayed = true;
        
        console.log('🎵 Attempting autoplay...');
        
        
        const playPromise = this.audio.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('🎵 Autoplay successful!');
                    this.isPlaying = true;
                    this.updatePlayButton();
                    this.showAutoplayNotification('Music started automatically! 🎵', 'success');
                })
                .catch(error => {
                    console.log('🔇 Autoplay blocked:', error.message);
                    this.showAutoplayNotification('Click the play button to start music 🎵', 'info');
                });
        }
    }
    
    showAutoplayNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `autoplay-notification autoplay-${type}`;
        
        const iconMap = {
            success: 'music',
            info: 'volume-up',
            warning: 'volume-mute'
        };
        
        notification.innerHTML = `
            <div class="autoplay-notification-content">
                <i class="fas fa-${iconMap[type]}"></i>
                <span>${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            background: rgba(15, 15, 15, 0.95);
            border: 1px solid rgba(220, 38, 38, 0.4);
            color: #dc2626;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            font-size: 14px;
            z-index: 10000;
            backdrop-filter: blur(20px);
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            max-width: 300px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        `;
        
        document.body.appendChild(notification);
        
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        
        const hideDelay = type === 'success' ? 3000 : 5000;
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, hideDelay);
    }
    
    createAudio() {
        this.audio = new Audio();
        this.audio.volume = this.currentVolume;
        this.audio.preload = 'metadata';
        
        
        this.audio.addEventListener('loadeddata', () => {
            console.log('Audio loaded and ready');
            this.isLoading = false;
            this.updateDuration();
            
           
            if (this.shouldPlayAfterLoad) {
                this.shouldPlayAfterLoad = false;
                setTimeout(() => {
                    this.play();
                }, 100);
            }
        });
        
        this.audio.addEventListener('loadstart', () => {
            console.log('Loading audio...');
            this.isLoading = true;
        });
        
        this.audio.addEventListener('canplay', () => {
            console.log('Audio can play');
            this.isLoading = false;
        });
        
        this.audio.addEventListener('playing', () => {
            console.log('Audio is playing');
            this.isPlaying = true;
            this.updatePlayButton();
        });
        
        this.audio.addEventListener('pause', () => {
            console.log('Audio paused');
            this.isPlaying = false;
            this.updatePlayButton();
        });
        
        this.audio.addEventListener('timeupdate', () => {
            if (!this.isLoading) {
                this.updateProgress();
            }
        });
        
        this.audio.addEventListener('ended', () => {
            console.log('Track ended');
            this.onTrackEnd();
        });
        
        this.audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            this.isLoading = false;
            this.isPlaying = false;
            this.updatePlayButton();
            this.showNotification('Error loading audio', 'error');
        });
    }
    
    setupEventListeners() {
        
        this.playPauseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.togglePlay();
        });
        
        
        this.prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.previousTrack();
        });
        
        
        this.nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.nextTrack();
        });
        
        
        this.volumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMute();
        });
        
        
        this.shuffleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleShuffle();
        });
        
        
        this.progressBar.addEventListener('click', (e) => {
            this.seekTo(e);
        });
    }
    
    loadTrack(index, autoPlay = false) {
        if (index < 0 || index >= this.tracks.length || this.isLoading) {
            return;
        }
        
        console.log('Loading track:', this.tracks[index].title);
        
        
        this.audio.pause();
        this.audio.currentTime = 0;
        
       
        this.currentTrackIndex = index;
        this.shouldPlayAfterLoad = autoPlay;
        this.isLoading = true;
        
        
        this.updateTrackInfo();
        
        
        this.progressFill.style.width = '0%';
        this.currentTimeEl.textContent = '0:00';
        this.totalTimeEl.textContent = '0:00';
        
        
        this.audio.src = this.tracks[index].file;
        this.audio.volume = this.isMuted ? 0 : this.currentVolume;
        this.audio.load();
    }
    
    updateTrackInfo() {
        const track = this.tracks[this.currentTrackIndex];
        
        
        this.musicInfo.classList.add('changing');
        
        setTimeout(() => {
            this.trackTitleEl.textContent = track.title;
            this.trackArtistEl.textContent = track.artist;
            this.currentTrackNumberEl.textContent = this.currentTrackIndex + 1;
            this.musicInfo.classList.remove('changing');
        }, 250);
    }
    
    togglePlay() {
        if (this.isLoading) {
            console.log('Audio is loading, please wait...');
            return;
        }
        
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        if (this.isLoading) {
            this.shouldPlayAfterLoad = true;
            return;
        }
        
        const playPromise = this.audio.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('Playback started');
                    this.isPlaying = true;
                    this.updatePlayButton();
                })
                .catch(error => {
                    console.error('Play failed:', error);
                    this.isPlaying = false;
                    this.updatePlayButton();
                    this.showNotification('Unable to play audio', 'error');
                });
        }
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updatePlayButton();
    }
    
    updatePlayButton() {
        if (this.isPlaying) {
            this.playPauseIcon.className = 'fas fa-pause';
            this.musicCard.classList.add('playing');
            this.volumeIndicator.classList.add('active');
        } else {
            this.playPauseIcon.className = 'fas fa-play';
            this.musicCard.classList.remove('playing');
            this.volumeIndicator.classList.remove('active');
        }
    }
    
    previousTrack() {
        if (this.isLoading) return;
        
        let newIndex;
        
        if (this.isShuffled) {
            newIndex = Math.floor(Math.random() * this.tracks.length);
            while (newIndex === this.currentTrackIndex && this.tracks.length > 1) {
                newIndex = Math.floor(Math.random() * this.tracks.length);
            }
        } else {
            newIndex = this.currentTrackIndex - 1;
            if (newIndex < 0) {
                newIndex = this.tracks.length - 1;
            }
        }
        
        const wasPlaying = this.isPlaying;
        this.loadTrack(newIndex, wasPlaying);
        
        this.addButtonFeedback(this.prevBtn);
    }
    
    nextTrack() {
        if (this.isLoading) return;
        
        let newIndex;
        
        if (this.isShuffled) {
            newIndex = Math.floor(Math.random() * this.tracks.length);
            while (newIndex === this.currentTrackIndex && this.tracks.length > 1) {
                newIndex = Math.floor(Math.random() * this.tracks.length);
            }
        } else {
            newIndex = this.currentTrackIndex + 1;
            if (newIndex >= this.tracks.length) {
                newIndex = 0;
            }
        }
        
        const wasPlaying = this.isPlaying;
        this.loadTrack(newIndex, wasPlaying);
        
        this.addButtonFeedback(this.nextBtn);
    }
    
    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        
        if (this.isShuffled) {
            this.shuffleBtn.classList.add('active');
            this.showNotification('Shuffle enabled', 'success');
        } else {
            this.shuffleBtn.classList.remove('active');
            this.showNotification('Shuffle disabled', 'success');
        }
        
        this.addButtonFeedback(this.shuffleBtn);
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            this.audio.volume = 0;
            this.volumeIcon.className = 'fas fa-volume-mute';
        } else {
            this.audio.volume = this.currentVolume;
            this.volumeIcon.className = this.currentVolume > 0.5 ? 'fas fa-volume-up' : 'fas fa-volume-down';
        }
        
        this.addButtonFeedback(this.volumeBtn);
    }
    
    seekTo(e) {
        if (this.isLoading || !this.audio.duration) return;
        
        const rect = this.progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, clickX / rect.width));
        
        this.audio.currentTime = percentage * this.audio.duration;
    }
    
    updateProgress() {
        if (!this.audio.duration) return;
        
        const percentage = (this.audio.currentTime / this.audio.duration) * 100;
        this.progressFill.style.width = percentage + '%';
        this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
    }
    
    updateDuration() {
        if (this.audio.duration && !isNaN(this.audio.duration)) {
            this.totalTimeEl.textContent = this.formatTime(this.audio.duration);
        }
    }
    
    onTrackEnd() {
        setTimeout(() => {
            this.nextTrack();
        }, 300);
    }
    
    addButtonFeedback(button) {
        button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }
    
    formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    showNotification(message, type) {
        console.log(`${type}: ${message}`);
    }
    
    destroy() {
        if (this.audio) {
            this.audio.pause();
            this.audio.src = '';
            this.audio.load();
            this.audio = null;
        }
    }
}


const autoplayCSS = `
/* Autoplay Notification Styles */
.autoplay-notification-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.autoplay-notification-content i {
    font-size: 18px;
    animation: musicPulse 1.5s ease-in-out infinite;
}

.autoplay-success {
    border-color: rgba(34, 197, 94, 0.4) !important;
    background: rgba(15, 15, 15, 0.95) !important;
}

.autoplay-success .autoplay-notification-content i {
    color: #22c55e;
}

.autoplay-info {
    border-color: rgba(59, 130, 246, 0.4) !important;
}

.autoplay-info .autoplay-notification-content i {
    color: #3b82f6;
}

@keyframes musicPulse {
    0%, 100% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.1);
        opacity: 0.8;
    }
}

/* Mobile adjustments */
@media (max-width: 768px) {
    .autoplay-notification {
        bottom: 80px !important;
        right: 10px !important;
        left: 10px !important;
        max-width: none !important;
    }
}
`;


const autoplayStyle = document.createElement('style');
autoplayStyle.textContent = autoplayCSS;
document.head.appendChild(autoplayStyle);


let musicPlayer = null;

document.addEventListener('DOMContentLoaded', () => {
    
    if (musicPlayer) {
        musicPlayer.destroy();
    }
    
    
    musicPlayer = new MusicPlayer();
    window.musicPlayer = musicPlayer;
});


window.addEventListener('beforeunload', () => {
    if (musicPlayer) {
        musicPlayer.destroy();
    }
});




setTimeout(loadAvatar, 1000);


class TypewriterEffect {
    constructor(element, text, options = {}) {
        this.element = element;
        this.text = text;
        this.options = {
            speed: 150,           
            deleteSpeed: 100,     
            pauseTime: 2000,    
            loop: false,          
            showCursor: true,     
            ...options
        };
        
        this.currentIndex = 0;
        this.isDeleting = false;
        this.cursor = document.querySelector('.typewriter-cursor');
        
        this.start();
    }
    
    start() {
        this.type();
    }
    
    type() {
        const currentText = this.isDeleting 
            ? this.text.substring(0, this.currentIndex - 1)
            : this.text.substring(0, this.currentIndex + 1);
        
        this.element.textContent = currentText;
        
        
        let typeSpeed = this.isDeleting ? this.options.deleteSpeed : this.options.speed;
        typeSpeed += Math.random() * 50; 
        
        if (!this.isDeleting && this.currentIndex === this.text.length) {
        
            if (this.options.loop) {
               
                setTimeout(() => {
                    this.isDeleting = true;
                    this.type();
                }, this.options.pauseTime);
            } else {
                
                if (this.cursor && this.options.showCursor) {
                    setTimeout(() => {
                        this.cursor.classList.add('hidden');
                    }, 1000);
                }
            }
            return;
        }
        
        if (this.isDeleting && this.currentIndex === 0) {
            
            this.isDeleting = false;
            setTimeout(() => this.type(), 500);
            return;
        }
        
        
        this.currentIndex += this.isDeleting ? -1 : 1;
        setTimeout(() => this.type(), typeSpeed);
    }
    
    
    restart() {
        this.currentIndex = 0;
        this.isDeleting = false;
        if (this.cursor) {
            this.cursor.classList.remove('hidden');
        }
        this.start();
    }
    
    
    changeText(newText) {
        this.text = newText;
        this.restart();
    }
}


class MultiTypewriter {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = Array.isArray(texts) ? texts : [texts];
        this.currentTextIndex = 0;
        this.options = {
            speed: 150,
            deleteSpeed: 100,
            pauseTime: 2000,
            switchPause: 1000,
            loop: true,
            showCursor: true,
            ...options
        };
        
        this.currentIndex = 0;
        this.isDeleting = false;
        this.cursor = document.querySelector('.typewriter-cursor');
        
        this.start();
    }
    
    start() {
        this.type();
    }
    
    type() {
        const currentText = this.texts[this.currentTextIndex];
        const displayText = this.isDeleting 
            ? currentText.substring(0, this.currentIndex - 1)
            : currentText.substring(0, this.currentIndex + 1);
        
        this.element.textContent = displayText;
        
        let typeSpeed = this.isDeleting ? this.options.deleteSpeed : this.options.speed;
        typeSpeed += Math.random() * 50;
        
        if (!this.isDeleting && this.currentIndex === currentText.length) {
            
            if (this.texts.length > 1) {
                
                setTimeout(() => {
                    this.isDeleting = true;
                    this.type();
                }, this.options.pauseTime);
            } else if (this.options.loop) {
                
                setTimeout(() => {
                    this.isDeleting = true;
                    this.type();
                }, this.options.pauseTime);
            } else {
                
                if (this.cursor && this.options.showCursor) {
                    setTimeout(() => {
                        this.cursor.classList.add('hidden');
                    }, 1000);
                }
            }
            return;
        }
        
        if (this.isDeleting && this.currentIndex === 0) {
            
            this.isDeleting = false;
            this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
            setTimeout(() => this.type(), this.options.switchPause);
            return;
        }
        
        this.currentIndex += this.isDeleting ? -1 : 1;
        setTimeout(() => this.type(), typeSpeed);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const nameElement = document.getElementById('typewriter-name');
    
    if (nameElement) {
        window.nameTypewriter = new MultiTypewriter(nameElement, [
            'Peps Star'
        ], {
            speed: 100,         
            deleteSpeed: 100,    
            pauseTime: 5000,    
            switchPause: 500,   
            loop: true          
        });
    }
});


window.restartTypewriter = () => {
    const nameElement = document.getElementById('typewriter-name');
    if (nameElement && window.nameTypewriter) {
        window.nameTypewriter.restart();
    }
};


class FireParticleSystem {
    constructor() {
        this.container = this.createContainer();
        this.particles = [];
        this.maxParticles = 15;
        this.init();
    }
    
    createContainer() {
        const container = document.createElement('div');
        container.className = 'fire-particles';
        document.body.appendChild(container);
        return container;
    }
    
    init() {
        this.createParticles();
        this.startAnimation();
    }
    
    createParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
            setTimeout(() => {
                this.createParticle();
            }, i * 200);
        }
    }
    
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'fire-particle';
        
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (6 + Math.random() * 4) + 's';
        
        
        const size = 2 + Math.random() * 4;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        this.container.appendChild(particle);
        
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
                this.createParticle(); 
            }
        }, 8000);
    }
    
    startAnimation() {
        
        setInterval(() => {
            if (this.container.children.length < this.maxParticles) {
                this.createParticle();
            }
        }, 600);
    }
}


class FireCursorTrail {
    constructor() {
        this.trails = [];
        this.maxTrails = 8;
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.createTrail(e.clientX, e.clientY);
        });
    }
    
    createTrail(x, y) {
        if (this.trails.length >= this.maxTrails) {
            const oldTrail = this.trails.shift();
            if (oldTrail.parentNode) {
                oldTrail.remove();
            }
        }
        
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = x + 'px';
        trail.style.top = y + 'px';
        
        document.body.appendChild(trail);
        this.trails.push(trail);
        
       
        setTimeout(() => {
            if (trail.parentNode) {
                trail.remove();
            }
        }, 1000);
    }
}


class FireSkillTags {
    constructor() {
        this.init();
    }
    
    init() {
        const skillTags = document.querySelectorAll('.skill-tag');
        
        skillTags.forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                this.addFireGlow(tag);
            });
            
            tag.addEventListener('mouseleave', () => {
                this.removeFireGlow(tag);
            });
        });
    }
    
    addFireGlow(element) {
        element.style.textShadow = '0 0 10px rgba(255, 69, 0, 0.8)';
    }
    
    removeFireGlow(element) {
        element.style.textShadow = 'none';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    
    if (window.innerWidth > 768) {
        new FireParticleSystem();
        new FireCursorTrail();
    }
    
    new FireSkillTags();
    
   
    const fireGrid = document.createElement('div');
    fireGrid.className = 'fire-grid';
    document.body.insertBefore(fireGrid, document.body.firstChild);
});


class ProfileViewCounter {
    constructor() {
        this.storageKey = 'peps_profile_views';
        this.sessionKey = 'peps_current_session';
        this.apiEndpoint = 'https://api.countapi.xyz/hit/pepsreal.cc/visits';
        
        this.counterElement = null;
        this.trendElement = null;
        
        // Debug info
        this.debugMode = true;
        
        this.waitForMainSite();
    }
    
    debugLog(message, data = null) {
        if (this.debugMode) {
            console.log(`[ProfileViewCounter] ${message}`, data || '');
        }
    }
    
    waitForMainSite() {
        this.debugLog('Starting to wait for main site...');
        
        const mainSite = document.getElementById('main-site');
        
        if (mainSite && mainSite.style.display !== 'none') {
            this.debugLog('Main site is visible, initializing...');
            setTimeout(() => this.init(), 1000);
        } else {
            this.debugLog('Main site not visible, setting up observers...');
            
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        const mainSite = document.getElementById('main-site');
                        if (mainSite && mainSite.style.display !== 'none') {
                            this.debugLog('Main site became visible via observer');
                            observer.disconnect();
                            setTimeout(() => this.init(), 1000);
                        }
                    }
                });
            });
            
            if (mainSite) {
                observer.observe(mainSite, { attributes: true, attributeFilter: ['style'] });
            } else {
                this.debugLog('Main site element not found, trying fallback...');
                // If main-site doesn't exist, try initializing anyway
                setTimeout(() => this.init(), 2000);
            }
            
            const entryPage = document.getElementById('entry-page');
            if (entryPage) {
                const entryObserver = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                            if (entryPage.style.display === 'none') {
                                this.debugLog('Entry page hidden via observer');
                                entryObserver.disconnect();
                                setTimeout(() => this.init(), 1000);
                            }
                        }
                    });
                });
                
                entryObserver.observe(entryPage, { attributes: true, attributeFilter: ['style'] });
            } else {
                this.debugLog('Entry page not found, trying direct init...');
                // If no entry page, try direct initialization
                setTimeout(() => this.init(), 3000);
            }
        }
    }
    
    async init() {
        this.debugLog('Init method called, looking for counter elements...');
        
        // Multiple selector strategies for finding the counter element
        const possibleSelectors = [
            '#profile-views .counter-number',
            '.profile-views .counter-number',
            '.counter-number',
            '[data-counter="views"]',
            '.view-counter',
            '.profile-view-count'
        ];
        
        for (const selector of possibleSelectors) {
            this.counterElement = document.querySelector(selector);
            if (this.counterElement) {
                this.debugLog(`Counter element found with selector: ${selector}`, this.counterElement);
                break;
            }
        }
        
        // Try trend element selectors
        const trendSelectors = [
            '#profile-views .trend-text',
            '.profile-views .trend-text',
            '.trend-text',
            '[data-trend="today"]',
            '.view-trend'
        ];
        
        for (const selector of trendSelectors) {
            this.trendElement = document.querySelector(selector);
            if (this.trendElement) {
                this.debugLog(`Trend element found with selector: ${selector}`, this.trendElement);
                break;
            }
        }
        
        // If counter element still not found, create it
        if (!this.counterElement) {
            this.debugLog('Counter element not found, attempting to create it...');
            this.createCounterElement();
            
            if (!this.counterElement) {
                this.debugLog('Failed to create counter element, retrying init...');
                setTimeout(() => this.init(), 2000);
                return;
            }
        }
        
        this.debugLog('Initialization proceeding...');
        
        // Check if new session
        if (this.isNewSession()) {
            this.debugLog('New session detected, incrementing views...');
            await this.incrementViews();
        } else {
            this.debugLog('Existing session, loading current views...');
        }
        
        // Load and display views
        await this.loadViews();
        
        // Update trend info
        this.updateTrendInfo();
        
        this.debugLog('Initialization complete!');
    }
    
    createCounterElement() {
        this.debugLog('Attempting to create counter element...');
        
        // Try to find a suitable parent container
        const possibleParents = [
            document.querySelector('.profile-section'),
            document.querySelector('.profile-widget'),
            document.querySelector('.profile-card'),
            document.querySelector('.widget-content'),
            document.querySelector('.profile-info'),
            document.querySelector('main'),
            document.body
        ];
        
        let parentElement = null;
        for (const parent of possibleParents) {
            if (parent) {
                parentElement = parent;
                this.debugLog('Found parent element:', parent);
                break;
            }
        }
        
        if (parentElement) {
            // Create the view counter widget
            const viewWidget = document.createElement('div');
            viewWidget.className = 'profile-view-counter-widget';
            viewWidget.innerHTML = `
                <div class="view-counter-content">
                    <div class="counter-icon">
                        <i class="fas fa-eye"></i>
                    </div>
                    <div class="counter-info">
                        <div class="counter-number">0</div>
                        <div class="counter-label">Profile Views</div>
                        <div class="trend-text">+0 today</div>
                    </div>
                </div>
            `;
            
            viewWidget.style.cssText = `
                background: rgba(15, 15, 15, 0.95);
                border: 2px solid rgba(220, 38, 38, 0.3);
                border-radius: 15px;
                padding: 1rem;
                margin: 1rem auto;
                max-width: 200px;
                text-align: center;
                color: #fff;
                font-family: 'Inter', sans-serif;
                backdrop-filter: blur(20px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            `;
            
            // Style the content
            const style = document.createElement('style');
            style.textContent = `
                .view-counter-content {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                
                .counter-icon {
                    font-size: 1.5rem;
                    color: #dc2626;
                }
                
                .counter-info {
                    flex: 1;
                }
                
                .counter-number {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #dc2626;
                    margin-bottom: 0.25rem;
                }
                
                .counter-label {
                    font-size: 0.8rem;
                    color: rgba(255, 255, 255, 0.8);
                    margin-bottom: 0.25rem;
                }
                
                .trend-text {
                    font-size: 0.7rem;
                    color: #22c55e;
                }
                
                @media (max-width: 768px) {
                    .profile-view-counter-widget {
                        max-width: 180px !important;
                        padding: 0.75rem !important;
                    }
                    
                    .counter-number {
                        font-size: 1.25rem !important;
                    }
                }
            `;
            
            document.head.appendChild(style);
            
            // Insert the widget
            if (parentElement === document.body) {
                // If inserting into body, position it fixed
                viewWidget.style.position = 'fixed';
                viewWidget.style.bottom = '20px';
                viewWidget.style.right = '120px'; // Avoid AR button
                viewWidget.style.zIndex = '9998';
                viewWidget.style.margin = '0';
            }
            
            parentElement.appendChild(viewWidget);
            
            // Update element references
            this.counterElement = viewWidget.querySelector('.counter-number');
            this.trendElement = viewWidget.querySelector('.trend-text');
            
            this.debugLog('Counter element created successfully!', this.counterElement);
        } else {
            this.debugLog('No suitable parent element found for counter');
        }
    }
    
    isNewSession() {
        const sessionId = sessionStorage.getItem(this.sessionKey);
        const currentTime = Date.now();
        
        if (!sessionId) {
            sessionStorage.setItem(this.sessionKey, currentTime.toString());
            this.debugLog('New session created');
            return true;
        }
        
        const sessionTime = parseInt(sessionId);
        const timeDiff = currentTime - sessionTime;
        const thirtyMinutes = 30 * 60 * 1000;
        
        if (timeDiff > thirtyMinutes) {
            sessionStorage.setItem(this.sessionKey, currentTime.toString());
            this.debugLog('Session expired, creating new session');
            return true;
        }
        
        this.debugLog('Existing session valid');
        return false;
    }
    
    async incrementViews() {
        this.debugLog('Incrementing views...');
        
        try {
            const response = await fetch(this.apiEndpoint);
            const data = await response.json();
            
            if (data.value) {
                this.saveViewsLocally(data.value);
                this.animateCounter(data.value);
                this.debugLog('Views updated via API:', data.value);
                return;
            }
        } catch (error) {
            this.debugLog('API failed, using local storage:', error.message);
        }
        
        const currentViews = this.getLocalViews();
        const newViews = currentViews + 1;
        this.saveViewsLocally(newViews);
        this.animateCounter(newViews);
        this.debugLog('Views updated locally:', newViews);
    }
    
    async loadViews() {
        const views = this.getLocalViews();
        this.debugLog('Loading views:', views);
        this.displayViews(views);
    }
    
    getLocalViews() {
        const views = localStorage.getItem(this.storageKey);
        const result = views ? parseInt(views) : Math.floor(Math.random() * 500) + 1000;
        this.debugLog('Retrieved local views:', result);
        return result;
    }
    
    saveViewsLocally(views) {
        localStorage.setItem(this.storageKey, views.toString());
        
        const today = new Date().toDateString();
        const dailyKey = `${this.storageKey}_${today}`;
        const todayViews = parseInt(localStorage.getItem(dailyKey) || '0') + 1;
        localStorage.setItem(dailyKey, todayViews.toString());
        
        this.debugLog('Views saved locally:', { total: views, today: todayViews });
    }
    
    displayViews(count) {
        if (this.counterElement) {
            this.debugLog('Displaying views:', count);
            this.animateCounter(count);
        } else {
            this.debugLog('Counter element not available for display');
        }
    }
    
    animateCounter(targetCount) {
        if (!this.counterElement) {
            this.debugLog('Cannot animate - counter element missing');
            return;
        }
        
        this.debugLog('Animating counter to:', targetCount);
        
        const currentCount = parseInt(this.counterElement.textContent) || 0;
        const increment = Math.ceil(Math.abs(targetCount - currentCount) / 20);
        
        const animate = () => {
            const current = parseInt(this.counterElement.textContent);
            
            if (current < targetCount) {
                this.counterElement.textContent = Math.min(current + increment, targetCount);
                requestAnimationFrame(animate);
            } else {
                this.counterElement.textContent = targetCount;
                this.showViewNotification();
            }
        };
        
        animate();
    }
    
    updateTrendInfo() {
        if (!this.trendElement) {
            this.debugLog('Trend element not available');
            return;
        }
        
        const today = new Date().toDateString();
        const dailyKey = `${this.storageKey}_${today}`;
        const todayViews = parseInt(localStorage.getItem(dailyKey) || '1');
        
        this.trendElement.textContent = `+${todayViews} today`;
        this.debugLog('Trend updated:', `+${todayViews} today`);
    }
    
    showViewNotification() {
        // Only show notification if this is a new view increment
        if (this.isNewSession) {
            this.debugLog('Showing view notification');
            
            const notification = document.createElement('div');
            notification.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-eye"></i>
                    <span>Profile view recorded!</span>
                </div>
            `;
            
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(220, 38, 38, 0.95);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                font-size: 0.9rem;
                z-index: 10001;
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                font-family: 'Inter', sans-serif;
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.opacity = '1';
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }, 3000);
        }
    }
    
    // Debug method to check current state
    debugStatus() {
        return {
            counterElement: !!this.counterElement,
            trendElement: !!this.trendElement,
            currentViews: this.getLocalViews(),
            isNewSession: this.isNewSession(),
            mainSiteVisible: document.getElementById('main-site')?.style.display !== 'none',
            entryPageHidden: document.getElementById('entry-page')?.style.display === 'none'
        };
    }
}

// Enhanced initialization with better PC support
document.addEventListener('DOMContentLoaded', () => {
    console.log('[ProfileViewCounter] DOM loaded, checking device type...');
    
    // Check if we're on desktop
    const isDesktop = window.innerWidth > 768;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    console.log(`[ProfileViewCounter] Device detection - Desktop: ${isDesktop}, Mobile: ${isMobile}`);
    
    // For desktop, try multiple initialization strategies
    if (isDesktop && !isMobile) {
        console.log('[ProfileViewCounter] Desktop detected, using enhanced initialization...');
        
        // Strategy 1: Wait for interaction
        const initOnInteraction = (e) => {
            console.log('[ProfileViewCounter] User interaction detected, initializing...');
            if (!window.profileViewCounter) {
                window.profileViewCounter = new ProfileViewCounter();
            }
            document.removeEventListener('click', initOnInteraction);
            document.removeEventListener('scroll', initOnInteraction);
            document.removeEventListener('mousemove', initOnInteraction);
        };
        
        document.addEventListener('click', initOnInteraction, { once: true });
        document.addEventListener('scroll', initOnInteraction, { once: true });
        document.addEventListener('mousemove', initOnInteraction, { once: true });
        
        // Strategy 2: Delayed initialization
        setTimeout(() => {
            if (!window.profileViewCounter) {
                console.log('[ProfileViewCounter] Timeout initialization for desktop...');
                window.profileViewCounter = new ProfileViewCounter();
            }
        }, 3000);
        
        // Strategy 3: Window load
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (!window.profileViewCounter) {
                    console.log('[ProfileViewCounter] Window load initialization for desktop...');
                    window.profileViewCounter = new ProfileViewCounter();
                }
            }, 1000);
        });
        
    } else {
        // Mobile initialization (original logic)
        console.log('[ProfileViewCounter] Mobile detected, using standard initialization...');
        
        document.addEventListener('click', (e) => {
            if (e.target.closest('#entry-page') || e.target.closest('.entry-container')) {
                console.log('[ProfileViewCounter] Entry page clicked, initializing...');
                setTimeout(() => {
                    if (!window.profileViewCounter) {
                        window.profileViewCounter = new ProfileViewCounter();
                    }
                }, 3000);
            }
        }, { once: true });
    }
});

// Backup initialization methods
setTimeout(() => {
    const entryPage = document.getElementById('entry-page');
    const mainSite = document.getElementById('main-site');
    
    if (!window.profileViewCounter) {
        if ((entryPage && entryPage.style.display === 'none') || 
            (mainSite && mainSite.style.display !== 'none') ||
            (!entryPage && !mainSite)) {
            
            console.log('[ProfileViewCounter] Backup initialization triggered...');
            window.profileViewCounter = new ProfileViewCounter();
        }
    }
}, 5000);

// Manual initialization function
window.initViewCounter = () => {
    if (!window.profileViewCounter) {
        console.log('[ProfileViewCounter] Manual initialization...');
        window.profileViewCounter = new ProfileViewCounter();
    } else {
        console.log('[ProfileViewCounter] Already initialized');
    }
};

// Debug function
window.debugViewCounter = () => {
    if (window.profileViewCounter) {
        console.log('[ProfileViewCounter] Debug Status:', window.profileViewCounter.debugStatus());
    } else {
        console.log('[ProfileViewCounter] Not initialized yet');
    }
};

console.log('[ProfileViewCounter] Script loaded. Manual commands available:');
console.log('  - window.initViewCounter() - Force initialization');
console.log('  - window.debugViewCounter() - Check debug status');


class CustomContextMenu {
    constructor() {
        this.menu = null;
        this.isVisible = false;
        this.init();
    }
    
    init() {
        
        this.createMenu();
        
        
        document.addEventListener('contextmenu', (e) => this.showMenu(e));
        document.addEventListener('click', (e) => this.hideMenu(e));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.hideMenu();
        });
        
        
        const elementsToDisable = document.querySelectorAll('a, button, input, textarea, .social-link, .widget, .profile-card');
        elementsToDisable.forEach(element => {
            element.addEventListener('contextmenu', (e) => e.preventDefault());
        });
    }
    
    createMenu() {
        this.menu = document.createElement('div');
        this.menu.className = 'custom-context-menu';
        this.menu.innerHTML = `
            <div class="context-menu-item" data-action="copy-url">
                <i class="fas fa-link"></i>
                <span>Copy Page URL</span>
            </div>
            <div class="context-menu-item" data-action="view-source">
                <i class="fas fa-code"></i>
                <span>View Source Code</span>
            </div>
            <div class="context-menu-divider"></div>
            <div class="context-menu-item" data-action="credits">
                <i class="fas fa-user"></i>
                <span>Made by peps2ne</span>
            </div>
            <div class="context-menu-item" data-action="enhanced">
                <i class="fas fa-magic"></i>
                <span>Enhanced by conquestor</span>
            </div>
            <div class="context-menu-divider"></div>
            <div class="context-menu-item" data-action="music-toggle">
                <i class="fas fa-music"></i>
                <span>Toggle Music</span>
            </div>
            <div class="context-menu-item" data-action="performance">
                <i class="fas fa-tachometer-alt"></i>
                <span>Performance: <span id="perf-level">Auto</span></span>
            </div>
            <div class="context-menu-divider"></div>
            <div class="context-menu-item" data-action="love">
                <i class="fas fa-heart"></i>
                <span>Built with ❤️</span>
            </div>
        `;
        
        
        this.menu.addEventListener('click', (e) => this.handleMenuClick(e));
        
        document.body.appendChild(this.menu);
    }
    
    handleMenuClick(e) {
        const menuItem = e.target.closest('.context-menu-item');
        if (!menuItem) return;
        
        const action = menuItem.dataset.action;
        
        switch (action) {
            case 'copy-url':
                this.copyPageURL();
                break;
            case 'view-source':
                this.viewSourceCode();
                break;
            case 'credits':
                this.showCredits();
                break;
            case 'enhanced':
                this.showEnhanced();
                break;
            case 'music-toggle':
                this.toggleMusic();
                break;
            case 'performance':
                this.togglePerformance();
                break;
            case 'love':
                this.showLove();
                break;
        }
        
        this.hideMenu();
    }
    
    copyPageURL() {
        navigator.clipboard.writeText(window.location.href).then(() => {
            this.showNotification('URL Copied!', 'Page URL has been copied to clipboard', 'success');
        }).catch(() => {
            
            const textArea = document.createElement('textarea');
            textArea.value = window.location.href;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                this.showNotification('URL Copied!', 'Page URL has been copied to clipboard', 'success');
            } catch (err) {
                this.showNotification('Copy Failed', 'Unable to copy URL to clipboard', 'error');
            }
            document.body.removeChild(textArea);
        });
    }
    
    viewSourceCode() {
        this.showNotification('Source Code', 'Check out the source code on GitHub!', 'info');
        setTimeout(() => {
            window.open('https://github.com/peps2ne', '_blank');
        }, 1000);
    }
    
    showCredits() {
        this.showNotification('Credits', 'Made with ❤️ by peps2ne', 'success');
    }
    
    showEnhanced() {
        this.showNotification('Enhanced', 'Beautifully enhanced by conquestor ✨', 'info');
    }
    
    toggleMusic() {
        
        const playPauseBtn = document.getElementById('play-pause-btn');
        const audioControl = document.getElementById('audio-control');
        
        if (playPauseBtn) {
            playPauseBtn.click();
            const isPlaying = window.musicPlayer && window.musicPlayer.isPlaying;
            this.showNotification('Music', `Music ${isPlaying ? 'paused' : 'playing'}`, 'info');
        } else if (audioControl) {
            audioControl.click();
            this.showNotification('Music', 'Music toggled', 'info');
        } else {
            this.showNotification('Music', 'Music control not available', 'warning');
        }
    }
    
    togglePerformance() {
        if (window.performanceMonitor) {
            const currentLevel = window.performanceMonitor.performanceLevel;
            const levels = ['low', 'medium', 'high'];
            const currentIndex = levels.indexOf(currentLevel);
            const nextLevel = levels[(currentIndex + 1) % levels.length];
            
            window.performanceMonitor.forcePerformanceLevel(nextLevel);
            this.updatePerformanceDisplay(nextLevel);
            this.showNotification('Performance', `Performance set to ${nextLevel.toUpperCase()}`, 'info');
        } else {
            this.showNotification('Performance', 'Performance monitor not available', 'warning');
        }
    }
    
    updatePerformanceDisplay(level) {
        const perfLevelSpan = document.getElementById('perf-level');
        if (perfLevelSpan) {
            perfLevelSpan.textContent = level.toUpperCase();
        }
    }
    
    showLove() {
        this.showNotification('Love', 'Built with passion and creativity! ❤️🔥', 'success');
    }
    
    showNotification(title, message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `context-notification context-${type}`;
        
        const iconMap = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        
        notification.innerHTML = `
            <div class="context-notification-content">
                <div class="context-notification-icon">
                    <i class="fas fa-${iconMap[type]}"></i>
                </div>
                <div class="context-notification-text">
                    <div class="context-notification-title">${title}</div>
                    <div class="context-notification-message">${message}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
    
    showMenu(e) {
        e.preventDefault();
        
        
        if (window.performanceMonitor) {
            this.updatePerformanceDisplay(window.performanceMonitor.performanceLevel);
        }
        
        
        const menuWidth = 250;
        const menuHeight = 320;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        
        const margin = 20;
        let finalX = e.clientX;
        let finalY = e.clientY;
        
        
        if (finalX + menuWidth > viewportWidth - margin) {
            finalX = e.clientX - menuWidth - 10;
        } else {
            finalX = e.clientX + 10;
        }
        
        
        if (finalY + menuHeight > viewportHeight - margin) {
            if (e.clientY - menuHeight > margin) {
                finalY = e.clientY - menuHeight - 10;
            } else {
                finalY = viewportHeight - menuHeight - margin;
            }
        } else {
            finalY = e.clientY + 10;
        }
        
        
        finalX = Math.max(margin, Math.min(finalX, viewportWidth - menuWidth - margin));
        finalY = Math.max(margin, Math.min(finalY, viewportHeight - menuHeight - margin));
        
        
        this.menu.style.left = `${finalX}px`;
        this.menu.style.top = `${finalY}px`;
        this.menu.style.display = 'block';
        this.menu.style.opacity = '0';
        this.menu.style.transform = 'scale(0.9) translateY(-10px)';
        
        
        requestAnimationFrame(() => {
            this.menu.style.transition = 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
            this.menu.style.opacity = '1';
            this.menu.style.transform = 'scale(1) translateY(0)';
        });
        
        this.isVisible = true;
    }
    
    hideMenu(e) {
        if (!this.isVisible) return;
        
        
        if (e && this.menu.contains(e.target)) return;
        
        this.isVisible = false;
        
        this.menu.style.transition = 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)';
        this.menu.style.opacity = '0';
        this.menu.style.transform = 'scale(0.9) translateY(-10px)';
        
        setTimeout(() => {
            if (!this.isVisible) {
                this.menu.style.display = 'none';
            }
        }, 150);
    }
}


const contextMenuCSS = `
/* Custom Context Menu Styles */
.custom-context-menu {
    position: fixed;
    background: rgba(15, 15, 15, 0.95);
    border: 1px solid rgba(220, 38, 38, 0.3);
    border-radius: 12px;
    padding: 8px 0;
    min-width: 240px;
    z-index: 10000;
    display: none;
    backdrop-filter: blur(20px);
    box-shadow: 
        0 20px 40px rgba(0, 0, 0, 0.4),
        0 0 20px rgba(220, 38, 38, 0.1);
    font-family: 'Inter', sans-serif;
}

.context-menu-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    color: rgba(255, 255, 255, 0.9);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
    gap: 12px;
}

.context-menu-item:hover {
    background: rgba(220, 38, 38, 0.1);
    color: #ffffff;
    transform: translateX(2px);
}

.context-menu-item i {
    width: 16px;
    text-align: center;
    color: #dc2626;
    font-size: 14px;
}

.context-menu-divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    margin: 8px 16px;
}

#perf-level {
    color: #dc2626;
    font-weight: 600;
}

/* Context Menu Notifications */
.context-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(15, 15, 15, 0.95);
    border-radius: 12px;
    padding: 16px;
    min-width: 300px;
    max-width: 400px;
    z-index: 10001;
    backdrop-filter: blur(20px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    transform: translateX(100%) scale(0.9);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.context-notification.show {
    transform: translateX(0) scale(1);
    opacity: 1;
}

.context-notification-content {
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.context-notification-icon {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 12px;
}

.context-success {
    border: 1px solid rgba(34, 197, 94, 0.3);
}

.context-success .context-notification-icon {
    background: rgba(34, 197, 94, 0.2);
    color: #22c55e;
}

.context-error {
    border: 1px solid rgba(239, 68, 68, 0.3);
}

.context-error .context-notification-icon {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
}

.context-warning {
    border: 1px solid rgba(245, 158, 11, 0.3);
}

.context-warning .context-notification-icon {
    background: rgba(245, 158, 11, 0.2);
    color: #f59e0b;
}

.context-info {
    border: 1px solid rgba(59, 130, 246, 0.3);
}

.context-info .context-notification-icon {
    background: rgba(59, 130, 246, 0.2);
    color: #3b82f6;
}

.context-notification-text {
    flex: 1;
}

.context-notification-title {
    color: #ffffff;
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 4px;
}

.context-notification-message {
    color: rgba(255, 255, 255, 0.7);
    font-size: 12px;
    line-height: 1.4;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
    .custom-context-menu {
        min-width: 200px;
    }
    
    .context-menu-item {
        padding: 14px 16px;
        font-size: 16px;
    }
    
    .context-notification {
        right: 10px;
        left: 10px;
        min-width: auto;
        max-width: none;
        transform: translateY(-100%) scale(0.9);
    }
    
    .context-notification.show {
        transform: translateY(0) scale(1);
    }
}
`;


const contextMenuStyle = document.createElement('style');
contextMenuStyle.textContent = contextMenuCSS;
document.head.appendChild(contextMenuStyle);


document.addEventListener('DOMContentLoaded', () => {
    
    setTimeout(() => {
        window.customContextMenu = new CustomContextMenu();
        console.log('🎯 Custom context menu initialized');
    }, 1000);
});


class DiscordAvatarDecorations {
    constructor() {
        this.decorations = [
            {
                name: "Fire",
                url: "https://cdn.discordapp.com/avatar-decoration-presets/a_d1e5d3aabccb3d38f21b5ac8a33fcf4d.png"
            },
            
        ];
        
        this.currentIndex = 0;
        this.decorationImg = document.getElementById('avatar-decoration-img');
        this.isChanging = false;
        
        this.init();
    }
    
    init() {
        if (!this.decorationImg) return;
        
        
        this.enforceSizing();
        
        
        this.loadDecoration(0);
        
        
        this.addClickHandler();
        
        
        this.startAutoCycle();
        
        
        this.startSizeMonitoring();
        
        console.log('🎨 Discord avatar decorations loaded with size enforcement');
    }
    
    enforceSizing() {
        
        if (this.decorationImg) {
            this.decorationImg.style.cssText = `
                position: absolute !important;
                top: 50% !important;
                left: 50% !important;
                transform: translate(-50%, -50%) !important;
                width: 120px !important;
                height: 120px !important;
                max-width: 120px !important;
                max-height: 120px !important;
                z-index: 3 !important;
                pointer-events: none !important;
                object-fit: contain !important;
                box-sizing: border-box !important;
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
                outline: none !important;
                background: none !important;
                opacity: 1 !important;
                visibility: visible !important;
            `;
        }
        
        
        const mainAvatar = document.getElementById('main-avatar');
        if (mainAvatar) {
            mainAvatar.style.cssText = `
                position: absolute !important;
                top: 50% !important;
                left: 50% !important;
                transform: translate(-50%, -50%) !important;
                width: 80px !important;
                height: 80px !important;
                max-width: 80px !important;
                max-height: 80px !important;
                border-radius: 50% !important;
                z-index: 2 !important;
                border: 3px solid rgba(220, 38, 38, 0.3) !important;
                box-sizing: border-box !important;
                object-fit: cover !important;
                margin: 0 !important;
                padding: 0 !important;
                outline: none !important;
                background: none !important;
                opacity: 1 !important;
                visibility: visible !important;
            `;
        }
        
        
        const container = document.querySelector('.avatar-decoration-container');
        if (container) {
            container.style.cssText = `
                position: relative !important;
                display: inline-block !important;
                width: 120px !important;
                height: 120px !important;
                margin: 0 auto !important;
                box-sizing: border-box !important;
            `;
        }
    }
    
    startSizeMonitoring() {
        
        setInterval(() => {
            this.checkAndFixSizes();
        }, 2000);
        
        
        window.addEventListener('resize', () => {
            setTimeout(() => this.checkAndFixSizes(), 100);
        });
    }
    
    checkAndFixSizes() {
        if (this.decorationImg) {
            const rect = this.decorationImg.getBoundingClientRect();
            
            
            if (rect.width > 130 || rect.height > 130) {
                console.log('🔧 Fixing oversized decoration:', rect.width, 'x', rect.height);
                this.enforceSizing();
            }
        }
        
        const mainAvatar = document.getElementById('main-avatar');
        if (mainAvatar) {
            const rect = mainAvatar.getBoundingClientRect();
            
            
            if (rect.width > 90 || rect.height > 90) {
                console.log('🔧 Fixing oversized avatar:', rect.width, 'x', rect.height);
                this.enforceSizing();
            }
        }
    }
    
    loadDecoration(index) {
        if (this.isChanging) return;
        
        const decoration = this.decorations[index];
        if (!decoration) return;
        
        this.isChanging = true;
        
        
        this.decorationImg.style.opacity = '0';
        this.decorationImg.style.transform = 'translate(-50%, -50%) scale(0.8)';
        
        setTimeout(() => {
            
            this.decorationImg.src = decoration.url;
            this.decorationImg.alt = `${decoration.name} Avatar Decoration`;
            
            
            this.decorationImg.onload = () => {
                
                this.enforceSizing();
                
                
                this.decorationImg.style.opacity = '1';
                this.decorationImg.style.transform = 'translate(-50%, -50%) scale(1)';
                this.isChanging = false;
                
                
                this.showDecorationNotification(decoration.name);
            };
            
            
            this.decorationImg.onerror = () => {
                console.warn(`Failed to load decoration: ${decoration.name}`);
                this.decorationImg.style.opacity = '1';
                this.decorationImg.style.transform = 'translate(-50%, -50%) scale(1)';
                this.isChanging = false;
            };
        }, 300);
        
        this.currentIndex = index;
    }
    
    
}


document.addEventListener('DOMContentLoaded', () => {
    
    setTimeout(() => {
        window.discordAvatarDecorations = new DiscordAvatarDecorations();
        
        
        setTimeout(() => {
            if (window.discordAvatarDecorations) {
                window.discordAvatarDecorations.enforceSizing();
            }
        }, 1000);
    }, 500);
});


const decorationTransitionCSS = `
.discord-avatar-decoration {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.decoration-change-notification .notification-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.decoration-change-notification .notification-content i {
    font-size: 16px;
}
`;

const decorationStyle = document.createElement('style');
decorationStyle.textContent = decorationTransitionCSS;
document.head.appendChild(decorationStyle);


document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.discordAvatarDecorations = new DiscordAvatarDecorations();
    }, 1000);
});


class RedExplosionSystem {
    constructor() {
        this.container = null;
        this.explosions = [];
        this.isActive = true;
        this.performanceLevel = 'high';
        this.init();
    }
    
    init() {
        this.createContainer();
        this.startExplosionTimer();
        this.setupPerformanceIntegration();
        console.log('💥 Red Explosion System initialized');
    }
    
    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'explosion-container';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
        `;
        document.body.appendChild(this.container);
    }
    
    setupPerformanceIntegration() {

        if (window.performanceMonitor) {
            this.performanceLevel = window.performanceMonitor.performanceLevel;
        }
        
        
        document.addEventListener('performanceChange', (e) => {
            this.performanceLevel = e.detail.level;
            if (this.performanceLevel === 'low') {
                this.isActive = false;
            } else {
                this.isActive = true;
            }
        });
    }
    
    startExplosionTimer() {
        const createExplosion = () => {
            if (this.isActive && !document.hidden) {
                this.createExplosion();
            }
            
            
            let interval = 5000; 
            if (this.performanceLevel === 'high') interval = 3000; 
            if (this.performanceLevel === 'medium') interval = 6000; 
            if (this.performanceLevel === 'low') interval = 10000; 
            
            setTimeout(createExplosion, interval + Math.random() * 2000);
        };
        
        
        setTimeout(createExplosion, 2000);
    }
    
    createExplosion() {
        const explosion = new RedExplosion(this.container, this.performanceLevel);
        this.explosions.push(explosion);
        
        
        setTimeout(() => {
            const index = this.explosions.indexOf(explosion);
            if (index > -1) {
                this.explosions.splice(index, 1);
            }
        }, 4000);
    }
    
    
    triggerExplosion(x, y) {
        if (this.isActive) {
            new RedExplosion(this.container, this.performanceLevel, x, y);
        }
    }
    
    destroy() {
        this.isActive = false;
        if (this.container) {
            this.container.remove();
        }
        this.explosions = [];
    }
}


class RedExplosion {
    constructor(container, performanceLevel, x = null, y = null) {
        this.container = container;
        this.performanceLevel = performanceLevel;
        this.particles = [];
        this.center = this.getRandomPosition(x, y);
        this.particleCount = this.getParticleCount();
        
        this.createExplosion();
    }
    
    getRandomPosition(x, y) {
        if (x !== null && y !== null) {
            return { x, y };
        }
        
        return {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight
        };
    }
    
    getParticleCount() {
        switch (this.performanceLevel) {
            case 'high': return 25 + Math.floor(Math.random() * 15);
            case 'medium': return 15 + Math.floor(Math.random() * 10); 
            case 'low': return 8 + Math.floor(Math.random() * 7); 
            default: return 20;
        }
    }
    
    createExplosion() {
        
        this.createExplosionCore();
        
        
        for (let i = 0; i < this.particleCount; i++) {
            setTimeout(() => {
                this.createParticle(i);
            }, Math.random() * 100); 
        }
        
        
        if (this.performanceLevel === 'high') {
            this.createShockwave();
        }
    }
    
    createExplosionCore() {
        const core = document.createElement('div');
        core.className = 'explosion-core';
        
        const size = this.performanceLevel === 'high' ? 60 : 
                    this.performanceLevel === 'medium' ? 40 : 30;
        
        core.style.cssText = `
            position: absolute;
            left: ${this.center.x - size/2}px;
            top: ${this.center.y - size/2}px;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, 
                rgba(255, 255, 255, 0.9) 0%,
                rgba(255, 69, 0, 0.8) 20%,
                rgba(220, 38, 38, 0.6) 50%,
                transparent 100%);
            border-radius: 50%;
            animation: explosionCore 0.6s ease-out forwards;
            pointer-events: none;
        `;
        
        this.container.appendChild(core);
        
        
        setTimeout(() => core.remove(), 600);
    }
    
    createShockwave() {
        const shockwave = document.createElement('div');
        shockwave.className = 'explosion-shockwave';
        
        shockwave.style.cssText = `
            position: absolute;
            left: ${this.center.x}px;
            top: ${this.center.y}px;
            width: 0;
            height: 0;
            border: 2px solid rgba(220, 38, 38, 0.6);
            border-radius: 50%;
            animation: shockwaveExpand 1.5s ease-out forwards;
            pointer-events: none;
        `;
        
        this.container.appendChild(shockwave);
        
        
        setTimeout(() => shockwave.remove(), 1500);
    }
    
    createParticle(index) {
        const particle = document.createElement('div');
        particle.className = 'explosion-particle';
        
        
        const angle = (Math.PI * 2 * index) / this.particleCount + (Math.random() - 0.5) * 0.5;
        const velocity = 50 + Math.random() * 100;
        const size = 3 + Math.random() * 6;
        const life = 1000 + Math.random() * 1500;
        
        
        const endX = this.center.x + Math.cos(angle) * velocity;
        const endY = this.center.y + Math.sin(angle) * velocity + Math.random() * 50; 
        
        
        const colors = [
            'rgba(220, 38, 38, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(255, 69, 0, 1)',
            'rgba(255, 99, 71, 1)',
            'rgba(178, 34, 34, 1)'
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            position: absolute;
            left: ${this.center.x}px;
            top: ${this.center.y}px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            box-shadow: 0 0 ${size * 2}px ${color};
            animation: particleFly ${life}ms ease-out forwards;
            --end-x: ${endX}px;
            --end-y: ${endY}px;
            --start-x: ${this.center.x}px;
            --start-y: ${this.center.y}px;
        `;
        
        this.container.appendChild(particle);
        this.particles.push(particle);
        
        
        setTimeout(() => {
            particle.remove();
            const idx = this.particles.indexOf(particle);
            if (idx > -1) this.particles.splice(idx, 1);
        }, life);
    }
}


class ClickExplosionHandler {
    constructor(explosionSystem) {
        this.explosionSystem = explosionSystem;
        this.cooldown = false;
        this.init();
    }
    
    init() {
        document.addEventListener('click', (e) => {
            if (this.cooldown) return;
            
            
            if (e.target.closest('button, a, input, .widget, .profile-card, .custom-context-menu')) {
                return;
            }
            
            this.explosionSystem.triggerExplosion(e.clientX, e.clientY);
            
            
            this.cooldown = true;
            setTimeout(() => {
                this.cooldown = false;
            }, 1000);
        });
    }
}


const explosionCSS = `
/* Explosion Animations */
@keyframes explosionCore {
    0% {
        transform: scale(0);
        opacity: 1;
    }
    50% {
        transform: scale(1);
        opacity: 0.8;
    }
    100% {
        transform: scale(2);
        opacity: 0;
    }
}

@keyframes shockwaveExpand {
    0% {
        width: 0;
        height: 0;
        margin-left: 0;
        margin-top: 0;
        opacity: 1;
    }
    100% {
        width: 300px;
        height: 300px;
        margin-left: -150px;
        margin-top: -150px;
        opacity: 0;
    }
}

@keyframes particleFly {
    0% {
        transform: translate(0, 0) scale(1);
        opacity: 1;
    }
    50% {
        opacity: 0.8;
    }
    100% {
        transform: translate(
            calc(var(--end-x) - var(--start-x)),
            calc(var(--end-y) - var(--start-y))
        ) scale(0);
        opacity: 0;
    }
}

/* Performance optimizations */
.explosion-container * {
    will-change: transform, opacity;
}

/* Disable on low performance */
.perf-low .explosion-container {
    display: none !important;
}

/* Reduce particles on medium performance */
@media (max-width: 768px) {
    .explosion-container {
        opacity: 0.7;
    }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
    .explosion-container {
        display: none !important;
    }
}
`;


const explosionStyle = document.createElement('style');
explosionStyle.textContent = explosionCSS;
document.head.appendChild(explosionStyle);


document.addEventListener('DOMContentLoaded', () => {
    
    setTimeout(() => {
        if (window.innerWidth > 768) { 
            window.redExplosionSystem = new RedExplosionSystem();
            window.clickExplosionHandler = new ClickExplosionHandler(window.redExplosionSystem);
            console.log('💥 Red explosions ready! Click anywhere to explode!');
        }
    }, 2000);
});


class ExplosionPatterns {
    static chainExplosion(explosionSystem, startX, startY, count = 5) {
        let currentX = startX;
        let currentY = startY;
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                explosionSystem.triggerExplosion(currentX, currentY);
                
                
                currentX += (Math.random() - 0.5) * 200;
                currentY += (Math.random() - 0.5) * 200;
                
                
                currentX = Math.max(50, Math.min(window.innerWidth - 50, currentX));
                currentY = Math.max(50, Math.min(window.innerHeight - 50, currentY));
            }, i * 300);
        }
    }
    
    static ringExplosion(explosionSystem, centerX, centerY, radius = 150) {
        const explosionCount = 8;
        
        for (let i = 0; i < explosionCount; i++) {
            setTimeout(() => {
                const angle = (Math.PI * 2 * i) / explosionCount;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                explosionSystem.triggerExplosion(x, y);
            }, i * 100);
        }
    }
}


document.addEventListener('keydown', (e) => {
    if (!window.redExplosionSystem) return;
    
    
    if (e.key === 'e' && e.ctrlKey) {
        e.preventDefault();
        ExplosionPatterns.chainExplosion(
            window.redExplosionSystem,
            window.innerWidth / 2,
            window.innerHeight / 2,
            7
        );
    }
    
    if (e.key === 'r' && e.ctrlKey) {
        e.preventDefault();
        ExplosionPatterns.ringExplosion(
            window.redExplosionSystem,
            window.innerWidth / 2,
            window.innerHeight / 2,
            200
        );
    }
});


class ExplosionSpeedController {
    constructor(explosionSystem) {
        this.explosionSystem = explosionSystem;
        this.speeds = {
            'very-slow': {
                name: 'Very Slow',
                explosionInterval: 10000, 
                particleLife: 3000, 
                coreAnimation: 1200, 
                shockwaveAnimation: 3000, 
                multiplier: 2.0
            },
            'slow': {
                name: 'Slow',
                explosionInterval: 7000, 
                particleLife: 2000, 
                coreAnimation: 900, 
                shockwaveAnimation: 2200, 
                multiplier: 1.5
            },
            'normal': {
                name: 'Normal',
                explosionInterval: 5000, 
                particleLife: 1500, 
                coreAnimation: 600, 
                shockwaveAnimation: 1500, 
                multiplier: 1.0
            },
            'fast': {
                name: 'Fast',
                explosionInterval: 3000, 
                particleLife: 1000, 
                coreAnimation: 400, 
                shockwaveAnimation: 1000, 
                multiplier: 0.7
            },
            'very-fast': {
                name: 'Very Fast',
                explosionInterval: 1500, 
                particleLife: 600, 
                coreAnimation: 300, 
                shockwaveAnimation: 800, 
                multiplier: 0.5
            },
            'insane': {
                name: 'Insane',
                explosionInterval: 800, 
                particleLife: 400, 
                coreAnimation: 200, 
                shockwaveAnimation: 500, 
                multiplier: 0.3
            }
        };
        
        this.currentSpeed = 'normal';
        this.init();
    }
    
    init() {
        this.createSpeedControls();
        this.updateExplosionSystem();
    }
    
    createSpeedControls() {
        
        const speedControl = document.createElement('div');
        speedControl.className = 'explosion-speed-control';
        speedControl.innerHTML = `
            <div class="speed-control-header">
                <i class="fas fa-tachometer-alt"></i>
                <span>Explosion Speed</span>
            </div>
            <div class="speed-buttons">
                ${Object.keys(this.speeds).map(speed => `
                    <button class="speed-btn ${speed === 'normal' ? 'active' : ''}" 
                            data-speed="${speed}">
                        ${this.speeds[speed].name}
                    </button>
                `).join('')}
            </div>
            <div class="speed-shortcuts">
                <small>Shortcuts: 1-6 keys or Shift+Scroll</small>
            </div>
        `;
        
        
        speedControl.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(15, 15, 15, 0.95);
            border: 1px solid rgba(220, 38, 38, 0.3);
            border-radius: 12px;
            padding: 1rem;
            z-index: 9999;
            backdrop-filter: blur(20px);
            font-family: 'Inter', sans-serif;
            min-width: 200px;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
        `;
        
        
        const toggleBtn = document.createElement('div');
        toggleBtn.className = 'speed-control-toggle';
        toggleBtn.innerHTML = '<i class="fas fa-cog"></i>';
        toggleBtn.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(220, 38, 38, 0.2);
            border: 1px solid rgba(220, 38, 38, 0.4);
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 10000;
            color: #dc2626;
            font-size: 18px;
            transition: all 0.3s ease;
        `;
        
        
        let isVisible = false;
        toggleBtn.addEventListener('click', () => {
            isVisible = !isVisible;
            speedControl.style.transform = isVisible ? 'translateX(60px)' : 'translateX(-100%)';
            toggleBtn.style.transform = isVisible ? 'rotate(180deg)' : 'rotate(0deg)';
        });
        
        
        speedControl.addEventListener('click', (e) => {
            if (e.target.classList.contains('speed-btn')) {
                this.setSpeed(e.target.dataset.speed);
                
                
                speedControl.querySelectorAll('.speed-btn').forEach(btn => 
                    btn.classList.remove('active'));
                e.target.classList.add('active');
            }
        });
        
        document.body.appendChild(toggleBtn);
        document.body.appendChild(speedControl);
        
        
        this.addKeyboardShortcuts();
        
        
        this.addScrollControl();
    }
    
    addKeyboardShortcuts() {
        const speedKeys = {
            '1': 'very-slow',
            '2': 'slow', 
            '3': 'normal',
            '4': 'fast',
            '5': 'very-fast',
            '6': 'insane'
        };
        
        document.addEventListener('keydown', (e) => {
            if (speedKeys[e.key]) {
                this.setSpeed(speedKeys[e.key]);
                this.updateActiveButton(speedKeys[e.key]);
                this.showSpeedNotification(this.speeds[speedKeys[e.key]].name);
            }
        });
    }
    
    addScrollControl() {
        document.addEventListener('wheel', (e) => {
            if (!e.shiftKey) return;
            
            e.preventDefault();
            
            const speedList = Object.keys(this.speeds);
            const currentIndex = speedList.indexOf(this.currentSpeed);
            
            let newIndex;
            if (e.deltaY > 0) {
                
                newIndex = Math.min(currentIndex + 1, speedList.length - 1);
            } else {
                
                newIndex = Math.max(currentIndex - 1, 0);
            }
            
            const newSpeed = speedList[newIndex];
            if (newSpeed !== this.currentSpeed) {
                this.setSpeed(newSpeed);
                this.updateActiveButton(newSpeed);
                this.showSpeedNotification(this.speeds[newSpeed].name);
            }
        }, { passive: false });
    }
    
    setSpeed(speedName) {
        if (!this.speeds[speedName]) return;
        
        this.currentSpeed = speedName;
        this.updateExplosionSystem();
        this.updateCSS();
        
        console.log(`💥 Explosion speed set to: ${this.speeds[speedName].name}`);
    }
    
    updateExplosionSystem() {
        const speed = this.speeds[this.currentSpeed];
        
        if (this.explosionSystem) {
            
            this.explosionSystem.currentSpeed = speed;
            
            
            this.explosionSystem.restartTimer(speed.explosionInterval);
        }
    }
    
    updateCSS() {
        const speed = this.speeds[this.currentSpeed];
        
        
        const dynamicStyle = document.getElementById('dynamic-explosion-speed') || 
                           document.createElement('style');
        dynamicStyle.id = 'dynamic-explosion-speed';
        
        dynamicStyle.textContent = `
            .explosion-core {
                animation-duration: ${speed.coreAnimation}ms !important;
            }
            
            .explosion-shockwave {
                animation-duration: ${speed.shockwaveAnimation}ms !important;
            }
            
            .explosion-particle {
                animation-duration: ${speed.particleLife}ms !important;
            }
        `;
        
        if (!document.getElementById('dynamic-explosion-speed')) {
            document.head.appendChild(dynamicStyle);
        }
    }
    
    updateActiveButton(speedName) {
        const speedControl = document.querySelector('.explosion-speed-control');
        if (speedControl) {
            speedControl.querySelectorAll('.speed-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.speed === speedName);
            });
        }
    }
    
    showSpeedNotification(speedName) {
        const notification = document.createElement('div');
        notification.className = 'speed-notification';
        notification.innerHTML = `
            <i class="fas fa-tachometer-alt"></i>
            <span>Speed: ${speedName}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            background: rgba(15, 15, 15, 0.95);
            border: 1px solid rgba(220, 38, 38, 0.4);
            color: #dc2626;
            padding: 1rem 2rem;
            border-radius: 25px;
            z-index: 10001;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            backdrop-filter: blur(20px);
        `;
        
        document.body.appendChild(notification);
        
        
        setTimeout(() => {
            notification.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 50);
        
        
        setTimeout(() => {
            notification.style.transform = 'translate(-50%, -50%) scale(0)';
            setTimeout(() => notification.remove(), 300);
        }, 1000);
    }
}


class RedExplosionSystemWithSpeed extends RedExplosionSystem {
    constructor() {
        super();
        this.currentSpeed = null;
        this.explosionTimer = null;
    }
    
    startExplosionTimer() {
        
        this.restartTimer(5000); 
    }
    
    restartTimer(interval) {
        
        if (this.explosionTimer) {
            clearTimeout(this.explosionTimer);
        }
        
        const createExplosion = () => {
            if (this.isActive && !document.hidden) {
                this.createExplosion();
            }
            
            
            let nextInterval = interval;
            if (this.currentSpeed) {
                nextInterval = this.currentSpeed.explosionInterval;
            }
            
            
            nextInterval += Math.random() * 1000;
            
            this.explosionTimer = setTimeout(createExplosion, nextInterval);
        };
        
        
        this.explosionTimer = setTimeout(createExplosion, 2000);
    }
    
    createExplosion() {
        const explosion = new RedExplosionWithSpeed(
            this.container, 
            this.performanceLevel,
            this.currentSpeed
        );
        this.explosions.push(explosion);
        
        
        const cleanupTime = this.currentSpeed ? 
            this.currentSpeed.particleLife + 1000 : 4000;
            
        setTimeout(() => {
            const index = this.explosions.indexOf(explosion);
            if (index > -1) {
                this.explosions.splice(index, 1);
            }
        }, cleanupTime);
    }
}


class RedExplosionWithSpeed extends RedExplosion {
    constructor(container, performanceLevel, speedConfig, x = null, y = null) {
        super(container, performanceLevel, x, y);
        this.speedConfig = speedConfig;
    }
    
    createParticle(index) {
        const particle = document.createElement('div');
        particle.className = 'explosion-particle';
        
        
        const life = this.speedConfig ? 
            this.speedConfig.particleLife : 
            (1000 + Math.random() * 1500);
        
        
        const angle = (Math.PI * 2 * index) / this.particleCount + (Math.random() - 0.5) * 0.5;
        const velocity = 50 + Math.random() * 100;
        const size = 3 + Math.random() * 6;
        
        const endX = this.center.x + Math.cos(angle) * velocity;
        const endY = this.center.y + Math.sin(angle) * velocity + Math.random() * 50;
        
        const colors = [
            'rgba(220, 38, 38, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(255, 69, 0, 1)',
            'rgba(255, 99, 71, 1)',
            'rgba(178, 34, 34, 1)'
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            position: absolute;
            left: ${this.center.x}px;
            top: ${this.center.y}px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            box-shadow: 0 0 ${size * 2}px ${color};
            animation: particleFly ${life}ms ease-out forwards;
            --end-x: ${endX}px;
            --end-y: ${endY}px;
            --start-x: ${this.center.x}px;
            --start-y: ${this.center.y}px;
        `;
        
        this.container.appendChild(particle);
        this.particles.push(particle);
        
        setTimeout(() => {
            particle.remove();
            const idx = this.particles.indexOf(particle);
            if (idx > -1) this.particles.splice(idx, 1);
        }, life);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.innerWidth > 768) {
            
            window.redExplosionSystem = new RedExplosionSystemWithSpeed();
            window.explosionSpeedController = new ExplosionSpeedController(window.redExplosionSystem);
            window.clickExplosionHandler = new ClickExplosionHandler(window.redExplosionSystem);
            
            console.log('💥 Red explosions with speed control ready!');
        }
    }, 2000);
});


class KonamiFlappyBird {
    constructor() {
        this.konamiCode = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];
        this.userInput = [];
        this.gameContainer = null;
        this.canvas = null;
        this.ctx = null;
        this.gameActive = false;
        this.animationId = null;
        
        
        this.particles = [];
        this.backgroundParticles = [];
        
        
        this.bird = { 
            x: 100, 
            y: 600, 
            width: 40, 
            height: 50, 
            velocity: 0,
            angle: 0,
            trail: []
        };
        this.pipes = [];
        this.score = 0;
        this.gameSpeed = 3;
        this.time = 0;
        
        this.init();
    }
    
    init() {
        this.setupKonamiListener();
        console.log('🎮 Konami Code listener active! (↑↑↓↓←→←→BA)');
    }
    
    setupKonamiListener() {
        document.addEventListener('keydown', (e) => {
            this.userInput.push(e.code);
            
            if (this.userInput.length > this.konamiCode.length) {
                this.userInput.shift();
            }
            
            if (this.userInput.length === this.konamiCode.length) {
                const isMatch = this.konamiCode.every((code, index) => 
                    this.userInput[index] === code
                );
                
                if (isMatch) {
                    this.activateKonamiMode();
                    this.userInput = [];
                }
            }
        });
    }
    
    activateKonamiMode() {
        console.log('🎉 KONAMI CODE ACTIVATED!');
        this.showKonamiNotification();
        setTimeout(() => {
            this.startFlappyBird();
        }, 2500);
    }
    
    showKonamiNotification() {
        const notification = document.createElement('div');
        notification.className = 'konami-notification';
        notification.innerHTML = `
            <div class="konami-content">
                <div class="konami-glitch" data-text="KONAMI CODE ACTIVATED">KONAMI CODE ACTIVATED</div>
                <div class="konami-subtitle">🔥 INITIALIZING FLAPPY BIRD 2077 🔥</div>
                <div class="konami-loading">
                    <div class="loading-bar"></div>
                </div>
                <div class="loading-text">Loading epic graphics...</div>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 20% 80%, rgba(220, 38, 38, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 69, 0, 0.3) 0%, transparent 50%),
                linear-gradient(135deg, #000 0%, #111 50%, #000 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            color: #fff;
            font-family: 'Courier New', monospace;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.5s ease-in';
            setTimeout(() => notification.remove(), 500);
        }, 2500);
    }
    
    startFlappyBird() {
        this.createGameContainer();
        this.createCanvas();
        this.resetGame();
        this.createBackgroundParticles();
        this.gameLoop();
        this.setupGameControls();
        
        console.log('🐦 FIRE Flappy Bird started!');
    }
    
    createGameContainer() {
        this.gameContainer = document.createElement('div');
        this.gameContainer.className = 'flappy-bird-container';
        this.gameContainer.innerHTML = `
            <div class="game-header">
                <div class="game-title">🔥 FLAPPY BIRD 2077</div>
                <div class="game-score">
                    <span class="score-label">SCORE</span>
                    <span class="score-number" id="flappy-score">0000</span>
                </div>
                <button class="close-game-btn" id="close-flappy">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="game-canvas-container">
                <canvas id="flappy-canvas" width="1000" height="600"></canvas>
                <div class="canvas-overlay">
                    <div class="scan-lines"></div>
                </div>
            </div>
            <div class="game-controls">
                <div class="control-hint">
                    <kbd>SPACE</kbd> or <kbd>CLICK</kbd> to flap
                </div>
                <div class="control-hint">
                    <kbd>ESC</kbd> to exit
                </div>
            </div>
        `;
        
        this.gameContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: 
                radial-gradient(circle at center, rgba(15, 15, 15, 0.98) 0%, rgba(0, 0, 0, 0.99) 100%);
            border: 2px solid transparent;
            border-image: linear-gradient(45deg, #dc2626, #ff4500, #dc2626) 1;
            border-radius: 20px;
            padding: 25px;
            z-index: 100000;
            box-shadow: 
                0 0 100px rgba(220, 38, 38, 0.5),
                inset 0 0 50px rgba(255, 69, 0, 0.1);
            backdrop-filter: blur(20px);
            animation: gameSlideIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
            max-width: 90vw;
            max-height: 90vh;
        `;
        
        document.body.appendChild(this.gameContainer);
    }
    
    createCanvas() {
        this.canvas = document.getElementById('flappy-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameActive = true;
        
        
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        this.canvas.width = Math.min(1000, rect.width - 40);
        this.canvas.height = Math.min(600, rect.height - 40);
    }
    
    createBackgroundParticles() {
        for (let i = 0; i < 100; i++) {
            this.backgroundParticles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                speed: Math.random() * 0.5 + 0.1,
                opacity: Math.random() * 0.5 + 0.1,
                color: Math.random() > 0.5 ? '#dc2626' : '#ff4500'
            });
        }
    }
    
    setupGameControls() {
        document.getElementById('close-flappy').addEventListener('click', () => {
            this.endGame();
        });
        
        document.addEventListener('keydown', this.handleGameInput.bind(this));
        this.canvas.addEventListener('click', this.handleGameInput.bind(this));
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.gameActive) {
                this.endGame();
            }
        });
    }
    
    handleGameInput(e) {
        if (!this.gameActive) return;
        
        if (e.key === ' ' || e.type === 'click') {
            e.preventDefault();
            this.bird.velocity = -12;
            this.bird.angle = -20;
            
            
            this.createFlapParticles();
        }
    }
    
    createFlapParticles() {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: this.bird.x,
                y: this.bird.y + this.bird.height / 2,
                vx: (Math.random() - 0.5) * 10,
                vy: Math.random() * 5 + 2,
                size: Math.random() * 4 + 2,
                life: 1,
                decay: 0.02,
                color: `hsl(${Math.random() * 60 + 10}, 100%, 60%)`
            });
        }
    }
    
    resetGame() {
        this.bird = { 
            x: 100, 
            y: 300, 
            width: 40, 
            height: 30, 
            velocity: 0,
            angle: 0,
            trail: []
        };
        this.pipes = [];
        this.particles = [];
        this.score = 0;
        this.gameSpeed = 3;
        this.time = 0;
        
        
        for (let i = 0; i < 4; i++) {
            this.createPipe(this.canvas.width + i * 300);
        }
    }
    
    createPipe(x) {
        const gapHeight = 180;
        const pipeWidth = 80;
        const gapY = Math.random() * (this.canvas.height - gapHeight - 200) + 100;
        
        this.pipes.push({
            x: x,
            topHeight: gapY,
            bottomY: gapY + gapHeight,
            bottomHeight: this.canvas.height - (gapY + gapHeight),
            width: pipeWidth,
            passed: false,
            glowIntensity: 0
        });
    }
    
    gameLoop() {
        if (!this.gameActive) return;
        
        this.time += 0.016;
        this.update();
        this.draw();
        
        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        
        this.bird.velocity += 0.8; 
        this.bird.y += this.bird.velocity;
        
        
        this.bird.angle += (this.bird.velocity * 3 - this.bird.angle) * 0.1;
        this.bird.angle = Math.max(-30, Math.min(30, this.bird.angle));
        
        
        this.bird.trail.push({ x: this.bird.x, y: this.bird.y + this.bird.height / 2 });
        if (this.bird.trail.length > 10) {
            this.bird.trail.shift();
        }
        
        
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2;
            p.life -= p.decay;
            p.size *= 0.98;
            return p.life > 0;
        });
        
        
        this.backgroundParticles.forEach(p => {
            p.x -= p.speed;
            if (p.x < -5) {
                p.x = this.canvas.width + 5;
                p.y = Math.random() * this.canvas.height;
            }
        });
        
        
        this.pipes.forEach(pipe => {
            pipe.x -= this.gameSpeed;
            
            
            if (!pipe.passed && pipe.x + pipe.width < this.bird.x) {
                pipe.passed = true;
                this.score++;
                pipe.glowIntensity = 1;
                document.getElementById('flappy-score').textContent = 
                    this.score.toString().padStart(4, '0');
                this.gameSpeed += 0.1;
                
                
                this.createScoreParticles();
            }
            
            
            pipe.glowIntensity *= 0.95;
        });
        
        
        this.pipes = this.pipes.filter(pipe => pipe.x > -pipe.width);
        
        if (this.pipes.length < 4) {
            const lastPipe = this.pipes[this.pipes.length - 1];
            this.createPipe(lastPipe.x + 300);
        }
        
        
        if (this.checkCollision()) {
            this.gameOver();
        }
        
        
        if (this.bird.y < 0) this.bird.y = 0;
        if (this.bird.y > this.canvas.height - this.bird.height) {
            this.gameOver();
        }
    }
    
    createScoreParticles() {
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: this.bird.x + this.bird.width,
                y: this.bird.y + this.bird.height / 2,
                vx: Math.random() * 8 - 4,
                vy: Math.random() * -8 - 2,
                size: Math.random() * 6 + 3,
                life: 1,
                decay: 0.015,
                color: '#00ff00'
            });
        }
    }
    
    checkCollision() {
        for (let pipe of this.pipes) {
            if (this.bird.x < pipe.x + pipe.width &&
                this.bird.x + this.bird.width > pipe.x) {
                
                if (this.bird.y < pipe.topHeight || 
                    this.bird.y + this.bird.height > pipe.bottomY) {
                    return true;
                }
            }
        }
        return false;
    }
    
    draw() {
        
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#000510');
        gradient.addColorStop(0.5, '#001122');
        gradient.addColorStop(1, '#000510');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        
        this.drawAnimatedBackground();
        
        
        this.backgroundParticles.forEach(p => {
            this.ctx.globalAlpha = p.opacity;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
        
        
        this.drawBirdTrail();
        
        
        this.drawPipes();
        
        
        this.drawBird();
        
        
        this.drawParticles();
        
        
        this.drawUI();
    }
    
    drawAnimatedBackground() {
        
        this.ctx.strokeStyle = 'rgba(220, 38, 38, 0.1)';
        this.ctx.lineWidth = 1;
        
        const gridSize = 50;
        const offset = (this.time * 50) % gridSize;
        
        for (let x = -offset; x < this.canvas.width + gridSize; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y < this.canvas.height + gridSize; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    drawBirdTrail() {
        if (this.bird.trail.length < 2) return;
        
        this.ctx.strokeStyle = 'rgba(255, 69, 0, 0.6)';
        this.ctx.lineWidth = 8;
        this.ctx.lineCap = 'round';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#ff4500';
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.bird.trail[0].x, this.bird.trail[0].y);
        
        for (let i = 1; i < this.bird.trail.length; i++) {
            this.ctx.globalAlpha = i / this.bird.trail.length * 0.8;
            this.ctx.lineTo(this.bird.trail[i].x, this.bird.trail[i].y);
        }
        
        this.ctx.stroke();
        this.ctx.globalAlpha = 1;
        this.ctx.shadowBlur = 0;
    }
    
    drawPipes() {
        this.pipes.forEach(pipe => {
            
            const gradient = this.ctx.createLinearGradient(pipe.x, 0, pipe.x + pipe.width, 0);
            gradient.addColorStop(0, '#333');
            gradient.addColorStop(0.3, '#666');
            gradient.addColorStop(0.7, '#444');
            gradient.addColorStop(1, '#222');
            
            this.ctx.fillStyle = gradient;
            
            
            this.ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
            
            this.ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, pipe.bottomHeight);
            
            
            this.ctx.strokeStyle = pipe.glowIntensity > 0.1 ? '#00ff00' : '#dc2626';
            this.ctx.lineWidth = 3;
            this.ctx.shadowBlur = pipe.glowIntensity * 20;
            this.ctx.shadowColor = pipe.glowIntensity > 0.1 ? '#00ff00' : '#dc2626';
            
            this.ctx.strokeRect(pipe.x, 0, pipe.width, pipe.topHeight);
            this.ctx.strokeRect(pipe.x, pipe.bottomY, pipe.width, pipe.bottomHeight);
            
            this.ctx.shadowBlur = 0;
            
            
            const capHeight = 30;
            this.ctx.fillStyle = '#555';
            this.ctx.fillRect(pipe.x - 5, pipe.topHeight - capHeight, pipe.width + 10, capHeight);
            this.ctx.fillRect(pipe.x - 5, pipe.bottomY, pipe.width + 10, capHeight);
        });
    }
    
    drawBird() {
        this.ctx.save();
        this.ctx.translate(this.bird.x + this.bird.width / 2, this.bird.y + this.bird.height / 2);
        this.ctx.rotate(this.bird.angle * Math.PI / 180);
        
        
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = '#ff4500';
        
        
        const birdGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, this.bird.width / 2);
        birdGradient.addColorStop(0, '#ff6600');
        birdGradient.addColorStop(0.7, '#ff4400');
        birdGradient.addColorStop(1, '#cc2200');
        
        this.ctx.fillStyle = birdGradient;
        this.ctx.fillRect(-this.bird.width / 2, -this.bird.height / 2, this.bird.width, this.bird.height);
        
        
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(-this.bird.width / 2, -this.bird.height / 2, this.bird.width, this.bird.height);
        
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(5, -5, 6, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(7, -5, 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
        this.ctx.shadowBlur = 0;
    }
    
    drawParticles() {
        this.particles.forEach(p => {
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
        this.ctx.shadowBlur = 0;
    }
    
    drawUI() {
        
        this.ctx.font = 'bold 48px Courier New';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = '#00ff00';
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = '#00ff00';
        this.ctx.fillText(this.score.toString().padStart(4, '0'), this.canvas.width / 2, 60);
        this.ctx.shadowBlur = 0;
    }
    
    gameOver() {
        this.gameActive = false;
        
        
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: this.bird.x + this.bird.width / 2,
                y: this.bird.y + this.bird.height / 2,
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 0.5) * 20,
                size: Math.random() * 8 + 4,
                life: 1,
                decay: 0.01,
                color: '#ff0000'
            });
        }
        
        setTimeout(() => {
            const gameOver = document.createElement('div');
            gameOver.className = 'flappy-game-over';
            gameOver.innerHTML = `
                <div class="game-over-content">
                    <div class="game-over-glitch" data-text="GAME OVER">GAME OVER</div>
                    <div class="final-score">FINAL SCORE: ${this.score.toString().padStart(4, '0')}</div>
                    <div class="game-over-buttons">
                        <button id="restart-flappy" class="game-btn restart-btn">
                            <i class="fas fa-redo"></i> RESTART
                        </button>
                        <button id="quit-flappy" class="game-btn quit-btn">
                            <i class="fas fa-times"></i> QUIT
                        </button>
                    </div>
                </div>
            `;
            
            gameOver.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ff4444;
                font-family: 'Courier New', monospace;
                z-index: 1000;
                animation: gameOverSlide 0.5s ease-out;
            `;
            
            this.gameContainer.appendChild(gameOver);
            
            document.getElementById('restart-flappy').addEventListener('click', () => {
                gameOver.remove();
                this.resetGame();
                this.gameActive = true;
                this.gameLoop();
            });
            
            document.getElementById('quit-flappy').addEventListener('click', () => {
                this.endGame();
            });
        }, 1000);
    }
    
    endGame() {
        this.gameActive = false;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.gameContainer) {
            this.gameContainer.style.animation = 'gameSlideOut 0.5s ease-in forwards';
            setTimeout(() => {
                this.gameContainer.remove();
            }, 500);
        }
        
        console.log('🎮 Flappy Bird closed');
    }
}


const flappyBirdCSS = `
/* Epic Flappy Bird Styles */
@keyframes fadeOut {
    to { opacity: 0; transform: scale(0.8); }
}

@keyframes gameSlideIn {
    0% { 
        opacity: 0; 
        transform: translate(-50%, -50%) scale(0.8) rotateX(-15deg); 
    }
    100% { 
        opacity: 1; 
        transform: translate(-50%, -50%) scale(1) rotateX(0deg); 
    }
}

@keyframes gameSlideOut {
    0% { 
        opacity: 1; 
        transform: translate(-50%, -50%) scale(1) rotateX(0deg); 
    }
    100% { 
        opacity: 0; 
        transform: translate(-50%, -50%) scale(0.8) rotateX(15deg); 
    }
}

@keyframes gameOverSlide {
    0% { 
        opacity: 0; 
        transform: translateY(-50px); 
    }
    100% { 
        opacity: 1; 
        transform: translateY(0); 
    }
}

.konami-content {
    text-align: center;
    background: rgba(0, 0, 0, 0.95);
    padding: 4rem;
    border: 3px solid;
    border-image: linear-gradient(45deg, #dc2626, #ff4500, #dc2626) 1;
    border-radius: 15px;
    box-shadow: 
        0 0 100px rgba(220, 38, 38, 0.8),
        inset 0 0 50px rgba(255, 69, 0, 0.2);
}

.konami-glitch {
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    text-shadow: 
        0 0 20px #dc2626,
        2px 2px 0px #ff4500,
        -2px -2px 0px #00ff00;
    animation: glitchText 2s ease-in-out infinite;
    position: relative;
}

.konami-glitch::before,
.konami-glitch::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.konami-glitch::before {
    animation: glitchBefore 2s ease-in-out infinite;
    color: #ff4500;
}

.konami-glitch::after {
    animation: glitchAfter 2s ease-in-out infinite;
    color: #00ff00;
}

@keyframes glitchText {
    0%, 90%, 100% { transform: translate(0); }
    10% { transform: translate(-2px, 1px); }
    20% { transform: translate(2px, -1px); }
    30% { transform: translate(-1px, 2px); }
    40% { transform: translate(1px, -2px); }
    50% { transform: translate(-2px, 2px); }
    60% { transform: translate(2px, -2px); }
    70% { transform: translate(-1px, -1px); }
    80% { transform: translate(1px, 1px); }
}

@keyframes glitchBefore {
    0%, 90%, 100% { clip-path: inset(0 0 0 0); }
    10% { clip-path: inset(10% 0 85% 0); }
    20% { clip-path: inset(80% 0 10% 0); }
    30% { clip-path: inset(50% 0 30% 0); }
    40% { clip-path: inset(20% 0 60% 0); }
    50% { clip-path: inset(90% 0 5% 0); }
}

@keyframes glitchAfter {
    0%, 90%, 100% { clip-path: inset(0 0 0 0); }
    10% { clip-path: inset(85% 0 10% 0); }
    20% { clip-path: inset(10% 0 80% 0); }
    30% { clip-path: inset(30% 0 50% 0); }
    40% { clip-path: inset(60% 0 20% 0); }
    50% { clip-path: inset(5% 0 90% 0); }
}

.konami-subtitle {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    color: #ff4500;
    text-shadow: 0 0 10px #ff4500;
}

.konami-loading {
    width: 400px;
    height: 25px;
    border: 2px solid #dc2626;
    border-radius: 15px;
    overflow: hidden;
    margin: 0 auto 1rem;
    background: rgba(0, 0, 0, 0.5);
}

.loading-bar {
    width: 0%;
    height: 100%;
    background: linear-gradient(90deg, #dc2626, #ff4500, #dc2626);
    animation: loadingProgress 2.5s ease-in-out forwards;
    box-shadow: 0 0 20px rgba(220, 38, 38, 0.8);
}

@keyframes loadingProgress {
    0% { width: 0%; }
    100% { width: 100%; }
}

.loading-text {
    color: #ff6600;
    font-size: 1rem;
    animation: textPulse 1s ease-in-out infinite alternate;
}

@keyframes textPulse {
    0% { opacity: 0.6; }
    100% { opacity: 1; }
}

.game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    color: #fff;
    font-family: 'Courier New', monospace;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    border: 1px solid rgba(220, 38, 38, 0.3);
}

.game-title {
    font-size: 1.8rem;
    font-weight: bold;
    text-shadow: 0 0 15px #dc2626;
    color: #dc2626;
}

.game-score {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.score-label {
    font-size: 0.8rem;
    color: #888;
    margin-bottom: 0.2rem;
}

.score-number {
    font-size: 2rem;
    font-weight: bold;
    color: #00ff00;
    text-shadow: 0 0 10px #00ff00;
    font-family: 'Courier New', monospace;
    letter-spacing: 2px;
}

.close-game-btn {
    background: rgba(255, 68, 68, 0.2);
    border: 2px solid #ff4444;
    color: #ff4444;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 18px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.close-game-btn:hover {
    background: rgba(255, 68, 68, 0.4);
    box-shadow: 0 0 15px rgba(255, 68, 68, 0.6);
    transform: scale(1.1);
}

.game-canvas-container {
    position: relative;
    border: 3px solid;
    border-image: linear-gradient(45deg, #dc2626, #ff4500, #dc2626) 1;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 
        0 0 50px rgba(220, 38, 38, 0.5),
        inset 0 0 30px rgba(0, 0, 0, 0.5);
}

#flappy-canvas {
    display: block;
    cursor: pointer;
    background: transparent;
}

.canvas-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
}

.scan-lines {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
        repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.03) 2px,
            rgba(255, 255, 255, 0.03) 4px
        );
    animation: scanMove 2s linear infinite;
}

@keyframes scanMove {
    0% { transform: translateY(0px); }
    100% { transform: translateY(4px); }
}

.game-controls {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 1rem;
    font-family: 'Courier New', monospace;
}

.control-hint {
    color: #888;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

kbd {
    background: rgba(220, 38, 38, 0.2);
    border: 1px solid #dc2626;
    border-radius: 5px;
    padding: 0.3rem 0.6rem;
    color: #dc2626;
    font-size: 0.8rem;
    font-weight: bold;
}

.game-over-content {
    text-align: center;
    background: rgba(0, 0, 0, 0.98);
    padding: 4rem;
    border: 3px solid #ff4444;
    border-radius: 20px;
    box-shadow: 
        0 0 100px rgba(255, 68, 68, 0.8),
        inset 0 0 50px rgba(255, 0, 0, 0.2);
}

.game-over-glitch {
    font-size: 4rem;
    margin-bottom: 2rem;
    text-shadow: 
        0 0 30px #ff4444,
        3px 3px 0px #ff0000,
        -3px -3px 0px #ffff00;
    animation: glitchText 1s ease-in-out infinite;
    position: relative;
}

.game-over-glitch::before,
.game-over-glitch::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.game-over-glitch::before {
    animation: glitchBefore 1s ease-in-out infinite;
    color: #ff0000;
}

.game-over-glitch::after {
    animation: glitchAfter 1s ease-in-out infinite;
    color: #ffff00;
}

.final-score {
    font-size: 2rem;
    margin-bottom: 3rem;
    color: #00ff00;
    text-shadow: 0 0 20px #00ff00;
    font-family: 'Courier New', monospace;
}

.game-over-buttons {
    display: flex;
    gap: 2rem;
    justify-content: center;
}

.game-btn {
    background: rgba(0, 0, 0, 0.8);
    border: 2px solid;
    color: #fff;
    padding: 1rem 2rem;
    border-radius: 10px;
    cursor: pointer;
    font-family: 'Courier New', monospace;
    font-size: 1.2rem;
    font-weight: bold;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-transform: uppercase;
}

.restart-btn {
    border-color: #00ff00;
    color: #00ff00;
}

.restart-btn:hover {
    background: rgba(0, 255, 0, 0.2);
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.6);
    transform: translateY(-3px);
}

.quit-btn {
    border-color: #ff4444;
    color: #ff4444;
}

.quit-btn:hover {
    background: rgba(255, 68, 68, 0.2);
    box-shadow: 0 0 20px rgba(255, 68, 68, 0.6);
    transform: translateY(-3px);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
    .flappy-bird-container {
        padding: 15px !important;
    }
    
    #flappy-canvas {
        width: 100% !important;
        height: 400px !important;
    }
    
    .konami-glitch,
    .game-over-glitch {
        font-size: 2.5rem !important;
    }
    
    .game-header {
        flex-direction: column;
        gap: 1rem;
    }
    
    .game-controls {
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .game-over-buttons {
        flex-direction: column;
        align-items: center;
    }
}
`;


const flappyStyle = document.createElement('style');
flappyStyle.textContent = flappyBirdCSS;
document.head.appendChild(flappyStyle);


document.addEventListener('DOMContentLoaded', () => {
    window.konamiFlappyBird = new KonamiFlappyBird();
});


class ARBusinessCardHandler {
    constructor() {
        this.arParams = null;
        this.isARMode = false;
        this.businessCardData = null;
        this.arButton = null;
        
        this.init();
    }
    
    init() {
        
        this.checkARMode();
        
        if (this.isARMode) {
            console.log('🎯 AR Mode detected! Loading AR business card...');
            this.showARBusinessCard();
        } else {
            
            this.createARButton();
        }
    }
    
    checkARMode() {
        const urlParams = new URLSearchParams(window.location.search);
        
        
        if (urlParams.get('ar') === 'business-card' && urlParams.get('mode') === 'ar') {
            this.isARMode = true;
            
            
            this.businessCardData = {
                name: decodeURIComponent(urlParams.get('name') || 'Peps Star'),
                title: decodeURIComponent(urlParams.get('title') || 'Full Stack Developer'),
                github: decodeURIComponent(urlParams.get('github') || ''),
                discord: decodeURIComponent(urlParams.get('discord') || ''),
                skills: decodeURIComponent(urlParams.get('skills') || '').split(','),
                website: decodeURIComponent(urlParams.get('website') || window.location.origin),
                mode: 'ar'
            };
            
            console.log('📱 AR Business Card Data:', this.businessCardData);
        }
    }
    
    createARButton() {
        
        this.arButton = document.createElement('button');
        this.arButton.className = 'ar-card-button';
        this.arButton.innerHTML = `
            <div class="ar-btn-content">
                <i class="fas fa-cube"></i>
                <span>AR Card</span>
                <div class="ar-btn-glow"></div>
            </div>
        `;
        
        this.arButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: linear-gradient(135deg, #dc2626, #ff4500);
            border: none;
            border-radius: 15px;
            padding: 0;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4);
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            overflow: hidden;
            width: 80px;
            height: 80px;
        `;
        
        this.arButton.addEventListener('click', () => {
            this.showARInterface();
        });
        
        this.arButton.addEventListener('mouseenter', () => {
            this.arButton.style.transform = 'scale(1.1) translateY(-5px)';
            this.arButton.style.boxShadow = '0 15px 35px rgba(220, 38, 38, 0.6)';
        });
        
        this.arButton.addEventListener('mouseleave', () => {
            this.arButton.style.transform = 'scale(1) translateY(0px)';
            this.arButton.style.boxShadow = '0 8px 25px rgba(220, 38, 38, 0.4)';
        });
        
        document.body.appendChild(this.arButton);
    }
    
    showARInterface() {
        
        const arInterface = document.createElement('div');
        arInterface.className = 'ar-interface-overlay';
        arInterface.innerHTML = `
            <div class="ar-interface-backdrop" id="ar-backdrop"></div>
            <div class="ar-interface-modal">
                <div class="ar-modal-header">
                    <div class="ar-modal-title">
                        <i class="fas fa-cube"></i>
                        AR Business Card
                    </div>
                    <button class="ar-modal-close" id="ar-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="ar-modal-content">
                    <div class="ar-preview-section">
                        <div class="ar-preview-card">
                            <div class="preview-card-front">
                                <div class="preview-profile">
                                    <div class="preview-avatar">PS</div>
                                    <div class="preview-info">
                                        <h3>Peps Star</h3>
                                        <p>Full Stack Developer</p>
                                    </div>
                                </div>
                                <div class="preview-skills">
                                    <span class="preview-skill">C++</span>
                                    <span class="preview-skill">C#</span>
                                    <span class="preview-skill">JS</span>
                                    <span class="preview-skill">React</span>
                                </div>
                                <div class="preview-social">
                                    <i class="fab fa-github"></i>
                                    <i class="fab fa-discord"></i>
                                    <i class="fas fa-globe"></i>
                                </div>
                            </div>
                        </div>
                        <div class="ar-preview-text">
                            <h4>3D Interactive Business Card</h4>
                            <p>Share your AR business card with anyone!</p>
                        </div>
                    </div>
                    
                    <div class="ar-qr-section" id="ar-qr-section">
                        <div class="qr-header">
                            <h3>📱 Scan QR Code for AR Experience</h3>
                        </div>
                        <div class="qr-container">
                            <div class="qr-code-wrapper" id="qr-code-wrapper">
                                <div class="qr-loading" id="qr-loading">
                                    <div class="loading-spinner"></div>
                                    <div>Generating QR Code...</div>
                                </div>
                            </div>
                        </div>
                        <div class="qr-instructions">
                            <div class="qr-instruction">
                                <i class="fas fa-mobile-alt"></i>
                                <span>Open camera app on your phone</span>
                            </div>
                            <div class="qr-instruction">
                                <i class="fas fa-qrcode"></i>
                                <span>Point camera at QR code</span>
                            </div>
                            <div class="qr-instruction">
                                <i class="fas fa-cube"></i>
                                <span>Tap notification to view AR card</span>
                            </div>
                        </div>
                        <div class="qr-actions">
                            <button class="qr-action-btn" id="copy-ar-link">
                                <i class="fas fa-copy"></i>
                                Copy Link
                            </button>
                            <button class="qr-action-btn" id="download-qr">
                                <i class="fas fa-download"></i>
                                Download QR
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        arInterface.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 100000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: arInterfaceIn 0.3s ease-out;
        `;
        
        document.body.appendChild(arInterface);
        
        
        this.generateQRCode();
        
        
        this.setupInterfaceEvents(arInterface);
    }
    
    setupInterfaceEvents(arInterface) {
        
        document.getElementById('ar-close').addEventListener('click', () => {
            this.closeARInterface(arInterface);
        });
        
        document.getElementById('ar-backdrop').addEventListener('click', () => {
            this.closeARInterface(arInterface);
        });
        
        
        document.getElementById('copy-ar-link').addEventListener('click', () => {
            this.copyARLink();
        });
        
        
        document.getElementById('download-qr').addEventListener('click', () => {
            this.downloadQRCode();
        });
    }
    
    generateQRCode() {
        const arLink = this.createARLink();
        const qrWrapper = document.getElementById('qr-code-wrapper');
        const qrLoading = document.getElementById('qr-loading');
        
        
        const qrSize = 200;
        const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(arLink)}&bgcolor=FFFFFF&color=000000&margin=10&format=png&ecc=M`;
        
        const img = document.createElement('img');
        img.crossOrigin = 'anonymous';
        img.alt = 'AR Business Card QR Code';
        img.style.cssText = `
            width: 200px;
            height: 200px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(220, 38, 38, 0.3);
            border: 3px solid #dc2626;
        `;
        
        img.onload = () => {
            qrLoading.style.display = 'none';
            qrWrapper.appendChild(img);
            
            
            const logoOverlay = document.createElement('div');
            logoOverlay.innerHTML = `
                <div class="qr-center-logo">
                    <i class="fas fa-cube"></i>
                </div>
            `;
            logoOverlay.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 40px;
                height: 40px;
                background: #dc2626;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 16px;
                border: 2px solid white;
                pointer-events: none;
            `;
            
            qrWrapper.style.position = 'relative';
            qrWrapper.appendChild(logoOverlay);
        };
        
        img.onerror = () => {
            qrLoading.innerHTML = `
                <div class="qr-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <div>QR Generation Failed</div>
                    <div>Use the copy link button below</div>
                </div>
            `;
        };
        
        img.src = qrURL;
    }
    
    createARLink() {
        const businessCardData = {
            name: "Peps Star",
            title: "Full Stack Developer",
            github: "https://github.com/peps2ne",
            discord: "peps2ne",
            skills: ["C++", "C#", "JavaScript", "TypeScript", "React"],
            website: window.location.origin + window.location.pathname
        };
        
        const baseUrl = window.location.origin + window.location.pathname;
        const arParams = new URLSearchParams({
            ar: 'business-card',
            name: encodeURIComponent(businessCardData.name),
            title: encodeURIComponent(businessCardData.title),
            github: encodeURIComponent(businessCardData.github),
            discord: encodeURIComponent(businessCardData.discord),
            skills: encodeURIComponent(businessCardData.skills.join(',')),
            website: encodeURIComponent(businessCardData.website),
            mode: 'ar'
        });
        
        return `${baseUrl}?${arParams.toString()}`;
    }
    
    copyARLink() {
        const arLink = this.createARLink();
        navigator.clipboard.writeText(arLink).then(() => {
            this.showNotification('🔗 AR link copied to clipboard!', 'success');
        }).catch(() => {
            
            const textArea = document.createElement('textarea');
            textArea.value = arLink;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                this.showNotification('🔗 AR link copied to clipboard!', 'success');
            } catch (err) {
                this.showNotification('❌ Failed to copy link', 'error');
            }
            document.body.removeChild(textArea);
        });
    }
    
    downloadQRCode() {
        const qrImg = document.querySelector('#qr-code-wrapper img');
        if (qrImg) {
            const link = document.createElement('a');
            link.download = 'peps-star-ar-business-card.png';
            link.href = qrImg.src;
            link.click();
            this.showNotification('⬇️ QR Code downloaded!', 'success');
        } else {
            this.showNotification('❌ No QR code to download', 'error');
        }
    }
    
    closeARInterface(arInterface) {
        arInterface.style.animation = 'arInterfaceOut 0.3s ease-in forwards';
        setTimeout(() => {
            arInterface.remove();
        }, 300);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `ar-notification ar-${type}`;
        notification.innerHTML = `
            <div class="ar-notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(15, 15, 15, 0.95);
            border: 1px solid ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
            padding: 1rem 1.5rem;
            border-radius: 12px;
            font-size: 14px;
            z-index: 100001;
            backdrop-filter: blur(20px);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 350px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
    
    
    showARBusinessCard() {
        
        const arContainer = document.createElement('div');
        arContainer.id = 'ar-business-card-fullscreen';
        arContainer.innerHTML = `
            <div class="ar-background">
                <div class="ar-particles"></div>
                <div class="ar-grid-overlay"></div>
            </div>
            
            <div class="ar-business-card-container">
                <div class="ar-card-header">
                    <div class="ar-logo">
                        <i class="fas fa-cube"></i>
                    </div>
                    <div class="ar-status">
                        <span class="ar-status-dot"></span>
                        AR Business Card Active
                    </div>
                    <button class="ar-close-btn" id="ar-close-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="ar-card-stage" id="ar-card-stage">
                    <div class="ar-business-card-3d" id="ar-business-card">
                        <div class="business-card-face front">
                            <div class="card-content">
                                <div class="card-profile">
                                    <div class="card-avatar">
                                        <div class="avatar-ring"></div>
                                        <div class="avatar-placeholder">
                                            ${this.businessCardData.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div class="status-indicator"></div>
                                    </div>
                                    <div class="card-info">
                                        <h1 class="card-name">${this.businessCardData.name}</h1>
                                        <p class="card-title">${this.businessCardData.title}</p>
                                    </div>
                                </div>
                                
                                <div class="card-skills">
                                    ${this.businessCardData.skills.filter(s => s.trim()).map(skill => 
                                        `<span class="skill-chip">${skill.trim()}</span>`
                                    ).join('')}
                                </div>
                                
                                <div class="card-contact">
                                    ${this.businessCardData.github ? `
                                        <div class="contact-item">
                                            <i class="fab fa-github"></i>
                                            <span>GitHub</span>
                                            <div class="contact-link" data-url="${this.businessCardData.github}">
                                                ${this.businessCardData.github.split('/').pop()}
                                            </div>
                                        </div>
                                    ` : ''}
                                    
                                    ${this.businessCardData.discord ? `
                                        <div class="contact-item">
                                            <i class="fab fa-discord"></i>
                                            <span>Discord</span>
                                            <div class="contact-link">
                                                ${this.businessCardData.discord}
                                            </div>
                                        </div>
                                    ` : ''}
                                    
                                    <div class="contact-item">
                                        <i class="fas fa-globe"></i>
                                        <span>Website</span>
                                        <div class="contact-link" data-url="${this.businessCardData.website}">
                                            View Portfolio
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="business-card-face back">
                            <div class="card-content">
                                <div class="card-back-header">
                                    <h2>Connect with Me</h2>
                                </div>
                                
                                <div class="social-links-ar">
                                    ${this.businessCardData.github ? `
                                        <a href="${this.businessCardData.github}" target="_blank" class="social-link-ar github">
                                            <i class="fab fa-github"></i>
                                        </a>
                                    ` : ''}
                                    
                                    <a href="${this.businessCardData.website}" target="_blank" class="social-link-ar website">
                                        <i class="fas fa-globe"></i>
                                    </a>
                                    
                                    <div class="social-link-ar discord" data-discord="${this.businessCardData.discord}">
                                        <i class="fab fa-discord"></i>
                                    </div>
                                </div>
                                
                                <div class="ar-branding">
                                    <p>Powered by AR Technology</p>
                                    <div class="tech-badges">
                                        <span class="tech-badge">WebAR</span>
                                        <span class="tech-badge">3D</span>
                                        <span class="tech-badge">Interactive</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="ar-controls">
                    <button class="ar-control-btn" id="flip-card">
                        <i class="fas fa-sync-alt"></i>
                        <span>Flip Card</span>
                    </button>
                    
                    <button class="ar-control-btn" id="save-contact">
                        <i class="fas fa-address-book"></i>
                        <span>Save Contact</span>
                    </button>
                    
                    <button class="ar-control-btn" id="visit-website">
                        <i class="fas fa-external-link-alt"></i>
                        <span>Visit Website</span>
                    </button>
                </div>
                
                <div class="ar-footer">
                    <p>This is a 3D AR Business Card experience</p>
                    <small>Tap and drag to interact • Use controls below</small>
                </div>
            </div>
        `;
        
        arContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            z-index: 999999;
            font-family: 'Inter', sans-serif;
            color: #fff;
            overflow: hidden;
        `;
        
        
        document.body.style.overflow = 'hidden';
        document.body.appendChild(arContainer);
        
        
        this.initializeARInteractions();
        this.startARAnimations();
    }
    
    initializeARInteractions() {
        document.getElementById('ar-close-btn').addEventListener('click', () => {
            this.exitARMode();
        });
        
        document.getElementById('flip-card').addEventListener('click', () => {
            this.flipCard();
        });
        
        document.getElementById('save-contact').addEventListener('click', () => {
            this.saveContact();
        });
        
        document.getElementById('visit-website').addEventListener('click', () => {
            window.open(this.businessCardData.website, '_blank');
        });
        
        document.querySelectorAll('.contact-link[data-url]').forEach(link => {
            link.addEventListener('click', () => {
                window.open(link.dataset.url, '_blank');
            });
        });
        
        const discordElement = document.querySelector('.social-link-ar.discord');
        if (discordElement) {
            discordElement.addEventListener('click', () => {
                const discord = discordElement.dataset.discord;
                navigator.clipboard.writeText(discord).then(() => {
                    this.showARNotification(`Discord username "${discord}" copied!`);
                });
            });
        }
        
        this.setupCardInteraction();
    }
    
    setupCardInteraction() {
        const card = document.getElementById('ar-business-card');
        let isDragging = false;
        let startX, startY;
        let currentRotationX = 0;
        let currentRotationY = 0;
        
        const startDrag = (e) => {
            isDragging = true;
            startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            startY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
            card.style.cursor = 'grabbing';
        };
        
        const doDrag = (e) => {
            if (!isDragging) return;
            
            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
            
            const deltaX = clientX - startX;
            const deltaY = clientY - startY;
            
            currentRotationY += deltaX * 0.5;
            currentRotationX -= deltaY * 0.5;
            
            currentRotationX = Math.max(-45, Math.min(45, currentRotationX));
            
            card.style.transform = `rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg)`;
            
            startX = clientX;
            startY = clientY;
        };
        
        const endDrag = () => {
            isDragging = false;
            card.style.cursor = 'grab';
        };
        
        card.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', endDrag);
        
        card.addEventListener('touchstart', startDrag);
        document.addEventListener('touchmove', doDrag);
        document.addEventListener('touchend', endDrag);
        
        card.style.cursor = 'grab';
    }
    
    flipCard() {
        const card = document.getElementById('ar-business-card');
        const currentTransform = card.style.transform || '';
        
        if (currentTransform.includes('rotateY(180deg)')) {
            card.style.transform = currentTransform.replace('rotateY(180deg)', 'rotateY(0deg)');
        } else {
            card.style.transform += ' rotateY(180deg)';
        }
        
        this.showARNotification('Card flipped!');
    }
    
    saveContact() {
        const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${this.businessCardData.name}
TITLE:${this.businessCardData.title}
URL:${this.businessCardData.website}
${this.businessCardData.github ? `URL;TYPE=GitHub:${this.businessCardData.github}` : ''}
${this.businessCardData.discord ? `X-DISCORD:${this.businessCardData.discord}` : ''}
END:VCARD`;
        
        const blob = new Blob([vCard], { type: 'text/vcard' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.businessCardData.name.replace(/\s+/g, '_')}.vcf`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showARNotification('Contact saved to your device!');
    }
    
    showARNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'ar-notification-ar';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(220, 38, 38, 0.9);
            color: #fff;
            padding: 1rem 2rem;
            border-radius: 25px;
            font-size: 1rem;
            z-index: 1000000;
            animation: arNotificationSlide 3s ease-in-out forwards;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    startARAnimations() {
        const card = document.getElementById('ar-business-card');
        card.style.animation = 'arCardFloat 6s ease-in-out infinite';
        
        this.createARParticles();
        
        const grid = document.querySelector('.ar-grid-overlay');
        if (grid) {
            grid.style.animation = 'arGridMove 20s linear infinite';
        }
    }
    
    createARParticles() {
        const particleContainer = document.querySelector('.ar-particles');
        
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: #dc2626;
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: arParticleFloat ${3 + Math.random() * 4}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
                opacity: ${0.3 + Math.random() * 0.7};
            `;
            particleContainer.appendChild(particle);
        }
    }
    
    exitARMode() {
        const arContainer = document.getElementById('ar-business-card-fullscreen');
        if (arContainer) {
            arContainer.style.animation = 'arInterfaceOut 0.5s ease-in forwards';
            setTimeout(() => {
                arContainer.remove();
                document.body.style.overflow = 'auto';
                
                
                const url = new URL(window.location);
                url.searchParams.delete('ar');
                url.searchParams.delete('mode');
                url.searchParams.delete('name');
                url.searchParams.delete('title');
                url.searchParams.delete('github');
                url.searchParams.delete('discord');
                url.searchParams.delete('skills');
                url.searchParams.delete('website');
                
                window.history.replaceState({}, document.title, url);
            }, 500);
        }
    }
}


const arBusinessCardCSS = `
/* AR Button Styles */
.ar-btn-content {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    font-family: 'Inter', sans-serif;
    height: 100%;
    width: 100%;
    cursor: pointer;
}

.ar-btn-content i {
    font-size: 24px;
    margin-bottom: 4px;
}

.ar-btn-content span {
    font-size: 12px;
    font-weight: 600;
}

.ar-btn-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    background: radial-gradient(circle, rgba(220, 38, 38, 0.4), transparent);
    border-radius: 50%;
    animation: arGlow 2s ease-in-out infinite alternate;
}

@keyframes arGlow {
    0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
    100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
}

/* AR Interface Modal Styles */
.ar-interface-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
}

.ar-interface-modal {
    background: rgba(15, 15, 15, 0.95);
    border: 2px solid;
    border-image: linear-gradient(45deg, #dc2626, #ff4500, #dc2626) 1;
    border-radius: 20px;
    padding: 2rem;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    backdrop-filter: blur(20px);
    box-shadow: 0 0 50px rgba(220, 38, 38, 0.3);
    color: #fff;
    font-family: 'Inter', sans-serif;
    position: relative;
    z-index: 1;
}

.ar-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.ar-modal-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.5rem;
    font-weight: 700;
    color: #dc2626;
}

.ar-modal-close {
    background: rgba(220, 38, 38, 0.2);
    border: 1px solid #dc2626;
    color: #dc2626;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.ar-modal-close:hover {
    background: rgba(220, 38, 38, 0.4);
    transform: scale(1.1);
}

.ar-preview-section {
    margin-bottom: 2rem;
    text-align: center;
}

.ar-preview-card {
    perspective: 1000px;
    margin-bottom: 1rem;
}

.preview-card-front {
    width: 200px;
    height: 120px;
    background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
    border: 2px solid #dc2626;
    border-radius: 12px;
    padding: 1rem;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    animation: cardPreviewFloat 4s ease-in-out infinite;
}

@keyframes cardPreviewFloat {
    0%, 100% { transform: rotateX(5deg) rotateY(5deg); }
    50% { transform: rotateX(-5deg) rotateY(-5deg); }
}

.preview-profile {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.preview-avatar {
    width: 30px;
    height: 30px;
    background: linear-gradient(135deg, #dc2626, #ff4500);
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: bold;
}

.preview-info h3 {
    font-size: 0.9rem;
    margin: 0;
    color: #fff;
}

.preview-info p {
    font-size: 0.7rem;
    margin: 0;
    color: #dc2626;
}

.preview-skills {
    display: flex;
    gap: 0.3rem;
    justify-content: center;
}

.preview-skill {
    background: rgba(220, 38, 38, 0.2);
    color: #dc2626;
    padding: 0.2rem 0.4rem;
    border-radius: 8px;
    font-size: 0.6rem;
    border: 1px solid rgba(220, 38, 38, 0.3);
}

.preview-social {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    color: #888;
}

.preview-social i {
    font-size: 0.9rem;
}

.ar-preview-text h4 {
    color: #dc2626;
    margin: 0.5rem 0;
}

.ar-preview-text p {
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
    font-size: 0.9rem;
}

.ar-qr-section {
    text-align: center;
}

.qr-header h3 {
    color: #dc2626;
    margin-bottom: 1.5rem;
}

.qr-container {
    margin-bottom: 1.5rem;
}

.qr-code-wrapper {
    display: inline-block;
    position: relative;
}

.qr-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 2rem;
    color: #dc2626;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(220, 38, 38, 0.3);
    border-top: 3px solid #dc2626;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.qr-error {
    color: #ef4444;
    padding: 2rem;
}

.qr-error i {
    font-size: 2rem;
    margin-bottom: 1rem;
}

.qr-instructions {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    margin-bottom: 1.5rem;
}

.qr-instruction {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
}

.qr-instruction i {
    color: #dc2626;
    width: 20px;
    text-align: center;
}

.qr-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

.qr-action-btn {
    background: rgba(220, 38, 38, 0.2);
    border: 1px solid rgba(220, 38, 38, 0.3);
    color: #dc2626;
    padding: 0.8rem 1.5rem;
    border-radius: 10px;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.qr-action-btn:hover {
    background: rgba(220, 38, 38, 0.4);
    border-color: rgba(220, 38, 38, 0.6);
    transform: translateY(-2px);
}

/* AR Fullscreen Styles - Use different class names to avoid conflicts */
.ar-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
        radial-gradient(circle at 20% 80%, rgba(220, 38, 38, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 69, 0, 0.15) 0%, transparent 50%),
        linear-gradient(135deg, #000 0%, #111 50%, #000 100%);
}

.ar-particles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
}

.ar-grid-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 200%;
    background-image: 
        linear-gradient(rgba(220, 38, 38, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(220, 38, 38, 0.1) 1px, transparent 1px);
    background-size: 50px 50px;
    opacity: 0.3;
}

.ar-business-card-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    box-sizing: border-box;
}

.ar-card-header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    z-index: 10;
}

.ar-logo {
    color: #dc2626;
    font-size: 1.5rem;
}

.ar-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #22c55e;
}

.ar-status-dot {
    width: 8px;
    height: 8px;
    background: #22c55e;
    border-radius: 50%;
    animation: pulse 2s infinite;
}

.ar-close-btn {
    background: rgba(220, 38, 38, 0.2);
    border: 1px solid #dc2626;
    color: #dc2626;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s ease;
}

.ar-close-btn:hover {
    background: rgba(220, 38, 38, 0.4);
    transform: scale(1.1);
}

.ar-card-stage {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    perspective: 1200px;
}

.ar-business-card-3d {
    width: 400px;
    height: 250px;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: grab;
}

.business-card-face {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    overflow: hidden;
}

.business-card-face.front {
    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
    border: 2px solid #dc2626;
}

.business-card-face.back {
    background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
    border: 2px solid #ff4500;
    transform: rotateY(180deg);
}

.card-content {
    padding: 2rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.card-profile {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
}

.card-avatar {
    position: relative;
    width: 80px;
    height: 80px;
}

.avatar-ring {
    position: absolute;
    top: -5px;
    left: -5px;
    width: 90px;
    height: 90px;
    border: 3px solid #dc2626;
    border-radius: 50%;
    animation: rotate 10s linear infinite;
}

.avatar-placeholder {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #dc2626, #ff4500);
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: bold;
    position: relative;
    z-index: 2;
}

.status-indicator {
    position: absolute;
    bottom: 5px;
    right: 5px;
    width: 20px;
    height: 20px;
    background: #22c55e;
    border-radius: 50%;
    border: 3px solid #1a1a1a;
    z-index: 3;
}

.card-name {
    font-size: 1.8rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.5rem 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.card-title {
    font-size: 1rem;
    color: #dc2626;
    margin: 0;
    font-weight: 500;
}

.card-skills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 1rem 0;
}

.skill-chip {
    background: rgba(220, 38, 38, 0.2);
    color: #dc2626;
    border: 1px solid rgba(220, 38, 38, 0.3);
    padding: 0.4rem 0.8rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
}

.card-contact {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.9rem;
}

.contact-item i {
    color: #dc2626;
    width: 20px;
    font-size: 1.1rem;
}

.contact-link {
    color: #3b82f6;
    cursor: pointer;
    text-decoration: underline;
    transition: color 0.3s ease;
}

.contact-link:hover {
    color: #60a5fa;
}

.card-back-header h2 {
    color: #fff;
    text-align: center;
    margin: 0 0 2rem 0;
    font-size: 1.5rem;
}

/* Use different class name for AR social links to avoid conflicts */
.social-links-ar {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin: 2rem 0;
}

.social-link-ar {
    width: 60px;
    height: 60px;
    background: rgba(220, 38, 38, 0.2);
    border: 2px solid rgba(220, 38, 38, 0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #dc2626;
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
}

.social-link-ar:hover {
    background: rgba(220, 38, 38, 0.4);
    border-color: rgba(220, 38, 38, 0.6);
    transform: scale(1.1);
    color: #ff4500;
}

.ar-branding {
    text-align: center;
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.8rem;
}

.tech-badges {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1rem;
}

.tech-badge {
    background: rgba(34, 197, 94, 0.2);
    color: #22c55e;
    border: 1px solid rgba(34, 197, 94, 0.3);
    padding: 0.2rem 0.6rem;
    border-radius: 12px;
    font-size: 0.7rem;
}

.ar-controls {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
}

.ar-control-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
    background: rgba(220, 38, 38, 0.2);
    border: 1px solid rgba(220, 38, 38, 0.3);
    color: #dc2626;
    padding: 0.8rem 1rem;
    border-radius: 12px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.3s ease;
    min-width: 80px;
}

.ar-control-btn:hover {
    background: rgba(220, 38, 38, 0.4);
    transform: translateY(-2px);
    border-color: rgba(220, 38, 38, 0.6);
}

.ar-control-btn i {
    font-size: 1.2rem;
}

.ar-footer {
    position: absolute;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
}

/* Animations */
@keyframes arCardFloat {
    0%, 100% { transform: translateY(0px) rotateX(5deg) rotateY(5deg); }
    33% { transform: translateY(-10px) rotateX(-2deg) rotateY(-2deg); }
    66% { transform: translateY(-5px) rotateX(3deg) rotateY(-5deg); }
}

@keyframes arParticleFloat {
    0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
    50% { transform: translateY(-20px) scale(1.2); opacity: 0.8; }
}

@keyframes arGridMove {
    0% { transform: translate(0, 0); }
    100% { transform: translate(-50px, -50px); }
}

@keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.2); }
}

@keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes arNotificationSlide {
    0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    10%, 90% { opacity: 1; transform: translateX(-50%) translateY(0); }
    100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
}

@keyframes arInterfaceIn {
    0% { opacity: 0; transform: scale(0.9); }
    100% { opacity: 1; transform: scale(1); }
}

@keyframes arInterfaceOut {
    0% { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(0.9); }
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .ar-interface-modal {
        padding: 1.5rem;
        margin: 1rem;
    }
    
    .preview-card-front {
        width: 160px;
        height: 100px;
        padding: 0.8rem;
    }
    
    .preview-avatar {
        width: 25px;
        height: 25px;
        font-size: 0.7rem;
    }
    
    .preview-info h3 {
        font-size: 0.8rem;
    }
    
    .preview-info p {
        font-size: 0.6rem;
    }
    
    .qr-actions {
        flex-direction: column;
    }
    
    .ar-business-card-3d {
        width: 300px;
        height: 190px;
    }
    
    .card-content {
        padding: 1.5rem;
    }
    
    .card-profile {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
    }
    
    .card-avatar {
        width: 60px;
        height: 60px;
    }
    
    .avatar-ring {
        width: 70px;
        height: 70px;
        top: -5px;
        left: -5px;
    }
    
    .avatar-placeholder {
        width: 60px;
        height: 60px;
        font-size: 1.5rem;
    }
    
    .card-name {
        font-size: 1.4rem;
    }
    
    .social-links-ar {
        gap: 1rem;
    }
    
    .social-link-ar {
        width: 50px;
        height: 50px;
        font-size: 1.2rem;
    }
    
    .ar-controls {
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .ar-control-btn {
        padding: 0.6rem 0.8rem;
        min-width: 70px;
        font-size: 0.7rem;
    }
}

/* Notification styles */
.ar-notification-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.ar-notification-content i {
    font-size: 16px;
}
`;


const arBusinessCardStyle = document.createElement('style');
arBusinessCardStyle.textContent = arBusinessCardCSS;
document.head.appendChild(arBusinessCardStyle);


document.addEventListener('DOMContentLoaded', () => {
    window.arBusinessCardHandler = new ARBusinessCardHandler();
});


class EnhancedBackgroundParticles {
    constructor() {
        this.particleContainer = null;
        this.particles = [];
        this.maxParticles = 150; 
        this.isActive = true;
        
        this.init();
    }
    
    init() {
        this.createParticleContainer();
        this.generateParticles();
        this.startParticleAnimation();
        console.log('🔥 Enhanced background particles loaded with', this.maxParticles, 'particles');
    }
    
    createParticleContainer() {
        
        const existing = document.getElementById('enhanced-bg-particles');
        if (existing) existing.remove();
        
        this.particleContainer = document.createElement('div');
        this.particleContainer.id = 'enhanced-bg-particles';
        this.particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
        `;
        
        document.body.appendChild(this.particleContainer);
    }
    
    generateParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
            this.createParticle(i);
        }
    }
    
    createParticle(index) {
        const particle = document.createElement('div');
        particle.className = 'enhanced-bg-particle';
        
        
        const size = Math.random() * 4 + 1; 
        const opacity = Math.random() * 0.8 + 0.2; 
        const speed = Math.random() * 3 + 1; 
        const delay = Math.random() * 5; 
        const startX = Math.random() * 100; 
        
        
        const colors = [
            '#dc2626', 
            '#ef4444', 
            '#f87171', 
            '#ff4500', 
            '#ff6347', 
            '#ff0000', 
            '#b91c1c', 
            '#991b1b'  
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            left: ${startX}%;
            bottom: -10px;
            opacity: ${opacity};
            box-shadow: 0 0 ${size * 2}px ${color};
            animation: enhancedParticleRise ${speed + 2}s linear ${delay}s infinite;
            pointer-events: none;
        `;
        
        this.particleContainer.appendChild(particle);
        this.particles.push({
            element: particle,
            speed: speed,
            size: size,
            color: color
        });
    }
    
    startParticleAnimation() {
        
        setInterval(() => {
            if (this.isActive && this.particles.length < this.maxParticles * 1.5) {
                this.createParticle(this.particles.length);
            }
        }, 200); 
        
        
        setInterval(() => {
            this.cleanupParticles();
        }, 5000);
    }
    
    cleanupParticles() {
        
        this.particles = this.particles.filter(particle => {
            if (!document.body.contains(particle.element)) {
                return false;
            }
            return true;
        });
        
        
        while (this.particles.length > this.maxParticles * 2) {
            const particleToRemove = this.particles.shift();
            if (particleToRemove && particleToRemove.element.parentNode) {
                particleToRemove.element.parentNode.removeChild(particleToRemove.element);
            }
        }
    }
    
    
    increaseParticles(amount = 50) {
        this.maxParticles += amount;
        for (let i = 0; i < amount; i++) {
            this.createParticle(this.particles.length + i);
        }
        console.log('🔥 Increased particles to', this.maxParticles);
    }
    
    decreaseParticles(amount = 50) {
        this.maxParticles = Math.max(10, this.maxParticles - amount);
        console.log('🔥 Decreased particles to', this.maxParticles);
    }
    
    setParticleCount(count) {
        this.maxParticles = count;
        this.reset();
        console.log('🔥 Set particle count to', this.maxParticles);
    }
    
    reset() {
        
        this.particles.forEach(particle => {
            if (particle.element.parentNode) {
                particle.element.parentNode.removeChild(particle.element);
            }
        });
        this.particles = [];
        this.generateParticles();
    }
    
    toggle() {
        this.isActive = !this.isActive;
        this.particleContainer.style.display = this.isActive ? 'block' : 'none';
        console.log('🔥 Background particles', this.isActive ? 'enabled' : 'disabled');
    }
    
    destroy() {
        this.isActive = false;
        if (this.particleContainer && this.particleContainer.parentNode) {
            this.particleContainer.parentNode.removeChild(this.particleContainer);
        }
        this.particles = [];
    }
}


const enhancedParticlesCSS = `
/* Enhanced Background Particles */
@keyframes enhancedParticleRise {
    0% {
        transform: translateY(0px) translateX(0px) rotate(0deg);
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px) rotate(360deg);
        opacity: 0;
    }
}

.enhanced-bg-particle {
    transition: all 0.3s ease;
}

/* Different animation variations for variety */
.enhanced-bg-particle:nth-child(3n) {
    animation-name: enhancedParticleRiseWave;
}

.enhanced-bg-particle:nth-child(5n) {
    animation-name: enhancedParticleRiseZigzag;
}

@keyframes enhancedParticleRiseWave {
    0% {
        transform: translateY(0px) translateX(0px) rotate(0deg);
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    25% {
        transform: translateY(-25vh) translateX(20px) rotate(90deg);
    }
    50% {
        transform: translateY(-50vh) translateX(-20px) rotate(180deg);
    }
    75% {
        transform: translateY(-75vh) translateX(20px) rotate(270deg);
    }
    90% {
        opacity: 1;
    }
    100% {
        transform: translateY(-100vh) translateX(0px) rotate(360deg);
        opacity: 0;
    }
}

@keyframes enhancedParticleRiseZigzag {
    0% {
        transform: translateY(0px) translateX(0px) rotate(0deg);
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    20% {
        transform: translateY(-20vh) translateX(30px) rotate(72deg);
    }
    40% {
        transform: translateY(-40vh) translateX(-30px) rotate(144deg);
    }
    60% {
        transform: translateY(-60vh) translateX(30px) rotate(216deg);
    }
    80% {
        transform: translateY(-80vh) translateX(-30px) rotate(288deg);
    }
    90% {
        opacity: 1;
    }
    100% {
        transform: translateY(-100vh) translateX(0px) rotate(360deg);
        opacity: 0;
    }
}

/* Particle intensity modes */
.particle-mode-insane .enhanced-bg-particle {
    animation-duration: 1s !important;
}

.particle-mode-fast .enhanced-bg-particle {
    animation-duration: 2s !important;
}

.particle-mode-slow .enhanced-bg-particle {
    animation-duration: 6s !important;
}

/* Glow effects for particles */
.enhanced-bg-particle:hover {
    transform: scale(1.5) !important;
    box-shadow: 0 0 20px currentColor !important;
}

/* Mobile optimization */
@media (max-width: 768px) {
    .enhanced-bg-particle {
        animation-duration: 3s !important;
    }
}

@media (max-width: 480px) {
    .enhanced-bg-particle {
        animation-duration: 4s !important;
    }
}
`;


const enhancedParticlesStyle = document.createElement('style');
enhancedParticlesStyle.textContent = enhancedParticlesCSS;
document.head.appendChild(enhancedParticlesStyle);


class ParticleControlPanel {
    constructor(particleSystem) {
        this.particleSystem = particleSystem;
        this.controlPanel = null;
        this.isVisible = false;
        
        this.createControlPanel();
        this.setupKeyboardShortcuts();
    }
    
    createControlPanel() {
        this.controlPanel = document.createElement('div');
        this.controlPanel.className = 'particle-control-panel';
        this.controlPanel.innerHTML = `
            <div class="control-header">
                <i class="fas fa-fire"></i>
                <span>Particle Control</span>
                <button class="control-toggle" id="particle-toggle">Hide</button>
            </div>
            <div class="control-content">
                <div class="control-row">
                    <label>Particle Count:</label>
                    <input type="range" id="particle-count" min="10" max="300" value="150">
                    <span id="particle-count-value">150</span>
                </div>
                <div class="control-row">
                    <label>Speed Mode:</label>
                    <select id="particle-speed">
                        <option value="normal">Normal</option>
                        <option value="fast">Fast</option>
                        <option value="slow">Slow</option>
                        <option value="insane">INSANE</option>
                    </select>
                </div>
                <div class="control-buttons">
                    <button id="particle-increase">+ More</button>
                    <button id="particle-decrease">- Less</button>
                    <button id="particle-reset">Reset</button>
                    <button id="particle-disable">Toggle</button>
                </div>
            </div>
        `;
        
        this.controlPanel.style.cssText = `
            position: fixed;
            bottom: 120px;
            right: 20px;
            background: rgba(15, 15, 15, 0.95);
            border: 2px solid rgba(220, 38, 38, 0.3);
            border-radius: 15px;
            padding: 1rem;
            z-index: 9998;
            color: #dc2626;
            font-family: 'Inter', sans-serif;
            backdrop-filter: blur(20px);
            min-width: 200px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(this.controlPanel);
        this.setupControlEvents();
    }
    
    setupControlEvents() {
        
        document.getElementById('particle-toggle').addEventListener('click', () => {
            this.toggleVisibility();
        });
        
        
        const countSlider = document.getElementById('particle-count');
        const countValue = document.getElementById('particle-count-value');
        
        countSlider.addEventListener('input', (e) => {
            const count = parseInt(e.target.value);
            countValue.textContent = count;
            this.particleSystem.setParticleCount(count);
        });
        
        
        document.getElementById('particle-speed').addEventListener('change', (e) => {
            const mode = e.target.value;
            document.body.className = document.body.className.replace(/particle-mode-\w+/g, '');
            if (mode !== 'normal') {
                document.body.classList.add(`particle-mode-${mode}`);
            }
        });
        
        
        document.getElementById('particle-increase').addEventListener('click', () => {
            this.particleSystem.increaseParticles(25);
            this.updateCountDisplay();
        });
        
        document.getElementById('particle-decrease').addEventListener('click', () => {
            this.particleSystem.decreaseParticles(25);
            this.updateCountDisplay();
        });
        
        document.getElementById('particle-reset').addEventListener('click', () => {
            this.particleSystem.setParticleCount(150);
            document.getElementById('particle-count').value = 150;
            this.updateCountDisplay();
        });
        
        document.getElementById('particle-disable').addEventListener('click', () => {
            this.particleSystem.toggle();
        });
    }
    
    updateCountDisplay() {
        const countValue = document.getElementById('particle-count-value');
        const countSlider = document.getElementById('particle-count');
        countValue.textContent = this.particleSystem.maxParticles;
        countSlider.value = this.particleSystem.maxParticles;
    }
    
    toggleVisibility() {
        this.isVisible = !this.isVisible;
        const toggle = document.getElementById('particle-toggle');
        
        if (this.isVisible) {
            this.controlPanel.style.transform = 'translateX(0)';
            toggle.textContent = 'Hide';
        } else {
            this.controlPanel.style.transform = 'translateX(100%)';
            toggle.textContent = 'Show';
        }
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                this.toggleVisibility();
            }
            
            
            if (e.ctrlKey && e.key === '=') {
                e.preventDefault();
                this.particleSystem.increaseParticles(25);
                this.updateCountDisplay();
            }
            
            
            if (e.ctrlKey && e.key === '-') {
                e.preventDefault();
                this.particleSystem.decreaseParticles(25);
                this.updateCountDisplay();
            }
            
            
            if (e.ctrlKey && e.key === '0') {
                e.preventDefault();
                this.particleSystem.setParticleCount(150);
                this.updateCountDisplay();
            }
        });
    }
}


const particleControlCSS = `
.particle-control-panel {
    font-size: 14px;
}

.control-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    font-weight: 600;
}

.control-toggle {
    background: rgba(220, 38, 38, 0.2);
    border: 1px solid rgba(220, 38, 38, 0.3);
    color: #dc2626;
    padding: 0.3rem 0.6rem;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
}

.control-toggle:hover {
    background: rgba(220, 38, 38, 0.4);
}

.control-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.8rem;
    font-size: 12px;
}

.control-row label {
    color: rgba(255, 255, 255, 0.8);
}

.control-row input[type="range"] {
    width: 80px;
    margin: 0 0.5rem;
}

.control-row select {
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(220, 38, 38, 0.3);
    color: #dc2626;
    padding: 0.3rem;
    border-radius: 3px;
    font-size: 12px;
}

.control-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.3rem;
    margin-top: 1rem;
}

.control-buttons button {
    background: rgba(220, 38, 38, 0.2);
    border: 1px solid rgba(220, 38, 38, 0.3);
    color: #dc2626;
    padding: 0.4rem 0.6rem;
    border-radius: 5px;
    cursor: pointer;
    font-size: 11px;
    transition: all 0.2s ease;
}

.control-buttons button:hover {
    background: rgba(220, 38, 38, 0.4);
    transform: translateY(-1px);
}

#particle-count-value {
    color: #ff4500;
    font-weight: bold;
    min-width: 30px;
    text-align: center;
}

@media (max-width: 768px) {
    .particle-control-panel {
        bottom: 100px;
        right: 10px;
        min-width: 180px;
    }
}
`;


const particleControlStyle = document.createElement('style');
particleControlStyle.textContent = particleControlCSS;
document.head.appendChild(particleControlStyle);


document.addEventListener('DOMContentLoaded', () => {
    
    setTimeout(() => {
        window.enhancedBackgroundParticles = new EnhancedBackgroundParticles();
        window.particleControlPanel = new ParticleControlPanel(window.enhancedBackgroundParticles);
        
        console.log('🔥 Enhanced particle system loaded!');
        console.log('📝 Use Ctrl+P to toggle particle controls');
        console.log('📝 Use Ctrl +/- to increase/decrease particles');
        console.log('📝 Use Ctrl+0 to reset particles');
    }, 2000);
});



window.DarkRedPortfolio = DarkRedPortfolio;
