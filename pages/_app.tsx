/* eslint-disable react/jsx-props-no-spreading */
import '../styles/globals.css';
import type { AppProps /*, AppContext */ } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useRef } from 'react';
import { AuthUserProvider } from '@/contexts/auth_user.context';

const MyApp = function ({ Component, pageProps }: AppProps) {
  const queryClientRef = useRef<QueryClient>();

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <ChakraProvider>
        <AuthUserProvider>
          <Component {...pageProps} />;
        </AuthUserProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
};

export default MyApp;
