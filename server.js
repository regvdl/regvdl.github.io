const express = require('express');
const http = require('http');
const https = require('https');
const socketIO = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// VERSION MARKER - Change this to verify deployment
const SERVER_VERSION = 'v3.0-TRUE-GEOCODING-' + Date.now();
console.log('🚀🚀🚀 SERVER VERSION:', SERVER_VERSION, '🚀🚀🚀');
console.log('🌍 Using real-time reverse geocoding from server');
console.log('📍 True global spawn with accurate country/address detection\n');

// Geocoding cache to avoid repeated API calls
const geocodeCache = new Map();
let lastGeocodeTime = 0;

// Comprehensive country boundaries database
const countryBoundaries = {
  'US': { name: 'United States of America', bounds: [[25.8, -125], [49.4, -66.9]] },
  'CA': { name: 'Canada', bounds: [[41.7, -141], [83.1, -52.6]] },
  'MX': { name: 'Mexico', bounds: [[14.5, -117.1], [31.0, -86.8]] },
  'BR': { name: 'Brazil', bounds: [[-33.8, -73.9], [5.2, -34.8]] },
  'AR': { name: 'Argentina', bounds: [[-56.2, -73.6], [-21.8, -53.6]] },
  'CL': { name: 'Chile', bounds: [[-56.5, -81.4], [-17.5, -66.4]] },
  'CO': { name: 'Colombia', bounds: [[-4.2, -77.3], [12.5, -66.9]] },
  'PE': { name: 'Peru', bounds: [[-18, -81.5], [0.5, -68.7]] },
  'GB': { name: 'United Kingdom', bounds: [[50, -7.6], [58.6, 1.8]] },
  'FR': { name: 'France', bounds: [[41.3, -5.2], [50.0, 6.0]] },
  'DE': { name: 'Germany', bounds: [[47.3, 5.8], [55.1, 15.1]] },
  'IT': { name: 'Italy', bounds: [[36.6, 6.6], [47.0, 18.5]] },
  'ES': { name: 'Spain', bounds: [[36.0, -9.3], [43.9, 3.0]] },
  'PT': { name: 'Portugal', bounds: [[37.2, -9.5], [42.0, -6.2]] },
  'NL': { name: 'Netherlands', bounds: [[50.7, 3.4], [53.6, 7.2]] },
  'BE': { name: 'Belgium', bounds: [[49.5, 2.4], [51.5, 6.4]] },
  'CH': { name: 'Switzerland', bounds: [[45.8, 5.9], [47.8, 10.5]] },
  'AT': { name: 'Austria', bounds: [[46.4, 9.5], [49.0, 17.2]] },
  'PL': { name: 'Poland', bounds: [[49.0, 14.1], [54.8, 24.1]] },
  'CZ': { name: 'Czech Republic', bounds: [[48.6, 12.1], [51.0, 18.9]] },
  'RO': { name: 'Romania', bounds: [[43.7, 20.3], [48.2, 29.6]] },
  'BG': { name: 'Bulgaria', bounds: [[41.2, 22.4], [44.2, 28.6]] },
  'GR': { name: 'Greece', bounds: [[34.8, 19.4], [41.7, 28.2]] },
  'TR': { name: 'Turkey', bounds: [[35.8, 26.1], [42.8, 44.8]] },
  'RU': { name: 'Russia', bounds: [[50.0, 19.6], [81.9, 169.6]] },
  'UA': { name: 'Ukraine', bounds: [[43.4, 22.2], [52.4, 40.2]] },
  'KZ': { name: 'Kazakhstan', bounds: [[40.6, 51.9], [68.8, 87.3]] },
  'UZ': { name: 'Uzbekistan', bounds: [[37.2, 55.4], [45.6, 73.2]] },
  'TM': { name: 'Turkmenistan', bounds: [[35.3, 52.5], [42.8, 66.7]] },
  'KG': { name: 'Kyrgyzstan', bounds: [[39.2, 69.3], [43.3, 80.3]] },
  'TJ': { name: 'Tajikistan', bounds: [[36.7, 67.5], [37.5, 75.5]] },
  'AF': { name: 'Afghanistan', bounds: [[29.3, 60.5], [38.5, 75.2]] },
  'PK': { name: 'Pakistan', bounds: [[23.7, 60.9], [37.1, 77.8]] },
  'IN': { name: 'India', bounds: [[8.1, 68.2], [28.0, 97.4]] },
  'BD': { name: 'Bangladesh', bounds: [[20.7, 88.0], [26.6, 92.7]] },
  'NP': { name: 'Nepal', bounds: [[26.4, 80.1], [30.4, 88.2]] },
  'BT': { name: 'Bhutan', bounds: [[27.0, 88.8], [28.3, 92.1]] },
  'LK': { name: 'Sri Lanka', bounds: [[5.9, 79.7], [7.7, 81.9]] },
  'MM': { name: 'Myanmar', bounds: [[9.2, 92.2], [20.0, 101.2]] },
  'TH': { name: 'Thailand', bounds: [[5.6, 97.3], [20.5, 105.6]] },
  'LA': { name: 'Laos', bounds: [[13.9, 100.1], [22.5, 107.6]] },
  'KH': { name: 'Cambodia', bounds: [[10.4, 102.3], [14.7, 107.6]] },
  'VN': { name: 'Vietnam', bounds: [[8.6, 102.1], [23.4, 109.5]] },
  'MY': { name: 'Malaysia', bounds: [[0.9, 99.6], [6.4, 119.3]] },
  'SG': { name: 'Singapore', bounds: [[1.3, 103.6], [1.5, 104.0]] },
  'ID': { name: 'Indonesia', bounds: [[-10.9, 95.3], [5.9, 141.0]] },
  'PH': { name: 'Philippines', bounds: [[5.0, 119.0], [19.0, 126.6]] },
  'TW': { name: 'Taiwan', bounds: [[21.9, 120.0], [25.3, 121.9]] },
  'JP': { name: 'Japan', bounds: [[30.4, 129.0], [45.6, 145.8]] },
  'KR': { name: 'South Korea', bounds: [[33.1, 124.6], [38.6, 131.9]] },
  'KP': { name: 'North Korea', bounds: [[37.0, 124.1], [42.9, 130.8]] },
  'CN': { name: 'China', bounds: [[18.2, 73.5], [54.0, 119.8]] },
  'MN': { name: 'Mongolia', bounds: [[41.6, 87.7], [50.3, 119.9]] },
  'AU': { name: 'Australia', bounds: [[-43.6, 112.9], [-10.7, 154.3]] },
  'NZ': { name: 'New Zealand', bounds: [[-47.3, 166.4], [-34.4, 178.6]] },
  'FJ': { name: 'Fiji', bounds: [[-18.3, 177.1], [-16.1, -177.0]] },
  'PG': { name: 'Papua New Guinea', bounds: [[-12.2, 141.0], [-1.4, 159.0]] },
  'ZA': { name: 'South Africa', bounds: [[-34.8, 16.3], [-22.1, 32.8]] },
  'EG': { name: 'Egypt', bounds: [[21.7, 24.7], [31.6, 36.9]] },
  'NG': { name: 'Nigeria', bounds: [[4.4, 2.7], [13.9, 14.7]] },
  'ET': { name: 'Ethiopia', bounds: [[3.4, 33.0], [14.9, 47.8]] },
  'KE': { name: 'Kenya', bounds: [[-4.7, 33.9], [5.0, 41.9]] },
  'TZ': { name: 'Tanzania', bounds: [[-11.7, 29.3], [-0.9, 40.3]] },
  'UG': { name: 'Uganda', bounds: [[-1.5, 29.6], [4.2, 35.4]] },
  'DZ': { name: 'Algeria', bounds: [[18.9, -8.7], [37.1, 12.0]] },
  'MA': { name: 'Morocco', bounds: [[27.1, -13.2], [35.9, -2.6]] },
  'IL': { name: 'Israel', bounds: [[31.0, 34.2], [33.3, 35.9]] },
  'SA': { name: 'Saudi Arabia', bounds: [[16.4, 34.4], [32.1, 55.9]] },
  'AE': { name: 'United Arab Emirates', bounds: [[22.5, 51.5], [26.2, 56.4]] },
  'IQ': { name: 'Iraq', bounds: [[29.1, 38.8], [37.4, 48.6]] },
  'IR': { name: 'Iran', bounds: [[25.1, 44.0], [39.8, 63.3]] },
  'SY': { name: 'Syria', bounds: [[32.3, 35.7], [37.3, 42.4]] },
  'JO': { name: 'Jordan', bounds: [[31.2, 34.9], [32.8, 39.3]] },
  'LB': { name: 'Lebanon', bounds: [[33.1, 35.1], [34.6, 36.6]] },
  'PS': { name: 'Palestine', bounds: [[31.4, 34.2], [32.5, 35.5]] },
  'SV': { name: 'El Salvador', bounds: [[12.8, -91.0], [14.5, -88.0]] },
  'GT': { name: 'Guatemala', bounds: [[13.7, -92.2], [17.8, -88.2]] },
  'BZ': { name: 'Belize', bounds: [[15.5, -89.2], [18.5, -87.5]] },
  'HN': { name: 'Honduras', bounds: [[12.9, -89.4], [17.6, -83.1]] },
  'NI': { name: 'Nicaragua', bounds: [[10.7, -87.6], [15.0, -83.6]] },
  'CR': { name: 'Costa Rica', bounds: [[8.0, -85.9], [11.2, -82.5]] },
  'PA': { name: 'Panama', bounds: [[7.2, -82.9], [10.0, -77.2]] },
  'CU': { name: 'Cuba', bounds: [[19.8, -84.9], [20.5, -74.1]] },
  'DO': { name: 'Dominican Republic', bounds: [[17.6, -74.5], [19.9, -68.3]] },
  'HT': { name: 'Haiti', bounds: [[18.0, -74.5], [20.1, -71.9]] },
  'JM': { name: 'Jamaica', bounds: [[17.7, -78.4], [18.5, -76.7]] },
  'PR': { name: 'Puerto Rico', bounds: [[17.9, -67.3], [18.6, -65.2]] },
  'VE': { name: 'Venezuela', bounds: [[0.6, -73.5], [12.8, -59.8]] },
  'GY': { name: 'Guyana', bounds: [[1.2, -61.4], [8.6, -56.5]] },
  'SR': { name: 'Suriname', bounds: [[1.8, -58.0], [6.0, -53.9]] },
  'GF': { name: 'French Guiana', bounds: [[2.1, -54.6], [5.8, -51.6]] },
  'EC': { name: 'Ecuador', bounds: [[-5.0, -81.1], [1.4, -75.2]] },
  'BO': { name: 'Bolivia', bounds: [[-22.9, -69.6], [-9.8, -57.5]] },
  'PY': { name: 'Paraguay', bounds: [[-27.6, -63.1], [-19.3, -54.3]] },
  'UY': { name: 'Uruguay', bounds: [[-34.9, -58.4], [-30.1, -53.2]] },
  'NO': { name: 'Norway', bounds: [[57.9, 4.7], [71.2, 31.3]] },
  'SE': { name: 'Sweden', bounds: [[55.4, 10.9], [69.1, 24.2]] },
  'FI': { name: 'Finland', bounds: [[59.8, 19.1], [70.1, 31.6]] },
  'DK': { name: 'Denmark', bounds: [[54.6, 8.1], [57.7, 12.7]] },
  'IS': { name: 'Iceland', bounds: [[63.4, -24.5], [66.5, -13.5]] },
  'HU': { name: 'Hungary', bounds: [[45.7, 16.1], [48.6, 22.9]] },
  'SK': { name: 'Slovakia', bounds: [[47.7, 16.9], [49.6, 22.3]] },
  'SI': { name: 'Slovenia', bounds: [[45.4, 13.4], [46.8, 16.6]] },
  'HR': { name: 'Croatia', bounds: [[42.4, 12.4], [47.2, 19.4]] },
  'BiH': { name: 'Bosnia and Herzegovina', bounds: [[42.6, 15.7], [45.3, 19.7]] },
  'RS': { name: 'Serbia', bounds: [[42.2, 18.8], [46.2, 23.0]] },
  'ME': { name: 'Montenegro', bounds: [[41.9, 18.4], [43.5, 20.4]] },
  'MK': { name: 'North Macedonia', bounds: [[40.8, 20.5], [42.4, 22.9]] },
  'AL': { name: 'Albania', bounds: [[39.6, 19.3], [42.7, 21.0]] }
};

