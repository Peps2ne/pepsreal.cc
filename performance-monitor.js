// performance-monitor.js - Ultimate Website Performance Tracker
// Author: Peps Star
// Version: 2.1.0
// Description: Complete performance monitoring solution with keybind controls

class UltimatePerformanceMonitor {
    constructor(options = {}) {
        this.config = {
            enabled: true,
            autoStart: true,
            showOverlay: false, // CHANGED: Default to false (no auto-open)
            trackFPS: true,
            trackMemory: true,
            trackNetwork: true,
            trackUserEvents: true,
            trackErrors: true,
            trackCustomMetrics: true,
            keybinds: {
                toggle: 'F12', // Main toggle keybind
                export: 'Ctrl+Shift+E',
                reset: 'Ctrl+Shift+R',
                minimize: 'Ctrl+Shift+M'
            },
            alertThresholds: {
                fps: 30,
                memory: 100, // MB
                loadTime: 3000, // ms
                errorRate: 5 // per minute
            },
            sampleRate: 1000, // ms
            maxDataPoints: 100,
            ...options
        };
        
        this.metrics = {
            fps: { current: 0, avg: 0, min: Infinity, max: 0, history: [] },
            memory: { current: 0, avg: 0, min: Infinity, max: 0, history: [] },
            loadTime: { current: 0, avg: 0, min: Infinity, max: 0, history: [] },
            networkRequests: { total: 0, failed: 0, pending: 0, history: [] },
            userInteractions: { clicks: 0, scrolls: 0, keys: 0, history: [] },
            errors: { total: 0, rate: 0, history: [] },
            customEvents: { total: 0, history: [] }
        };
        
        this.observers = {};
        this.intervals = {};
        this.startTime = performance.now();
        this.sessionId = this.generateSessionId();
        this.isActive = false;
        this.overlay = null;
        this.overlayVisible = false; // Track overlay visibility separately
        this.alerts = [];
        
        // Bind methods
        this.frame = this.frame.bind(this);
        this.handleError = this.handleError.bind(this);
        this.handleUnhandledRejection = this.handleUnhandledRejection.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        
        // Setup keybind listener immediately
        this.setupKeybindListener();
        
        if (this.config.autoStart) {
            this.start();
        }
        
        console.log('🚀 Ultimate Performance Monitor initialized');
        console.log(`⌨️  Press ${this.config.keybinds.toggle} to toggle performance overlay`);
        console.log(`⌨️  Press ${this.config.keybinds.export} to export data`);
        console.log(`⌨️  Press ${this.config.keybinds.reset} to reset metrics`);
        console.log(`⌨️  Press ${this.config.keybinds.minimize} to minimize overlay`);
    }
    
    // ===========================================
    // KEYBIND SYSTEM
    // ===========================================
    
    setupKeybindListener() {
        document.addEventListener('keydown', this.handleKeyDown);
        this.log('Keybind listener setup complete', 'success');
    }
    
    handleKeyDown(event) {
        // Prevent keybinds when typing in input fields
        if (event.target.tagName === 'INPUT' || 
            event.target.tagName === 'TEXTAREA' || 
            event.target.isContentEditable) {
            return;
        }
        
        const key = this.getKeyString(event);
        
        switch (key) {
            case this.config.keybinds.toggle:
                event.preventDefault();
                this.toggleOverlay();
                break;
                
            case this.config.keybinds.export:
                event.preventDefault();
                if (this.isActive) {
                    this.exportData();
                    this.showKeybindNotification('📊 Performance data exported!');
                }
                break;
                
            case this.config.keybinds.reset:
                event.preventDefault();
                if (this.isActive) {
                    this.reset();
                    this.showKeybindNotification('🔄 Performance metrics reset!');
                }
                break;
                
            case this.config.keybinds.minimize:
                event.preventDefault();
                if (this.overlay && this.overlayVisible) {
                    this.toggleMinimize();
                    this.showKeybindNotification(this.isMinimized ? '➖ Overlay minimized' : '➕ Overlay restored');
                }
                break;
                
            // Additional keybinds
            case 'Ctrl+Shift+H': // Help
                event.preventDefault();
                this.showKeybindHelp();
                break;
                
            case 'Ctrl+Shift+S': // Stats summary
                event.preventDefault();
                if (this.isActive) {
                    this.showStatsSummary();
                }
                break;
        }
    }
    
