"use client"

import { MemberRole } from "@prisma/client"
import { ServerWithMembersWithProfiles } from "../../../types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react"
import { useModal } from "@/hooks/use-modal-store"

interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles,
    role?: string
}

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {

    const { onOpen } = useModal();

    const isAdmin = role === "22192198-7307-4337-9f05-78703fc515b2"
    const isModerator = isAdmin || role === "3119f7d1-d33b-4c8b-9b73-67be5cead272"

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none" asChild>
                <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
                    {server.name}
                    <ChevronDown className="h-5 w-5 ml-auto" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]"
            >
                {isModerator && (
                    <DropdownMenuItem
                        onClick={() => onOpen("invite", { server })}
                        className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
                    >
                        Convidar Pessoas
                        <UserPlus className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen("editServer", { server })}
                        className="px-3 py-2 text-sm cursor-pointer"
                    >
                        Configurações
                        <Settings className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen("members", { server })}
                        className="px-3 py-2 text-sm cursor-pointer"
                    >
                        Gerenciar Membros
                        <Users className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isModerator && (
                    <DropdownMenuItem
                        onClick={() => onOpen("createChannel")}
                        className="px-3 py-2 text-sm cursor-pointer"
                    >
                        Criar Canal
                        <PlusCircle className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isModerator && (
                    <DropdownMenuSeparator />
                )}
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen("deleteServer", { server })}
                        className=" text-rose-500 px-3 py-2 text-sm cursor-pointer"
                    >
                        Deletar Servidor
                        <Trash className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {!isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen("leaveServer", { server })}
                        className=" text-rose-500 px-3 py-2 text-sm cursor-pointer"
                    >
                        Sair
                        <LogOut className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}