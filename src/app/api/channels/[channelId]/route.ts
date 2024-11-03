import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function DELETE(
    req: Request,
    { params }: { params: { channelId: string } }
) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url)

        const serverId = searchParams.get("serverId")

        if (!profile) {
            return new NextResponse("Não Autorizado", { status: 401 });
        }

        if (!serverId) {
            return new NextResponse("Server ID faltando", { status: 400 });
        }

        if (!params.channelId) {
            return new NextResponse("Channel ID faltando", { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        MemberRoleId: {
                            in: ["22192198-7307-4337-9f05-78703fc515b2", "3119f7d1-d33b-4c8b-9b73-67be5cead272"]
                        }
                    }
                }
            },
            data: {
                channels: {
                    delete: {
                        id: params.channelId,
                        name: {
                            not: "general",
                        }
                    }
                }
            }
        });

        return NextResponse.json(server)

    } catch (error) {
        console.log("[CHANNEL_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { channelId: string } }
) {
    try {
        const profile = await currentProfile();
        const { name, type } = await req.json()
        const { searchParams } = new URL(req.url)

        const serverId = searchParams.get("serverId")

        if (!profile) {
            return new NextResponse("Não Autorizado", { status: 401 });
        }

        if (!serverId) {
            return new NextResponse("Server ID faltando", { status: 400 });
        }

        if (!params.channelId) {
            return new NextResponse("Channel ID faltando", { status: 400 });
        }

        if (name == "general") {
            return new NextResponse("Não é possível editar 'general'", { status: 400 })
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        MemberRoleId: {
                            in: ["22192198-7307-4337-9f05-78703fc515b2", "3119f7d1-d33b-4c8b-9b73-67be5cead272"]
                        }
                    }
                }
            },
            data: {
                channels: {
                    update: {
                        where: {
                            id: params.channelId,
                            NOT: {
                                name: "general",
                            }
                        },
                        data: {
                            name: name,
                            ChannelTypeId: type,
                        }
                    },
                }
            }
        });

        return NextResponse.json(server)

    } catch (error) {
        console.log("[CHANNEL_ID_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}