    getKeyString(event) {
        const parts = [];
        
        if (event.ctrlKey) parts.push('Ctrl');
        if (event.shiftKey) parts.push('Shift');
        if (event.altKey) parts.push('Alt');
        if (event.metaKey) parts.push('Meta');
        
        // Handle special keys
        let key = event.key;
        if (key === ' ') key = 'Space';
        if (key === 'Escape') key = 'Esc';
        if (event.code.startsWith('F') && event.code.length <= 4) {
            key = event.code; // F1, F2, etc.
        }
        
        if (parts.length > 0) {
            parts.push(key);
            return parts.join('+');
        }
        
        return key;
    }
    
    toggleOverlay() {
        if (!this.isActive) {
            // Start monitoring and show overlay
            this.start();
            this.showOverlay();
            this.showKeybindNotification('🚀 Performance Monitor started!');
        } else if (this.overlayVisible) {
            // Hide overlay but keep monitoring
            this.hideOverlay();
            this.showKeybindNotification('👁️ Performance overlay hidden (monitoring continues)');
        } else {
            // Show overlay
            this.showOverlay();
            this.showKeybindNotification('👁️ Performance overlay shown');
        }
    }
    
    showOverlay() {
        if (!this.overlay) {
            this.createOverlay();
        }
        this.overlay.style.display = 'block';
        this.overlayVisible = true;
    }
    
    hideOverlay() {
        if (this.overlay) {
            this.overlay.style.display = 'none';
            this.overlayVisible = false;
        }
    }
    
    showKeybindNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'perf-keybind-notification';
        notification.innerHTML = `
            <div class="keybind-notification-content">
                <i class="fas fa-keyboard"></i>
                <span>${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(220, 38, 38, 0.95);
            color: #fff;
            padding: 0.75rem 1.5rem;
            border-radius: 12px;
            font-size: 14px;
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            z-index: 1000000;
            box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            animation: keybindNotificationSlide 3s ease-in-out forwards;
            pointer-events: none;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
    
    showKeybindHelp() {
        const helpModal = document.createElement('div');
        helpModal.className = 'perf-keybind-help-modal';
        helpModal.innerHTML = `
            <div class="keybind-help-backdrop" id="keybind-help-backdrop"></div>
            <div class="keybind-help-content">
                <div class="keybind-help-header">
                    <h3>⌨️ Performance Monitor Keybinds</h3>
                    <button class="keybind-help-close" id="keybind-help-close">×</button>
                </div>
                <div class="keybind-help-list">
                    <div class="keybind-item">
                        <kbd>${this.config.keybinds.toggle}</kbd>
                        <span>Toggle performance overlay</span>
                    </div>
                    <div class="keybind-item">
                        <kbd>${this.config.keybinds.export}</kbd>
                        <span>Export performance data</span>
                    </div>
                    <div class="keybind-item">
                        <kbd>${this.config.keybinds.reset}</kbd>
                        <span>Reset all metrics</span>
                    </div>
                    <div class="keybind-item">
                        <kbd>${this.config.keybinds.minimize}</kbd>
                        <span>Minimize/restore overlay</span>
                    </div>
                    <div class="keybind-item">
                        <kbd>Ctrl+Shift+H</kbd>
                        <span>Show this help</span>
                    </div>
                    <div class="keybind-item">
                        <kbd>Ctrl+Shift+S</kbd>
                        <span>Show stats summary</span>
                    </div>
                </div>
                <div class="keybind-help-footer">
                    <p>💡 Keybinds work anywhere on the page (except when typing in inputs)</p>
                </div>
            </div>
        `;
        
        helpModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000001;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: helpModalSlideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(helpModal);
        
        // Close events
        document.getElementById('keybind-help-close').addEventListener('click', () => {
            helpModal.remove();
        });
        
        document.getElementById('keybind-help-backdrop').addEventListener('click', () => {
            helpModal.remove();
        });
        
        // Close with Escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                helpModal.remove();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
        
        setTimeout(() => {
            helpModal.remove();
        }, 10000); // Auto close after 10 seconds
    }
    
    showStatsSummary() {
        const stats = this.getReport();
        const summary = `
📊 PERFORMANCE SUMMARY
=====================

🎮 FPS: ${stats.performance.avgFPS?.toFixed(1) || 'N/A'} (avg)
💾 Memory: ${stats.performance.memoryUsage || 'N/A'}MB
🌐 Network: ${stats.performance.networkRequests || 0} requests (${stats.performance.failedRequests || 0} failed)
❌ Errors: ${stats.performance.totalErrors || 0} total

Session: ${Math.round(stats.duration / 1000)}s
        `.trim();
        
        console.group('🚀 Performance Monitor Stats');
        console.log(summary);
        if (stats.recommendations.length > 0) {
            console.log('\n💡 Recommendations:');
            stats.recommendations.forEach((rec, i) => {
                console.log(`${i + 1}. ${rec}`);
            });
        }
        console.groupEnd();
        
        this.showKeybindNotification('📊 Stats logged to console!');
    }
    
    // ===========================================
    // CORE MONITORING METHODS (Updated)
    // ===========================================
    
    start() {
        if (this.isActive) {
            console.warn('Performance monitor is already active');
            return;
        }
        
        this.isActive = true;
        this.startTime = performance.now();
        
        // Start all monitoring systems
        this.startFPSMonitoring();
        this.startMemoryMonitoring();
        this.startNetworkMonitoring();
        this.startUserInteractionMonitoring();
        this.startErrorMonitoring();
        this.startPerformanceObserver();
        
        // Only create overlay if configured to show or manually requested
        if (this.config.showOverlay && !this.overlay) {
            this.createOverlay();
            this.overlayVisible = true;
        }
        
        // Start main monitoring loop
        this.intervals.main = setInterval(() => {
            this.updateMetrics();
            this.checkAlerts();
            if (this.overlay && this.overlayVisible) {
                this.updateOverlay();
            }
        }, this.config.sampleRate);
        
        this.log('Performance monitoring started (background mode)', 'success');
    }
    
    stop() {
        if (!this.isActive) {
            console.warn('Performance monitor is not active');
            return;
        }
        
        this.isActive = false;
        this.overlayVisible = false;
        
        // Clear all intervals
        Object.values(this.intervals).forEach(id => clearInterval(id));
        this.intervals = {};
        
        // Disconnect observers
        Object.values(this.observers).forEach(observer => {
            if (observer.disconnect) observer.disconnect();
        });
        this.observers = {};
        
        // Remove event listeners (except keybinds)
        this.removeEventListeners();
        
        // Hide overlay
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
        
        this.log('Performance monitoring stopped', 'info');
    }
    
    // Update the setThreshold method to include keybind notification
    setThreshold(metric, value) {
        if (this.config.alertThresholds.hasOwnProperty(metric)) {
            this.config.alertThresholds[metric] = value;
            this.log(`Threshold updated: ${metric} = ${value}`, 'success');
            this.showKeybindNotification(`🎯 ${metric} threshold set to ${value}`);
        }
    }
    
    // Update the reset method
    reset() {
        Object.keys(this.metrics).forEach(key => {
            this.metrics[key] = {
                current: 0,
                avg: 0,
                min: Infinity,
                max: 0,
                history: []
            };
        });
        
        this.startTime = performance.now();
        this.alerts = [];
        this.log('Performance monitor reset', 'info');
    }
    
    // ===========================================
    // ORIGINAL METHODS (Keep all existing functionality)
    // ===========================================
    
    // ... (Keep all the existing methods from the previous version)
    // I'll just include the key updated ones and note that all others remain the same
    
    startFPSMonitoring() {
        if (!this.config.trackFPS) return;
        
        this.lastFrameTime = performance.now();
        this.frameCount = 0;
        this.requestAnimationFrame();
    }
    
    requestAnimationFrame() {
        if (this.isActive) {
            requestAnimationFrame(this.frame);
        }
    }
    
    frame(timestamp) {
        if (!this.isActive) return;
        
        this.frameCount++;
        const deltaTime = timestamp - this.lastFrameTime;
        
        if (deltaTime >= 1000) {
            const fps = Math.round((this.frameCount * 1000) / deltaTime);
            this.updateMetric('fps', fps);
            this.frameCount = 0;
            this.lastFrameTime = timestamp;
        }
        
        this.requestAnimationFrame();
    }
    
    startMemoryMonitoring() {
        if (!this.config.trackMemory || !performance.memory) return;
        
        this.intervals.memory = setInterval(() => {
            const memory = performance.memory;
            const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
            this.updateMetric('memory', usedMB);
            
            this.metrics.memory.details = {
                used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
                limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
            };
        }, this.config.sampleRate);
    }
    
    startNetworkMonitoring() {
        if (!this.config.trackNetwork) return;
        
        const originalFetch = window.fetch;
        let pendingRequests = 0;
        
        window.fetch = async (...args) => {
            pendingRequests++;
            this.metrics.networkRequests.pending = pendingRequests;
            
            const startTime = performance.now();
            
            try {
                const response = await originalFetch(...args);
                const endTime = performance.now();
                const duration = endTime - startTime;
                
                pendingRequests--;
                this.metrics.networkRequests.pending = pendingRequests;
                this.metrics.networkRequests.total++;
                
                this.metrics.networkRequests.history.push({
                    url: args[0],
                    method: args[1]?.method || 'GET',
                    status: response.status,
                    duration,
                    timestamp: Date.now(),
                    success: response.ok
                });
                
                if (!response.ok) {
                    this.metrics.networkRequests.failed++;
                }
                
                this.trimHistory('networkRequests');
                return response;
                
            } catch (error) {
                pendingRequests--;
                this.metrics.networkRequests.pending = pendingRequests;
                this.metrics.networkRequests.failed++;
                
                this.metrics.networkRequests.history.push({
                    url: args[0],
                    method: args[1]?.method || 'GET',
                    status: 0,
                    duration: performance.now() - startTime,
                    timestamp: Date.now(),
                    success: false,
                    error: error.message
                });
                
                this.trimHistory('networkRequests');
                throw error;
            }
        };
    }
    
    startUserInteractionMonitoring() {
        if (!this.config.trackUserEvents) return;
        
        document.addEventListener('click', (e) => {
            this.metrics.userInteractions.clicks++;
            this.metrics.userInteractions.history.push({
                type: 'click',
                target: e.target.tagName,
                className: e.target.className,
                timestamp: Date.now(),
                x: e.clientX,
                y: e.clientY
            });
            this.trimHistory('userInteractions');
        }, { passive: true });
        
        let scrollTimeout;
        document.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.metrics.userInteractions.scrolls++;
                this.metrics.userInteractions.history.push({
                    type: 'scroll',
                    scrollY: window.scrollY,
                    timestamp: Date.now()
                });
                this.trimHistory('userInteractions');
            }, 100);
        }, { passive: true });
        
        document.addEventListener('keydown', (e) => {
            this.metrics.userInteractions.keys++;
            this.metrics.userInteractions.history.push({
                type: 'keydown',
                key: e.key,
                code: e.code,
                timestamp: Date.now()
            });
            this.trimHistory('userInteractions');
        }, { passive: true });
    }
    
    startErrorMonitoring() {
        if (!this.config.trackErrors) return;
        
        window.addEventListener('error', this.handleError);
        window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
        
        const originalConsoleError = console.error;
        console.error = (...args) => {
            this.metrics.errors.total++;
            this.metrics.errors.history.push({
                type: 'console.error',
                message: args.join(' '),
                timestamp: Date.now(),
                stack: new Error().stack
            });
            this.trimHistory('errors');
            this.calculateErrorRate();
            
            return originalConsoleError.apply(console, args);
        };
    }
    
    handleError(event) {
        this.metrics.errors.total++;
        this.metrics.errors.history.push({
            type: 'javascript',
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error?.stack,
            timestamp: Date.now()
        });
        this.trimHistory('errors');
        this.calculateErrorRate();
    }
    
    handleUnhandledRejection(event) {
        this.metrics.errors.total++;
        this.metrics.errors.history.push({
            type: 'promise',
            message: event.reason?.message || event.reason,
            stack: event.reason?.stack,
            timestamp: Date.now()
        });
        this.trimHistory('errors');
        this.calculateErrorRate();
    }
    
    calculateErrorRate() {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        const recentErrors = this.metrics.errors.history.filter(
            error => error.timestamp > oneMinuteAgo
        );
        this.metrics.errors.rate = recentErrors.length;
    }
    
    startPerformanceObserver() {
        if (!('PerformanceObserver' in window)) return;
        
        this.observers.navigation = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'navigation') {
                    const loadTime = entry.loadEventEnd - entry.fetchStart;
                    this.updateMetric('loadTime', loadTime);
                    
                    this.metrics.loadTime.details = {
                        dns: entry.domainLookupEnd - entry.domainLookupStart,
                        connect: entry.connectEnd - entry.connectStart,
                        request: entry.responseStart - entry.requestStart,
                        response: entry.responseEnd - entry.responseStart,
                        dom: entry.domContentLoadedEventEnd - entry.responseEnd,
                        load: entry.loadEventEnd - entry.domContentLoadedEventEnd
                    };
                }
            }
        });
        
        try {
            this.observers.navigation.observe({ entryTypes: ['navigation'] });
        } catch (e) {
            console.warn('Navigation timing not supported');
        }
    }
    
    // Keep all the remaining methods from the original implementation...
    // (createOverlay, updateOverlay, charts, alerts, export functions, etc.)
    
    createOverlay() {
        if (this.overlay) return;
        
        this.overlay = document.createElement('div');
        this.overlay.className = 'perf-monitor-overlay';
        this.overlay.innerHTML = `
            <div class="perf-monitor-header">
                <div class="perf-monitor-title">
                    <i class="fas fa-tachometer-alt"></i>
                    Performance Monitor
                    <small>Press ${this.config.keybinds.toggle} to toggle</small>
                </div>
                <div class="perf-monitor-controls">
                    <button class="perf-btn" id="perf-minimize" title="Minimize (${this.config.keybinds.minimize})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <button class="perf-btn" id="perf-export" title="Export Data (${this.config.keybinds.export})">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="perf-btn" id="perf-help" title="Help (Ctrl+Shift+H)">
                        <i class="fas fa-question"></i>
                    </button>
                    <button class="perf-btn" id="perf-close" title="Close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="perf-monitor-content" id="perf-content">
                <div class="perf-metrics-grid">
                    <div class="perf-metric-card fps">
                        <div class="metric-header">
                            <i class="fas fa-video"></i>
                            <span>FPS</span>
                        </div>
                        <div class="metric-value" id="fps-value">--</div>
                        <div class="metric-details">
                            <span>Avg: <span id="fps-avg">--</span></span>
                            <span>Min: <span id="fps-min">--</span></span>
                        </div>
                    </div>
                    
