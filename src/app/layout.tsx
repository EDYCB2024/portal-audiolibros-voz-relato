import type { Metadata } from "next";
import { Libre_Caslon_Text, Manrope } from "next/font/google";
import "./globals.css";

const libreCaslonText = Libre_Caslon_Text({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  subsets: ["latin"],
});

const manrope = Manrope({
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Voz & Relato - Reproductor de Audiolibros Inteligente",
  description: "Carga tus libros en formato PDF y escúchalos narrados con voces naturales y fluidas, con división automática por capítulos y resaltado interactivo de lectura.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${libreCaslonText.variable} ${manrope.variable} h-full antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-on-background">
        {children}
      </body>
    </html>
  );
}
