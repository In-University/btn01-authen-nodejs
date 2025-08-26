import ProfileForm from '../features/auth/profile-form';
import Header from '../components/Header';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-6 md:p-10">
        <ProfileForm />
      </div>
    </div>
  );
}
