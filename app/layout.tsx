import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HAUSOS - Decentralized Organization Intelligence',
  description: 'The Future of Decentralized Organization Intelligence',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
