"use client"

import Loader from '@/components/Loader'
import {ClientSideSuspense, LiveblocksProvider} from '@liveblocks/react/suspense'
import { ReactNode } from 'react'
import { GetClerkUser, getDocumentUsers } from '@/lib/actions/user.actions'
import { useUser } from '@clerk/nextjs'

const Provider = ({children}: {children: ReactNode}) => {
  const {user: ClerkUser} = useUser()
  return (
    <div>
        <LiveblocksProvider authEndpoint='/api/liveblocks-auth'
        resolveUsers={async({userIds}) => {
          const users = await GetClerkUser({userIds});
          return users

        }}

        resolveMentionSuggestions={async({text, roomId}) => {
          const roomUsers = await getDocumentUsers(
            {roomId,
              currentUser: ClerkUser?.emailAddresses[0].emailAddress!,
              text
            }
          )
          return roomUsers
        }}
        >
        <ClientSideSuspense fallback={<Loader />}>
          {children}
        </ClientSideSuspense>
    </LiveblocksProvider>
    </div>
  )
}

export default Provider