import type { GuildMember, PermissionResolvable } from "discord.js";

export function hasPermissions(member: GuildMember | null | undefined, permissions: PermissionResolvable): boolean {
  return member?.permissions.has(permissions) ?? false;
}
