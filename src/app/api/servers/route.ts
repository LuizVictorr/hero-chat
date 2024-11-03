import { v4 as uuidv4 } from "uuid";
import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";


export async function POST(req: Request) {
    try {
        const { name, imageUrl } = await req.json();
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Não Autorizado", { status: 401 })
        }


        const server = await db.server.create({
            data: {
                profileId: profile.id,
                name: name,
                imageUrl: imageUrl,
                inviteCode: uuidv4(),
                channels: {
                    create: [
                        { name: "general", profileId: profile.id, ChannelTypeId: "1547866a-244e-4127-a30c-593f8d077d97" }
                    ]
                },
                members: {
                    create: [
                        { profileId: profile.id, MemberRoleId: "22192198-7307-4337-9f05-78703fc515b2" }
                    ]
                }
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        console.log("[SERVERS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}