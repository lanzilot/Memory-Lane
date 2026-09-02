import "./globals.css";

export const metadata = {
  title: "Memory Lane — Pick a Theme, Find the Pairs",
  description: "A memory match game for all ages. Pick a theme — animals, food, places, or celebrities — and clear the board.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen font-body antialiased">{children}</body>
    </html>
  );
}
