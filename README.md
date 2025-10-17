# Hello World Web Application

A full-stack web application built with React and Node.js demonstrating client-server communication and interactive features.

## Features

- ✅ Welcome message display (Story 1 - P0)
- ✅ Interactive user greeting with personalized responses (Story 2 - P1)
- ✅ Real-time server communication (Story 3 - P1)
- ✅ Health status monitoring (Story 4 - P2)
- ✅ Modern, responsive UI design
- ✅ Error handling and fallback behavior

## Tech Stack

**Frontend:**
- React 18
- Vite (build tool)
- Modern CSS with responsive design

**Backend:**
- Node.js
- Express
- CORS enabled

## Prerequisites

- Node.js v20 or higher (see `.nvmrc`)
- npm or yarn

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd commentator-frontend
```

### 2. Install dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### 3. Start the application

You'll need two terminal windows:

**Terminal 1 - Start the backend server:**
```bash
cd server
npm start
```

The server will run on `http://localhost:3001`

**Terminal 2 - Start the frontend:**
```bash
cd client
npm run dev
```

The application will open in your browser at `http://localhost:5173`

## API Endpoints

- `GET /api/hello` - Returns a welcome message from the server
- `GET /api/greet/:name` - Returns a personalized greeting
- `GET /api/health` - Returns server health status

## Usage

1. **View Welcome Message**: The application displays a welcome message on load
2. **Interactive Greeting**: Enter your name in the input field and click "Greet Me" to receive a personalized greeting from the server
3. **Server Communication**: The app automatically fetches and displays messages from the backend
4. **Health Status**: Monitor the server status in the health indicator section

## Acceptance Criteria Validation

### Story 1: View Welcome Message ✅
- [x] User can navigate to the application URL
- [x] Application displays "Hello World" or welcome message
- [x] Page loads within 3 seconds
- [x] Message is clearly visible and readable

### Story 2: Interactive User Greeting ✅
- [x] User sees an input field for their name
- [x] User can type their name into the input
- [x] User can click a button or press enter to submit
- [x] Application displays personalized greeting
- [x] Greeting updates without full page reload

### Story 3: Server Communication ✅
- [x] Frontend makes request to backend API
- [x] Backend responds with data
- [x] Frontend displays server response
- [x] Error handling if server is unavailable

### Story 4: Application Health Status ✅
- [x] Health check endpoint available
- [x] Returns server status (up/down)
- [x] Displays on UI
- [x] Shows timestamp of last successful check

## Project Structure

```
commentator-frontend/
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.jsx        # Main application component
│   │   ├── App.css        # Application styles
│   │   └── main.jsx       # Application entry point
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── index.js           # Express server
│   └── package.json
└── README.md
```

## Development

- Frontend runs with hot module replacement (HMR) for instant updates
- Backend can be enhanced with nodemon for auto-restart on changes
- All code follows modern JavaScript/React best practices

## Troubleshooting

**Server connection errors:**
- Ensure the backend server is running on port 3001
- Check for any firewall or port conflicts
- Verify CORS is properly configured

**Frontend not loading:**
- Ensure all dependencies are installed (`npm install`)
- Check that port 5173 is available
- Clear browser cache and reload

## Future Enhancements

- User authentication
- Database integration
- Additional interactive features
- Production deployment configuration
- Automated testing suite

## License

ISC
