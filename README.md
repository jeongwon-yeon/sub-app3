# sub-app3

React, TypeScript, and Vite app for the Portal Route Sync demo.

Run the following commands from this repository:

    npm ci
    npm run dev

Open http://localhost:5176. Use localhost for every app so routing messages and the demo cookie use the configured hosts.

The portal runs on port 5173. The three iframe services run on ports 5174, 5175, and 5176. Start all four apps in separate terminals to try iframe navigation and the shared demo cookie.

The local routing SDK is included in the portal-route-sdk directory. Run npm run build to produce the app bundle.