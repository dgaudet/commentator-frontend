# React 19 Application Initialization - Design

## Architecture Overview

### Technology Stack
- **Runtime**: Node.js (LTS version)
- **Framework**: React 19.x
- **Build Tool**: Vite 5.x
- **Package Manager**: npm
- **Development Server**: Vite dev server

### Project Structure
├── package.json ├── vite.config.js ├── index.html ├── src/ │ ├── main.jsx │ ├── App.jsx │ └── index.css └── public/ └── vite

## Component Design

### App Component
- Main application component
- Renders "Hello World" message
- Uses React 19 features (new JSX transform)
- Styled with basic CSS

### Entry Point
- `src/main.jsx` as application entry
- Uses `createRoot` from React 18+ API
- Mounts App component to DOM

## Dependencies

### Production Dependencies
- `react`: ^19.0.0
- `react-dom`: ^19.0.0

### Development Dependencies
- `@vitejs/plugin-react`: ^4.0.0
- `vite`: ^5.0.0
- `@types/react`: ^18.0.0
- `@types/react-dom`: ^18.0.0

## Configuration

### Vite Configuration
- React plugin for JSX support
- Hot Module Replacement (HMR)
- Development server on port 5173
- Build output to `dist/`

### Package.json Scripts
- `dev`: Start development server
- `build`: Create production build
- `preview`: Preview production build
- `start`: Alias for dev (requirement)
