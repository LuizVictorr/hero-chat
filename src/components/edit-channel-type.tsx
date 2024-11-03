import { db } from "@/lib/db"
import { CreateChannelModal } from "./modals/create-channel-modal"
import { EditChannelModal } from "./modals/edit-channel-modal"


export const EditChannelType = async () => {

    const channelType = await db.channelType.findMany()

    return (
        <EditChannelModal channelTypeId={channelType} />
    )
}