import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface WrapperProps {
  children?: ReactNode
}

export function Wrapper({ children }: WrapperProps) {
  return (
    <div className="flex flex-col lg:flex-row grow pt-(--header-height-mobile) lg:pt-0 mb-2.5 lg:my-2.5">
      <div className="flex grow rounded-xl mt-0">
        <div className={cn(
          'grow lg:overflow-y-auto mx-2 bg-background border border-input rounded-xl shadow-xs p-6',
        )}>
          <main className="min-h-0" role="content">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
