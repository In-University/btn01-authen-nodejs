import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { authAPI } from '@/lib/api';
import { toast } from 'sonner';

interface OtpVerificationFormProps {
  email: string;
}

const OtpVerificationForm: React.FC<OtpVerificationFormProps> = ({ email }) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Vui lòng nhập mã OTP 6 số!');
      return;
    }

    try {
      setIsLoading(true);
      const response = await authAPI.verifyRegisterOtp({ email, otp });
      
      if (response.status === 200) {
        toast.success('Xác thực thành công! Vui lòng đăng nhập.');
        navigate('/login');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any).response?.data?.message 
        : 'Mã OTP không hợp lệ hoặc đã hết hạn!';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
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
          <label className="text-sm font-medium">Mã OTP</label>
          <Input
            type="text"
            placeholder="Nhập mã OTP 6 số"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            className="mt-1"
          />
        </div>
        
        <Button onClick={handleVerifyOtp} className="w-full" disabled={isLoading}>
          {isLoading ? 'Đang xác thực...' : 'Xác thực OTP'}
        </Button>
        
        <div className="text-center text-sm">
          <Button variant="link" onClick={() => navigate('/login')} className="p-0 h-auto">
            Quay lại đăng nhập
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OtpVerificationForm;
