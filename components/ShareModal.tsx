'use client'
import { useSelf } from "@liveblocks/react/suspense"
import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "./ui/button"
import Image from "next/image"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import UserTypeSelector from "./UserTypeSelector"
import Collaborator from "./Collaborator"
import { UpdateDocumentAccess } from "@/lib/actions/room.actions"

const ShareModal = ({roomId, collaborators, creatorId, currentUserType}: ShareDocumentDialogProps) => {
    const [open, setopen] = useState(false)
    const [loading, setloading] = useState(false)

    const user = useSelf()

    const [email, setEmail] = useState('')
    const [userType, setuserType] = useState<UserType>('viewer')

    const shareDocumentHandler = async() => {
      setloading(true)

      await UpdateDocumentAccess({roomId, email, userType: userType as UserType, updatedBy: user.info})

      setloading(false)
    }

  return (
    <Dialog open = {open} onOpenChange={setopen}>
  <DialogTrigger>
    <Button className="gradient-blue flex h-9 gap-1 px-4" disabled = {currentUserType !== 'editor'}>
        <Image
        src = '/assets/icons/share.svg'
        alt="Share"
        width={20}
        height={20}
        className="min-w-4 sm:size-5"
        />
        <p className="mr-1 hidden sm:block">
            Поделиться
        </p>
    </Button>
  </DialogTrigger>
  <DialogContent className="shad-dialog">
    <DialogHeader>
      <DialogTitle>Список пользователей, с которыми можно поделиться</DialogTitle>
      <DialogDescription>
        Выберите пользователей, которые смогут редактировать или просматривать документ
      </DialogDescription>
    </DialogHeader>
    <Label htmlFor='email' className="mt-6 text-blue-600">
        Введите адрес электронной почты
    </Label>
    <div className="flex items-center gap-3">
      <div className="flex flex-1 rounded-md bg-dark-400">
        <Input
          id="email"
          placeholder="Адрес эл.почты"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="share-input"
        />
        <UserTypeSelector
        userType = {userType}
        setUserType = {setuserType}
        />
      </div>
      <Button type="submit" onClick={shareDocumentHandler} className="gradient-blue flex h-full gap-1 px-5" disabled = {loading}>
        {loading ? 'Отправка...' : "Пригласить"}
      </Button>
    </div>

    <div className="my-2 space-y-2">
      <ul className="flex flex-col">
          {collaborators.map((collaborator) => (
            <Collaborator
            key={collaborator.id}
            roomId = {roomId}
            creatorId = {creatorId}
            email = {collaborator.email}
            collaborator = {collaborator}
            user = {user.info}
            />
          ))}
      </ul>
    </div>
  </DialogContent>
</Dialog>
  )
}

export default ShareModal