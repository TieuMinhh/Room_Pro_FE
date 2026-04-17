import { fetchOrderByIdAPIs } from '@/apis/order.apis';
import Loader from '@/components/ui-customize/Loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Download, FilePlus, NotebookPen, NotebookPenIcon, SaveIcon, X, XIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/slice/userSlice';
import { SignatureDialog } from './components/Signature';
import { createContactApis, updateContractAPIs } from '@/apis/contract.apis';
import html2pdf from 'html2pdf.js';
import { toast } from 'react-toastify';
import { getDownloadUrl } from '@/utils/contanst';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const LandlordContracts = () => {
    const [order, setOrder] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [text, setText] = useState(`* Trách nhiệm của bên A:

- Tạo mọi điều kiện thuận lợi để bên B thực hiện theo hợp đồng.
- Cung cấp nguồn điện, nước, wifi cho bên B sử dụng.

* Trách nhiệm của bên B:

- Thanh toán đầy đủ các khoản tiền theo đúng thỏa thuận.
- Bảo quản các trang thiết bị và cơ sở vật chất của bên A trang bị ban đầu (làm hỏng phải sửa, mất phải đền).
- Không được tự ý sửa chữa, cải tạo cơ sở vật chất khi chưa được sự đồng ý của bên A.
- Giữ gìn vệ sinh trong và ngoài khuôn viên của phòng trọ.
- Bên B phải chấp hành mọi quy định của pháp luật Nhà nước và quy định của địa phương.
- Nếu bên B cho khách ở qua đêm thì phải báo và được sự đồng ý của chủ nhà, đồng thời phải chịu trách nhiệm về các hành vi vi phạm pháp luật của khách trong thời gian ở lại.`);

    const [signatureOpen, setSignatureOpen] = useState(false);

    const searchParam = new URLSearchParams(window.location.search);
    const orderId = searchParam.get('orderId');
    const [textPdf, setTextPdf] = useState(false);

    const currentUser = useSelector(selectCurrentUser);
    const [signature, setSignature] = useState(currentUser?.signature || '');


    const [loadingUpload, setLoadingUpload] = useState(false);

    const [deposit, setDeposit] = useState(2000000);
    const [paid, setPaid] = useState(false);

    const navigate = useNavigate();

    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetchOrderByIdAPIs(orderId);
            setOrder(res.data);
            setPaid(res.data?.contract?.paid || false);
            if (orderId && !res.data?.contract) {
                setOpen(true);
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    const contract = order?.contract;
    const roomName = order?.roomId?.name || 'Không xác định';

    const createContract = async () => {
        if (deposit <= 0) {
            return alert("Vui lý nhập số tiền đặt cọc ")
        }

        if (!signature) {
            return alert("Yêu cầu bạn phải ký ")
        }

        const element = document.getElementById('contract-content');
        if (!element) return;
        setLoadingUpload(true)
        setTextPdf(true);

        const opt = {
            margin: 0.5,
            filename: 'hop_dong_thue_tro.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        const pdfBlob = await html2pdf().from(element).set(opt).outputPdf('blob');

        const formData = new FormData();
        formData.append('pdf', new File([pdfBlob], `hop_dong_thue_tro_${order?.room?.roomId}_${dayjs().format('DD-MM-YYYY')}.pdf`, { type: 'application/pdf' }));
        formData.append('orderId', orderId || '');
        formData.append('deposit', (deposit || 0).toString());
        formData.append('content', text || '');
        formData.append('signature_A', signature);

        await toast.promise(
            createContactApis(formData),
            {
                pending: 'Tạo hợp đồng',
                success: 'Tạo hợp đồng thanh cong',
                error: 'Tạo hợp đồng that bai',
            }
        ).then((res) => setOrder(res.data));

        window.location.reload();
        setLoadingUpload(false)

        fetchData();
        setTextPdf(false);
        setSignature('');
        setText('');
        setOpen(false);

    };



    const handleSaveSignature = async (signature: string) => {

        setSignature(signature);
        setSignatureOpen(false);
    };

    function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
        return (
            <div className="space-y-1">
                <p className="text-muted-foreground">{label}:</p>
                <p className="font-medium text-base">{value}</p>
            </div>
        )
    }

    const handleUpdateContract = async (data) => {
        await updateContractAPIs(contract?._id, {
            deposit: deposit,
            paid: paid
        });
        toast.success("Cập nhật hợp đồng thành công!");
        setUpdateDialogOpen(false);
        fetchData();
    };


    return (
        <div className='relative'>

            <Button onClick={() => navigate(-1)} className="bg-blue-500 hover:bg-blue-600">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
            {!contract && open && <div style={{
                position: 'fixed',
                top: 60,
                right: 20,
                zIndex: 1000
            }}>
                <Button disabled={loadingUpload} className='absolute top-4 right-4 bg-blue-500 hover:bg-blue-600' onClick={createContract}>
                    <SaveIcon className="mr-2 h-4 w-4" />
                    Tạo hợp đồng
                </Button>
            </div>}
            <div className="p-6 max-w-3xl mx-auto">
                {!contract ? (
                    !open ? <div className="flex flex-col items-center justify-center h-[70vh] gap-4 text-center">
                        <FilePlus className="w-12 h-12 text-gray-500" />
                        <h2 className="text-xl font-semibold">Chưa có hợp đồng nào</h2>
                        <p className="text-gray-600">Vui lòng tạo hợp đồng cho người thuê.</p>
                        <Button onClick={() => { setOpen(true) }}>
                            Tạo hợp đồng
                        </Button>
                    </div>
                        : <div id="contract-content" style={{ maxWidth: "800px", border: "1px solid #ccc", margin: "auto", padding: 20, fontFamily: "DejaVu Sans, sans-serif", fontSize: 14, lineHeight: 1.6 }}>
                            <h2 style={{ textAlign: "center", margin: "4px 0" }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
                            <h3 style={{ textAlign: "center", margin: "4px 0" }}>Độc lập – Tự do – Hạnh phúc</h3>
                            <p style={{ textAlign: "right" }}>
                                Ngày {dayjs().get('date')} tháng {dayjs().get('month') + 1} năm {dayjs().get('year')}
                            </p>

                            <h1 style={{ textAlign: "center", margin: "10px 0 20px 0" }}>HỢP ĐỒNG THUÊ NHÀ TRỌ</h1>

                            <p className='italic'>- Căn cứ vào nhu cầu thực tế và sự thỏa thuận của các bên.</p>
                            <p className='italic'>Tại địa chỉ số: {currentUser?.address}, chúng tôi gồm có:</p>


                            <div className='flex flex-col gap-3 mb-3'>
                                <p ><b>1. Đại diện bên cho thuê phòng trọ (Bên A):</b></p>
                                <div className="grid grid-cols-2">
                                    <p>Ông/bà:
                                        <strong className='mx-2'> {currentUser?.displayName} </strong></p>
                                    <p>Ngày sinh: <strong> {dayjs(currentUser?.dateOfBirth).format('DD/MM/YYYY')}</strong></p>
                                </div>

                                <p>Nơi đăng ký HK:<strong> {currentUser?.address}</strong></p>
                                <p>CMND số: <strong>{currentUser.CCCD} </strong></p>
                                <p>Số điện thoại: <strong>{currentUser.phone}</strong></p>
                                <p><b>2. Bên thuê phòng trọ (Bên B):</b></p>
                                {order?.tenants?.map((tenant) => (
                                    <div className="grid grid-cols-3">
                                        <p>Họ tên:
                                            <strong className='mx-2'> {tenant?.displayName} </strong></p>
                                        <p>CMND số: <strong>{tenant.CCCD} </strong></p>
                                        <p>Số điện thoại: <strong>{tenant.phone}</strong></p>
                                    </div>
                                ))}

                            </div>

                            <strong style={{ display: "block", marginBottom: 20 }}>Sau khi thống nhất, chúng tôi đồng ý sửa đổi một số nội dung cụ thể như sau:</strong>

                            <p style={{ marginBottom: 10 }}>Bên A cho Bên B thuê 01 phòng trọ số <strong>{order?.room?.roomId}</strong>.
                                Với thời hạn là: từ <strong> {dayjs(order?.startAt).format('DD/MM/YYYY')}</strong> đến <strong> {dayjs(order?.endAt).format('DD/MM/YYYY')}</strong> ,
                                giá thuê: < strong> {order?.room?.price?.toLocaleString()} </strong> VND / tháng. Tiền thuê nhà không bao gồm chi phí khác như tiền điện, nước, vệ sinh.... Khoản tiền này sẽ do bên B trả theo khối lượng, công suất sử dụng thực tế của Bên B hàng tháng, được tính theo đơn giá của nhà nước.</p>
                            <p style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>Bên B sẽ giao cho Bên A một khoản tiền là {!textPdf ? <Input style={{ width: 100 }} value={deposit} onChange={(e: any) => setDeposit(e.target.value)} /> : deposit.toLocaleString()} VNĐ  </p>
                            {/* <p style={{ marginBottom: 10 }}>Ngay sau khi ký hợp đồng này. Số tiền này là tiền đặt cọc để đảm bảm thực hiện Hợp đồng cho thuê nhà.</p> */}
                            <p style={{ marginBottom: 10 }}>Nếu Bên A đơn phương chấm dứt hợp đồng mà không thực hiện nghĩa vụ báo trước tới bên B thì bên A sẽ phải hoàn trả lại Bên B số tiền đặt cọc và phải bồi thường thêm một khoản bằng chính tiền đặt cọc.</p>
                            <p style={{ marginBottom: 10 }}>Nếu Bên A đơn phương chấm dứt hợp đồng mà không thực hiện nghĩa vụ báo trước tới bên B thì bên A sẽ phải hoàn trả lại Bên B số tiền đặt cọc và phải bồi thường thêm một khoản bằng chính tiền đặt cọc.</p>
                            <p style={{ marginBottom: 10 }}>Vào thời điểm kết thúc thời hạn thuê hoặc kể từ ngày chấm dứt Hợp đồng, Bên A sẽ hoàn lại cho Bên B số tiền đặt cọc sau khi đã khấu trừ khoản tiền chi phí để khắc phục thiệt hại (nếu có)</p>
                            <p style={{ marginBottom: 10 }}>Tiền thuê nhà được thanh toán theo 01 (một) tháng/lần hàng tháng</p>
                            <strong style={{ display: "block", marginBottom: 10 }} >TRÁC NHIỆM CỦA 2 BIÊN:</strong>
                            {textPdf ? <div style={{ whiteSpace: "pre-line", marginBottom: 10 }}>
                                {text}
                            </div> : <textarea
                                className="border-none focus:ring-0 focus:outline-none w-full bg-transparent resize-none p-0 m-0"
                                name="changeItems"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                rows={text.split('\n').length + 2}
                                style={{ 
                                    width: "100%", 
                                    marginBottom: 10,
                                    overflow: 'hidden',
                                    fontFamily: 'inherit',
                                    fontSize: 'inherit',
                                    lineHeight: 'inherit'
                                }}
                            />}


                            <p>- Phụ lục hợp đồng được lập thành 02 bản có giá trị pháp lý như nhau, mỗi bên giữ một bản.</p>

                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 60 }}>
                                <div><b>ĐẠI DIỆN BÊN A</b><br /><br />
                                    {signature ? <>
                                        <div className="flex">
                                            <img src={signature} alt="avatar" className='mb-2' width={100} height={100} />
                                            {!textPdf && <XIcon className='cursor-pointer text-red-600' size={15} onClick={() => setSignature('')} />}
                                        </div>
                                        <div>{currentUser?.displayName}</div>
                                    </> : <Button onClick={() => setSignatureOpen(true)} className='mt-2'>Ký</Button>
                                    }

                                </div>
                                <div><b>ĐẠI DIỆN BÊN B</b><br /><br /><br />_________________</div>
                            </div>
                        </div>
                ) : (
                    <>

                        <Card className="shadow-xl border rounded-2xl">
                            <CardContent className="p-6 space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900">Thông tin hợp đồng</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                                    <InfoItem label="Phòng" value={order?.room?.roomId} />
                                    <InfoItem label="Trạng thái" value={<span className="text-green-600 font-semibold">Đã tạo</span>} />
                                    <InfoItem label="Ngày tạo" value={dayjs(contract?.createdAt).format("DD/MM/YYYY")} />
                                    <InfoItem label="Ngày kết thúc" value={dayjs(contract?.endDate).format("DD/MM/YYYY")} />
                                    <InfoItem
                                        label="Tiền cọc"
                                        value={contract?.deposit?.toLocaleString("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        })}
                                    />
                                    <InfoItem
                                        label="Tình trạng"
                                        value={
                                            <span className={contract?.paid ? "text-green-700" : "text-red-600"}>
                                                {contract?.paid ? "Đã thanh toán" : "Chưa thanh toán"}
                                            </span>
                                        }
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
                                    <Button variant="outline" onClick={() => window.open(getDownloadUrl(contract?.contractURI), '_blank')} className="gap-2">
                                        <Download className="w-4 h-4" />
                                        Tải xuống hợp đồng
                                    </Button>
                                    <Button variant="outline" onClick={() => setUpdateDialogOpen(true)} className="gap-2">
                                        <NotebookPen className="w-4 h-4" />
                                        Cập nhật hợp đồng
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                        <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Cập nhật hợp đồng</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <Label>Số tiền cọc (VNĐ)</Label>
                                        <Input
                                            type="number"
                                            value={contract?.deposit || 0}
                                            onChange={e => setDeposit(Number(e.target.value))}
                                            min={0}
                                        />
                                    </div>


                                    <div className=" items-center gap-2">
                                        <Label htmlFor="paid">Thanh toán :</Label>
                                        {/* Replace checkbox with Select */}
                                        <Select value={paid ? "paid" : "unpaid"} onValueChange={val => setPaid(val === "paid")}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="paid">Đã thanh toán</SelectItem>
                                                <SelectItem value="unpaid">Chưa thanh toán</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setUpdateDialogOpen(false)}>
                                        Hủy
                                    </Button>
                                    <Button onClick={handleUpdateContract} className="bg-blue-600 text-white hover:bg-blue-700">
                                        Lưu thay đổi
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </>

                )}
            </div>
            <SignatureDialog open={signatureOpen} setOpen={setSignatureOpen} onSave={handleSaveSignature} />
        </div>
    );
};
