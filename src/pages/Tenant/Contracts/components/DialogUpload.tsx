'use client'

import React, { useState } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { toast } from 'react-toastify'
import { createImageUrl } from '@/apis'
import { singleFileValidator } from '@/utils/validators'

export function DialogUpdateCCCD({ open, setOpen, imageFront, imageBack, setImageFront, setImageBack, handleSave }: any) {

    const [loadingSave, setLoadingSave] = useState(false);

    const handleFileChangeImage1 = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const image = await uploadImage(event);
        if (image) setImageFront(image);
    }

    const handleFileChangeImage2 = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const image = await uploadImage(event);
        if (image) setImageBack(image);
    }

    const uploadImage = async (e: any) => {
        const file = e.target?.files?.[0];
        const error = singleFileValidator(file);
        if (error) {
            toast.error(error);
            return null;
        }

        let reqData = new FormData();
        reqData.append('image', file);

        try {
            const response = await toast.promise(
                createImageUrl(reqData),
                { pending: 'Đang tải ảnh lên...' }
            );
            e.target.value = '';
            return response.data;
        } catch (err) {
            toast.error("Upload thất bại");
            return null;
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Cập nhật căn cước công dân</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4 sm:flex-row sm:gap-6">
                    {/* CCCD mặt trước */}
                    <div className="flex-1 space-y-2">
                        <Label htmlFor="file1">CCCD mặt trước</Label>
                        {!imageFront ? (
                            <div className="h-[200px] w-[300px] flex flex-col justify-center items-center gap-5 cursor-pointer border-2 border-dashed border-gray-300 bg-white p-6 rounded-lg shadow-[0px_48px_35px_-48px_rgba(0,0,0,0.1)]">
                                <label htmlFor="file1" className="flex flex-col items-center justify-center gap-5 cursor-pointer w-full h-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-20 text-gray-600">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z" />
                                    </svg>
                                    <span className="text-gray-600 font-normal">Chọn mặt trước CCCD</span>
                                    <input type="file" id="file1" className="hidden" onChange={handleFileChangeImage1} accept="image/*" />
                                </label>
                            </div>
                        ) : (
                            <img
                                src={imageFront}
                                alt="Mặt trước CCCD"
                                className="mt-2 max-h-40 w-full rounded-md border object-contain"
                            />
                        )}
                    </div>

                    {/* CCCD mặt sau */}
                    <div className="flex-1 space-y-2">
                        <Label htmlFor="file2">CCCD mặt sau</Label>
                        {!imageBack ? (
                            <div className="h-[200px] w-[300px] flex flex-col justify-center items-center gap-5 cursor-pointer border-2 border-dashed border-gray-300 bg-white p-6 rounded-lg shadow-[0px_48px_35px_-48px_rgba(0,0,0,0.1)]">
                                <label htmlFor="file2" className="flex flex-col items-center justify-center gap-5 cursor-pointer w-full h-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-20 text-gray-600">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z" />
                                    </svg>
                                    <span className="text-gray-600 font-normal">Chọn mặt sau CCCD</span>
                                    <input type="file" id="file2" className="hidden" onChange={handleFileChangeImage2} accept="image/*" />
                                </label>
                            </div>
                        ) : (
                            <img
                                src={imageBack}
                                alt="Mặt sau CCCD"
                                className="mt-2 max-h-40 w-full rounded-md border object-contain"
                            />
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={async () => {
                        setLoadingSave(true);
                        await handleSave();
                        setLoadingSave(false);
                    }} disabled={loadingSave}>
                        {loadingSave ? 'Đang lưu...' : 'Lưu'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
