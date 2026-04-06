import type { FastifyRequest } from "fastify"
import type { Socket } from "socket.io"
import { authService } from "./auth.service"
import type { AuthenticatedUser, UserRole } from "./auth.types"

declare module "fastify" {
  interface FastifyRequest {
    authUser?: AuthenticatedUser
  }
}

export const requireRoles =
  (allowedRoles: readonly UserRole[]) => async (request: FastifyRequest) => {
    request.authUser = authService.authenticateRequest(request, allowedRoles)
  }

export const requireSocketRoles = (
  socket: Socket,
  allowedRoles: readonly UserRole[]
) => {
  const authUser = socket.data.authUser as AuthenticatedUser | undefined

  if (!authUser) {
    throw new Error("Unauthorized socket connection")
  }

  return authService.assertRole(authUser, allowedRoles)
}
