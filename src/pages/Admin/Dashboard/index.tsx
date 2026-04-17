"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  Building2,
  Package,
  DollarSign,
  Activity,
  Clock,
  AlertCircle,
  RefreshCw,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  UserCheck,
  CreditCard,
  Target,
  BarChart3,
} from "lucide-react"
import { fetchAllUserAPIs } from "@/apis"
import { fetchTenantAPIs } from "@/apis/tenant.apis"
import { getPackagesAPIs } from "@/apis/package.apis"
import { fetchTransactionByAdmin } from "@/apis/transaction"

interface DashboardStats {
  users: {
    total: number
    active: number
    inactive: number
    growth: number
  }
  tenants: {
    total: number
    active: number
    growth: number
  }
  packages: {
    total: number
    active: number
  }
  transactions: {
    total: number
    totalAmount: number
    successful: number
    pending: number
    failed: number
    growth: number
  }
  revenue: {
    thisMonth: number
    lastMonth: number
    growth: number
  }
}

interface RecentActivity {
  id: string
  type: "user" | "transaction" | "package"
  title: string
  description: string
  time: string
  status: "success" | "warning" | "error"
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    users: { total: 0, active: 0, inactive: 0, growth: 0 },
    tenants: { total: 0, active: 0, growth: 0 },
    packages: { total: 0, active: 0 },
    transactions: { total: 0, totalAmount: 0, successful: 0, pending: 0, failed: 0, growth: 0 },
    revenue: { thisMonth: 0, lastMonth: 0, growth: 0 },
  })
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const loadDashboardData = async () => {
    try {
      setError(null)

      // Fetch all data in parallel
      const [usersRes, tenantsRes, packagesRes, transactionsRes] = await Promise.all([
        fetchAllUserAPIs(),
        fetchTenantAPIs(),
        getPackagesAPIs(),
        fetchTransactionByAdmin(),
      ])

      // Process users data
      const usersData = usersRes.data ?? usersRes
      const filteredUsers = usersData.filter((user: any) => user.role !== "admin")
      const activeUsers = filteredUsers.filter((user: any) => user.isActive && !user._destroy)

      // Process tenants data
      const tenantsData = tenantsRes.data ?? tenantsRes
      const activeTenants = tenantsData.filter((tenant: any) => !tenant._destroy)

      // Process packages data
      const packagesData = packagesRes.data ?? packagesRes

      // Process transactions data
      const transactionsData = transactionsRes.data ?? transactionsRes
      const successfulTransactions = transactionsData.filter((tx: any) => tx.status === "success")
      const pendingTransactions = transactionsData.filter((tx: any) => tx.status === "pending")
      const failedTransactions = transactionsData.filter((tx: any) => tx.status === "failed")

      // Calculate revenue
      const totalRevenue = successfulTransactions.reduce((sum: number, tx: any) => sum + tx.amount, 0)

      // Calculate this month and last month revenue
      const now = new Date()
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

      const thisMonthRevenue = successfulTransactions
        .filter((tx: any) => new Date(tx.createdAt) >= thisMonth)
        .reduce((sum: number, tx: any) => sum + tx.amount, 0)

      const lastMonthRevenue = successfulTransactions
        .filter((tx: any) => {
          const txDate = new Date(tx.createdAt)
          return txDate >= lastMonth && txDate < thisMonth
        })
        .reduce((sum: number, tx: any) => sum + tx.amount, 0)

      const revenueGrowth = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0

      // Generate recent activities
      const activities: RecentActivity[] = [
        ...successfulTransactions.slice(0, 3).map((tx: any, index: number) => ({
          id: `tx-${index}`,
          type: "transaction" as const,
          title: "Giao dịch thành công",
          description: `${tx.senderId?.displayName || "Người dùng"} đã thanh toán ${tx.amount.toLocaleString()} VNĐ`,
          time: new Date(tx.createdAt).toLocaleString("vi-VN"),
          status: "success" as const,
        })),
        ...filteredUsers.slice(0, 2).map((user: any, index: number) => ({
          id: `user-${index}`,
          type: "user" as const,
          title: "Người dùng mới",
          description: `${user.displayName} đã đăng ký tài khoản`,
          time: new Date(user.createdAt || Date.now()).toLocaleString("vi-VN"),
          status: user.isActive ? ("success" as const) : ("warning" as const),
        })),
      ].slice(0, 5)

      setStats({
        users: {
          total: filteredUsers.length,
          active: activeUsers.length,
          inactive: filteredUsers.length - activeUsers.length,
          growth: Math.floor(Math.random() * 20) + 5, // Mock growth data
        },
        tenants: {
          total: tenantsData.length,
          active: activeTenants.length,
          growth: Math.floor(Math.random() * 15) + 3, // Mock growth data
        },
        packages: {
          total: packagesData.length,
          active: packagesData.length,
        },
        transactions: {
          total: transactionsData.length,
          totalAmount: totalRevenue,
          successful: successfulTransactions.length,
          pending: pendingTransactions.length,
          failed: failedTransactions.length,
          growth: Math.floor(Math.random() * 25) + 10, // Mock growth data
        },
        revenue: {
          thisMonth: thisMonthRevenue,
          lastMonth: lastMonthRevenue,
          growth: revenueGrowth,
        },
      })

      setRecentActivities(activities)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      setError("Không thể tải dữ liệu dashboard. Vui lòng thử lại.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadDashboardData()
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    trendValue,
    color = "blue",
  }: {
    title: string
    value: string | number
    subtitle?: string
    icon: any
    trend?: "up" | "down"
    trendValue?: number
    color?: "blue" | "green" | "purple" | "orange" | "red"
  }) => {
    const colorClasses = {
      blue: "from-blue-50 to-blue-100 text-blue-600 bg-blue-200",
      green: "from-green-50 to-green-100 text-green-600 bg-green-200",
      purple: "from-purple-50 to-purple-100 text-purple-600 bg-purple-200",
      orange: "from-orange-50 to-orange-100 text-orange-600 bg-orange-200",
      red: "from-red-50 to-red-100 text-red-600 bg-red-200",
    }

    return (
      <Card className={`border-0 shadow-md bg-gradient-to-r ${colorClasses[color].split(" ").slice(0, 2).join(" ")}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className={`text-sm font-medium ${colorClasses[color].split(" ")[2]}`}>{title}</p>
              <div className="space-y-1">
                <p className={`text-3xl font-bold ${colorClasses[color].split(" ")[2].replace("600", "900")}`}>
                  {loading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : typeof value === "number" ? (
                    value.toLocaleString()
                  ) : (
                    value
                  )}
                </p>
                {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
              </div>
              {trend && trendValue !== undefined && (
                <div
                  className={`flex items-center gap-1 text-sm ${trend === "up" ? "text-green-600" : "text-red-600"}`}
                >
                  {trend === "up" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span>{Math.abs(trendValue).toFixed(1)}% so với tháng trước</span>
                </div>
              )}
            </div>
            <div
              className={`w-16 h-16 ${colorClasses[color].split(" ")[3]} rounded-full flex items-center justify-center`}
            >
              <Icon className={`w-8 h-8 ${colorClasses[color].split(" ")[2]}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const ActivityItem = ({ activity }: { activity: RecentActivity }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case "success":
          return "bg-green-100 text-green-800"
        case "warning":
          return "bg-yellow-100 text-yellow-800"
        case "error":
          return "bg-red-100 text-red-800"
        default:
          return "bg-gray-100 text-gray-800"
      }
    }

    const getIcon = (type: string) => {
      switch (type) {
        case "user":
          return <Users className="w-4 h-4" />
        case "transaction":
          return <CreditCard className="w-4 h-4" />
        case "package":
          return <Package className="w-4 h-4" />
        default:
          return <Activity className="w-4 h-4" />
      }
    }

    return (
      <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(activity.status)}`}>
          {getIcon(activity.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">{activity.title}</p>
          <p className="text-sm text-gray-600 truncate">{activity.description}</p>
          <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                    <Skeleton className="h-16 w-16 rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-500 mt-1">Tổng quan hệ thống và hoạt động kinh doanh</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Làm mới
          </Button>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Activity className="w-3 h-3 mr-1" />
            Hệ thống hoạt động
          </Badge>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng người dùng"
          value={stats.users.total}
          subtitle={`${stats.users.active} đang hoạt động`}
          icon={Users}
          trend="up"
          trendValue={stats.users.growth}
          color="blue"
        />

        <StatCard
          title="Tổng khách thuê"
          value={stats.tenants.total}
          subtitle={`${stats.tenants.active} đang hoạt động`}
          icon={Building2}
          trend="up"
          trendValue={stats.tenants.growth}
          color="purple"
        />

        <StatCard
          title="Gói dịch vụ"
          value={stats.packages.total}
          subtitle={`${stats.packages.active} đang bán`}
          icon={Package}
          color="orange"
        />

        <StatCard
          title="Doanh thu tháng"
          value={`${(stats.revenue.thisMonth / 1000000).toFixed(1)}M`}
          subtitle="VNĐ"
          icon={DollarSign}
          trend={stats.revenue.growth >= 0 ? "up" : "down"}
          trendValue={stats.revenue.growth}
          color="green"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Giao dịch
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tổng giao dịch</span>
              <span className="font-semibold">{stats.transactions.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Thành công</span>
              <Badge className="bg-green-100 text-green-700">{stats.transactions.successful}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Đang xử lý</span>
              <Badge className="bg-yellow-100 text-yellow-700">{stats.transactions.pending}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Thất bại</span>
              <Badge className="bg-red-100 text-red-700">{stats.transactions.failed}</Badge>
            </div>
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tổng giá trị</span>
                <span className="font-bold text-green-600">{stats.transactions.totalAmount.toLocaleString()} VNĐ</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-purple-600" />
              Người dùng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Chủ trọ cơ bản</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {stats.users.total > 0 ? Math.floor(stats.users.total * 0.7) : 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Chủ trọ nâng cao</span>
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                {stats.users.total > 0 ? Math.floor(stats.users.total * 0.3) : 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tỷ lệ hoạt động</span>
              <span className="font-semibold text-green-600">
                {stats.users.total > 0 ? Math.round((stats.users.active / stats.users.total) * 100) : 0}%
              </span>
            </div>
            <div className="pt-2 border-t">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${stats.users.total > 0 ? (stats.users.active / stats.users.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-600" />
              Hiệu suất
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tỷ lệ thành công</span>
              <span className="font-semibold text-green-600">
                {stats.transactions.total > 0
                  ? Math.round((stats.transactions.successful / stats.transactions.total) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Người dùng mới/tháng</span>
              <span className="font-semibold">+{stats.users.growth}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tăng trưởng doanh thu</span>
              <span className={`font-semibold ${stats.revenue.growth >= 0 ? "text-green-600" : "text-red-600"}`}>
                {stats.revenue.growth >= 0 ? "+" : ""}
                {stats.revenue.growth.toFixed(1)}%
              </span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Mục tiêu tháng: 85%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      
    </div>
  )
}

export default AdminDashboard
