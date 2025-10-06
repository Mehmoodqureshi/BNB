'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import HelpCenter from '@/components/support/HelpCenter';

const HelpPage: React.FC = () => {
  const router = useRouter();

  const handleContactSupport = () => {
    router.push('/support');
  };

  return <HelpCenter onContactSupport={handleContactSupport} />;
};

export default HelpPage;
