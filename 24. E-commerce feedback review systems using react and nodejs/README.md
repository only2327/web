# E-Commerce Feedback Review System

This is an offline-capable React and Node.js application for an E-Commerce Feedback Review System. It is completely independent of external CDNs so it will function properly in an environment without internet access.

## Tech Stack
* **Frontend**: React (Vite), React Bootstrap, Axios
* **Backend**: Node.js, Express, Mongoose
* **Database**: MongoDB (Local)

## Setup & Running Locally

1. Make sure your local MongoDB instance is running (`mongod` should be running on `127.0.0.1:27017`).
2. Open a terminal in this project directory.
3. Run the following command to start both the backend server and frontend development server at the same time:

   ```bash
   npm run dev
   ```

4. Alternatively, you can start them separately:
   * **Backend**: `npm run server` (Runs on http://localhost:5000)
   * **Frontend**: `npm run client` (Runs on http://localhost:5173)

5. Open your browser and navigate to `http://localhost:5173` to see the application.

## Features
* Premium dark mode aesthetic with glassmorphism UI.
* Add product reviews dynamically with star ratings.
* Fetch all previous reviews from the MongoDB database immediately upon load.
* No internet connection required after initial setup.
