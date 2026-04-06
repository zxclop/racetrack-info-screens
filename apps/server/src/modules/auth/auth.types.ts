export const userRoles = ["receptionist", "safety", "observer"] as const

export type UserRole = (typeof userRoles)[number]

export interface AuthenticatedUser {
  role: UserRole
}

export interface ValidateAccessKeyDto {
  role: UserRole
  key: string
}

export interface ValidateAccessKeyResponseDto {
  ok: true
  role: UserRole
}
