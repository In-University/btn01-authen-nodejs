import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { authAPI } from "@/lib/api";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Vui lòng nhập đầy đủ email và mật khẩu!");
      return;
    }

    try {
      setIsLoading(true);
      const response = await authAPI.login({ email, password });
      
      if (response.status === 200) {
        // Save token and user info to localStorage
        localStorage.setItem("jwtToken", response.data.data.token);
        
        // Optionally save user info if returned by API
        if (response.data.data.user) {
          localStorage.setItem("userInfo", JSON.stringify(response.data.data.user));
        }
        
        toast.success("Đăng nhập thành công!");
        navigate("/profile");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any).response?.data?.message 
        : 'Đăng nhập thất bại!';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Chào mừng trở lại</CardTitle>
          <CardDescription>
            Đăng nhập với tài khoản EchoEnglish của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <button
                      type="button"
                      onClick={() => navigate("/forgot-password")}
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="******"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
              </div>
              <div className="text-center text-sm">
                Chưa có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="underline underline-offset-4"
                >
                  Đăng ký
                </button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-center text-xs text-balance">
        Bằng cách tiếp tục, bạn đồng ý với{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Điều khoản dịch vụ
        </a>{" "}
        và{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Chính sách bảo mật
        </a>.
      </div>
    </div>
  );
}
