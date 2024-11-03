import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ServerHeader } from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import { ServerSearch } from "./server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "../ui/separator";
import { ServerSection } from "./server-section";
import { ServerChannel } from "./server-channel";
import { ServerMember } from "./server-member";

interface ServerSidebarProps {
    serverId: string;
}

const iconMap = {
    "1547866a-244e-4127-a30c-593f8d077d97": <Hash className="mr-2 w-4- h-4" />,   // Texto
    "994df2b1-5fcd-4621-a4cb-029a45a3c04c": <Mic className="mr-2 w-4- h-4" />,   // Áudio 
    "80eb2f10-eb7c-4843-8ac9-58a979e41d45": <Video className="mr-2 w-4- h-4" />, // Vídeo
};

const roleIconMap = {
    "5064bbb2-c7fb-4555-8a28-d1fa61649878": null, // Guest
    "3119f7d1-d33b-4c8b-9b73-67be5cead272": <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />, // Moderator
    "22192198-7307-4337-9f05-78703fc515b2": <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" /> // Admin
};

export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {

    const profile = await currentProfile();

    if (!profile) {
        return redirect("/")
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId
        },
        include: {
            channels: {
                orderBy: {
                    createAt: "asc",
                },
            },
            members: {
                include: {
                    profile: true,
                },
                orderBy: {
                    MemberRoleId: "asc"
                }
            },
        },
    });

    const textChannels = server?.channels.filter((channel) => channel.ChannelTypeId === "1547866a-244e-4127-a30c-593f8d077d97")
    const audioChannels = server?.channels.filter((channel) => channel.ChannelTypeId === "994df2b1-5fcd-4621-a4cb-029a45a3c04c")
    const videoChannels = server?.channels.filter((channel) => channel.ChannelTypeId === "80eb2f10-eb7c-4843-8ac9-58a979e41d45")
    const members = server?.members.filter((member) => member.profileId !== profile.id)

    if (!server) {
        return redirect("/")
    }

    const role = server.members.find((member) => member.profileId === profile.id)?.MemberRoleId

    return (

        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <ServerHeader
                server={server}
                role={role}

            />
            <ScrollArea className="px-2">
                <div className="mt-2">
                    <ServerSearch data={[
                        {
                            label: "Text Channels",
                            type: "channel",
                            data: textChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: iconMap[channel.ChannelTypeId as keyof typeof iconMap]
                            }))
                        },
                        {
                            label: "Voice Channels",
                            type: "channel",
                            data: audioChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: iconMap[channel.ChannelTypeId as keyof typeof iconMap]
                            }))
                        },
                        {
                            label: "Video Channels",
                            type: "channel",
                            data: videoChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: iconMap[channel.ChannelTypeId as keyof typeof iconMap]
                            }))
                        },
                        {
                            label: "Members",
                            type: "member",
                            data: members?.map((member) => ({
                                id: member.id,
                                name: member.profile.name,
                                icon: roleIconMap[member.MemberRoleId as keyof typeof roleIconMap]
                            }))
                        }

                    ]} />
                </div>
                <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
                {!!textChannels?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="channels"
                            channelType="1547866a-244e-4127-a30c-593f8d077d97" // Text
                            role={role}
                            label="Text Channels"
                        />
                        <div className="space-y-[2px]">
                            {textChannels.map((channel) => (
                                <ServerChannel
                                    key={channel.id}
                                    channel={channel}
                                    role={role}
                                    server={server}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {!!audioChannels?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="channels"
                            channelType="994df2b1-5fcd-4621-a4cb-029a45a3c04c" // Audio
                            role={role}
                            label="Voice Channels"
                        />
                        <div className="space-y-[2px]">
                            {audioChannels.map((channel) => (
                                <ServerChannel
                                    key={channel.id}
                                    channel={channel}
                                    role={role}
                                    server={server}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {!!videoChannels?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="channels"
                            channelType="80eb2f10-eb7c-4843-8ac9-58a979e41d45" // Video
                            role={role}
                            label="Video Channels"
                        />
                        <div className="space-y-[2px]">
                            {videoChannels.map((channel) => (
                                <ServerChannel
                                    key={channel.id}
                                    channel={channel}
                                    role={role}
                                    server={server}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {!!members?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="members"
                            role={role}
                            label="Members"
                            server={server}
                        />
                        <div className="space-y-[2px]">
                            {members.map((member) => (
                                <ServerMember
                                    key={member.id}
                                    member={member}
                                    server={server}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}