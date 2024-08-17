import { useState } from "react"
import Image from "next/image"
import UserTypeSelector from "./UserTypeSelector"
import { Button } from "./ui/button"
import { removeCollaborator, UpdateDocumentAccess } from "@/lib/actions/room.actions"

const Collaborator = ({roomId, creatorId, collaborator, user, email}: CollaboratorProps) => {
    const [userType, setuserType] = useState(collaborator.userType || 'viewer')
    const [loading, setloading] = useState(false)

    const ShareDocumentHandler = async(type: string) => {
        setloading(true)

        await UpdateDocumentAccess({roomId, email, userType: type as UserType, updatedBy: user})

        setloading(false)
    }

    const removeCollaboratorHandler = async(email: string) => {
        setloading(true)

        await removeCollaborator({roomId, email})

        setloading(false)
    }
  return (
        <li className="flex items-center justify-between gap-2 py-3">
            <div className="flex gap-2">
                <Image
                src ={collaborator.avatar}
                alt={collaborator.name}
                width={36}
                height={36}
                className="size-9 rounded-full"
                />
                <div>
                    <p className="line-clamp-1 text-sm font-semibold leading-4 text-white">{collaborator.name}
                        <span className="text-10-regular pl-2 text-blue-100">{loading && 'Обновление...'}</span>
                    </p>
                    <p className="text-sm font-light text-blue-100">{collaborator.email}</p>
                </div>
            </div>
            {creatorId === collaborator.id ? (<p className="text-sm text-blue-100">Владелец</p>) : (<div className="flex items-center">
            <UserTypeSelector
            userType={userType as UserType}
            setUserType={setuserType || 'viewer'}
            onClickHandler={ShareDocumentHandler}
            />
            <Button type="button" onClick={() => {removeCollaboratorHandler(collaborator.email)}}>
                Удалить
            </Button>
            </div>)}

        </li>
  )
}

export default Collaborator