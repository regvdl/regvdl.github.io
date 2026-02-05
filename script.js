// Script loaded marker
window.__gpScriptLoaded = true;

// ===== Tab System =====
function initTabSystem() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            // Deactivate all tabs and buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Activate selected tab
            button.classList.add('active');
            const activeContent = document.querySelector(`.tab-content[data-tab="${tabName}"]`);
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    });
}

// ===== Command Center Tab System =====
function initCommandCenter() {
    const commandTabs = document.querySelectorAll('.command-tab');
    const tabPanels = document.querySelectorAll('.tab-panel');

    commandTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetPanel = tab.getAttribute('data-tab');
            
            // Remove active from all tabs
            commandTabs.forEach(t => {
                t.classList.remove('active');
                t.style.background = 'var(--bg-secondary)';
                t.style.color = 'var(--text-secondary)';
                t.style.border = '1px solid var(--border)';
            });
            
            // Hide all panels
            tabPanels.forEach(p => {
                p.style.display = 'none';
            });
            
            // Activate clicked tab
            tab.classList.add('active');
            tab.style.background = 'linear-gradient(135deg, var(--primary), var(--primary-dark))';
            tab.style.color = 'white';
            tab.style.border = 'none';
            
            // Show corresponding panel
            const panel = document.querySelector(`.tab-panel[data-panel="${targetPanel}"]`);
            if (panel) {
                panel.style.display = 'flex';
                console.log(`✅ Switched to ${targetPanel} tab`);
            }
        });
    });
    
    console.log('✅ Command Center initialized');
}

// ===== Ad Overlay System =====
function showAdOverlay() {
    const commandCenter = document.querySelector('.command-center');
    const adPanel = document.getElementById('adPanel');
    const adContent = document.getElementById('adContent');
    
    if (!adPanel || !commandCenter) {
        console.warn('⚠️ Ad panel or command center not found');
        return;
    }
    
    // Load ad content with Google AdSense
    if (adContent) {
        // Generate unique ad slot IDs for fresh ad load
        const timestamp = Date.now();
        const slotId = `gpt-ad-attack-${timestamp}`;
        
        adContent.innerHTML = `
            <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 10px;">
                <!-- Google AdSense Ad Unit -->
                <ins class="adsbygoogle"
                     style="display:block; width:100%; height:100%; margin: auto;"
                     data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
                     data-ad-slot="1234567890"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
            </div>
        `;
        
        // Push ad to AdSense for rendering
        try {
            (adsbygoogle = window.adsbygoogle || []).push({});
            console.log('📺 Google AdSense ad loaded');
        } catch (e) {
            console.warn('⚠️ AdSense loading:', e);
            // Fallback content
            adContent.innerHTML = `
                <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; text-align: center;">
                    <h2 style="font-size: 1.8rem; margin-bottom: 20px;">🚀 Attack in Progress!</h2>
                    <div style="font-size: 1.3rem; margin-bottom: 30px; color: var(--text-secondary);">Your missile is flying...</div>
                    <div id="adTimer" style="font-size: 3rem; font-weight: bold; color: var(--primary); margin-bottom: 40px;">30s</div>
                </div>
            `;
        }
    }
    
    // Hide command center with fade out
    commandCenter.style.transition = 'opacity 0.5s ease';
    commandCenter.style.opacity = '0';
    
    setTimeout(() => {
        commandCenter.style.display = 'none';
        
        // Show ad panel with fade in
        adPanel.style.display = 'flex';
        adPanel.style.opacity = '0';
        adPanel.style.transition = 'opacity 0.5s ease';
        
        // Trigger fade in
        setTimeout(() => {
            adPanel.style.opacity = '1';
        }, 50);
    }, 500);
    
    console.log('📺 Ad panel shown');
}

function hideAdOverlay() {
    const commandCenter = document.querySelector('.command-center');
    const adPanel = document.getElementById('adPanel');
    
    if (!adPanel) return;
    
    // Fade out ad panel
    adPanel.style.transition = 'opacity 0.5s ease';
    adPanel.style.opacity = '0';
    
    setTimeout(() => {
        adPanel.style.display = 'none';
        
        // Show command center with fade in
        if (commandCenter) {
            commandCenter.style.display = 'flex';
            commandCenter.style.transition = 'opacity 0.5s ease';
            commandCenter.style.opacity = '0';
            
            // Trigger fade in
            setTimeout(() => {
                commandCenter.style.opacity = '1';
            }, 50);
        }
    }, 500);
    
    console.log('📺 Ad panel hidden');
}



function startAdTimer(duration = 30) {
    let remaining = duration;
    const timerElement = document.getElementById('adTimer');
    
    const interval = setInterval(() => {
        remaining--;
        if (timerElement) {
            timerElement.textContent = `${remaining}s`;
        }
        
        if (remaining <= 0) {
            clearInterval(interval);
            hideAdOverlay();
        }
    }, 1000);
    
    return interval;
}

// Helper function to get country code from coordinates
function getCountryFromCoordinates(lat, lon) {
  const countryBounds = {
    'BG': { latMin: 41.2353, latMax: 44.2168, lonMin: 22.3571, lonMax: 28.5681, name: 'Bulgaria' },
    'RO': { latMin: 43.6884, latMax: 48.2208, lonMin: 20.2619, lonMax: 29.6279, name: 'Romania' },
    'GR': { latMin: 34.8022, latMax: 41.7488, lonMin: 19.3731, lonMax: 28.2432, name: 'Greece' },
    'TR': { latMin: 35.8081, latMax: 42.7939, lonMin: 26.0433, lonMax: 44.7939, name: 'Turkey' },
    'DE': { latMin: 47.2701, latMax: 55.0996, lonMin: 5.8663, lonMax: 15.0419, name: 'Germany' },
    'FR': { latMin: 42.4314, latMax: 51.1242, lonMin: -5.1422, lonMax: 8.2275, name: 'France' },
    'IT': { latMin: 36.6230, latMax: 47.0921, lonMin: 6.6272, lonMax: 18.5203, name: 'Italy' },
    'ES': { latMin: 36.0021, latMax: 43.7483, lonMin: -9.2393, lonMax: 3.0910, name: 'Spain' },
    'GB': { latMin: 50.0229, latMax: 58.6350, lonMin: -7.5721, lonMax: 1.7628, name: 'United Kingdom' },
    'US': { latMin: 24.5210, latMax: 49.3844, lonMin: -125.0011, lonMax: -66.9326, name: 'United States' },
    'CA': { latMin: 41.6765, latMax: 83.1096, lonMin: -141.0017, lonMax: -52.6480, name: 'Canada' },
    'MX': { latMin: 14.5345, latMax: 32.7186, lonMin: -117.1205, lonMax: -86.8108, name: 'Mexico' },
    'BR': { latMin: -33.7683, latMax: 5.2419, lonMin: -73.9830, lonMax: -34.7725, name: 'Brazil' },
    'JP': { latMin: 30.3966, latMax: 45.5514, lonMin: 130.4017, lonMax: 145.8369, name: 'Japan' },
    'CN': { latMin: 18.2671, latMax: 53.5604, lonMin: 73.5057, lonMax: 135.0865, name: 'China' },
    'IN': { latMin: 8.0883, latMax: 35.5047, lonMin: 68.1766, lonMax: 97.4025, name: 'India' },
    'AU': { latMin: -43.6345, latMax: -10.6718, lonMin: 112.9211, lonMax: 154.3021, name: 'Australia' },
    'ZA': { latMin: -34.8212, latMax: -22.0529, lonMin: 16.3449, lonMax: 32.8305, name: 'South Africa' },
    'RU': { latMin: 41.1850, latMax: 81.8554, lonMin: 19.6389, lonMax: 169.6007, name: 'Russia' }
  };

  // First try bounds-based detection (most accurate)
  for (const [code, bounds] of Object.entries(countryBounds)) {
    if (lat >= bounds.latMin && lat <= bounds.latMax && lon >= bounds.lonMin && lon <= bounds.lonMax) {
      return code;
    }
  }

  // If not within any country bounds, map to nearest country boundary
  let closest = 'Unknown';
  let minDistance = Infinity;

  for (const [code, bounds] of Object.entries(countryBounds)) {
    const clampedLat = Math.min(Math.max(lat, bounds.latMin), bounds.latMax);
    const clampedLon = Math.min(Math.max(lon, bounds.lonMin), bounds.lonMax);
    const distance = Math.sqrt(
      Math.pow(lat - clampedLat, 2) + Math.pow(lon - clampedLon, 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      closest = code;
    }
  }

  return closest;
}

// Socket.io connection (initialized after socket.io is available)
let socket = null;

// Map variables
let map;
let markers = {};
let userMarker = null; // Track user's own marker
let pulseHistory = []; // Store all pulse history for marker updates
let activityHistory = []; // Store all activity history

// UI Elements (will be set when DOM is ready)
let pulseBtn, globalCountEl, topCountriesEl, statusEl, statusText;
let themeBtn, geoBtn, userPulsesEl, userCountryEl, recentActivityEl;
let battleTargetsEl, battleTargetNameEl, battleTargetCoordsEl, battleToggleEl;
let activeTargetsEl, destroyedTargetsEl, activeCountriesEl, lastPulseEl, battleModeStatusEl, selectedTargetEl;

// Local state
let userPulses = 0;
let userCountry = 'Unknown';
let userCoordinates = null;
let maxPulses = Infinity;
let currentPeriod = 'all';
let currentModalPeriod = 'all';
let geoPermissionStatus = null;
let battleModeEnabled = true;
const locationCache = new Map();
const LOCATION_KEY_PRECISION = 4;

// Session & totals stats
let sessionStartTime = null;
let sessionKills = 0;
let personalBest = 0;
let sessionStreak = 0;
let dailyStreak = 0;
let bestStreak = 0;
let totalSessions = 0;
let totalPulses = 0;
let totalKills = 0;
let hasGlobalAttack = false;

// Scoring system
let personalScore = 0;
let countryScores = {}; // {countryCode: totalScore}

// User authentication
let currentUser = null; // {provider, id, name, avatar, country}

// Sound System (Modern Web Audio API with ADSR envelopes and effects)
const soundEnabled = localStorage.getItem('soundEnabled') !== 'false';

function playSound(soundName) {
    if (!soundEnabled) return;
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioContext.currentTime;
        
        // Master gain
        const masterGain = audioContext.createGain();
        masterGain.connect(audioContext.destination);
        masterGain.gain.value = 0.3;
        
        // Create different sounds with modern synthesis
        switch(soundName) {
            case 'pulse':
                // Futuristic beep with filter sweep
                const pulseOsc = audioContext.createOscillator();
                const pulseGain = audioContext.createGain();
                const pulseFilter = audioContext.createBiquadFilter();
                
                pulseOsc.type = 'sine';
                pulseOsc.frequency.setValueAtTime(880, now);
                pulseOsc.frequency.exponentialRampToValueAtTime(440, now + 0.1);
                
                pulseFilter.type = 'lowpass';
                pulseFilter.frequency.setValueAtTime(2000, now);
                pulseFilter.frequency.exponentialRampToValueAtTime(800, now + 0.1);
                pulseFilter.Q.value = 5;
                
                pulseOsc.connect(pulseFilter);
                pulseFilter.connect(pulseGain);
                pulseGain.connect(masterGain);
                
                // ADSR Envelope
                pulseGain.gain.setValueAtTime(0, now);
                pulseGain.gain.linearRampToValueAtTime(0.8, now + 0.01); // Attack
                pulseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15); // Release
                
                pulseOsc.start(now);
                pulseOsc.stop(now + 0.15);
                break;
                
            case 'attack':
                // Aggressive laser blast with noise
                const attackOsc1 = audioContext.createOscillator();
                const attackOsc2 = audioContext.createOscillator();
                const attackGain = audioContext.createGain();
                const attackFilter = audioContext.createBiquadFilter();
                
                attackOsc1.type = 'sawtooth';
                attackOsc1.frequency.setValueAtTime(200, now);
                attackOsc1.frequency.exponentialRampToValueAtTime(50, now + 0.3);
                
                attackOsc2.type = 'square';
                attackOsc2.frequency.setValueAtTime(205, now); // Slight detune
                attackOsc2.frequency.exponentialRampToValueAtTime(52, now + 0.3);
                
                attackFilter.type = 'bandpass';
                attackFilter.frequency.setValueAtTime(1000, now);
                attackFilter.Q.value = 2;
                
                attackOsc1.connect(attackFilter);
                attackOsc2.connect(attackFilter);
                attackFilter.connect(attackGain);
                attackGain.connect(masterGain);
                
                attackGain.gain.setValueAtTime(0, now);
                attackGain.gain.linearRampToValueAtTime(0.6, now + 0.02);
                attackGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
                
                attackOsc1.start(now);
                attackOsc2.start(now);
                attackOsc1.stop(now + 0.35);
                attackOsc2.stop(now + 0.35);
                break;
                
            case 'explosion':
                // Deep explosion with sub-bass and white noise
                const explosionOsc = audioContext.createOscillator();
                const explosionNoise = audioContext.createBufferSource();
                const explosionGain = audioContext.createGain();
                const noiseGain = audioContext.createGain();
                const explosionFilter = audioContext.createBiquadFilter();
                
                // Create white noise buffer
                const bufferSize = audioContext.sampleRate * 0.5;
                const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
                const output = noiseBuffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    output[i] = Math.random() * 2 - 1;
                }
                explosionNoise.buffer = noiseBuffer;
                
                explosionOsc.type = 'sine';
                explosionOsc.frequency.setValueAtTime(120, now);
                explosionOsc.frequency.exponentialRampToValueAtTime(40, now + 0.5);
                
                explosionFilter.type = 'lowpass';
                explosionFilter.frequency.setValueAtTime(800, now);
                explosionFilter.frequency.exponentialRampToValueAtTime(100, now + 0.5);
                explosionFilter.Q.value = 1;
                
                explosionOsc.connect(explosionGain);
                explosionNoise.connect(noiseGain);
                explosionGain.connect(explosionFilter);
                noiseGain.connect(explosionFilter);
                explosionFilter.connect(masterGain);
                
                explosionGain.gain.setValueAtTime(0, now);
                explosionGain.gain.linearRampToValueAtTime(1, now + 0.01);
                explosionGain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
                
                noiseGain.gain.setValueAtTime(0, now);
                noiseGain.gain.linearRampToValueAtTime(0.3, now + 0.01);
                noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                
                explosionOsc.start(now);
                explosionNoise.start(now);
                explosionOsc.stop(now + 0.6);
                explosionNoise.stop(now + 0.3);
                break;
                
            case 'achievement':
                // Uplifting chord progression
                const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5 (C major chord)
                freqs.forEach((freq, i) => {
                    const osc = audioContext.createOscillator();
                    const gain = audioContext.createGain();
                    
                    osc.type = 'sine';
                    osc.frequency.value = freq;
                    
                    osc.connect(gain);
                    gain.connect(masterGain);
                    
                    const startTime = now + (i * 0.05);
                    gain.gain.setValueAtTime(0, startTime);
                    gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
                    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
                    
                    osc.start(startTime);
                    osc.stop(startTime + 0.4);
                });
                break;
                
            case 'upgrade':
                // Power-up sound with harmonic sweep
                const upgradeOsc1 = audioContext.createOscillator();
                const upgradeOsc2 = audioContext.createOscillator();
                const upgradeGain = audioContext.createGain();
                const upgradeFilter = audioContext.createBiquadFilter();
                
                upgradeOsc1.type = 'triangle';
                upgradeOsc1.frequency.setValueAtTime(440, now);
                upgradeOsc1.frequency.exponentialRampToValueAtTime(880, now + 0.15);
                
                upgradeOsc2.type = 'sine';
                upgradeOsc2.frequency.setValueAtTime(880, now);
                upgradeOsc2.frequency.exponentialRampToValueAtTime(1760, now + 0.15);
                
                upgradeFilter.type = 'highpass';
                upgradeFilter.frequency.value = 200;
                upgradeFilter.Q.value = 1;
                
                upgradeOsc1.connect(upgradeFilter);
                upgradeOsc2.connect(upgradeFilter);
                upgradeFilter.connect(upgradeGain);
                upgradeGain.connect(masterGain);
                
                upgradeGain.gain.setValueAtTime(0, now);
                upgradeGain.gain.linearRampToValueAtTime(0.4, now + 0.01);
                upgradeGain.gain.linearRampToValueAtTime(0.3, now + 0.08);
                upgradeGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                
                upgradeOsc1.start(now);
                upgradeOsc2.start(now);
                upgradeOsc1.stop(now + 0.2);
                upgradeOsc2.stop(now + 0.2);
                break;
        }
    } catch (e) {
        console.warn('Sound playback failed:', e);
    }
}

// Tutorial System
const tutorialSteps = [
    { id: 'welcome', title: 'Welcome to GlobalPulseMap!', description: 'Track and battle pulse points across the globe in real-time.' },
    { id: 'pulse', title: 'Deploy Beacons', description: 'Click "Deploy Beacon" to place your point on the map. Each beacon becomes a battle target!' },
    { id: 'attack', title: 'Attack Targets', description: 'Select a pulse on the map and click ATTACK to launch a strike. Earn points for destroying targets!' },
    { id: 'defense', title: 'Build Defenses', description: 'Upgrade your Shield, Armor and Interceptors to protect your pulses from attacks.' },
    { id: 'points', title: 'Earn & Spend Points', description: 'Destroy targets to earn points. Use points for attacks and defense upgrades.' }
];
let tutorialCompleted = localStorage.getItem('tutorialCompleted') === 'true';
let currentTutorialStep = 0;

function showTutorial() {
    if (tutorialCompleted) return;
    // Tutorial will be shown via modal
    const step = tutorialSteps[currentTutorialStep];
    if (step) {
        showNotification(step.title, step.description, 'info', 5000);
    }
}

function nextTutorialStep() {
    currentTutorialStep++;
    if (currentTutorialStep >= tutorialSteps.length) {
        tutorialCompleted = true;
        localStorage.setItem('tutorialCompleted', 'true');
        showNotification('Tutorial Complete!', 'You\'re ready to conquer the world!', 'achievement', 3000);
    } else {
        showTutorial();
    }
}

// Notification System (improved)
function showNotification(title, message, type = 'info', duration = 4000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.95), rgba(109, 40, 217, 0.95));
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(139, 92, 246, 0.4);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        z-index: 10001;
        min-width: 300px;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
        font-size: 0.9rem;
    `;
    
    const colors = {
        info: 'linear-gradient(135deg, rgba(56, 189, 248, 0.95), rgba(14, 165, 233, 0.95))',
        success: 'linear-gradient(135deg, rgba(34, 197, 94, 0.95), rgba(22, 163, 74, 0.95))',
        warning: 'linear-gradient(135deg, rgba(245, 158, 11, 0.95), rgba(217, 119, 6, 0.95))',
        error: 'linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(220, 38, 38, 0.95))',
        achievement: 'linear-gradient(135deg, rgba(168, 85, 247, 0.95), rgba(147, 51, 234, 0.95))'
    };
    
    notification.style.background = colors[type] || colors.info;
    notification.innerHTML = `
        <div style="font-weight: 700; font-size: 1rem; margin-bottom: 4px;">${title}</div>
        <div style="opacity: 0.9; font-size: 0.85rem;">${message}</div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, duration);
    
    // Play sound for the notification type
    playSound(type === 'achievement' ? 'achievement' : 'pulse');
}

// Battle state
let selectedTarget = null;
let targetHalo = null;
const destroyedTargetIds = new Set();
const playerInitiatedAttacks = new Map(); // Track attacks sent by this player: locationKey -> {lat, lon, timestamp}
const MAX_ACTIVITY_ITEMS = 10;
const MAX_TOP_COUNTRIES = 6;
const MAX_BATTLE_TARGETS = 6;

// Defense mechanics
let playerShieldHP = 100;        // Player shield health (0-100)
let playerShieldRecharging = false;
const SHIELD_MAX_HP = 100;
const SHIELD_RECHARGE_RATE = 5;  // % per second when not under attack
const SHIELD_RECHARGE_DELAY = 3000; // 3 seconds after last hit
let shieldLastHitTime = 0;
let playerIntercepts = 0;         // Number of active intercept missiles
const MAX_INTERCEPTS_AVAILABLE = 3;
const INTERCEPT_COOLDOWN_MS = 4000; // Recharges 1 intercept per 4 seconds

// Attack cooldown
let attackCooldownActive = false;
let attackCooldownEndTime = null;
let attackCooldownInterval = null;
const ATTACK_COOLDOWN_SECONDS = 30;

// ===== ADVANCED BATTLE MECHANICS =====
// Attack Types System
const ATTACK_TYPES = {
    pulse: {
        name: '📡 Pulse',
        cost: 0,
        damage: 15,
        cooldown: 2,
        description: 'FREE! Fast attack. Low risk.',
        color: '#3b82f6'
    },
    laser: {
        name: '⚡ Laser',
        cost: 10,
        damage: 35,
        cooldown: 6,
        description: 'Medium cost. Higher damage.',
        color: '#ef4444'
    },
    emp: {
        name: '💥 EMP',
        cost: 25,
        damage: 60,
        cooldown: 12,
        description: 'Expensive. Massive damage.',
        color: '#f59e0b'
    }
};

let currentAttackType = 'pulse';
let attackTypeCooldowns = {
    pulse: 0,
    laser: 0,
    emp: 0
};

