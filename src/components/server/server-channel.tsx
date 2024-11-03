"use client"

import { cn } from "@/lib/utils";
import { Channel, Server } from "@prisma/client"
import { Mic, Video, Hash, Edit, Trash, Lock } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ActionTooltip } from "../action-tooltip";
import { ModalType, useModal } from "@/hooks/use-modal-store";

interface ServerChannelProps {
    channel: Channel;
    server: Server;
    role?: string;
}

const iconMap = {
    "1547866a-244e-4127-a30c-593f8d077d97": <Hash className="mr-2 w-4- h-4" />,   // Texto
    "994df2b1-5fcd-4621-a4cb-029a45a3c04c": <Mic className="mr-2 w-4- h-4" />,   // Áudio 
    "80eb2f10-eb7c-4843-8ac9-58a979e41d45": <Video className="mr-2 w-4- h-4" />, // Vídeo
};

export const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {

    const { onOpen } = useModal();
    const params = useParams();
    const router = useRouter();

    const Icon = iconMap[channel.ChannelTypeId as keyof typeof iconMap];

    const onClick = () => {
        router.push(`/home/servers/${params?.serverId}/channels/${channel.id}`)
    }

    const onAction = (e: React.MouseEvent, action: ModalType) => {
        e.stopPropagation();
        onOpen(action, { channel, server });
    }

    return (
        <button
            onClick={onClick}
            className={cn(
                "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
                params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
            )}
        >
            {Icon && <span className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400">{Icon}</span>}
            <p className={cn(
                "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                params?.channelId === channel.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
            )}>
                {channel.name}
            </p>
            {channel.name !== "general" && role !== "5064bbb2-c7fb-4555-8a28-d1fa61649878" && (
                <div className="ml-auto flex items-center gap-x-2">
                    <ActionTooltip label="Edit">
                        <Edit
                            onClick={(e) => onAction(e, "editChannel")}
                            className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                        />
                    </ActionTooltip>
                    <ActionTooltip label="Deletar">
                        <Trash
                            onClick={(e) => onAction(e, "deleteChannel")}
                            className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                        />
                    </ActionTooltip>
                </div>
            )}
            {channel.name === "general" && (
                <Lock
                    className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400"
                />
            )}
        </button>
    )
}