import { Helmet } from 'react-helmet-async';
import { LayoutProvider } from './layout/components/context';
import { Wrapper } from './layout/components/wrapper';
import { AccountPage } from './pages/account-page';

export function AccountModule() {
  return (
    <>
      <Helmet>
        <title>Account Settings</title>
      </Helmet>

      <LayoutProvider
        bodyClassName="bg-zinc-950 lg:overflow-hidden"
        style={{
          '--sidebar-width': '260px',
          '--header-height-mobile': '60px',
        } as React.CSSProperties}
      >
        <Wrapper>
          <AccountPage />
        </Wrapper>
      </LayoutProvider>
    </>
  );
}

export default function AccountModuleWrapper() {
  return <AccountModule />;
}
