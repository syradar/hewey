import Database from 'bun:sqlite'
import Elysia from 'elysia'
import { LumberjackService } from '../services/lumberjack'

const db = new Database('hewey.db.local')
create_user_table_migration()

function create_user_table_migration() {
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
