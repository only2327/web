# Lost & Found System Setup Guide (Offline Practical)

This project has been set up with all dependencies installed locally so that it can be run **completely offline** during your practical exam.

## Prerequisites (Already Installed)
- Node.js installed on your machine
- MongoDB running locally on `localhost:27017`
- All NPM dependencies have already been downloaded to the `node_modules` folders.

## Folder Structure
- `/client` - React frontend
- `/server` - Express backend

## How to Run Offline During Exam

You will need to open **two** separate terminal windows.

### Terminal 1: Run Backend Server
1. Open a terminal.
2. Navigate to the server folder:
   ```bash
   cd "server"
   ```
3. Start the server:
   ```bash
   node server.js
   ```
   *You should see "MongoDB Connected successfully" and "Server running on port 5005".*

### Terminal 2: Run Frontend React App
1. Open a second terminal.
2. Navigate to the client folder:
   ```bash
   cd "client"
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *This will provide a local link (e.g., `http://localhost:5173/`). Open this link in your browser.*

## Important Offline Notes
- The React app uses standard locally installed React packages and Axios.
- We are using standard CSS (`index.css`) rather than external CDNs or Bootstrap.
- There are no external web fonts or icons that rely on an internet connection; basic system fonts are used as fallbacks if Google Fonts aren't cached. (The CSS does include an `@import` for Inter font, but if internet is down, it will gracefully fallback to `sans-serif`).
- MongoDB connects to your local `127.0.0.1:27017` instance. Ensure your MongoDB server/service is running before starting the Node server.