// Simplified point-in-polygon algorithm
function getCountryFromCoordinates(lat, lon) {
  // Check each country boundary
  for (const [code, data] of Object.entries(countryBoundaries)) {
    const [[minLat, minLon], [maxLat, maxLon]] = data.bounds;
    if (lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon) {
      return { code, name: data.name };
    }
  }
  // If no exact match (water), find nearest country
  return findNearestCountry(lat, lon);
}

function findNearestCountry(lat, lon) {
  let minDistance = Infinity;
  let nearestCountry = { code: null, name: 'Unknown' };
  
  for (const [code, data] of Object.entries(countryBoundaries)) {
    const [[minLat, minLon], [maxLat, maxLon]] = data.bounds;
    
    // Calculate distance to nearest point on country boundary
    const closestLat = Math.max(minLat, Math.min(lat, maxLat));
    const closestLon = Math.max(minLon, Math.min(lon, maxLon));
    
    // Simple Euclidean distance (good enough for finding nearest)
    const distance = Math.sqrt(
      Math.pow(lat - closestLat, 2) + 
      Math.pow(lon - closestLon, 2)
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      nearestCountry = { code, name: data.name };
    }
  }
  
  return nearestCountry;
}

// Server-side reverse geocoding with enhanced precision
// Uses BigDataCloud API (free, no rate limits, no API key required)
async function reverseGeocodeServer(lat, lon) {
  const cacheKey = `${lat.toFixed(5)},${lon.toFixed(5)}`; // Higher precision cache key
  
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey);
  }
  
  return new Promise((resolve) => {
    try {
      // Use BigDataCloud reverse geocoding API (free, reliable, no rate limits)
      const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
      
      https.get(url, {
        headers: {
          'User-Agent': 'GlobalPulseMap-Server/3.0 (Node.js)',
          'Accept': 'application/json'
        }
      }, (response) => {
        let data = '';
        
        response.on('data', (chunk) => {
          data += chunk;
        });
        
        response.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            
            // BigDataCloud response structure
            let countryCode = parsed.countryCode || null;
            let countryName = parsed.countryName || 'Unknown';
            const city = parsed.city || parsed.locality || '';
            const state = parsed.principalSubdivision || '';
            const county = parsed.localityInfo?.administrative?.[0]?.name || '';
            
            // If BigDataCloud returns null countryCode (water), use nearest country
            if (!countryCode) {
              const detected = getCountryFromCoordinates(lat, lon);
              countryCode = detected.code;
              countryName = detected.name;
              console.log(`🌊 Water detected at (${lat.toFixed(4)}, ${lon.toFixed(4)}) → nearest country: ${countryName} [${countryCode}]`);
            }
            
            // Build formatted address
            const addressParts = [];
            if (city) addressParts.push(city);
            if (state && state !== city) addressParts.push(state);
            if (countryName && countryName !== 'Unknown') addressParts.push(countryName);
            
            const formattedAddress = addressParts.length > 0 
              ? addressParts.join(', ')
              : `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`;
            
            const result = {
              countryCode: countryCode,
              countryName: countryName,
              city: city,
              state: state,
              county: county,
              road: '',
              houseNumber: '',
              postcode: '',
              quarter: '',
              formattedAddress: formattedAddress,
              displayName: formattedAddress,
              isWater: !countryCode,
              precision: 'bigdatacloud'
            };
            
            console.log(`🗺️ Geocoded (${lat.toFixed(4)}, ${lon.toFixed(4)}) → ${formattedAddress} [${countryCode}]`);
            
            geocodeCache.set(cacheKey, result);
            resolve(result);
          } catch (error) {
            console.warn(`⚠️ Geocoding parse error for (${lat.toFixed(4)}, ${lon.toFixed(4)}):`, error.message);
            resolve(getFallbackResult(lat, lon));
          }
        });
      }).on('error', (error) => {
        console.warn(`⚠️ Geocoding request failed for (${lat.toFixed(4)}, ${lon.toFixed(4)}):`, error.message);
        resolve(getFallbackResult(lat, lon));
      });
    } catch (error) {
      console.warn(`⚠️ Geocoding failed for (${lat.toFixed(4)}, ${lon.toFixed(4)}):`, error.message);
      resolve(getFallbackResult(lat, lon));
    }
  });
}