// Defense System
const DEFENSE_UPGRADES = {
    shield: {
        name: '🛡️ Shield',
        maxLevel: 5,
        baseCost: 50,
        costPerLevel: 30,
        effect: 'Absorb incoming damage (+25 HP/level)',
        color: '#3b82f6'
    },
    armor: {
        name: '🔒 Armor',
        maxLevel: 5,
        baseCost: 40,
        costPerLevel: 25,
        effect: 'Reduce damage by 8%/level',
        color: '#8b5cf6'
    },
    interceptor: {
        name: '🚀 Interceptor',
        maxLevel: 3,
        baseCost: 80,
        costPerLevel: 50,
        effect: 'Auto-block (25% chance/level)',
        color: '#06b6d4'
    }
};

let defenseUpgrades = {
    shield: 0,
    armor: 0,
    interceptor: 0
};

// Battle Statistics
let battleStats = {
    totalAttacks: 0,
    successfulHits: 0,
    damageDealt: 0,
    damageTaken: 0,
    targetsDestroyed: 0,
    timesDefeated: 0,
    winRate: 0,
    pointsSpent: 0,
    pointsEarned: 0
};

// Ballistic trajectory (multiple concurrent trajectories allowed)
let trajectoryPolyline = null;
let trajectoryAnimationFrameId = null;
let rangeCircle = null;

// Attack duration based on range
const ATTACK_DURATIONS = {
    500: 30,      // 30 seconds with ad
    1000: 30,     // 30 seconds with ad
    4000: 30,     // 30 seconds with ad
    Infinity: 30  // 30 seconds with ad - global range
};

// Range system
let currentBattleRange = 500; // km
const RANGE_PRESETS = {
    500: { label: '500 km' },
    1000: { label: '1000 km' },
    4000: { label: '4000 km' },
    'global': { label: 'Global' }
};

// Ad refresh system (async slot refresh, independent of range)
const AD_REFRESH_INTERVAL_MS = 30000;
const AD_ASYNC_LOAD_DELAY_MS = 150;
let adRefreshTimer = null;
let adLastRefreshAt = 0;

// Country coordinates
const countryCoordinates = {
    'US': { lat: 37.7749, lon: -122.4194, name: 'United States' },
    'GB': { lat: 51.5074, lon: -0.1278, name: 'United Kingdom' },
    'FR': { lat: 48.8566, lon: 2.3522, name: 'France' },
    'DE': { lat: 52.5200, lon: 13.4050, name: 'Germany' },
    'JP': { lat: 35.6762, lon: 139.6503, name: 'Japan' },
    'AU': { lat: -33.8688, lon: 151.2093, name: 'Australia' },
    'BR': { lat: -23.5505, lon: -46.6333, name: 'Brazil' },
    'IN': { lat: 28.6139, lon: 77.2090, name: 'India' },
    'CN': { lat: 39.9042, lon: 116.4074, name: 'China' },
    'ZA': { lat: -33.9249, lon: 18.4241, name: 'South Africa' },
    'CA': { lat: 43.6629, lon: -79.3957, name: 'Canada' },
    'MX': { lat: 19.4326, lon: -99.1332, name: 'Mexico' },
    'RU': { lat: 55.7558, lon: 37.6173, name: 'Russia' },
    'ES': { lat: 40.4168, lon: -3.7038, name: 'Spain' },
    'IT': { lat: 41.9028, lon: 12.4964, name: 'Italy' },
    'BG': { lat: 42.6977, lon: 23.3219, name: 'Bulgaria' },
    'RO': { lat: 44.4268, lon: 26.1025, name: 'Romania' },
    'GR': { lat: 39.0742, lon: 21.8243, name: 'Greece' },
    'TR': { lat: 41.0082, lon: 28.9784, name: 'Turkey' }
};

// ============ ADVANCED BATTLE MECHANICS SYSTEM ============
function initializeAdvancedBattleSystem() {
    console.log('🎮 Initializing Advanced Battle System');
    
    // Setup attack type buttons
    document.querySelectorAll('.battle-attack-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const type = btn.dataset.type;
            selectAttackType(type);
        });
    });
    
    // Setup defense upgrade buttons
    document.querySelectorAll('.defense-upgrade-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const upgrade = btn.dataset.upgrade;
            upgradeDefense(upgrade);
        });
    });
    
    // Initialize displays
    updateBattleUI();
    setInterval(updateBattleUI, 500); // Update every 500ms
}

function selectAttackType(type) {
    if (!ATTACK_TYPES[type]) return;
    
    const cost = ATTACK_TYPES[type].cost;
    if (personalScore < cost) {
        showCelebration(`❌ Need ${cost} pts (have ${personalScore})`, 'kill');
        return;
    }
    
    currentAttackType = type;
    console.log(`⚡ Selected attack type: ${type}`);
    playSound('pulse');
    
    // Update UI to show selection
    document.querySelectorAll('.battle-attack-btn').forEach(btn => {
        if (btn.dataset.type === type) {
            btn.style.background = `linear-gradient(135deg, ${ATTACK_TYPES[type].color}40, ${ATTACK_TYPES[type].color}20)`;
            btn.style.borderWidth = '2px';
        } else {
            btn.style.background = 'rgba(255, 255, 255, 0.05)';
            btn.style.borderWidth = '1px';
        }
    });
    
    updateBattleUI();
}

function upgradeDefense(type) {
    if (!DEFENSE_UPGRADES[type]) return;
    
    const current = defenseUpgrades[type] || 0;
    const maxLevel = DEFENSE_UPGRADES[type].maxLevel;
    
    if (current >= maxLevel) {
        showCelebration(`🔒 ${DEFENSE_UPGRADES[type].name} Max Level!`, 'kill');
        return;
    }
    
    const baseCost = DEFENSE_UPGRADES[type].baseCost;
    const costPerLevel = DEFENSE_UPGRADES[type].costPerLevel;
    const nextCost = baseCost + (current * costPerLevel);
    
    if (personalScore < nextCost) {
        showCelebration(`❌ Need ${nextCost} pts for upgrade`, 'kill');
        return;
    }
    
    // Perform upgrade
    defenseUpgrades[type]++;
    personalScore -= nextCost;
    battleStats.pointsSpent += nextCost;
    
    localStorage.setItem('gpPersonalScore', personalScore.toString());
    updateScoreDisplay();
    
    console.log(`🔧 Upgraded ${type} to level ${defenseUpgrades[type]}`);
    showCelebration(`✅ ${DEFENSE_UPGRADES[type].name} → Level ${defenseUpgrades[type]}!`, 'achievement');
    playSound('upgrade');
    
    // Send defense update to server
    if (socket && socket.connected) {
        socket.emit('updateDefense', defenseUpgrades);
    }
    
    updateBattleUI();
}

function calculateDamageReduction() {
    const armorLevel = defenseUpgrades.armor || 0;
    return armorLevel * 5; // 5% per level
}

function updateBattleUI() {
    // Update points display
    const pointsDisplay = document.getElementById('battlePointsDisplay');
    if (pointsDisplay) {
        pointsDisplay.textContent = personalScore.toLocaleString();
    }
    
    // Update shield display (using global player shield HP)
    const shieldDisplay = document.getElementById('battleShieldHP');
    if (shieldDisplay) {
        const percent = Math.max(0, Math.min(100, playerShieldHP));
        shieldDisplay.textContent = `${Math.round(percent)}%`;
        
        if (percent > 60) shieldDisplay.style.color = '#3b82f6';
        else if (percent > 30) shieldDisplay.style.color = '#f59e0b';
        else shieldDisplay.style.color = '#ef4444';
    }
    
    // Update intercept display
    const interceptDisplay = document.getElementById('battleInterceptCount');
    if (interceptDisplay) {
        const maxLevel = (defenseUpgrades.interceptor || 0);
        interceptDisplay.textContent = `${Math.floor(playerIntercepts)}/${Math.ceil(MAX_INTERCEPTS_AVAILABLE + maxLevel)}`;
    }
    
    // Update upgrade level displays
    Object.keys(defenseUpgrades).forEach(upgrade => {
        const levelEl = document.getElementById(`${upgrade}Level`);
        if (levelEl) {
            levelEl.textContent = defenseUpgrades[upgrade] || 0;
        }
    });
    
    // Update target display
    const targetDisplay = document.getElementById('battleTargetNameCompact');
    if (targetDisplay && selectedTarget) {
        const shortName = selectedTarget.name?.substring(0, 12) || 'Target';
        targetDisplay.textContent = shortName;
    }
    
    // Update range display
    const rangeDisplay = document.getElementById('battleRangeDisplay');
    if (rangeDisplay) {
        if (currentBattleRange === Infinity) {
            rangeDisplay.textContent = 'Global';
        } else {
            rangeDisplay.textContent = `${currentBattleRange}km`;
        }
    }
    
    // Update destroyed count
    const destroyedDisplay = document.getElementById('battleDestroyedCount');
    if (destroyedDisplay) {
        destroyedDisplay.textContent = sessionKills;
    }
    
    // Update win rate
    const winRateDisplay = document.getElementById('battleWinRate');
    if (winRateDisplay) {
        const winRate = battleStats.totalAttacks > 0 
            ? Math.round((battleStats.successfulHits / battleStats.totalAttacks) * 100)
            : 0;
        winRateDisplay.textContent = `${winRate}%`;
    }
    
    // Highlight currently selected attack type
    document.querySelectorAll('.battle-attack-btn').forEach(btn => {
        if (btn.dataset.type === currentAttackType) {
            btn.style.boxShadow = `0 0 10px ${ATTACK_TYPES[currentAttackType].color}`;
        } else {
            btn.style.boxShadow = 'none';
        }
    });
}

// ============ Defense Systems ============
function updateShieldDisplay() {
    const shieldEl = document.getElementById('playerShieldHP');
    if (shieldEl) {
        const percent = Math.max(0, Math.min(100, playerShieldHP));
        shieldEl.textContent = `${Math.round(percent)}%`;
        
        // Color based on health
        if (percent > 60) shieldEl.style.color = '#3b82f6'; // Blue
        else if (percent > 30) shieldEl.style.color = '#f59e0b'; // Orange
        else shieldEl.style.color = '#ef4444'; // Red
    }
}

function updateInterceptsDisplay() {
    const interceptEl = document.getElementById('playerIntercepts');
    if (interceptEl) {
        interceptEl.textContent = `${playerIntercepts}/${MAX_INTERCEPTS_AVAILABLE}`;
    }
}

function damagePlayerShield(damagePercent) {
    playerShieldHP = Math.max(0, playerShieldHP - damagePercent);
    shieldLastHitTime = Date.now();
    playerShieldRecharging = false;
    
    if (playerShieldHP <= 0) {
        showCelebration('🛡️ Shield destroyed!', 'kill');
    } else if (playerShieldHP < 30) {
        showCelebration('⚠️ Shield critical!', 'kill');
    }
    
    updateShieldDisplay();
}

function rechargePlayerShield() {
    if (playerShieldRecharging || playerShieldHP >= SHIELD_MAX_HP) return;
    
    const timeSinceHit = Date.now() - shieldLastHitTime;
    if (timeSinceHit < SHIELD_RECHARGE_DELAY) return;
    
    playerShieldRecharging = true;
    const rechargeInterval = setInterval(() => {
        if (playerShieldHP >= SHIELD_MAX_HP) {
            clearInterval(rechargeInterval);
            playerShieldRecharging = false;
            showCelebration('🛡️ Shield recharged!', 'achievement');
            return;
        }
        
        playerShieldHP = Math.min(SHIELD_MAX_HP, playerShieldHP + SHIELD_RECHARGE_RATE);
        updateShieldDisplay();
    }, 1000);
}

function launchIntercept(targetLat, targetLon) {
    if (playerIntercepts <= 0) {
        showCelebration('❌ No intercepts available', 'kill');
        return false;
    }
    
    playerIntercepts--;
    updateInterceptsDisplay();
    
    // Schedule intercept recharge
    setTimeout(() => {
        if (playerIntercepts < MAX_INTERCEPTS_AVAILABLE) {
            playerIntercepts++;
            updateInterceptsDisplay();
            showCelebration('🚀 Intercept recharged', 'achievement');
        }
    }, INTERCEPT_COOLDOWN_MS);
    
    console.log(`🚀 Launched intercept! Remaining: ${playerIntercepts}`);
    return true;
}

function initializeDefenseSystems() {
    playerShieldHP = SHIELD_MAX_HP;
    playerIntercepts = Math.floor(MAX_INTERCEPTS_AVAILABLE / 2); // Start with half
    updateShieldDisplay();
    updateInterceptsDisplay();
    rechargePlayerShield();
    updateLiveStats();
    console.log('✅ Defense systems initialized');
}

// ============ Live Stats Widget Update ============
function updateLiveStats() {
    // Update beacon count
    const beaconCountEl = document.getElementById('liveBeaconCount');
    if (beaconCountEl) {
        const activeTargetsEl = document.getElementById('activeTargets');
        beaconCountEl.textContent = activeTargetsEl ? activeTargetsEl.textContent : '0';
    }
    
    // Update attack count (from battle stats)
    const attackCountEl = document.getElementById('liveAttackCount');
    if (attackCountEl) {
        attackCountEl.textContent = battleStats.attacksSent || 0;
    }
    
    // Update kill count
    const killCountEl = document.getElementById('liveKillCount');
    if (killCountEl) {
        const destroyedTargetsEl = document.getElementById('destroyedTargets');
        killCountEl.textContent = destroyedTargetsEl ? destroyedTargetsEl.textContent : '0';
    }
    
    // Update online player count (will be set from server)
    const playerCountEl = document.getElementById('livePlayerCount');
    if (playerCountEl && !playerCountEl.dataset.synced) {
        playerCountEl.textContent = '1+';
    }
}

// ============ Unified Widget Tab System ============
function initUnifiedWidget() {
    const tabs = document.querySelectorAll('.widget-tab');
    const views = document.querySelectorAll('.widget-view');
    
    let currentTabIndex = 0;
    
    function switchToTab(index) {
        if (index < 0 || index >= tabs.length) return;
        
        currentTabIndex = index;
        const tab = tabs[index];
        const targetWidget = tab.dataset.widget;
        
        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show corresponding view
        views.forEach(view => {
            if (view.dataset.view === targetWidget) {
                view.style.display = 'block';
            } else {
                view.style.display = 'none';
            }
        });
        
        // Play UI sound
        playSound('pulse');
    }
    
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => switchToTab(index));
    });
    
    // Add swipe support for mobile
    const widgetContent = document.querySelector('.widget-content');
    if (widgetContent) {
        let touchStartX = 0;
        let touchEndX = 0;
        
        widgetContent.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        widgetContent.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - next tab
                    switchToTab(currentTabIndex + 1);
                } else {
                    // Swipe right - previous tab
                    switchToTab(currentTabIndex - 1);
                }
            }
        }
    }
}

// Sync battle feed to mini widget
function syncMiniBattleFeed(message, type = 'info') {
    const miniFeed = document.getElementById('miniBattleFeed');
    if (!miniFeed) return;
    
    // Remove "no activity" placeholder
    if (miniFeed.children.length === 1 && miniFeed.children[0].textContent === 'No recent activity') {
        miniFeed.innerHTML = '';
    }
    
    const feedItem = document.createElement('div');
    feedItem.style.cssText = `
        padding: 6px 8px;
        background: var(--bg-tertiary);
        border-radius: 6px;
        border-left: 3px solid ${type === 'kill' ? '#ef4444' : type === 'achievement' ? '#22c55e' : '#8b5cf6'};
        font-size: 0.7rem;
        color: var(--text-secondary);
        animation: fadeIn 0.3s ease;
    `;
    feedItem.textContent = message;
    
    miniFeed.insertBefore(feedItem, miniFeed.firstChild);
    
    // Keep only last 10 items
    while (miniFeed.children.length > 10) {
        miniFeed.removeChild(miniFeed.lastChild);
    }
}

// ============ Initialization ============
console.log('Script loaded, waiting for DOM...');

// Prefer server state over localStorage on refresh
const USE_SERVER_STATE = true;

// Save pulse history to localStorage
function savePulseHistory() {
    try {
        localStorage.setItem('gpPulseHistory', JSON.stringify(pulseHistory));
        console.log('✅ Saved', pulseHistory.length, 'pulses to localStorage');
    } catch (e) {
        console.warn('⚠️ Cannot save to localStorage:', e.message);
    }
}

// Load pulse history from localStorage
function loadPulseHistory() {
    if (USE_SERVER_STATE) {
        console.log('ℹ️ Skipping localStorage pulseHistory (server is source of truth)');
        return false;
    }
    try {
        const saved = localStorage.getItem('gpPulseHistory');
        if (saved) {
            pulseHistory = JSON.parse(saved);
            console.log('✅ Loaded', pulseHistory.length, 'pulses from localStorage');
            return true;
        }
    } catch (e) {
        console.warn('⚠️ Cannot load from localStorage:', e.message);
    }
    return false;
}

// Save activity history to localStorage
function saveActivityHistory() {
    try {
        localStorage.setItem('gpActivityHistory', JSON.stringify(activityHistory));
        console.log('✅ Saved', activityHistory.length, 'activities to localStorage');
    } catch (e) {
        console.warn('⚠️ Cannot save activities to localStorage:', e.message);
    }
}

// Load activity history from localStorage
function loadActivityHistory() {
    if (USE_SERVER_STATE) {
        console.log('ℹ️ Skipping localStorage activityHistory (server is source of truth)');
        return false;
    }
    try {
        const saved = localStorage.getItem('gpActivityHistory');
        if (saved) {
            activityHistory = JSON.parse(saved);
            console.log('✅ Loaded', activityHistory.length, 'activities from localStorage');
            return true;
        }
    } catch (e) {
        console.warn('⚠️ Cannot load activities from localStorage:', e.message);
    }
    return false;
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 DOM Content Loaded - Initializing app');
    
    try {
        // Initialize tab system
        initTabSystem();
        console.log('✅ Tab system initialized');
        
        // Initialize Command Center
        initCommandCenter();
        
        // Initialize unified widget
        initUnifiedWidget();
        console.log('✅ Unified widget initialized');
        
        // Show tutorial for first-time users
        setTimeout(() => {
            if (!tutorialCompleted) {
                showTutorial();
            }
        }, 2000);
        
        // Get all DOM elements
        pulseBtn = document.getElementById('pulseBtn');
        globalCountEl = document.getElementById('globalCount');
        activeTargetsEl = document.getElementById('activeTargets');
        destroyedTargetsEl = document.getElementById('destroyedTargets');
        activeCountriesEl = document.getElementById('activeCountries');
        battleModeStatusEl = document.getElementById('battleModeStatus');
        topCountriesEl = document.getElementById('topCountriesEl');
        statusEl = document.querySelector('.status');
        statusText = document.getElementById('statusText');
        themeBtn = document.getElementById('themeBtn');
        geoBtn = document.getElementById('geoBtn');
        userPulsesEl = document.getElementById('userPulses');
        userCountryEl = document.getElementById('userCountry');
        recentActivityEl = document.getElementById('recentActivityEl');
        battleTargetNameEl = document.getElementById('battleTargetName');
        battleToggleEl = document.getElementById('battleToggle');
        
        console.log('✅ All DOM elements found');
        console.log('pulseBtn:', pulseBtn ? '✓' : '✗', pulseBtn);
        console.log('themeBtn:', themeBtn ? '✓' : '✗');
        console.log('recentActivityEl:', recentActivityEl ? '✓' : '✗');
        
        // Test if pulseBtn is clickable
        if (pulseBtn) {
            console.log('🔍 Testing pulseBtn:', {
                disabled: pulseBtn.disabled,
                style: pulseBtn.style.cssText,
                offsetParent: pulseBtn.offsetParent,
                classes: pulseBtn.className
            });
        }
        
        // Server is source of truth (initData will populate pulses/activities)
        loadPulseHistory();
        loadActivityHistory();
        
        // Setup all handlers
        setupTheme();
        setupGeoButton();
        setupSettingsButtons();
        setupBattleToggle();
        setupRangeSystem();
        setupPulseButton();
        setupPeriodFilters();
        setupCountriesModal();
        setupLoginSystem();
        setupLogoutButton();
        startAdRefresh();
        setupTargetInfoPanel();
        initializeDefenseSystems();
        initializeAdvancedBattleSystem();
        
        // Request location early (do not depend on external libs)
        getGeolocation();
        initGeoPermissionWatcher();
        setTimeout(() => {
            if (!userCountry || userCountry === 'Unknown') {
                fetchIpLocationFallback();
            }
        }, 5000);
        
        // Initialize app
        loadSessionData();
        initSessionStats();
        await checkAutoLogin();
        startSessionTimer();
        startLocalTime();
        updateConnectionWidgets('connecting');
        
        // Initialize Deploy button (must be visible by default)
        if (pulseBtn) {
            pulseBtn.style.display = 'flex';
            pulseBtn.style.alignItems = 'center';
            pulseBtn.style.justifyContent = 'center';
            pulseBtn.disabled = false;
        }
        
        // Hide Battle Cooldown by default
        const battleCooldown = document.getElementById('battleCooldown');
        if (battleCooldown) {
            battleCooldown.style.display = 'none';
        }
        
        // Load external libs and then initialize realtime/map
        initializeRealtime();
        startGlobalStatsTicker();
        
        console.log('✅ All initialization complete');
    } catch (error) {
        console.error('❌ Error during initialization:', error);
    }
});

