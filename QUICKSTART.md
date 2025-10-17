# Quick Start Guide

## Prerequisites Check
- Node.js v20+ installed
- npm installed

## Installation (5 minutes)

### Step 1: Install all dependencies
```bash
npm run install:all
```

Or manually:
```bash
cd server && npm install
cd ../client && npm install
```

## Running the Application

### Option 1: Two Terminal Windows (Recommended)

**Terminal 1 - Backend:**
```bash
cd server
npm start
```
✅ Server will start on http://localhost:3001

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
✅ App will open on http://localhost:5173

### Option 2: Using package.json scripts

**Terminal 1:**
```bash
npm run dev:server
```

**Terminal 2:**
```bash
npm run dev:client
```

## Testing the Application

1. Open http://localhost:5173 in your browser
2. You should see "Hello World Application" with a welcome message
3. Try the interactive greeting:
   - Enter your name in the input field
   - Click "Greet Me"
   - See personalized greeting from the server
4. Check the health status indicator showing server status

## Troubleshooting

### Port already in use
- Backend (3001): Change PORT in `server/index.js`
- Frontend (5173): Vite will auto-select next available port

### Server connection errors
- Ensure backend is running before frontend
- Check http://localhost:3001/api/health in browser

### Dependencies issues
```bash
rm -rf client/node_modules server/node_modules
npm run install:all
```

## Features Verification

✅ **Story 1 (P0)**: Welcome message displays immediately  
✅ **Story 2 (P1)**: Interactive greeting with user input  
✅ **Story 3 (P1)**: Real-time server communication  
✅ **Story 4 (P2)**: Health status monitoring  

## Next Steps

- Explore the code in `client/src/App.jsx`
- Check API endpoints in `server/index.js`
- Customize styling in `client/src/App.css`
- Add new features following the existing patterns

## Need Help?

See the main [README.md](README.md) for detailed documentation.