                    <div class="perf-metric-card memory">
                        <div class="metric-header">
                            <i class="fas fa-memory"></i>
                            <span>Memory</span>
                        </div>
                        <div class="metric-value" id="memory-value">--</div>
                        <div class="metric-details">
                            <span>Used: <span id="memory-used">--</span></span>
                            <span>Limit: <span id="memory-limit">--</span></span>
                        </div>
                    </div>
                    
                    <div class="perf-metric-card network">
                        <div class="metric-header">
                            <i class="fas fa-network-wired"></i>
                            <span>Network</span>
                        </div>
                        <div class="metric-value" id="network-value">--</div>
                        <div class="metric-details">
                            <span>Failed: <span id="network-failed">--</span></span>
                            <span>Pending: <span id="network-pending">--</span></span>
                        </div>
                    </div>
                    
                    <div class="perf-metric-card errors">
                        <div class="metric-header">
                            <i class="fas fa-exclamation-triangle"></i>
                            <span>Errors</span>
                        </div>
                        <div class="metric-value" id="errors-value">--</div>
                        <div class="metric-details">
                            <span>Rate: <span id="errors-rate">--</span>/min</span>
                            <span>Total: <span id="errors-total">--</span></span>
                        </div>
                    </div>
                </div>
                
                <div class="perf-charts">
                    <div class="perf-chart">
                        <canvas id="fps-chart" width="300" height="100"></canvas>
                    </div>
                    <div class="perf-chart">
                        <canvas id="memory-chart" width="300" height="100"></canvas>
                    </div>
                </div>
                