function getFallbackResult(lat, lon) {
  // Fallback: use our own country detection by coordinates
  const detected = getCountryFromCoordinates(lat, lon);
  const result = {
    countryCode: detected.code,
    countryName: detected.name,
    city: '',
    state: '',
    county: '',
    road: '',
    houseNumber: '',
    postcode: '',
    quarter: '',
    formattedAddress: detected.name !== 'Unknown' ? detected.name : `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`,
    displayName: detected.name !== 'Unknown' ? detected.name : `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`,
    isWater: detected.code === null,
    precision: 'fallback-bounds'
  };
  
  geocodeCache.set(`${lat.toFixed(5)},${lon.toFixed(5)}`, result);
  return result;
}


// Serve static files
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// Game state file path
const GAME_STATE_FILE = path.join(__dirname, 'gamestate.json');

// In-memory storage
const pulseData = {
  global: 0,
  countries: {},
  pulseHistory: [] // Store all pulses with timestamps
};

// Save game state to file
function saveGameStateToFile() {
  try {
    const stateToSave = {
      global: pulseData.global,
      countries: pulseData.countries,
      pulseHistory: pulseData.pulseHistory.map(pulse => ({
        lat: pulse.lat,
        lon: pulse.lon,
        timestamp: pulse.timestamp,
        source: pulse.source,
        country: pulse.country,
        socketId: pulse.socketId,
        geoData: pulse.geoData
      })),
      savedAt: new Date().toISOString()
    };
    fs.writeFileSync(GAME_STATE_FILE, JSON.stringify(stateToSave, null, 2));
    console.log(`💾 Game state saved: ${pulseData.pulseHistory.length} pulses`);
  } catch (err) {
    console.error('❌ Error saving game state:', err);
  }
}

