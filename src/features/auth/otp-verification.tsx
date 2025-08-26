import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { verifyOtp, clearError } from '@/store/slices/authSlice';

interface OtpVerificationFormProps {
  email: string;
}

const OtpVerificationForm: React.FC<OtpVerificationFormProps> = ({ email }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [otp, setOtp] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Vui lòng nhập mã OTP 6 số!');
      return;
    }

    try {
      const result = await dispatch(verifyOtp({ email, otp }));
      if (verifyOtp.fulfilled.match(result)) {
        toast.success('Xác thực thành công! Vui lòng đăng nhập.');
        navigate('/login');
      }
    } catch {
      // Error handled by Redux state
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Xác thực OTP</CardTitle>
        <CardDescription>
          Mã OTP đã được gửi đến email: {email}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="otp" className="block text-sm font-medium mb-2">
            Mã OTP
          </label>
          <Input
            id="otp"
            type="text"
            placeholder="Nhập mã OTP 6 số"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            className="text-center"
          />
        </div>
        
        <Button 
          onClick={handleVerifyOtp} 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Đang xác thực...' : 'Xác thực OTP'}
        </Button>
        
        <div className="text-center text-sm space-y-2">
          <p className="text-gray-600">Không nhận được mã?</p>
          <button
            type="button"
            onClick={() => toast.info('Tính năng gửi lại OTP sẽ được thêm sau.')}
            className="text-blue-600 hover:underline"
          >
            Gửi lại OTP
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OtpVerificationForm;
