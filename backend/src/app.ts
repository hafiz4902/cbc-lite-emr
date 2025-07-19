// src/app.ts
import express from 'express';
import cors from 'cors';
import patientRoutes from './routes/patient.routes';
import encounterRoutes from './routes/encounter.routes';
import consentRoutes from './routes/consent.routes'; // Import consent routes

const app = express(); // Initialize Express application

// Middleware
app.use(express.json()); // For parsing JSON request bodies
app.use(cors({
    origin: 'http://localhost:5173' // Allow requests from your frontend
}));

// --- Route Definitions ---
// Mount patient router
// All routes defined in patientRoutes (e.g., /)
// will be accessed under the /api/patients prefix
// Example: router.post('/') in patient.routes will become POST /api/patients
app.use('/api/patients', patientRoutes);
app.use('/api/encounters', encounterRoutes);
app.use('/api/consents', consentRoutes); // Mount consent router

// GET route for the root (/)
// This remains for server status messages when accessed directly in the browser
app.get('/', (req, res) => {
    res.send('CBC Lite backend API server is running with Express, TypeScript, and Prisma!');
});

// --- Export Application ---
// Important: Export 'app' as default so it can be imported by server.ts
export default app;
