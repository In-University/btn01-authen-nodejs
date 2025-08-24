import ProfileForm from '../features/auth/profile-form';

export default function ProfilePage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <ProfileForm />
    </div>
  );
}
