// JS For Red & Dark Theme
class DarkRedPortfolio {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.startAnimations();
        this.initializeWidgets();
    }

    init() {
        // Initialize cursor effects
        this.initCustomCursor();
        
        // Initialize entry page
        this.initEntryPage();
        
        // Initialize theme toggle
        this.initThemeToggle();
        
        // Initialize audio control
        this.initAudioControl();
        
        // Initialize typing animation
        this.initTypingAnimation();
        
        // Initialize stats counter
        this.initStatsCounter();
        
        // Initialize social links
        this.initSocialLinks();
        
        // Initialize performance monitor
        this.initPerformanceMonitor();
    }


    // Custom Cursor with Dark Red Effects
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

        // Smooth ring follow animation
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

        // Add hover effects for interactive elements
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

    // Create red burst effect on hover
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

    // Entry Page Animation
    initEntryPage() {
        const entryPage = document.getElementById('entry-page');
        const mainSite = document.getElementById('main-site');
        const entryButton = document.getElementById('entry-button');
        const backgroundMusic = document.getElementById('background-music');

        const enterSite = () => {
            // Play entrance sound effect
            this.playRedSound();

            if (window.musicPlayer && window.musicPlayer.autoPlayMusic) {
                    // Wait for entry animations to complete
                setTimeout(() => {
                window.musicPlayer.autoPlayMusic();
            }, 2000);
    }
            
            // Animate entry page out
            entryPage.style.animation = 'redFadeOut 1s ease-in-out forwards';
            
            setTimeout(() => {
                entryPage.style.display = 'none';
                mainSite.style.display = 'block';
                mainSite.style.animation = 'redFadeIn 1s ease-in-out forwards';
                
                // Start all animations
                this.startMainAnimations();
                
                // Try to play background music (user interaction required)
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

    // Theme Toggle with Dark Red Effects
    initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const body = document.body;
        
        let isDark = true; // Default to dark theme

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
            
            // Add click effect with red glow
            themeToggle.style.transform = 'scale(0.9)';
            themeToggle.style.boxShadow = '0 0 20px rgba(220, 38, 38, 0.5)';
            setTimeout(() => {
                themeToggle.style.transform = 'scale(1)';
                themeToggle.style.boxShadow = '';
            }, 150);
        });
    }

    // Audio Control with Red Visualizer
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

        // Red audio visualizer effect
        if (backgroundMusic) {
            backgroundMusic.addEventListener('play', () => {
                this.startRedAudioVisualizer();
            });
        }
    }
    

    // Typing Animation with Red Effects
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

            // Add red cursor effect
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

    // Animated Stats Counter with Red Glow
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
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (end - start) * easeOut);
            
            element.textContent = current.toLocaleString();
            
            // Add red glow effect during animation
            element.style.textShadow = `0 0 ${10 + progress * 20}px rgba(220, 38, 38, 0.8)`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.textShadow = '0 0 15px rgba(220, 38, 38, 0.6)';
            }
        };
        
        requestAnimationFrame(animate);
    }

    // Social Links with Red Ripple Effect
    initSocialLinks() {
        const socialLinks = document.querySelectorAll('.social-link');
        
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const url = link.dataset.link;
                const platform = link.dataset.platform;
                
                if (url) {
                    // Copy to clipboard
                    navigator.clipboard.writeText(url).then(() => {
                        this.showNotification(`${platform} link copied!`, 'success');
                        this.createRedRipple(e.target, e.clientX, e.clientY);
                    }).catch(() => {
                        // Fallback for older browsers
                        window.open(url, '_blank');
                    });
                } else {
                    // For contact link
                    navigator.clipboard.writeText('operations@pepsreal.cc').then(() => {
                        this.showNotification('Email copied to clipboard!', 'success');
                    });
                }
            });
        });
    }

    // Red Ripple Effect for Clicks
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

    // Red Notification System
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
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Start Main Animations
    startMainAnimations() {
        this.initParticles();
        this.initFloatingElements();
        this.updateLastSeen();
        this.startRedMatrixRain();
    }

    // Red Particle System
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

    // Red Matrix Rain Effect
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

    // Update Last Seen Time
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

    // Red Audio Visualizer Effect
    startRedAudioVisualizer() {
        const audioControl = document.getElementById('audio-control');
        if (!audioControl) return;

        const visualizer = document.createElement('div');
        visualizer.className = 'red-audio-visualizer';
        visualizer.innerHTML = Array.from({length: 5}, () => '<div class="red-bar"></div>').join('');
        
        audioControl.appendChild(visualizer);
        
        // Animate bars with red colors
        const bars = visualizer.querySelectorAll('.red-bar');
        const animateBars = () => {
            bars.forEach(bar => {
                const height = Math.random() * 20 + 5;
                bar.style.height = `${height}px`;
                bar.style.background = `linear-gradient(to top, #991b1b, #dc2626, #ef4444)`;
            });
        };
        
        const interval = setInterval(animateBars, 150);
        
        // Clean up when music stops
        const audio = document.getElementById('background-music');
        audio.addEventListener('pause', () => {
            clearInterval(interval);
            visualizer.remove();
        });
    }

    // Play Red Sound Effect
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

    // Initialize Widgets (Discord, Spotify, Stats)
    initializeWidgets() {
        this.initDiscordWidget();
        this.initSpotifyWidget();
        this.initStatsWidget();
    }

    initDiscordWidget() {
        // Mock Discord status with animation
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
        // Mock Spotify data with red theme
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
        // Initialize stats with animation
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

    // Performance Monitor
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
                
                // Adjust effects based on performance
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

    // Setup Event Listeners
    setupEventListeners() {
        // Window resize handler
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
        
        // Mouse move parallax
        document.addEventListener('mousemove', this.handleParallax.bind(this));
        
        // Visibility change
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }

    handleResize() {
        // Update particle positions
        const particles = document.querySelectorAll('.red-particle');
        particles.forEach(particle => {
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
        });
    }

    handleKeyboard(e) {
        // Keyboard shortcuts
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
        
        // Apply subtle parallax to widgets
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