                <div class="perf-alerts" id="perf-alerts"></div>
            </div>
        `;
        
        this.overlay.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid #dc2626;
            border-radius: 15px;
            color: #fff;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            z-index: 999999;
            backdrop-filter: blur(20px);
            box-shadow: 0 0 30px rgba(220, 38, 38, 0.5);
            user-select: none;
            min-width: 350px;
            max-width: 500px;
        `;
        
        document.body.appendChild(this.overlay);
        this.setupOverlayEvents();
        this.initializeCharts();
    }
    
    setupOverlayEvents() {
        document.getElementById('perf-minimize').addEventListener('click', () => {
            this.toggleMinimize();
        });
        
        document.getElementById('perf-export').addEventListener('click', () => {
            this.exportData();
        });
        
        document.getElementById('perf-help').addEventListener('click', () => {
            this.showKeybindHelp();
        });
        
        document.getElementById('perf-close').addEventListener('click', () => {
            this.hideOverlay();
        });
        
        // Make draggable
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };
        
        const header = this.overlay.querySelector('.perf-monitor-header');
        header.style.cursor = 'move';
        
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = this.overlay.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                this.overlay.style.left = `${e.clientX - dragOffset.x}px`;
                this.overlay.style.top = `${e.clientY - dragOffset.y}px`;
            }
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }
    
    toggleMinimize() {
        const content = document.getElementById('perf-content');
        const minimizeBtn = document.getElementById('perf-minimize');
        
        this.isMinimized = !this.isMinimized;
        
        if (this.isMinimized) {
            content.style.display = 'none';
            minimizeBtn.innerHTML = '<i class="fas fa-plus"></i>';
            minimizeBtn.title = `Restore (${this.config.keybinds.minimize})`;
        } else {
            content.style.display = 'block';
            minimizeBtn.innerHTML = '<i class="fas fa-minus"></i>';
            minimizeBtn.title = `Minimize (${this.config.keybinds.minimize})`;
        }
    }
    
    // Include all the other methods (updateOverlay, charts, export, etc.)
    // ... (keeping the rest of the original implementation)
    
    updateMetric(type, value) {
        const metric = this.metrics[type];
        if (!metric) return;
        
        metric.current = value;
        metric.history.push({ value, timestamp: Date.now() });
        
        metric.min = Math.min(metric.min, value);
        metric.max = Math.max(metric.max, value);
        
        const recent = metric.history.slice(-10);
        metric.avg = recent.reduce((sum, item) => sum + item.value, 0) / recent.length;
        
        this.trimHistory(type);
    }
    
    trimHistory(type) {
        const history = this.metrics[type].history;
        if (history && history.length > this.config.maxDataPoints) {
            history.splice(0, history.length - this.config.maxDataPoints);
        }
    }
    
    updateMetrics() {
        this.metrics.customEvents.total = this.metrics.customEvents.history.length;
    }
    
    generateSessionId() {
        return 'perf_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    removeEventListeners() {
        window.removeEventListener('error', this.handleError);
        window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
        // Keep keybind listener active
    }
    
    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = `[Performance Monitor ${timestamp}]`;
        
        switch (type) {
            case 'success':
                console.log(`%c${prefix} ${message}`, 'color: #22c55e; font-weight: bold;');
                break;
            case 'warning':
                console.warn(`${prefix} ${message}`);
                break;
            case 'error':
                console.error(`${prefix} ${message}`);
                break;
            default:
                console.log(`${prefix} ${message}`);
        }
    }
    
    // Include basic chart functionality
    initializeCharts() {
        this.charts = {
            fps: { canvas: document.getElementById('fps-chart'), data: [] },
            memory: { canvas: document.getElementById('memory-chart'), data: [] }
        };
        
        Object.keys(this.charts).forEach(key => {
            const chart = this.charts[key];
            chart.ctx = chart.canvas.getContext('2d');
            chart.ctx.strokeStyle = key === 'fps' ? '#22c55e' : '#3b82f6';
            chart.ctx.lineWidth = 2;
        });
    }
    
    updateOverlay() {
        if (!this.overlay || this.isMinimized) return;
        
        const metrics = this.metrics;
        
        document.getElementById('fps-value').textContent = metrics.fps.current || '--';
        document.getElementById('fps-avg').textContent = Math.round(metrics.fps.avg) || '--';
        document.getElementById('fps-min').textContent = metrics.fps.min === Infinity ? '--' : metrics.fps.min;
        
        document.getElementById('memory-value').textContent = `${metrics.memory.current || '--'}MB`;
        if (metrics.memory.details) {
            document.getElementById('memory-used').textContent = `${metrics.memory.details.used}MB`;
            document.getElementById('memory-limit').textContent = `${metrics.memory.details.limit}MB`;
        }
        
        document.getElementById('network-value').textContent = metrics.networkRequests.total || '--';
        document.getElementById('network-failed').textContent = metrics.networkRequests.failed || '--';
        document.getElementById('network-pending').textContent = metrics.networkRequests.pending || '--';
        
        document.getElementById('errors-value').textContent = metrics.errors.total || '--';
        document.getElementById('errors-rate').textContent = metrics.errors.rate || '--';
        document.getElementById('errors-total').textContent = metrics.errors.total || '--';
    }
    
    checkAlerts() {
        this.alerts = [];
        
        if (this.metrics.fps.current && this.metrics.fps.current < this.config.alertThresholds.fps) {
            this.alerts.push({
                type: 'warning',
                metric: 'FPS',
                message: `Low FPS detected: ${this.metrics.fps.current}`,
                value: this.metrics.fps.current,
                threshold: this.config.alertThresholds.fps
            });
        }
        
        if (this.metrics.memory.current > this.config.alertThresholds.memory) {
            this.alerts.push({
                type: 'error',
                metric: 'Memory',
                message: `High memory usage: ${this.metrics.memory.current}MB`,
                value: this.metrics.memory.current,
                threshold: this.config.alertThresholds.memory
            });
        }
        
        if (this.metrics.errors.rate > this.config.alertThresholds.errorRate) {
            this.alerts.push({
                type: 'error',
                metric: 'Errors',
                message: `High error rate: ${this.metrics.errors.rate} errors/min`,
                value: this.metrics.errors.rate,
                threshold: this.config.alertThresholds.errorRate
            });
        }
    }
    
    // Basic export functionality
    exportData(format = 'json') {
        const exportData = {
            sessionId: this.sessionId,
            startTime: this.startTime,
            endTime: performance.now(),
            duration: performance.now() - this.startTime,
            metrics: this.metrics,
            alerts: this.alerts,
            config: this.config,
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `performance-report-${this.sessionId}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.log('Performance data exported', 'success');
    }
    
    // Public API methods
    getMetrics() {
        return { ...this.metrics };
    }
    
    getReport() {
        return {
            sessionId: this.sessionId,
            startTime: this.startTime,
            duration: performance.now() - this.startTime,
            metrics: this.getMetrics(),
            alerts: [...this.alerts],
            performance: {
                avgFPS: this.metrics.fps.avg,
                memoryUsage: this.metrics.memory.current,
                totalErrors: this.metrics.errors.total,
                networkRequests: this.metrics.networkRequests.total,
                failedRequests: this.metrics.networkRequests.failed
            },
            recommendations: this.getRecommendations()
        };
    }
    
    getRecommendations() {
        const recommendations = [];
        
        if (this.metrics.fps.avg < 30) {
            recommendations.push('Consider optimizing animations or reducing visual complexity');
        }
        
        if (this.metrics.memory.current > 100) {
            recommendations.push('High memory usage detected - check for memory leaks');
        }
        
        if (this.metrics.networkRequests.failed > 5) {
            recommendations.push('Multiple network requests failing - check API endpoints');
        }
        
        if (this.metrics.errors.rate > 5) {
            recommendations.push('High error rate - review JavaScript errors');
        }
        
        return recommendations;
    }
    
    trackCustomEvent(name, value = 1, metadata = {}) {
        this.metrics.customEvents.total++;
        this.metrics.customEvents.history.push({
            name,
            value,
            metadata,
            timestamp: Date.now()
        });
        this.trimHistory('customEvents');
        
        this.log(`Custom event tracked: ${name} = ${value}`, 'info');
    }
}

// Enhanced CSS with keybind notification styles
const performanceMonitorCSS = `
.perf-monitor-overlay {
    font-family: 'Courier New', monospace !important;
}

.perf-monitor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: rgba(220, 38, 38, 0.1);
    border-bottom: 1px solid rgba(220, 38, 38, 0.3);
    border-radius: 13px 13px 0 0;
}

.perf-monitor-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: bold;
    color: #dc2626;
    font-size: 14px;
}

