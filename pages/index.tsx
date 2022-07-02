import { NextPage } from 'next';
import { ServiceLayout } from '@/components/service_layout';

const IndexPage: NextPage = function () {
  return <ServiceLayout title="test">test</ServiceLayout>;
};

export default IndexPage;
