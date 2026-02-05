const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// In-memory storage
const pulseData = {
  global: 0,
  countries: {},
  pulseHistory: [] // Store all pulses with timestamps
};

// User data storage (in production, use a real database)
const userData = new Map(); // userId -> { provider, id, name, avatar, country, personalScore, achievements, history }

// Game state storage (per user session)
const gameState = new Map(); // socketId -> { userPulses, totalPulses, sessionStreak, dailyStreak, bestStreak, userCountry, userCoordinates, lastPulseTime, sessionStats }

// Player defense data (per socket connection)
const playerDefense = new Map(); // socketId -> { shield: 0, armor: 0, interceptor: 0 }

// Target limits and location handling
const MAX_ACTIVE_TARGETS = 10000;
const LOCATION_KEY_PRECISION = 4;
const activeLocationQueue = [];
const activeLocationSet = new Set();
const destroyedTargets = new Set();
const activeAttacks = []; // Track all ongoing attacks with timestamps

function getLocationKey(lat, lon) {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return '';
  return `${lat.toFixed(LOCATION_KEY_PRECISION)},${lon.toFixed(LOCATION_KEY_PRECISION)}`;
}

function removeLocation(locationKey, reason = 'trim') {
  if (!locationKey) return;

  // Remove from pulse history
  pulseData.pulseHistory = pulseData.pulseHistory.filter(entry => {
    const key = getLocationKey(entry.lat, entry.lon);
    return key !== locationKey;
  });

  // Remove from active targets
  activeLocationSet.delete(locationKey);
  const idx = activeLocationQueue.indexOf(locationKey);
  if (idx >= 0) activeLocationQueue.splice(idx, 1);

  if (reason !== 'destroyed') {
    destroyedTargets.delete(locationKey);
  }

  io.emit('targetRemoved', { locationKey, reason });
}

// No rate limiting - completely unlimited

// Enhanced geolocation with country boundary detection
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

  // If not within any country bounds, map to nearest country boundary (avoid Unknown display)
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

// Helper to get pulses by period
function getPulsesByPeriod(period) {
  const now = Date.now();
  let startTime = now; // Default to current moment
  
  switch(period) {
    case '1minute':
      startTime = now - (1 * 60 * 1000);
      break;
    case '1hour':
      startTime = now - (60 * 60 * 1000);
      break;
    case '24hours':
      startTime = now - (24 * 60 * 60 * 1000);
      break;
    case '1month':
      startTime = now - (30 * 24 * 60 * 60 * 1000);
      break;
    case 'all':
      startTime = 0; // No filter
      break;
  }
  
  const filtered = pulseData.pulseHistory.filter(entry => {
    return new Date(entry.timestamp).getTime() >= startTime;
  });
  
  // Aggregate by country
  const countries = {};
  let global = 0;
  filtered.forEach(entry => {
    if (!countries[entry.country]) {
      countries[entry.country] = 0;
    }
    countries[entry.country]++;
    global++;
  });
  
  return { countries, global, count: filtered.length, pulses: filtered };
}

// Get initial period data
function getInitialPeriodData(period = 'all') {
  const data = getPulsesByPeriod(period);
  return {
    countries: data.countries,
    global: data.global,
    period: period
  };
}

// Helper to increment country count
function incrementCountry(country) {
  if (!pulseData.countries[country]) {
    pulseData.countries[country] = 0;
  }
  pulseData.countries[country]++;
}

// GET route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// OAuth callback routes (placeholder for real OAuth implementation)
app.get('/auth/:provider/callback', (req, res) => {
  const provider = req.params.provider;
  console.log(`OAuth callback received for ${provider}`);
  
  // In production, you would:
  // 1. Exchange code for access token
  // 2. Fetch user profile from provider API
  // 3. Store user in database
  // 4. Send user data back to parent window
  
  // For now, send a placeholder response
  res.send(`
    <html>
    <head><title>Login Success</title></head>
    <body>
      <script>
        // Send user data to parent window
        if (window.opener) {
          window.opener.postMessage({
            provider: '${provider}',
            user: {
              id: 'oauth_${provider}_' + Date.now(),
              name: '${provider.charAt(0).toUpperCase() + provider.slice(1)} User',
              avatar: null
            }
          }, window.location.origin);
          window.close();
        } else {
          document.body.innerHTML = '<h2>Login successful! You can close this window.</h2>';
        }
      </script>
    </body>
    </html>
  `);
});

// Get user data
app.get('/api/user/:userId', (req, res) => {
  const userId = req.params.userId;
  const user = userData.get(userId);
  
  if (user) {
    console.log(`📊 Loading data for user: ${userId}`);
    res.json(user);
  } else {
    console.log(`👤 New user: ${userId}`);
    res.json({ personalScore: 0, achievements: [], history: [] });
  }
});

// Save user data
app.post('/api/user/:userId', (req, res) => {
  const userId = req.params.userId;
  const data = req.body;
  
  userData.set(userId, {
    ...data,
    lastUpdated: new Date().toISOString()
  });
  
  console.log(`💾 Saved data for user: ${userId}, score: ${data.personalScore}`);
  res.json({ success: true });
});

