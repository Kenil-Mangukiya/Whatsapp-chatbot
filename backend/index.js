import dotenv from "dotenv";
import app from "./app.js";
import HealthCheckService from "./public/src/services/health.service.js";

dotenv.config({
    path: ".env"
});

const PORT = process.env.BACKEND_PORT;
const healthService = new HealthCheckService();

// Initialize health service and perform initial health check
async function initializeServer() {
    try {
        console.log('🚀 Starting Server...');
        
        // Initialize health service
        await healthService.initializeDatabase();
        
        // Start server
        const server = app.listen(PORT, async () => {
            console.log(`✅ Server is running on port ${PORT}`);
            console.log(`🌐 Health check available at: http://localhost:${PORT}/health`);
            
            // Perform immediate health check after server starts
            setTimeout(async () => {
                try {
                    console.log('🔍 Performing initial health check...');
                    const healthStatus = await healthService.performHealthCheck();
                    
                    if (healthStatus.status === 'healthy') {
                        console.log('✅ Initial health check: PASSED');
                        console.log(`📊 Database: ${healthStatus.checks.database ? 'Connected' : 'Disconnected'}`);
                        console.log(`💾 Memory: ${healthStatus.checks.memory ? 'OK' : 'Warning'}`);
                        console.log(`⏱️  Uptime: ${healthStatus.uptime}`);
                    } else {
                        console.log('❌ Initial health check: FAILED');
                        console.log('Health Status:', healthStatus);
                    }
                } catch (error) {
                    console.error('❌ Initial health check error:', error.message);
                }
            }, 2000); // Wait 2 seconds after server starts
        });

        // Graceful shutdown
        process.on('SIGTERM', async () => {
            console.log('🛑 SIGTERM received, shutting down gracefully...');
            await healthService.closeConnection();
            server.close(() => {
                console.log('✅ Server closed');
                process.exit(0);
            });
        });

        process.on('SIGINT', async () => {
            console.log('🛑 SIGINT received, shutting down gracefully...');
            await healthService.closeConnection();
            server.close(() => {
                console.log('✅ Server closed');
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
}

// Start the server
initializeServer();