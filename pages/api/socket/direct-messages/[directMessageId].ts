import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "../../../../types";
import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo,
) {
    if (req.method !== "DELETE" && req.method !== "PATCH") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {

        const profile = await currentProfilePages(req);
        const { directMessageId, conversationId } = req.query;
        const { content } = req.body;

        if (!profile) {
            return res.status(401).json({ error: "Não Autorizado" })
        }

        if (!conversationId) {
            return res.status(400).json({ error: "Conversation ID faltando" });
        }

        const conversation = await db.conversation.findFirst({
            where: {
                id: conversationId as string,
                OR: [
                    {
                        memberOne: {
                            profileId: profile.id
                        }
                    },
                    {
                        memberTwo: {
                            profileId: profile.id
                        }
                    }
                ]
            },
            include: {
                memberOne: {
                    include: {
                        profile: true,
                    }
                },
                memberTwo: {
                    include: {
                        profile: true,
                    }
                }
            }
        })

        if (!conversation) {
            return res.status(404).json({ error: "Conversation não encontrado" })
        }

        const member = conversation.memberOne.profile.id === profile.id ? conversation.memberOne : conversation.memberTwo;

        if (!member) {
            return res.status(404).json({ error: "Member não encontrado" })
        }

        let directMessage = await db.directMessage.findFirst({
            where: {
                id: directMessageId as string,
                conversationId: conversationId as string,
            },
            include: {
                member: {
                    include: {
                        profile: true,
                    }
                }
            }
        })

        if (!directMessage || directMessage.deleted) {
            return res.status(404).json({ error: "Message não encontrado" })
        }

        const isMessageOwner = directMessage.memberId === member.id;
        const isAdmin = member.MemberRoleId === "22192198-7307-4337-9f05-78703fc515b2";
        const isModerator = member.MemberRoleId === "3119f7d1-d33b-4c8b-9b73-67be5cead272";
        const canModify = isMessageOwner || isAdmin || isModerator;

        if (!canModify) {
            return res.status(404).json({ error: "Não autorizado" })
        }

        if (req.method === "DELETE") {
            directMessage = await db.directMessage.update({
                where: {
                    id: directMessageId as string,
                },
                data: {
                    fileUrl: null,
                    content: "Essa mensagem vai ser deletada",
                    deleted: true,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        }
                    }
                }
            })
        }

        if (req.method === "PATCH") {

            if (!isMessageOwner) {
                return res.status(401).json({ error: "Não autorizado" })
            }

            directMessage = await db.directMessage.update({
                where: {
                    id: directMessageId as string,
                },
                data: {
                    content: content,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        }
                    }
                }
            })
        }

        const updateKey = `chat:${conversation.id}:messages:update`;

        res?.socket?.server?.io?.emit(updateKey, directMessage);

        return res.status(200).json(directMessage);

    } catch (error) {
        console.log("[MESSAGE_ID]", error);
        return res.status(500).json({ error: "Internal Error" });
    }
}