// ===== GAME STATE ENDPOINTS =====
// Save game state (called periodically by client)
app.post('/api/gamestate/save', (req, res) => {
  const socketId = req.body.socketId;
  const state = req.body.state;
  
  if (!socketId || !state) {
    return res.status(400).json({ error: 'Missing socketId or state' });
  }
  
  gameState.set(socketId, {
    ...state,
    lastSaved: Date.now()
  });
  
  console.log(`💾 Game state saved for session: ${socketId.substring(0, 8)}...`);
  res.json({ success: true });
});

// Load game state (called when page loads)
app.get('/api/gamestate/:socketId', (req, res) => {
  const socketId = req.params.socketId;
  const state = gameState.get(socketId);
  
  if (!state) {
    return res.json({ found: false });
  }
  
  console.log(`📂 Game state loaded for session: ${socketId.substring(0, 8)}...`);
  res.json({ found: true, state });
});

// API endpoint to get client IP location
app.get('/api/ip-location', (req, res) => {
  const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  console.log('IP location request from:', clientIP);
  
  // For local IPs, return unknown
  if (clientIP === 'unknown' || clientIP === '::1' || clientIP === '127.0.0.1' || clientIP.startsWith('::ffff:127.')) {
    return res.json({ 
      ip: clientIP, 
      country: 'Unknown', 
      countryName: 'Unknown (Local IP)',
      isLocal: true 
    });
  }
  
  // Use ip-api.com free API (no key needed, 45 req/min limit)
  const apiUrl = `http://ip-api.com/json/${clientIP}?fields=status,country,countryCode,city,lat,lon,query`;
  
  require('http').get(apiUrl, (apiRes) => {
    let data = '';
    apiRes.on('data', chunk => data += chunk);
    apiRes.on('end', () => {
      try {
        const geoData = JSON.parse(data);
        if (geoData.status === 'success') {
          res.json({
            ip: geoData.query,
            country: geoData.countryCode,
            countryName: geoData.country,
            city: geoData.city,
            lat: geoData.lat,
            lon: geoData.lon,
            isLocal: false
          });
        } else {
          res.json({ ip: clientIP, country: 'Unknown', countryName: 'Unknown', isLocal: false });
        }
      } catch(e) {
        res.json({ ip: clientIP, country: 'Unknown', countryName: 'Unknown', isLocal: false });
      }
    });
  }).on('error', () => {
    res.json({ ip: clientIP, country: 'Unknown', countryName: 'Unknown', isLocal: false });
  });
});

// ============ Pulse Helpers ============

// Get top players by score
function getTopPlayers(limit = 10) {
  const players = Array.from(userData.values())
    .filter(user => user.provider !== 'guest' && user.personalScore > 0)
    .sort((a, b) => b.personalScore - a.personalScore)
    .slice(0, limit)
    .map(user => ({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      score: user.personalScore,
      country: user.country
    }));
  return players;
}

function addPulse(lat, lon, source = 'client', socketId = null) {
  const locationKey = getLocationKey(lat, lon);
  if (!locationKey) return;

  // Get country from coordinates
  let country = 'Unknown';
  if (lat !== undefined && lon !== undefined) {
    country = getCountryFromCoordinates(lat, lon);
  }

  // Revive location if it was destroyed
  if (destroyedTargets.has(locationKey)) {
    destroyedTargets.delete(locationKey);
    io.emit('targetRevived', { locationKey });
  }

  // Track active targets by unique location
  if (!activeLocationSet.has(locationKey)) {
    if (activeLocationQueue.length >= MAX_ACTIVE_TARGETS) {
      const oldest = activeLocationQueue.shift();
      if (oldest) removeLocation(oldest, 'capacity');
    }
    activeLocationSet.add(locationKey);
    activeLocationQueue.push(locationKey);
  }

  // Update pulse data
  pulseData.global++;
  incrementCountry(country);

  // Store or update pulse in history (one per location)
  const pulseEntry = {
    country: country,
    timestamp: new Date(),
    timestampISO: new Date().toISOString(),
    lat: lat,
    lon: lon,
    locationKey,
    source: source,  // 'client' for human players, 'auto' for auto-agent
    socketId: socketId  // Store socket ID if provided
  };

  const existingIndex = pulseData.pulseHistory.findIndex(entry => {
    const key = getLocationKey(entry.lat, entry.lon);
    return key === locationKey;
  });

  if (existingIndex >= 0) {
    pulseData.pulseHistory[existingIndex] = pulseEntry;
  } else {
    pulseData.pulseHistory.push(pulseEntry);
  }

  // Broadcast to all clients
  io.emit('pulseUpdate', {
    global: pulseData.global,
    countries: pulseData.countries,
    country: country,
    timestamp: pulseEntry.timestampISO,
    pulseEntry: pulseEntry
  });

  console.log(`💓 New pulse ${source}: (${lat?.toFixed(2)}, ${lon?.toFixed(2)}) in ${country}. Total pulses: ${pulseData.global}`);
}

