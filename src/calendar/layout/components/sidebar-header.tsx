import { PanelLeft } from 'lucide-react';
import { useLayout } from './context';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { toAbsoluteUrl } from '@/lib/helpers';

export function SidebarHeader() {
  const { sidebarToggle } = useLayout();

  return (
    <div className="flex items-center py-5 gap-2">
      <div className="flex items-center w-full">
        {/* Sidebar header */}
        <div className="flex w-full grow items-center justify-between px-5 gap-2.5">
          <Link to="/calendar/page" className="flex items-center gap-2">
            <div
              className="
                flex items-center justify-center
                w-9 h-9 min-w-[36px]
                rounded-lg
                bg-gradient-to-br from-emerald-500 to-emerald-600
                shadow-lg shadow-emerald-500/20
              "
            >
              <img src={toAbsoluteUrl('/media/app/logo-ricecal-mini.svg')} alt="RiceCal" className="w-5 h-5" />
            </div>
            <span className="text-white text-lg font-semibold hidden lg:block tracking-tight">
              RiceCal
            </span>
          </Link>

          {/* Sidebar toggle */}
          <Button
            mode="icon"
            variant="ghost"
            onClick={sidebarToggle}
            className="hidden lg:inline-flex text-muted-foreground hover:text-foreground"
          >
            <PanelLeft className="size-5 opacity-100" />
          </Button>
        </div>

      </div>
    </div>
  );
}
