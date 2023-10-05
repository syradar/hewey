import Elysia from 'elysia'
import { Logger, LumberjackService } from './lumberjack'
import { parse_zod_schema } from '../models/schema-parser'
import { philips_hue_lights_response_schema } from '../models/philips-hue'

class PhilipsHue {
  constructor(
    private hueBridgeApi: string,
    private apiKey: string,
    private logger: Logger,
  ) {
    logger.info('Philips Hue service initialized')
  }

  async getLights() {
    const source = `${this.hueBridgeApi}/${this.apiKey}/lights`
    const response = await fetch(source)
    const data = await response.json<any>()

    this.logger.debug('Philips Hue lights response', data)

    return parse_zod_schema(philips_hue_lights_response_schema, data)
  }
}
const hueBridgeApi = Bun.env.HUE_BRIDGE_URL
const apiKey = Bun.env.HUE_API_KEY

let instance: PhilipsHue | undefined

const getSingleton = (hueBridgeApi: string, apiKey: string, logger: Logger) => {
  if (instance) {
    return instance
  }

  instance = new PhilipsHue(hueBridgeApi, apiKey, logger)

  return instance
}

export const PhilipsHueService = new Elysia({
  name: 'philipshue@service',
})
  .use(LumberjackService)
  .derive(({ store: { logger } }) => {
    if (!hueBridgeApi) {
      logger.error('HUE_BRIDGE_URL is not set')
      throw new Error('HUE_BRIDGE_URL is not set')
    }

    if (!apiKey) {
      logger.error('HUE_BRIDGE_URL is not set')
      throw new Error('HUE_API_KEY is not set')
    }

    const philipsHue = getSingleton(hueBridgeApi, apiKey, logger)

    return {
      philipsHue,
    }
  })
