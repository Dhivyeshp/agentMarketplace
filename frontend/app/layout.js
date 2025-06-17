import './globals.css'

export const metadata = {
  title: 'agentMarketPlace - Commission-Free Platform for Independent Professionals',
  description: 'Discover, connect, and work with the world\'s best independent creatives and clients. The commission-free platform for independent professionals.',
  keywords: 'freelancing, creative work, independent professionals, commission-free, marketplace',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}