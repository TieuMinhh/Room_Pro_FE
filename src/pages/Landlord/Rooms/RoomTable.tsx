import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Trash, UploadCloud, HousePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { deleteRoom } from "@/apis/roomApi";
import { addRoomToBlog, checkRoomStatus, removeRoomFromBlog } from "@/apis/blog.apis";
import dayjs from "dayjs";

interface ServiceFee {
  name: string;
  price: number;
  unit: string;
}

interface Room {
  _id: string;
  roomId: string;
  image: string[] | string;
  price: number;
  area: number;
  utilities: string;
  serviceFee: ServiceFee[];
  status: boolean;
  post: boolean;
  type: string;
}

interface RoomTableProps {
  rooms: Room[];
  departmentName: string;
  onRoomDeleted?: (deletedRoomId: string) => void;
}

const RoomTable: React.FC<RoomTableProps> = ({ rooms, departmentName, onRoomDeleted }) => {
  const navigate = useNavigate();
  const [localRooms, setLocalRooms] = useState<Room[]>(rooms);

  useEffect(() => {
    setLocalRooms(rooms);
  }, [rooms]);

  const confirmDelete = async (roomId: string) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc chắc không?',
      text: "Bạn không thể quay lại sau khi thực hiện hành động này!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xoá!',
      cancelButtonText: 'Huỷ',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: async () => {
        try {
          await deleteRoom(roomId);
          return true;
        } catch (error) {
          Swal.showValidationMessage('Xoá phòng thất bại!');
          return false;
        }
      }
    });

    if (result.isConfirmed) {
      Swal.fire('Đã xoá!', 'Phòng đã bị xoá thành công.', 'success');

      if (onRoomDeleted) {
        onRoomDeleted(roomId);
      } else {
        setLocalRooms((prev) => prev.filter((room) => room._id !== roomId));
      }
    }
  };

  const showBlogFormDialog = async (defaultDate: Date) => {
    const minDate = dayjs(defaultDate).format("YYYY-MM-DD");

    const { value: formValues } = await Swal.fire({
      title: '<span style="font-size: 20px; font-weight: 600;"> Thêm phòng vào blog</span>',
      html: `
  <div style="padding: 0 16px; box-sizing: border-box;">
    <div style="display: flex; flex-direction: column; gap: 10px; text-align: left;">
      <div style="display: flex; flex-direction: column;">
        <label for="title" style="font-size: 13px; font-weight: 500; margin-bottom: 2px;">Tiêu đề <span style="color: red;">*</span></label>
        <input id="title" class="swal2-input" placeholder="Nhập tiêu đề blog" value="Phòng đẹp giá rẻ"
          style="padding: 4px 8px; height: 32px; font-size: 14px; width: 100%; box-sizing: border-box;" />
      </div>
      <div style="display: flex; flex-direction: column;">
        <label for="description" style="font-size: 13px; font-weight: 500; margin-bottom: 2px;">Mô tả</label>
        <textarea id="description" class="swal2-textarea" placeholder="Nhập mô tả " rows="3"
          style="padding: 4px 8px; font-size: 14px; width: 100%; box-sizing: border-box;">Phòng có nội thất đầy đủ, gần trung tâm</textarea>
      </div>
      <div style="display: flex; flex-direction: column;">
        <label for="availableFrom" style="font-size: 13px; font-weight: 500; margin-bottom: 2px;">Ngày bắt đầu</label>
        <input id="availableFrom" type="date" class="swal2-input" value="${minDate}" min="${minDate}"
          style="padding: 4px 8px; height: 32px; font-size: 14px; width: 100%; box-sizing: border-box;" />
      </div>
      <div style="display: flex; flex-direction: column;">
        <label for="deposit" style="font-size: 13px; font-weight: 500; margin-bottom: 2px;">Tiền cọc (VNĐ)</label>
        <input id="deposit" type="number" class="swal2-input" placeholder="Nhập số tiền cọc" value="0"
          style="padding: 4px 8px; height: 32px; font-size: 14px; width: 100%; box-sizing: border-box;" />
      </div>
    </div>
  </div>
`
      ,
      confirmButtonText: 'Thêm',
      showCancelButton: true,
      cancelButtonText: 'Hủy',
      focusConfirm: false,

      preConfirm: () => {
        const title = (document.getElementById("title") as HTMLInputElement).value.trim();
        const description = (document.getElementById("description") as HTMLTextAreaElement).value.trim();
        const availableFrom = (document.getElementById("availableFrom") as HTMLInputElement).value;
        const deposit = (document.getElementById("deposit") as HTMLInputElement).value;

        if (!title) {
          Swal.showValidationMessage("⚠️ Tiêu đề là bắt buộc");
          return false;
        }

        if (dayjs(availableFrom).isBefore(minDate)) {
          Swal.showValidationMessage(`⚠️ Ngày bắt đầu không được trước ${dayjs(minDate).format("DD/MM/YYYY")}`);
          return false;
        }

        return { title, description, availableFrom, deposit: Number(deposit) };
      }
    });

    return formValues;
  };


  const updateRoomPostStatus = (roomId: string) => {
    setLocalRooms((prev) =>
      prev.map((room) =>
        room._id === roomId ? { ...room, post: true } : room
      )
    );
  };

  const handleAddToBlog = async (roomId: string) => {
    try {
      const res = await checkRoomStatus(roomId);
      const data = res.data;

      if (data.existed) {
        Swal.fire("Thông báo", "Phòng đã có trong blog!", "info");
        return;
      }

      let form = null;

      if (data.warning) {
        const result = await Swal.fire({
          title: "Phòng đang có người thuê",
          html: `Phòng đang được thuê đến <strong>${dayjs(data.endAt).format("DD/MM/YYYY")}</strong>.<br>Bạn vẫn muốn đăng vào blog không?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Vẫn đăng",
          cancelButtonText: "Huỷ"
        });

        if (!result.isConfirmed) return;

        form = await showBlogFormDialog(new Date(data.endAt));
      } else {
        form = await showBlogFormDialog(new Date());
      }

      if (!form) return;

      Swal.fire({
        title: "Đang thêm phòng vào blog...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      const confirmRes = await addRoomToBlog(roomId, {
        force: true,
        ...form
      });

      if (confirmRes.status === 201) {
        updateRoomPostStatus(roomId);
        Swal.fire("Thành công", "Phòng đã được thêm vào blog.", "success");
      }

    } catch (err: any) {
      Swal.fire("Lỗi", err?.response?.data?.message || "Có lỗi xảy ra", "error");
    }
  };

  const handleRemoveFromBlog = async (roomId: string) => {
    const confirm = await Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc muốn gỡ phòng khỏi blog?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Gỡ",
      cancelButtonText: "Huỷ"
    });

    if (!confirm.isConfirmed) return;

    try {
      Swal.fire({
        title: "Đang xử lý...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      await removeRoomFromBlog(roomId);

      setLocalRooms((prev) =>
        prev.map((room) =>
          room._id === roomId ? { ...room, post: false } : room
        )
      );

      Swal.fire("Thành công", "Phòng đã được gỡ khỏi blog.", "success");
    } catch (err: any) {
      Swal.fire("Lỗi", err?.response?.data?.message || "Có lỗi xảy ra", "error");
    }
  };

  return (
    <div className="mt-8 w-full">
      <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow mb-4 border border-green-200">
        <h3 className="text-2xl font-extrabold text-green-700 tracking-tight flex items-center gap-2">
          <span className="inline-block bg-green-100 text-green-600 rounded-full px-3 py-1 text-xs font-semibold mr-2">Phòng</span>
          Danh sách phòng thuộc toà nhà: <span className="text-blue-700 ml-1">{departmentName}</span>
        </h3>
        <Button
          onClick={() => navigate('/rooms/create')}
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-6 py-2 rounded-lg shadow-md text-base font-semibold transition-all duration-200"
        >
          <PlusCircle className="w-5 h-5" />
          <span> Tạo phòng</span>
        </Button>
      </div>
      {localRooms.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-100">
          <table className="min-w-full text-sm">
            <thead className="bg-gradient-to-r from-blue-100 to-green-100">
              <tr>
                <th className="py-3 px-4 font-bold text-gray-700 border-b border-gray-200 text-center">Ảnh</th>
                <th className="py-3 px-4 font-bold text-gray-700 border-b border-gray-200 text-center">Mã phòng</th>
                <th className="py-3 px-4 font-bold text-gray-700 border-b border-gray-200 text-center">Giá (VNĐ)</th>
                <th className="py-3 px-4 font-bold text-gray-700 border-b border-gray-200 text-center">Diện tích</th>
                <th className="py-3 px-4 font-bold text-gray-700 border-b border-gray-200 text-center">Tiện ích</th>
                <th className="py-3 px-4 font-bold text-gray-700 border-b border-gray-200 text-center">Phí dịch vụ</th>
                <th className="py-3 px-4 font-bold text-gray-700 border-b border-gray-200 text-center">Cho thuê</th>
                <th className="py-3 px-4 font-bold text-gray-700 border-b border-gray-200 text-center">Loại</th>
                <th className="py-3 px-4 font-bold text-gray-700 border-b border-gray-200 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {localRooms.map((room) => (
                <tr key={room._id} className="hover:bg-blue-50 transition-all duration-150">
                  <td className="py-2 px-4 border-b border-gray-100 text-center">
                    {Array.isArray(room.image) && room.image.length > 0 ? (
                      <img src={room.image[0]} alt="room" className="w-16 h-16 object-cover rounded-xl mx-auto shadow" />
                    ) : typeof room.image === "string" && room.image ? (
                      <img src={room.image} alt="room" className="w-16 h-16 object-cover rounded-xl mx-auto shadow" />
                    ) : (
                      <span className="text-gray-400 italic">Không có ảnh</span>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-100 text-center font-semibold text-blue-700">{room.roomId}</td>
                  <td className="py-2 px-4 border-b border-gray-100 text-center text-green-700 font-bold">{room.price.toLocaleString()}₫</td>
                  <td className="py-2 px-4 border-b border-gray-100 text-center">{room.area}m2</td>
                  <td className="py-2 px-4 border-b border-gray-100 text-center">
                    <div className="bg-green-50 p-2 rounded-xl min-w-[80px] mx-auto">
                      {room.utilities?.split(",").map((item, idx) => (
                        <div key={idx} className="text-green-700 text-xs font-medium">{item.trim()}</div>
                      ))}
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-100 text-center">
                    <div className="bg-blue-50 p-2 rounded-xl min-w-[80px] mx-auto">
                      <ul className="list-inside space-y-1 text-xs">
                        {room.serviceFee?.map((fee, idx) => (
                          <li key={idx} className="text-blue-700 font-medium">
                            <strong>{fee.name}</strong>: {fee.price.toLocaleString()}đ/{fee.unit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-100 text-center">
                    {room.status ? (
                      <span className="text-green-600 font-semibold bg-green-100 px-2 py-1 rounded-full">Đang cho thuê</span>
                    ) : (
                      <span className="text-red-500 font-semibold bg-red-100 px-2 py-1 rounded-full">Trống</span>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-100 text-center">{room.type}</td>
                  <td className="py-2 px-4 border-b border-gray-100 text-center">
                    <div className="flex flex-wrap justify-center gap-2">
                      <Button variant="outline" size="sm" className="border-blue-200 hover:bg-blue-100" onClick={() => navigate(`/rooms/edit/${room._id}`)}>
                        <Pencil className="w-4 h-4 text-blue-600" />
                      </Button>
                      <Button variant="destructive" size="sm" className="hover:bg-red-600" onClick={() => confirmDelete(room._id)}>
                        <Trash className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={room.post ? 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100' : 'border-blue-200 hover:bg-blue-100'}
                        onClick={() =>
                          room.post ? handleRemoveFromBlog(room._id) : handleAddToBlog(room._id)
                        }
                      >
                        <UploadCloud className="w-4 h-4 mr-1" />
                        {room.post ? "Gỡ blog" : "Blog"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <HousePlus className="w-16 h-16 mb-4 text-gray-300" />
          <p className="text-lg font-semibold">Không có phòng nào cho toà nhà này.</p>
          <p className="text-sm">Vui lòng thêm phòng để quản lý thông tin.</p>
        </div>
      )}
    </div>
  );
};

export default RoomTable;
