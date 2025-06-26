import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Migunov Polytech Management Dashboard",
  description: "Система бронирования пд на Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Providers>
          {children}
          <ToastContainer position="bottom-right" theme="dark" />
        </Providers>
      </body>
    </html>
  );
}
