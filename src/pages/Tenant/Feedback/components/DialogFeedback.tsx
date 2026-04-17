import React, { useRef, useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'
import { createFeedback, getOwnersOfTenant } from '@/apis/feedback.apis'
import { createImageUrl } from '@/apis'
import { singleFileValidator } from "@/utils/validators"

export default function FeedbackForm({ open, setOpen, fetchData }: { open: boolean, setOpen: (val: boolean) => void, fetchData: () => void }) {
    const [message, setMessage] = useState('')
    const [selectedFileNames, setSelectedFileNames] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [images, setImages] = useState<{ preview: string; url: string }[]>([]);
    const [owners, setOwners] = useState<{ _id: string, displayName: string }[]>([]);
    const [selectedOwner, setSelectedOwner] = useState<string>('');


    const [form, setForm] = useState({
        description: '',
        image: [],
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) {
            toast.error("Vui lòng nhập nội dung phản hồi.");
            return;
        }

        if (!selectedOwner) {
            toast.error("Vui lòng chọn chủ trọ để gửi phản hồi.");
            return;
        }

        try {
            const payload = {
                description: message,
                images: form.image,
                ownerId: selectedOwner
            };

            await toast.promise(createFeedback(payload), {
                pending: "Đang gửi phản hồi...",
                success: "Đã gửi phản hồi thành công!",
                error: "Lỗi gửi phản hồi.",
            });

            setMessage("");
            setForm({ description: "", image: [] });
            setSelectedFileNames([]);
            setSelectedOwner("");
            setOpen(false);
            fetchData();

        } catch (error) {
            console.error(error);
        }
    };

    const handleImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target?.files;
        if (!files || files.length === 0) return;

        for (const file of Array.from(files)) {
            const error = singleFileValidator(file);
            if (error) {
                toast.error(error);
                continue;
            }

            const formData = new FormData();
            formData.append("image", file);

            try {
                const response = await toast.promise(createImageUrl(formData), {
                    pending: "Đang tải ảnh...",
                });

                const imageUrl = response.data; // đường dẫn trả về từ server

                setImages(prev => [
                    ...prev,
                    {
                        preview: URL.createObjectURL(file),
                        url: imageUrl,
                    },
                ]);

                setForm(prev => ({
                    ...prev,
                    image: [...prev.image, imageUrl],
                }));

            } catch (err) {
                toast.error("Upload ảnh thất bại");
            }
        }

        event.target.value = "";
    };

    useEffect(() => {
        const fetchOwners = async () => {
            try {
                const response = await getOwnersOfTenant(); // gọi API
                setOwners(response.data);
            } catch (error) {
                console.error("Lỗi lấy danh sách chủ trọ", error);
                toast.error("Không thể tải danh sách chủ trọ.");
            }
        };

        if (open) {
            fetchOwners();
        }
    }, [open]);


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-xl p-0">
                <div className="bg-gradient-to-br from-blue-100 via-white to-teal-100 rounded-2xl">
                    <Card className="shadow-xl rounded-2xl">
                        <CardContent className="p-8 space-y-6">
                            <h2 className="text-2xl font-bold text-center text-gray-800">💬 Gửi phản hồi</h2>
                            <p className="text-center text-sm text-gray-500">Hãy cho chúng tôi biết ý kiến của bạn về dịch vụ!</p>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Textarea
                                    placeholder="Nội dung phản hồi..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    className="min-h-[120px]"
                                />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Chọn chủ trọ</label>
                                    <select
                                        className="w-full border border-gray-300 rounded-lg p-2"
                                        value={selectedOwner}
                                        onChange={(e) => setSelectedOwner(e.target.value)}
                                        required
                                    >
                                        <option value="">-- Chọn một chủ trọ --</option>
                                        {owners.map(owner => (
                                            <option key={owner._id} value={owner._id}>
                                                {owner.displayName}
                                            </option>
                                        ))}
                                    </select>

                                </div>
                                <div>
                                    <div className="flex gap-2 items-center">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="px-3 py-2"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            📷 Tải ảnh
                                        </Button>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        id="imageInput"
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        multiple
                                        onChange={handleImage}
                                    />
                                    <div className="flex gap-2 flex-wrap mt-2">
                                        {images.map((img, index) => (
                                            <div key={index} className="relative w-24 h-24 group">
                                                <img
                                                    src={img.preview}
                                                    alt={`preview-${index}`}
                                                    className="w-full h-full object-cover rounded-lg border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setImages(prev => prev.filter((_, i) => i !== index));
                                                        setForm(prev => ({
                                                            ...prev,
                                                            image: prev.image.filter((_, i) => i !== index)
                                                        }));
                                                    }}
                                                    className="absolute top-[-6px] right-[-6px] bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center shadow-lg"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-br from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold rounded-xl py-2"
                                >
                                    🚀 Gửi phản hồi
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}
