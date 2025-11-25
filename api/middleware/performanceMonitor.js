import os from 'os';
import { performance } from 'perf_hooks';

/**
 * Performance monitoring middleware
 * Tracks CPU usage, memory usage, and execution time for routes
 */
export const performanceMonitor = (options = {}) => {
    const {
        logToConsole = true,
        logToResponse = false,
        logLevel = 'info' // 'info', 'detailed', 'minimal'
    } = options;

    return async (req, res, next) => {
        // ============================================================
        // START: Capture metrics when endpoint is hit
        // This marks the beginning of the request lifecycle
        // ============================================================
        const startCpu = process.cpuUsage();
        const startTime = performance.now();
        const startMemory = process.memoryUsage();
        const systemCpuBefore = getSystemCpuUsage();

        // Flag to ensure we only log metrics once
        let metricsLogged = false;

        // Function to calculate and log metrics when endpoint finishes serving
        const logMetricsOnce = () => {
            if (metricsLogged) return;
            metricsLogged = true;

            // ============================================================
            // END: Calculate metrics when response is completely sent
            // This marks the end of the request lifecycle
            // ============================================================
            calculateAndLogMetrics({
                startCpu,
                startTime,
                startMemory,
                systemCpuBefore,
                req,
                res,
                logToConsole,
                logToResponse,
                logLevel
            });
        };

        // Listen for 'finish' event - fires when response is completely sent to client
        // This happens AFTER the route handler completes and response is sent
        res.once('finish', logMetricsOnce);

        // Also handle 'close' event in case connection is closed before finish
        // This ensures we capture metrics even if connection is terminated early
        res.once('close', logMetricsOnce);

        // Proceed to route handler
        // The timing will include: middleware → route handler → response sending
        next();
    };
};

/**
 * Calculate system-wide CPU usage percentage
 */
const getSystemCpuUsage = () => {
    const cpus = os.cpus();
    if (cpus.length === 0) return 0;

    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach(cpu => {
        for (const type in cpu.times) {
            totalTick += cpu.times[type];
        }
        totalIdle += cpu.times.idle;
    });

    const idle = totalIdle / cpus.length;
    const total = totalTick / cpus.length;
    const usage = 100 - ~~(100 * idle / total);

    return Math.max(0, Math.min(100, usage)); // Clamp between 0-100
};

/**
 * Calculate and log performance metrics
 */
const calculateAndLogMetrics = ({
    startCpu,
    startTime,
    startMemory,
    systemCpuBefore,
    req,
    res,
    logToConsole,
    logToResponse,
    logLevel
}) => {
    // Capture end metrics when response finishes serving
    const endCpu = process.cpuUsage(startCpu);
    const endTime = performance.now();
    const endMemory = process.memoryUsage();
    const systemCpuAfter = getSystemCpuUsage();

    // Calculate total duration: from endpoint hit to endpoint finished serving
    // This includes: middleware execution + route handler execution + response sending
    const duration = endTime - startTime;
    const cpuUser = endCpu.user / 1000; // microseconds to milliseconds
    const cpuSystem = endCpu.system / 1000;
    const cpuTotal = cpuUser + cpuSystem;
    const cpuPercent = duration > 0 ? ((cpuTotal / duration) * 100).toFixed(2) : '0.00';

    // Memory calculations
    const memoryUsed = (endMemory.heapUsed - startMemory.heapUsed) / 1024 / 1024; // MB
    const memoryTotal = endMemory.heapUsed / 1024 / 1024; // MB
    const memoryRss = (endMemory.rss - startMemory.rss) / 1024 / 1024; // MB

    // Get request info
    const route = req.route?.path || req.path || 'unknown';
    const method = req.method;
    const dataSize = req.body ? JSON.stringify(req.body).length : 0;
    const dataSizeKB = (dataSize / 1024).toFixed(2);

    // Build metrics object
    const metrics = {
        route: `${method} ${route}`,
        duration: `${duration.toFixed(2)}ms (${(duration / 1000).toFixed(2)}s)`,
        cpu: {
            total: `${cpuTotal.toFixed(2)}ms`,
            user: `${cpuUser.toFixed(2)}ms`,
            system: `${cpuSystem.toFixed(2)}ms`,
            percent: `${cpuPercent}%`,
            systemBefore: `${systemCpuBefore.toFixed(1)}%`,
            systemAfter: `${systemCpuAfter.toFixed(1)}%`,
            systemDelta: `${(systemCpuAfter - systemCpuBefore).toFixed(1)}%`
        },
        memory: {
            heapUsed: `${memoryUsed.toFixed(2)}MB`,
            heapTotal: `${memoryTotal.toFixed(2)}MB`,
            rss: `${memoryRss.toFixed(2)}MB`
        },
        request: {
            dataSize: `${dataSizeKB}KB`,
            timestamp: new Date().toISOString()
        }
    };

    // Log to console based on log level
    if (logToConsole) {
        logMetrics(metrics, logLevel);
    }

    // Add metrics to response headers if requested
    if (logToResponse) {
        res.setHeader('X-Performance-Duration', `${duration.toFixed(2)}ms`);
        res.setHeader('X-Performance-CPU', `${cpuPercent}%`);
        res.setHeader('X-Performance-Memory', `${memoryUsed.toFixed(2)}MB`);
    }
};

/**
 * Log metrics based on log level
 */
const logMetrics = (metrics, logLevel) => {
    const separator = '='.repeat(60);

    if (logLevel === 'minimal') {
        console.log(`⚡ ${metrics.route} | ${metrics.duration} | CPU: ${metrics.cpu.percent}`);
        return;
    }

    console.log(`\n${separator}`);
    console.log('📊 PERFORMANCE METRICS');
    console.log(separator);
    console.log(`📍 Route: ${metrics.route}`);
    console.log(`⏱️  Duration: ${metrics.duration}`);
    console.log(`\n💻 CPU Metrics:`);
    console.log(`   Total CPU Time: ${metrics.cpu.total}`);
    console.log(`   User CPU: ${metrics.cpu.user}`);
    console.log(`   System CPU: ${metrics.cpu.system}`);
    console.log(`   CPU Usage: ${metrics.cpu.percent}%`);
    console.log(`   System CPU: ${metrics.cpu.systemBefore} → ${metrics.cpu.systemAfter} (Δ${metrics.cpu.systemDelta})`);

    if (logLevel === 'detailed') {
        console.log(`\n🧠 Memory Metrics:`);
        console.log(`   Heap Used: ${metrics.memory.heapUsed}`);
        console.log(`   Heap Total: ${metrics.memory.heapTotal}`);
        console.log(`   RSS: ${metrics.memory.rss}`);
        console.log(`\n📦 Request Info:`);
        console.log(`   Data Size: ${metrics.request.dataSize}`);
        console.log(`   Timestamp: ${metrics.request.timestamp}`);
    }

    console.log(separator);
};

/**
 * Export a simple version for quick use
 */
export const simplePerformanceMonitor = performanceMonitor({ logLevel: 'minimal' });

/**
 * Export a detailed version
 */
export const detailedPerformanceMonitor = performanceMonitor({ 
    logLevel: 'detailed',
    logToResponse: true 
});

