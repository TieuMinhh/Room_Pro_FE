"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  RefreshCw,
  UserX,
  UserCheck,
  Calendar,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  Building2,
  X,
} from "lucide-react"
import { fetchTenantAPIs, deleteTenantAPIs, restoreTenantAPIs } from "@/apis/tenant.apis"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = withReactContent(Swal)

type Tenant = {
  _id: string
  displayName: string
  phone: string
  dateOfBirth: string
  email: string
  address: string
  _destroy?: boolean
}

const PAGE_SIZE = 8

interface TenantTableProps {
  onDataChange?: () => void
}

const TenantTable = ({ onDataChange }: TenantTableProps) => {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [refreshing, setRefreshing] = useState(false)

  const loadData = async () => {
    try {
      setError(null)
      const res = await fetchTenantAPIs()
      const data = res.data ?? res
      setTenants(data)
      onDataChange?.() // Notify parent to update stats
    } catch (error) {
      console.error("Lỗi khi tải tenants:", error)
      setError("Không thể tải danh sách khách thuê. Vui lòng thử lại.")
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
    return tenants.filter(
      (tenant) =>
        tenant.displayName.toLowerCase().includes(search.toLowerCase()) ||
        tenant.phone.includes(search) ||
        tenant.email.toLowerCase().includes(search.toLowerCase()),
    )
  }, [tenants, search])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const clearSearch = () => {
    setSearch("")
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

  const handleDelete = async (tenant: Tenant) => {
    const ok = await confirmSwal(
      "Xác nhận khóa tài khoản?",
      `
        <div class="space-y-2">
          <p><strong>Tên:</strong> ${tenant.displayName}</p>
          <p><strong>Email:</strong> ${tenant.email}</p>
          <p><strong>SĐT:</strong> ${tenant.phone}</p>
          <p class="text-red-600 font-medium mt-2">⚠️ Tài khoản sẽ bị vô hiệu hóa và không thể đăng nhập.</p>
        </div>
      `,
      "Khóa tài khoản",
    )

    if (!ok.isConfirmed) return

    try {
      await deleteTenantAPIs(tenant._id)
      setTenants((prev) => prev.map((t) => (t._id === tenant._id ? { ...t, _destroy: true } : t)))
      onDataChange?.() // Update stats
      MySwal.fire({
        icon: "success",
        title: "Đã khóa tài khoản",
        text: `Tài khoản ${tenant.displayName} đã được khóa thành công.`,
        timer: 2000,
        showConfirmButton: false,
      })
    } catch (error) {
      console.error("Lỗi khóa:", error)
      MySwal.fire("Lỗi", "Không thể khóa tài khoản khách thuê.", "error")
    }
  }

  const handleRestore = async (tenant: Tenant) => {
    const ok = await confirmSwal(
      "Khôi phục tài khoản?",
      `<p>Bạn muốn khôi phục tài khoản <strong>${tenant.displayName}</strong>?</p>`,
      "Khôi phục",
      "#16a34a",
    )

    if (!ok.isConfirmed) return

    try {
      await restoreTenantAPIs(tenant._id)
      setTenants((prev) => prev.map((t) => (t._id === tenant._id ? { ...t, _destroy: false } : t)))
      onDataChange?.() // Update stats
      MySwal.fire({
        icon: "success",
        title: "Đã khôi phục tài khoản",
        text: `Tài khoản ${tenant.displayName} đã được khôi phục thành công.`,
        timer: 2000,
        showConfirmButton: false,
      })
    } catch (error) {
      console.error("Lỗi khôi phục:", error)
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
          <Skeleton className="h-8 w-[100px]" />
        </div>
      ))}
    </div>
  )

  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Building2 className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {search ? "Không tìm thấy khách thuê" : "Chưa có khách thuê nào"}
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {search
          ? `Không có khách thuê nào khớp với "${search}"`
          : "Danh sách khách thuê sẽ hiển thị tại đây khi có dữ liệu"}
      </p>
      {search && (
        <Button variant="outline" onClick={clearSearch}>
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
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
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
              {search && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                  onClick={clearSearch}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                Làm mới
              </Button>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Building2 className="w-4 h-4" />
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
                  <TableHead className="font-semibold text-gray-900">Trạng thái</TableHead>
                  <TableHead className="text-center font-semibold text-gray-900">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((tenant, index) => (
                  <TableRow
                    key={tenant._id}
                    className={`hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-25"
                    } ${tenant._destroy ? "opacity-60" : ""}`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-semibold text-sm">
                            {tenant.displayName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{tenant.displayName}</div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {new Date(tenant.dateOfBirth).toLocaleDateString("vi-VN")}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-600">{tenant.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-600">{tenant.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-600 truncate max-w-[200px]" title={tenant.address}>
                            {tenant.address}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={tenant._destroy ? "secondary" : "default"}
                        className={
                          tenant._destroy
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }
                      >
                        {tenant._destroy ? "Đã khóa" : "Hoạt động"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center">
                      {tenant._destroy ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRestore(tenant)}
                          className="hover:bg-green-50 hover:border-green-200 text-green-600 hover:text-green-700"
                        >
                          <UserCheck className="w-4 h-4 mr-1" />
                          Khôi phục
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(tenant)}
                          className="hover:bg-red-50 hover:border-red-200 text-red-600 hover:text-red-700"
                        >
                          <UserX className="w-4 h-4 mr-1" />
                          Khóa
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <div className="text-sm text-gray-500">
                Hiển thị {(currentPage - 1) * PAGE_SIZE + 1} - {Math.min(currentPage * PAGE_SIZE, filtered.length)}{" "}
                trong tổng số {filtered.length} khách thuê
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

export default TenantTable
