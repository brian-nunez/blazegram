import { useSession, getSession } from 'next-auth/react';
import React from 'react';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import { trpc } from '../../utils/trpc';
import Layout from '../../components/layout';

function Profile() {
  const session = useSession();
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
            <h1 className="text-6xl">Setup your account</h1>
            <Link
              href="/profile/settings"
            >
              <a className="text-white bg-purple-500 rounded font-bold text-lg px-4 py-2 my-4">
                🔥 Setup Now 🔥
              </a>
            </Link>
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