// ============ Auto-Agent Attack System ============
// ALL attacks (human and auto) are processed and broadcast to ALL clients
// Clients then render the same trajectory visualization

function findBestAttackTarget(attackerLat, attackerLon, attackerCountry) {
  /**
   * Find best target for an attacker
   * Rules:
   * 1. Cannot attack targets in same country
   * 2. Cannot attack already destroyed targets
   * 3. Cannot attack itself
   * 4. Prefer high-value targets (oldest + highest points)
   */
  
  const attackerKey = getLocationKey(attackerLat, attackerLon);
  
  const validTargets = pulseData.pulseHistory.filter(target => {
    const targetKey = getLocationKey(target.lat, target.lon);
    const targetCountry = target.country;
    
    // Validation checks
    if (targetKey === attackerKey) return false; // Can't attack self
    if (destroyedTargets.has(targetKey)) return false; // Can't attack destroyed
    if (targetCountry === attackerCountry) return false; // Can't attack same country
    
    return true;
  });

  if (validTargets.length === 0) return null;

  // Pick highest value target
  const bestTarget = validTargets.reduce((best, current) => {
    const ageMs = Date.now() - new Date(current.timestamp).getTime();
    const ageMinutes = Math.floor(ageMs / 60000);
    const currentPoints = 10 + Math.min(ageMinutes, 60);
    
    const bestAgeMs = Date.now() - new Date(best.timestamp).getTime();
    const bestAgeMinutes = Math.floor(bestAgeMs / 60000);
    const bestPoints = 10 + Math.min(bestAgeMinutes, 60);
    
    return currentPoints > bestPoints ? current : best;
  });

  return bestTarget;
}

// ============ Random Pulse Generator ============

let pulseGeneratorTimeout = null;

function calculateCountryValue(country) {
  // Calculate value of a country based on sum of points in it
  // Each point: 10 base + age bonus (1 per minute, max 60)
  let totalValue = 0;
  
  pulseData.pulseHistory.forEach(pulse => {
    const locationKey = getLocationKey(pulse.lat, pulse.lon, LOCATION_KEY_PRECISION);
    if (!destroyedTargets.has(locationKey) && pulse.country === country) {
      const ageMs = Date.now() - pulse.timestamp.getTime();
      const ageMinutes = Math.floor(ageMs / 60000);
      const ageBonus = Math.min(ageMinutes, 60);
      const pointValue = 10 + ageBonus;
      totalValue += pointValue;
    }
  });
  
  return totalValue;
}

function getCountryWithMostTargets() {
  // Find country with most undestroyed targets (exclude Unknown)
  const countryCounts = {};
  const countryValues = {};
  
  pulseData.pulseHistory.forEach(pulse => {
    const locationKey = getLocationKey(pulse.lat, pulse.lon, LOCATION_KEY_PRECISION);
    if (!destroyedTargets.has(locationKey) && pulse.country && pulse.country !== 'Unknown') {
      countryCounts[pulse.country] = (countryCounts[pulse.country] || 0) + 1;
    }
  });
  
  if (Object.keys(countryCounts).length === 0) return 'Unknown';
  
  // Find max count (criterion 1: most targets)
  let maxCount = 0;
  Object.values(countryCounts).forEach(count => {
    if (count > maxCount) maxCount = count;
  });
  
  // Get all countries with max count
  const maxCountries = Object.entries(countryCounts)
    .filter(([_, count]) => count === maxCount)
    .map(([country, _]) => country);
  
  if (maxCountries.length === 1) {
    return maxCountries[0];
  }
  
  // Multiple countries with same count - use criterion 2: sum of point values
  maxCountries.forEach(country => {
    countryValues[country] = calculateCountryValue(country);
  });
  
  let maxValue = 0;
  Object.values(countryValues).forEach(value => {
    if (value > maxValue) maxValue = value;
  });
  
  const maxValueCountries = Object.entries(countryValues)
    .filter(([_, value]) => value === maxValue)
    .map(([country, _]) => country);
  
  if (maxValueCountries.length === 1) {
    return maxValueCountries[0];
  }
  
  // Still tied - use criterion 3: leaderboard position
  const topPlayers = getTopPlayers(10);
  const topPlayerCountries = topPlayers.map(player => player.country);
  
  for (const country of topPlayerCountries) {
    if (maxValueCountries.includes(country)) {
      return country;
    }
  }
  
  // Fallback: pick first tied country
  return maxValueCountries[0];
}

function getRandomTargetInCountry(targetCountry) {
  // Find random undestroyed target in the specified country
  const targets = pulseData.pulseHistory.filter(pulse => {
    const locationKey = getLocationKey(pulse.lat, pulse.lon, LOCATION_KEY_PRECISION);
    return pulse.country === targetCountry && !destroyedTargets.has(locationKey);
  });
  
  if (targets.length === 0) return null;
  return targets[Math.floor(Math.random() * targets.length)];
}