.perf-monitor-title small {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.6);
    margin-left: 0.5rem;
}

.perf-monitor-controls {
    display: flex;
    gap: 0.25rem;
}

.perf-btn {
    background: rgba(220, 38, 38, 0.2);
    border: 1px solid rgba(220, 38, 38, 0.3);
    color: #dc2626;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 10px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.perf-btn:hover {
    background: rgba(220, 38, 38, 0.4);
    transform: scale(1.1);
}

.perf-monitor-content {
    padding: 1rem;
}

.perf-metrics-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    margin-bottom: 1rem;
}

.perf-metric-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-left: 4px solid #22c55e;
    border-radius: 8px;
    padding: 0.75rem;
    transition: all 0.2s ease;
}

.perf-metric-card:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-1px);
}

.metric-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 11px;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.9);
}

.metric-value {
    font-size: 18px;
    font-weight: bold;
    color: #fff;
    margin-bottom: 0.25rem;
}

.metric-details {
    display: flex;
    justify-content: space-between;
    font-size: 9px;
    color: rgba(255, 255, 255, 0.7);
}

.perf-charts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
}

.perf-chart {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 0.5rem;
}

.perf-chart canvas {
    width: 100%;
    height: 100px;
}

/* Keybind Notification Styles */
@keyframes keybindNotificationSlide {
    0% { 
        opacity: 0; 
        transform: translateX(100%) translateY(-10px);
    }
    10%, 90% { 
        opacity: 1; 
        transform: translateX(0) translateY(0);
    }
    100% { 
        opacity: 0; 
        transform: translateX(100%) translateY(-10px);
    }
}

