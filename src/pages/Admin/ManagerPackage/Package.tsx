"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Pencil,
  Trash2,
  PlusCircle,
  PackageX,
  Search,
  X,
  RefreshCw,
  Package,
  Clock,
  DollarSign,
  AlertCircle,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { deletePackageAPIs, getPackagesAPIs } from "@/apis/package.apis"
import withReactContent from "sweetalert2-react-content"
import Swal from "sweetalert2"

const MySwal = withReactContent(Swal)

interface PackageType {
  _id: string
  name: string
  description: string[]
  price: number
  availableTime: number
}

const PackageTable = () => {
  const [packages, setPackages] = useState<PackageType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const navigate = useNavigate()

  const fetchPackages = async () => {
    try {
      setError(null)
      const res = await getPackagesAPIs()
      setPackages(res.data)
    } catch (error) {
      console.error("Error fetching packages:", error)
      setError("Không thể tải danh sách gói dịch vụ. Vui lòng thử lại.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchPackages()
  }

  const handleDelete = async (id: string, name: string) => {
    const confirm = await MySwal.fire({
      title: "Xác nhận xóa",
      html: `Bạn có chắc chắn muốn xóa gói <strong>"${name}"</strong> không?<br><small class="text-gray-500">Hành động này không thể hoàn tác.</small>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      focusCancel: true,
    })

    if (confirm.isConfirmed) {
      try {
        await deletePackageAPIs(id)
        await fetchPackages()
        MySwal.fire({
          title: "Đã xóa!",
          text: "Gói dịch vụ đã được xóa thành công.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
      } catch (err) {
        console.error("Delete failed:", err)
        MySwal.fire("Lỗi", "Không thể xóa gói dịch vụ.", "error")
      }
    }
  }

  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.some((desc) => desc.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const clearSearch = () => {
    setSearchQuery("")
  }

  useEffect(() => {
    fetchPackages()
  }, [])

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
          <div className="space-x-2">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      ))}
    </div>
  )

  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <PackageX className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {searchQuery ? "Không tìm thấy gói dịch vụ" : "Chưa có gói dịch vụ nào"}
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {searchQuery
          ? `Không có gói dịch vụ nào khớp với "${searchQuery}"`
          : "Bắt đầu tạo gói dịch vụ đầu tiên để quản lý các dịch vụ của bạn"}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {searchQuery ? (
          <Button variant="outline" onClick={clearSearch}>
            <X className="w-4 h-4 mr-2" />
            Xóa bộ lọc
          </Button>
        ) : (
          <Button onClick={() => navigate("/packages/create")} className="bg-blue-600 hover:bg-blue-700">
            <PlusCircle className="w-4 h-4 mr-2" />
            Tạo gói dịch vụ đầu tiên
          </Button>
        )}
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="p-6">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Package className="w-6 h-6 text-blue-600" />
              Danh sách gói dịch vụ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LoadingSkeleton />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            Danh sách gói dịch vụ
            <Badge variant="secondary" className="ml-2">
              {packages.length} gói
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
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

          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Tìm kiếm gói dịch vụ..."
                className="pl-10 pr-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
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
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 bg-transparent"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                Làm mới
              </Button>
              <Button
                onClick={() => navigate("/packages/create")}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Thêm gói mới
              </Button>
            </div>
          </div>

          {/* Content */}
          {filteredPackages.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold text-gray-900">Tên gói</TableHead>
                    <TableHead className="font-semibold text-gray-900">Mô tả</TableHead>
                    <TableHead className="font-semibold text-gray-900">Giá</TableHead>
                    <TableHead className="font-semibold text-gray-900">Thời hạn</TableHead>
                    <TableHead className="text-right font-semibold text-gray-900">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPackages.map((pkg, index) => (
                    <TableRow
                      key={pkg._id}
                      className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-25"}`}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{pkg.name}</div>
                            
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="space-y-1">
                          {pkg.description.slice(0, 2).map((desc, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-sm text-gray-600 line-clamp-1">{desc}</span>
                            </div>
                          ))}
                          {pkg.description.length > 2 && (
                            <div className="text-xs text-gray-400 ml-3.5">+{pkg.description.length - 2} mô tả khác</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-green-600">{pkg.price.toLocaleString()} VNĐ</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{pkg.availableTime} tháng</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/packages/edit/${pkg._id}`)}
                            className="hover:bg-blue-50 hover:border-blue-200"
                          >
                            <Pencil className="w-4 h-4 mr-1" />
                            Sửa
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(pkg._id, pkg.name)}
                            className="hover:bg-red-50 hover:border-red-200 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Xóa
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default PackageTable
