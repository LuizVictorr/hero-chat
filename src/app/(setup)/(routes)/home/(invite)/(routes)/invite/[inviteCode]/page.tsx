import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


interface InviteCodePageProps {
    params: {
        inviteCode: string
    };
};

const InviteCodePage = async ({ params }: InviteCodePageProps) => {

    const profile = await currentProfile();

    if (!profile) {
        return redirect("/home");
    }

    if (!params.inviteCode) {
        return redirect("/")
    }

    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    if (existingServer) {
        return redirect(`/home/servers/${existingServer.id}`);
    }

    const server = await db.server.update({
        where: {
            inviteCode: params.inviteCode,
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id,
                        MemberRoleId: "5064bbb2-c7fb-4555-8a28-d1fa61649878"
                    }
                ]
            }
        }
    });

    if (server) {
        return redirect(`/home/servers/${server.id}`)
    }

    return (
        <div>
            Invite
        </div>
    );
}

export default InviteCodePage;