function calculateTargetPoints(pulse) {
  // Calculate value of a target based on its age
  // Each point: 10 base + age bonus (1 per minute, max 60)
  if (!pulse || !pulse.timestamp) return 0;
  const ageMs = Date.now() - pulse.timestamp.getTime();
  const ageMinutes = Math.floor(ageMs / 60000);
  const ageBonus = Math.min(ageMinutes, 60);
  return 10 + ageBonus;
}

function getTargetWithMostPoints(attackerLat, attackerLon) {
  // Find the target with the highest point value that can be attacked
  // Only consider undestroyed targets, exclude the attacker location
  // Returns: { target, points, targetCountry } or null if not enough targets exist
  
  const attackerLocationKey = getLocationKey(attackerLat, attackerLon, LOCATION_KEY_PRECISION);
  
  // Count active undestroyed targets (excluding the attacker itself)
  const activeTotalTargets = pulseData.pulseHistory.filter(pulse => {
    const locationKey = getLocationKey(pulse.lat, pulse.lon, LOCATION_KEY_PRECISION);
    return !destroyedTargets.has(locationKey) && locationKey !== attackerLocationKey;
  }).length;
  
  // If there are no valid targets (besides the attacker itself), don't attack
  if (activeTotalTargets <= 0) {
    return null;
  }
  
  // Group targets by country and calculate total points per country
  const countryTargets = {};
  const countryTotalPoints = {};
  
  pulseData.pulseHistory.forEach(pulse => {
    const locationKey = getLocationKey(pulse.lat, pulse.lon, LOCATION_KEY_PRECISION);
    if (!destroyedTargets.has(locationKey) && locationKey !== attackerLocationKey && pulse.country && pulse.country !== 'Unknown') {
      if (!countryTargets[pulse.country]) {
        countryTargets[pulse.country] = [];
        countryTotalPoints[pulse.country] = 0;
      }
      const points = calculateTargetPoints(pulse);
      countryTargets[pulse.country].push({ target: pulse, points });
      countryTotalPoints[pulse.country] += points;
    }
  });
  
  console.log(`🎯 Target analysis: ${pulseData.pulseHistory.length} total targets, ${activeTotalTargets} valid targets (excl. attacker), ${Object.keys(countryTotalPoints).length} countries with targets`);
  
  // Find country with most total points
  if (Object.keys(countryTotalPoints).length === 0) {
    console.log(`❌ No valid target countries found`);
    return null;
  }
  
  let targetCountry = null;
  let maxTotalPoints = 0;
  Object.entries(countryTotalPoints).forEach(([country, points]) => {
    if (points > maxTotalPoints) {
      maxTotalPoints = points;
      targetCountry = country;
    }
  });
  
  if (!targetCountry) return null;
  
  // Find the target with the most points in that country
  const targetOptions = countryTargets[targetCountry];
  const targetWithMost = targetOptions.reduce((prev, current) => 
    current.points > prev.points ? current : prev
  );
  
  return {
    target: targetWithMost.target,
    points: targetWithMost.points,
    targetCountry: targetCountry
  };
}

function calculateNextPulseInterval() {
  // Calculate dynamic interval based on active target count
  // At 1 target: 30 seconds
  // At 10000 targets: 1 second
  // Linear relationship
  const activeCount = Math.max(1, pulseData.pulseHistory.length - destroyedTargets.size);
  
  // Formula: interval = 30 - (activeCount - 1) * (29 / 9999)
  // Or: interval = (300029 - 29 * activeCount) / 10000
  const interval = Math.max(1000, (300029 - 29 * activeCount) / 10);
  
  return interval;
}

function generateRandomCoordinatesInCountry(targetCountry, maxAttempts = 20) {
  // Generate random coordinates that land in a specific country
  for (let i = 0; i < maxAttempts; i++) {
    const u = Math.random();
    const v = Math.random();
    const lat = (Math.asin(2 * u - 1) * 180 / Math.PI);
    const lon = v * 360 - 180;
    const clampedLat = Math.max(-85, Math.min(85, lat));
    const detectedCountry = getCountryFromCoordinates(clampedLat, lon);
    if (detectedCountry === targetCountry) {
      return { lat: clampedLat, lon, country: detectedCountry };
    }
  }
  return null;
}

function generateAttackerCoordsDifferentCountry(targetCountry, maxAttempts = 20) {
  // Generate attacker coordinates from a DIFFERENT country than target
  for (let i = 0; i < maxAttempts; i++) {
    const u = Math.random();
    const v = Math.random();
    const lat = (Math.asin(2 * u - 1) * 180 / Math.PI);
    const lon = v * 360 - 180;
    const clampedLat = Math.max(-85, Math.min(85, lat));
    const attackerCountry = getCountryFromCoordinates(clampedLat, lon);
    if (attackerCountry && attackerCountry !== 'Unknown' && attackerCountry !== targetCountry) {
      return { lat: clampedLat, lon, country: attackerCountry };
    }
  }
  return null;
}

// Old generateRandomPulse() system removed - replaced by scheduleAutoAgentAttack()

