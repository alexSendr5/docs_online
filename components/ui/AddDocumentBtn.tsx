'use client'
import { CreateDocument } from "@/lib/actions/room.actions"
import { Button } from "./button"
import Image from "next/image"
import { useRouter } from "next/navigation"

const AddDocumentBtn = ({userId, email}: AddDocumentBtnProps) => {
    const router = useRouter()
    const AddDocumentHandler = async() => {
        try {
           const room = await CreateDocument({userId, email})
           if(room){
            router.push(`/docs/${room.id}`)
           }

        } catch (error) {
            console.log(error)
        }
    }
  return (
    <Button type="submit" onClick={AddDocumentHandler} className="gradient-blue flex gap-1 shadow-md">
        <Image src = '/assets/icons/add.svg' alt="Add Document" width={24} height={24}/>
        <p className="hidden sm:block">Создайте текстовый документ</p>
    </Button>
  )
}

export default AddDocumentBtn