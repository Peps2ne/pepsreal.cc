class LanyardAPI {
    constructor(userId) {
        this.userId = userId;
        this.websocket = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.heartbeatInterval = null;
        this.isConnected = false;
        
        // Callbacks
        this.onUpdate = null;
        this.onConnect = null;
        this.onDisconnect = null;
        
        this.connect();
    }

    connect() {
        try {
            console.log('🔗 Connecting to Lanyard API...');
            this.websocket = new WebSocket('wss://api.lanyard.rest/socket');
            
            this.websocket.onopen = () => {
                console.log('✅ Connected to Lanyard API');
                this.isConnected = true;
                this.reconnectAttempts = 0;
                
                // Send initial handshake
                this.send({
                    op: 2,
                    d: {
                        subscribe_to_id: this.userId
                    }
                });
                
                if (this.onConnect) this.onConnect();
            };

            this.websocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.handleMessage(data);
            };

            this.websocket.onclose = () => {
                console.log('❌ Disconnected from Lanyard API');
                this.isConnected = false;
                
                if (this.heartbeatInterval) {
                    clearInterval(this.heartbeatInterval);
                    this.heartbeatInterval = null;
                }
                
                if (this.onDisconnect) this.onDisconnect();
                
                // Attempt to reconnect
                if (this.reconnectAttempts < this.maxReconnectAttempts) {
                    this.reconnectAttempts++;
                    console.log(`🔄 Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
                    setTimeout(() => this.connect(), 5000);
                }
            };

            this.websocket.onerror = (error) => {
                console.error('🚨 Lanyard WebSocket error:', error);
            };

        } catch (error) {
            console.error('🚨 Failed to connect to Lanyard:', error);
        }
    }

    send(data) {
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
            this.websocket.send(JSON.stringify(data));
        }
    }

    handleMessage(message) {
        switch (message.op) {
            case 1: // Hello
                console.log('👋 Received hello from Lanyard');
                this.startHeartbeat(message.d.heartbeat_interval);
                break;
                
            case 0: // Event
                console.log('📦 Received data from Lanyard:', message.d);
                if (this.onUpdate) {
                    this.onUpdate(message.d);
                }
                break;
                
            default:
                console.log('📨 Unknown message from Lanyard:', message);
        }
    }

    startHeartbeat(interval) {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
        
        this.heartbeatInterval = setInterval(() => {
            this.send({ op: 3 });
            console.log('💓 Sent heartbeat to Lanyard');
        }, interval);
    }

    disconnect() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
        if (this.websocket) {
            this.websocket.close();
        }
    }

    // Static method to fetch data via REST API (fallback)
    static async fetchUser(userId) {
        try {
            const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
            const data = await response.json();
            return data.success ? data.data : null;
        } catch (error) {
            console.error('Failed to fetch Lanyard data:', error);
            return null;
        }
    }
}

// Lanyard Data Handler for your specific HTML structure
class LanyardHandler {
    constructor(userId) {
        this.userId = userId;
        this.lanyard = null;
        this.lastData = null;
        this.progressUpdateInterval = null;
        
        // DOM elements cache
        this.elements = {
            // Discord elements
            discordAvatar: document.getElementById('discord-avatar'),
            discordUsername: document.getElementById('discord-username'),
            discordActivity: document.querySelector('#discord-activity .activity-text'),
            discordStatus: document.getElementById('discord-status'),
            discordStatusDot: document.getElementById('discord-status-dot'),
            
            // Main profile elements
            mainAvatar: document.getElementById('main-avatar'),
            mainStatusDot: document.getElementById('main-status-dot'),
            mainStatusText: document.getElementById('main-status-text'),
            
            // Spotify elements
            spotifyTrack: document.getElementById('spotify-track'),
            spotifyArtist: document.getElementById('spotify-artist'),
            spotifyAlbum: document.getElementById('spotify-album'),
            spotifyPlaying: document.getElementById('spotify-playing'),
            spotifyProgress: document.getElementById('spotify-progress'),
            spotifyProgressContainer: document.getElementById('spotify-progress-container'),
            currentTime: document.getElementById('current-time'),
            totalTime: document.getElementById('total-time')
        };
        
        this.init();
    }

    async init() {
        // Try REST API first for initial data
        const initialData = await LanyardAPI.fetchUser(this.userId);
        if (initialData) {
            this.updateUI(initialData);
        }

        // Then connect to WebSocket for real-time updates
        this.lanyard = new LanyardAPI(this.userId);
        
        this.lanyard.onUpdate = (data) => {
            this.lastData = data;
            this.updateUI(data);
        };
        
        this.lanyard.onConnect = () => {
            this.showNotification('🟢 Connected to Discord API', 'success');
        };
        
        this.lanyard.onDisconnect = () => {
            this.showNotification('🔴 Disconnected from Discord API', 'warning');
        };
    }

    updateUI(data) {
        this.updateDiscordStatus(data);
        this.updateSpotifyStatus(data);
        this.updateAvatar(data);
        this.updateActivity(data);
    }

    updateDiscordStatus(data) {
        const status = data.discord_status || 'offline';
        
        // Update all status indicators
        const statusElements = [
            this.elements.discordStatus,
            this.elements.discordStatusDot,
            this.elements.mainStatusDot
        ];
        
        statusElements.forEach(element => {
            if (element) {
                element.className = element.className.replace(/\b(online|idle|dnd|offline)\b/g, '');
                element.classList.add(status);
            }
        });
        
        // Update status text
        const statusText = {
            online: 'Available for projects',
            idle: 'Away from keyboard',
            dnd: 'Busy, please don\'t disturb',
            offline: 'Currently offline'
        }[status] || 'Unknown status';
        
        if (this.elements.mainStatusText) {
            this.elements.mainStatusText.textContent = statusText;
        }

        console.log(`📊 Discord Status: ${status}`);
    }

    updateSpotifyStatus(data) {
        const spotify = data.spotify;
        
        if (spotify && spotify.track_id) {
            // Update track info
            if (this.elements.spotifyTrack) {
                this.elements.spotifyTrack.textContent = spotify.song || 'Unknown Track';
            }
            if (this.elements.spotifyArtist) {
                this.elements.spotifyArtist.textContent = spotify.artist || 'Unknown Artist';
            }
            
            // Update album art
            if (this.elements.spotifyAlbum && spotify.album_art_url) {
                this.elements.spotifyAlbum.src = spotify.album_art_url;
                this.elements.spotifyAlbum.style.display = 'block';
                this.elements.spotifyAlbum.parentElement.classList.remove('hidden');
            
                this.elements.spotifyAlbum.classList.add('playing');

            }
            // Update play indicator
            if (this.elements.spotifyPlaying) {
                this.elements.spotifyPlaying.classList.add('playing');
            }
            
            // Update progress bar
            this.updateSpotifyProgress(spotify);
            
            // Show progress container
            if (this.elements.spotifyProgressContainer) {
                this.elements.spotifyProgressContainer.style.display = 'block';
            }
            
            console.log(`🎵 Now Playing: ${spotify.song} by ${spotify.artist}`);
            
        } else {
            // Clear Spotify data
            if (this.elements.spotifyTrack) {
                this.elements.spotifyTrack.textContent = 'Not playing';
            }
            if (this.elements.spotifyArtist) {
                this.elements.spotifyArtist.textContent = 'Connect Spotify to Discord';
            }
            if (this.elements.spotifyAlbum) {
                this.elements.spotifyAlbum.style.display = 'none';
                this.elements.spotifyAlbum.parentElement.classList.add('hidden');
            }
            if (this.elements.spotifyPlaying) {
                this.elements.spotifyPlaying.classList.remove('playing');
            }
            if (this.elements.spotifyProgressContainer) {
                this.elements.spotifyProgressContainer.style.display = 'none';
            }
            
            // Clear progress interval
            if (this.progressUpdateInterval) {
                clearInterval(this.progressUpdateInterval);
                this.progressUpdateInterval = null;
            }
            
            console.log('🎵 No Spotify activity');
        }
    }

    updateSpotifyProgress(spotify) {
        if (!spotify.timestamps || !this.elements.spotifyProgress) return;
        
        const updateProgress = () => {
            const now = Date.now();
            const start = spotify.timestamps.start;
            const end = spotify.timestamps.end;
            const total = end - start;
            const current = Math.max(0, Math.min(total, now - start));
            const progress = (current / total) * 100;
            
            this.elements.spotifyProgress.style.width = `${progress}%`;
            this.elements.spotifyProgress.setAttribute('aria-valuenow', Math.round(progress));
            
            if (this.elements.currentTime) {
                this.elements.currentTime.textContent = this.formatTime(current);
            }
            if (this.elements.totalTime) {
                this.elements.totalTime.textContent = this.formatTime(total);
            }
        };
        
        // Update immediately
        updateProgress();
        
        // Clear existing interval
        if (this.progressUpdateInterval) {
            clearInterval(this.progressUpdateInterval);
        }
        
        // Update every second
        this.progressUpdateInterval = setInterval(updateProgress, 1000);
    }

    updateAvatar(data) {
        if (!data.discord_user) return;
        
        const user = data.discord_user;
        
        // Update username
        if (this.elements.discordUsername) {
            this.elements.discordUsername.textContent = user.display_name || user.username || 'Unknown User';
        }
        
        // Update avatars
        if (user.avatar) {
            const avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith('a_') ? 'gif' : 'png'}?size=512`;
            
            const avatarElements = [this.elements.discordAvatar, this.elements.mainAvatar];
            
            avatarElements.forEach(avatar => {
                if (avatar) {
                    avatar.src = avatarUrl;
                    avatar.alt = `${user.username}'s Avatar`;
                    
                    avatar.onload = () => {
                        console.log('✅ Avatar loaded successfully');
                        avatar.style.opacity = '1';
                    };
                    
                    avatar.onerror = () => {
                        console.log('❌ Avatar failed to load, using default');
                        avatar.src = `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`;
                    };
                }
            });
            
            console.log(`👤 Updated avatar for ${user.username}`);
        }
    }

    updateActivity(data) {
        if (!this.elements.discordActivity) return;
        
        const activities = data.activities || [];
        
        // Filter out Spotify (handled separately)
        const nonSpotifyActivities = activities.filter(activity => 
            activity.name !== 'Spotify' && activity.type !== 2
        );
        
        if (nonSpotifyActivities.length > 0) {
            const activity = nonSpotifyActivities[0];
            let activityText = '';
            
            switch (activity.type) {
                case 0: // Playing
                    activityText = `Playing ${activity.name}`;
                    break;
                case 1: // Streaming
                    activityText = `Streaming ${activity.details || activity.name}`;
                    break;
                case 3: // Watching
                    activityText = `Watching ${activity.name}`;
                    break;
                case 5: // Competing
                    activityText = `Competing in ${activity.name}`;
                    break;
                default:
                    activityText = activity.name;
            }
            
            if (activity.details && activity.type === 0) {
                activityText += ` - ${activity.details}`;
            }
            
            this.elements.discordActivity.textContent = activityText;
            console.log(`🎮 Activity: ${activityText}`);
            
        } else {
            const status = data.discord_status;
            const statusMessages = {
                online: 'Available for chat',
                idle: 'Away from keyboard',
                dnd: 'Busy, please don\'t disturb',
                offline: 'Currently offline'
            };
            
            this.elements.discordActivity.textContent = statusMessages[status] || 'No current activity';
        }
    }

    formatTime(ms) {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    showNotification(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);
        
        // Create a simple notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(67, 181, 129, 0.9)' : 'rgba(240, 71, 71, 0.9)'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10002;
            font-size: 14px;
            backdrop-filter: blur(10px);
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Get current data
    getCurrentData() {
        return this.lastData;
    }

    // Disconnect
    disconnect() {
        if (this.lanyard) {
            this.lanyard.disconnect();
        }
        if (this.progressUpdateInterval) {
            clearInterval(this.progressUpdateInterval);
        }
    }
}

// Replace with your actual Discord User ID
const DISCORD_USER_ID = '1091441605430493185'; // Get this from Discord Developer Mode

// Export for global use
window.LanyardHandler = LanyardHandler;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Lanyard API connection...');
    window.lanyardHandler = new LanyardHandler(DISCORD_USER_ID);
});

// Add CSS for notifications
const notificationCSS = `
@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = notificationCSS;
document.head.appendChild(styleSheet);
