"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { format } from "date-fns"
import { fetchTransactionByAdmin } from "@/apis/transaction"
import { ChevronLeft, ChevronRight, Search, X, CreditCard, AlertCircle, RefreshCw, Filter } from "lucide-react"

interface User {
  fullName: string
  email: string
  displayName: string
}

interface Transaction {
  _id: string
  senderId: User
  receiverId: User
  amount: number
  bank: string
  cardType: string
  description?: string
  status: "pending" | "success" | "failed"
  createdAt: string
}

const HistoryPayment = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [refreshing, setRefreshing] = useState(false)
  const itemsPerPage = 8

  const fetchTransactions = async () => {
    try {
      setError(null)
      const res = await fetchTransactionByAdmin()
      setTransactions(res.data)
    } catch (err) {
      console.error("Lỗi khi lấy giao dịch:", err)
      setError("Không thể tải dữ liệu giao dịch. Vui lòng thử lại.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchTransactions()
  }

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const senderName = tx.senderId?.displayName?.toLowerCase() || ""
      const senderEmail = tx.senderId?.email?.toLowerCase() || ""
      const searchTerm = searchQuery.toLowerCase()
      return (
        senderName.includes(searchTerm) ||
        senderEmail.includes(searchTerm) ||
        tx.bank?.toLowerCase().includes(searchTerm) ||
        tx.description?.toLowerCase().includes(searchTerm)
      )
    })
  }, [searchQuery, transactions])

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredTransactions.slice(start, start + itemsPerPage)
  }, [filteredTransactions, currentPage])

  const clearSearch = () => {
    setSearchQuery("")
    setCurrentPage(1)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Thành công</Badge>
      case "failed":
        return <Badge variant="destructive">Thất bại</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Đang xử lý</Badge>
      default:
        return <Badge variant="secondary">Không xác định</Badge>
    }
  }

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
          <Skeleton className="h-6 w-[80px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      ))}
    </div>
  )

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <CreditCard className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {searchQuery ? "Không tìm thấy giao dịch" : "Chưa có giao dịch nào"}
      </h3>
      <p className="text-gray-500 mb-4">
        {searchQuery
          ? `Không có giao dịch nào khớp với "${searchQuery}"`
          : "Các giao dịch nâng cấp gói sẽ hiển thị tại đây"}
      </p>
      {searchQuery && (
        <Button variant="outline" onClick={clearSearch}>
          Xóa bộ lọc
        </Button>
      )}
    </div>
  )

  const renderPaginationNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          size="sm"
          variant={currentPage === i ? "default" : "outline"}
          onClick={() => setCurrentPage(i)}
          className="w-8 h-8 p-0"
        >
          {i}
        </Button>,
      )
    }

    return pages
  }

  if (loading) {
    return (
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <CreditCard className="w-6 h-6" />
            Lịch sử nâng cấp gói
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
          <CreditCard className="w-6 h-6 text-blue-600" />
          Lịch sử nâng cấp gói
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
              placeholder="Tìm kiếm theo tên, email, ngân hàng..."
              className="pl-10 pr-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
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

          <div className="flex items-center gap-2">
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
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Filter className="w-4 h-4" />
              {filteredTransactions.length} kết quả
            </div>
          </div>
        </div>

        {/* Table */}
        {filteredTransactions.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold text-gray-900">Người gửi</TableHead>
                    <TableHead className="font-semibold text-gray-900">Email</TableHead>
                    <TableHead className="font-semibold text-gray-900">Số tiền</TableHead>
                    <TableHead className="font-semibold text-gray-900">Ngân hàng</TableHead>
                    <TableHead className="font-semibold text-gray-900">Mô tả</TableHead>
                    <TableHead className="font-semibold text-gray-900">Trạng thái</TableHead>
                    <TableHead className="font-semibold text-gray-900">Thời gian</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTransactions.map((tx, index) => (
                    <TableRow
                      key={tx._id}
                      className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-25"}`}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {tx.senderId?.displayName?.charAt(0)?.toUpperCase() || "?"}
                            </span>
                          </div>
                          <span>{tx.senderId?.displayName || "N/A"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{tx.senderId?.email || "N/A"}</TableCell>
                      <TableCell>
                        <span className="text-green-600 font-semibold">{tx.amount.toLocaleString()} VND</span>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-sm">
                          <CreditCard className="w-3 h-3" />
                          { "Ví nội bộ"}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <span className="text-gray-600 truncate block" title={tx.description}>
                          {tx.description || "Không có"}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(tx.status)}</TableCell>
                      <TableCell className="text-gray-500">
                        {format(new Date(tx.createdAt), "dd/MM/yyyy HH:mm")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
                <div className="text-sm text-gray-500">
                  Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{" "}
                  {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} trong tổng số{" "}
                  {filteredTransactions.length} giao dịch
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
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <div className="flex items-center gap-1">{renderPaginationNumbers()}</div>

                  <Button
                    size="sm"
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  >
                    <ChevronRight className="w-4 h-4" />
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
      </CardContent>
    </Card>
  )
}

export default HistoryPayment
