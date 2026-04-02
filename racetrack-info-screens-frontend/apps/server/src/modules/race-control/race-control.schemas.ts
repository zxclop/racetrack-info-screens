import { FromSchema } from "json-schema-to-ts"

export const raceModeSchema = {
  type: "string",
  enum: ["idle", "safe", "hazard", "danger", "finish", "ended"],
} as const

export const startRaceSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sessionId: { type: "string", format: "uuid" },
  },
  required: ["sessionId"],
} as const

export const setRaceModeSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mode: {
      type: "string",
      enum: ["safe", "hazard", "danger", "finish"],
    },
  },
  required: ["mode"],
} as const

export const recordLapSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    racerName: { type: "string", minLength: 1, maxLength: 100 },
  },
  required: ["racerName"],
} as const

export const finishRaceSchema = {
  type: "object",
  additionalProperties: false,
  properties: {},
  required: [],
} as const

export const endSessionSchema = {
  type: "object",
  additionalProperties: false,
  properties: {},
  required: [],
} as const

export const currentRaceParticipantSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    name: { type: "string", minLength: 1, maxLength: 100 },
    laps: { type: "integer", minimum: 0 },
  },
  required: ["name", "laps"],
} as const

export const currentRaceBestLapSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    time: { type: "string" },
    racerName: { type: "string", minLength: 1, maxLength: 100 },
  },
  required: ["time", "racerName"],
} as const

export const currentRaceResponseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sessionId: { anyOf: [{ type: "string", format: "uuid" }, { type: "null" }] },
    sessionName: { anyOf: [{ type: "string" }, { type: "null" }] },
    mode: raceModeSchema,
    startedAt: { anyOf: [{ type: "string", format: "date-time" }, { type: "null" }] },
    endedAt: { anyOf: [{ type: "string", format: "date-time" }, { type: "null" }] },
    participants: {
      type: "array",
      items: currentRaceParticipantSchema,
    },
    bestLap: {
      anyOf: [currentRaceBestLapSchema, { type: "null" }],
    },
  },
  required: [
    "sessionId",
    "sessionName",
    "mode",
    "startedAt",
    "endedAt",
    "participants",
    "bestLap",
  ],
} as const

export type StartRaceDto = FromSchema<typeof startRaceSchema>
export type SetRaceModeDto = FromSchema<typeof setRaceModeSchema>
export type RecordLapDto = FromSchema<typeof recordLapSchema>
export type FinishRaceDto = FromSchema<typeof finishRaceSchema>
export type EndSessionDto = FromSchema<typeof endSessionSchema>
export type CurrentRaceResponseDto = FromSchema<typeof currentRaceResponseSchema>