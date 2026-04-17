
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch } from "react-redux";
import { RegisterTenantAPIs } from "@/store/slice/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const registerSchema = z.object({
    email: z.string().email({ message: "Email không hợp lệ" }),
    displayName: z.string().min(2, { message: "Tên phải có ít nhất 2 ký tự" }),
    phone: z.string().min(9, { message: "Số điện thoại không hợp lệ" }),
    password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;


export function RegisterForm({ className, ...props }: React.ComponentProps<"div">) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        mode: "onBlur",
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const onSubmit = (data: RegisterFormValues) => {
        dispatch(RegisterTenantAPIs(data)).then(() => {
            toast.success("Tạo tài khoản thành công !");
            navigate('/tenant-rooms')
        })
        reset();
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-primary">Đăng ký tài khoản</CardTitle>
                    <CardDescription className="text-base text-muted-foreground">
                        Đăng ký người thuê trọ để sử dụng dịch vụ của chúng tôi.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    {...register("email")}
                                    className={errors.email ? "border-red-500" : ""}
                                    autoComplete="email"
                                />
                                {errors.email && (
                                    <span className="text-xs text-red-500">{errors.email.message}</span>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="displayName">Tên</Label>
                                <Input
                                    id="displayName"
                                    type="text"
                                    placeholder="Nguyễn Văn A"
                                    {...register("displayName")}
                                    className={errors.displayName ? "border-red-500" : ""}
                                    autoComplete="name"
                                />
                                {errors.displayName && (
                                    <span className="text-xs text-red-500">{errors.displayName.message}</span>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Số điện thoại</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="0123456789"
                                    {...register("phone")}
                                    className={errors.phone ? "border-red-500" : ""}
                                    autoComplete="tel"
                                />
                                {errors.phone && (
                                    <span className="text-xs text-red-500">{errors.phone.message}</span>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Mật khẩu</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Nhập mật khẩu"
                                    {...register("password")}
                                    className={errors.password ? "border-red-500" : ""}
                                    autoComplete="new-password"
                                />
                                {errors.password && (
                                    <span className="text-xs text-red-500">{errors.password.message}</span>
                                )}
                            </div>
                            <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                                {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
                            </Button>
                        </div>
                        <div className="text-center text-sm mt-4">
                            Đã có tài khoản?{' '}
                            <a href="/login" className="underline underline-offset-4 text-primary font-medium">
                                Đăng nhập
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
