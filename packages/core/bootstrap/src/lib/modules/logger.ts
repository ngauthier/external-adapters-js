import { uuid } from '../util'
import pino from 'pino'
import { wsRedactPaths } from '../middleware/ws/config'
import { cloneDeep } from 'lodash'
import { configRedactPaths } from '../config/logging'

const paths = [...wsRedactPaths, ...configRedactPaths]

const sensitiveKeys = [
  /cookie/i,
  /passw(or)?d/i,
  /^pw$/,
  /^pass$/i,
  /secret/i,
  /token/i,
  /api[-._]?key/i,
  /client/i,
]

export const censor = (v: string): string => {
  try {
    const url = new URL(v)
    url.searchParams.forEach((_, name) => {
      if (sensitiveKeys.some((rx) => rx.test(name))) {
        url.searchParams.set(name, 'REDACTED')
      }
    })
    return url.toString()
  } catch {
    // if not a URL
    return '[REDACTED]'
  }
}

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  prettyPrint: process.env.NODE_ENV === 'development',
  prettifier: require('pino-pretty'),
  formatters: {
    level(label) {
      return { level: label }
    },
  },
  hooks: {
    logMethod(inputArgs, method) {
      // flipping the order of inputs (switching from winston to pino)
      const length = inputArgs.length
      const arg1 = inputArgs.shift()
      if (length >= 2) {
        // if input includes message string + data object
        const arg2 = cloneDeep(inputArgs.shift())

        // add instanceId if not present
        if (typeof arg2 === 'object' && !arg2.instanceId) arg2.instanceId = uuid()

        return method.apply(this, [arg2, arg1, ...inputArgs])
      }
      return method.apply(this, [arg1, ...inputArgs])
    },
  },
  redact: {
    paths,
    censor,
  },
})
