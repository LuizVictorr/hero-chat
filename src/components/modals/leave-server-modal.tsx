"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"

import { useModal } from "@/hooks/use-modal-store"
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export const LeaveServerModal = () => {

    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const { isOpen, onClose, type, data } = useModal();
    const isModalOpen = isOpen && type === "leaveServer";
    const { server } = data

    const onClick = async () => {
        try {
            setIsLoading(true);

            await axios.patch(`/api/servers/${server?.id}/leave`)

            onClose();
            router.refresh();
            router.push("/home");
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Sair do servidor
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Você tem certeza que quer sair do <span className="font-semibold text-indigo-500">
                            {server?.name}
                        </span>
                        ?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                            disabled={isLoading}
                            onClick={onClose}
                            variant="ghost"
                        >
                            Cancelar
                        </Button>
                        <Button
                            disabled={isLoading}
                            variant="primary"
                            onClick={onClick}
                        >
                            Confirmar
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}