# GlobalPulseMap 🌍

A real-time global pulse counter web application with interactive world map visualization, built with Node.js, Express, Socket.io, and Leaflet.js.

## Features

✨ **Real-time Updates**: Socket.io WebSocket connection for live pulse synchronization across all users
🗺️ **Interactive Map**: Leaflet.js map with heat map markers showing pulse counts per country
📊 **Live Statistics**: Global counter, top countries leaderboard, and user activity feed
🌓 **Dark Mode**: Toggle between light and dark themes with preference persistence
📱 **Responsive Design**: Optimized for desktop, tablet, and mobile devices
🛡️ **Rate Limiting**: Prevents spam with per-session pulse limits
🌐 **No APIs Required**: Uses OpenStreetMap tiles (no API keys needed), in-memory storage only
📍 **Geolocation**: Browser geolocation to automatically detect user country
💾 **Session Storage**: Tracks user's pulse count and remaining quota in browser

## Tech Stack

**Frontend:**
- HTML5
- CSS3 (with CSS variables for theming)
- Vanilla JavaScript (ES6+)
- Leaflet.js (map library via CDN)
- Socket.io Client (via CDN)

**Backend:**
- Node.js
- Express.js
- Socket.io
- In-memory storage (JavaScript objects)

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Steps

1. **Navigate to project directory:**
   ```bash
   cd GlobalPulseMap
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   This installs:
   - `express` - Web server framework
   - `socket.io` - Real-time bidirectional communication

3. **Start the server:**
   ```bash
   npm start
   ```
   Or for development:
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   - Navigate to `http://localhost:3000`
   - The application will start in light mode
   - Allow geolocation access (optional, for country detection)

## Usage

### Sending a Pulse

1. Click the **"Send Pulse 💓"** button
2. The pulse is sent to the server with your coordinates (if geolocation allowed)
3. Global counter updates in real-time
4. Your pulse is reflected in the map and top countries list
5. Activity feed shows recent pulses with timestamps

### Viewing Statistics

- **Global Pulse Count**: Large counter on the left sidebar
- **Top Countries**: Live leaderboard showing top 5 countries by pulse count
- **Your Stats**: Shows your pulses sent, detected country, and remaining session limit
- **Recent Activity**: Last 10 pulses with timestamps

### Map Interaction

- **Markers**: Color-coded circles represent pulse activity
  - Blue → Low activity
  - Green → Medium activity
  - Red → High activity
  - Marker size increases with pulse count
- **Click markers** to see country details and pulse count
- **Zoom & Pan** to explore different regions

### Theme Toggle

- Click the **🌙/☀️** button in top-right corner
- Theme preference is saved to `localStorage`

## Features Detail

### Rate Limiting

- **Max pulses per session**: 10 pulses per hour
- Tracked by session storage
- Server-side enforcement prevents abuse
- Button shows remaining quota

### Geolocation

- **Automatic detection**: Browser asks for permission
- **Fallback**: If denied, country shows as "Unknown"
- **Mock coordinates**: Server estimates country from lat/lon (production would use geo library)

### Responsive Design

- **Desktop** (1200px+): Three-column layout
- **Tablet** (768px-1199px): Two-column layout
- **Mobile** (<768px): Single column, stack layout
- **Touch-friendly**: Larger buttons and spacing

### Ad Placeholders

- Two ad spaces (top sidebar and right sidebar)
- Ready for Google Adsense integration
- Can be replaced with actual ad code

## File Structure

```
GlobalPulseMap/
├── package.json          # Project metadata and dependencies
├── server.js             # Express/Socket.io backend
├── index.html            # Main frontend page
├── style.css             # Complete styling with dark mode
├── script.js             # Client-side JavaScript logic
├── node_modules/         # Dependencies (created after npm install)
└── README.md             # This file
```

## API Reference

### Socket Events

**Client → Server:**
- `pulse`: Send a pulse with coordinates
  ```javascript
  socket.emit('pulse', { lat: number, lon: number });
  ```
- `getData`: Request current pulse data
  ```javascript
  socket.emit('getData');
  ```

**Server → Client:**
- `initData`: Initial data on connection
  ```javascript
  { global: number, countries: { [code]: count } }
  ```
- `pulseUpdate`: Real-time pulse update
  ```javascript
  { global: number, countries: {...}, country: string, timestamp: ISO string }
  ```
- `error`: Error message
  ```javascript
  { message: string }
  ```

## Performance Considerations

- **In-memory storage**: Fast but data lost on server restart
- **Broadcast updates**: All connected clients receive updates simultaneously
- **Client-side rate limiting**: Additional layer of abuse prevention
- **Session storage**: No server-side session database needed
- **CDN resources**: Leaflet and Socket.io loaded from CDN (no bundle overhead)

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 13+)
- Mobile browsers: Full responsive support

## Development Tips

### Testing Locally
- Open multiple browser tabs/windows to test real-time updates
- Use browser DevTools Network tab to see WebSocket messages
- Check Console for logs and errors

### Customization

**Change pulse limit:**
Edit `server.js` line ~18:
```javascript
const PULSE_LIMIT_PER_SESSION = 10; // Change this
```

**Add more countries:**
Edit `script.js` countryCoordinates object with more countries and their coordinates.

**Customize colors:**
Edit `style.css` CSS variables in `:root` selector.

**Change port:**
```bash
PORT=8000 npm start
```

## Known Limitations

- Data is lost when server restarts (in-memory only)
- Country detection uses approximate coordinates (not precise)
- No authentication or user tracking
- No persistent database
- Limited to 10 countries in mock geolocation

## Future Enhancements

- Add real geolocation library (GeoIP)
- Implement database persistence
- Add country flags and detailed stats
- User authentication with history
- Real Google Adsense integration
- Charts and analytics
- Mobile app version
- Leaderboard with timestamps

## License

MIT License - Feel free to use and modify

## Support

For issues or questions, check:
1. Browser console for error messages
2. Server logs in terminal
3. Network tab in DevTools for WebSocket issues
4. Geolocation permission settings

---

**GlobalPulseMap** - Feel the pulse of the world in real-time 🌍💓
