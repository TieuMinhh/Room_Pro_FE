import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { LoginTenantAPIs, LoginUserAPIs } from "@/store/slice/userSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { AppDispatch } from "@/store/store";
const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
export function Login({ className, ...props }: React.ComponentProps<"div">) {
  const [activeTab, setActiveTab] = useState<"owner" | "tenant">("owner");
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (activeTab === "tenant") {
        const result: any = await dispatch(LoginTenantAPIs(data));
        if (result.meta.requestStatus === "fulfilled") {
          navigate("/");
        }
      } else {
        const result: any = await dispatch(LoginUserAPIs(data));
        if (result.meta.requestStatus === "fulfilled") {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  return (
    <div className="min-h-svh bg-muted p-6 md:p-10">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full mb-4 md:mb-6">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 px-4 py-2 text-sm md:text-base"
            onClick={() => navigate("/")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 md:h-5 md:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </Button>
        </div>

        <div className="w-full max-w-sm md:max-w-3xl">
          <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden">
              <CardContent className="grid p-0 md:grid-cols-2 relative">
                <form
                  className="p-6 md:p-8"
                  onSubmit={form.handleSubmit((data) => onSubmit(data))}
                >
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-center mb-4 ">
                      <div className="inline-flex rounded-md bg-muted p-1 shadow-inner">
                        <button
                          type="button"
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            activeTab === "owner"
                              ? "bg-white text-primary shadow"
                              : "text-muted-foreground hover:bg-white/50"
                          }`}
                          onClick={() => setActiveTab("owner")}
                        >
                          Chủ trọ
                        </button>
                        <button
                          type="button"
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            activeTab === "tenant"
                              ? "bg-white text-primary shadow"
                              : "text-muted-foreground hover:bg-white/50"
                          }`}
                          onClick={() => setActiveTab("tenant")}
                        >
                          Người thuê
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col items-center text-center ">
                      <h1 className="text-2xl font-bold">Welcome back</h1>
                      <p className="text-balance text-muted-foreground">
                        Login to your Acme Inc account
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        {...form.register("email")}
                        aria-label="Email"
                      />
                      {form.formState.errors.email && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <a
                          href="#"
                          className="ml-auto text-sm underline-offset-2 hover:underline"
                        >
                          Forgot your password?
                        </a>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="********"
                        {...form.register("password")}
                        aria-label="Password"
                      />
                      {form.formState.errors.password && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-700"
                    >
                      Login
                    </Button>
                    {activeTab === "tenant" && (
                      <div className="flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">
                          Don't have an account?{" "}
                          <a
                            href="/register"
                            className="text-primary underline hover:text-primary/80"
                          >
                            Sign up
                          </a>
                        </p>
                      </div>
                    )}
                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                      <span className="relative z-10 bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                    <div className="">
                      <Button variant="outline" className="w-full">
                        {/* Google */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                            fill="currentColor"
                          />
                        </svg>
                        <span className="sr-only">Login with Google</span>
                      </Button>
                    </div>
                  </div>
                </form>
                <div className="relative hidden bg-muted md:block">
                  <img
                    src="/images/sign-in.png"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