// ============ Auto-Agent Beacon Generation & Attack System ============

function generateAutoAgentPulse() {
  console.log('\n🤖 ===== GENERATING AUTO-AGENT BEACON =====');
  
  // Find country with most pulses
  const countryPulseCounts = {};
  const countryPulses = {};
  
  pulseData.pulseHistory.forEach(p => {
    if (!destroyedTargets.has(getLocationKey(p.lat, p.lon))) {
      const country = getCountryFromCoordinates(p.lat, p.lon);
      countryPulseCounts[country] = (countryPulseCounts[country] || 0) + 1;
      if (!countryPulses[country]) countryPulses[country] = [];
      countryPulses[country].push(p);
    }
  });
  
  if (Object.keys(countryPulseCounts).length === 0) {
    console.log('   ℹ️ No countries with pulses - cannot generate agent');
    return null;
  }
  
  // Get country with most pulses
  const targetCountry = Object.entries(countryPulseCounts)
    .sort((a, b) => b[1] - a[1])[0][0];
  
  console.log(`   Target country: ${targetCountry} with ${countryPulseCounts[targetCountry]} pulses`);
  
  // Get country bounds
  const countryBounds = {
    'BG': { latMin: 41.2353, latMax: 44.2168, lonMin: 22.3571, lonMax: 28.5681 },
    'RO': { latMin: 43.6884, latMax: 48.2208, lonMin: 20.2619, lonMax: 29.6279 },
    'GR': { latMin: 34.8022, latMax: 41.7488, lonMin: 19.3731, lonMax: 28.2432 },
    'TR': { latMin: 35.8081, latMax: 42.7939, lonMin: 26.0433, lonMax: 44.7939 },
    'DE': { latMin: 47.2701, latMax: 55.0996, lonMin: 5.8663, lonMax: 15.0419 },
    'FR': { latMin: 42.4314, latMax: 51.1242, lonMin: -5.1422, lonMax: 8.2275 },
    'IT': { latMin: 36.6230, latMax: 47.0921, lonMin: 6.6272, lonMax: 18.5203 },
    'ES': { latMin: 36.0021, latMax: 43.7483, lonMin: -9.2393, lonMax: 3.0910 },
    'GB': { latMin: 50.0229, latMax: 58.6350, lonMin: -7.5721, lonMax: 1.7628 },
    'US': { latMin: 24.5210, latMax: 49.3844, lonMin: -125.0011, lonMax: -66.9326 },
    'CA': { latMin: 41.6765, latMax: 83.1096, lonMin: -141.0017, lonMax: -52.6480 },
    'MX': { latMin: 14.5345, latMax: 32.7186, lonMin: -117.1205, lonMax: -86.8108 },
    'BR': { latMin: -33.7683, latMax: 5.2419, lonMin: -73.9830, lonMax: -34.7725 },
    'JP': { latMin: 30.3966, latMax: 45.5514, lonMin: 130.4017, lonMax: 145.8369 },
    'CN': { latMin: 18.2671, latMax: 53.5604, lonMin: 73.5057, lonMax: 135.0865 },
    'IN': { latMin: 8.0883, latMax: 35.5047, lonMin: 68.1766, lonMax: 97.4025 },
    'AU': { latMin: -43.6345, latMax: -10.6718, lonMin: 112.9211, lonMax: 154.3021 },
    'ZA': { latMin: -34.8212, latMax: -22.0529, lonMin: 16.3449, lonMax: 32.8305 },
    'RU': { latMin: 41.1850, latMax: 81.8554, lonMin: 19.6389, lonMax: 169.6007 }
  };
  
  const bounds = countryBounds[targetCountry];
  if (!bounds) {
    console.log(`   ❌ No bounds for country ${targetCountry}`);
    return null;
  }
  
  // Generate random location in country
  const agentLat = bounds.latMin + Math.random() * (bounds.latMax - bounds.latMin);
  const agentLon = bounds.lonMin + Math.random() * (bounds.lonMax - bounds.lonMin);
  
  console.log(`   Agent location: (${agentLat.toFixed(4)}, ${agentLon.toFixed(4)})`);
  
  // Create auto-agent pulse
  addPulse(agentLat, agentLon, 'auto', null);
  
  console.log(`   ✅ Auto-agent beacon created in ${targetCountry}`);
  
  return {
    lat: agentLat,
    lon: agentLon,
    country: targetCountry,
    pulses: countryPulses[targetCountry]
  };
}
  };
}

