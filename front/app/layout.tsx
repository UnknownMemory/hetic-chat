import './globals.css';
import { Inter } from 'next/font/google';

import UserProvider from "./context";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Hetic Chat',
  description: 'Chat App',
}

export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        <html lang="en">
          <body className={inter.className}>
          <div className={"h-full w-full"}>
              <UserProvider>
                {children}
              </UserProvider>
          </div>
          </body>
        </html>
    )
}
