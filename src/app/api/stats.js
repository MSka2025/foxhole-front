export async function fetchStats() {
  const res = await fetch("http://127.0.0.1:8000/stats");
  if (!res.ok) {
    throw new Error("Failed to fetch /stats");
  }
  return res.json();
}