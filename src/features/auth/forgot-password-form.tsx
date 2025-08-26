import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { forgotPassword, resetPassword, clearError } from '@/store/slices/authSlice';

const emailFormSchema = z.object({
  email: z.string().email({ message: 'Email không hợp lệ.' }),
});

const resetFormSchema = z.object({
  otp: z.string().min(6, { message: 'OTP phải có 6 ký tự.' }),
  newPassword: z.string().min(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' }),
  confirmPassword: z.string().min(6, { message: 'Xác nhận mật khẩu phải có ít nhất 6 ký tự.' }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp.",
  path: ['confirmPassword'],
});

const ForgotPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [userEmail, setUserEmail] = useState('');

  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const resetForm = useForm<z.infer<typeof resetFormSchema>>({
    resolver: zodResolver(resetFormSchema),
    defaultValues: {
      otp: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange', // Add mode to force re-validation
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmitEmail = async (values: z.infer<typeof emailFormSchema>) => {
    try {
      const result = await dispatch(forgotPassword({ email: values.email }));
      if (forgotPassword.fulfilled.match(result)) {
        setUserEmail(values.email);
        
        // Force completely new form instance
        setTimeout(() => {
          resetForm.reset({
            otp: '',
            newPassword: '',
            confirmPassword: '',
          }, { keepDefaultValues: false });
          
          setStep('reset');
        }, 100);
        
        toast.success('Mã OTP đã được gửi đến email của bạn!');
      }
    } catch {
      // Error handled by Redux state
    }
  };

  const onSubmitReset = async (values: z.infer<typeof resetFormSchema>) => {
    try {
      const result = await dispatch(resetPassword({
        email: userEmail,
        otp: values.otp,
        newPassword: values.newPassword,
      }));
      
      if (resetPassword.fulfilled.match(result)) {
        toast.success('Đặt lại mật khẩu thành công!');
        navigate('/login');
      }
    } catch {
      // Error handled by Redux state
    }
  };

  if (step === 'email') {
    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Quên mật khẩu</CardTitle>
          <CardDescription>Nhập email của bạn để nhận mã OTP.</CardDescription>
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
            </form>
          </Form>
          
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-sm underline-offset-4 hover:underline"
            >
              Quay lại đăng nhập
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Đặt lại mật khẩu</CardTitle>
        <CardDescription>
          Nhập mã OTP đã được gửi đến {userEmail} và mật khẩu mới.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...resetForm} key={`reset-form-${userEmail}`}>
          <form onSubmit={resetForm.handleSubmit(onSubmitReset)} className="space-y-4">
            <FormField
              control={resetForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã OTP</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nhập mã OTP 6 số"
                      {...field}
                      type="text"
                      maxLength={6}
                      className="text-center text-lg tracking-widest"
                      autoComplete="off"
                      inputMode="numeric"
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={resetForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu mới</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={resetForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
            </Button>
          </form>
        </Form>
        
        <div className="mt-4 text-center space-y-2">
          <button
            type="button"
            onClick={() => {
              setStep('email');
              emailForm.reset();
            }}
            className="text-sm underline-offset-4 hover:underline"
          >
            Gửi lại OTP
          </button>
          <br />
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-sm underline-offset-4 hover:underline"
          >
            Quay lại đăng nhập
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordForm;
