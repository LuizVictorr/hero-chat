import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface ServerPageProps {
    params: {
        serverId: string;
    }
};

const ServerPage = async ({ params }: ServerPageProps) => {

    const profile = await currentProfile();

    if (!profile) {
        return redirect("/home")
    }

    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
            members: {
                some: {
                    profileId: profile.id,
                }
            }
        },
        include: {
            channels: {
                where: {
                    name: "general"
                },
                orderBy: {
                    createAt: "asc"
                }
            }
        }
    })

    const initialChannel = server?.channels[0];

    if (initialChannel?.name !== "general") {
        return null
    }

    return redirect(`/home/servers/${params.serverId}/channels/${initialChannel?.id}`)

}

export default ServerPage;