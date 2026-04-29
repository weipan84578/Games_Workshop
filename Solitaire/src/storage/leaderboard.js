const KEY_D1 = 'sol_leaderboard_d1';
const KEY_D3 = 'sol_leaderboard_d3';
const MAX_RECORDS = 20;

function getKey(drawMode) {
  return drawMode === 3 ? KEY_D3 : KEY_D1;
}

export function getLeaderboard(drawMode) {
  try {
    const data = localStorage.getItem(getKey(drawMode));
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export function addRecord(entry) {
  const records = getLeaderboard(entry.drawMode);
  records.push(entry);
  records.sort((a, b) => b.score - a.score);
  const trimmed = records.slice(0, MAX_RECORDS);
  try {
    localStorage.setItem(getKey(entry.drawMode), JSON.stringify(trimmed));
  } catch (e) {
    console.warn('Cannot save leaderboard:', e);
  }
  return trimmed;
}

export function clearLeaderboard(drawMode) {
  try {
    localStorage.removeItem(getKey(drawMode));
  } catch {}
}

export function sortRecords(records, sortBy) {
  const copy = [...records];
  if (sortBy === 'time') copy.sort((a, b) => a.time - b.time);
  else if (sortBy === 'date') copy.sort((a, b) => new Date(b.date) - new Date(a.date));
  else copy.sort((a, b) => b.score - a.score);
  return copy;
}
