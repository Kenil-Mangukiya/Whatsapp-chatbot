import express from 'express';
import HealthCheckService from '../services/health.service.js';

const router = express.Router();
const healthService = new HealthCheckService();

// Initialize health service
await healthService.initializeDatabase();

/**
 * GET /health - Comprehensive health check endpoint
 */
router.get('/health', async (req, res) => {
    try {
        const healthStatus = await healthService.performHealthCheck();
        
        const statusCode = healthStatus.status === 'healthy' ? 200 : 503;
        
        res.status(statusCode).json({
            ...healthStatus,
            memory: healthService.getMemoryUsage(),
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Health check error:', error);
        res.status(503).json({
            status: 'unhealthy',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * GET /health/live - Simple liveness probe
 */
router.get('/health/live', (req, res) => {
    res.status(200).json({
        status: 'alive',
        timestamp: new Date().toISOString(),
        uptime: healthService.getUptime()
    });
});

/**
 * GET /health/ready - Readiness probe
 */
router.get('/health/ready', async (req, res) => {
    try {
        const dbCheck = await healthService.checkDatabase();
        
        // Check if database is configured
        const isDbConfigured = process.env.DB_HOST && process.env.DB_USERNAME && process.env.DB_NAME;
        
        if (dbCheck) {
            res.status(200).json({
                status: 'ready',
                database: isDbConfigured ? 'connected' : 'not_configured',
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(503).json({
                status: 'not_ready',
                database: 'disconnected',
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        res.status(503).json({
            status: 'not_ready',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * GET /health/metrics - Detailed metrics
 */
router.get('/health/metrics', (req, res) => {
    try {
        const metrics = {
            timestamp: new Date().toISOString(),
            uptime: healthService.getUptime(),
            memory: healthService.getMemoryUsage(),
            process: {
                pid: process.pid,
                platform: process.platform,
                nodeVersion: process.version,
                environment: process.env.NODE_ENV || 'development'
            },
            database: {
                connected: healthService.isDbConnected
            }
        };

        res.status(200).json(metrics);
    } catch (error) {
        res.status(500).json({
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

export default router;
