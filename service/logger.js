const pino = require('pino');

/**
 * Logging library pino
 * used throughout the project
 * logger.info()
 * logger.error()
 *  ... etc
 */
const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            ignore: "pid.hostname",
            translateTime: true
        }
    }
});

module.exports.logger = logger;