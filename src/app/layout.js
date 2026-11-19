export const metadata = {
  title: "Auth API - Next.js",
  description: "Backend con autenticación y JWT",
};
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
