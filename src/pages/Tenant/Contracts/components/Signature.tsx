"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import SignatureCanvas from "react-signature-canvas";
import { useRef, useState } from "react";

export function SignatureDialog({ open, setOpen, onSave }: { open: boolean, setOpen: (open: boolean) => void, onSave: (img: string) => void }) {
    const sigRef = useRef<any>();

    const handleClear = () => {
        sigRef.current?.clear();
    };

    const handleSave = async () => {
        const canvas = sigRef.current?.getCanvas();
        if (!canvas) return;

        const image = canvas.toDataURL("image/png");

        await onSave(image);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Chữ ký của bạn</DialogTitle>
                </DialogHeader>

                <div className="border rounded-md overflow-hidden">
                    <SignatureCanvas
                        ref={sigRef}
                        penColor="black"
                        canvasProps={{
                            width: 500,
                            height: 200,
                            className: "bg-white",
                        }}
                    />
                </div>

                <DialogFooter className="gap-2 pt-2">
                    <Button variant="secondary" onClick={handleClear}>
                        Xoá
                    </Button>
                    <Button onClick={handleSave}>Lưu</Button>
                    <DialogClose asChild>
                        <Button variant="ghost">Đóng</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
