import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

class HealthCheckService {
    constructor() {
        this.dbConnection = null;
        this.isDbConnected = false;
        this.startTime = new Date();
        this.checks = {
            database: false,
            server: true,
            memory: true,
            uptime: true
        };
    }

    /**
     * Initialize database connection for health checks
     */
    async initializeDatabase() {
        try {
            this.dbConnection = new Sequelize({
                host: process.env.DB_HOST || 'localhost',
                port: process.env.DB_PORT || 3306,
                username: process.env.DB_USERNAME || 'root',
                password: process.env.DB_PASSWORD || '',
                database: process.env.DB_NAME || 'whatsapp_chatbot',
                dialect: 'mysql',
                logging: false,
                pool: {
                    max: 1,
                    min: 0,
                    acquire: 3000,
                    idle: 10000
                }
            });

            // Test database connection
            await this.dbConnection.authenticate();
            this.isDbConnected = true;
            this.checks.database = true;
            console.log('✅ Database health check: Connected');
            
            return true;
        } catch (error) {
            console.error('❌ Database health check failed:', error.message);
            this.checks.database = false;
            return false;
        }
    }

    /**
     * Perform comprehensive health check
     */
    async performHealthCheck() {
        const healthStatus = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: this.getUptime(),
            version: process.env.npm_package_version || '1.0.0',
            environment: process.env.NODE_ENV || 'development',
            checks: {
                database: await this.checkDatabase(),
                server: this.checkServer(),
                memory: this.checkMemory(),
                uptime: this.checkUptime()
            }
        };

        // Determine overall status
        const allChecksPass = Object.values(healthStatus.checks).every(check => check === true);
        healthStatus.status = allChecksPass ? 'healthy' : 'unhealthy';

        return healthStatus;
    }

    /**
     * Check database connectivity
     */
    async checkDatabase() {
        try {
            if (!this.dbConnection) {
                return false;
            }
            
            await this.dbConnection.authenticate();
            this.checks.database = true;
            return true;
        } catch (error) {
            console.error('Database health check failed:', error.message);
            this.checks.database = false;
            return false;
        }
    }

    /**
     * Check server status
     */
    checkServer() {
        try {
            this.checks.server = process.uptime() > 0;
            return this.checks.server;
        } catch (error) {
            this.checks.server = false;
            return false;
        }
    }

    /**
     * Check memory usage
     */
    checkMemory() {
        try {
            const memUsage = process.memoryUsage();
            const memUsageMB = {
                rss: Math.round(memUsage.rss / 1024 / 1024),
                heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
                heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
                external: Math.round(memUsage.external / 1024 / 1024)
            };

            // Consider unhealthy if heap usage is too high (> 1GB)
            const isHealthy = memUsageMB.heapUsed < 1024;
            this.checks.memory = isHealthy;
            
            return isHealthy;
        } catch (error) {
            this.checks.memory = false;
            return false;
        }
    }

    /**
     * Check uptime
     */
    checkUptime() {
        try {
            const uptime = process.uptime();
            this.checks.uptime = uptime > 0;
            return this.checks.uptime;
        } catch (error) {
            this.checks.uptime = false;
            return false;
        }
    }

    /**
     * Get server uptime in human readable format
     */
    getUptime() {
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    /**
     * Get memory usage details
     */
    getMemoryUsage() {
        const memUsage = process.memoryUsage();
        return {
            rss: Math.round(memUsage.rss / 1024 / 1024),
            heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
            heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
            external: Math.round(memUsage.external / 1024 / 1024),
            unit: 'MB'
        };
    }

    /**
     * Close database connection
     */
    async closeConnection() {
        if (this.dbConnection) {
            await this.dbConnection.close();
            this.isDbConnected = false;
        }
    }
}

export default HealthCheckService;