function initializeRealtime() {
    console.log('🚀 Initializing realtime features...');
    Promise.all([ensureSocketIo(), ensureLeaflet()])
        .then(() => {
            console.log('✅ External libraries loaded');
            setupSocketListeners();
            console.log('📍 Initializing map...');
            initMap();
            // Show cached markers from localStorage
            if (pulseHistory && pulseHistory.length > 0 && map) {
                console.log('📍 Showing', pulseHistory.length, 'cached pulses from localStorage');
                updateMarkers({}, pulseHistory, currentPeriod);
            }
            getGeolocation(); // Get browser location (GPS/Wi-Fi/IP)
            initGeoPermissionWatcher();
        })
        .catch((e) => {
            console.error('❌ Failed to load external libraries:', e);
            setupSocketListeners();
            console.log('📍 Initializing map (after error)...');
            initMap();
            // Show cached markers from localStorage
            if (pulseHistory && pulseHistory.length > 0 && map) {
                console.log('📍 Showing', pulseHistory.length, 'cached pulses from localStorage');
                updateMarkers({}, pulseHistory, currentPeriod);
            }
            getGeolocation();
            initGeoPermissionWatcher();
        });
}

function ensureSocketIo() {
    if (window.io) {
        socket = io({
            transports: ['websocket', 'polling'],
            reconnectionDelay: 1000,
            reconnection: true,
            reconnectionAttempts: 10,
            timeout: 10000,
        });
        return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = '/socket.io/socket.io.js';
        script.onload = () => {
            if (window.io) {
                socket = io({
                    transports: ['websocket', 'polling'],
                    reconnectionDelay: 1000,
                    reconnection: true,
                    reconnectionAttempts: 10,
                    timeout: 10000,
                });
                resolve();
            } else {
                reject(new Error('socket.io failed to initialize'));
            }
        };
        script.onerror = () => reject(new Error('Failed to load socket.io script'));
        document.head.appendChild(script);
    });
}

function ensureLeaflet() {
    if (window.L) return Promise.resolve();
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => window.L ? resolve() : reject(new Error('Leaflet failed to initialize'));
        script.onerror = () => reject(new Error('Failed to load Leaflet script'));
        document.head.appendChild(script);
    });
}

// ============ Theme Setup ============
function setupTheme() {
    console.log('🎨 Setting up theme...');
    if (!themeBtn) {
        console.warn('⚠️ Theme button not found');
        return;
    }
    
    // Load saved theme
    try {
        const savedTheme = localStorage.getItem('theme');
        console.log('Saved theme:', savedTheme);
        if (savedTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    } catch (e) {
        console.log('localStorage error:', e);
    }
    
    // Theme button in header (if exists)
    if (themeBtn) {
        updateThemeButton();
        
        // Add click handler
        themeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🌙 Theme button clicked!');
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            if (isLight) {
                document.documentElement.removeAttribute('data-theme');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
            }
            updateThemeButton();
            
            try {
                const isLightNow = document.documentElement.getAttribute('data-theme') === 'light';
                localStorage.setItem('theme', isLightNow ? 'light' : 'dark');
                console.log('💾 Theme saved:', isLightNow ? 'light' : 'dark');
            } catch (e) {
                console.log('localStorage error:', e);
            }
        });
        console.log('✅ Theme button setup complete');
    }
}

function updateThemeButton() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (themeBtn) {
        themeBtn.textContent = isLight ? '🌙' : '☀️';
    }
}

function setupGeoButton() {
    if (!geoBtn) return;
    geoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        getGeolocation();
    });
}

function initGeoPermissionWatcher() {
    if (!geoBtn) return;
    if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions.query({ name: 'geolocation' })
            .then((status) => {
                geoPermissionStatus = status;
                updateGeoButtonVisibility(status.state);
                status.onchange = () => updateGeoButtonVisibility(status.state);
            })
            .catch(() => updateGeoButtonVisibility('prompt'));
    } else {
        updateGeoButtonVisibility('prompt');
    }
}

function updateGeoButtonVisibility(state) {
    if (!geoBtn) return;
    geoBtn.style.display = state === 'granted' ? 'none' : 'inline-flex';
}

function setupSettingsButtons() {
    const themeBtnSettings = document.getElementById('themeBtnSettings');
    const geoBtnSettings = document.getElementById('geoBtnSettings');
    
    if (themeBtnSettings) {
        themeBtnSettings.addEventListener('click', (e) => {
            e.preventDefault();
            toggleTheme();
        });
    }
    
    if (geoBtnSettings) {
        geoBtnSettings.addEventListener('click', (e) => {
            e.preventDefault();
            getGeolocation();
        });
    }
    
    // Setup share button
    setupShareButton();
}

// ============ Pulse Button Setup ============
function setupBattleToggle() {
    // Battle mode always enabled
    battleModeEnabled = true;
    drawRangeCircle();
    updateGlobalStats();
}

function updateRangeButtonsState() {
    // Battle mode always enabled - all buttons active
    const rangeBtns = document.querySelectorAll('.range-btn');
    rangeBtns.forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
    });
}

function setupRangeSystem() {
    const rangeBtns = document.querySelectorAll('.range-btn');
    
    rangeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const range = btn.dataset.range;
            
            // Update UI
            rangeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update state
            currentBattleRange = range === 'global' ? Infinity : parseInt(range);
            
            // Draw range circle on map
            drawRangeCircle();
            
            // Refresh targets to show only targets in range
            refreshBattleTargets();
            
            console.log(`⚔️ Battle range changed to ${range === 'global' ? 'Global' : range + 'km'}`);
        });
    });
}

function drawRangeCircle() {
    if (!userCoordinates || !map) return;
    
    // Remove previous range circle
    if (rangeCircle && map) {
        map.removeLayer(rangeCircle);
    }
    
    // For global range, don't show a circle
    if (currentBattleRange === Infinity) {
        return;
    }
    
    // Draw range circle (convert km to meters)
    const radiusMeters = currentBattleRange * 1000;
    rangeCircle = L.circle([userCoordinates.lat, userCoordinates.lon], {
        radius: radiusMeters,
        color: '#00d4ff',
        fillColor: '#00d4ff',
        fillOpacity: 0.08,
        weight: 2,
        dashArray: '5, 5',
        lineCap: 'round',
        lineJoin: 'round'
    }).addTo(map);
    
    console.log(`📍 Range circle drawn: ${currentBattleRange}km`);
}

function getAdContainers() {
    const containers = [];
    const desktop = document.getElementById('adPlaceholder');
    const mobile = document.getElementById('adPlaceholderMobile');
    if (desktop) containers.push(desktop);
    if (mobile) containers.push(mobile);
    return containers;
}

function isElementInViewport(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    return (
        rect.width > 0 &&
        rect.height > 0 &&
        rect.bottom > 0 &&
        rect.right > 0 &&
        rect.top < viewportHeight &&
        rect.left < viewportWidth
    );
}

function getRandomAdMessage() {
    const ads = [
        {
            title: 'Upgrade Your Gaming Experience',
            content: 'Get premium gaming accessories with 30% off. Free shipping on orders over $50.',
            link: 'Shop Now'
        },
        {
            title: 'Cloud Gaming Platform - Try Free',
            content: 'Stream games instantly on any device. No downloads required. 7-day free trial.',
            link: 'Start Free Trial'
        },
        {
            title: 'VPN for Gamers - Special Offer',
            content: 'Reduce lag and protect your connection. 60% off annual plans. 30-day money-back guarantee.',
            link: 'Get VPN'
        }
    ];
    return ads[Math.floor(Math.random() * ads.length)];
}

function renderAdSlot(container, msg) {
    let slot = container.querySelector('.ad-slot');
    if (!slot) {
        slot = document.createElement('div');
        slot.className = 'ad-slot ad-container';
        container.innerHTML = '';
        container.appendChild(slot);
    }

    slot.innerHTML = `
        <div class="ad-label">Advertisement</div>
        <div class="ad-header">
            <div class="ad-title">${msg.title}</div>
        </div>
        <div class="ad-content">
            ${msg.content}
            <a href="#" class="ad-link" onclick="event.preventDefault();">${msg.link} →</a>
        </div>
    `;
}

function loadAdAsync(container) {
    const msg = getRandomAdMessage();
    window.setTimeout(() => {
        renderAdSlot(container, msg);
    }, AD_ASYNC_LOAD_DELAY_MS);
}

function refreshAdSlots(force = false) {
    const containers = getAdContainers();
    if (containers.length === 0) return;

    let refreshed = false;
    containers.forEach(container => {
        if (!force && !isElementInViewport(container)) return;
        loadAdAsync(container);
        refreshed = true;
    });

    if (refreshed) {
        adLastRefreshAt = Date.now();
    }
}

function maybeRefreshAdSlots() {
    const now = Date.now();
    if (now - adLastRefreshAt < AD_REFRESH_INTERVAL_MS) return;
    refreshAdSlots(false);
}

function startAdRefresh() {
    if (adRefreshTimer) {
        clearInterval(adRefreshTimer);
    }

    refreshAdSlots(true);
    adRefreshTimer = setInterval(() => {
        refreshAdSlots(false);
    }, AD_REFRESH_INTERVAL_MS);

    window.addEventListener('scroll', maybeRefreshAdSlots, { passive: true });
    window.addEventListener('resize', maybeRefreshAdSlots);
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            maybeRefreshAdSlots();
        }
    });
}

function showTemporaryStatus(message, color = '#ef4444', duration = 1500) {
    if (!pulseBtn) return;
    const prevText = pulseBtn.innerHTML;
    const prevBg = pulseBtn.style.background;
    const prevDisabled = pulseBtn.disabled;
    pulseBtn.innerHTML = message;
    pulseBtn.style.background = color;
    pulseBtn.disabled = true;
    setTimeout(() => {
        pulseBtn.innerHTML = prevText;
        pulseBtn.style.background = prevBg;
        pulseBtn.disabled = prevDisabled;
    }, duration);
}

function removePulseByLocationKey(locationKey) {
    if (!locationKey) return;
    pulseHistory = pulseHistory.filter(pulse => getLocationKey(pulse.lat, pulse.lon) !== locationKey);
}

function applyDestroyedTargets(list = []) {
    destroyedTargetIds.clear();
    list.forEach(key => {
        destroyedTargetIds.add(`PULSE_${key}`);
    });
}

function updateBattleStats() {
    const activeCount = document.getElementById('battleActiveCount');
    const destroyedCount = document.getElementById('battleDestroyedCount');
    
    if (activeCount) {
        const active = pulseHistory.filter(p => !destroyedTargetIds.has(`PULSE_${p.locationKey}`)).length;
        activeCount.textContent = active;
    }
    
    if (destroyedCount) {
        destroyedCount.textContent = destroyedTargetIds.size;
    }
}

function setupPulseButton() {
    console.log('💓 Setting up pulse button...');
    if (!pulseBtn) {
        console.error('❌ pulseBtn element not found!');
        return;
    }
    console.log('✅ pulseBtn found, adding click listener');
    
    pulseBtn.addEventListener('click', () => {
        console.log('🔥 CLICK HANDLER FIRED!');
        console.log('💓 Pulse button clicked!');
        console.log(`   Battle mode: ${battleModeEnabled}, Target: ${selectedTarget ? selectedTarget.name : 'none'}`);
        console.log(`   Socket status: ${socket ? 'exists' : 'NULL'}, Connected: ${socket?.connected}`);

        // Block Guest mode from playing
        if (currentUser && currentUser.provider === 'guest') {
            showCelebration('🔒 Guest mode is view-only. Login to play!', 'achievement');
            openLoginModal();
            return;
        }

        // Check if target is selected (for battle mode)
        if (battleModeEnabled && !selectedTarget) {
            console.log(`⚠️ No target selected, will attack random location in range`);
        }

        const coords = userCoordinates || (map ? { lat: map.getCenter().lat, lon: map.getCenter().lng } : { lat: null, lon: null });

        // ===== BATTLE MODE: ATTACK =====
        if (battleModeEnabled && coords.lat !== null && coords.lon !== null) {
            // Use selected target or default target
            let targetCoords;
            if (selectedTarget) {
                targetCoords = { lat: selectedTarget.lat, lon: selectedTarget.lon };
            } else {
                // If no target selected, attack a random location within range
                if (currentBattleRange === Infinity) {
                    // Global range - attack anywhere on Earth
                    targetCoords = {
                        lat: (Math.random() - 0.5) * 180,
                        lon: (Math.random() - 0.5) * 360
                    };
                } else {
                    // Limited range - attack within radius
                    const latOffset = (Math.random() - 0.5) * (currentBattleRange / 111); // ~111 km per degree
                    const lonOffset = (Math.random() - 0.5) * (currentBattleRange / (111 * Math.cos(coords.lat * Math.PI/180)));
                    targetCoords = {
                        lat: coords.lat + latOffset,
                        lon: coords.lon + lonOffset
                    };
                }
                console.log(`🎯 No target selected, attacking random location: (${targetCoords.lat.toFixed(2)}, ${targetCoords.lon.toFixed(2)})`);
            }
            
            // Check for attack cooldown
            if (attackCooldownActive) {
                const remaining = Math.ceil((attackCooldownEndTime - Date.now()) / 1000);
                console.log(`⏳ Attack cooldown active: ${remaining}s remaining`);
                return;
            }

            // Block attacking targets in the same country
            if (selectedTarget && selectedTarget.country && userCountry && selectedTarget.country === userCountry) {
                const flag = getCountryFlag(userCountry);
                showTemporaryStatus(`${flag} Same Country`);
                return;
            }

            // Check if target is within range (skip for global)
            if (userCoordinates && currentBattleRange !== Infinity) {
                const distance = calculateDistance(userCoordinates.lat, userCoordinates.lon, targetCoords.lat, targetCoords.lon);
                if (distance > currentBattleRange) {
                    console.log(`❌ Target out of range! Distance: ${distance.toFixed(2)}km, Range: ${currentBattleRange}km`);
                    showTemporaryStatus('Out of range');
                    return;
                }
            }

            // Send ATTACK event
            console.log(`⚔️ Human player attacking: (${coords.lat.toFixed(2)}, ${coords.lon.toFixed(2)}) → (${targetCoords.lat.toFixed(2)}, ${targetCoords.lon.toFixed(2)})`);
            console.log(`   Range: ${currentBattleRange}km, Duration: ${ATTACK_DURATIONS[currentBattleRange]}s`);
            console.log(`   Attack type: ${currentAttackType} (${ATTACK_TYPES[currentAttackType].name}), Cost: ${ATTACK_TYPES[currentAttackType].cost} pts`);
            
            // Check if player has enough points for this attack type
            const attackCost = ATTACK_TYPES[currentAttackType].cost;
            if (personalScore < attackCost) {
                showCelebration(`❌ Need ${attackCost} pts for ${ATTACK_TYPES[currentAttackType].name}`, 'kill');
                showTemporaryStatus(`Insufficient points: ${personalScore}/${attackCost}`, '#ef4444');
                return;
            }
            
            // Deduct cost
            personalScore -= attackCost;
            battleStats.pointsSpent += attackCost;
            battleStats.totalAttacks++;
            localStorage.setItem('gpPersonalScore', personalScore.toString());
            updateScoreDisplay();
            
            const attackEvent = {
                fromLat: coords.lat,
                fromLon: coords.lon,
                toLat: targetCoords.lat,
                toLon: targetCoords.lon,
                isAutoAgent: false,
                attackType: currentAttackType,
                duration: ATTACK_DURATIONS[currentBattleRange] || 8,
                timestamp: new Date().toISOString(),
                startTime: Date.now()
            };
            
            // Track this attack locally so we can identify it when targetDestroyed comes back
            const targetLocationKey = getLocationKey(targetCoords.lat, targetCoords.lon);
            playerInitiatedAttacks.set(targetLocationKey, {
                lat: targetCoords.lat,
                lon: targetCoords.lon,
                timestamp: Date.now(),
                targetSnapshot: selectedTarget ? { ...selectedTarget } : null,
                attackType: currentAttackType,
                cost: attackCost
            });
            console.log(`📋 Tracked player attack on location: ${targetLocationKey}`);
            
            if (socket && socket.connected) {
                console.log('   📤 Emitting attack to server...');
                socket.emit('attack', attackEvent);
                console.log('   ✅ Attack emitted');
                
                // Show success feedback with points spent
                showCelebration(`⚔️ ${ATTACK_TYPES[currentAttackType].name} launched! (-${attackCost} pts)`, 'player');
                
                // Show ad overlay during attack (30s)
                showAdOverlay();
                startAdTimer(30);
            } else {
                console.log('   ❌ Socket not connected!', { socketExists: !!socket, connected: socket?.connected });
                showTemporaryStatus('⚠️ Not connected', '#f59e0b');
                // Refund the points if attack couldn't be sent
                personalScore += attackCost;
                localStorage.setItem('gpPersonalScore', personalScore.toString());
                return;
            }
            
            // Start cooldown ONLY once
            startAttackCooldown();
            return; // Exit - attack mode is complete
        }

        // ===== PULSE MODE: SEND PULSE =====
        if (!coords || coords.lat === null || coords.lon === null) {
            console.log('   ❌ Pulse not sent - missing location data');
            return;
        }

        userPulses++;
        sessionStreak = userPulses;
        totalPulses++;
        saveSessionData();
        saveSessionStats();
        saveTotals();
        updatePulseDisplay();
        updateSessionUI();
        updateDailyChallenge();

        // Add/update user marker (green and small)
        if (map && window.L && coords.lat !== null && coords.lon !== null) {
            if (userMarker) {
                map.removeLayer(userMarker);
            }
            
            userMarker = L.circle([coords.lat, coords.lon], {
                color: '#4caf50',
                fillColor: '#4caf50',
                fillOpacity: 0.6,
                radius: 80000, // 5x smaller than normal markers
                weight: 2
            }).addTo(map);
            
            markers['USER'] = userMarker;
        }

        animatePulseOnMap(userCoordinates);
        triggerEcgBeat();
        
        // Visual feedback
        pulseBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            pulseBtn.style.transform = '';
        }, 100);
    });
    console.log('✅ Pulse button setup complete');
}

function updatePulseDisplay() {
    if (userPulsesEl) {
        userPulsesEl.textContent = userPulses;
    }
    
    pulseBtn.disabled = false;
    if (battleModeEnabled) {
        pulseBtn.textContent = selectedTarget ? '⚔️ Attack Target' : '🎯 Select target';
    } else {
        pulseBtn.textContent = '📡 Deploy Beacon';
    }
}

// ============ Period Filters Setup ============
function setupPeriodFilters() {
    console.log('📊 Setting up period filters...');
    const periodButtons = document.querySelectorAll('.period-btn');
    console.log('Found period buttons:', periodButtons.length);
    
    periodButtons.forEach((btn) => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const period = this.dataset.period;
            console.log('📊 Period button clicked:', period);
            
            // Update active button
            document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentPeriod = period;
            
            // Update period info
            const periodNames = {
                'all': 'All Time',
                '1month': 'Last Month',
                '24hours': 'Last 24 Hours',
                '1hour': 'Last Hour',
                '1minute': 'Last Minute'
            };
            
            const periodInfo = document.getElementById('periodInfo');
            if (periodInfo) {
                periodInfo.textContent = periodNames[period];
            }
            
            // Update map markers for the selected period
            if (map && pulseHistory && pulseHistory.length > 0) {
                updateMarkers({}, pulseHistory, period);
            }
            
            // Request filtered data
            if (!socket) {
                console.warn('⚠️ Socket.io not available. Cannot request period data.');
                return;
            }
            if (period === 'all') {
                console.log('Requesting all data');
                socket.emit('getData');
            } else {
                console.log('Requesting data for period:', period);
                socket.emit('getPeriodData', period);
            }
        });
    });
    console.log('✅ Period filters setup complete');
}

// ============ Geolocation ============
let geoWatchId = null;

function getGeolocation() {
    console.log('🌍 Getting geolocation...');

    if (!navigator.geolocation) {
        console.log('❌ Geolocation not supported');
        setUnknownLocation();
        return;
    }

    const requestPosition = () => {
        const options = {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            handleGeolocationSuccess,
            handleGeolocationError,
            options
        );

        if (geoWatchId !== null) {
            navigator.geolocation.clearWatch(geoWatchId);
        }

        geoWatchId = navigator.geolocation.watchPosition(
            handleGeolocationSuccess,
            handleGeolocationError,
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
        );
    };

    if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions.query({ name: 'geolocation' })
            .then((status) => {
                console.log('🔐 Geolocation permission:', status.state);
                updateGeoButtonVisibility(status.state);
                if (status.state === 'denied') {
                    setUnknownLocation('Location permission denied');
                    fetchIpLocationFallback();
                    return;
                }
                requestPosition();
            })
            .catch(() => requestPosition());
    } else {
        requestPosition();
    }
}

