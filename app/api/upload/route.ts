export async function POST() {
  // Placeholder upload handler. Implement file parsing in future.
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
