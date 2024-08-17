import Header from "@/components/Header"
import AddDocumentBtn from "@/components/ui/AddDocumentBtn"
import { Button } from "@/components/ui/button"
import { getDocuments } from "@/lib/actions/room.actions"
import { SignedIn, UserButton } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"
import { Divide } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import Docs from "./docs/[id]/page"
import { dateConverter } from "@/lib/utils"
import DeleteModal from "@/components/DeleteModal"
import Notifications from "@/components/Notifications"
const Home = async () => {
  const user = await currentUser()
  if(!user){
    redirect('/sign-in')
  }
  const roomDocs = await getDocuments(user.emailAddresses[0].emailAddress)
  return(
    <main className="home-container">
      <Header className="sticky left-0 top-0">
        <div className="flex items-center gap-2 lg:gap-4">
          <Notifications />
            <SignedIn>
              <UserButton />
            </SignedIn>
        </div>
      </Header>
      {roomDocs.data.length > 0 ?
       (<div className="document-list-container">
          <div className="document-list-title">
              <h3 className="text-28-semibold">Документы</h3>
              <AddDocumentBtn
               userId = {user.id}
               email = {user.emailAddresses[0].emailAddress}
               />
          </div>
          <ul className="document-ul">
            {roomDocs.data.map(({id, metadata, createdAt}: any) => (
              <li key={id} className="document-list-item">
                <Link href={`/docs/${id}`} className="flex flex-1 items-center gap-4">
                  <div className="hidden rounded-md bg-dark-500 p-2 sm:block">
                      <Image
                      src = '/assets/icons/doc.svg'
                      alt="File"
                      width={40}
                      height={40}
                      />
                  </div>
                  <div className="space-y-1">
                    <p className="line-clamp-1 text-lg">{metadata.title}</p>
                    <p className="text-sm font-light text-blue-100">Создан {dateConverter(createdAt)}</p>
                  </div>
                </Link>
                <DeleteModal  roomId = {id}/>
              </li>
            ))}
          </ul>
       </div>)
       : (<div className="document-list-empty">
        <Image
        src='/assets/icons/doc.svg'
        alt="Document"
        width={40}
        height={40}
        className="mx-auto"
        />
        <AddDocumentBtn
          userId = {user.id}
          email = {user.emailAddresses[0].emailAddress}
          />
      </div>)}
    </main>
  )
}

export default Home
