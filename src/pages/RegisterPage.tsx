import RegisterForm from '../features/auth/register-form';

export default function RegisterPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <RegisterForm />
    </div>
  );
}
