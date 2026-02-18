/**
 * 分数を「○時間○分」形式の文字列に変換する
 * @param {number} totalMinutes
 * @returns {string}
 */
export function formatMinutes(totalMinutes) {
  if (totalMinutes < 60) return `${totalMinutes}分`;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return m ? `${h}時間${m}分` : `${h}時間`;
}
