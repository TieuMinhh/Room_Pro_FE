import React, { useState, useRef } from 'react';
import { Camera, MapPin, Calendar, Mail, Phone, Edit3, Settings, Star, Users, Heart, MessageCircle, User, CreditCard, Shield } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, userSlice } from '@/store/slice/userSlice';

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import { PASSWORD_RULE, PASSWORD_RULE_MESSAGE, PASSWORD_CONFIRMATION_MESSAGE } from '@/utils/validators';
import { fetchUpdateTenantProfileAPIs } from '@/apis/tenant.apis';

const ProfileScreen = () => {
    const userData = useSelector(selectCurrentUser);
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<any>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [openChangePassword, setOpenChangePassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [passwordError, setPasswordError] = useState<{ [key: string]: string }>({});
    const [loadingChange, setLoadingChange] = useState(false);
    const [loadingSave, setLoadingSave] = useState(false);

    // Format ngày tháng
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    // Tính tuổi
    const calculateAge = (birthDate: string) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            setEditData({ ...editData, avatar: URL.createObjectURL(file) });
        }
    };

    const handleSave = async () => {
        setLoadingSave(true);
        const formData = new FormData();
        const protectedFields = ['_id', 'id_account', 'email', 'role', 'createdAt', 'updatedAt', 'isActive', '_destroy', 'accessToken', 'refreshToken'];
        
        Object.keys(editData).forEach(key => {
            if (key === 'avatar' && avatarFile) return;
            if (protectedFields.includes(key)) return;
            if (editData[key] !== null && editData[key] !== undefined) {
                formData.append(key, editData[key]);
            }
        });

        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }

        // Client-side age validation
        if (editData.dateOfBirth) {
            const birthDate = new Date(editData.dateOfBirth);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age < 16) {
                toast.error('Bạn phải từ 16 tuổi trở lên mới được tham gia hệ thống!');
                setLoadingSave(false);
                return;
            }
        }

        try {
            const response = await fetchUpdateTenantProfileAPIs(formData);
            dispatch(userSlice.actions.setUser(response.data));
            toast.success('Thông tin hồ sơ của bạn đã được cập nhật.');
            setIsEditing(false);
            setEditData(null);
            setAvatarFile(null);
        } catch (error: any) {
            console.error('Failed to update profile:', error);
            toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật hồ sơ.');
        } finally {
            setLoadingSave(false);
        }
    };

    if (!userData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 flex items-center justify-center">
                <div className="text-xl text-red-600">Không tìm thấy dữ liệu hồ sơ</div>
            </div>
        );
    }

    // Khi bấm chỉnh sửa, copy dữ liệu hiện tại vào editData
    const handleEdit = () => {
        setEditData({ ...userData });
        setIsEditing(true);
    };
    const handleCancel = () => {
        setIsEditing(false);
        setEditData(null);
        setAvatarFile(null);
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    };

    const validatePasswordForm = () => {
        const errors: { [key: string]: string } = {};
        if (!passwordForm.currentPassword) errors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
        if (!passwordForm.newPassword) errors.newPassword = 'Vui lòng nhập mật khẩu mới';
        else if (!PASSWORD_RULE.test(passwordForm.newPassword)) errors.newPassword = PASSWORD_RULE_MESSAGE;
        if (!passwordForm.confirmPassword) errors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
        else if (passwordForm.newPassword !== passwordForm.confirmPassword) errors.confirmPassword = PASSWORD_CONFIRMATION_MESSAGE;
        return errors;
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        const errors = validatePasswordForm();
        setPasswordError(errors);
        if (Object.keys(errors).length > 0) return;
        setLoadingChange(true);
        try {
            const formData = new FormData();
            formData.append('currentPassword', passwordForm.currentPassword);
            formData.append('newPassword', passwordForm.newPassword);
            await fetchUpdateTenantProfileAPIs(formData);
            toast.success('Mật khẩu của bạn đã được cập nhật.');
            setOpenChangePassword(false);
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setPasswordError({});
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu.');
        } finally {
            setLoadingChange(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-400 to-sky-400 pt-8 pb-24">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex justify-between items-start mb-6">
                        <h1 className="text-2xl font-bold text-white">Hồ Sơ Cá Nhân</h1>
                    </div>
                </div>
            </div>

            {/* Profile Card */}
            <div className="max-w-4xl mx-auto px-6 -mt-16">
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                    {/* Avatar and Basic Info */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                        <div className="relative">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleAvatarChange}
                                className="hidden"
                                accept="image/*"
                            />
                            <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg">
                                <img
                                    src={isEditing ? editData?.avatar : userData.avatar}
                                    alt={userData.displayName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button
                                className="absolute bottom-2 right-2 p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors shadow-lg"
                                onClick={() => isEditing && fileInputRef.current?.click()}
                                disabled={!isEditing}
                            >
                                <Camera className="w-4 h-4 text-white" />
                            </button>
                            {userData.isActive && (
                                <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                        </div>

                        <div className="text-center md:text-left flex-1">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="displayName"
                                        value={editData.displayName}
                                        onChange={handleChange}
                                        className="text-3xl font-bold text-gray-800 border-b border-blue-300 outline-none bg-transparent"
                                    />
                                ) : (
                                    <h2 className="text-3xl font-bold text-gray-800">{userData.displayName}</h2>
                                )}
                                <button className="p-1.5 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors" onClick={handleEdit} disabled={isEditing}>
                                    <Edit3 className="w-4 h-4 text-blue-600" />
                                </button>
                            </div>
                            {/* <p className="text-lg text-blue-600 mb-3 font-medium capitalize">{userData.role}</p> */}

                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-blue-500" />
                                    <span>{userData.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-blue-500" />
                                    <span>Tham gia từ {formatDate(userData?.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Information Sections */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        {/* Contact Information */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Thông tin liên hệ</h3>

                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <User className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="font-medium text-gray-800">Tên người dùng</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="userName"
                                            value={editData.userName}
                                            onChange={handleChange}
                                            className="text-gray-600 border-b border-blue-300 outline-none bg-transparent"
                                        />
                                    ) : (
                                        <p className="text-gray-600">{userData.userName}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <Phone className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="font-medium text-gray-800">Điện thoại</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="phone"
                                            value={editData.phone || ''}
                                            onChange={handleChange}
                                            className="text-gray-600 border-b border-blue-300 outline-none bg-transparent"
                                        />
                                    ) : (
                                        <p className="text-gray-600">{userData.phone || "Chưa cập nhật"}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <MapPin className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="font-medium text-gray-800">Địa chỉ</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="address"
                                            value={editData.address || ''}
                                            onChange={handleChange}
                                            className="text-gray-600 border-b border-blue-300 outline-none bg-transparent"
                                        />
                                    ) : (
                                        <p className="text-gray-600">{userData.address || "Chưa cập nhật"}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Thông tin cá nhân</h3>

                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="font-medium text-gray-800">Ngày sinh</p>
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            value={editData.dateOfBirth ? editData.dateOfBirth.substring(0, 10) : ''}
                                            onChange={handleChange}
                                            className="text-gray-600 border-b border-blue-300 outline-none bg-transparent"
                                        />
                                    ) : (
                                        <p className="text-gray-600">{formatDate(userData.dateOfBirth)} ({calculateAge(userData.dateOfBirth)} tuổi)</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <CreditCard className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="font-medium text-gray-800">CCCD</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="CCCD"
                                            value={editData.CCCD || ''}
                                            onChange={handleChange}
                                            className="text-gray-600 border-b border-blue-300 outline-none bg-transparent"
                                        />
                                    ) : (
                                        <p className="text-gray-600">{userData.CCCD}</p>
                                    )}
                                </div>
                            </div>

                            {/* <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <Shield className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="font-medium text-gray-800">Trạng thái tài khoản</p>
                                    <p className={`font-medium ${userData.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                        {userData.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                                    </p>
                                </div>
                            </div> */}
                        </div>
                    </div>

                    {/* Account Details */}
                    {/* <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg border border-blue-100 p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Chi tiết tài khoản</h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-700">ID tài khoản:</span>
                                <span className="ml-2 text-gray-600 font-mono">{userData._id}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Vai trò:</span>
                                <span className="ml-2 text-gray-600 capitalize">{userData.role}</span>
                            </div>
                        </div>
                    </div> */}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-8">
                    {isEditing ? (
                        <>
                            <button
                                className="flex-1 bg-gradient-to-r from-blue-500 to-sky-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-sky-600 transition-all duration-200 shadow-lg"
                                onClick={handleSave}
                                disabled={loadingSave}
                            >
                                {loadingSave ? 'Đang lưu...' : 'Lưu'}
                            </button>
                            <button
                                className="flex-1 bg-white text-blue-600 py-3 px-6 rounded-xl font-semibold border-2 border-blue-200 hover:bg-blue-50 transition-colors"
                                onClick={handleCancel}
                                disabled={loadingSave}
                            >
                                Hủy
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className="flex-1 bg-gradient-to-r from-blue-500 to-sky-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-sky-600 transition-all duration-200 shadow-lg"
                                onClick={handleEdit}
                            >
                                Chỉnh sửa hồ sơ
                            </button>
                            <button className="flex-1 bg-white text-blue-600 py-3 px-6 rounded-xl font-semibold border-2 border-blue-200 hover:bg-blue-50 transition-colors" onClick={() => setOpenChangePassword(true)}>
                                Đổi mật khẩu
                            </button>
                        </>
                    )}
                </div>
            </div>

            <Dialog open={openChangePassword} onOpenChange={setOpenChangePassword}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Đổi mật khẩu</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleChangePassword} className="space-y-4 mt-2">
                        <div>
                            <label className="block font-medium mb-1">Mật khẩu hiện tại</label>
                            <Input type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordInput} autoComplete="current-password" />
                            {passwordError.currentPassword && <p className="text-red-500 text-sm mt-1">{passwordError.currentPassword}</p>}
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Mật khẩu mới</label>
                            <Input type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordInput} autoComplete="new-password" />
                            {passwordError.newPassword && <p className="text-red-500 text-sm mt-1">{passwordError.newPassword}</p>}
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Xác nhận mật khẩu mới</label>
                            <Input type="password" name="confirmPassword" value={passwordForm.confirmPassword} onChange={handlePasswordInput} autoComplete="new-password" />
                            {passwordError.confirmPassword && <p className="text-red-500 text-sm mt-1">{passwordError.confirmPassword}</p>}
                        </div>
                        <DialogFooter>
                            <button type="button" className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg" onClick={() => setOpenChangePassword(false)} disabled={loadingChange}>Hủy</button>
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors" disabled={loadingChange}>{loadingChange ? 'Đang lưu...' : 'Đổi mật khẩu'}</button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProfileScreen;

