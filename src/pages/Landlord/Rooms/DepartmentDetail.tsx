import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2, Pencil, Save, X, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} from "@/apis/departmentApi";

import {
  getProvinces,
  getDistrictsByProvinceCode,
  getWardsByDistrictCode,
} from "@/apis/provincesApi";

export default function DepartmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [department, setDepartment] = useState<any>(null);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [formData, setFormData] = useState<any>({
    name: "",
    electricPrice: "",
    waterPrice: "",
    province: "",
    district: "",
    commune: "",
    village: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getDepartmentById(id || "");
        setDepartment(res.data);
        setFormData({
          name: res.data.name,
          electricPrice: res.data.electricPrice,
          waterPrice: res.data.waterPrice,
          province: res.data.province,
          district: res.data.district,
          commune: res.data.commune,
          village: res.data.village,
        });
      } catch (err) {
        toast.error("Không lấy được thông tin tòa nhà");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    getProvinces().then((res) => {
      setProvinces(res.data);
    });
  }, []);

  useEffect(() => {
    const selectedProvince = provinces.find(
      (p: any) => p.name === formData.province
    );
    if (selectedProvince) {
      getDistrictsByProvinceCode(selectedProvince.code).then((res) => {
        setDistricts(res.data.districts || []);
      });
    }
  }, [formData.province]);

  useEffect(() => {
    const selectedDistrict = districts.find((d: any) => d.name === formData.district);
    if (selectedDistrict) {
      getWardsByDistrictCode(selectedDistrict.code).then((res) => {
        setWards(res.data.wards || []);
      });
    }
  }, [formData.district]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await updateDepartment(id || "", formData);
      toast.success("Cập nhật thành công!");
      setEditMode(false);
    } catch {
      toast.error("Cập nhật thất bại!");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteDepartment(id || "");
      toast.success("Xóa tòa nhà thành công!");
      setDeleteDialogOpen(false);
      navigate("/rooms");
    } catch {
      toast.error("Xóa thất bại!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
      </div>
    );
  }

  return (
    <>
      <Card className="p-6 max-w-3xl mx-auto bg-blue-50 border-blue-300 shadow-md">
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-blue-700">
              Thông tin Tòa nhà
            </h2>
            <div className="space-x-2 flex flex-wrap">
              {editMode ? (
                <>
                  <Button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" /> Lưu
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditMode(false)}
                  >
                    <X className="w-4 h-4 mr-2" /> Hủy
                  </Button>
                  <Button variant="ghost" onClick={() => navigate("/rooms")}>
                    ← Quay lại
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate("/rooms")}>
                    ← Quay lại
                  </Button>
                  <Button
                    onClick={() => setEditMode(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Pencil className="w-4 h-4 mr-2" /> Chỉnh sửa
                  </Button>
                  <Button
                    onClick={() => setDeleteDialogOpen(true)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash className="w-4 h-4 mr-2" /> Xóa
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tên Tòa nhà</Label>
              <Input
                value={formData.name}
                disabled={!editMode}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            <div>
              <Label>Giá điện (VND/kWh)</Label>
              <Input
                type="number"
                value={formData.electricPrice}
                disabled={!editMode}
                onChange={(e) => handleInputChange("electricPrice", e.target.value)}
              />
            </div>
            <div>
              <Label>Giá nước (VND/m³)</Label>
              <Input
                type="number"
                value={formData.waterPrice}
                disabled={!editMode}
                onChange={(e) => handleInputChange("waterPrice", e.target.value)}
              />
            </div>
            <div>
              <Label>Tỉnh / Thành phố</Label>
              <Select
                disabled={!editMode}
                value={formData.province}
                onValueChange={(value) => handleInputChange("province", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tỉnh" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((p: any) => (
                    <SelectItem key={p.code} value={p.name}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Quận / Huyện</Label>
              <Select
                disabled={!editMode}
                value={formData.district}
                onValueChange={(value) => handleInputChange("district", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn quận/huyện" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((d: any) => (
                    <SelectItem key={d.code} value={d.name}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Phường / Xã</Label>
              {editMode ? (
                <Select
                  disabled={!editMode}
                  value={formData.commune}
                  onValueChange={(value) => handleInputChange("commune", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phường/xã" />
                  </SelectTrigger>
                  <SelectContent>
                    {wards.map((w: any) => (
                      <SelectItem key={w.code} value={w.name}>
                        {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="border rounded-md px-3 py-2 bg-gray-100 text-sm text-gray-700">
                  {formData.commune || "Không có thông tin"}
                </div>
              )}
            </div>

            <div className="col-span-2">
              <Label>Địa chỉ chi tiết</Label>
              <Input
                value={formData.village}
                disabled={!editMode}
                onChange={(e) => handleInputChange("village", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog xác nhận xóa */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xoá</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xoá tòa nhà <strong>{formData.name}</strong> không? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleConfirmDelete}>
              Xác nhận xoá
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
