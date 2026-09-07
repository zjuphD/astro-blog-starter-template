import briefings from "../data/briefings.json";

export const prerender = true;

export function GET() {
  const sorted = [...briefings].sort(
    (a, b) => b.publishedAt.localeCompare(a.publishedAt) || b.score - a.score,
  );

  return new Response(JSON.stringify(sorted), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
