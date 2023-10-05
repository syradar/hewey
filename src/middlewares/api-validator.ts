import Elysia, { t } from 'elysia'
import { CONSTANTS } from '../../constants'
import { local_db } from '../data/db'

export const api_validator_middleware = new Elysia({
  name: 'api-validator@middlewares',
})
  .use(local_db)
  .guard({
    headers: t.Object({
      [CONSTANTS.API_KEY]: t.String(),
    }),
  })
  .derive(({ set, store: { logger, db }, headers }) => {
    logger.debug('[HWY] request headers:', headers)

    const validate_api_key = () => {
      const api_key = headers[CONSTANTS.API_KEY]
      if (!api_key) {
        set.status = 400
        return 'Bad Request'
      }
      const result = db.get_api_users(api_key)
      logger.debug('[HWY] result:', result)

      if (!result) {
        set.status = 401
        return 'Unauthorized'
      }
    }

    return {
      validate_api_key,
    }
  })