.keybind-notification-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.keybind-notification-content i {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.9);
}

/* Keybind Help Modal Styles */
@keyframes helpModalSlideIn {
    0% { 
        opacity: 0; 
        transform: scale(0.9);
    }
    100% { 
        opacity: 1; 
        transform: scale(1);
    }
}

.keybind-help-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
}

.keybind-help-content {
    background: rgba(15, 15, 15, 0.95);
    border: 2px solid #dc2626;
    border-radius: 15px;
    color: #fff;
    font-family: 'Inter', sans-serif;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    backdrop-filter: blur(20px);
    box-shadow: 0 0 50px rgba(220, 38, 38, 0.5);
    position: relative;
    z-index: 1;
}

.keybind-help-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid rgba(220, 38, 38, 0.3);
}

.keybind-help-header h3 {
    margin: 0;
    color: #dc2626;
    font-size: 1.3rem;
}

.keybind-help-close {
    background: rgba(220, 38, 38, 0.2);
    border: 1px solid #dc2626;
    color: #dc2626;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.keybind-help-close:hover {
    background: rgba(220, 38, 38, 0.4);
    transform: scale(1.1);
}

.keybind-help-list {
    padding: 1.5rem;
}

.keybind-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.keybind-item:last-child {
    border-bottom: none;
}

