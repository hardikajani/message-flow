export const metadata = {
  title: 'Public Profile Link',
  description: 'this is Public Profile Link you can send the message to user',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}    
    </>
    
  )
}
