// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import axios from "axios";
import crypto from "crypto";
import { z } from "zod";
var OSRM_BASE_URL = "https://router.project-osrm.org/route/v1";
var clients = /* @__PURE__ */ new Set();
var clientAreas = /* @__PURE__ */ new Map();
var clientTransportModes = /* @__PURE__ */ new Map();
var constructionZones = [
  {
    id: "1",
    location: [78.5, 17.4],
    description: "Bridge repair work",
    severity: "medium",
    startDate: "2023-10-01",
    endDate: "2024-12-31",
    affectedRoads: ["NH65"]
  },
  {
    id: "2",
    location: [78.6, 17.45],
    description: "Road widening project",
    severity: "high",
    startDate: "2024-01-15",
    endDate: "2024-11-30",
    affectedRoads: ["NH44"]
  },
  {
    id: "3",
    location: [78.42, 17.43],
    description: "Utility work",
    severity: "low",
    startDate: "2024-02-01",
    endDate: "2024-08-31",
    affectedRoads: ["Local roads"]
  },
  {
    id: "4",
    location: [78.47, 17.41],
    description: "Pothole repairs",
    severity: "low",
    startDate: "2024-05-15",
    endDate: "2024-06-30",
    affectedRoads: ["City streets"]
  },
  {
    id: "5",
    location: [78.55, 17.38],
    description: "Major intersection reconstruction",
    severity: "high",
    startDate: "2024-03-01",
    endDate: "2025-01-31",
    affectedRoads: ["NH65", "State Highway 1"]
  }
];
var trafficUpdates = [];
var parseCoordinate = (coord) => {
  const schema = z.tuple([z.number(), z.number()]);
  return schema.parse(coord);
};
async function registerRoutes(app2) {
  const httpServer = createServer(app2);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");
    clients.add(ws);
    clientTransportModes.set(ws, "driving");
    ws.send(JSON.stringify({
      type: "constructionZones",
      data: constructionZones
    }));
    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message);
        switch (data.type) {
          case "subscribe":
            if (data.area && data.area.center && data.area.radius) {
              clientAreas.set(ws, {
                center: data.area.center,
                radius: data.area.radius
              });
              console.log(`Client subscribed to area: ${JSON.stringify(data.area)}`);
            } else if (data.area && data.area.radius) {
              clientAreas.set(ws, {
                center: [78.5, 17.4],
                // Default center
                radius: data.area.radius
              });
              console.log(`Client subscribed to default area with radius: ${data.area.radius}km`);
            }
            break;
          case "updateTransportMode":
            if (data.mode && ["driving", "walking", "cycling", "transit"].includes(data.mode)) {
              clientTransportModes.set(ws, data.mode);
              console.log(`Client updated transport mode to: ${data.mode}`);
            }
            break;
          default:
            console.log(`Received unknown message type: ${data.type}`);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    });
    ws.on("close", () => {
      console.log("WebSocket client disconnected");
      clients.delete(ws);
      clientAreas.delete(ws);
      clientTransportModes.delete(ws);
    });
  });
  setInterval(() => sendTrafficUpdates(), 15e3);
  app2.get("/api/geocode", async (req, res) => {
    try {
      const query = req.query.q;
      const isReverse = req.query.reverse === "true";
      if (!query) {
        return res.status(400).json({ message: "Query parameter is required" });
      }
      let url;
      if (isReverse) {
        const [lat, lon] = query.split(",").map((coord) => parseFloat(coord.trim()));
        if (isNaN(lat) || isNaN(lon)) {
          return res.status(400).json({ message: "Invalid coordinates format" });
        }
        url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
      } else {
        url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`;
      }
      const response = await axios.get(url, {
        headers: {
          "User-Agent": "EasyRoutePlanner/1.0"
        }
      });
      if (isReverse) {
        const result = response.data;
        if (!result) {
          return res.json([]);
        }
        return res.json([{
          name: result.name || result.display_name.split(",")[0],
          displayName: result.display_name,
          lat: parseFloat(result.lat),
          lon: parseFloat(result.lon)
        }]);
      } else {
        const results = response.data.map((item) => ({
          name: item.name || item.display_name.split(",")[0],
          displayName: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon)
        }));
        return res.json(results);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      res.status(500).json({ message: "Failed to search for places" });
    }
  });
  app2.post("/api/routes", async (req, res) => {
    try {
      const source = parseCoordinate(req.body.source);
      const destination = parseCoordinate(req.body.destination);
      const transportMode = req.body.transportMode || "driving";
      const profile = transportMode === "transit" ? "driving" : transportMode;
      const coordinates = `${source[0]},${source[1]};${destination[0]},${destination[1]}`;
      const response = await axios.get(`${OSRM_BASE_URL}/${profile}/${coordinates}?alternatives=true&steps=true&geometries=polyline&overview=full`);
      if (response.data.code !== "Ok") {
        return res.status(400).json({ message: "Failed to find routes" });
      }
      const routes = response.data.routes.map((route, index) => {
        const hasTraffic = Math.random() > 0.3;
        let severity;
        let delay = 0;
        if (hasTraffic) {
          const rand = Math.random();
          if (rand < 0.33) {
            severity = "low";
          } else if (rand < 0.66) {
            severity = "medium";
            delay = Math.floor(Math.random() * 8) + 3;
          } else {
            severity = "high";
            delay = Math.floor(Math.random() * 15) + 10;
          }
        }
        const steps = [];
        route.legs.forEach((leg) => {
          leg.steps.forEach((step) => {
            steps.push({
              distance: step.distance,
              duration: step.duration,
              geometry: step.geometry,
              name: step.name,
              instruction: step.maneuver.instruction || step.name,
              maneuver: {
                type: step.maneuver.type,
                modifier: step.maneuver.modifier,
                location: step.maneuver.location ? [step.maneuver.location[0], step.maneuver.location[1]] : void 0,
                bearing_before: step.maneuver.bearing_before,
                bearing_after: step.maneuver.bearing_after
              }
            });
          });
        });
        return {
          distance: route.distance,
          duration: hasTraffic && severity === "high" ? route.duration + delay * 60 : route.duration,
          geometry: route.geometry,
          steps,
          transportMode,
          isSelected: index === 0,
          hasTraffic,
          severity,
          delay
        };
      });
      res.json(routes);
    } catch (error) {
      console.error("Routing error:", error);
      res.status(500).json({ message: "Failed to get routes" });
    }
  });
  return httpServer;
}
function sendTrafficUpdates() {
  if (clients.size === 0) return;
  const generateTrafficUpdate = () => {
    const id = crypto.randomUUID();
    const severities = ["low", "medium", "high"];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const clientAreasList = Array.from(clientAreas.values());
    let location;
    if (clientAreasList.length > 0) {
      const randomArea = clientAreasList[Math.floor(Math.random() * clientAreasList.length)];
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * randomArea.radius * 0.8;
      const latOffset = distance * Math.sin(angle) / 111;
      const lngOffset = distance * Math.cos(angle) / (111 * Math.cos(randomArea.center[1] * Math.PI / 180));
      location = [
        randomArea.center[0] + lngOffset,
        randomArea.center[1] + latOffset
      ];
    } else {
      location = [
        78.4 + Math.random() * 0.2,
        17.4 + Math.random() * 0.1
      ];
    }
    const descriptions = {
      low: [
        "Minor slowdown",
        "Slightly congested",
        "Light traffic",
        "Traffic flowing well"
      ],
      medium: [
        "Moderate congestion",
        "Slower than usual traffic",
        "Busy conditions",
        "Expect some delays"
      ],
      high: [
        "Heavy traffic jam",
        "Major congestion",
        "Significant delays",
        "Standstill traffic"
      ]
    };
    const description = descriptions[severity][Math.floor(Math.random() * descriptions[severity].length)];
    return {
      id,
      location,
      description,
      severity,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      speed: severity === "high" ? Math.random() * 20 : severity === "medium" ? 20 + Math.random() * 30 : 50 + Math.random() * 40,
      congestion: severity === "high" ? 0.8 + Math.random() * 0.2 : severity === "medium" ? 0.4 + Math.random() * 0.4 : Math.random() * 0.4
    };
  };
  const update = generateTrafficUpdate();
  trafficUpdates.unshift(update);
  while (trafficUpdates.length > 20) {
    trafficUpdates.pop();
  }
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      const clientArea = clientAreas.get(client);
      if (clientArea) {
        const lat1 = clientArea.center[1];
        const lon1 = clientArea.center[0];
        const lat2 = update.location[1];
        const lon2 = update.location[0];
        const latDiff = (lat2 - lat1) * 111;
        const lonDiff = (lon2 - lon1) * 111 * Math.cos(lat1 * Math.PI / 180);
        const distance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
        if (distance <= clientArea.radius) {
          client.send(JSON.stringify({
            type: "trafficUpdate",
            data: update
          }));
        }
      }
    }
  });
  if (Math.random() < 0.1) {
    const updateExisting = Math.random() < 0.5 && constructionZones.length > 0;
    if (updateExisting) {
      const zoneIndex = Math.floor(Math.random() * constructionZones.length);
      const zone = constructionZones[zoneIndex];
      const currentEndDate = new Date(zone.endDate);
      const newEndDate = new Date(currentEndDate);
      if (Math.random() < 0.5) {
        newEndDate.setDate(currentEndDate.getDate() + Math.floor(Math.random() * 30));
      } else {
        newEndDate.setDate(currentEndDate.getDate() - Math.floor(Math.random() * 10));
      }
      constructionZones[zoneIndex] = {
        ...zone,
        endDate: newEndDate.toISOString().split("T")[0],
        description: Math.random() < 0.3 ? zone.description + " (Updated)" : zone.description
      };
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: "constructionUpdate",
            data: constructionZones[zoneIndex]
          }));
        }
      });
    } else {
      const clientAreasList = Array.from(clientAreas.values());
      if (clientAreasList.length > 0) {
        const randomArea = clientAreasList[Math.floor(Math.random() * clientAreasList.length)];
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * randomArea.radius * 0.7;
        const latOffset = distance * Math.sin(angle) / 111;
        const lngOffset = distance * Math.cos(angle) / (111 * Math.cos(randomArea.center[1] * Math.PI / 180));
        const location = [
          randomArea.center[0] + lngOffset,
          randomArea.center[1] + latOffset
        ];
        const descriptions = [
          "Road resurfacing work",
          "Bridge maintenance",
          "Utility installation",
          "Pothole repairs",
          "Lane expansion project",
          "Sidewalk construction",
          "Drainage improvements",
          "Traffic signal installation"
        ];
        const severities = ["low", "medium", "high"];
        const startDate = /* @__PURE__ */ new Date();
        const endDate = /* @__PURE__ */ new Date();
        endDate.setDate(startDate.getDate() + 30 + Math.floor(Math.random() * 90));
        const newZone = {
          id: crypto.randomUUID(),
          location,
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
          affectedRoads: ["Local roads"]
        };
        constructionZones.push(newZone);
        clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: "constructionUpdate",
              data: newZone
            }));
          }
        });
      }
    }
  }
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    // Add this section
    port: 5173,
    // Optional: Explicitly set Vite's port
    host: true,
    // Expose to network (matches --host flag)
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true
      }
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import cors from "cors";
var app = express2();
app.use(cors());
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") !== "development") {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen(port, "127.0.0.1", () => {
    log(`Serving on port ${port}`);
  });
})();
