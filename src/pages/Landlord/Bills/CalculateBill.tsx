import { fetchBillByIdAPIs, updateBillAPIs } from "@/apis/bill.apis";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export const CalculateBill = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bill, setBill] = useState<any>(null);
    const [oldElectricity, setOldElectricity] = useState(0);
    const [newElectricity, setNewElectricity] = useState(0);
    const [oldWater, setOldWater] = useState(0);
    const [newWater, setNewWater] = useState(0);
    const [electricityPrice, setElectricityPrice] = useState(0);
    const [waterPrice, setWaterPrice] = useState(0);
    const [prepay, setPrepay] = useState(0);
    const [deadline, setDeadline] = useState("");
    const [price, setPrice] = useState(0); // Số tiền phòng có thể chỉnh sửa

    // State để theo dõi lỗi validation
    const [errors, setErrors] = useState({
        electricity: "",
        water: ""
    });

    useEffect(() => {
        if (!id) return navigate('/not-found');
        fetchBillByIdAPIs(id).then(res => {
            const data = res.data;
            setBill(data);

            const oldElec = data.oldElectricity || 0;
            const oldWat = data.oldWater || 0;

            setOldElectricity(oldElec);
            setNewElectricity(data.newElectricity || oldElec); // Mặc định bằng số cũ
            setOldWater(oldWat);
            setNewWater(data.newWater || oldWat); // Mặc định bằng số cũ
            setPrepay(data.prepay || 0);
            setDeadline(data.duration || data.time?.slice(0, 10));
            setPrice(data.roomId?.price || 0); // Có thể chỉnh sửa

            const elec = data.serviceFee.find((s: any) => s.name === "Tiền điện");
            const water = data.serviceFee.find((s: any) => s.name === "Tiền nước");
            setElectricityPrice(elec?.price || 0);
            setWaterPrice(water?.price || 0);
        });
    }, []);

    // Validation function
    const validateInputs = () => {
        const newErrors = { electricity: "", water: "" };
        let isValid = true;

        if (newElectricity < oldElectricity) {
            newErrors.electricity = "Số điện mới không được nhỏ hơn số điện cũ";
            isValid = false;
        }

        if (newWater < oldWater) {
            newErrors.water = "Số nước mới không được nhỏ hơn số nước cũ";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Handle electricity change with validation
    const handleElectricityChange = (value: number, isNew: boolean) => {
        if (isNew) {
            setNewElectricity(value);
            if (value < oldElectricity) {
                setErrors(prev => ({ ...prev, electricity: "Số điện mới không được nhỏ hơn số điện cũ" }));
            } else {
                setErrors(prev => ({ ...prev, electricity: "" }));
            }
        } else {
            setOldElectricity(value);
            // Nếu số mới đang nhỏ hơn số cũ mới, reset validation
            if (newElectricity < value) {
                setNewElectricity(value);
                setErrors(prev => ({ ...prev, electricity: "" }));
            }
        }
    };

    // Handle water change with validation
    const handleWaterChange = (value: number, isNew: boolean) => {
        if (isNew) {
            setNewWater(value);
            if (value < oldWater) {
                setErrors(prev => ({ ...prev, water: "Số nước mới không được nhỏ hơn số nước cũ" }));
            } else {
                setErrors(prev => ({ ...prev, water: "" }));
            }
        } else {
            setOldWater(value);
            // Nếu số mới đang nhỏ hơn số cũ mới, reset validation
            if (newWater < value) {
                setNewWater(value);
                setErrors(prev => ({ ...prev, water: "" }));
            }
        }
    };

    const serviceList = bill?.serviceFee?.filter((s: any) => s.name !== "Tiền điện" && s.name !== "Tiền nước") || [];
    const dien = bill?.serviceFee?.find((s: any) => s.name === "Tiền điện");
    const nuoc = bill?.serviceFee?.find((s: any) => s.name === "Tiền nước");

    const allServices = [
        { name: "Phòng", price: price, _id: "room" }, // Sử dụng state price có thể chỉnh sửa
        ...serviceList,
        ...(dien ? [dien] : []),
        ...(nuoc ? [nuoc] : [])
    ];

    const totalElectricity = (newElectricity - oldElectricity) * electricityPrice;
    const totalWater = (newWater - oldWater) * waterPrice;
    const otherTotal = serviceList.reduce((sum: number, s: any) => sum + s.price, 0);
    const total = totalElectricity + totalWater + price + otherTotal;
    const remain = total - prepay;

    const handleSave = async () => {
        // Validate trước khi lưu
        if (!validateInputs()) {
            toast.error("Vui lòng kiểm tra lại thông tin nhập vào!");
            return;
        }

        const payload = {
            oldElectricity,
            newElectricity,
            oldWater,
            newWater,
            prepay,
            deadline,
            total,
            price: price
        }
        console.log("🚀 ~ handleSave ~ payload:", payload)

        await updateBillAPIs(id, payload)
            .then(() => {
                toast.success("Cập nhật hóa đơn thành công!");
                setTimeout(() => {
                    navigate("/bills");
                }, 500);
            })
            .catch(() => {
                toast.error("Có lỗi xảy ra khi cập nhật hóa đơn!");
            });
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-4">
            {/* Compact Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-lg font-semibold">Hóa đơn thanh toán</h1>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                        <span>Phòng: <strong className="text-foreground">{bill?.roomId?.roomId}</strong></span>
                        <span>Người thuê: <strong className="text-foreground">{bill?.tenantId?.displayName}</strong></span>
                    </div>
                </div>
                <div className="text-sm text-right">
                    <div>Ngày tạo: <strong>{bill?.createdAt?.slice(0, 10)}</strong></div>
                    <div className="flex items-center gap-2 mt-1">
                        <Label className="text-xs">Hạn thanh toán:</Label>
                        <Input
                            type="date"
                            value={deadline}
                            onChange={e => setDeadline(e.target.value)}
                            className="h-8 text-xs w-36"
                        />
                    </div>
                </div>
            </div>

            {/* Services Table */}
            <Card className="overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-100">
                        <TableRow>
                            <TableHead className="w-[50px]">STT</TableHead>
                            <TableHead>Nội dung</TableHead>
                            <TableHead className="text-right">Đơn giá</TableHead>
                            <TableHead className="text-center">Chỉ số cũ</TableHead>
                            <TableHead className="text-center">Chỉ số mới</TableHead>
                            <TableHead className="text-center">Số lượng</TableHead>
                            <TableHead className="text-right">Thành tiền</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allServices.map((service, idx) => {
                            let oldIdx = 0, newIdx = 0, qty = 1, total = service.price;
                            let showError = false;

                            if (service.name === "Tiền điện") {
                                oldIdx = oldElectricity;
                                newIdx = newElectricity;
                                qty = newElectricity - oldElectricity;
                                total = qty * electricityPrice;
                                showError = !!errors.electricity;
                            } else if (service.name === "Tiền nước") {
                                oldIdx = oldWater;
                                newIdx = newWater;
                                qty = newWater - oldWater;
                                total = qty * waterPrice;
                                showError = !!errors.water;
                            }

                            return (
                                <TableRow key={service._id} className={showError ? "bg-red-50" : ""}>
                                    <TableCell className="font-medium">{idx + 1}</TableCell>
                                    <TableCell>
                                        {service.name}
                                        {showError && (
                                            <div className="text-xs text-red-500 mt-1">
                                                {service.name === "Tiền điện" ? errors.electricity : errors.water}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {service.name === "Phòng" ? (
                                            <Input
                                                type="number"
                                                className="w-24 h-7 text-sm text-right"
                                                value={price}
                                                onChange={e => setPrice(+e.target.value)}
                                                min="0"
                                            />
                                        ) : (
                                            <span>{service.price?.toLocaleString()} VNĐ</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {service.name === "Tiền điện" || service.name === "Tiền nước" ? (
                                            <Input
                                                type="number"
                                                className={`w-16 h-7 text-sm text-center ${showError ? 'border-red-500' : ''}`}
                                                value={oldIdx}
                                                onChange={e => service.name === "Tiền điện"
                                                    ? handleElectricityChange(+e.target.value, false)
                                                    : handleWaterChange(+e.target.value, false)}
                                                min="0"
                                            />
                                        ) : (
                                            <div className="text-center text-sm">-</div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {service.name === "Tiền điện" || service.name === "Tiền nước" ? (
                                            <Input
                                                type="number"
                                                className={`w-16 h-7 text-sm text-center ${showError ? 'border-red-500' : ''}`}
                                                value={newIdx}
                                                onChange={e => service.name === "Tiền điện"
                                                    ? handleElectricityChange(+e.target.value, true)
                                                    : handleWaterChange(+e.target.value, true)}
                                                min="0"
                                            />
                                        ) : (
                                            <div className="text-center text-sm">-</div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center text-sm">
                                        {service.name === "Tiền điện" || service.name === "Tiền nước" ?
                                            (qty >= 0 ? qty : <span className="text-red-500">{qty}</span>) : "-"}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        {total?.toLocaleString()} VNĐ
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Card>

            {/* Summary Section */}
            <div className="space-y-2">
                <div className="flex justify-end items-center p-3 gap-2 bg-gray-50 rounded-md">
                    <Label className="text-sm">Tổng cộng:</Label>
                    <span className="font-semibold text-blue-600">
                        {total.toLocaleString()} VNĐ
                    </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center space-x-2">
                        <Label className="text-sm">Trả trước:</Label>
                        <Input
                            type="number"
                            value={prepay}
                            onChange={e => setPrepay(+e.target.value)}
                            className="w-24 h-8 text-sm"
                            min="0"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Label className="text-sm text-red-600">Còn lại:</Label>
                        <span className="font-semibold text-red-600">
                            {remain.toLocaleString()} VNĐ
                        </span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-4">
                <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                    Quay lại
                </Button>
                <Button
                    size="sm"
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={!!(errors.electricity || errors.water)}
                >
                    Lưu hóa đơn
                </Button>
            </div>
        </div>
    );
};