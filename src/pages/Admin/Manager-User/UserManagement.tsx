"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, UserCheck, Building2, TrendingUp } from "lucide-react"
import { fetchAllUserAPIs } from "@/apis"
import { fetchTenantAPIs } from "@/apis/tenant.apis"
import UserTable from "./UserTable"
import TenantTable from "./TenantTable"

interface User {
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

interface Tenant {
  _id: string
  displayName: string
  phone: string
  dateOfBirth: string
  email: string
  address: string
  _destroy?: boolean
}

interface Stats {
  totalUsers: number
  activeUsers: number
  totalTenants: number
  activeTenants: number
}

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("users")
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    totalTenants: 0,
    activeTenants: 0,
  })
  const [loading, setLoading] = useState(true)

  const loadStats = async () => {
    try {
      setLoading(true)

      // Fetch users data
      const usersRes = await fetchAllUserAPIs()
      const usersData = usersRes.data ?? usersRes
      const filteredUsers = usersData.filter((user: User) => user.role !== "admin")

      // Fetch tenants data
      const tenantsRes = await fetchTenantAPIs()
      const tenantsData = tenantsRes.data ?? tenantsRes

      // Calculate statistics
      const totalUsers = filteredUsers.length
      const activeUsers = filteredUsers.filter((user: User) => user.isActive && !user._destroy).length
      const totalTenants = tenantsData.length
      const activeTenants = tenantsData.filter((tenant: Tenant) => !tenant._destroy).length

      setStats({
        totalUsers,
        activeUsers,
        totalTenants,
        activeTenants,
      })
    } catch (error) {
      console.error("Error loading statistics:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    bgColor,
  }: {
    title: string
    value: number
    icon: any
    color: string
    bgColor: string
  }) => (
    <Card className={`border-0 shadow-md ${bgColor}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${color}`}>{title}</p>
            <p className={`text-2xl font-bold ${color.replace("600", "900")}`}>
              {loading ? <Skeleton className="h-8 w-16" /> : value.toLocaleString()}
            </p>
          </div>
          <div className={`w-12 h-12 ${color.replace("600", "200")} rounded-full flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const calculateActivityRate = () => {
    if (stats.totalUsers === 0) return 0
    return Math.round((stats.activeUsers / stats.totalUsers) * 100)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
        <p className="text-gray-500">Quản lý chủ trọ và khách thuê trong hệ thống</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tổng chủ trọ"
          value={stats.totalUsers}
          icon={Users}
          color="text-blue-600"
          bgColor="bg-gradient-to-r from-blue-50 to-blue-100"
        />

        

        <StatCard
          title="Tổng khách thuê"
          value={stats.totalTenants}
          icon={Building2}
          color="text-purple-600"
          bgColor="bg-gradient-to-r from-purple-50 to-purple-100"
        />

        
      </div>

      {/* Main Content */}
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <span className="text-xl font-semibold">Danh sách người dùng</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {activeTab === "users" ? `${stats.totalUsers} chủ trọ` : `${stats.totalTenants} khách thuê`}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Chủ trọ
                <Badge variant="secondary" className="ml-1 text-xs">
                  {loading ? <Skeleton className="h-3 w-6" /> : stats.totalUsers}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="tenants" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Khách thuê
                <Badge variant="secondary" className="ml-1 text-xs">
                  {loading ? <Skeleton className="h-3 w-6" /> : stats.totalTenants}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4">
              <UserTable onDataChange={loadStats} />
            </TabsContent>

            <TabsContent value="tenants" className="space-y-4">
              <TenantTable onDataChange={loadStats} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserManagement
