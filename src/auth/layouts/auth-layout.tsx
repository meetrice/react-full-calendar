import { Outlet } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-200 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to access your dashboard
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <Outlet />
          </CardContent>
        </Card>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Demo credentials: <span className="font-medium">demo@kt.com</span> /{' '}
          <span className="font-medium">demo123</span>
        </p>
      </div>
    </div>
  );
}
