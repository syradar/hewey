import { Elysia, t } from 'elysia'

import { api_validator_middleware } from './middlewares/api-validator'
import { local_db } from './data/db'
import { PhilipsHueService } from './services/hue'
import { to_hewey_light } from './models/hewey'
import { LumberjackService } from './services/lumberjack'
import { z } from 'zod'
import {
  philips_hue_light_schema,
  philips_hue_light_state_schema,
} from './models/philips-hue'

const app = new Elysia()
  .use(LumberjackService)
  .use(local_db)
  .use(api_validator_middleware)
  .use(PhilipsHueService)
  .group('/lights', app =>
    app
      .get(
        '/',
        async ({ philipsHue }) => {
          const lights = await philipsHue.getLights()
          return lights
            .map(phls => ({
              items: Object.keys(phls).map(key => to_hewey_light(phls[key])),
            }))
            .unwrapOr({
              items: [],
            })
        },

        {
          beforeHandle: [({ validate_api_key }) => validate_api_key()],
        },
      )
      .put(
        '/:id/state',
        async ({ params, set, body, philipsHue, store: { logger } }) => {
          const lightId = params.id
          const state = philips_hue_light_state_schema.partial().safeParse(body)

          if (!state.success) {
            set.status = 400
            return {
              error: state.error,
            }
          }

          const result = await philipsHue.updateLightState(lightId, state.data)

          return result
            .map(successes => ({ items: successes }))
            .unwrapOr({
              error: {},
            })
        },
        {
          beforeHandle: [({ validate_api_key }) => validate_api_key()],
        },
      ),
  )
  .get(
    '/users/:id',
    ({ params, store: { db, logger } }) => {
      const id = params.id

      const stmt = db.do.query('SELECT * FROM "users" WHERE id = ?')
      const result = stmt.get(id)

      logger.debug('result', result)

      return {
        time: new Date().toISOString(),
        result: result,
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  )
  .post(
    '/users/:key',
    async ({ params, store: { db, logger } }) => {
      const key = params.key

      const stmt = db.do.query('INSERT INTO "users" (key) VALUES (?)')
      const result = stmt.all(key)

      logger.debug('result', result)

      return result
    },
    {
      params: t.Object({
        key: t.String(),
      }),
    },
  )
  .listen(3000)

console.log(
  `[HWY][INF] is running at ${app.server?.hostname}:${app.server?.port}`,
)
