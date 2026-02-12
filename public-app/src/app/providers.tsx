import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from 'react-error-boundary';
import { ServerErrorPage } from '../pages/errors/ServerErrorPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary FallbackComponent={ServerErrorPage}>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          {children}
        </HelmetProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
