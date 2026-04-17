import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getRoomById, updateRoom } from '@/apis/roomApi'
import { getDepartmentsByOwner } from '@/apis/departmentApi'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowLeft, PlusCircle, MinusCircle, XCircle } from 'lucide-react'
import { singleFileValidator } from '@/utils/validators'
import { createImageUrl } from '@/apis'
import { toast } from 'react-toastify'

const EditRoom = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [departments, setDepartments] = useState([])
    const [room, setRoom] = useState(null)
    const [form, setForm] = useState({
        roomId: '',
        image: [],
        price: '',
        area: '',
        utilities: [],
        serviceFee: [],
        departmentId: '',
        post: true,
        status: true,
        type: 'Phòng trọ'
    })
    const [newUtility, setNewUtility] = useState('')
    const [newService, setNewService] = useState({ name: '', price: '', unit: '' })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resRoom = await getRoomById(id)
                setRoom(resRoom.data)
                const deps = await getDepartmentsByOwner()
                setDepartments(deps.data)
            } catch {
                toast.error('Không thể tải dữ liệu phòng hoặc tòa nhà')
            }
        }
        fetchData()
    }, [id])

    useEffect(() => {
        if (room) {
            setForm({
                ...room,
                price: room.price.toString(),
                image: room.image || [],
                utilities: room.utilities ? room.utilities.split(',').map(u => u.trim()) : [],
                serviceFee: room.serviceFee || [],
                departmentId: room.departmentId || '',
                type: room.type || 'Phòng trọ',
                post: room.post ?? true,
                status: room.status ?? true
            })
        }
    }, [room])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleServicePriceChange = (index, value) => {
        const updated = [...form.serviceFee]
        updated[index].price = value
        setForm(prev => ({ ...prev, serviceFee: updated }))
    }

    const handleAddService = () => {
        if (!newService.name.trim() || !newService.unit.trim()) return
        setForm(prev => ({
            ...prev,
            serviceFee: [...prev.serviceFee, { ...newService }]
        }))
        setNewService({ name: '', price: '', unit: '' })
    }

    const handleRemoveService = (index) => {
        if (index <= 1) return
        const updated = [...form.serviceFee]
        updated.splice(index, 1)
        setForm(prev => ({ ...prev, serviceFee: updated }))
    }

    const handleAddUtility = () => {
        if (newUtility.trim() && !form.utilities.includes(newUtility.trim())) {
            setForm(prev => ({
                ...prev,
                utilities: [...prev.utilities, newUtility.trim()]
            }))
            setNewUtility('')
        }
    }

    const handleRemoveUtility = (index) => {
        const updated = [...form.utilities]
        updated.splice(index, 1)
        setForm(prev => ({ ...prev, utilities: updated }))
    }

    const handleImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target?.files;
        if (!files || files.length === 0) return;

        for (const file of files) {
            const error = singleFileValidator(file);
            if (error) {
                toast.error(error);
                continue;
            }

            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await toast.promise(createImageUrl(formData), {
                    pending: 'Đang tải ảnh lên...'
                });

                setForm(prev => ({
                    ...prev,
                    image: [...prev.image, response.data]
                }));
            } catch {
                toast.error('Upload ảnh thất bại');
            }
        }

        event.target.value = ''
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const payload = {
            ...form,
            utilities: form.utilities.join(', '),
            price: Number(form.price),
            area: Number(form.area),
            serviceFee: form.serviceFee.map(f => ({ ...f, price: Number(f.price) }))
        }
        try {
            await updateRoom(id, payload)
            toast.success('Cập nhật phòng thành công')
            navigate('/rooms')
        } catch {
            toast.error('Cập nhật thất bại')
        }
    }

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-8 bg-white rounded-2xl shadow-lg space-y-8">
            <div className="flex items-center gap-2 mb-4">
                <Button variant="outline" onClick={() => navigate('/rooms')} className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Quay lại
                </Button>
                <h2 className="text-2xl font-bold text-gray-800 flex-1 text-center">Chỉnh sửa phòng</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Thông tin cơ bản */}
                <section className="bg-gray-50 rounded-xl border p-4 md:p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-700">Mã phòng</label>
                            <Input name="roomId" required value={form.roomId} onChange={handleInputChange} className="" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-700">Giá phòng</label>
                            <Input name="price" type="number" required value={form.price} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-700">Diện tích (m²)</label>
                            <Input name="area" type="number" required value={form.area} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-700">Ảnh phòng</label>
                            <div className="flex gap-2 items-center mb-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="px-3 py-2"
                                    onClick={() => document.getElementById('imageInput')?.click()}
                                >📷</Button>
                                <span className="text-sm text-gray-400">Chọn ảnh từ máy</span>
                            </div>
                            <input id="imageInput" type="file" accept="image/*" hidden multiple onChange={handleImage} />
                            {form.image.length > 0 && (
                                <div className="flex flex-wrap gap-3 mt-2">
                                    {form.image.map((img, idx) => (
                                        <div key={idx} className="flex flex-col items-center bg-blue-50 border border-blue-200 rounded px-2 py-2 gap-1 relative group w-[100px]">
                                            <img
                                                src={img}
                                                alt={`room-img-${idx}`}
                                                className="w-[80px] h-[60px] object-cover rounded shadow border border-blue-100"
                                                onError={e => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.onerror = null;
                                                    target.src = 'https://via.placeholder.com/80x60?text=No+Image';
                                                }}
                                            />
                                            <span className="truncate max-w-[80px] text-blue-700 text-[10px] text-center">{img}</span>
                                            <XCircle
                                                className="w-4 h-4 text-red-500 cursor-pointer absolute top-1 right-1 opacity-80 hover:opacity-100 bg-white rounded-full p-[1px]"
                                                onClick={() => {
                                                    const updated = [...form.image];
                                                    updated.splice(idx, 1);
                                                    setForm(prev => ({ ...prev, image: updated }))
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Tòa nhà + loại phòng */}
                <section className="bg-gray-50 rounded-xl border p-4 md:p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-700">Chọn tòa nhà</label>
                            <select
                                title='Toà nhà'
                                name="departmentId"
                                value={form.departmentId}
                                onChange={handleInputChange}
                                className="w-full border rounded-md px-3 py-2 bg-white"
                            >
                                {departments.map(dep => (
                                    <option key={dep._id} value={dep._id}>{dep.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-700">Loại phòng</label>
                            <select
                                title='Loại phòng'
                                name="type"
                                value={form.type}
                                onChange={handleInputChange}
                                className="w-full border rounded-md px-3 py-2 bg-white"
                            >
                                <option value="Phòng trọ">Phòng trọ</option>
                                <option value="Căn hộ mini">Căn hộ mini</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Phí dịch vụ */}
                <section className="bg-gray-50 rounded-xl border p-4 md:p-6">
                    <h3 className="text-lg font-semibold mb-4 text-blue-700">Phí dịch vụ</h3>
                    <div className="space-y-2">
                        {form.serviceFee.map((fee, index) => (
                            <div key={index} className="flex gap-2 items-center">
                                <Input readOnly value={fee.name} className="w-1/3 bg-gray-100" />
                                <Input
                                    type="number"
                                    placeholder="Giá"
                                    value={fee.price}
                                    onChange={(e) => handleServicePriceChange(index, e.target.value)}
                                    className="w-1/3"
                                    required
                                />
                                <Input readOnly value={fee.unit} className="w-1/4 bg-gray-100" />
                                {index > 1 && (
                                    <MinusCircle className="text-red-500 w-5 h-5 cursor-pointer" onClick={() => handleRemoveService(index)} />
                                )}
                            </div>
                        ))}
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            <Input placeholder="Tên dịch vụ" value={newService.name} onChange={e => setNewService(prev => ({ ...prev, name: e.target.value }))} />
                            <Input placeholder="Giá" value={newService.price} type="number" onChange={e => setNewService(prev => ({ ...prev, price: e.target.value }))} />
                            <Input placeholder="Đơn vị" value={newService.unit} onChange={e => setNewService(prev => ({ ...prev, unit: e.target.value }))} />
                        </div>
                        <Button type="button" onClick={handleAddService} className="mt-2 flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200">
                            <PlusCircle className="w-4 h-4" /> Thêm dịch vụ
                        </Button>
                    </div>
                </section>

                {/* Tiện ích */}
                <section className="bg-gray-50 rounded-xl border p-4 md:p-6">
                    <h3 className="text-lg font-semibold mb-4 text-blue-700">Tiện ích</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {form.utilities.map((item, index) => (
                            <div key={index} className="bg-blue-100 rounded-full px-4 py-1 flex items-center gap-2 border border-blue-200">
                                <span className="text-blue-700">{item}</span>
                                <XCircle className="w-4 h-4 text-red-500 cursor-pointer" onClick={() => handleRemoveUtility(index)} />
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Input placeholder="Thêm tiện ích" value={newUtility} onChange={(e) => setNewUtility(e.target.value)} />
                        <Button type="button" onClick={handleAddUtility} className="bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center gap-1">
                            <PlusCircle className="w-4 h-4 mr-1" /> Thêm
                        </Button>
                    </div>
                </section>

                <div className="flex justify-center mt-6">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg text-lg font-semibold shadow">
                        Cập nhật phòng
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default EditRoom