function executeAutoAgentAttack(agentData) {
  if (!agentData) return;
  
  console.log('\n⚔️ ===== AUTO-AGENT ATTACK EXECUTION =====');
  console.log(`   Agent in ${agentData.country} at (${agentData.lat.toFixed(2)}, ${agentData.lon.toFixed(2)})`);
  
  // Calculate average points for country
  const countryPulses = agentData.pulses;
  const now = Date.now();
  const pulsePoints = countryPulses.map(p => {
    const ageMs = now - new Date(p.timestamp).getTime();
    const ageMinutes = Math.floor(ageMs / 60000);
    return 10 + Math.min(ageMinutes, 60);
  });
  
  const avgPoints = pulsePoints.reduce((sum, p) => sum + p, 0) / pulsePoints.length;
  console.log(`   Country average points: ${avgPoints.toFixed(1)}`);
  
  // Find targets below average
  const validTargets = [];
  countryPulses.forEach((p, idx) => {
    const key = getLocationKey(p.lat, p.lon);
    const agentKey = getLocationKey(agentData.lat, agentData.lon);
    
    if (key !== agentKey && !destroyedTargets.has(key) && pulsePoints[idx] < avgPoints) {
      validTargets.push({
        pulse: p,
        points: pulsePoints[idx],
        key: key
      });
    }
  });
  
  console.log(`   Valid targets (below ${avgPoints.toFixed(1)} pts): ${validTargets.length}`);
  
  if (validTargets.length === 0) {
    console.log('   ℹ️ No valid targets below average - picking any target in country');
    // Pick any target if none below average
    countryPulses.forEach((p, idx) => {
      const key = getLocationKey(p.lat, p.lon);
      const agentKey = getLocationKey(agentData.lat, agentData.lon);
      
      if (key !== agentKey && !destroyedTargets.has(key)) {
        validTargets.push({
          pulse: p,
          points: pulsePoints[idx],
          key: key
        });
      }
    });
  }
  
  if (validTargets.length === 0) {
    console.log('   ❌ No valid targets at all - aborting attack');
    return;
  }
  
  // Pick random target
  const targetData = validTargets[Math.floor(Math.random() * validTargets.length)];
  const target = targetData.pulse;
  
  console.log(`   Selected target: (${target.lat.toFixed(2)}, ${target.lon.toFixed(2)}) with ${targetData.points} pts`);
  
  // Broadcast attack event with full visualization
  const attackEvent = {
    fromLat: agentData.lat,
    fromLon: agentData.lon,
    toLat: target.lat,
    toLon: target.lon,
    isAutoAgent: true,
    duration: 30,
    timestamp: new Date().toISOString(),
    startTime: Date.now()
  };
  
  // Track active attack
  activeAttacks.push(attackEvent);
  
  // Clean up old attacks
  const timeNow = Date.now();
  while (activeAttacks.length > 0 && timeNow - activeAttacks[0].startTime > 60000) {
    activeAttacks.shift();
  }
  
  console.log(`   ✅ Attack launched: ${agentData.country} → target`);
  console.log(`   Connected clients: ${io.engine.clientsCount}`);
  
  io.emit('attackEvent', attackEvent);
  
  // Destroy target after animation
  setTimeout(() => {
    const targetKey = getLocationKey(target.lat, target.lon);
    if (!destroyedTargets.has(targetKey)) {
      destroyedTargets.add(targetKey);
      removeLocation(targetKey, 'destroyed-by-auto');
      
      const targetDefense = { shield: 0, armor: 0, interceptor: 0 };
      const targetCountry = getCountryFromCoordinates(target.lat, target.lon);
      
      io.emit('targetDestroyed', { 
        locationKey: targetKey,
        destroyedBySocket: null,
        isAutoAgent: true,
        targetName: targetCountry,
        targetCountry: targetCountry,
        timestamp: target.timestamp,
        targetDefense: targetDefense
      });
      
      console.log(`   💥 Target destroyed by auto-agent`);
    }
  }, 31000);
  
  console.log('===== ATTACK COMPLETE =====\n');
}

// ============ Auto-Agent Attack Scheduler ============
// Server decides when auto-agents should attack

function scheduleAutoAgentAttack() {
  // Auto-agents attack at random intervals
  const attackInterval = 8000 + Math.random() * 7000; // 8-15 seconds

  console.log(`\n⏰ [AUTO-AGENT] Scheduling next attack in ${(attackInterval / 1000).toFixed(1)}s`);
  console.log(`   Active pulses: ${pulseData.pulseHistory.length}, Destroyed: ${destroyedTargets.size}`);

  setTimeout(() => {
    console.log(`\n🔥 ===== AUTO-AGENT CYCLE START =====`);
    console.log(`   Total pulses: ${pulseData.pulseHistory.length}`);
    console.log(`   Connected clients: ${io.engine.clientsCount}`);
    
    // Generate new auto-agent beacon
    const agentData = generateAutoAgentPulse();
    
    if (agentData) {
      // Wait 2 seconds then execute attack
      setTimeout(() => {
        executeAutoAgentAttack(agentData);
      }, 2000);
    } else {
      console.log('   ℹ️ Could not generate agent - rescheduling');
    }
    
    console.log(`===== CYCLE COMPLETE =====\n`);
    // Schedule next attack
    scheduleAutoAgentAttack();
  }, attackInterval);
}