function handleGeolocationSuccess(position) {
    userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        accuracy: position.coords.accuracy,
        source: 'browser'
    };
    
    // Determine actual source based on accuracy
    let locationSource = 'Unknown';
    let locationIcon = '📍';
    if (userCoordinates.accuracy < 100) {
        locationSource = 'GPS';
        locationIcon = '🛰️';
    } else if (userCoordinates.accuracy < 1000) {
        locationSource = 'Wi-Fi';
        locationIcon = '📶';
    } else {
        locationSource = 'IP Address';
        locationIcon = '🌐';
    }
    
    console.log(`✅ Geolocation success: ${locationSource} (accuracy: ${userCoordinates.accuracy.toFixed(0)}m)`);
    
    // Display coordinates with source
    const coordsEl = document.getElementById('userCoords');
    if (coordsEl) {
        coordsEl.textContent = `${locationIcon} ${locationSource}: ${userCoordinates.lat.toFixed(4)}°, ${userCoordinates.lon.toFixed(4)}° (±${(userCoordinates.accuracy/1000).toFixed(1)}km)`;
        coordsEl.style.display = 'block';
    }
    
    // Update country display with source
    const countryEl = document.getElementById('userCountry');
    
    // Get city name from reverse geocoding (Nominatim - free OSM service)
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userCoordinates.lat}&lon=${userCoordinates.lon}&zoom=10&addressdetails=1`)
        .then(response => response.json())
        .then(data => {
            const cityEl = document.getElementById('userCity');
            const address = data?.address || {};

            if (cityEl) {
                const city = address.city || address.town || address.village || address.suburb || '';
                if (city) {
                    cityEl.textContent = `🏙️ ${city}`;
                    cityEl.style.display = 'block';
                }
            }
            
            // Update country using country_code when available
            const countryName = address.country || '';
            const countryCode = address.country_code ? address.country_code.toUpperCase() : getCountryCodeFromName(countryName);

            if (countryCode || countryName) {
                updateCountryDisplay(countryCode, countryName, locationSource);
            } else {
                estimateCountryFromCoordinates(userCoordinates.lat, userCoordinates.lon);
            }
        })
        .catch(err => {
            console.log('Could not get city name:', err);
            estimateCountryFromCoordinates(userCoordinates.lat, userCoordinates.lon);
            fetchIpLocationFallback();
        });
    
    // Immediate fallback in case reverse geocoding is slow or blocked
    estimateCountryFromCoordinates(userCoordinates.lat, userCoordinates.lon);
    updateGeoButtonVisibility('granted');
}

function handleGeolocationError(error) {
    console.log('❌ Geolocation error:', error.message);
    setUnknownLocation(error.message);
    fetchIpLocationFallback();
}

function setUnknownLocation(reason) {
    userCountry = 'Unknown';
    if (userCountryEl) {
        userCountryEl.textContent = 'Unknown Location';
    }
    if (reason) {
        console.log('📍 Location unavailable:', reason);
    }
}

function updateCountryDisplay(countryCode, countryName, sourceLabel = 'IP') {
    if (!countryCode && !countryName) return;

    const displayName = countryCode && countryCoordinates[countryCode]
        ? countryCoordinates[countryCode].name
        : (countryName || 'Unknown');

    if (userCountryEl) {
        userCountryEl.textContent = `${displayName} (${sourceLabel})`;
        userCountryEl.title = `Location detected via ${sourceLabel}`;
    }

    userCountry = countryCode || userCountry || 'Unknown';
}

function getCountryCodeFromName(countryName) {
    if (!countryName) return null;
    const normalized = countryName.trim().toLowerCase();
    for (const [code, coords] of Object.entries(countryCoordinates)) {
        if (coords?.name && coords.name.trim().toLowerCase() === normalized) {
            return code;
        }
    }
    return null;
}

function fetchIpLocationFallback() {
    fetch('/api/ip-location')
        .then(response => response.json())
        .then(data => {
            if (!data) return;
            const sourceLabel = data.isLocal ? 'Local IP' : 'IP';
            updateCountryDisplay(data.country, data.countryName, sourceLabel);

            if (data.lat && data.lon) {
                userCoordinates = {
                    lat: data.lat,
                    lon: data.lon,
                    accuracy: 50000,
                    source: 'ip'
                };
            }
        })
        .catch(err => console.log('IP location fallback failed:', err));
}

function estimateCountryFromCoordinates(lat, lon) {
    let closest = 'Unknown';
    let minDistance = Infinity;
    
    for (const [code, coords] of Object.entries(countryCoordinates)) {
        const distance = Math.sqrt(
            Math.pow(coords.lat - lat, 2) + Math.pow(coords.lon - lon, 2)
        );
        if (distance < minDistance) {
            minDistance = distance;
            closest = code;
        }
    }
    
    userCountry = minDistance < 25 ? closest : 'Unknown';
    userCountryEl.textContent = (countryCoordinates[userCountry] && countryCoordinates[userCountry].name) || 'Unknown';
    console.log('🗺️ Detected country:', userCountry, (countryCoordinates[userCountry] && countryCoordinates[userCountry].name));
}

// ============ Session Storage ============
function loadSessionData() {
    const stored = sessionStorage.getItem('globalPulseMap');
    if (stored) {
        const data = JSON.parse(stored);
        userPulses = data.userPulses || 0;
        maxPulses = data.maxPulses || 10;
        updatePulseDisplay();
    }
}

function saveSessionData() {
    const sessionData = { userPulses, maxPulses };
    sessionStorage.setItem('globalPulseMap', JSON.stringify(sessionData));
    
    // Also save to server if socket is ready
    if (socket && socket.id) {
        const gameData = {
            socketId: socket.id,
            state: {
                userPulses,
                totalPulses,
                sessionStreak,
                dailyStreak,
                bestStreak,
                userCountry,
                userCoordinates,
                lastPulseTime: Date.now()
            }
        };
        fetch('/api/gamestate/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gameData)
        }).catch(e => console.log('Could not save to server:', e.message));
    }
}

function loadTotals() {
    const stored = localStorage.getItem('gpTotals');
    if (!stored) return;
    try {
        const data = JSON.parse(stored);
        totalSessions = data.totalSessions || 0;
        totalPulses = data.totalPulses || 0;
        totalKills = data.totalKills || 0;
        personalBest = data.personalBest || 0;
        hasGlobalAttack = !!data.hasGlobalAttack;
    } catch (e) {
        console.warn('⚠️ Cannot load totals:', e.message);
    }
}

function saveTotals() {
    localStorage.setItem('gpTotals', JSON.stringify({
        totalSessions,
        totalPulses,
        totalKills,
        personalBest,
        hasGlobalAttack
    }));
}

function initSessionStats() {
    loadTotals();
    const stored = sessionStorage.getItem('gpSessionStats');
    if (stored) {
        try {
            const data = JSON.parse(stored);
            sessionStartTime = data.sessionStartTime || Date.now();
            sessionKills = data.sessionKills || 0;
            sessionStreak = data.sessionStreak || 0;
        } catch (e) {
            sessionStartTime = Date.now();
        }
    } else {
        sessionStartTime = Date.now();
        totalSessions += 1;
        saveTotals();
    }
    saveSessionStats();
    updateSessionUI();
    updateDailyChallenge();
}

function saveSessionStats() {
    sessionStorage.setItem('gpSessionStats', JSON.stringify({
        sessionStartTime,
        sessionKills,
        sessionStreak
    }));
    
    // Save defense upgrades and battle stats
    localStorage.setItem('gpDefenseUpgrades', JSON.stringify(defenseUpgrades));
    localStorage.setItem('gpBattleStats', JSON.stringify(battleStats));
    localStorage.setItem('gpAttackTypeCooldowns', JSON.stringify(attackTypeCooldowns));
}

function loadDefenseUpgrades() {
    const saved = localStorage.getItem('gpDefenseUpgrades');
    if (saved) {
        try {
            defenseUpgrades = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading defense upgrades:', e);
        }
    }
}

function loadBattleStats() {
    const saved = localStorage.getItem('gpBattleStats');
    if (saved) {
        try {
            const loaded = JSON.parse(saved);
            Object.assign(battleStats, loaded);
        } catch (e) {
            console.error('Error loading battle stats:', e);
        }
    }
}

function updateSessionUI() {
    const sessionTimeEl = document.getElementById('sessionTime');
    const killCountEl = document.getElementById('killCount');
    const scoreEl = document.getElementById('personalScore');
    const streakEl = document.getElementById('sessionStreak');
    const statSessionsEl = document.getElementById('statSessions');
    const statPulsesEl = document.getElementById('statPulses');
    const statKillsEl = document.getElementById('statKills');

    if (sessionTimeEl && sessionStartTime) {
        const diffMs = Date.now() - sessionStartTime;
        const minutes = Math.floor(diffMs / 60000);
        const hours = Math.floor(minutes / 60);
        const display = hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
        sessionTimeEl.textContent = display;
    }
    if (killCountEl) killCountEl.textContent = sessionKills;
    if (scoreEl) scoreEl.textContent = personalScore.toLocaleString();
    if (streakEl) streakEl.textContent = sessionStreak;
    if (statSessionsEl) statSessionsEl.textContent = totalSessions;
    if (statPulsesEl) statPulsesEl.textContent = totalPulses;
    if (statKillsEl) statKillsEl.textContent = totalKills;

    updateAchievements();
}

function updateDailyChallenge() {
    const target = 5;
    const progress = Math.min(userPulses, target);
    const percent = Math.round((progress / target) * 100);
    const fill = document.getElementById('dailyChallengeFill');
    const text = document.getElementById('dailyChallengeText');
    if (fill) fill.style.width = `${percent}%`;
    if (text) text.textContent = `${progress} / ${target} completed`;
}

function updateAchievements() {
    const badges = document.querySelectorAll('.achievement-badge');
    if (!badges.length) return;
    
    const achievementNames = {
        'pulses-1': { name: 'First Pulse', icon: '💓' },
        'pulses-10': { name: 'Pulse Master', icon: '💯' },
        'kills-1': { name: 'First Blood', icon: '⚔️' },
        'pulses-5': { name: 'World Traveler', icon: '🌍' },
        'global-1': { name: 'Global Strike', icon: '🚀' },
        'kills-10': { name: 'Destroyer', icon: '👑' }
    };
    
    badges.forEach((badge) => {
        const type = badge.getAttribute('data-achievement');
        const value = parseInt(badge.getAttribute('data-value') || '0', 10);
        const wasUnlocked = badge.classList.contains('unlocked');
        let unlocked = false;

        if (type === 'pulses') unlocked = totalPulses >= value;
        if (type === 'kills') unlocked = totalKills >= value;
        if (type === 'global') unlocked = hasGlobalAttack === true;

        badge.classList.toggle('unlocked', unlocked);
        badge.classList.toggle('locked', !unlocked);
        
        // 🎉 Celebrate new achievement unlock!
        if (unlocked && !wasUnlocked) {
            const key = `${type}-${value}`;
            const achievement = achievementNames[key] || { name: 'Achievement', icon: '🏆' };
            celebrateAchievement(achievement.name, achievement.icon);
            
            // Add bounce animation to badge
            badge.style.animation = 'bounceIn 0.6s ease-out';
            setTimeout(() => {
                badge.style.animation = '';
            }, 600);
        }
    });
}

function startSessionTimer() {
    updateSessionUI();
    setInterval(() => {
        updateSessionUI();
    }, 30000);
}

// ============ Map Initialization ============
function initMap() {
    console.log('🗺️ Initializing map...');

    if (!window.L) {
        console.error('❌ Leaflet not available. Map will not initialize.');
        return;
    }
    
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
        console.error('❌ Map container (#map) not found in DOM');
        return;
    }
    
    // Remove existing map instance if it exists
    if (map) {
        console.log('🧹 Removing existing map instance...');
        try {
            map.remove();
        } catch (e) {
            console.warn('Error removing map:', e);
        }
        map = null;
    }
    
    // Clean up any orphaned Leaflet data
    if (mapContainer._leaflet_id) {
        console.log('🧹 Cleaning up orphaned Leaflet instance...');
        delete mapContainer._leaflet_id;
    }
    
    // Clear container
    mapContainer.innerHTML = '';
    
    console.log('📍 Creating new Leaflet map instance...');
    try {
        map = L.map('map', {
            center: [20, 0],
            zoom: 2,
            minZoom: 2,
            maxZoom: 10,
            preferCanvas: true,
            attributionControl: false
        });
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap',
            maxZoom: 19
        }).addTo(map);
        
        console.log('✅ Map initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize map:', error);
        map = null;
    }
}

// ============ Reverse Geocoding ============
const geocodeCache = new Map();

async function reverseGeocode(lat, lon) {
    const cacheKey = `${lat.toFixed(4)},${lon.toFixed(4)}`;
    
    if (geocodeCache.has(cacheKey)) {
        return geocodeCache.get(cacheKey);
    }
    
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
            { headers: { 'User-Agent': 'GlobalPulseMap/1.0' } }
        );
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        const address = data.address || {};
        
        const result = {
            city: address.city || address.town || address.village || address.municipality || '',
            state: address.state || address.province || '',
            country: address.country || '',
            countryCode: address.country_code ? address.country_code.toUpperCase() : '',
            displayName: data.display_name || '',
            formatted: []
        };
        
        // Build formatted address
        if (result.city) result.formatted.push(result.city);
        if (result.state && result.state !== result.city) result.formatted.push(result.state);
        if (result.country) result.formatted.push(result.country);
        
        result.formattedAddress = result.formatted.join(', ') || `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
        
        geocodeCache.set(cacheKey, result);
        return result;
    } catch (error) {
        console.warn('Geocoding failed:', error);
        return {
            city: '',
            state: '',
            country: '',
            countryCode: '',
            displayName: '',
            formatted: [],
            formattedAddress: `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`
        };
    }
}

// ============ Marker Management ============
function updateMarkers(countries, pulseHistory = null, period = 'all') {
    console.log('📍 Updating markers. Period:', period, 'History length:', pulseHistory ? pulseHistory.length : 0);
    
    if (!map) {
        console.warn('Map not initialized yet');
        return;
    }
    
    // Use provided pulse history or empty array
    if (!pulseHistory || pulseHistory.length === 0) {
        console.log('No pulse history to display');
        // Remove all pulse markers
        Object.entries(markers).forEach(([markerId, marker]) => {
            if (markerId !== 'USER' && markerId.startsWith('PULSE_')) {
                if (map.hasLayer(marker)) {
                    map.removeLayer(marker);
                }
                delete markers[markerId];
            }
        });
        return;
    }
    
    // Filter pulses by period
    const now = new Date();
    const filteredPulses = pulseHistory.filter(pulse => {
        if (period === 'all') return true;
        
        const pulseTime = new Date(pulse.timestampISO);
        const hoursDiff = (now - pulseTime) / (1000 * 60 * 60);
        const minutesDiff = (now - pulseTime) / (1000 * 60);
        
        switch(period) {
            case '1minute': return minutesDiff <= 1;
            case '1hour': return hoursDiff <= 1;
            case '24hours': return hoursDiff <= 24;
            case '1month': return hoursDiff <= 720; // 30 days
            default: return true;
        }
    });
    
    console.log('Filtered pulses for period "' + period + '":', filteredPulses.length, 'out of', pulseHistory.length);
    
    // Create map of filtered pulse locations for quick lookup
    const filteredLocations = new Set(
        filteredPulses
            .map(p => getLocationKey(p.lat, p.lon))
            .filter(Boolean)
    );
    
    // Update visibility of all pulse markers
    Object.entries(markers).forEach(([markerId, marker]) => {
        if (markerId === 'USER' || !markerId.startsWith('PULSE_')) return;

        if (destroyedTargetIds.has(markerId)) {
            if (map.hasLayer(marker)) {
                map.removeLayer(marker);
            }
            delete markers[markerId];
            return;
        }
        
        const locationKey = markerId.substring(6); // Remove 'PULSE_' prefix
        const shouldShow = filteredLocations.has(locationKey);
        
        if (shouldShow && !map.hasLayer(marker)) {
            marker.addTo(map);
        } else if (!shouldShow && map.hasLayer(marker)) {
            map.removeLayer(marker);
        }
    });
    
    // Add new markers for pulses that don't have them yet
    filteredPulses.forEach((pulse) => {
        if (typeof pulse.lat !== 'number' || typeof pulse.lon !== 'number') return;
        
        const locationKey = getLocationKey(pulse.lat, pulse.lon);
        if (!locationKey) return;
        const markerId = 'PULSE_' + locationKey;

        if (destroyedTargetIds.has(markerId)) {
            return;
        }
        
        // Skip if marker already exists
        if (markers[markerId]) {
            console.log('Marker exists:', markerId);
            return;
        }
        
        // Get country name
        const countryName = (countryCoordinates[pulse.country] && countryCoordinates[pulse.country].name) || pulse.country;
        
        // All saved pulses are RED
        const color = '#EF4444';  // Red for all saved pulses
        
        // Create custom HTML marker
        const markerHtml = '<div style="' +
            'background: ' + color + '; ' +
            'border: 1px solid rgba(255,255,255,0.7); ' +
            'border-radius: 50%; ' +
            'width: 8px; ' +
            'height: 8px; ' +
            'box-shadow: 0 0 6px rgba(239,68,68,0.6); ' +
            'display: flex; ' +
            'align-items: center; ' +
            'justify-content: center; ' +
            '"></div>';
        
        const marker = L.marker([pulse.lat, pulse.lon], {
            icon: L.divIcon({
                html: markerHtml,
                iconSize: [8, 8],
                className: 'pulse-marker'
            })
        }).addTo(map);
        
        // Calculate target age and points for tooltip
        const flag = getCountryFlag(pulse.country);
        const pulseTimestamp = getTimestampMs(pulse);
        const sourceIcon = pulse.source === 'auto' ? '🤖' : '👤';  // Bot or Human
        
        // Fetch real address (async)
        let addressInfo = null;
        reverseGeocode(pulse.lat, pulse.lon).then(info => {
            addressInfo = info;
            if (markers[markerId]) {
                marker.setTooltipContent(getTooltipContent());
            }
        });
        
        // Function to generate tooltip content
        const getTooltipContent = () => {
            const targetAge = Date.now() - pulseTimestamp;
            const points = calculateTargetPoints(targetAge);
            const ageInMinutes = Math.floor(targetAge / 60000);
            const ageDisplay = ageInMinutes < 60 ? `${ageInMinutes} min` : `${Math.floor(ageInMinutes/60)}h ${ageInMinutes%60}m`;
            
            // Show defense info if this is user's own location
            let defenseInfo = '';
            if (pulse.socketId && socket && socket.id === pulse.socketId) {
                defenseInfo = `<div style="margin-top: 4px; padding-top: 4px; border-top: 1px solid rgba(255,255,255,0.2);">
                    🛡️ Shield: Lvl ${defenseUpgrades.shield || 0} | 
                    🔒 Armor: Lvl ${defenseUpgrades.armor || 0} | 
                    🚀 Intercept: Lvl ${defenseUpgrades.interceptor || 0}
                </div>`;
            }
            
            // Address info
            let locationText = '';
            if (addressInfo && addressInfo.formattedAddress) {
                locationText = `📍 ${addressInfo.formattedAddress}<br>`;
            } else {
                locationText = `📍 ${pulse.lat.toFixed(4)}°, ${pulse.lon.toFixed(4)}°<br>`;
            }
            
            return `
                <div style="font-size: 0.85rem; line-height: 1.5; min-width: 200px;">
                    <strong style="font-size: 0.95rem;">${sourceIcon} ${flag} ${countryName}</strong><br>
                    ${locationText}
                    ⏱️ Age: ${ageDisplay}<br>
                    <strong style="color: #4ade80; font-size: 0.95rem;">💎 ${points} points</strong>${defenseInfo}
                </div>
            `;
        };
        
        // Add tooltip with initial content
        marker.bindTooltip(getTooltipContent(), {
            direction: 'top',
            offset: [0, -5],
            opacity: 0.95
        });
        
        // Update tooltip content every 5 seconds
        const tooltipUpdateInterval = setInterval(() => {
            if (!markers[markerId]) {
                clearInterval(tooltipUpdateInterval);
                return;
            }
            marker.setTooltipContent(getTooltipContent());
        }, 5000);
        
        marker.on('click', () => {
            const targetData = {
                id: markerId,
                lat: pulse.lat,
                lon: pulse.lon,
                country: pulse.country,
                name: countryName,
                timestamp: getTimestampMs(pulse)
            };
            setBattleTarget(targetData);
            showTargetInfo(targetData);
        });
        markers[markerId] = marker;
        console.log('✅ Created marker:', markerId);
    });
    
    console.log('✅ Total markers on map:', Object.keys(markers).filter(k => k.startsWith('PULSE_')).length);
    refreshBattleTargets();
}

function getHeatColor(intensity) {
    if (intensity < 0.2) return '#2E7FFF';
    if (intensity < 0.4) return '#00D4FF';
    if (intensity < 0.6) return '#4CFF00';
    if (intensity < 0.8) return '#FFEB00';
    return '#FF1744';
}

// ============ Celebration & Feedback Functions ============
function showCelebration(message, type = 'kill') {
    const battleFeed = document.getElementById('battleFeed');
    if (battleFeed) {
        const feedItem = document.createElement('div');
        feedItem.className = `feed-item ${type}`;
        feedItem.textContent = message;
        
        battleFeed.insertBefore(feedItem, battleFeed.firstChild);
        
        // Keep only last 50 items (for performance)
        const MAX_FEED_ITEMS = 50;
        while (battleFeed.children.length > MAX_FEED_ITEMS) {
            battleFeed.removeChild(battleFeed.lastChild);
        }
    }
    
    // Also sync to mini battle feed in unified widget
    syncMiniBattleFeed(message, type);
    
    // Play appropriate sound
    if (type === 'kill') playSound('explosion');
    else if (type === 'achievement') playSound('achievement');
    else if (type === 'player') playSound('attack');
    
    // Update live stats
    updateLiveStats();
}

