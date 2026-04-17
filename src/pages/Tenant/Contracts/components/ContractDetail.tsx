import { fetchOrderByContractIdAPIs } from '@/apis/order.apis';
import { Button } from '@/components/ui/button';
import { selectCurrentUser } from '@/store/slice/userSlice';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { SignatureDialog } from './Signature';
import { DialogUpdateCCCD } from './DialogUpload';
import { toast } from 'react-toastify';
import html2pdf from 'html2pdf.js';
import { uploadContractAPIs } from '@/apis/contract.apis';
import { createPaymentContract } from '@/apis/payment.apis';

export const ContractDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState<any>({})
    const [loading, setLoading] = useState(false);
    const [signature, setSignature] = useState('');
    const currentUser = useSelector(selectCurrentUser);
    const [open, setOpen] = useState(false);
    const [openCCCD, setOpenCCCD] = useState(false);
    const [imageFront, setImageFront] = useState<string>("")
    const [imageBack, setImageBack] = useState<string>("")
    const [loadingUpload, setLoadingUpload] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetchOrderByContractIdAPIs(id);
            setOrder(res.data);
        } finally {
            setLoading(false);
        }
    }

    const handleSave = (image: string) => {
        setSignature(image);
    }

    const navigate = useNavigate();

    const handleSubmit = async () => {
        const element = document.getElementById('contract-content');
        if (!element) return;
        if (!signature) {
            toast.error("Vui lòng ký hợp đồng trước khi lưu!");
            return;
        }
        const opt = {
            margin: 0.5,
            filename: 'hop_dong_thue_tro.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        const pdfBlob = await html2pdf().from(element).set(opt).outputPdf('blob');
        setLoadingUpload(true);

        const formData = new FormData();
        formData.append('pdf', new File([pdfBlob], `hop_dong_thue_tro_${order?.room?.roomId}_${dayjs().format('DD-MM-YYYY')}.pdf`, { type: 'application/pdf' }));
        formData.append('signature_B', signature);
        formData.append('image1CCCD', imageFront);
        formData.append('image2CCCD', imageBack);

        await toast.promise(
            uploadContractAPIs(id, formData),
            {
                pending: 'Tạo hợp đồng',
                success: 'Tạo hợp đồng thanh cong',
                error: 'Tạo hợp đồng that bai',
            }
        ).then((res) =>
            navigate('/contracts')
        );
    }

    return (
        <>
            {order?.contract?.status === 'pending_signature' && (
                <div style={{
                    position: 'fixed',
                    top: 80,
                    right: 20,
                    zIndex: 1000
                }}>
                    <Button disabled={loadingUpload} onClick={() => handleSubmit()}>
                        Lưu hợp đồng
                    </Button>
                </div>
            )}
            <div id="contract-content" style={{ maxWidth: "800px", border: "1px solid #ccc", margin: "auto", padding: 20, fontFamily: "DejaVu Sans, sans-serif", fontSize: 14, lineHeight: 1.6 }}>
                <h2 style={{ textAlign: "center", margin: "4px 0" }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
                <h3 style={{ textAlign: "center", margin: "4px 0" }}>Độc lập – Tự do – Hạnh phúc</h3>
                <p style={{ textAlign: "right" }}>
                    Ngày {dayjs(order?.contract?.createdAt).get('date')} tháng {dayjs(order?.contract?.createdAt).get('month') + 1} năm {dayjs(order?.contract?.createdAt).get('year')}
                </p>

                <h1 style={{ textAlign: "center", margin: "10px 0 20px 0" }}>HỢP ĐỒNG THUÊ NHÀ TRỌ</h1>

                <p className='italic'>- Căn cứ vào nhu cầu thực tế và sự thỏa thuận của các bên.</p>
                <p className='italic'>Tại địa chỉ số: {order?.owner?.address}, chúng tôi gồm có:</p>


                <div className='flex flex-col gap-3 mb-3'>
                    <p ><b>1. Đại diện bên cho thuê phòng trọ (Bên A):</b></p>
                    <div className="grid grid-cols-2">
                        <p>Ông/bà:
                            <strong className='mx-2'> {order?.owner?.displayName} </strong></p>
                        <p>Ngày sinh: <strong> {dayjs(order?.owner?.dateOfBirth).format('DD/MM/YYYY')}</strong></p>
                    </div>

                    <p>Nơi đăng ký HK:<strong> {order?.owner?.address}</strong></p>
                    <p>CMND số: <strong>{order?.owner?.CCCD} </strong></p>
                    <p>Số điện thoại: <strong>{order?.owner?.phone}</strong></p>
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
                <p style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>Bên B sẽ giao cho Bên A một khoản tiền là  <strong>{order?.contract?.deposit?.toLocaleString()}</strong> VNĐ  </p>
                {/* <p style={{ marginBottom: 10 }}>Ngay sau khi ký hợp đồng này. Số tiền này là tiền đặt cọc để đảm bảm thực hiện Hợp đồng cho thuê nhà.</p> */}
                <p style={{ marginBottom: 10 }}>Nếu Bên A đơn phương chấm dứt hợp đồng mà không thực hiện nghĩa vụ báo trước tới bên B thì bên A sẽ phải hoàn trả lại Bên B số tiền đặt cọc và phải bồi thường thêm một khoản bằng chính tiền đặt cọc.</p>
                <p style={{ marginBottom: 10 }}>Nếu Bên A đơn phương chấm dứt hợp đồng mà không thực hiện nghĩa vụ báo trước tới bên B thì bên A sẽ phải hoàn trả lại Bên B số tiền đặt cọc và phải bồi thường thêm một khoản bằng chính tiền đặt cọc.</p>
                <p style={{ marginBottom: 10 }}>Vào thời điểm kết thúc thời hạn thuê hoặc kể từ ngày chấm dứt Hợp đồng, Bên A sẽ hoàn lại cho Bên B số tiền đặt cọc sau khi đã khấu trừ khoản tiền chi phí để khắc phục thiệt hại (nếu có)</p>
                <p style={{ marginBottom: 10 }}>Tiền thuê nhà được thanh toán theo 01 (một) tháng/lần hàng tháng</p>
                <strong style={{ display: "block", marginBottom: 10 }} >TRÁC NHIỆM CỦA 2 BIÊN:</strong>
                <div style={{ whiteSpace: "pre-line", marginBottom: 10 }}>
                    {
                        order?.contract?.content
                    }
                </div>


                <p>- Phụ lục hợp đồng được lập thành 02 bản có giá trị pháp lý như nhau, mỗi bên giữ một bản.</p>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 60 }}>
                    <div><b>ĐẠI DIỆN BÊN A</b><br /><br />
                        <>
                            <img src={order?.contract?.signature_A} alt="avatar" className='mb-2' width={100} height={100} />
                            <div>{order?.owner?.displayName}</div>
                        </>



                    </div>
                    <div>
                        <b>ĐẠI DIỆN BÊN B</b><br /><br />
                        {order?.contract?.signature_B || signature ? (
                            <>
                                <img src={order?.contract?.signature_B || signature} alt="signature" className='mb-2' width={100} height={100} />
                                <div>{currentUser?.displayName}</div>
                            </>
                        ) : (
                            order?.contract?.status === 'pending_signature' && (
                                <Button onClick={() => setOpen(true)}>
                                    Ký hợp đồng
                                </Button>
                            )
                        )}
                    </div>
                </div>

            </div>
            <SignatureDialog open={open} setOpen={setOpen} onSave={handleSave} />
            {/* <DialogUpdateCCCD open={openCCCD} setOpen={setOpenCCCD} imageFront={imageFront} setImageFront={setImageFront} imageBack={imageBack} setImageBack={setImageBack} handleSave={handleSubmit} /> */}
        </>

    )
}
