import { Helmet } from 'react-helmet-async';
import { Wrapper } from './components/wrapper';
import { LayoutProvider } from './components/context';
import { CalendarDataProvider } from '../context/calendar-data-context';
import type { CalendarEvent } from '@/components/ui/calendar/types';
import type { ReactNode } from 'react';

export interface DefaultLayoutProps {
  events?: CalendarEvent[]
  children?: ReactNode
  calendarContent?: ReactNode
}

export function DefaultLayout({ events = [], children, calendarContent }: DefaultLayoutProps) {

  return (
    <>
      <Helmet>
        <title>Calendar</title>
      </Helmet>

      <CalendarDataProvider events={events}>
        <LayoutProvider
          bodyClassName="bg-zinc-950 lg:overflow-hidden"
          style={{
            '--sidebar-width': '260px',
            '--header-height-mobile': '60px',
          } as React.CSSProperties}
        >
          <Wrapper>
            {calendarContent || children}
          </Wrapper>
        </LayoutProvider>
      </CalendarDataProvider>
    </>
  );
}