// Load game state from file
function loadGameStateFromFile() {
  try {
    if (fs.existsSync(GAME_STATE_FILE)) {
      const data = fs.readFileSync(GAME_STATE_FILE, 'utf8');
      const savedState = JSON.parse(data);
      
      pulseData.global = savedState.global || 0;
      pulseData.countries = savedState.countries || {};
      pulseData.pulseHistory = (savedState.pulseHistory || []).map(pulse => ({
        ...pulse,
        timestamp: new Date(pulse.timestamp)
      }));
      
      console.log(`📥 Game state loaded: ${pulseData.pulseHistory.length} pulses from ${savedState.savedAt}`);
      return true;
    }
  } catch (err) {
    console.error('❌ Error loading game state:', err);
  }
  return false;
}

// Auto-save game state every 5 minutes
setInterval(saveGameStateToFile, 5 * 60 * 1000);

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

  // Save state after removing pulse
  saveGameStateToFile();

  io.emit('targetRemoved', { locationKey, reason });
}

// No rate limiting - completely unlimited

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

function addPulse(lat, lon, source = 'client', socketId = null, countryOverride = null, geoData = null) {
  const locationKey = getLocationKey(lat, lon);
  if (!locationKey) return;

  // Use accurate country from geoData if available, otherwise use override or fallback
  let country = 'Unknown';
  if (geoData && geoData.countryCode) {
    // Prefer accurate geocoded country code
    country = geoData.countryCode;
  } else if (countryOverride) {
    country = countryOverride;
  } else if (lat !== undefined && lon !== undefined) {
    // Last resort: use basic detection (all countries by bounds)
    const detected = getCountryFromCoordinates(lat, lon);
    country = detected.code || 'Unknown';
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

  // Store or update pulse in history (one per location) with full geo data
  const pulseEntry = {
    country: country,
    timestamp: new Date(),
    timestampISO: new Date().toISOString(),
    lat: lat,
    lon: lon,
    locationKey,
    source: source,  // 'client' for human players, 'auto' for auto-agent
    socketId: socketId,  // Store socket ID if provided
    // Add detailed geo information if available
    geoData: geoData ? {
      countryCode: geoData.countryCode,
      countryName: geoData.countryName,
      city: geoData.city,
      state: geoData.state,
      road: geoData.road,
      isWater: geoData.isWater
    } : null
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

  // Save state after adding pulse
  saveGameStateToFile();

  // Broadcast to all clients with full geo data
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
const ATTACK_TYPES = {
  pulse: { speedKps: 75 },
  laser: { speedKps: 150 },
  emp: { speedKps: 300 }
};
const ATTACK_TYPE_KEYS = Object.keys(ATTACK_TYPES);
const getRandomAttackType = () => ATTACK_TYPE_KEYS[Math.floor(Math.random() * ATTACK_TYPE_KEYS.length)] || 'pulse';

function toRad(value) {
  return (value * Math.PI) / 180;
}

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2))
    * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function calculateAttackDurationSec(type, fromLat, fromLon, toLat, toLon) {
  const distanceKm = calculateDistanceKm(fromLat, fromLon, toLat, toLon);
  const speedKps = ATTACK_TYPES[type]?.speedKps || ATTACK_TYPES.pulse.speedKps;
  const rawSeconds = distanceKm / speedKps;
  return Math.max(4, Math.ceil(rawSeconds));
}
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
  if (!pulse || !pulse.timestamp) return 10; // Return base points if no timestamp
  
  // Handle both Date objects and ISO strings
  let pulseTime;
  if (pulse.timestamp instanceof Date) {
    pulseTime = pulse.timestamp.getTime();
  } else if (typeof pulse.timestamp === 'string') {
    pulseTime = new Date(pulse.timestamp).getTime();
  } else if (typeof pulse.timestamp === 'number') {
    pulseTime = pulse.timestamp;
  } else {
    return 10; // Fallback to base points
  }
  
  const ageMs = Date.now() - pulseTime;
  const ageMinutes = Math.floor(ageMs / 60000);
  const ageBonus = Math.min(Math.max(ageMinutes, 0), 60); // Clamp between 0 and 60
  const totalPoints = 10 + ageBonus;
  
  return totalPoints;
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

async function generateAutoAgentAttackCycle() {
  console.log('\n🤖 ===== AUTO-AGENT ATTACK CYCLE =====');
  
  // Generate truly random coordinates anywhere on Earth
  // Lat: -60 to +70 (avoid polar regions where no countries exist)
  // Lon: -180 to +180 (full range)
  const agentLat = -60 + Math.random() * 130; // Range: -60 to +70
  const agentLon = -180 + Math.random() * 360; // Range: -180 to +180
  
  console.log(`🌍 ⭐ CRITICAL: Random coordinates generated: lat=${agentLat.toFixed(4)}, lon=${agentLon.toFixed(4)}`);
  
  // Use server-side reverse geocoding for accurate country detection
  const geoData = await reverseGeocodeServer(agentLat, agentLon);
  const actualAgentCountry = geoData.countryCode || geoData.countryName;
  
  console.log(`🎯 ⭐ CRITICAL: Agent location → ${geoData.countryName} (${geoData.countryCode || 'Water'})`);
  if (geoData.city) console.log(`   📍 City: ${geoData.city}`);
  if (geoData.state) console.log(`   🏛️ State: ${geoData.state}`);
  
  // Create pulse for agent with accurate country and full geo data
  addPulse(agentLat, agentLon, 'auto', null, actualAgentCountry, geoData);
  
  // STEP 3: Find all active pulses NOT in agent's country
  const activePulses = pulseData.pulseHistory.filter(p => {
    const key = getLocationKey(p.lat, p.lon);
    // Use geoData country if available, otherwise fallback to stored country
    const pCountry = (p.geoData && p.geoData.countryCode) 
      ? p.geoData.countryCode 
      : (p.country || 'Unknown');
    return !destroyedTargets.has(key) && pCountry !== actualAgentCountry;
  });
  
  console.log(`📍 Found ${activePulses.length} targets outside ${actualAgentCountry}`);
  
  if (activePulses.length === 0) {
    console.log('⚠️ No targets in other countries - skipping attack');
    return;
  }
  
  // STEP 4: Pick random target
  const target = activePulses[Math.floor(Math.random() * activePulses.length)];
  const targetCountry = (target.geoData && target.geoData.countryCode) 
    ? target.geoData.countryCode 
    : (target.country || 'Unknown');
  
  console.log(`⚔️ Attack: ${actualAgentCountry} → ${targetCountry} at (${target.lat.toFixed(2)}, ${target.lon.toFixed(2)})`);
  
  // STEP 5: Launch attack
  const autoAttackType = getRandomAttackType();
  const autoDuration = calculateAttackDurationSec(autoAttackType, agentLat, agentLon, target.lat, target.lon);

  const attackEvent = {
    fromLat: agentLat,
    fromLon: agentLon,
    toLat: target.lat,
    toLon: target.lon,
    isAutoAgent: true,
    attackType: autoAttackType,
    duration: autoDuration,
    timestamp: new Date().toISOString(),
    startTime: Date.now()
  };
  console.log(`   📤 Broadcasting AUTO attackEvent with attackType: ${autoAttackType}`);
  
  activeAttacks.push(attackEvent);
  
  // Clean up old attacks
  const timeNow = Date.now();
  while (activeAttacks.length > 0 && timeNow - activeAttacks[0].startTime > 60000) {
    activeAttacks.shift();
  }
  
  console.log(`✅ Attack launched | Clients: ${io.engine.clientsCount}`);
  io.emit('attackEvent', attackEvent);
  
  // Destroy target after animation
  setTimeout(() => {
    const targetKey = getLocationKey(target.lat, target.lon);
    if (!destroyedTargets.has(targetKey)) {
      destroyedTargets.add(targetKey);
      removeLocation(targetKey, 'destroyed-by-auto');
      
      io.emit('targetDestroyed', { 
        lat: target.lat, 
        lon: target.lon,
        id: `PULSE_${targetKey}`,
        country: targetCountry
      });
      
      console.log(`💥 Target destroyed at (${target.lat.toFixed(2)}, ${target.lon.toFixed(2)})`);
    }
  }, (autoDuration * 1000) + 1000);
  
  console.log('===== CYCLE COMPLETE =====\n');
}

// ============ Auto-Agent Attack Scheduler ============

async function scheduleAutoAgentAttack() {
  const attackInterval = 8000 + Math.random() * 7000; // 8-15 seconds

  console.log(`\n⏰ [AUTO-AGENT] Scheduling next attack in ${(attackInterval / 1000).toFixed(1)}s`);
  console.log(`   Active pulses: ${pulseData.pulseHistory.length}, Destroyed: ${destroyedTargets.size}`);

  setTimeout(async () => {
    console.log(`\n🔥 ===== AUTO-AGENT CYCLE START =====`);
    console.log(`   Total pulses: ${pulseData.pulseHistory.length}`);
    console.log(`   Connected clients: ${io.engine.clientsCount}`);
    
    // Execute complete attack cycle (now async with geocoding)
    await generateAutoAgentAttackCycle();
    
    console.log(`===== CYCLE COMPLETE =====\n`);
    // Schedule next attack
    scheduleAutoAgentAttack();
  }, attackInterval);
}

// Initialize with seed pulses if empty
function initializeWithSeedPulses() {
  // Try to load existing game state first
  const loaded = loadGameStateFromFile();
  if (loaded && pulseData.pulseHistory.length > 0) {
    console.log(`\n✅ Loaded existing game state with ${pulseData.pulseHistory.length} pulses`);
    return;
  }
  
  // Only create seed pulses if no saved data exists
  if (pulseData.pulseHistory.length === 0) {
    console.log('\n🌱 ===== INITIALIZING SEED PULSES =====');
    console.log('   No pulses found - creating initial beacons...');
    
    const seedCountries = ['US', 'GB', 'DE', 'JP', 'BR', 'AU', 'IN', 'CA', 'FR', 'ES', 'IT', 'RU', 'CN', 'MX', 'ZA'];
    const countryBounds = {
      'US': { latMin: 24.5210, latMax: 49.3844, lonMin: -125.0011, lonMax: -66.9326 },
      'GB': { latMin: 50.0229, latMax: 58.6350, lonMin: -7.5721, lonMax: 1.7628 },
      'DE': { latMin: 47.2701, latMax: 55.0996, lonMin: 5.8663, lonMax: 15.0419 },
      'JP': { latMin: 30.3966, latMax: 45.5514, lonMin: 130.4017, lonMax: 145.8369 },
      'BR': { latMin: -33.7683, latMax: 5.2419, lonMin: -73.9830, lonMax: -34.7725 },
      'AU': { latMin: -43.6345, latMax: -10.6718, lonMin: 112.9211, lonMax: 154.3021 },
      'IN': { latMin: 8.0883, latMax: 35.5047, lonMin: 68.1766, lonMax: 97.4025 },
      'CA': { latMin: 41.6765, latMax: 83.1096, lonMin: -141.0017, lonMax: -52.6480 },
      'FR': { latMin: 42.4314, latMax: 51.1242, lonMin: -5.1422, lonMax: 8.2275 },
      'ES': { latMin: 36.0021, latMax: 43.7483, lonMin: -9.2393, lonMax: 3.0910 },
      'IT': { latMin: 36.6230, latMax: 47.0921, lonMin: 6.6272, lonMax: 18.5203 },
      'RU': { latMin: 41.1850, latMax: 81.8554, lonMin: 19.6389, lonMax: 169.6007 },
      'CN': { latMin: 18.2671, latMax: 53.5604, lonMin: 73.5057, lonMax: 135.0865 },
      'MX': { latMin: 14.5345, latMax: 32.7186, lonMin: -117.1205, lonMax: -86.8108 },
      'ZA': { latMin: -34.8212, latMax: -22.0529, lonMin: 16.3449, lonMax: 32.8305 }
    };
    
    seedCountries.forEach(country => {
      const bounds = countryBounds[country];
      if (bounds) {
        const lat = bounds.latMin + Math.random() * (bounds.latMax - bounds.latMin);
        const lon = bounds.lonMin + Math.random() * (bounds.lonMax - bounds.lonMin);
        const detected = getCountryFromCoordinates(lat, lon);
        addPulse(lat, lon, 'seed', null);
        console.log(`   ✅ Seed: intended=${country}, detected=${detected.code} at (${lat.toFixed(4)}, ${lon.toFixed(4)})`);
      }
    });
    
    console.log(`   Total seed pulses created: ${pulseData.pulseHistory.length}`);
    console.log('===== INITIALIZATION COMPLETE =====\n');
    
    // Save initial seed state
    saveGameStateToFile();
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
    const resolvedAttackType = ATTACK_TYPES[data.attackType] ? data.attackType : 'pulse';
    const resolvedDuration = calculateAttackDurationSec(
      resolvedAttackType,
      data.fromLat,
      data.fromLon,
      data.toLat,
      data.toLon
    );

    const attackEvent = {
      fromLat: data.fromLat,
      fromLon: data.fromLon,
      toLat: data.toLat,
      toLon: data.toLon,
      isAutoAgent: false, // This is from human player
      attackType: resolvedAttackType,
      duration: resolvedDuration,
      timestamp: new Date().toISOString(),
      startTime: Date.now()
    };
    console.log(`   📤 Broadcasting attackEvent with attackType: ${resolvedAttackType}`);

    // Track active attack
    activeAttacks.push(attackEvent);
    
    // Clean up old attacks (older than 60 seconds)
    const now = Date.now();
    while (activeAttacks.length > 0 && now - activeAttacks[0].startTime > 60000) {
      activeAttacks.shift();
    }

    io.emit('attackEvent', attackEvent);

    // Destroy target after animation duration (convert duration from seconds to milliseconds)
    const destroyTimeoutMs = (attackEvent.duration * 1000) + 1000; // Add 1s buffer for animation to complete
    console.log(`⏱️ Setting target destruction timeout: ${destroyTimeoutMs}ms (${attackEvent.duration}s duration + 1s buffer)`);
    
    setTimeout(() => {
      const targetKey = getLocationKey(data.toLat, data.toLon);
      if (!destroyedTargets.has(targetKey)) {
        destroyedTargets.add(targetKey);
        removeLocation(targetKey, 'destroyed-by-player');
        // Find target in pulse history to get its data
        const targetPulse = pulseData.pulseHistory.find(p => getLocationKey(p.lat, p.lon) === targetKey);
        
        // Calculate points earned for destroying this target
        const pointsEarned = calculateTargetPoints(targetPulse);
        
        // Log detailed calculation info
        if (targetPulse && targetPulse.timestamp) {
          const pulseAge = Math.floor((Date.now() - new Date(targetPulse.timestamp).getTime()) / 60000);
          console.log(`💰 Points calculation: base=10, age=${pulseAge}min, bonus=${Math.min(pulseAge, 60)}, total=${pointsEarned}`);
        } else {
          console.log(`💰 Points earned: ${pointsEarned} (no timestamp data)`);
        }
        
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
          targetDefense: targetDefense,
          pointsEarned: pointsEarned
        });
        console.log(`💥 Target destroyed by player (defense: ${JSON.stringify(targetDefense)}, points: ${pointsEarned})`);
      }

      // Generate new pulse at attacker location (human player leaves their mark)
      console.log(`📍 Generating new pulse at attacker location (${data.fromLat.toFixed(2)}, ${data.fromLon.toFixed(2)})`);
      addPulse(data.fromLat, data.fromLon, 'client', socket.id);
    }, destroyTimeoutMs);
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