// Initialize with seed pulses if empty
function initializeWithSeedPulses() {
  if (pulseData.pulseHistory.length === 0) {
    console.log('\n🌱 ===== INITIALIZING SEED PULSES =====');
    console.log('   No pulses found - creating initial beacons...');
    
    const seedCountries = ['US', 'GB', 'DE', 'JP', 'BR'];
    const countryBounds = {
      'US': { latMin: 24.5210, latMax: 49.3844, lonMin: -125.0011, lonMax: -66.9326 },
      'GB': { latMin: 50.0229, latMax: 58.6350, lonMin: -7.5721, lonMax: 1.7628 },
      'DE': { latMin: 47.2701, latMax: 55.0996, lonMin: 5.8663, lonMax: 15.0419 },
      'JP': { latMin: 30.3966, latMax: 45.5514, lonMin: 130.4017, lonMax: 145.8369 },
      'BR': { latMin: -33.7683, latMax: 5.2419, lonMin: -73.9830, lonMax: -34.7725 }
    };
    
    seedCountries.forEach(country => {
      const bounds = countryBounds[country];
      if (bounds) {
        const lat = bounds.latMin + Math.random() * (bounds.latMax - bounds.latMin);
        const lon = bounds.lonMin + Math.random() * (bounds.lonMax - bounds.lonMin);
        addPulse(lat, lon, 'seed', null);
        console.log(`   ✅ Created seed pulse in ${country} at (${lat.toFixed(2)}, ${lon.toFixed(2)})`);
      }
    });
    
    console.log(`   Total seed pulses created: ${pulseData.pulseHistory.length}`);
    console.log('===== INITIALIZATION COMPLETE =====\n');
  }
}

// Start auto-agent attacks after initial delay
setTimeout(() => {
  console.log('\n🚀 Starting auto-agent attack scheduler');
  console.log(`   Current time: ${new Date().toLocaleTimeString()}`);
  console.log(`   Total pulses available: ${pulseData.pulseHistory.length}`);
  scheduleAutoAgentAttack();
}, 10000);

