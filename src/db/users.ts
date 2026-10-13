import { db } from './index.ts';
import { users, liveScores, chatMessages, adBanners } from './schema.ts';
import { desc, eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, name?: string) {
  try {
    const displayName = name || email.split('@')[0] || 'SportsViva Player';
    const result = await db
      .insert(users)
      .values({
        uid,
        email,
        name: displayName,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query failed in getOrCreateUser:', error);
    throw new Error('Failed to synchronize user profile.', { cause: error });
  }
}

export async function getUserByUid(uid: string) {
  try {
    const rows = await db.select().from(users).where(eq(users.uid, uid));
    return rows[0] || null;
  } catch (error) {
    console.error('Database query failed in getUserByUid:', error);
    throw new Error('Failed to load user profile.', { cause: error });
  }
}

export async function getLiveScoresFromDb(sport?: string) {
  try {
    if (sport) {
      return await db
        .select()
        .from(liveScores)
        .where(eq(liveScores.sport, sport))
        .orderBy(desc(liveScores.updatedAt));
    }
    return await db.select().from(liveScores).orderBy(desc(liveScores.updatedAt));
  } catch (error) {
    console.error('Database query failed in getLiveScoresFromDb:', error);
    throw new Error('Failed to load live scores.', { cause: error });
  }
}

export async function upsertLiveScoreInDb(payload: {
  matchId: string;
  sport: string;
  teamA: string;
  teamB: string;
  scoreA: string;
  scoreB: string;
  status: string;
  summary: string;
  updatedByUid?: string;
}) {
  try {
    const result = await db
      .insert(liveScores)
      .values({
        matchId: payload.matchId,
        sport: payload.sport,
        teamA: payload.teamA,
        teamB: payload.teamB,
        scoreA: payload.scoreA,
        scoreB: payload.scoreB,
        status: payload.status,
        summary: payload.summary,
        updatedByUid: payload.updatedByUid || '',
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: liveScores.matchId,
        set: {
          scoreA: payload.scoreA,
          scoreB: payload.scoreB,
          status: payload.status,
          summary: payload.summary,
          updatedByUid: payload.updatedByUid || '',
          updatedAt: new Date(),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query failed in upsertLiveScoreInDb:', error);
    throw new Error('Failed to update live score.', { cause: error });
  }
}

export async function getRecentChatMessages(room = 'global') {
  try {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.room, room))
      .orderBy(desc(chatMessages.createdAt))
      .limit(50);
  } catch (error) {
    console.error('Database query failed in getRecentChatMessages:', error);
    throw new Error('Failed to load chat messages.', { cause: error });
  }
}

export async function insertChatMessage(payload: {
  uid: string;
  senderName: string;
  senderRole?: string;
  room?: string;
  message: string;
  attachmentUrl?: string;
}) {
  try {
    const result = await db
      .insert(chatMessages)
      .values({
        uid: payload.uid,
        senderName: payload.senderName,
        senderRole: payload.senderRole || 'Member',
        room: payload.room || 'global',
        message: payload.message,
        attachmentUrl: payload.attachmentUrl || '',
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query failed in insertChatMessage:', error);
    throw new Error('Failed to send chat message.', { cause: error });
  }
}

export async function getActiveAdBanners() {
  try {
    return await db.select().from(adBanners).orderBy(desc(adBanners.updatedAt));
  } catch (error) {
    console.error('Database query failed in getActiveAdBanners:', error);
    throw new Error('Failed to load ad banners.', { cause: error });
  }
}
