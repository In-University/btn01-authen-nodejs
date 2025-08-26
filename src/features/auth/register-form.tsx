import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authAPI } from '@/lib/api';
import { toast } from 'sonner';

const formSchema = z.object({
  email: z.string().email({ message: 'Email không hợp lệ.' }),
  fullName: z.string().min(2, { message: 'Họ tên phải có ít nhất 2 ký tự.' }),
  password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' }),
  confirmPassword: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' }),
  gender: z.enum(['Male', 'Female', 'Other'], { message: 'Vui lòng chọn giới tính.' }),
  dob: z.string().min(1, { message: 'Vui lòng nhập ngày sinh.' }),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
}).refine((data): boolean => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp.",
  path: ['confirmPassword'],
});

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      fullName: '',
      password: '',
      confirmPassword: '',
      gender: undefined,
      dob: '',
      phoneNumber: '',
      address: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...userData } = values;
      
      const response = await authAPI.register(userData);
      
      if (response.status === 201) {
        toast.success('Đăng ký thành công! Vui lòng kiểm tra email để xác thực OTP.');
        navigate(`/verify-otp?email=${encodeURIComponent(values.email)}`);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any).response?.data?.message 
        : 'Đăng ký thất bại!';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[400px] max-h-[90vh] overflow-y-auto">
      <CardHeader>
        <CardTitle>Đăng ký</CardTitle>
        <CardDescription>Tạo tài khoản mới.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nguyễn Văn A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giới tính</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Nam</SelectItem>
                      <SelectItem value="Female">Nữ</SelectItem>
                      <SelectItem value="Other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày sinh</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại (tùy chọn)</FormLabel>
                  <FormControl>
                    <Input placeholder="0123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ (tùy chọn)</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập địa chỉ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xác nhận mật khẩu</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
            </Button>
            
            <div className="mt-4 text-center text-sm">
              Đã có tài khoản?{' '}
              <Button variant="link" onClick={() => navigate('/login')} className="p-0 h-auto">
                Đăng nhập
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
