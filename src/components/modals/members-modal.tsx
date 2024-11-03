"use client"

import { ServerWithMembersWithProfiles } from "../../../types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { useModal } from "@/hooks/use-modal-store"
import { ScrollArea } from "../ui/scroll-area";
import { UserAvatar } from "../user-avatar";
import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu";
import qs from "query-string"
import { MemberRole } from "@prisma/client";
import { useRouter } from "next/navigation";
import axios from "axios";

export const MembersModal = () => {

    const router = useRouter();
    const { onOpen, isOpen, onClose, type, data } = useModal();
    const [loadingId, setLoadingId] = useState("")

    const isModalOpen = isOpen && type === "members";
    const { server } = data as { server: ServerWithMembersWithProfiles };

    const roleIconMap: Record<string, JSX.Element | null> = {
        "5064bbb2-c7fb-4555-8a28-d1fa61649878": null,
        "3119f7d1-d33b-4c8b-9b73-67be5cead272": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
        "22192198-7307-4337-9f05-78703fc515b2": <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
    }

    const onKick = async (memberId: string) => {
        try {
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id,
                }
            });

            const response = await axios.delete(url);

            router.refresh();
            onOpen("members", { server: response.data })

        } catch (error) {
            console.log(error);
        } finally {
            setLoadingId("");
        }
    }

    const onRoleChange = async (memberId: string, role: MemberRole) => {
        try {
            setLoadingId(memberId)
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id,
                }
            })

            const response = await axios.patch(url, {
                role: {
                    connect: {
                        id: role.id
                    }
                }
            });

            router.refresh()
            onOpen("members", { server: response.data })

        } catch (error) {
            console.log(error)
        } finally {
            setLoadingId("")
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Gerenciar Membros
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        {server?.members?.length} Members
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="mt-8 max-h-[420px] pr-6">
                    {server?.members.map((member) => (
                        <div key={member.id} className="flex items-center gap-x-2 mb-6">
                            <UserAvatar src={member.profile.imageUrl} />
                            <div className="flex flex-col gap-y-1">
                                <div className="text-xs font-semibold flex items-center">
                                    {member.profile.name}
                                    {roleIconMap[member.MemberRoleId]}
                                </div>
                                <p className="text-xs text-zinc-500">
                                    {member.profile.email}
                                </p>
                            </div>
                            {server.profileId !== member.profileId && loadingId !== member.id && (
                                <div className="ml-auto">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <MoreVertical className="h-4 w-4 text-zinc-500" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent side="left">
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger className="flex items-center">
                                                    <ShieldQuestion className="w-4 h-4 mr-2" />
                                                    <span>Role</span>
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent>
                                                        <DropdownMenuItem onClick={() => onRoleChange(member.id, { id: "5064bbb2-c7fb-4555-8a28-d1fa61649878", name: "Guest", createAt: new Date(), updateAtt: new Date() })}>
                                                            <Shield className="w-4 h-4 mr-2" />
                                                            Guest
                                                            {member.MemberRoleId === "5064bbb2-c7fb-4555-8a28-d1fa61649878" && (
                                                                <Check className="w-4 h-4 ml-2" />
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => onRoleChange(member.id, { id: "3119f7d1-d33b-4c8b-9b73-67be5cead272", name: "Moderator", createAt: new Date(), updateAtt: new Date() })}>
                                                            <ShieldCheck className="w-4 h-4 mr-2" />
                                                            Moderator
                                                            {member.MemberRoleId === "3119f7d1-d33b-4c8b-9b73-67be5cead272" && (
                                                                <Check className="w-4 h-4 ml-2" />
                                                            )}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => onKick(member.id)}>
                                                <Gavel className="h-4 w-4 mr-2" />
                                                Kick
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )}
                            {loadingId === member.id && (
                                <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
                            )}
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>

        </Dialog>
    )
}