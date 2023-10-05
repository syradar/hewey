import { Err, Ok, Result } from 'ts-results'
import { z } from 'zod'

export function parse_zod_schema<T>(
  schema: z.Schema<T>,
  value: unknown,
): Result<T, Error> {
  try {
    const parsed_value = schema.parse(value)
    return Ok(parsed_value)
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return Err(error)
    }

    return Err(new Error(error?.toString()))
  }
}
