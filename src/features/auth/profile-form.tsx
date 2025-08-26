import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner'; 
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProfile, updateProfile, clearError } from '@/store/slices/authSlice';

const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  gender: z.enum(['Male', 'Female', 'Other']), 
  dob: z.date().optional(),
  email: z.string().email({ message: 'Invalid email address.' }),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  image: z.string().optional(),
});

type UserProfile = z.infer<typeof formSchema>;

const ProfileForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector((state) => state.auth);
  
  const form = useForm<UserProfile>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      gender: 'Other', 
      dob: undefined,
      email: '',
      phoneNumber: '',
      address: '',
      image: '',
    },
  });

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      const profileData: UserProfile = {
        fullName: user.fullName || '',
        email: user.email || '',
        gender: (user.gender as 'Male' | 'Female' | 'Other') || 'Other',
        dob: user.dob ? new Date(user.dob) : undefined,
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        image: user.image || '',
      };
      form.reset(profileData);
    }
  }, [user, form]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async (values: UserProfile) => {
    try {
      const result = await dispatch(updateProfile({
        ...values,
        dob: values.dob ? values.dob.toISOString().split('T')[0] : undefined,
      }));
      
      if (updateProfile.fulfilled.match(result)) {
        toast.success('Cập nhật profile thành công!');
      }
    } catch {
      // Error will be handled by Redux state
    }
  };

  if (isLoading && !user) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Đang tải Profile...</CardTitle>
          <CardDescription>Vui lòng đợi trong khi chúng tôi tải thông tin profile của bạn.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Đang tải...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Cài đặt Profile</CardTitle>
        <CardDescription>Quản lý thông tin profile và tùy chọn của bạn.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-6">
          <img
            src={form.watch('image') || 'https://ui-avatars.com/api/?name=User&background=random'}
            alt="Profile Avatar"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
          />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập họ và tên" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập email" {...field} disabled />
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
                <FormItem className="flex flex-col">
                  <FormLabel>Ngày sinh</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy")
                          ) : (
                            <span>Chọn ngày sinh</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập số điện thoại" {...field} />
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
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập địa chỉ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>URL Ảnh đại diện</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập URL ảnh đại diện" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="col-span-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Đang cập nhật...' : 'Cập nhật Profile'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
