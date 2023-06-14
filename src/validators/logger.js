import winston from 'winston';

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'http',
      format: winston.format.combine(
        winston.format.colorize({
            colors: {
              error: 'red',
              warn: 'yellow',
              info: 'blue',
              http: 'blackBG red',
              verbose: 'cyan',
              debug: 'magenta',
              silly: 'white',
            }
          }),
        winston.format.simple(),
      )
    }),
    new winston.transports.File({
      filename: 'error.log',
      level: 'warn',
    })
  ]
})

export const addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
  next();
}