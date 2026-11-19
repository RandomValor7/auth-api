export default function Home() {
  return (
    <main style={{ fontFamily: "system-ui", padding: 40 }}>
      <h1>Auth API con Next.js</h1>
      <p>Backend funcionando. Endpoints disponibles:</p>
      <ul>
        <li>GET /api/health</li>
        <li>POST /api/auth/register</li>
        <li>POST /api/auth/login</li>
        <li>GET, POST /api/productos (requiere token)</li>
        <li>GET, PUT, DELETE /api/productos/:id (requiere token)</li>
      </ul>
    </main>
  );
}
