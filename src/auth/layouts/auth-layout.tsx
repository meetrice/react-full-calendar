import { Outlet } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

export function AuthLayout() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-200">
      <Card className="w-full max-w-[400px] m-5">
        <CardContent className="p-6">
          <Outlet />
        </CardContent>
      </Card>
      <p className="text-center text-sm text-muted-foreground mb-5">
        Demo credentials: <span className="font-medium">demo@kt.com</span> /{' '}
        <span className="font-medium">demo123</span>
      </p>
    </div>
  );
}