function celebrateKill(targetName) {
    showCelebration(`💥 ${targetName} Destroyed!`, 'kill');
    // Add shake to attack button
    const pulseBtn = document.getElementById('pulseBtn');
    if (pulseBtn) {
        pulseBtn.classList.add('shake');
        setTimeout(() => pulseBtn.classList.remove('shake'), 500);
    }
    playSound('explosion');
    updateLiveStats(); // Update live statistics
}

function celebrateStreak(streak) {
    if (streak > 0 && streak % 3 === 0) {
        showCelebration(`🔥 ${streak} Kill Streak!`, 'streak');
    }
}

function celebrateAchievement(achievementName, icon) {
    showCelebration(`${icon} ${achievementName}`, 'achievement');
}

// ============ Share Functionality ============
function setupShareButton() {
    const shareBtn = document.getElementById('shareBtn');
    if (!shareBtn) return;
    
    shareBtn.addEventListener('click', async () => {
        const shareData = {
            title: 'GlobalPulseMap - My Stats',
            text: `🌍 I destroyed ${totalKills} targets with ${totalPulses} pulses! Personal best: ${personalBest} kills.\n🎯 Can you beat my score?`,
            url: window.location.href
        };
        
        // Try native share API first
        if (navigator.share) {
            try {
                await navigator.share(shareData);
                showCelebration('📤 Shared Successfully!', 'achievement');
            } catch (err) {
                if (err.name !== 'AbortError') {
                    fallbackShare(shareData);
                }
            }
        } else {
            fallbackShare(shareData);
        }
    });
}

function fallbackShare(data) {
    // Copy to clipboard as fallback
    const text = `${data.text}\n${data.url}`;
    navigator.clipboard.writeText(text).then(() => {
        showCelebration('📋 Copied to clipboard!', 'achievement');
    }).catch(() => {
        alert('Share text:\n\n' + text);
    });
}

// ============ Socket.io Events ============
function setupSocketListeners() {
    console.log('🔌 Setting up socket listeners...');

    if (!socket) {
        console.error('❌ Socket.io not available. Check that /socket.io/socket.io.js is reachable.');
        return;
    }

    // Global event logger for debugging
    const allEvents = ['connect', 'disconnect', 'pulseUpdate', 'attackEvent', 'targetDestroyed', 'error'];
    
    socket.onAny((event, ...args) => {
        if (!['pong', 'ping'].includes(event)) {
            console.log(`📡 Socket event: ${event}`, args);
        }
    });

    socket.on('connect', () => {
        console.log('✅ Connected to server');
        if (statusEl) {
            statusEl.style.backgroundColor = '#4caf50';
            statusText.textContent = '✓ Connected - Ready to pulse!';
        }
        updateConnectionWidgets('connected');
        
        // Load game state from server
        if (socket && socket.id) {
            console.log(`📂 Attempting to load game state for socket: ${socket.id.substring(0, 8)}...`);
            fetch(`/api/gamestate/${socket.id}`)
                .then(r => r.json())
                .then(data => {
                    if (data.found && data.state) {
                        console.log('✅ Game state loaded from server:', data.state);
                        userPulses = data.state.userPulses || 0;
                        totalPulses = data.state.totalPulses || 0;
                        sessionStreak = data.state.sessionStreak || 0;
                        dailyStreak = data.state.dailyStreak || 0;
                        bestStreak = data.state.bestStreak || 0;
                        userCountry = data.state.userCountry || 'Unknown';
                        if (data.state.userCoordinates) {
                            userCoordinates = data.state.userCoordinates;
                        }
                        updatePulseDisplay();
                        updateSessionUI();
                    } else {
                        console.log('📂 No previous game state found');
                    }
                })
                .catch(e => console.log('Could not load game state:', e.message));
        }
    });

    socket.on('disconnect', () => {
        console.log('❌ Disconnected from server');
        if (statusEl) {
            statusEl.style.backgroundColor = '#ff9800';
            statusText.textContent = '⚠ Disconnected - Reconnecting...';
        }
        updateConnectionWidgets('disconnected');
    });

    socket.on('initData', (data) => {
        console.log('📊 Received initial data:', data);
        if (globalCountEl) {
            globalCountEl.textContent = data.global || 0;
        }
        updateGlobalStats();
        // Store pulse history for marker updates
        if (data.pulseHistory) {
            pulseHistory = data.pulseHistory;
            savePulseHistory(); // Save to localStorage
            console.log('📍 Received', pulseHistory.length, 'pulses from history');
        }
        if (data.destroyedTargets) {
            applyDestroyedTargets(data.destroyedTargets);
        }
        if (map && data.countries) {
            updateMarkers(data.countries, pulseHistory, currentPeriod);
            updateTopCountries(data.countries);
        }
        
        // Update user leaderboard
        if (data.topPlayers) {
            updateUserLeaderboard(data.topPlayers);
        }
        
        // Update online player count in live stats widget
        const playerCountEl = document.getElementById('livePlayerCount');
        if (playerCountEl && data.onlinePlayers !== undefined) {
            playerCountEl.textContent = data.onlinePlayers || '1+';
            playerCountEl.dataset.synced = 'true';
        }
        
        // Update live stats widget
        updateLiveStats();
        
        // Replay active attacks that are currently in progress
        if (data.activeAttacks && data.activeAttacks.length > 0) {
            console.log(`🚀 Showing ${data.activeAttacks.length} active attacks in progress`);
            // Wait for map to be ready if needed
            if (!map || !window.L) {
                console.log('   ⏳ Waiting for map to be ready...');
                const checkMapReady = setInterval(() => {
                    if (map && window.L) {
                        clearInterval(checkMapReady);
                        console.log('   ✅ Map ready, showing attacks');
                        showActiveAttacks(data.activeAttacks);
                    }
                }, 100);
                setTimeout(() => clearInterval(checkMapReady), 5000);
            } else {
                showActiveAttacks(data.activeAttacks);
            }
        }
        
        // Helper function to show active attacks
        function showActiveAttacks(activeAttacks) {
            const now = Date.now();
            activeAttacks.forEach(attack => {
                const elapsedMs = now - attack.startTime;
                const remainingMs = (attack.duration * 1000) - elapsedMs;
                console.log(`  ↳ Attack: ${(remainingMs/1000).toFixed(1)}s remaining, elapsed: ${(elapsedMs/1000).toFixed(1)}s`);
                // Visualize the attack with elapsed time
                if (remainingMs > 0) {
                    renderAttackEvent(attack, 'activeAttack', elapsedMs);
                }
            });
        }
        
        // Load recent activities from server
        if (data.recentActivities && data.recentActivities.length > 0 && recentActivityEl) {
            console.log('📝 Loading', data.recentActivities.length, 'recent activities');
            
            // Add activities from server if not already shown
            data.recentActivities.forEach(activity => {
                // Check if this activity is already displayed
                const existing = recentActivityEl.querySelector(`[data-timestamp="${new Date(activity.timestamp).getTime()}"]`);
                if (!existing) {
                    addActivityFromServer(activity);
                }
            });
        } else if (recentActivityEl && (!data.recentActivities || data.recentActivities.length === 0)) {
            console.log('📝 No recent activities yet');
            if (recentActivityEl.children.length === 0) {
                recentActivityEl.innerHTML = '<p class="loading">No activity yet</p>';
            }
        }
    });
    
    // Listen for real-time leaderboard updates
    socket.on('leaderboardUpdate', (data) => {
        if (data.players) {
            updateUserLeaderboard(data.players);
        }
    });

    socket.on('pulsesByPeriod', (data) => {
        console.log('📊 Received period data:', data);
        if (globalCountEl) {
            globalCountEl.textContent = data.global || 0;
        }
        updateGlobalStats();
        if (map && data.countries) {
            updateMarkers(data.countries, pulseHistory, currentPeriod);
            updateTopCountries(data.countries);
        }
    });

    socket.on('pulseUpdate', (data) => {
        console.log('💓 New pulse from:', data.country, 'Data:', data);
        if (globalCountEl) {
            globalCountEl.textContent = parseInt(globalCountEl.textContent) + 1;
        }
        updateGlobalStats();
        
        // Add or update pulse in history
        if (data.pulseEntry) {
            const locationKey = getLocationKey(data.pulseEntry.lat, data.pulseEntry.lon);
            const existingIndex = pulseHistory.findIndex(p => getLocationKey(p.lat, p.lon) === locationKey);

            if (existingIndex >= 0) {
                pulseHistory[existingIndex] = data.pulseEntry;
            } else {
                pulseHistory.push(data.pulseEntry);
            }

            savePulseHistory(); // Save to localStorage
            console.log('✅ Updated pulseHistory. Total:', pulseHistory.length);
            addActivity(data.country, data.pulseEntry);
            // Update markers to show new pulse ONLY if within current period
            if (map && pulseHistory && pulseHistory.length > 0) {
                console.log('📍 Updating markers after new pulse');
                updateMarkers({}, pulseHistory, currentPeriod);
            }
        } else {
            // Fallback if no pulseEntry
            addActivity(data.country, { lat: null, lon: null });
        }
        
        triggerEcgBeat();
    });

    const renderAttackEvent = (data, eventName = 'attackEvent', elapsedMs = 0) => {
        console.log(`\n⚔️ ===== ${eventName.toUpperCase()} RECEIVED =====`);
        console.log('   Data:', data);
        if (elapsedMs > 0) console.log(`   Elapsed: ${(elapsedMs/1000).toFixed(1)}s`);

        if (!data || typeof data.fromLat !== 'number' || typeof data.toLat !== 'number') {
            console.error('❌ Invalid attack data');
            return;
        }

        if (!map || !window.L) {
            console.warn('❌ Map not ready for attack');
            return;
        }

        const start = { lat: data.fromLat, lon: data.fromLon };
        const end = { lat: data.toLat, lon: data.toLon };
        const duration = data.duration || 8;
        const isAuto = data.isAutoAgent || false;

        console.log(`   Start: (${start.lat.toFixed(2)}, ${start.lon.toFixed(2)})`);
        console.log(`   End: (${end.lat.toFixed(2)}, ${end.lon.toFixed(2)})`);
        console.log(`   Duration: ${duration}s`);
        console.log(`   Type: ${isAuto ? '🤖 AUTO' : '👤 HUMAN'}`);
        
        // Show attack info popup
        showAttackInfoPopup(data);

        try {
            // Draw trajectory (match human style)
            const points = createArcPoints(start, end, 60);
            console.log(`   Arc points: ${points.length}`);

            const polyline = L.polyline(points, {
                color: '#EF4444',
                weight: 1.5,
                opacity: 0.8,
                dashArray: '6 10',
                lineCap: 'round',
                lineJoin: 'round',
                className: 'trajectory-line'
            }).addTo(map);
            console.log(`   Polyline created and added`);

            const rocket = createRocketMarker(start.lat, start.lon, end.lat, end.lon).addTo(map);
            console.log(`   Rocket created and added`);

            const startTime = performance.now() - elapsedMs; // Adjust for elapsed time
            const animationDuration = duration * 1000;

            const animate = (now) => {
                const t = Math.min((now - startTime) / animationDuration, 1);
                const idx = Math.floor(t * (points.length - 1));
                const point = points[idx];
                const prevIdx = Math.max(0, idx - 1);
                const prevPoint = points[prevIdx];

                rocket.setLatLng(point);
                // Only update heading when there's meaningful movement
                if (idx !== prevIdx) {
                    updateRocketHeading(rocket, prevPoint, point);
                }
                polyline.setLatLngs(points.slice(0, idx + 1));
                polyline.setStyle({ dashOffset: -t * 60 });

                if (t < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // Animation complete
                    if (map.hasLayer(rocket)) map.removeLayer(rocket);
                    if (map.hasLayer(polyline)) map.removeLayer(polyline);
                    createExplosion({ lat: end.lat, lon: end.lon });
                    
                    // Destroy target (same as human attacks)
                    const locationKey = getLocationKey(end.lat, end.lon);
                    const targetId = `PULSE_${locationKey}`;
                    
                    if (!destroyedTargetIds.has(targetId)) {
                        const pulseEntry = pulseHistory.find(p => getLocationKey(p.lat, p.lon) === locationKey);
                        destroyTarget({ 
                            lat: end.lat, 
                            lon: end.lon, 
                            id: targetId,
                            name: pulseEntry?.city || 'Target',
                            country: pulseEntry?.country || 'Unknown'
                        });
                        if (pulseEntry) {
                            addBattleActivity(pulseEntry);
                        }
                    }
                    
                    console.log('✅ Attack animation complete, explosion shown');
                }
            };

            console.log('   Starting animation...');
            requestAnimationFrame(animate);
            triggerEcgBeat(); // Show on cardiogram
            console.log(`✅ Attack rendered successfully`);
            console.log(`===== ${eventName.toUpperCase()} COMPLETE =====\n`);
        } catch (e) {
            console.error('❌ Error rendering attack:', e);
            console.log(`===== ${eventName.toUpperCase()} FAILED =====\n`);
        }
    };

    // ============ ATTACK INFO POPUP ============
    async function showAttackInfoPopup(attackData) {
        const fromCountry = getCountryFromCoordinates(attackData.fromLat, attackData.fromLon);
        const toCountry = getCountryFromCoordinates(attackData.toLat, attackData.toLon);
        const fromFlag = getCountryFlag(fromCountry);
        const toFlag = getCountryFlag(toCountry);
        const typeIcon = attackData.isAutoAgent ? '🤖' : '👤';
        const distance = calculateDistance(attackData.fromLat, attackData.fromLon, attackData.toLat, attackData.toLon);
        
        // Fetch addresses
        const fromAddress = await reverseGeocode(attackData.fromLat, attackData.fromLon);
        const toAddress = await reverseGeocode(attackData.toLat, attackData.toLon);
        
        const popup = document.createElement('div');
        popup.className = 'attack-info-popup';
        popup.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, rgba(30, 30, 46, 0.98), rgba(49, 50, 68, 0.98));
            border: 1px solid rgba(239, 68, 68, 0.5);
            border-radius: 12px;
            padding: 16px 20px;
            min-width: 320px;
            max-width: 400px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(239, 68, 68, 0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            font-family: 'Segoe UI', system-ui, sans-serif;
            color: #e4e4e7;
        `;
        
        popup.innerHTML = `
            <style>
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            </style>
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                <div style="font-size: 1.1rem; font-weight: 600; color: #ef4444;">
                    ⚔️ Attack in Progress
                </div>
                <button onclick="this.closest('.attack-info-popup').remove()" style="
                    background: none;
                    border: none;
                    color: #a1a1aa;
                    font-size: 1.3rem;
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 4px;
                    transition: all 0.2s;
                ">&times;</button>
            </div>
            
            <div style="font-size: 0.85rem; line-height: 1.6;">
                <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <div style="color: #a1a1aa; font-size: 0.75rem; margin-bottom: 4px;">ATTACKER ${typeIcon}</div>
                    <div style="font-weight: 500; margin-bottom: 2px;">${fromFlag} ${fromCountry}</div>
                    <div style="color: #a1a1aa; font-size: 0.8rem;">${fromAddress.formattedAddress}</div>
                    <div style="color: #71717a; font-size: 0.75rem; margin-top: 2px;">${attackData.fromLat.toFixed(4)}°, ${attackData.fromLon.toFixed(4)}°</div>
                </div>
                
                <div style="text-align: center; margin: 8px 0; color: #ef4444; font-size: 1.2rem;">⚡ ${distance.toFixed(0)} km ➜</div>
                
                <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <div style="color: #a1a1aa; font-size: 0.75rem; margin-bottom: 4px;">TARGET 🎯</div>
                    <div style="font-weight: 500; margin-bottom: 2px;">${toFlag} ${toCountry}</div>
                    <div style="color: #a1a1aa; font-size: 0.8rem;">${toAddress.formattedAddress}</div>
                    <div style="color: #71717a; font-size: 0.75rem; margin-top: 2px;">${attackData.toLat.toFixed(4)}°, ${attackData.toLon.toFixed(4)}°</div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; font-size: 0.8rem;">
                    <div style="background: rgba(239, 68, 68, 0.1); padding: 8px; border-radius: 6px; text-align: center;">
                        <div style="color: #a1a1aa; font-size: 0.7rem;">DURATION</div>
                        <div style="font-weight: 600; color: #ef4444;">${attackData.duration || 8}s</div>
                    </div>
                    <div style="background: rgba(74, 222, 128, 0.1); padding: 8px; border-radius: 6px; text-align: center;">
                        <div style="color: #a1a1aa; font-size: 0.7rem;">TYPE</div>
                        <div style="font-weight: 600; color: #4ade80;">${attackData.isAutoAgent ? 'AUTO' : 'HUMAN'}</div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Auto-remove after attack duration + 2s
        setTimeout(() => {
            popup.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => popup.remove(), 300);
        }, (attackData.duration || 8) * 1000 + 2000);
    }
    
    // ============ INCOMING ATTACK DEFENSE ============
    function handleIncomingAttack(attackData) {
        console.log('🛡️ Handling incoming attack...');
        
        // Calculate damage (0-20% based on distance)
        const distance = userCoordinates ? 
            calculateDistance(userCoordinates.lat, userCoordinates.lon, attackData.toLat, attackData.toLon) : 10;
        const damage = Math.max(5, Math.min(20, distance / 20)); // 5-20%
        
        // Apply shield damage
        if (playerShieldHP > 0) {
            const shielded = Math.min(playerShieldHP, damage);
            damagePlayerShield(shielded);
            showCelebration(`🛡️ Shield absorbed ${Math.round(shielded)}% damage!`, 'achievement');
        } else {
            // Shield down - full damage
            showCelebration(`❌ No shield! Took ${Math.round(damage)}% damage!`, 'kill');
        }
        
        // Auto-offer intercept if available
        if (playerIntercepts > 0) {
            const shouldIntercept = Math.random() > 0.5; // 50% chance to auto-intercept
            if (shouldIntercept) {
                setTimeout(() => {
                    if (launchIntercept(attackData.fromLat, attackData.fromLon)) {
                        showCelebration(`🚀 Intercepted incoming attack!`, 'achievement');
                    }
                }, 500);
            }
        }
        
        rechargePlayerShield();
    }

    // Handle attack events (both human player and auto-agent attacks are broadcast here)
    socket.on('attackEvent', (data) => {
        console.log('🚀 Received attackEvent:', data);
        
        // Visualize the attack on map using existing renderAttackEvent
        renderAttackEvent(data, 'attackEvent', 0);
        
        // Show notification only if it's from/to the player
        const isPlayerAttack = !data.isAutoAgent;
        const isPlayerLocation = userCoordinates && 
            Math.abs(data.toLat - userCoordinates.lat) < 0.5 && 
            Math.abs(data.toLon - userCoordinates.lon) < 0.5;
        
        if (isPlayerAttack) {
            const fromCountry = getCountryFromCoordinates(data.fromLat, data.fromLon);
            const toCountry = getCountryFromCoordinates(data.toLat, data.toLon);
            showCelebration(`⚔️ ${fromCountry} → ${toCountry}`, 'player');
        } else if (isPlayerLocation) {
            showCelebration(`🎯 Incoming attack to your area!`, 'kill');
            
            // DEFENSE: Apply shield damage and offer intercept
            handleIncomingAttack(data);
        }
    });

    // Backward-compat: handle legacy autoAttack events
    socket.on('autoAttack', (data) => {
        console.log('🚀 Received autoAttack (legacy):', data);
        
        // Visualize ALL auto-attacks, not just near player
        renderAttackEvent(data, 'autoAttack', 0);
        
        // Show notification only if attack is near player location
        const isPlayerLocation = userCoordinates && 
            Math.abs(data.toLat - userCoordinates.lat) < 0.5 && 
            Math.abs(data.toLon - userCoordinates.lon) < 0.5;
        
        if (isPlayerLocation) {
            showCelebration(`🤖 Auto-agent attack near you!`, 'kill');
            handleIncomingAttack(data);
        }
    });

    socket.on('targetDestroyed', (data) => {
        const locationKey = data?.locationKey;
        if (!locationKey) return;
        const markerId = `PULSE_${locationKey}`;
        if (destroyedTargetIds.has(markerId)) return;

        const selectedTargetSnapshot = selectedTarget ? { ...selectedTarget } : null;
        const pulseEntry = pulseHistory.find(p => getLocationKey(p.lat, p.lon) === locationKey);
        const playerAttackData = playerInitiatedAttacks.get(locationKey);
        
        // Check if this is player's target: either selected target OR tracked attack from this player
        const isPlayerTarget = (selectedTargetSnapshot && selectedTargetSnapshot.id === markerId) || 
                              (playerAttackData !== undefined);
        const isAutoAgentDestroy = data?.isAutoAgent || false;

        console.log('💥 targetDestroyed handler:', { 
            locationKey, 
            isPlayerTarget, 
            isAutoAgentDestroy, 
            hadPlayerAttack: playerAttackData !== undefined,
            selectedTargetId: selectedTargetSnapshot?.id 
        });

        // Clean up tracked attack
        if (playerAttackData) {
            playerInitiatedAttacks.delete(locationKey);
        }

        destroyedTargetIds.add(markerId);
        removePulseByLocationKey(locationKey);

        const marker = markers[markerId];
        if (marker && map && map.hasLayer(marker)) {
            map.removeLayer(marker);
        }
        delete markers[markerId];

        if (selectedTargetSnapshot && selectedTargetSnapshot.id === markerId) {
            clearBattleTarget();
            hideTargetInfo();
        }
        refreshBattleTargets();
        updateGlobalStats();
        updateBattleStats();

        if (isPlayerTarget) {
            sessionKills += 1;
            totalKills += 1;
            sessionStreak += 1;
            if (sessionKills > personalBest) {
                personalBest = sessionKills;
            }
        }
        
        // 🎉 Calculate and add score based on target age - ONLY for human player destroys
        let targetTimestamp = null;
        let targetCountry = null;
        
        // Try to get target data from multiple sources
        if (playerAttackData && playerAttackData.targetSnapshot) {
            targetTimestamp = getTimestampMs(playerAttackData.targetSnapshot);
            targetCountry = playerAttackData.targetSnapshot.country;
        } else if (isPlayerTarget && selectedTargetSnapshot) {
            targetTimestamp = getTimestampMs(selectedTargetSnapshot);
            targetCountry = selectedTargetSnapshot.country;
        } else if (pulseEntry) {
            targetTimestamp = getTimestampMs(pulseEntry);
            targetCountry = pulseEntry.country;
        }
        
        // Also try to get from server data if not found
        if (!targetCountry && data?.targetCountry) {
            targetCountry = data.targetCountry;
        }

        // Add score only for player's target (except auto-agent destroys)
        if (!isAutoAgentDestroy && isPlayerTarget) {
            const effectiveTimestamp = targetTimestamp || (data?.timestamp ? new Date(data.timestamp).getTime() : Date.now());
            const targetAge = Math.max(Date.now() - effectiveTimestamp, 0);
            
            // Get attack cost from tracked attack data
            const attackCost = playerAttackData?.cost || 0;
            const basePoints = calculateTargetPoints(targetAge, attackCost);
            
            // Apply defense reduction based on target's defense capabilities
            let points = basePoints;
            let defenseReduction = 0;
            let defenseBlocked = 0;
            
            // Get target's defense info from server data if available
            const targetDefense = data?.targetDefense || { shield: 0, armor: 0, interceptor: 0 };
            
            // Calculate defense reduction percentage
            // Shield: 10% reduction per level (max 50%)
            const shieldReduction = Math.min(targetDefense.shield * 0.10, 0.50);
            // Armor: 8% reduction per level (max 40%)
            const armorReduction = Math.min(targetDefense.armor * 0.08, 0.40);
            // Interceptor: 5% reduction per level (max 15%)
            const interceptorReduction = Math.min(targetDefense.interceptor * 0.05, 0.15);
            
            // Total defense reduction
            const totalDefenseReduction = shieldReduction + armorReduction + interceptorReduction;
            defenseReduction = Math.floor(basePoints * totalDefenseReduction);
            points = Math.max(basePoints - defenseReduction, Math.floor(basePoints * 0.2)); // Minimum 20% of base points
            
            console.log('🎯 Target destroyed - adding score:', { 
                basePoints,
                points, 
                defenseReduction,
                targetDefense,
                targetCountry, 
                isAutoAgent: isAutoAgentDestroy, 
                userName: currentUser?.name, 
                targetAge,
                hadPlayerAttack: playerAttackData !== undefined
            });
            
            addScore(points, targetCountry);
            
            // Show feedback with defense info
            let destroyMessage = `👤 ${data?.targetName || 'Target'} +${points} pts`;
            if (defenseReduction > 0) {
                destroyMessage += ` (defense -${defenseReduction})`;
            }
            celebrateKill(destroyMessage);
            celebrateStreak(sessionStreak);
            
            // Update battle stats with defense interaction
            battleStats.pointsEarned += points;
            if (defenseReduction > 0) {
                battleStats.damageDealt -= defenseReduction; // Track reduced effectiveness
            }
            
            // Add activity for successful attack
            const attackActivity = {
                type: 'battle',
                timestamp: new Date().toISOString(),
                targetName: data?.targetName || 'Target',
                title: `👤 Target Destroyed`,
                message: `👤 Defeated target in ${targetCountry} (+${points} pts${defenseReduction > 0 ? ', defense -' + defenseReduction : ''})`,
                country: targetCountry
            };
            activityHistory.push(attackActivity);
            if (recentActivityEl) {
                const item = createActivityItem(attackActivity);
                recentActivityEl.insertBefore(item, recentActivityEl.firstChild);
                limitActivityItems();
            }
            saveRecentActivities();
        } else if (isAutoAgentDestroy && isPlayerTarget) {
            // Auto-agent destroy - show notification only if it's player's target
            celebrateKill(`🤖 ${data?.targetName || 'Target'} (bot)`);
        }
        
        saveSessionStats();
        saveTotals();
        saveUser();
        updateSessionUI();
        updateAchievements(); // Check for new achievements
    });

    socket.on('targetRemoved', (data) => {
        const locationKey = data?.locationKey;
        if (!locationKey) return;
        const markerId = `PULSE_${locationKey}`;

        removePulseByLocationKey(locationKey);

        const marker = markers[markerId];
        if (marker && map && map.hasLayer(marker)) {
            map.removeLayer(marker);
        }
        delete markers[markerId];
        destroyedTargetIds.delete(markerId);

        if (selectedTarget && selectedTarget.id === markerId) {
            clearBattleTarget();
        }
        refreshBattleTargets();
        updateGlobalStats();
    });

    socket.on('targetRevived', (data) => {
        const locationKey = data?.locationKey;
        if (!locationKey) return;
        const markerId = `PULSE_${locationKey}`;
        destroyedTargetIds.delete(markerId);

        if (map && pulseHistory && pulseHistory.length > 0) {
            updateMarkers({}, pulseHistory, currentPeriod);
        }
        refreshBattleTargets();
        updateGlobalStats();
    });

    socket.on('error', (err) => {
        console.error('❌ Socket error:', err);
    });
}

