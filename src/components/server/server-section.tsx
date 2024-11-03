"use client"

import { ChannelType, MemberRole } from "@prisma/client";
import { ServerWithMembersWithProfiles } from "../../../types";
import { ActionTooltip } from "../action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ServerSectionProps {
    label: string;
    role?: string;
    sectionType: "channels" | "members";
    channelType?: string;
    server?: ServerWithMembersWithProfiles;
}

export const ServerSection = ({ label, role, sectionType, channelType, server }: ServerSectionProps) => {

    const { onOpen } = useModal()

    return (
        <div className="flex items-center justify-between py-2">
            <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                {label}
            </p>
            {role !== "5064bbb2-c7fb-4555-8a28-d1fa61649878" && sectionType === "channels" && (
                <ActionTooltip label="Criar Canal" side="top">
                    <button
                        onClick={() => onOpen("createChannel", { channelType })}
                        className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </ActionTooltip>
            )}
            {role === "22192198-7307-4337-9f05-78703fc515b2" && sectionType === "members" && (
                <ActionTooltip label="Gerenciar Membros" side="top">
                    <button
                        onClick={() => onOpen("members", { server })}
                        className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                    >
                        <Settings className="h-4 w-4" />
                    </button>
                </ActionTooltip>
            )}
        </div>
    )
}