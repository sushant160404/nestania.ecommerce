export function getAllowedOrigins(): string[] {
  return (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);
}
