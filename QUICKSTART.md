# Quick Start Guide

## Running the Application

The SystemD Services Monitor has two parts: a Flask backend and a React frontend.

### Option 1: Development Mode (Recommended for testing)

1. **Start the Flask backend** (in one terminal):
   ```bash
   python3 app.py
   ```
   The Flask server will start on `http://localhost:5000`

2. **Start the React frontend** (in another terminal):
   ```bash
   npm run dev
   ```
   The Vite dev server will start on `http://localhost:5173`

3. Open your browser to `http://localhost:5173`

The Vite dev server is configured to proxy API requests to the Flask backend automatically.

### Option 2: Production Mode

1. **Build the React app**:
   ```bash
   npm run build
   ```

2. The Flask app is already configured to serve the React build from the `dist/` folder.

3. **Start the Flask backend**:
   ```bash
   python3 app.py
   ```

4. Open your browser to `http://localhost:5000`

### Troubleshooting

If you see "Flask backend is not running" error:
- Make sure the Flask server is running: `python3 app.py`
- Check that port 5000 is not in use by another application
- Verify that Flask is installed: `pip3 install -r requirements.txt`

### Note on Service Control

Service control actions (start/stop/restart) require sudo privileges. Make sure:
- The Flask app has permission to run systemctl commands
- Or configure sudoers as described in DEPLOYMENT.md
