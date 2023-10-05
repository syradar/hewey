import Database from 'bun:sqlite'
import Elysia from 'elysia'
import { LumberjackService } from '../services/lumberjack'
import { CONSTANTS } from '../../constants'

const db = await init_db()
await create_user_table_migration()

async function init_db() {
  const file = Bun.file(CONSTANTS.DB_FILE_NAME)
  const db_exists = await file.exists()
  if (!db_exists) {
    console.error(`Database file ${CONSTANTS.DB_FILE_NAME} does not exist.`)
    process.exit(1)
  }

  const db = new Database(CONSTANTS.DB_FILE_NAME, {
    create: false,
    readonly: true,
  })
  return db
}
async function create_user_table_migration() {
  const q = db.query(
    'CREATE TABLE IF NOT EXISTS "users" (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT NOT NULL);',
  )
  q.run()
}
function get_api_users(key: string) {
  const stmt = db.query('SELECT * FROM "users" WHERE key = ?')
  const result = stmt.get(key)

  return result
}

function getDb() {
  return {
    do: db,
    get_api_users,
  }
}

export const local_db = new Elysia({ name: 'store@setup' })
  .use(LumberjackService)
  .state(state => {
    const db = getDb()

    state.logger.info('local_db is initialized')

    return {
      db,
      ...state,
    }
  })
