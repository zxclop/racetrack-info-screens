import { FromSchema } from "json-schema-to-ts"

export const bestLapSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
        time: { type: "string", format: "time" },
        racerName: { type: "string", minLength: 1, maxLength: 100 }
    },
    required: ["time", "racerName"]
} as const

export const raceSessionSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
        id: { type: "string", format: "uuid" },
        name: { type: "string", minLength: 1, maxLength: 100 },
        racerNames: { 
            type: "array", 
            items: { type: "string", minLength: 1, maxLength: 100 },
            // minItems: 1
        },
        startTime: { type: "string", format: "date-time" },
        endTime: { type: "string", format: "date-time" },
        bestLap: bestLapSchema,
    },
    required: ["id", "name", "racerNames", "startTime", "endTime"]
} as const

export const createRaceSessionSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
        name: { type: "string", minLength: 1, maxLength: 100 },
        racerNames: { 
            type: "array", 
            items: { type: "string", minLength: 1, maxLength: 100 },
            // minItems: 1 
        },
        startTime: { type: "string", format: "date-time" },
        endTime: { type: "string", format: "date-time" },
    },
    required: ["name", "racerNames", "startTime", "endTime"]
} as const

export const updateRaceSessionSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
        name: { type: "string", minLength: 1, maxLength: 100 },
        racerNames: { 
            type: "array",
            items: { type: "string", minLength: 1, maxLength: 100 },
            // minItems: 1 
        },
        startTime: { type: "string", format: "date-time" },
        endTime: { type: "string", format: "date-time" },
        bestLap: bestLapSchema,
    },
    required: []
} as const

export const idParamsSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
        id: { type: "string", format: "uuid" }
    },
    required: ["id"]
} as const

export type RaceSessionDto = FromSchema<typeof raceSessionSchema>
export type CreateRaceSessionDto = FromSchema<typeof createRaceSessionSchema>
export type UpdateRaceSessionDto = FromSchema<typeof updateRaceSessionSchema>
export type IdParamsDto = FromSchema<typeof idParamsSchema>
