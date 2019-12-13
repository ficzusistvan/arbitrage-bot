import { createLogger, format, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new DailyRotateFile({ filename: 'tradebot-%DATE%.log',
      dirname: './logs',
      datePattern: 'YYYY-MM-DD-HH',
      maxSize: '20m',
      maxFiles: '14d',
      level: 'warn'
    })
  ]
});

//
// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      format.colorize(),
      format.simple()
    )
  }));
}

export {
  logger
};