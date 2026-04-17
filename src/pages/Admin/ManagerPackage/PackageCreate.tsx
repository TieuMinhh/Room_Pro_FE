"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  PlusCircle,
  MinusCircle,
  Package,
  ArrowLeft,
  Save,
  FileText,
  DollarSign,
  Clock,
  AlertCircle,
  Info,
} from "lucide-react"
import Swal from "sweetalert2"
import { createPackageAPIs, getPackagesAPIs, updatePackageAPIs } from "@/apis/package.apis"

interface FormData {
  name: string
  price: string
  availableTime: string
}

const PackageManager = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [form, setForm] = useState<FormData>({
    name: "",
    price: "",
    availableTime: "",
  })
  const [descriptions, setDescriptions] = useState<string[]>([""])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(isEdit)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await getPackagesAPIs()
        const found = res.data.find((pkg: any) => pkg._id === id)
        if (found) {
          setForm({
            name: found.name,
            price: found.price.toString(),
            availableTime: found.availableTime.toString(),
          })
          setDescriptions(found.description.length ? found.description : [""])
        }
      } catch (error) {
        console.error("Error loading package:", error)
        Swal.fire("Lỗi", "Không thể tải thông tin gói dịch vụ.", "error")
      } finally {
        setInitialLoading(false)
      }
    }

    if (isEdit) fetchPackage()
  }, [id, isEdit])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!form.name.trim()) {
      newErrors.name = "Tên gói không được để trống"
    }

    if (!form.price || Number(form.price) <= 0) {
      newErrors.price = "Giá phải lớn hơn 0"
    }

    if (!form.availableTime || Number(form.availableTime) <= 0) {
      newErrors.availableTime = "Thời hạn phải lớn hơn 0"
    }

    const validDescriptions = descriptions.filter((desc) => desc.trim())
    if (validDescriptions.length === 0) {
      newErrors.descriptions = "Phải có ít nhất một mô tả"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleDescChange = (index: number, value: string) => {
    const newDescs = [...descriptions]
    newDescs[index] = value
    setDescriptions(newDescs)

    // Clear error when user starts typing
    if (errors.descriptions) {
      setErrors({ ...errors, descriptions: "" })
    }
  }

  const addDescription = () => {
    if (descriptions.length < 5) {
      setDescriptions([...descriptions, ""])
    }
  }

  const removeDescription = (index: number) => {
    if (descriptions.length > 1) {
      const newDescs = descriptions.filter((_, i) => i !== index)
      setDescriptions(newDescs)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    const data = {
      name: form.name.trim(),
      description: descriptions.filter((desc) => desc.trim()),
      price: Number(form.price),
      availableTime: Number(form.availableTime),
    }

    try {
      if (isEdit) {
        await updatePackageAPIs(id as string, data)
        Swal.fire({
          title: "Thành công!",
          text: "Đã cập nhật gói dịch vụ.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
      } else {
        await createPackageAPIs(data)
        Swal.fire({
          title: "Thành công!",
          text: "Đã tạo gói dịch vụ mới.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
      }
      navigate("/package")
    } catch (error) {
      console.error("Lỗi khi tạo/cập nhật:", error)
      Swal.fire("Lỗi", "Không thể tạo/cập nhật gói dịch vụ.", "error")
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="p-6">
        <Card className="w-full max-w-2xl mx-auto shadow-lg border-0">
          <CardHeader>
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate("/package")} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? "Cập nhật gói dịch vụ" : "Tạo gói dịch vụ mới"}
            </h1>
            <p className="text-gray-500">
              {isEdit ? "Chỉnh sửa thông tin gói dịch vụ" : "Điền thông tin để tạo gói dịch vụ mới"}
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              Thông tin gói dịch vụ
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Package Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Tên gói dịch vụ
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nhập tên gói dịch vụ..."
                  className={`${errors.name ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              <Separator />

              {/* Descriptions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Mô tả gói dịch vụ
                  </Label>
                  <div className="text-xs text-gray-500">{descriptions.filter((d) => d.trim()).length}/5 mô tả</div>
                </div>

                <div className="space-y-3">
                  {descriptions.map((desc, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-1 space-y-1">
                        <Textarea
                          value={desc}
                          onChange={(e) => handleDescChange(index, e.target.value)}
                          placeholder={`Mô tả ${index + 1}...`}
                          className="min-h-[80px] resize-none focus:border-blue-500"
                          rows={2}
                        />
                      </div>
                      {descriptions.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeDescription(index)}
                          className="mt-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <MinusCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {descriptions.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addDescription}
                    className="w-full border-dashed border-2 hover:border-blue-300 hover:bg-blue-50 bg-transparent"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Thêm mô tả
                  </Button>
                )}

                {errors.descriptions && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.descriptions}</AlertDescription>
                  </Alert>
                )}
              </div>

              <Separator />

              {/* Price and Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Giá gói (VNĐ)
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    step="1000"
                    className={`${errors.price ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.price}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availableTime" className="text-sm font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Thời hạn (tháng)
                  </Label>
                  <Input
                    id="availableTime"
                    name="availableTime"
                    type="number"
                    value={form.availableTime}
                    onChange={handleChange}
                    placeholder="0"
                    min="1"
                    className={`${errors.availableTime ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
                  />
                  {errors.availableTime && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.availableTime}
                    </p>
                  )}
                </div>
              </div>

              {/* Info Alert */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Gói dịch vụ sau khi tạo sẽ có thể được khách hàng mua và sử dụng ngay lập tức.
                </AlertDescription>
              </Alert>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/package")}
                  className="flex-1 sm:flex-none"
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {isEdit ? "Đang cập nhật..." : "Đang tạo..."}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {isEdit ? "Cập nhật gói" : "Tạo gói mới"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PackageManager
