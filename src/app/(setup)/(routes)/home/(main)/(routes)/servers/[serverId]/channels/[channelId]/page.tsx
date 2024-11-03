import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface ChannelIdPageProps {
    params: {
        serverId: string;
        channelId: string;
    }
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {

    const profile = await currentProfile();

    if (!profile) {
        return redirect("/home")
    }

    const channel = await db.channel.findUnique({
        where: {
            id: params.channelId
        }
    })

    const member = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id,
        }
    });

    if (!channel || !member) {
        redirect("/home");
    }

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-screen relative">
            <ChatHeader
                name={channel.name}
                serverId={channel.serverId}
                type="channel"
            />

            {channel.ChannelTypeId === "1547866a-244e-4127-a30c-593f8d077d97" && (
                <>
                    <ChatMessages
                        member={member}
                        name={channel.name}
                        chatId={channel.id}
                        type="channel"
                        apiUrl="/api/messages"
                        socketUrl="/api/socket/messages"
                        socketQuery={{
                            channelId: channel.id,
                            serverId: channel.serverId,
                        }}
                        paramKey="channelId"
                        paramValue={channel.id}
                    />

                    <div className="absolute bottom-0 left-0 right-0">
                        <ChatInput
                            name={channel.name}
                            type="channel"
                            apiUrl="/api/socket/messages"
                            query={{
                                channelId: channel.id,
                                serverId: channel.serverId
                            }}
                        />
                    </div>
                </>
            )}
            {channel.ChannelTypeId === "994df2b1-5fcd-4621-a4cb-029a45a3c04c" && (
                <MediaRoom
                    chatId={channel.id}
                    video={false}
                    audio={true}
                />
            )}
            {channel.ChannelTypeId === "80eb2f10-eb7c-4843-8ac9-58a979e41d45" && (
                <MediaRoom
                    chatId={channel.id}
                    video={true}
                    audio={true}
                />
            )}
        </div>
    );
}

export default ChannelIdPage;