import CollaborativeRoom from "@/components/CollaborativeRoom"
import { Editor } from "@/components/editor/Editor"
import Header from "@/components/Header"
import { getDocument } from "@/lib/actions/room.actions"
import { GetClerkUser } from "@/lib/actions/user.actions"
import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const Docs = async ({params: {id}}: SearchParamProps) => {
    const clerkUser = await currentUser()

    if(!clerkUser){
        redirect('/sign-in')
    }

    const room = await getDocument({roomId: id, userId: clerkUser.emailAddresses[0].emailAddress})
    if(!room){
        redirect('/')
    }

    const userIds = Object.keys(room.usersAccesses)
    const users = await GetClerkUser({userIds})


    const usersData = users.map((user: User) => ({
        ...user,
        userType: room.usersAccesses[user.email]?.includes('room:write') ? 'editor' : 'viewer'
    }))

    const CurrentUserType = room.usersAccesses[clerkUser.emailAddresses[0].emailAddress]?.includes('room:write') ? 'editor' : 'viewer'
    return(
        <main className="flex w-full flex-col items-center">
           <CollaborativeRoom
                roomId={id}
                roomMetadata={room.metadata}
                users={usersData}
                currentUserType={CurrentUserType}
                />
        </main>
    )
}

export default Docs