function updateGlobalStats() {
    if (activeTargetsEl) {
        activeTargetsEl.textContent = countActiveTargets();
    }
    if (destroyedTargetsEl) {
        destroyedTargetsEl.textContent = destroyedTargetIds.size;
    }
    if (activeCountriesEl) {
        activeCountriesEl.textContent = countActiveCountries();
    }
    if (battleModeStatusEl) {
        battleModeStatusEl.textContent = battleModeEnabled ? 'On' : 'Off';
    }
    updateTopCountries();
}

function startGlobalStatsTicker() {
    updateGlobalStats();
    setInterval(updateGlobalStats, 1000);
}

function countActiveTargets() {
    const activeLocations = new Set();
    pulseHistory.forEach(pulse => {
        if (pulse.lat === null || pulse.lon === null || pulse.lat === undefined || pulse.lon === undefined) return;
        const locationKey = getLocationKey(pulse.lat, pulse.lon);
        if (!locationKey) return;
        if (destroyedTargetIds.has(`PULSE_${locationKey}`)) return;
        activeLocations.add(locationKey);
    });
    return activeLocations.size;
}

function countActiveCountries() {
    const now = Date.now();
    const tenMinutesAgo = now - 10 * 60 * 1000;
    const set = new Set();
    pulseHistory.forEach(pulse => {
        if (!pulse.country || pulse.country === 'Unknown') return;
        const ts = pulse.timestampISO ? new Date(pulse.timestampISO).getTime() : null;
        if (!ts || ts < tenMinutesAgo) return;
        set.add(pulse.country);
    });
    return set.size;
}

function getLastPulseTime() {
    if (!pulseHistory.length) return null;
    const last = pulseHistory[pulseHistory.length - 1];
    if (!last || !last.timestampISO) return null;
    return new Date(last.timestampISO);
}

// ============ UI Updates ============
let allCountriesData = {}; // Store all countries data

function getActiveCountryCounts() {
    const counts = {};
    if (!pulseHistory || pulseHistory.length === 0) return counts;

    pulseHistory.forEach(pulse => {
        const locationKey = getLocationKey(pulse.lat, pulse.lon);
        const markerId = `PULSE_${locationKey}`;
        if (destroyedTargetIds.has(markerId)) return;

        const country = pulse.country || 'Unknown';
        if (country === 'Unknown') return;
        counts[country] = (counts[country] || 0) + 1;
    });

    return counts;
}

function updateTopCountries(countries) {
    if (!topCountriesEl) return;
    
    const activeCountries = getActiveCountryCounts();
    // Store all data for modal
    allCountriesData = activeCountries;
    
    const sorted = Object.entries(activeCountries)
        .sort((a, b) => b[1] - a[1]);
    
    if (sorted.length === 0) {
        topCountriesEl.innerHTML = '<p class="loading">Waiting for pulses...</p>';
        return;
    }
    
    // Show a limited set to avoid scrollbars
    topCountriesEl.innerHTML = sorted.slice(0, 3).map(([country, count]) => {
        const flag = getCountryFlag(country);
        return `
        <div class="country-item">
            <span class="country-name">${flag}${(countryCoordinates[country] && countryCoordinates[country].name) || country}</span>
            <span class="country-count">${count}</span>
        </div>
    `;
    }).join('');
}

function refreshBattleTargets() {
    if (!battleTargetsEl) return;

    const locationMap = new Map();

    pulseHistory
        .filter(pulse => typeof pulse.lat === 'number' && typeof pulse.lon === 'number')
        .forEach(pulse => {
            const locationKey = getLocationKey(pulse.lat, pulse.lon);
            if (!locationKey) return;
            if (destroyedTargetIds.has(`PULSE_${locationKey}`)) return;
            locationMap.set(locationKey, pulse);
        });

    const available = Array.from(locationMap.values())
        .filter(pulse => {
            // Filter by range
            if (currentBattleRange === Infinity) return true; // Global range - show all
            if (!userCoordinates) return true; // Show all if user location not set
            
            const distance = calculateDistance(
                userCoordinates.lat, 
                userCoordinates.lon, 
                pulse.lat, 
                pulse.lon
            );
            return distance <= currentBattleRange;
        })
        .slice(-MAX_BATTLE_TARGETS)
        .reverse();

    if (available.length === 0) {
        battleTargetsEl.innerHTML = '<div class="loading">No targets in range</div>';
        return;
    }

    battleTargetsEl.innerHTML = available.map((pulse) => {
        const locationKey = getLocationKey(pulse.lat, pulse.lon);
        const markerId = `PULSE_${locationKey}`;
        const countryName = (countryCoordinates[pulse.country] && countryCoordinates[pulse.country].name) || pulse.country;
        const activeClass = selectedTarget && selectedTarget.id === markerId ? 'active' : '';
        return `
            <button class="battle-target-item ${activeClass}" data-target-id="${markerId}">
                ${countryName}
            </button>
        `;
    }).join('');

    battleTargetsEl.querySelectorAll('.battle-target-item').forEach((btn) => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.targetId;
            const targetKey = targetId.replace('PULSE_', '');
            const pulse = pulseHistory.find(p => getLocationKey(p.lat, p.lon) === targetKey);
            if (!pulse) return;
            setBattleTarget({
                id: targetId,
                lat: pulse.lat,
                lon: pulse.lon,
                country: pulse.country,
                name: (countryCoordinates[pulse.country] && countryCoordinates[pulse.country].name) || pulse.country
            });
        });
    });
}

function setBattleTarget(target) {
    selectedTarget = target;
    if (battleTargetNameEl) {
        battleTargetNameEl.textContent = target.name || 'Unknown target';
    }
    
    // Update compact display in new Battle Command Center
    const compactDisplay = document.getElementById('battleTargetNameCompact');
    if (compactDisplay) {
        const shortName = (target.name || 'Target').substring(0, 12);
        compactDisplay.textContent = shortName;
    }
    
    if (typeof target.lat === 'number' && typeof target.lon === 'number') {
        enrichBattleTargetAddress(target);
    }
    highlightBattleTarget(target);
    refreshBattleTargets();
    updateGlobalStats();
    
    // 🎯 Visual cue: Make pulse button glow when target is selected
    const pulseBtn = document.getElementById('pulseBtn');
    if (pulseBtn && !attackCooldownActive) {
        pulseBtn.classList.add('pulse-ready');
        pulseBtn.textContent = '⚔️ Attack Target';
    }
}

function clearBattleTarget() {
    selectedTarget = null;
    if (battleTargetNameEl) battleTargetNameEl.textContent = 'Select a target on map';
    if (targetHalo && map) {
        map.removeLayer(targetHalo);
        targetHalo = null;
    }
    refreshBattleTargets();
    updateGlobalStats();
    
    // Remove glow from pulse button
    const pulseBtn = document.getElementById('pulseBtn');
    if (pulseBtn) {
        pulseBtn.classList.remove('pulse-ready');
        pulseBtn.textContent = '🎯 Select target';
    }
}

function startAttackCooldown() {
    // Get attack duration (always 30s now)
    const attackDuration = 30;
    
    console.log(`⚔️ Starting attack cooldown: ${attackDuration}s`);
    
    // Activate cooldown
    attackCooldownActive = true;
    attackCooldownEndTime = Date.now() + (attackDuration * 1000);
    
    const cooldownEl = document.getElementById('battleCooldown');
    const pulseBtn = document.getElementById('pulseBtn');
    const battleToggle = document.getElementById('battleToggle');
    
    // HIDE Deploy button, SHOW Cooldown div
    if (pulseBtn) {
        pulseBtn.style.display = 'none';
        pulseBtn.disabled = true;
    }
    if (cooldownEl) {
        cooldownEl.style.display = 'flex';
    }
    if (battleToggle) {
        battleToggle.disabled = true;
    }
    
    // Draw ballistic trajectory
    if (userCoordinates && selectedTarget) {
        drawBallisticTrajectory(userCoordinates, selectedTarget, attackDuration);
    }
    
    updateCooldownTimer();
    
    attackCooldownInterval = setInterval(() => {
        const remaining = attackCooldownEndTime - Date.now();
        if (remaining <= 0) {
            endAttackCooldown();
        } else {
            updateCooldownTimer();
        }
    }, 100);
}

function drawBallisticTrajectory(from, to, duration) {
    console.log(`🎯 ===== drawBallisticTrajectory START =====`);
    console.log(`  From: (${from.lat}, ${from.lon})`);
    console.log(`  To: (${to.lat}, ${to.lon})`);
    console.log(`  Duration: ${duration}s`);
    console.log(`  Map exists:`, !!map);
    console.log(`  L exists:`, !!window.L);
    
    if (!map) {
        console.error('❌ Map is null!');
        return;
    }
    
    if (!window.L) {
        console.error('❌ Leaflet (L) is not available!');
        return;
    }
    
    try {
        console.log('  Step 1: Creating arc points...');
        // Use optimal point count for smooth animation without lag
        const arcPoints = createArcPoints(from, to, 60);
        console.log(`  ✅ Generated ${arcPoints.length} trajectory points`);
        console.log(`  First point:`, arcPoints[0]);
        console.log(`  Last point:`, arcPoints[arcPoints.length - 1]);
        
        console.log('  Step 2: Creating polyline...');
        const trajectoryLine = L.polyline(arcPoints, {
            color: '#EF4444',
            weight: 1.5,
            opacity: 0.8,
            dashArray: '6 10',
            lineCap: 'round',
            lineJoin: 'round',
            className: 'trajectory-line'
        });
        console.log(`  ✅ Polyline created:`, trajectoryLine);
        
        console.log('  Step 3: Adding polyline to map...');
        trajectoryLine.addTo(map);
        console.log(`  ✅ Trajectory line added to map`);
        console.log(`  Map has layer:`, map.hasLayer(trajectoryLine));
        
        console.log('  Step 4: Creating rocket marker...');
        const rocket = createRocketMarker(from.lat, from.lon, to.lat, to.lon);
        console.log(`  ✅ Rocket created:`, rocket);
        
        console.log('  Step 5: Adding rocket to map...');
        rocket.addTo(map);
        console.log(`  ✅ Rocket added to map`);
        console.log(`  Map has layer:`, map.hasLayer(rocket));
        
        console.log(`  Step 6: Starting animation with ${arcPoints.length} points over ${duration}s`);
        animateTrajectoryDrawing(arcPoints, duration, to, trajectoryLine, rocket);
        
        console.log(`===== drawBallisticTrajectory END (SUCCESS) =====`);
    } catch (e) {
        console.error('❌ ===== ERROR in drawBallisticTrajectory =====');
        console.error('Error details:', e);
        console.error('Stack trace:', e.stack);
        console.error('===== END ERROR =====');
    }
}

function animateTrajectoryDrawing(allPoints, duration, target, trajectoryLine, projectile) {
    if (!trajectoryLine) {
        console.error('❌ trajectoryLine is null in animateTrajectoryDrawing');
        return;
    }
    
    console.log(`🎬 Starting trajectory animation: ${allPoints.length} points, ${duration}s duration`);
    
    const startTime = Date.now();
    const durationMs = duration * 1000;
    let frameCount = 0;
    
    const animate = () => {
        frameCount++;
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        
        // Calculate how many points to show
        const pointsToShow = Math.floor(progress * allPoints.length);
        const currentPoints = allPoints.slice(0, Math.max(1, pointsToShow));
        
        if (trajectoryLine && map && map.hasLayer(trajectoryLine)) {
            trajectoryLine.setLatLngs(currentPoints);
            trajectoryLine.setStyle({ dashOffset: -progress * 60 });
        }
        
        // Animate projectile marker along the path with smooth interpolation
        if (projectile && currentPoints.length > 1 && map && map.hasLayer(projectile)) {
            const lastPoint = currentPoints[currentPoints.length - 1];
            const prevPoint = currentPoints[Math.max(0, currentPoints.length - 2)];
            projectile.setLatLng(lastPoint);
            // Only update heading if there's meaningful movement to avoid jitter
            const dLat = Math.abs(lastPoint[0] - prevPoint[0]);
            const dLon = Math.abs(lastPoint[1] - prevPoint[1]);
            if (dLat > 0.001 || dLon > 0.001) {
                updateRocketHeading(projectile, prevPoint, lastPoint);
            }
        }
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            console.log(`✅ Animation complete after ${frameCount} frames`);
            // Remove trajectory and projectile when animation ends
            if (trajectoryLine && map && map.hasLayer(trajectoryLine)) {
                try {
                    map.removeLayer(trajectoryLine);
                    console.log(`  ✅ Trajectory removed`);
                } catch (e) {
                    console.warn('Error removing trajectory:', e);
                }
            }
            
            if (projectile && map && map.hasLayer(projectile)) {
                try {
                    map.removeLayer(projectile);
                    console.log(`  ✅ Projectile removed`);
                } catch (e) {
                    console.warn('Error removing projectile:', e);
                }
            }

            // Destroy target and show explosion after trajectory completes
            if (target && target.lat !== undefined && target.lon !== undefined) {
                const locationKey = getLocationKey(target.lat, target.lon);
                const targetId = `PULSE_${locationKey}`;
                const skipDestroy = !!target.skipDestroy;
                
                console.log(`💥 Trajectory complete - destroying target:`, {
                    targetId,
                    locationKey,
                    lat: target.lat,
                    lon: target.lon,
                    alreadyDestroyed: destroyedTargetIds.has(targetId),
                    skipDestroy
                });
                
                // Always create explosion
                createExplosion({ lat: target.lat, lon: target.lon });
                
                if (!skipDestroy && !destroyedTargetIds.has(targetId)) {
                    destroyTarget({ 
                        lat: target.lat, 
                        lon: target.lon, 
                        id: targetId,
                        name: target.name,
                        country: target.country
                    });
                    addBattleActivity(target);
                } else {
                    console.log(`  ℹ️ Target not destroyed (skipDestroy: ${skipDestroy}, already destroyed: ${destroyedTargetIds.has(targetId)})`);
                }
            }
        }
    };
    
    requestAnimationFrame(animate);
}

function updateCooldownTimer() {
    const remaining = Math.max(0, attackCooldownEndTime - Date.now());
    const seconds = Math.ceil(remaining / 1000);
    const timerEl = document.getElementById('cooldownTimer');
    if (timerEl) {
        timerEl.textContent = seconds + 's';
    }
}

function endAttackCooldown() {
    attackCooldownActive = false;
    attackCooldownEndTime = null;
    
    if (attackCooldownInterval) {
        clearInterval(attackCooldownInterval);
        attackCooldownInterval = null;
    }
    
    // Do not cancel or remove trajectories; allow all to finish
    
    const cooldownEl = document.getElementById('battleCooldown');
    const pulseBtn = document.getElementById('pulseBtn');
    const battleToggle = document.getElementById('battleToggle');
    
    // SHOW Deploy button, HIDE Cooldown div
    if (cooldownEl) {
        cooldownEl.style.display = 'none';
    }
    if (pulseBtn) {
        pulseBtn.style.display = 'flex';
        pulseBtn.disabled = false;
    }
    if (battleToggle) {
        battleToggle.disabled = false;
    }
    
    console.log('✅ Attack cooldown ended');
}

