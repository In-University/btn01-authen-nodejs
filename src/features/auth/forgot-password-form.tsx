import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authAPI } from '@/lib/api';
import { toast } from 'sonner';

const emailFormSchema = z.object({
  email: z.string().email({ message: 'Email không hợp lệ.' }),
});

const ForgotPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [userEmail, setUserEmail] = useState('');
  
  // Separate states for reset form to avoid conflicts
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmitEmail = async (values: z.infer<typeof emailFormSchema>) => {
    try {
      setIsLoading(true);
      const response = await authAPI.forgotPassword(values.email);
      
      if (response.status === 200) {
        setUserEmail(values.email);
        // Clear all states when switching to reset step
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setStep('reset');
        toast.success('Mã OTP đã được gửi đến email của bạn!');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as {response?: {data?: {message?: string}}}).response?.data?.message 
        : 'Gửi mã OTP thất bại!';
      toast.error(errorMessage || 'Gửi mã OTP thất bại!');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitReset = async () => {
    // Validation
    if (!otp || otp.length !== 6) {
      toast.error('Vui lòng nhập mã OTP 6 số!');
      return;
    }
    
    if (!newPassword || newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp!');
      return;
    }

    try {
      setIsLoading(true);
      const response = await authAPI.resetPassword({
        email: userEmail,
        otp: otp,
        newPassword: newPassword,
      });
      
      if (response.status === 200) {
        toast.success('Đặt lại mật khẩu thành công! Vui lòng đăng nhập.');
        navigate('/login');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as {response?: {data?: {message?: string}}}).response?.data?.message 
        : 'Đặt lại mật khẩu thất bại!';
      toast.error(errorMessage || 'Đặt lại mật khẩu thất bại!');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'email') {
    return (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Quên mật khẩu</CardTitle>
          <CardDescription>Nhập email để nhận mã OTP đặt lại mật khẩu.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-4">
              <FormField
                control={emailForm.control}
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Đang gửi...' : 'Gửi mã OTP'}
              </Button>
              <div className="mt-4 text-center text-sm">
                Nhớ mật khẩu?{' '}
                <Button variant="link" onClick={() => navigate('/login')} className="p-0 h-auto">
                  Đăng nhập
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Đặt lại mật khẩu</CardTitle>
        <CardDescription>
          Nhập mã OTP và mật khẩu mới cho email: {userEmail}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Mã OTP (6 số)</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Nhập mã OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              disabled={isLoading}
              className="text-center tracking-wider"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Mật khẩu mới</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <Button 
            onClick={onSubmitReset}
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : 'Đặt Lại Mật Khẩu'}
          </Button>

          <div className="mt-4 text-center text-sm space-x-2">
            <Button 
              variant="link" 
              onClick={() => setStep('email')} 
              className="p-0 h-auto"
            >
              Quay lại
            </Button>
            <span>|</span>
            <Button 
              variant="link" 
              onClick={() => navigate('/login')} 
              className="p-0 h-auto"
            >
              Đăng nhập
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordForm;
