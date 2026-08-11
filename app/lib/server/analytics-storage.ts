import { env } from 'cloudflare:workers';
import type { AnalyticsEvent } from '~/types';

interface InsertedAnalyticsEvent {
  id: number;
  created_at: string;
}

export async function createAnalyticsEvent(
  data: Omit<AnalyticsEvent, 'id' | 'created_at'>,
): Promise<AnalyticsEvent> {
  const inserted = await env.DB.prepare(
    `INSERT INTO analytics_events
       (event_type, page_path, referrer, session_id, ip_address, user_agent, metadata)
     VALUES (?1, ?2, ?3, ?4, NULL, NULL, ?5)
     RETURNING id, created_at`,
  )
    .bind(
      data.event_type,
      data.page_path,
      data.referrer,
      data.session_id,
      JSON.stringify(data.metadata),
    )
    .first<InsertedAnalyticsEvent>();

  if (!inserted) throw new Error('Analytics insert returned no row');

  return {
    ...data,
    id: inserted.id,
    created_at: inserted.created_at,
  };
}
