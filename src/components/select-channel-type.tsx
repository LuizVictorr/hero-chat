import { db } from "@/lib/db"
import { CreateChannelModal } from "./modals/create-channel-modal"


export const SelectChannelType = async () => {

    const channelType = await db.channelType.findMany()

    return (
        <CreateChannelModal channelTypeId={channelType} />
    )
}