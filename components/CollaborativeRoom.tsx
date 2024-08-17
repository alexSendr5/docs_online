"use client"
import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs"
import { RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense"
import { Editor } from "./editor/Editor"
import Header from "./Header"
import ActiveCollaborators from "./ActiveCollaborators"
import { useEffect, useRef, useState } from "react"
import { Input } from "./ui/input"
import Image from "next/image"
import { UpdateDoc } from "@/lib/actions/room.actions"
import Loader from "./Loader"
import ShareModal from "./ShareModal"

const CollaborativeRoom = ({roomId, roomMetadata, users, currentUserType}: CollaborativeRoomProps) => {

  const [Doctitle, setDoctitle] = useState(roomMetadata.title)
  const [editing, setediting] = useState(false)
  const [loading, setloading] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)


  const updateTitlehandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter'){
      setloading(true)
      try {
        if(Doctitle !== roomMetadata.title){
          const updatedDocument = await UpdateDoc(roomId, Doctitle)

          if(updatedDocument){
            setediting(false)
          }
        }
      } catch (error) {
        console.log(error)
      }
      setloading(false)
    }
  }

  useEffect (() => {
    const handleClickOutside = (e: MouseEvent) => {
      if(containerRef.current && !containerRef.current.contains(e.target as Node)){
        setediting(false)
        UpdateDoc(roomId, Doctitle)
      }

    }
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [roomId, Doctitle])

  useEffect(() => {
    return () => {
      if(editing && inputRef.current){
        inputRef.current.focus()
      }
    }
  }, [editing])

  return (
    <RoomProvider id={roomId}>
        <ClientSideSuspense fallback={<Loader />}>
          <div className="collaborative-room">
          <Header>
                <div ref={containerRef} className="flex w-fit items-center justify-center gap-2">
                    {editing && !loading ? (
                      <Input
                      type="text"
                      value={Doctitle}
                      ref={inputRef}
                      placeholder="Введите название"
                      onChange={(e) => setDoctitle(e.target.value)}
                      onKeyDown={updateTitlehandler}
                      disabled = {!editing}
                      className="document-title-input"
                      />
                    ) : (
                      <>
                      <p className="document-title">{Doctitle}</p>
                      </>
                    )}

                    {currentUserType === 'editor' && !editing  && (
                      <Image
                        src='/assets/icons/edit.svg'
                        alt="Edit"
                        width={24}
                        height={24}
                        onClick={() => setediting(true)}
                        className="pointer"
                      />
                    )}

                    {currentUserType !== 'editor' && !editing  && (
                      <p className="view-only-tag">только просмотр</p>
                    )}

                    {loading && <p className="text-sm
                     text-gray-400">сохранение...</p>}
                </div>

                <div className="flex w-full flex-1 justify-end gap-2 sm:gap-3">
                  <ActiveCollaborators />

                    <ShareModal
                    roomId = {roomId}
                    collaborators = {users}
                    creatorId = {roomMetadata.creatorId}
                    currentUserType = {currentUserType}

                    />

                <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
                </div>
            </Header>
            <Editor roomId = {roomId} currentUserType = {currentUserType}/>
          </div>
        </ClientSideSuspense>
      </RoomProvider>
  )
}

export default CollaborativeRoom