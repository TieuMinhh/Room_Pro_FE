import {
  Card,
  CardContent
} from "@/components/ui/card";
import {
  Input
} from "@/components/ui/input";
import {
  Label
} from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Button
} from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import {
  getProvinces,
  getDistrictsByProvinceCode,
  getWardsByDistrictCode,
} from "@/apis/provincesApi";
import { createDepartment } from "@/apis/departmentApi";

export default function CreateDepartment() {
  const navigate = useNavigate();
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    electricPrice: "",
    waterPrice: "",
    province: "",
    district: "",
    commune: "",
    village: "",
  });

  useEffect(() => {
    getProvinces().then(res => setProvinces(res.data));
  }, []);

  useEffect(() => {
    const selected = provinces.find(p => p.name === formData.province);
    if (selected) {
      getDistrictsByProvinceCode(selected.code).then(res =>
        setDistricts(res.data.districts || [])
      );
    }
  }, [formData.province]);

  useEffect(() => {
    const selected = districts.find(d => d.name === formData.district);
    if (selected) {
      getWardsByDistrictCode(selected.code).then(res =>
        setWards(res.data.wards || [])
      );
    }
  }, [formData.district]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.electricPrice || !formData.waterPrice) {
      toast.warning("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      await createDepartment(formData);
      toast.success("Tạo tòa nhà thành công!");
      navigate("/rooms");
    } catch (err) {
      toast.error("Tạo tòa nhà thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-3xl mx-auto bg-blue-50 border-blue-300 shadow-md">
      <CardContent>
        <h2 className="text-2xl font-semibold mb-6 text-blue-700">
          Tạo Tòa nhà mới
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Tên Tòa nhà</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
          <div>
            <Label>Giá điện (VND/kWh)</Label>
            <Input
              type="number"
              value={formData.electricPrice}
              onChange={(e) => handleChange("electricPrice", e.target.value)}
            />
          </div>
          <div>
            <Label>Giá nước (VND/m³)</Label>
            <Input
              type="number"
              value={formData.waterPrice}
              onChange={(e) => handleChange("waterPrice", e.target.value)}
            />
          </div>
          <div>
            <Label>Tỉnh / Thành phố</Label>
            <Select
              value={formData.province}
              onValueChange={(value) => handleChange("province", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn tỉnh" />
              </SelectTrigger>
              <SelectContent>
                {provinces.map((p) => (
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
              value={formData.district}
              onValueChange={(value) => handleChange("district", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn quận/huyện" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((d) => (
                  <SelectItem key={d.code} value={d.name}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Phường / Xã</Label>
            <Select
              value={formData.commune}
              onValueChange={(value) => handleChange("commune", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn phường/xã" />
              </SelectTrigger>
              <SelectContent>
                {wards.map((w) => (
                  <SelectItem key={w.code} value={w.name}>
                    {w.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2">
            <Label>Địa chỉ chi tiết</Label>
            <Input
              value={formData.village}
              onChange={(e) => handleChange("village", e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => navigate("/rooms")}
          >
            Quay lại
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={loading}
          >
            {loading ? "Đang tạo..." : "Tạo tòa nhà"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
