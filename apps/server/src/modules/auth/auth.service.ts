import type { FastifyRequest } from "fastify"
import type { Socket } from "socket.io"
import { getAccessKeysByRole } from "./auth.constants"
import {
  AuthenticatedUser,
  UserRole,
  ValidateAccessKeyDto,
  ValidateAccessKeyResponseDto,
  userRoles,
} from "./auth.types"

type HttpError = Error & { statusCode: number }

const INVALID_AUTH_DELAY_MS = 500

const isUserRole = (value: unknown): value is UserRole =>
  typeof value === "string" && userRoles.includes(value as UserRole)

const createHttpError = (statusCode: number, message: string): HttpError => {
  const error = new Error(message) as HttpError
  error.statusCode = statusCode
  return error
}

const normalizeKey = (key: string) => key.trim()

const delayInvalidAuthResponse = async () =>
  new Promise((resolve) => setTimeout(resolve, INVALID_AUTH_DELAY_MS))

const isKeyValidForRole = (role: UserRole, providedKey: string) =>
  getAccessKeysByRole()[role] === normalizeKey(providedKey)

const parseBearerToken = (authorizationHeader?: string) => {
  if (!authorizationHeader) {
    throw createHttpError(401, "Missing Authorization header")
  }

  const [scheme, token] = authorizationHeader.split(" ")

  if (scheme !== "Bearer" || !token?.trim()) {
    throw createHttpError(401, "Expected a Bearer token")
  }

  return token.trim()
}

const findRoleByAccessKey = (key: string, allowedRoles?: readonly UserRole[]) => {
  const rolesToCheck = allowedRoles ?? userRoles

  return rolesToCheck.find((role) => isKeyValidForRole(role, key)) ?? null
}

export const authService = {
  async validateAccessKey({
    role,
    key,
  }: ValidateAccessKeyDto): Promise<ValidateAccessKeyResponseDto> {
    if (!isKeyValidForRole(role, key)) {
      await delayInvalidAuthResponse()
      throw createHttpError(401, "Invalid access key")
    }

    return {
      ok: true,
      role,
    }
  },

  authenticateRequest(
    request: FastifyRequest,
    allowedRoles: readonly UserRole[]
  ): AuthenticatedUser {
    const token = parseBearerToken(request.headers.authorization)

    const matchedAllowedRole = findRoleByAccessKey(token, allowedRoles)

    if (matchedAllowedRole) {
      return { role: matchedAllowedRole }
    }

    const actualRole = findRoleByAccessKey(token)

    if (!actualRole) {
      throw createHttpError(401, "Invalid access key")
    }

    throw createHttpError(403, `Role "${actualRole}" cannot access this resource`)
  },

  authenticateSocket(socket: Socket): AuthenticatedUser {
    const authPayload =
      typeof socket.handshake.auth === "object" && socket.handshake.auth
        ? socket.handshake.auth
        : {}

    const role = authPayload.role
    const key = authPayload.key

    if (!isUserRole(role) || typeof key !== "string" || !key.trim()) {
      throw createHttpError(401, "Authentication failed")
    }

    if (!isKeyValidForRole(role, key)) {
      throw createHttpError(401, "Authentication failed")
    }

    return { role }
  },

  assertRole(
    user: AuthenticatedUser,
    allowedRoles: readonly UserRole[]
  ): AuthenticatedUser {
    if (!allowedRoles.includes(user.role)) {
      throw createHttpError(403, `Role "${user.role}" cannot perform this action`)
    }

    return user
  },

  getInvalidAuthDelayMs() {
    return INVALID_AUTH_DELAY_MS
  },
}
