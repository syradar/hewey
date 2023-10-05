import Elysia from 'elysia'
import { z } from 'zod'

const LOG_LEVEL = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
} as const

type LOG_LEVEL = (typeof LOG_LEVEL)[keyof typeof LOG_LEVEL]

export type Logger = {
  warn(...x: any): void
  error(...x: any): void
  info(...x: any): void
  debug(...x: any): void
}

class Lumberjack implements Logger {
  constructor(private logLevel: LOG_LEVEL = 0) {}

  warn(...x: any): void {
    if (this.logLevel >= LOG_LEVEL.warn) return
    console.warn('[HWY][WRN]', ...x)
  }
  error(...x: any): void {
    if (this.logLevel >= LOG_LEVEL.error) return
    console.error('[HWY][ERR]', ...x)
  }
  info(...x: any): void {
    console.info('[HWY][INF]', ...x)
  }
  debug(...x: any): void {
    if (this.logLevel >= LOG_LEVEL.debug) return
    console.debug('[HWY][DBG]', ...x)
  }
}

const LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const

export const LumberjackService = new Elysia({
  name: 'lumberjack@service',
}).state(() => {
  const logLevel = Bun.env.LOG_LEVEL ?? 'warn'

  if (!LOG_LEVELS.includes(logLevel)) {
    console.error(
      `Invalid log level: ${logLevel}. Valid log levels are: ${LOG_LEVELS.join(
        ', ',
      )}`,
    )
    process.exit(1)
  }

  const logger = new Lumberjack(LOG_LEVEL[logLevel as keyof typeof LOG_LEVEL])

  logger.info('Lumberjack runnning')
  logger.info('Log level:', logLevel)

  return {
    logger,
  }
})
