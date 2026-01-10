import { Helmet } from 'react-helmet-async';
import { LayoutProvider } from './layout/components/context';
import { Wrapper } from './layout/components/wrapper';
import { SettingsPage } from './pages/settings-page';

export function SettingsModule() {
  return (
    <>
      <Helmet>
        <title>Settings</title>
      </Helmet>

      <LayoutProvider
        bodyClassName="bg-zinc-950 lg:overflow-hidden"
        style={{
          '--sidebar-width': '260px',
          '--header-height-mobile': '60px',
        } as React.CSSProperties}
      >
        <Wrapper>
          <SettingsPage />
        </Wrapper>
      </LayoutProvider>
    </>
  );
}

export default function SettingsModuleWrapper() {
  return <SettingsModule />;
}
