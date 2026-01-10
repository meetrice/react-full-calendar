import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ScreenLoader } from '@/components/screen-loader';
import { RequireAuth } from '@/auth/require-auth';
import { AuthLayout } from '@/auth/layouts/auth-layout';
import { SignInPage } from '@/auth/pages/signin-page';

const LazyCrmModule = lazy(() => import('@/crm'));
const LazyStoreInventoryModule = lazy(() => import('@/store-inventory'));
const LazyMailModule = lazy(() => import('@/mail'));
const LazyCalendarModule = lazy(() => import('@/calendar'));
const LazyAIModule = lazy(() => import('@/ai'));
const LazyTodoModule = lazy(() => import('@/todo'));

export function ModulesProvider() {
  const location = useLocation();
  const path = location.pathname;

  // Auth routes
  const isAuth = path.startsWith('/auth');

  if (isAuth) {
    return (
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="signin" element={<SignInPage />} />
          <Route path="signup" element={<div>Sign Up Page (Coming Soon)</div>} />
          <Route path="reset-password" element={<div>Reset Password Page (Coming Soon)</div>} />
          <Route index element={<Navigate to="/auth/signin" replace />} />
        </Route>
      </Routes>
    );
  }

  // Protected routes
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route
          path="/crm/*"
          element={
            <Suspense fallback={<ScreenLoader />}>
              <LazyCrmModule />
            </Suspense>
          }
        />
        <Route
          path="/store-inventory/*"
          element={
            <Suspense fallback={<ScreenLoader />}>
              <LazyStoreInventoryModule />
            </Suspense>
          }
        />
        <Route
          path="/mail/*"
          element={
            <Suspense fallback={<ScreenLoader />}>
              <LazyMailModule />
            </Suspense>
          }
        />
        <Route
          path="/calendar/*"
          element={
            <Suspense fallback={<ScreenLoader />}>
              <LazyCalendarModule />
            </Suspense>
          }
        />
        <Route
          path="/ai/*"
          element={
            <Suspense fallback={<ScreenLoader />}>
              <LazyAIModule />
            </Suspense>
          }
        />
        <Route
          path="/todo/*"
          element={
            <Suspense fallback={<ScreenLoader />}>
              <LazyTodoModule />
            </Suspense>
          }
        />
        <Route path="/" element={<Navigate to="/crm" replace />} />
      </Route>
    </Routes>
  );
}
