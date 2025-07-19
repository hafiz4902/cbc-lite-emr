// src/server.ts
import app from './app'; // Import the Express application instance from app.ts
                        // This will work because app.ts now has 'export default app;'

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Backend server is running at http://localhost:${PORT}`);
});
