import { getReadingSessions, setReadingSessions } from './storage';

/**
 * 読書セッション（記録）を更新する
 * @param {{ id: string, date?: string, minutes?: number, startedAt?: number, endedAt?: number }} session - 更新するセッション（id 必須）
 * @returns {Object | null} 更新後のセッション、見つからない場合は null
 */
export function updateReadingSession(session) {
  const sessions = getReadingSessions();
  const index = sessions.findIndex((s) => s.id === session.id);
  if (index === -1) return null;
  sessions[index] = { ...sessions[index], ...session };
  setReadingSessions(sessions);
  return sessions[index];
}

/**
 * 読書セッション（記録）を削除する
 * @param {string} id - 削除するセッションの ID
 */
export function deleteReadingSession(id) {
  const sessions = getReadingSessions().filter((s) => s.id !== id);
  setReadingSessions(sessions);
}