.keybind-item kbd {
    background: rgba(220, 38, 38, 0.2);
    border: 1px solid rgba(220, 38, 38, 0.3);
    color: #dc2626;
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    font-weight: bold;
    min-width: 100px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.keybind-item span {
    color: rgba(255, 255, 255, 0.9);
    font-size: 14px;
}

.keybind-help-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid rgba(220, 38, 38, 0.3);
    background: rgba(220, 38, 38, 0.05);
}

.keybind-help-footer p {
    margin: 0;
    color: rgba(255, 255, 255, 0.7);
    font-size: 13px;
    text-align: center;
}

/* Mobile responsive */
@media (max-width: 768px) {
    .perf-monitor-overlay {
        min-width: 280px;
        max-width: 90vw;
    }
    
    .perf-metrics-grid {
        grid-template-columns: 1fr;
    }
    
    .perf-charts {
        grid-template-columns: 1fr;
    }
    
    .keybind-help-content {
        width: 95%;
        max-height: 85vh;
    }
    
    .keybind-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
    
    .keybind-item kbd {
        min-width: auto;
    }
}
`;

// Auto-inject CSS if not already present
if (!document.querySelector('#perf-monitor-styles')) {
    const style = document.createElement('style');
    style.id = 'perf-monitor-styles';
    style.textContent = performanceMonitorCSS;
    document.head.appendChild(style);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UltimatePerformanceMonitor;
}

// Global initialization
window.UltimatePerformanceMonitor = UltimatePerformanceMonitor;

// Updated auto-start with no overlay by default
document.addEventListener('DOMContentLoaded', () => {
    if (!window.ultimatePerformanceMonitor) {
        window.ultimatePerformanceMonitor = new UltimatePerformanceMonitor({
            autoStart: true,
            showOverlay: false // CHANGED: No auto-show overlay
        });
        
        console.log('🚀 Ultimate Performance Monitor loaded in background mode');
        console.log(`⌨️  Press ${window.ultimatePerformanceMonitor.config.keybinds.toggle} to show performance overlay`);
        console.log('📊 Access via: window.ultimatePerformanceMonitor');
        console.log('🔧 Available keybinds:');
        console.log(`   ${window.ultimatePerformanceMonitor.config.keybinds.toggle} - Toggle overlay`);
        console.log(`   ${window.ultimatePerformanceMonitor.config.keybinds.export} - Export data`);
        console.log(`   ${window.ultimatePerformanceMonitor.config.keybinds.reset} - Reset metrics`);
        console.log(`   ${window.ultimatePerformanceMonitor.config.keybinds.minimize} - Minimize overlay`);
        console.log('   Ctrl+Shift+H - Show keybind help');
        console.log('   Ctrl+Shift+S - Show stats summary');
    }
});
