import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

export function validateRequest<T>(schema: z.ZodSchema<T>) {
  return async (request: NextRequest): Promise<{ data: T; error?: never } | { data?: never; error: NextResponse }> => {
    try {
      const body = await request.json()
      const data = schema.parse(body)
      return { data }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          error: NextResponse.json(
            {
              error: "Validation failed",
              details: error.errors.map((err) => ({
                field: err.path.join("."),
                message: err.message,
              })),
            },
            { status: 400 },
          ),
        }
      }
      return {
        error: NextResponse.json({ error: "Invalid request body" }, { status: 400 }),
      }
    }
  }
}

export function validateQueryParams<T>(
  schema: z.ZodSchema<T>,
  searchParams: URLSearchParams,
):
  | {
      data: T
      error?: never
    }
  | { data?: never; error: { message: string; details: any[] } } {
  try {
    const params = Object.fromEntries(searchParams.entries())
    const data = schema.parse(params)
    return { data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error: {
          message: "Invalid query parameters",
          details: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
      }
    }
    return {
      error: {
        message: "Invalid query parameters",
        details: [],
      },
    }
  }
}