function enrichBattleTargetAddress(target) {
    if (!battleTargetCoordsEl || !target) return;
    const cacheKey = getLocationKey(target.lat, target.lon);
    if (locationCache.has(cacheKey)) {
        const cached = locationCache.get(cacheKey);
        battleTargetCoordsEl.textContent = formatTargetCoordsLabel(target, cached);
        return;
    }

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${target.lat}&lon=${target.lon}&zoom=18&addressdetails=1`;
    fetch(url, {
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            const locationLabel = formatLocationLabel(data);
            if (locationLabel) {
                locationCache.set(cacheKey, locationLabel);
            }
            battleTargetCoordsEl.textContent = formatTargetCoordsLabel(target, locationLabel);
        })
        .catch(err => console.log('Could not get target address:', err));
}

function formatTargetCoordsLabel(target, locationLabel) {
    const coords = `${target.lat.toFixed(2)}°, ${target.lon.toFixed(2)}°`;
    const locationKey = getLocationKey(target.lat, target.lon);
    const targetCount = countUndestroyedAtLocation(locationKey);
    const countText = formatTargetCount(targetCount);
    if (locationLabel) {
        return `${coords} • ${locationLabel}${countText}`;
    }
    return `${coords}${countText}`;
}

function formatTargetCount(count) {
    if (!Number.isFinite(count)) return '';
    const label = count === 1 ? 'target' : 'targets';
    return ` • ${count} ${label} here`;
}

function getLocationKey(lat, lon) {
    if (typeof lat !== 'number' || typeof lon !== 'number') return '';
    return `${lat.toFixed(LOCATION_KEY_PRECISION)},${lon.toFixed(LOCATION_KEY_PRECISION)}`;
}

function getTimestampMs(entry) {
    if (!entry) return null;
    if (typeof entry.timestamp === 'number') return entry.timestamp;
    if (entry.timestamp instanceof Date) return entry.timestamp.getTime();
    if (typeof entry.timestamp === 'string') {
        const parsed = Date.parse(entry.timestamp);
        if (!Number.isNaN(parsed)) return parsed;
    }
    if (typeof entry.timestampISO === 'string') {
        const parsed = Date.parse(entry.timestampISO);
        if (!Number.isNaN(parsed)) return parsed;
    }
    return null;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    // Haversine formula for great-circle distance
    const R = 6371; // Earth radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function calculateBearing(from, to) {
    // Calculate bearing angle from 'from' point to 'to' point
    // Returns angle in degrees (0 = North, 90 = East, 180 = South, 270 = West)
    const lat1 = from.lat * Math.PI / 180;
    const lat2 = to.lat * Math.PI / 180;
    const dLon = (to.lon - from.lon) * Math.PI / 180;
    
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - 
              Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    
    let bearing = Math.atan2(y, x) * 180 / Math.PI;
    // Normalize to 0-360 and adjust for map coordinate system (0 = right/east)
    bearing = (bearing + 90 + 360) % 360;
    return bearing;
}

function countUndestroyedAtLocation(locationKey) {
    if (!locationKey) return 0;
    const hasUndestroyed = pulseHistory.some(pulse => {
        if (pulse.lat === null || pulse.lon === null || pulse.lat === undefined || pulse.lon === undefined) return false;
        const key = getLocationKey(pulse.lat, pulse.lon);
        if (key !== locationKey) return false;
        return !destroyedTargetIds.has(`PULSE_${locationKey}`);
    });
    return hasUndestroyed ? 1 : 0;
}

function highlightBattleTarget(target) {
    if (!map || !target) return;
    if (targetHalo) {
        map.removeLayer(targetHalo);
    }
    targetHalo = L.circle([target.lat, target.lon], {
        radius: 220000,
        color: '#38BDF8',
        weight: 2,
        fillColor: '#38BDF8',
        fillOpacity: 0.1,
        interactive: false
    }).addTo(map);
}

function launchBattleStrike(start, target) {
    if (!map || !target) return;

    const points = createArcPoints(start, { lat: target.lat, lon: target.lon });
    const polyline = L.polyline(points, {
        color: '#38BDF8',
        weight: 2,
        opacity: 0.8,
        dashArray: '6 10'
    }).addTo(map);

    const projectile = L.circleMarker([start.lat, start.lon], {
        radius: 5,
        color: '#38BDF8',
        fillColor: '#38BDF8',
        fillOpacity: 1
    }).addTo(map);

    const duration = 1200;
    const startTime = performance.now();

    const animate = (now) => {
        const t = Math.min((now - startTime) / duration, 1);
        const idx = Math.floor(t * (points.length - 1));
        const point = points[idx];
        projectile.setLatLng(point);
        polyline.setStyle({ dashOffset: -t * 60 });

        if (t < 1) {
            requestAnimationFrame(animate);
        } else {
            map.removeLayer(projectile);
            map.removeLayer(polyline);
            createExplosion({ lat: target.lat, lon: target.lon });
            destroyTarget(target);
            addBattleActivity(target);
        }
    };

    requestAnimationFrame(animate);
}

function createArcPoints(start, end, steps = 48) {
    const points = [];
    const dx = end.lon - start.lon;
    const dy = end.lat - start.lat;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const arcHeight = Math.min(18, Math.max(6, distance * 0.35));

    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const lat = start.lat + dy * t + Math.sin(Math.PI * t) * arcHeight;
        const lon = start.lon + dx * t + Math.sin(Math.PI * t) * arcHeight * 0.2;
        points.push([lat, lon]);
    }
    return points;
}

function createRocketIcon(angle) {
    // Convert geographic bearing (0° = North) to CSS rotation (0° = East)
    const cssAngle = angle + 90;
    
    return L.divIcon({
        className: 'rocket-icon',
        html: `
            <div style="width: 16px; height: 16px; transform: rotate(${cssAngle}deg) translateZ(0); transform-origin: 50% 50%; will-change: transform;">
                <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                    <!-- Simple arrow pointing right -->
                    <path d="M 2 8 L 12 8 L 14 5 L 12 8 L 14 11 Z" fill="#EF4444" stroke="#DC2626" stroke-width="1.5" stroke-linejoin="round"/>
                </svg>
            </div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
    });
}

function createRocketMarker(fromLat, fromLon, toLat, toLon) {
    // Calculate initial heading from trajectory direction
    const dLat = toLat - fromLat;
    const dLon = toLon - fromLon;
    // Calculate geographic bearing (0° = North)
    const geoAngle = Math.atan2(dLon, dLat) * 180 / Math.PI;
    // createRocketIcon will convert to CSS rotation internally
    
    return L.marker([fromLat, fromLon], {
        icon: createRocketIcon(geoAngle),
        interactive: false
    });
}

function updateRocketHeading(rocketMarker, fromPoint, toPoint) {
    if (!rocketMarker || !fromPoint || !toPoint) return;
    const dLat = toPoint[0] - fromPoint[0];
    const dLon = toPoint[1] - fromPoint[1];
    // Calculate geographic bearing (0° = North)
    const geoAngle = Math.atan2(dLon, dLat) * 180 / Math.PI;
    // createRocketIcon will convert to CSS rotation internally
    rocketMarker.setIcon(createRocketIcon(geoAngle));
}

function createExplosion(coords) {
    if (!map) return;
    
    // Create expanding explosion circle
    const circle = L.circle([coords.lat, coords.lon], {
        radius: 50000,
        color: '#FF0000',
        weight: 3,
        opacity: 1,
        fillColor: '#FF6600',
        fillOpacity: 0.6,
        interactive: false
    }).addTo(map);
    
    // Create secondary expanding rings
    const ring2 = L.circle([coords.lat, coords.lon], {
        radius: 30000,
        color: '#FFD700',
        weight: 2,
        opacity: 0.8,
        fillColor: '#FFD700',
        fillOpacity: 0.3,
        interactive: false
    }).addTo(map);

    const duration = 800;
    const startTime = performance.now();
    
    const animate = (now) => {
        const t = Math.min((now - startTime) / duration, 1);
        
        // Main explosion ring expands and fades
        circle.setRadius(50000 + t * 150000);
        circle.setStyle({ 
            opacity: 1 - t * 1, 
            fillOpacity: 0.6 - t * 0.6,
            weight: 3 - t * 2
        });
        
        // Secondary ring
        ring2.setRadius(30000 + t * 120000);
        ring2.setStyle({ 
            opacity: 0.8 - t * 0.8, 
            fillOpacity: 0.3 - t * 0.3,
            weight: 2 - t * 1.5
        });
        
        if (t < 1) {
            requestAnimationFrame(animate);
        } else {
            if (map && map.hasLayer(circle)) map.removeLayer(circle);
            if (map && map.hasLayer(ring2)) map.removeLayer(ring2);
        }
    };
    requestAnimationFrame(animate);
}

function destroyTarget(target) {
    if (!target || !target.id) return;
    if (destroyedTargetIds.has(target.id)) return;

    destroyedTargetIds.add(target.id);
    const marker = markers[target.id];
    if (marker && map && map.hasLayer(marker)) {
        map.removeLayer(marker);
    }
    delete markers[target.id];

    const locationKey = target.id.startsWith('PULSE_')
        ? target.id.substring(6)
        : getLocationKey(target.lat, target.lon);

    if (socket && locationKey) {
        socket.emit('destroyTarget', {
            locationKey,
            lat: target.lat,
            lon: target.lon
        });
    }

    clearBattleTarget();
    updateGlobalStats();
    updateBattleStats();
}

function addBattleActivity(target) {
    if (!recentActivityEl || !target) return;

    const time = new Date();
    const targetName = target.name || 'Unknown target';
    const locationKey = getLocationKey(target.lat, target.lon);
    const activity = {
        type: 'battle',
        timestamp: time.toISOString(),
        targetName,
        locationLabel: '',
        title: 'Battle Pulse'
    };

    activityHistory.push(activity);
    saveActivityHistory();

    const item = renderActivityItem(activity);
    insertActivityItem(item, true);

    if (typeof target.lat === 'number' && typeof target.lon === 'number') {
        enrichBattleLocation(activity, target.lat, target.lon, time.getTime(), locationKey);
    }
}

function renderActivityItem(activity) {
    const time = new Date(activity.timestamp);
    const timeStr = time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    const relativeTime = getRelativeTime(time);

    const item = document.createElement('div');
    item.className = 'activity-item';
    item.dataset.timestamp = time.getTime();

    if (activity.type === 'battle') {
        item.classList.add('activity-item-battle');
        const message = buildBattleMessage(activity);
        const isBotAction = activity.title?.includes('🤖') || activity.title?.includes('Bot') || message?.includes('🤖');
        const actionIcon = isBotAction ? '🤖' : '👤';
        item.innerHTML = `
            <div class="activity-left">
                <span class="activity-country">${actionIcon} ${activity.title || 'Battle'}</span>
                <div class="activity-details">${message}</div>
                <div class="activity-time">${timeStr}</div>
            </div>
            <div class="activity-right">
                <div class="activity-flag">🎯</div>
                <div class="activity-relative-time">${relativeTime}</div>
            </div>
        `;
        return item;
    }

    const countryName = activity.countryName || (countryCoordinates[activity.country] && countryCoordinates[activity.country].name) || activity.country;
    const coords = activity.coords || (activity.lat && activity.lon ? `${activity.lat.toFixed(2)}°, ${activity.lon.toFixed(2)}°` : 'Unknown location');
    const flag = getCountryFlag(activity.country);
    const sourceIcon = activity.source === 'auto' || activity.title?.includes('🤖') ? '🤖' : '👤';

    item.innerHTML = `
        <div class="activity-left">
            <span class="activity-country">${sourceIcon} 💫 ${countryName}</span>
            <div class="activity-details">${coords}</div>
            <div class="activity-time">${timeStr}</div>
        </div>
        <div class="activity-right">
            <div class="activity-flag">${flag}</div>
            <div class="activity-relative-time">${relativeTime}</div>
        </div>
    `;
    return item;
}

function buildBattleMessage(activity) {
    if (activity.message && !activity.targetName && !activity.locationLabel) {
        return activity.message;
    }
    const targetName = activity.targetName || 'the target';
    const locationLabel = activity.locationLabel || '';
    const suffix = locationLabel ? ` — ${locationLabel}` : '';
    return `⚔️ You destroyed ${targetName}${suffix}`;
}

function enrichBattleLocation(activity, lat, lon, timestampMs, locationKey) {
    const cacheKey = getLocationKey(lat, lon);
    if (locationCache.has(cacheKey)) {
        const cached = locationCache.get(cacheKey);
        updateBattleActivityLocation(activity, cached, timestampMs);
        return;
    }

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
    fetch(url, {
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            const locationLabel = formatLocationLabel(data);
            locationCache.set(cacheKey, locationLabel);
            updateBattleActivityLocation(activity, locationLabel, timestampMs);
        })
        .catch(err => console.log('Could not get target address:', err));
}

function formatLocationLabel(data) {
    if (!data || !data.address) return '';
    const addr = data.address;
    const city = addr.city || addr.town || addr.village || addr.suburb || addr.county || '';
    const road = addr.road || addr.pedestrian || addr.footway || addr.cycleway || '';
    const house = addr.house_number || '';
    const neighbourhood = addr.neighbourhood || '';

    const addressParts = [];
    if (road) addressParts.push(road);
    if (house) addressParts.push(house);
    if (!road && neighbourhood) addressParts.push(neighbourhood);

    const addressLine = addressParts.join(' ');
    if (city && addressLine) return `${city}, ${addressLine}`;
    if (city) return city;
    if (addressLine) return addressLine;
    return data.display_name || '';
}

function updateBattleActivityLocation(activity, locationLabel, timestampMs) {
    if (!locationLabel) return;
    activity.locationLabel = locationLabel;
    saveActivityHistory();

    if (!recentActivityEl) return;
    const existing = recentActivityEl.querySelector(`[data-timestamp="${timestampMs}"]`);
    if (!existing) return;

    const refreshed = renderActivityItem(activity);
    refreshed.dataset.timestamp = existing.dataset.timestamp;
    existing.replaceWith(refreshed);
}

function formatRemainingText(count) {
    return '';
}

function normalizeCoords(lat, lon) {
    const latNum = typeof lat === 'number' ? lat : (typeof lat === 'string' ? parseFloat(lat) : NaN);
    const lonNum = typeof lon === 'number' ? lon : (typeof lon === 'string' ? parseFloat(lon) : NaN);
    return {
        lat: Number.isFinite(latNum) ? latNum : null,
        lon: Number.isFinite(lonNum) ? lonNum : null
    };
}

function insertActivityItem(item, addToTop = false) {
    if (!recentActivityEl || !item) return;
    const loading = recentActivityEl.querySelector('.loading');
    if (loading) loading.remove();

    if (addToTop && recentActivityEl.firstElementChild) {
        recentActivityEl.insertBefore(item, recentActivityEl.firstElementChild);
    } else {
        recentActivityEl.appendChild(item);
    }
    trimActivityList();
}

function trimActivityList() {
    if (!recentActivityEl) return;
    while (recentActivityEl.children.length > MAX_ACTIVITY_ITEMS) {
        recentActivityEl.removeChild(recentActivityEl.lastChild);
    }
}

function addActivity(country, data) {
    console.log('📝 Adding activity:', country, data);
    
    if (!recentActivityEl) {
        console.error('❌ recentActivityEl not found!');
        return;
    }
    
    const time = new Date();
    const safeCountry = country || 'Unknown';
    const { lat, lon } = normalizeCoords(data?.lat, data?.lon);
    const countryName = (countryCoordinates[safeCountry] && countryCoordinates[safeCountry].name) || safeCountry;
    const coords = Number.isFinite(lat) && Number.isFinite(lon) ? `${lat.toFixed(2)}°, ${lon.toFixed(2)}°` : 'Unknown location';
    
    console.log('Creating activity item for:', countryName, coords);
    
    // Create activity object for history
    const activity = {
        country: safeCountry,
        timestamp: time.toISOString(),
        lat: lat,
        lon: lon,
        countryName: countryName,
        coords: coords,
        source: data?.source || 'client'  // Track if from client or auto
    };
    
    // Add to history
    activityHistory.push(activity);
    saveActivityHistory();
    
    const item = renderActivityItem(activity);
    insertActivityItem(item, true);
}

function addActivityFromServer(activity) {
    if (!recentActivityEl) return;

    const activityTimestamp = new Date(activity.timestamp).getTime();
    const existing = recentActivityEl.querySelector(`[data-timestamp="${activityTimestamp}"]`);
    if (existing) return;
    
    const time = new Date(activity.timestamp);
    const safeCountry = activity.country || 'Unknown';
    const { lat, lon } = normalizeCoords(activity.lat, activity.lon);
    const countryName = (countryCoordinates[safeCountry] && countryCoordinates[safeCountry].name) || safeCountry;
    const coords = Number.isFinite(lat) && Number.isFinite(lon) ? `${lat.toFixed(2)}°, ${lon.toFixed(2)}°` : 'Unknown location';
    
    // Add to history
    if (!activityHistory.find(a => a.timestamp === activity.timestamp)) {
        activityHistory.push(activity);
        saveActivityHistory();
    }
    
    const item = renderActivityItem({
        ...activity,
        country: safeCountry,
        lat,
        lon,
        countryName,
        coords
    });
    item.dataset.timestamp = activityTimestamp;
    insertActivityItem(item, false);
}

// Display activity from history without adding to history again
function addActivityToUI(activity) {
    if (!recentActivityEl) return;
    const safeCountry = activity.country || 'Unknown';
    const { lat, lon } = normalizeCoords(activity.lat, activity.lon);
    const countryName = activity.countryName || (countryCoordinates[safeCountry] && countryCoordinates[safeCountry].name) || safeCountry;
    const coords = activity.coords || (Number.isFinite(lat) && Number.isFinite(lon) ? `${lat.toFixed(2)}°, ${lon.toFixed(2)}°` : 'Unknown location');

    const item = renderActivityItem({
        ...activity,
        country: safeCountry,
        lat,
        lon,
        countryName,
        coords
    });
    insertActivityItem(item, false);
}

// ============ Helper Functions ============
function getCountryFlag(countryCode) {
    // Return HTML img tag with flag image from flagcdn.com
    if (!countryCode || countryCode === 'Unknown') {
        return '🏳️';
    }
    const code = countryCode.toLowerCase();
    return `<img src="https://flagcdn.com/24x18/${code}.png" alt="${countryCode}" style="vertical-align: middle; margin-right: 6px;" />`;
}

function getRelativeTime(date) {
    const now = Date.now();
    const diff = now - date.getTime();
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 10) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

// Update relative times every 10 seconds
setInterval(() => {
    const items = document.querySelectorAll('.activity-item');
    items.forEach(item => {
        const timestamp = parseInt(item.dataset.timestamp);
        if (timestamp) {
            const relativeTimeEl = item.querySelector('.activity-relative-time');
            if (relativeTimeEl) {
                relativeTimeEl.textContent = getRelativeTime(new Date(timestamp));
            }
        }
    });
}, 10000);

// ============ Countries Modal ============

function setupCountriesModal() {
    const showAllBtn = document.getElementById('showAllCountries');
    const modal = document.getElementById('countriesModal');
    const closeBtn = document.getElementById('closeModal');
    const listEl = document.getElementById('allCountriesList');
    
    if (!showAllBtn || !modal || !closeBtn || !listEl) return;
    
    showAllBtn.addEventListener('click', (e) => {
        e.preventDefault();
        currentModalPeriod = 'all';
        showAllCountriesModal('all');
    });
    
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // Setup period buttons in modal
    const periodBtns = document.querySelectorAll('.modal-period-btn');
    periodBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            periodBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const period = btn.dataset.period;
            currentModalPeriod = period;
            showAllCountriesModal(period);
        });
    });
}

function showAllCountriesModal(period = 'all') {
    const modal = document.getElementById('countriesModal');
    const listEl = document.getElementById('allCountriesList');
    
    if (!modal || !listEl) return;

    if (!socket) {
        listEl.innerHTML = '<p class="loading">Server connection unavailable</p>';
        modal.classList.add('active');
        return;
    }
    
    // Request period data from server
    socket.emit('getPeriodData', period);
    
    // Listen for period data response (one-time only)
    socket.once('pulsesByPeriod', (data) => {
        const sorted = Object.entries(data.countries)
            .filter(([country]) => country !== 'Unknown')
            .sort((a, b) => b[1] - a[1]);
        
        if (sorted.length === 0) {
            listEl.innerHTML = '<p class="loading">No data available for this period</p>';
            modal.classList.add('active');
            return;
        }
        
        // Calculate totals
        const totalPulses = data.global || sorted.reduce((sum, [, count]) => sum + count, 0);
        const totalCountries = sorted.length;
        const avgPerCountry = Math.round(totalPulses / totalCountries);
        const topCountry = sorted[0];
        
        // Update overview stats
        document.getElementById('totalPulses').textContent = totalPulses.toLocaleString();
        document.getElementById('totalCountries').textContent = totalCountries;
        document.getElementById('avgPerCountry').textContent = avgPerCountry;
        document.getElementById('topCountryName').textContent = (countryCoordinates[topCountry[0]] && countryCoordinates[topCountry[0]].name) || topCountry[0];
        
        // Create chart with all countries
        const chartBars = document.getElementById('chartBars');
        const maxCount = sorted[0][1];
        
        chartBars.innerHTML = sorted.map(([country, count]) => {
            const percentage = ((count / totalPulses) * 100).toFixed(1);
            const barWidth = (count / maxCount) * 100;
            const flagImg = getCountryFlag(country);
            const countryName = (countryCoordinates[country] && countryCoordinates[country].name) || country;
            
            return `
                <div class="chart-bar">
                    <div class="chart-flag">${flagImg}</div>
                    <div class="chart-info">
                        <div class="chart-country">${countryName}</div>
                        <div class="chart-bar-bg">
                            <div class="chart-bar-fill" style="width: ${barWidth}%">
                                ${count}
                            </div>
                        </div>
                        <div class="chart-percentage">${percentage}%</div>
                    </div>
                </div>
            `;
        }).join('');
        
        // Populate all countries list
        listEl.innerHTML = sorted.map(([country, count]) => {
            const flagImg = getCountryFlag(country);
            const percentage = ((count / totalPulses) * 100).toFixed(1);
            return `
                <div class="country-item">
                    <span class="country-name">${flagImg}${(countryCoordinates[country] && countryCoordinates[country].name) || country}</span>
                    <span class="country-count">${count} (${percentage}%)</span>
                </div>
            `;
        }).join('');
        
        modal.classList.add('active');
    });
}