// WebSocket connection
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);
  
  // Get client IP
  const clientIP = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address || 'unknown';
  console.log(`Client IP: ${clientIP}`);

  // Send initial data with all pulse history
  const recentActivities = pulseData.pulseHistory.slice(-5).reverse().map(entry => ({
    country: entry.country,
    timestamp: entry.timestampISO,
    lat: entry.lat,
    lon: entry.lon
  }));
  
  // Filter active attacks
  const activeAttacksList = activeAttacks.filter(a => Date.now() - a.startTime < 60000);
  console.log(`🚀 Client ${socket.id} connecting - ${activeAttacksList.length} active attacks (last 60s)`);
  activeAttacksList.forEach(a => {
    const elapsed = (Date.now() - a.startTime) / 1000;
    console.log(`   Attack: ${(a.duration - elapsed).toFixed(1)}s remaining`);
  });
  
  socket.emit('initData', {
    global: pulseData.global,
    countries: pulseData.countries,
    recentActivities: recentActivities,
    pulseHistory: pulseData.pulseHistory,
    destroyedTargets: Array.from(destroyedTargets),
    topPlayers: getTopPlayers(10),
    activeAttacks: activeAttacksList
  });

  // Handle pulse event
  socket.on('pulse', (data) => {
    const clientIP = socket.handshake.address || 'unknown';
    addPulse(data.lat, data.lon, `client:${clientIP}`, socket.id);
  });

  // Handle attack event from client (human player or auto-agent)
  socket.on('attack', (data) => {
    console.log(`📥 SERVER: Attack data received from client: `, JSON.stringify(data));
    if (!data || typeof data.fromLat !== 'number' || typeof data.toLat !== 'number') {
      console.warn('❌ Invalid attack data received');
      return;
    }

    const attackerCountry = getCountryFromCoordinates(data.fromLat, data.fromLon);
    const targetCountry = getCountryFromCoordinates(data.toLat, data.toLon);
    console.log(`🌍 Attacker: ${attackerCountry}, Target: ${targetCountry}`);

    // Validate: can't attack same country
    if (attackerCountry === targetCountry) {
      console.log(`❌ Attack rejected: Can't attack same country (${attackerCountry})`);
      socket.emit('attackRejected', { reason: 'same_country' });
      return;
    }

    // Find target in pulse history
    const targetKey = getLocationKey(data.toLat, data.toLon);
    if (destroyedTargets.has(targetKey)) {
      console.log(`❌ Attack rejected: Target already destroyed`);
      socket.emit('attackRejected', { reason: 'already_destroyed' });
      return;
    }

    console.log(`⚔️ Attack from (${data.fromLat.toFixed(2)}, ${data.fromLon.toFixed(2)}) [${attackerCountry}] to (${data.toLat.toFixed(2)}, ${data.toLon.toFixed(2)}) [${targetCountry}]`);

    // Broadcast attack event to all clients (for synchronized visualization)
    const attackEvent = {
      fromLat: data.fromLat,
      fromLon: data.fromLon,
      toLat: data.toLat,
      toLon: data.toLon,
      isAutoAgent: false, // This is from human player
      duration: data.duration || 8, // Use duration from client or default to 8
      timestamp: new Date().toISOString(),
      startTime: Date.now()
    };

    // Track active attack
    activeAttacks.push(attackEvent);
    
    // Clean up old attacks (older than 60 seconds)
    const now = Date.now();
    while (activeAttacks.length > 0 && now - activeAttacks[0].startTime > 60000) {
      activeAttacks.shift();
    }

    io.emit('attackEvent', attackEvent);

    // Destroy target after animation duration
    setTimeout(() => {
      const targetKey = getLocationKey(data.toLat, data.toLon);
      if (!destroyedTargets.has(targetKey)) {
        destroyedTargets.add(targetKey);
        removeLocation(targetKey, 'destroyed-by-player');
        // Find target in pulse history to get its data
        const targetPulse = pulseData.pulseHistory.find(p => getLocationKey(p.lat, p.lon) === targetKey);
        
        // Get target's defense info (if target was a player's location)
        // Try to find which socket owns this location by matching coordinates
        let targetDefense = { shield: 0, armor: 0, interceptor: 0 };
        for (const [socketId, defense] of playerDefense.entries()) {
          // Check if this socket has a matching location in game state
          const state = gameState.get(socketId);
          if (state && state.userCoordinates) {
            const stateKey = getLocationKey(state.userCoordinates.lat, state.userCoordinates.lon);
            if (stateKey === targetKey) {
              targetDefense = defense;
              break;
            }
          }
        }
        
        io.emit('targetDestroyed', { 
          locationKey: targetKey,
          destroyedBySocket: socket.id,
          isAutoAgent: false,
          targetName: targetPulse?.country || 'Unknown',
          targetCountry: targetPulse?.country || 'Unknown',
          timestamp: targetPulse?.timestamp,
          targetDefense: targetDefense
        });
        console.log(`💥 Target destroyed by player (defense: ${JSON.stringify(targetDefense)})`);
      }

      // Generate new pulse at attacker location (human player leaves their mark)
      console.log(`📍 Generating new pulse at attacker location (${data.fromLat.toFixed(2)}, ${data.fromLon.toFixed(2)})`);
      addPulse(data.fromLat, data.fromLon, 'client', socket.id);
    }, 31000); // Wait for 30s attack animation to complete
  });

  // Handle target destruction (broadcast to all clients)
  socket.on('destroyTarget', (data) => {
    const locationKey = data?.locationKey || getLocationKey(data?.lat, data?.lon);
    if (!locationKey) return;
    if (destroyedTargets.has(locationKey)) return;

    destroyedTargets.add(locationKey);
    removeLocation(locationKey, 'destroyed');
    io.emit('targetDestroyed', { locationKey });
  });

  // Handle period filter request
  socket.on('getPeriodData', (period) => {
    const data = getInitialPeriodData(period);
    socket.emit('pulsesByPeriod', data);
  });

  // Handle user score update
  socket.on('userScoreUpdate', (data) => {
    const { userId, score, userName, avatar, country, provider } = data;
    if (!userId) return;
    
    // Update user data
    if (userData.has(userId)) {
      const user = userData.get(userId);
      user.personalScore = score;
      user.lastActive = new Date();
    } else {
      userData.set(userId, {
        id: userId,
        provider: provider || 'unknown',
        name: userName || 'Player',
        avatar: avatar || null,
        country: country || 'Unknown',
        personalScore: score,
        lastActive: new Date()
      });
    }
    
    console.log(`💯 User score update: ${userName} - ${score} points`);
    
    // Broadcast updated leaderboard to all clients
    const topPlayers = getTopPlayers(10);
    io.emit('leaderboardUpdate', { players: topPlayers });
  });

  // Handle leaderboard request
  socket.on('getLeaderboard', () => {
    const topPlayers = getTopPlayers(10);
    socket.emit('leaderboardUpdate', { players: topPlayers });
  });

  // Handle defense upgrade updates from client
  socket.on('updateDefense', (defenseData) => {
    if (defenseData && typeof defenseData === 'object') {
      playerDefense.set(socket.id, {
        shield: defenseData.shield || 0,
        armor: defenseData.armor || 0,
        interceptor: defenseData.interceptor || 0
      });
      console.log(`🛡️ Defense updated for ${socket.id}:`, playerDefense.get(socket.id));
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    // Clean up player defense data
    playerDefense.delete(socket.id);
  });

  // Handle get current data request
  socket.on('getData', () => {
    const activeAttacksList = activeAttacks.filter(a => Date.now() - a.startTime < 60000);
    socket.emit('initData', {
      global: pulseData.global,
      countries: pulseData.countries,
      pulseHistory: pulseData.pulseHistory,
      destroyedTargets: Array.from(destroyedTargets),
      activeAttacks: activeAttacksList
    });
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n🌍 GlobalPulseMap Server running on http://localhost:${PORT}`);
  console.log(`📊 Real-time pulse tracking enabled`);
  console.log(`🔗 WebSocket connection ready\n`);
  
  // Initialize seed pulses after server starts
  initializeWithSeedPulses();
});
