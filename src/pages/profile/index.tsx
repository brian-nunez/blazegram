import { useSession, getSession } from 'next-auth/react';
import React from 'react';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import { trpc } from '../../utils/trpc';
import Layout from '../../components/layout';
import EditSettings from '../../components/settings/EditSettings';

function Profile() {
  const profile = trpc.useQuery(['profile.getSelfInfo']);

  if (profile.isLoading) {
    return <div>Loading...</div>;
  }

  if (profile.isError) {
    return <div>Error: {profile.error.message}</div>;
  }

  return (
    <Layout>
      <main className="container mx-auto xl:w-6/12 lg:w-full">
        {(!profile?.data?.tag) && (
          <div className="flex flex-col gap-4 my-8 justify-center items-center">
            <h1 className="text-3xl">Please setup your account</h1>
            <p className="text-sm w-64 text-center text-gray-500">You can always update these later in the settings.</p>
            <div className="border p-4 rounded">
              <EditSettings />
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession({ ctx });

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
      props: {},
    };
  }

  return {
    props: {},
  };
}

export default Profile;