// ============ ECG + Connection Widgets ============
function triggerEcgBeat() {
    const ecg = document.getElementById('ecgMonitor');
    if (!ecg) return;
    ecg.classList.remove('active');
    void ecg.offsetWidth;
    ecg.classList.add('active');
}

function updateConnectionWidgets(state) {
    const statusTextEl = document.getElementById('connectionStatusText');
    const strengthEl = document.getElementById('connectionStrength');
    if (!statusTextEl || !strengthEl) return;

    if (state === 'connected') {
        statusTextEl.textContent = 'Connected';
        strengthEl.style.width = '90%';
    } else if (state === 'disconnected') {
        statusTextEl.textContent = 'Reconnecting';
        strengthEl.style.width = '35%';
    } else {
        statusTextEl.textContent = 'Connecting';
        strengthEl.style.width = '50%';
    }
}

// ============ Local Time Widget ============
function startLocalTime() {
    console.log('⏰ Starting local time...');
    const timeEl = document.getElementById('localTime');
    if (!timeEl) {
        console.error('❌ localTime element not found');
        return;
    }

    const update = () => {
        const now = new Date();
        timeEl.textContent = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    update();
    setInterval(update, 1000);
    console.log('✅ Local time started');
}

// ============ Map Pulse Animation ============
function animatePulseOnMap(coords) {
    if (!map) return;

    const center = coords && coords.lat && coords.lon
        ? [coords.lat, coords.lon]
        : map.getCenter();

    const baseRadius = 600000;
    const circle = L.circle(center, {
        radius: baseRadius,
        color: '#FF1744',
        weight: 2,
        opacity: 0.9,
        fillColor: '#FF1744',
        fillOpacity: 0.25,
        interactive: false
    }).addTo(map);

    const duration = 900;
    const shrinkDuration = 400;
    const start = performance.now();

    const animate = (now) => {
        const elapsed = now - start;

        if (elapsed <= duration) {
            const t = elapsed / duration;
            const radius = baseRadius * (1 + t * 0.6);
            circle.setRadius(radius);
            circle.setStyle({ opacity: 0.9 - t * 0.6, fillOpacity: 0.25 - t * 0.2 });
            requestAnimationFrame(animate);
            return;
        }

        const shrinkStart = start + duration;
        const shrinkElapsed = now - shrinkStart;
        const t = Math.min(shrinkElapsed / shrinkDuration, 1);
        const radius = baseRadius * (1 - t);
        circle.setRadius(Math.max(radius, 0.2));
        circle.setStyle({ opacity: 0.25 - t * 0.25, fillOpacity: 0.08 - t * 0.08 });

        if (t < 1) {
            requestAnimationFrame(animate);
        } else {
            map.removeLayer(circle);
        }
    };

    requestAnimationFrame(animate);
}

// ============ Scoring System ============
function calculateTargetPoints(targetAge, attackCost = 0) {
    // NEW REWARD FORMULA:
    // Base points: attack cost * 3 (риск/награда баланс)
    // Age multiplier: +1 point per minute up to 60 minutes
    const basePoints = attackCost * 3;
    const ageInMinutes = Math.floor(targetAge / 60000); // Convert ms to minutes
    const ageBonus = Math.min(ageInMinutes, 60); // Cap at 60 bonus points
    return Math.max(basePoints + ageBonus, 5); // Minimum 5 points за безплатни атаки
}

function addScore(points, country) {
    console.log('💯 addScore called:', { points, country, currentUser: currentUser?.name, personalScore });
    
    personalScore += points;
    
    // Add to country score
    if (country && country !== 'Unknown') {
        countryScores[country] = (countryScores[country] || 0) + points;
        saveCountryScores();
    }
    
    // Save to localStorage immediately
    localStorage.setItem('gpPersonalScore', personalScore.toString());
    
    console.log('💯 New personalScore:', personalScore);
    updateScoreDisplay();
    
    // Broadcast score update to all clients in real-time
    if (socket && currentUser) {
        console.log('💯 Emitting userScoreUpdate:', {
            userId: currentUser.id,
            score: personalScore,
            userName: currentUser.name
        });
        socket.emit('userScoreUpdate', {
            userId: currentUser.id,
            score: personalScore,
            userName: currentUser.name,
            avatar: currentUser.avatar,
            country: currentUser.country,
            provider: currentUser.provider
        });
    }
    
    // Save to server if not guest
    saveUserDataToServer();
}

function updateScoreDisplay() {
    const scoreEl = document.getElementById('personalScore');
    if (scoreEl) {
        scoreEl.textContent = personalScore.toLocaleString();
        console.log('💯 Display updated - personalScore:', personalScore, 'Element:', scoreEl);
    } else {
        console.log('퉪️ personalScore element not found!');
    }
    
    // Update user profile widget with country score
    if (currentUser && currentUser.country) {
        const countryScoreEl = document.getElementById('userCountryScore');
        if (countryScoreEl) {
            const countryScore = countryScores[currentUser.country] || 0;
            const flag = getCountryFlag(currentUser.country);
            countryScoreEl.innerHTML = `${flag} ${countryScore.toLocaleString()} pts`;
        }
    }
    
    updateCountryLeaderboard();
}

function saveCountryScores() {
    localStorage.setItem('gpCountryScores', JSON.stringify(countryScores));
}

function loadCountryScores() {
    const stored = localStorage.getItem('gpCountryScores');
    if (stored) {
        try {
            countryScores = JSON.parse(stored);
        } catch (e) {
            console.warn('Could not load country scores:', e);
        }
    }
}

function updateCountryLeaderboard() {
    const leaderboardEl = document.getElementById('countryLeaderboard');
    if (!leaderboardEl) return;
    
    const sorted = Object.entries(countryScores)
        .filter(([country, score]) => score > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    if (sorted.length === 0) {
        leaderboardEl.innerHTML = '<p class="loading">No scores yet...</p>';
        return;
    }
    
    leaderboardEl.innerHTML = sorted.map(([country, score], index) => {
        const flag = getCountryFlag(country);
        const countryName = (countryCoordinates[country] && countryCoordinates[country].name) || country;
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        
        return `
            <div class="country-item" style="background: ${index < 3 ? 'rgba(255, 215, 0, 0.1)' : 'var(--bg-tertiary)'}">
                <div class="country-name">
                    <span style="width: 24px; display: inline-block;">${medal}</span>
                    ${flag}
                    <span>${countryName}</span>
                </div>
                <div class="country-count">💯 ${score.toLocaleString()}</div>
            </div>
        `;
    }).join('');
}

function updateUserLeaderboard(players) {
    const leaderboardEl = document.getElementById('userLeaderboard');
    if (!leaderboardEl) return;
    
    if (!players || players.length === 0) {
        leaderboardEl.innerHTML = '<p class="loading">No players yet...</p>';
        return;
    }
    
    leaderboardEl.innerHTML = players.map((player, index) => {
        const flag = getCountryFlag(player.country);
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        const isCurrentUser = currentUser && currentUser.id === player.id;
        
        return `
            <div class="country-item" style="background: ${isCurrentUser ? 'rgba(139, 92, 246, 0.2)' : index < 3 ? 'rgba(255, 215, 0, 0.1)' : 'var(--bg-tertiary)'}; border: ${isCurrentUser ? '1px solid var(--primary)' : '1px solid var(--border)'}">
                <div class="country-name" style="gap: 0.5rem;">
                    <span style="width: 24px; display: inline-block; font-weight: bold;">${medal}</span>
                    ${player.avatar ? `<img src="${player.avatar}" alt="${player.name}" style="width: 24px; height: 24px; border-radius: 50%;">` : '👤'}
                    <span style="font-weight: ${isCurrentUser ? 'bold' : 'normal'}; color: ${isCurrentUser ? 'var(--primary-light)' : 'var(--text-primary)'}">${player.name}</span>
                    ${flag}
                </div>
            </div>
        `;
    }).join('');
}

function updateCountryLeaderboard() {
    const leaderboardEl = document.getElementById('countryLeaderboard');
    if (!leaderboardEl) return;
    
    // Sort countries by score
    const sortedCountries = Object.entries(countryScores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    if (sortedCountries.length === 0) {
        leaderboardEl.innerHTML = '<p class="loading">No scores yet</p>';
        return;
    }
    
    leaderboardEl.innerHTML = sortedCountries.map(([country, score], index) => {
        const flag = getCountryFlag(country);
        const countryName = (countryCoordinates[country] && countryCoordinates[country].name) || country;
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        const isUserCountry = currentUser && currentUser.country === country;
        const displayScore = (score || 0).toLocaleString();
        
        return `
            <div style="display: flex; align-items: center; gap: 8px; padding: 8px; background: ${isUserCountry ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(99, 102, 241, 0.15))' : 'var(--bg-tertiary)'}; border-radius: 6px; border: 1px solid ${isUserCountry ? 'var(--primary)' : 'var(--border)'};">
                <div style="font-size: 1.2rem; min-width: 30px;">${medal}</div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; font-size: 0.85rem;">${flag} ${countryName}</div>
                </div>
                <div style="font-weight: 700; font-size: 0.9rem; color: var(--primary);">${displayScore}</div>
            </div>
        `;
    }).join('');
}

// ============ Target Info Panel ============
function setupTargetInfoPanel() {
    const closeBtn = document.getElementById('closeTargetInfo');
    if (closeBtn) {
        closeBtn.addEventListener('click', hideTargetInfo);
    }
}

function showTargetInfo(target) {
    const panel = document.getElementById('targetInfoPanel');
    if (!panel) return;
    
    const countryEl = document.getElementById('targetInfoCountry');
    const ageEl = document.getElementById('targetInfoAge');
    const pointsEl = document.getElementById('targetInfoPoints');
    
    if (countryEl) {
        const flag = getCountryFlag(target.country);
        const countryName = (countryCoordinates[target.country] && countryCoordinates[target.country].name) || target.country;
        countryEl.innerHTML = `${flag} ${countryName}`;
    }
    
    const targetTimestamp = getTimestampMs(target);

    if (ageEl && targetTimestamp) {
        const age = Date.now() - targetTimestamp;
        const minutes = Math.floor(age / 60000);
        const seconds = Math.floor((age % 60000) / 1000);
        ageEl.textContent = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    }
    
    if (pointsEl && targetTimestamp) {
        const age = Date.now() - targetTimestamp;
        const points = calculateTargetPoints(age);
        pointsEl.textContent = points;
    }
    
    panel.style.display = 'block';
}

function hideTargetInfo() {
    const panel = document.getElementById('targetInfoPanel');
    if (panel) {
        panel.style.display = 'none';
    }
}

// ============ Login System ============
function setupLoginSystem() {
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeModal = document.getElementById('closeLoginModal');
    const oauthBtns = document.querySelectorAll('.oauth-btn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (loginModal) {
                loginModal.classList.add('active');
                loginModal.style.display = 'flex';
                // Force reflow for animation
                setTimeout(() => loginModal.style.opacity = '1', 10);
            }
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            closeLoginModal();
        });
    }
    
    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                closeLoginModal();
            }
        });
    }
    
    oauthBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const provider = btn.getAttribute('data-provider');
            handleOAuthLogin(provider);
        });
    });
}

function handleOAuthLogin(provider) {
    if (provider === 'guest') {
        // Guest mode - view only, no gameplay
        const guestNumber = Math.floor(Math.random() * 9999);
        currentUser = {
            provider: 'guest',
            id: `guest_${Date.now()}`,
            name: `Guest${guestNumber}`,
            avatar: null,
            country: userCountry || 'Unknown',
            isViewOnly: true
        };
        saveUser();
        updateUserProfile();
        closeLoginModal();
        showCelebration('👁️ Guest mode: View only. Login to play!', 'achievement');
        
        // Disable pulse button for guests
        if (pulseBtn) {
            pulseBtn.title = 'Login required to play';
        }
        return;
    }
    
    // Demo OAuth login (for local testing without real OAuth setup)
    // In production, replace this with real OAuth flow
    showCelebration(`🔄 Logging in with ${provider}...`, 'achievement');
    
    // Simulate OAuth callback after short delay
    setTimeout(() => {
        const mockUsers = {
            google: {
                provider: 'google',
                id: `google_${Date.now()}`,
                name: 'Google User',
                avatar: 'https://ui-avatars.com/api/?name=Google+User&background=4285F4&color=fff'
            },
            facebook: {
                provider: 'facebook',
                id: `facebook_${Date.now()}`,
                name: 'Facebook User',
                avatar: 'https://ui-avatars.com/api/?name=Facebook+User&background=1877F2&color=fff'
            },
            github: {
                provider: 'github',
                id: `github_${Date.now()}`,
                name: 'GitHub User',
                avatar: 'https://ui-avatars.com/api/?name=GitHub+User&background=24292e&color=fff'
            }
        };
        
        const userData = mockUsers[provider] || mockUsers.google;
        
        currentUser = {
            ...userData,
            country: userCountry || 'Unknown',
            isViewOnly: false
        };
        
        // Load user data from server
        loadUserDataFromServer().then(() => {
            saveUser();
            updateUserProfile();
            closeLoginModal();
            showCelebration(`✅ Welcome back, ${userData.name}!`, 'achievement');
        });
    }, 1000);
}

// Load user data from server
async function loadUserDataFromServer() {
    if (!currentUser || currentUser.provider === 'guest') return;
    
    try {
        const response = await fetch(`/api/user/${currentUser.id}`);
        const data = await response.json();
        
        personalScore = data.personalScore || 0;
        
        console.log(`📥 Loaded user data: ${personalScore} points`);
        updateScoreDisplay();
    } catch (error) {
        console.error('Failed to load user data:', error);
    }
}

// Save user data to server
async function saveUserDataToServer() {
    if (!currentUser || currentUser.provider === 'guest') return;
    
    try {
        await fetch(`/api/user/${currentUser.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                provider: currentUser.provider,
                id: currentUser.id,
                name: currentUser.name,
                avatar: currentUser.avatar,
                country: currentUser.country,
                personalScore: personalScore
            })
        });
        console.log(`📤 Saved user data to server`);
    } catch (error) {
        console.error('Failed to save user data:', error);
    }
}

function saveUser() {
    if (currentUser) {
        localStorage.setItem('gpUser', JSON.stringify(currentUser));
        localStorage.setItem('gpPersonalScore', personalScore.toString());
    }
}

function loadUser() {
    console.log('👤 Loading user from localStorage...');
    const stored = localStorage.getItem('gpUser');
    if (stored) {
        try {
            currentUser = JSON.parse(stored);
            console.log('✅ User loaded:', currentUser.name, 'Provider:', currentUser.provider);
            const storedScore = localStorage.getItem('gpPersonalScore');
            if (storedScore) {
                personalScore = parseInt(storedScore) || 0;
                console.log('💎 Personal score loaded:', personalScore);
            }
            return true;
        } catch (e) {
            console.error('❌ Could not load user:', e);
        }
    } else {
        console.log('ℹ️ No user found in localStorage');
    }
    return false;
}

async function checkAutoLogin() {
    console.log('🔐 Checking auto-login...');
    try {
        loadCountryScores();
        
        if (loadUser()) {
            console.log('✅ Auto-login successful');
            updateUserProfile();
            updateScoreDisplay();
            
            // Load from server if not guest
            if (currentUser && currentUser.provider !== 'guest') {
                console.log('📥 Loading user data from server...');
                await loadUserDataFromServer();
            }
        } else {
            console.log('ℹ️ No auto-login (no saved user)');
        }
    } catch (error) {
        console.error('❌ Error in checkAutoLogin:', error);
    }
}

function updateUserProfile() {
    console.log('👤 Updating user profile UI...');
    const profileWidget = document.getElementById('userProfileWidget');
    const loginBtn = document.getElementById('loginBtn');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (!currentUser) {
        if (profileWidget) profileWidget.style.display = 'none';
        if (loginBtn) loginBtn.style.display = 'flex';
        if (logoutBtn) logoutBtn.style.display = 'none';
        return;
    }
    
    if (profileWidget) profileWidget.style.display = 'flex';
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'flex';
    
    if (userName) {
        userName.textContent = currentUser.name;
    }
    
    if (userAvatar && currentUser.avatar) {
        userAvatar.src = currentUser.avatar;
        userAvatar.style.display = 'block';
    }
    
    updateScoreDisplay();
}

function handleLogout() {
    if (confirm('👋 Are you sure you want to logout?')) {
        // Clear user data
        currentUser = null;
        personalScore = 0;
        localStorage.removeItem('gpUser');
        localStorage.removeItem('gpPersonalScore');
        
        // Update UI
        updateUserProfile();
        updateScoreDisplay();
        
        showCelebration('👋 Logged out successfully', 'achievement');
    }
}

function setupLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

function closeLoginModal() {
    console.log('🚪 Closing login modal...');
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.classList.remove('active');
            modal.style.display = 'none';
            console.log('✅ Login modal closed');
        }, 300);
    }
}

// ============ Settings Modal ============
function openSettingsModal() {
    const modal = document.getElementById('settingsModal');
    if (!modal) return;
    
    // Load current settings
    loadSettings();
    
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.classList.add('active');
    }, 10);
}

function closeSettingsModal() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.classList.remove('active');
            modal.style.display = 'none';
        }, 300);
    }
}

function loadSettings() {
    // Load sound setting
    const soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) soundToggle.checked = soundEnabled;
    
    // Load theme setting
    const theme = localStorage.getItem('theme') || 'dark';
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) themeSelect.value = theme;
    
    // Load notifications setting
    const notificationsEnabled = localStorage.getItem('notificationsEnabled') !== 'false';
    const notificationsToggle = document.getElementById('notificationsToggle');
    if (notificationsToggle) notificationsToggle.checked = notificationsEnabled;
    
    // Load performance setting
    const performanceMode = localStorage.getItem('performanceMode') === 'true';
    const performanceToggle = document.getElementById('performanceToggle');
    if (performanceToggle) performanceToggle.checked = performanceMode;
}

function saveSettings() {
    const soundToggle = document.getElementById('soundToggle');
    const themeSelect = document.getElementById('themeSelect');
    const notificationsToggle = document.getElementById('notificationsToggle');
    const performanceToggle = document.getElementById('performanceToggle');
    
    if (soundToggle) {
        localStorage.setItem('soundEnabled', soundToggle.checked);
        window.soundEnabled = soundToggle.checked;
    }
    
    if (themeSelect) {
        localStorage.setItem('theme', themeSelect.value);
        applyTheme(themeSelect.value);
    }
    
    if (notificationsToggle) {
        localStorage.setItem('notificationsEnabled', notificationsToggle.checked);
    }
    
    if (performanceToggle) {
        localStorage.setItem('performanceMode', performanceToggle.checked);
        applyPerformanceMode(performanceToggle.checked);
    }
}

function applyTheme(theme) {
    if (theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
}

function applyPerformanceMode(enabled) {
    if (enabled) {
        document.body.classList.add('performance-mode');
    } else {
        document.body.classList.remove('performance-mode');
    }
}

function resetData() {
    if (confirm('⚠️ This will delete all your local data, stats, and preferences. This cannot be undone. Are you sure?')) {
        if (confirm('🚨 FINAL WARNING: All your progress will be permanently lost. Continue?')) {
            localStorage.clear();
            sessionStorage.clear();
            showNotification('🗑️ Data Reset', 'All local data has been cleared. Reloading...', 'warning', 3000);
            setTimeout(() => {
                location.reload();
            }, 3000);
        }
    }
}

// ============ Help Modal ============
function openHelpModal() {
    const modal = document.getElementById('helpModal');
    if (!modal) return;
    
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.classList.add('active');
    }, 10);
}

function closeHelpModal() {
    const modal = document.getElementById('helpModal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.classList.remove('active');
            modal.style.display = 'none';
        }, 300);
    }
}

// ============ Setup Modal Event Listeners ============
function setupModals() {
    // Settings modal
    const settingsBtn = document.getElementById('settingsBtn');
    const soundToggle = document.getElementById('soundToggle');
    const themeSelect = document.getElementById('themeSelect');
    const notificationsToggle = document.getElementById('notificationsToggle');
    const performanceToggle = document.getElementById('performanceToggle');
    const resetDataBtn = document.getElementById('resetDataBtn');
    
    // Save settings on change
    if (soundToggle) soundToggle.addEventListener('change', saveSettings);
    if (themeSelect) themeSelect.addEventListener('change', saveSettings);
    if (notificationsToggle) notificationsToggle.addEventListener('change', saveSettings);
    if (performanceToggle) performanceToggle.addEventListener('change', saveSettings);
    if (resetDataBtn) resetDataBtn.addEventListener('click', resetData);
    
    // Close modals on outside click (if any modals exist)
    const modals = [document.getElementById('settingsModal'), document.getElementById('helpModal')].filter(m => m);
    modals.forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.opacity = '0';
                    setTimeout(() => {
                        modal.classList.remove('active');
                        modal.style.display = 'none';
                    }, 300);
                }
            });
        }
    });
}

// Call setupModals when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setupModals();
    loadSettings(); // Apply saved settings on load
});

// ============ Save before leaving ============
window.addEventListener('beforeunload', () => {
    saveSessionData();
    saveUser();
});

console.log('📄 Script fully loaded and ready');
