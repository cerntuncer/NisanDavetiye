import { createContext, useContext } from 'react'

const InviteContext = createContext<string | null>(null)

export function InviteProvider({
  inviteKey,
  children,
}: {
  inviteKey: string
  children: React.ReactNode
}) {
  return <InviteContext.Provider value={inviteKey}>{children}</InviteContext.Provider>
}

export function useInviteKey(): string {
  const key = useContext(InviteContext)
  if (!key) throw new Error('Davetiye anahtarı bulunamadı.')
  return key
}
