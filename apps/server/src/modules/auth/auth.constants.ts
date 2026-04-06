import type { UserRole } from "./auth.types"

export const accessKeyEnvNamesByRole: Record<UserRole, string> = {
  receptionist: "RECEPTIONIST_ACCESS_KEY",
  safety: "SAFETY_ACCESS_KEY",
  observer: "OBSERVER_ACCESS_KEY",
}

const buildUsageMessage = () =>
  [
    "Missing required access key environment variables.",
    "Set all employee access keys before starting the server:",
    "RECEPTIONIST_ACCESS_KEY=<your-key>",
    "SAFETY_ACCESS_KEY=<your-key>",
    "OBSERVER_ACCESS_KEY=<your-key>",
  ].join("\n")

export const getAccessKeysByRole = (): Record<UserRole, string> => {
  const resolvedEntries = Object.entries(accessKeyEnvNamesByRole).map(
    ([role, envName]) => [role, process.env[envName]?.trim() ?? ""]
  )

  const missingEnvNames = resolvedEntries
    .filter(([, value]) => !value)
    .map(([role]) => accessKeyEnvNamesByRole[role as UserRole])

  if (missingEnvNames.length > 0) {
    throw new Error(
      `${buildUsageMessage()}\nMissing: ${missingEnvNames.join(", ")}`
    )
  }

  return Object.fromEntries(resolvedEntries) as Record<UserRole, string>
}

export const assertAccessKeysConfigured = () => {
  getAccessKeysByRole()
}
