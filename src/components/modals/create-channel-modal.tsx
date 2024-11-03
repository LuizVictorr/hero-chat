"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import qs from "query-string"

import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogFooter } from "../ui/dialog"
import { Form, FormControl, FormItem, FormField, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useForm } from "react-hook-form"
import { useParams, useRouter } from "next/navigation"
import { useModal } from "@/hooks/use-modal-store"
import { Select, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { SelectContent } from "@radix-ui/react-select"
import { ChannelType } from "@prisma/client"
import { useEffect } from "react"

interface Types {
    channelTypeId: ChannelType[]
}


const formSchema = z.object({
    name: z.string().min(1, {
        message: "Channel name is required"
    }).refine(name => name !== "general",
        {
            message: "Nome do canal não pode ser 'general'"
        }
    ),
    type: z.string().min(1, {
        message: "Tipo do canal é obrogatório"
    })
})

export const CreateChannelModal = ({ channelTypeId }: Types) => {

    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();
    const params = useParams();

    const isModalOpen = isOpen && type === "createChannel";
    const { channelType } = data

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: channelType || "",
        }
    })

    useEffect(() => {
        if (channelType) {
            form.setValue("type", channelType)
        } else {
            form.setValue("type", channelTypeId[0].id)
        }
    }, [channelTypeId, form, channelType])

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {

            const url = qs.stringifyUrl({
                url: "/api/channels",
                query: {
                    serverId: params?.serverId
                }
            });

            await axios.post(url, values)

            form.reset();
            router.refresh()
            onClose();
        } catch (error) {
            console.log(error)
        }
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }


    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Crie seu canal
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <div className="space-y-8 px-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            Nome do canal
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Nome do canal"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel> Channel Type </FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                                                    <SelectValue placeholder="Selecione um tipo de canal" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {channelTypeId.map((type) => (
                                                    <SelectItem key={type.id} value={type.id} className="capitalize">
                                                        {type.name.toLowerCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button disabled={isLoading} variant={"primary"}>
                                Criar
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}