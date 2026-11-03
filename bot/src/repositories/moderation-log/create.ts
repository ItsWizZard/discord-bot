import { db } from "../../database/index.js";

export interface CreateModerationLogInput {
  targetId: string;
  targetTag: string;
  moderatorId: string;
  moderatorTag: string;
  action: "kick" | "timeout";
  reason: string | null;
  metadata?: Record<string, unknown>;
}

export async function createModerationLog({
  targetId,
  targetTag,
  moderatorId,
  moderatorTag,
  action,
  reason,
  metadata,
}: CreateModerationLogInput): Promise<void> {
  if (metadata === undefined) {
    await db.query(
      "INSERT INTO public.moderation_logs (target_id, target_tag, moderator_id, moderator_tag, action, reason, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())",
      [targetId, targetTag, moderatorId, moderatorTag, action, reason],
    );
    return;
  }

  await db.query(
    "INSERT INTO public.moderation_logs (target_id, target_tag, moderator_id, moderator_tag, action, reason, created_at, metadata) VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7)",
    [targetId, targetTag, moderatorId, moderatorTag, action, reason, JSON.stringify(metadata)],
  );
}
