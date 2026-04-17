import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  getDepartmentsByOwner,
  deleteDepartment,
  getRoomsByDepartment
} from '@/apis/departmentApi'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, PlusCircle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { selectCurrentUser } from '@/store/slice/userSlice'
import { toast } from 'react-toastify'
import RoomTable from './RoomTable'

const DepartmentList: React.FC = () => {
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteName, setDeleteName] = useState<string>("")
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedRooms, setSelectedRooms] = useState<any[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null)

  useEffect(() => {
    if (currentUser?._id) {
      fetchDepartments()
    }
  }, [currentUser])

  const fetchDepartments = async () => {
    setLoading(true)
    try {
      const res = await getDepartmentsByOwner()
      setDepartments(res.data)

      // Load phòng của tòa đầu tiên (tuỳ chọn)
      if (res.data.length > 0) {
        const firstDepartment = res.data[0]
        const roomRes = await getRoomsByDepartment(firstDepartment._id)
        setSelectedDepartment(firstDepartment)
        setSelectedRooms(roomRes.data)
      }
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách tòa nhà")
    } finally {
      setLoading(false)
    }
  }

  const handleShowRooms = async (department: any) => {
    // Toggle
    if (selectedDepartment?._id === department._id) {
      setSelectedDepartment(null)
      setSelectedRooms([])
      return
    }

    try {
      const res = await getRoomsByDepartment(department._id)
      setSelectedRooms(res.data)
      setSelectedDepartment(department)
    } catch (err) {
      toast.error("Lỗi khi tải danh sách phòng")
    }
  }

  const handleDetail = (id: string) => {
    navigate(`/departments/${id}`)
  }

  const handleDelete = (id: string, name: string) => {
    setDeleteId(id)
    setDeleteName(name)
    setConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    try {
      await deleteDepartment(deleteId)
      toast.success("Xóa tòa nhà thành công")
      setDepartments(prev => prev.filter(dep => dep._id !== deleteId))

      if (selectedDepartment?._id === deleteId) {
        setSelectedDepartment(null)
        setSelectedRooms([])
      }
    } catch (err) {
      toast.error("Xóa thất bại")
    } finally {
      setConfirmOpen(false)
      setDeleteId(null)
    }
  }

  if (loading) {
    return (
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow mb-4 border border-blue-200">
        <h1 className="text-2xl font-extrabold text-blue-700 tracking-tight flex items-center gap-2">
          <img src="/images/departments.svg" alt="departments" className="w-10 h-10" />
          Danh sách tòa nhà
        </h1>
        <Button
          onClick={() => navigate('/departments/create')}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-6 py-2 rounded-lg shadow-md text-base font-semibold transition-all duration-200"
        >
          <PlusCircle className="w-5 h-5" />
          <span> Tạo tòa nhà</span>
        </Button>
      </div>

      {departments.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-4">
          <img
            src="/images/departments.svg"
            alt="Empty departments"
            className="w-48 h-48 object-contain mb-6 opacity-80"
          />
          <h2 className="text-2xl font-bold text-blue-600 mb-2">
            Bạn không có tòa nhà nào!
          </h2>
          <p className="text-gray-500 mb-4 text-base">
            Hãy tạo ngay để bắt đầu quản lý phòng trọ hiệu quả.
          </p>
        </div>
      ) : (
        <div className="p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 w-full">
          {departments.map(dep => (
            <div key={dep._id} className="mb-2">
              <div
                className={`rounded-xl shadow-md p-3 border cursor-pointer flex items-center justify-between transition-all duration-200 group hover:scale-[1.02] hover:shadow-lg
                  ${selectedDepartment?._id === dep._id
                    ? 'bg-blue-50 border-blue-500 shadow-blue-200'
                    : 'bg-white border-gray-200'}
                `}
                onClick={() => handleShowRooms(dep)}
              >
                <div className="flex flex-col gap-1">
                  <h2 className={`text-base font-bold flex items-center gap-2 ${selectedDepartment?._id === dep._id ? 'text-blue-700' : 'text-blue-600'}`}>
                    <span className="inline-block bg-blue-100 text-blue-600 rounded-full px-2 py-0.5 text-xs font-semibold mr-2">Tòa</span>
                    {dep.name}
                  </h2>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="group-hover:bg-blue-100">
                      <MoreHorizontal className="w-5 h-5 text-blue-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDetail(dep._id)}>
                      <span className="text-blue-600 font-medium">Xem / Chỉnh sửa</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(dep._id, dep.name)}>
                      <span className="text-red-600 font-medium">Xoá</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedDepartment && (
        <div className="px-2 md:px-6 pb-12">
          <RoomTable rooms={selectedRooms} departmentName={selectedDepartment.name} />
        </div>
      )}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xoá</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xoá tòa nhà <strong>{deleteName}</strong>? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Hủy
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDelete}
            >
              Xác nhận xoá
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DepartmentList
