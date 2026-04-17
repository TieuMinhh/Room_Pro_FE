"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  Filter,
  RefreshCw,
  UserX,
  UserCheck,
  Calendar,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  Users,
  X,
} from "lucide-react"
import { fetchAllUserAPIs } from "@/apis"
import { deleteUserAPIs, restoreUserAPIs } from "@/apis/userAPIs"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = withReactContent(Swal)

type User = {
  _id: string
  displayName: string
  phone: string
  dateOfBirth: string
  email: string
  address: string
  isActive: boolean
  role: string
  timeExpired: string
  _destroy?: boolean
}

const PAGE_SIZE = 8

interface UserTableProps {
  onDataChange?: () => void
}

const getRoleConfig = (role: string) => {
  switch (role) {
    case "owner1":
      return {
        label: "Chủ trọ cơ bản",
        color: "bg-blue-100 text-blue-700 border-blue-200",
        icon: "👤",
      }
    case "owner2":
      return {
        label: "Chủ trọ nâng cao",
        color: "bg-purple-100 text-purple-700 border-purple-200",
        icon: "👑",
      }
    default:
      return {
        label: "Người dùng",
        color: "bg-gray-100 text-gray-700 border-gray-200",
        icon: "👥",
      }
  }
}

const UserTable = ({ onDataChange }: UserTableProps) => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [refreshing, setRefreshing] = useState(false)

  const loadData = async () => {
    try {
      setError(null)
      const res = await fetchAllUserAPIs()
      const data = res.data ?? res
      const filteredData = data.filter((user: User) => user.role !== "admin")
      setUsers(filteredData)
      onDataChange?.() // Notify parent to update stats
    } catch (error) {
      console.error("Lỗi khi tải người dùng:", error)
      setError("Không thể tải danh sách người dùng. Vui lòng thử lại.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadData()
  }

  useEffect(() => {
    loadData()
  }, [])

  const filtered = useMemo(() => {
    return users.filter((user) => {
      const matchSearch =
        user.displayName.toLowerCase().includes(search.toLowerCase()) ||
        user.phone.includes(search) ||
        user.email.toLowerCase().includes(search.toLowerCase())

      const matchRole = roleFilter === "all" || user.role === roleFilter
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && !user._destroy) ||
        (statusFilter === "locked" && user._destroy)

      return matchSearch && matchRole && matchStatus
    })
  }, [users, search, roleFilter, statusFilter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const clearFilters = () => {
    setSearch("")
    setRoleFilter("all")
    setStatusFilter("all")
    setCurrentPage(1)
  }

  const confirmSwal = (title: string, html: string, confirmText: string, confirmColor = "#d33") =>
    MySwal.fire({
      title,
      html,
      confirmButtonText: confirmText,
      confirmButtonColor: confirmColor,
      showCancelButton: true,
      cancelButtonText: "Hủy",
      focusCancel: true,
      customClass: { htmlContainer: "text-left text-base" },
    })

  const handleDelete = async (user: User) => {
    const ok = await confirmSwal(
      "Xác nhận khóa tài khoản?",
      `
        <div class="space-y-2">
          <p><strong>Tên:</strong> ${user.displayName}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p class="text-red-600 font-medium mt-2">⚠️ Tài khoản sẽ bị vô hiệu hóa và không thể đăng nhập.</p>
        </div>
      `,
      "Khóa tài khoản",
    )

    if (!ok.isConfirmed) return

    try {
      await deleteUserAPIs(user._id)
      setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, _destroy: true } : u)))
      onDataChange?.() // Update stats
      MySwal.fire({
        icon: "success",
        title: "Đã khóa tài khoản",
        text: `Tài khoản ${user.displayName} đã được khóa thành công.`,
        timer: 2000,
        showConfirmButton: false,
      })
    } catch (e) {
      console.error(e)
      MySwal.fire("Lỗi", "Không thể khóa tài khoản.", "error")
    }
  }

  const handleRestore = async (user: User) => {
    const ok = await confirmSwal(
      "Khôi phục tài khoản?",
      `<p>Bạn muốn khôi phục tài khoản <strong>${user.displayName}</strong>?</p>`,
      "Khôi phục",
      "#16a34a",
    )

    if (!ok.isConfirmed) return

    try {
      await restoreUserAPIs(user._id)
      setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, _destroy: false } : u)))
      onDataChange?.() // Update stats
      MySwal.fire({
        icon: "success",
        title: "Đã khôi phục tài khoản",
        text: `Tài khoản ${user.displayName} đã được khôi phục thành công.`,
        timer: 2000,
        showConfirmButton: false,
      })
    } catch (e) {
      console.error(e)
      MySwal.fire("Lỗi", "Không thể khôi phục tài khoản.", "error")
    }
  }

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
          <Skeleton className="h-6 w-[80px]" />
          <Skeleton className="h-8 w-[100px]" />
        </div>
      ))}
    </div>
  )

  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Users className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {search || roleFilter !== "all" || statusFilter !== "all"
          ? "Không tìm thấy người dùng"
          : "Chưa có người dùng nào"}
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {search || roleFilter !== "all" || statusFilter !== "all"
          ? "Thử điều chỉnh bộ lọc để tìm thấy người dùng phù hợp"
          : "Danh sách người dùng sẽ hiển thị tại đây khi có dữ liệu"}
      </p>
      {(search || roleFilter !== "all" || statusFilter !== "all") && (
        <Button variant="outline" onClick={clearFilters}>
          <X className="w-4 h-4 mr-2" />
          Xóa bộ lọc
        </Button>
      )}
    </div>
  )

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            {error}
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
              {refreshing ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Thử lại"}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card className="border-0 shadow-sm bg-gray-50">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo tên, email, SĐT..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10 bg-white border-gray-200 focus:border-blue-500"
                />
              </div>

              <Select
                value={roleFilter}
                onValueChange={(val) => {
                  setRoleFilter(val)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-[180px] bg-white border-gray-200">
                  <SelectValue placeholder="Lọc vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả vai trò</SelectItem>
                  <SelectItem value="owner1">Chủ trọ cơ bản</SelectItem>
                  <SelectItem value="owner2">Chủ trọ nâng cao</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={statusFilter}
                onValueChange={(val) => {
                  setStatusFilter(val)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-[180px] bg-white border-gray-200">
                  <SelectValue placeholder="Lọc trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Đang hoạt động</SelectItem>
                  <SelectItem value="locked">Bị khoá</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              {(search || roleFilter !== "all" || statusFilter !== "all") && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Xóa bộ lọc
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                Làm mới
              </Button>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Filter className="w-4 h-4" />
                {filtered.length} kết quả
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-semibold text-gray-900">Thông tin cá nhân</TableHead>
                  <TableHead className="font-semibold text-gray-900">Liên hệ</TableHead>
                  <TableHead className="font-semibold text-gray-900">Vai trò</TableHead>
                  <TableHead className="font-semibold text-gray-900">Trạng thái</TableHead>
                  <TableHead className="font-semibold text-gray-900">Hết hạn</TableHead>
                  <TableHead className="text-center font-semibold text-gray-900">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((user, index) => {
                  const roleConfig = getRoleConfig(user.role)
                  const isExpired = new Date(user.timeExpired) < new Date()

                  return (
                    <TableRow
                      key={user._id}
                      className={`hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-25"
                      } ${user._destroy ? "opacity-60" : ""}`}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {user.displayName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{user.displayName}</div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Calendar className="w-3 h-3" />
                              {new Date(user.dateOfBirth).toLocaleDateString("vi-VN")}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600">{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600">{user.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600 truncate max-w-[200px]" title={user.address}>
                              {user.address}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge className={`${roleConfig.color} border`}>
                          <span className="mr-1">{roleConfig.icon}</span>
                          {roleConfig.label}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user._destroy ? (
                            <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200">
                              Bị khoá
                            </Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">
                              Đang hoạt động
                            </Badge>
                          )}
                          {!user.isActive && !user._destroy && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              Chưa xác thực
                            </Badge>
                          )}
                          {isExpired && (
                            <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 text-[10px] px-1 h-5">
                              Hết hạn
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="text-sm">
                          <div className={`font-medium ${isExpired ? "text-red-600" : "text-gray-900"}`}>
                            {new Date(user.timeExpired).toLocaleDateString("vi-VN")}
                          </div>
                          <div className="text-xs text-gray-500">{isExpired ? "Đã hết hạn" : "Còn hiệu lực"}</div>
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        {user._destroy ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRestore(user)}
                            className="hover:bg-green-50 hover:border-green-200 text-green-600 hover:text-green-700"
                          >
                            <UserCheck className="w-4 h-4 mr-1" />
                            Khôi phục
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(user)}
                            className="hover:bg-red-50 hover:border-red-200 text-red-600 hover:text-red-700"
                          >
                            <UserX className="w-4 h-4 mr-1" />
                            Khóa
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <div className="text-sm text-gray-500">
                Hiển thị {(currentPage - 1) * PAGE_SIZE + 1} - {Math.min(currentPage * PAGE_SIZE, filtered.length)}{" "}
                trong tổng số {filtered.length} người dùng
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  className="hidden sm:flex"
                >
                  Đầu
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                  Trước
                </Button>

                <div className="flex items-center gap-1">
                  {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                    const page = idx + Math.max(1, currentPage - 2)
                    if (page > totalPages) return null

                    return (
                      <Button
                        key={page}
                        size="sm"
                        variant={page === currentPage ? "default" : "outline"}
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                >
                  Sau
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className="hidden sm:flex"
                >
                  Cuối
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default UserTable
