import { cn } from "@/lib/utils"
import { Link } from "lucide-react"
import Image from "next/image"

function Header({children, className}: HeaderProps) {
    return (
        <div className={cn("header", className)}>
            <a href="/" className="md:flex-1">
                <Image
                    src='/assets/icons/logo.svg'
                    alt="Логотип с названием"
                    width={120}
                    height={32}
                    className="hidden md:block" />
                <Image
                    src='/assets/icons/logo-icon.svg'
                    alt="Логотип"
                    width={32}
                    height={32}
                    className="mr-2 md:hidden" />
            </a>
            {children}
        </div>
    )
}

export default Header