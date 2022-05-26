import winston from 'winston'

const format = winston.format

const logger = winston.createLogger({
    level: 'debug',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.metadata({ fillExcept: ['message', 'level', 'timestamp'] })
    ),
    transports: [
        new winston.transports.Console({
            format: format.combine(
                format.splat(),
                format.json(),
                format.colorize(),
                format.printf(
                    info => `${info.timestamp} ${info.level}: ${info.message}`
                )
            )
        })
    ]
})

const exportedLogger = {
    debug: logger.debug.bind(logger),
    info:  logger.info.bind(logger),
    warn:  logger.warn.bind(logger),
    error: logger.error.bind(logger)
}

export default exportedLogger
