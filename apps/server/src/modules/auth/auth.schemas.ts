import { FromSchema } from "json-schema-to-ts"

export const roleSchema = {
  type: "string",
  enum: ["receptionist", "safety", "observer"],
} as const

export const validateAccessKeySchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    role: roleSchema,
    key: { type: "string", minLength: 1 },
  },
  required: ["role", "key"],
} as const

export const validateAccessKeyResponseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ok: { const: true },
    role: roleSchema,
  },
  required: ["ok", "role"],
} as const

export type ValidateAccessKeyBodyDto = FromSchema<typeof validateAccessKeySchema>
export type ValidateAccessKeyReplyDto = FromSchema<typeof validateAccessKeyResponseSchema>
