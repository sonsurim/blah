import Head from 'next/head';
import { ReactNode } from 'react';
import { GNB } from '@/components/GNB';

interface Props {
  title: string;
  children: ReactNode;
}

export const ServiceLayout = function ({ title = 'blah', children }: Props) {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <GNB />
      {children}
    </div>
  );
};
