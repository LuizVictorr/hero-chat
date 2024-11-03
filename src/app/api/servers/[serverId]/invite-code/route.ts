import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuiv4 } from "uuid"


export async function PATCH(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Não Autorizado", { status: 401 })
        }

        if (!params.serverId) {
            return new NextResponse("Server ID Missing", { status: 400 })
        }

        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id,
            },
            data: {
                inviteCode: uuiv4()
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        console.log("[SERVER_ID]", error);
        return new NextResponse("Erro Interno", { status: 500 })
    }
}