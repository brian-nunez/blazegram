import React from 'react';
import type { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { Profile, User } from '@prisma/client';
import { useRouter } from 'next/router';
import Layout from '../../components/layout';
import EditSettings from '../../components/settings/EditSettings';
import ProfileDisplay from '../../components/profile/display';
import { prisma } from '../../server/db/client';

type ProfileProps = {
  profile: Partial<Profile>;
  user: Partial<User>;
};

function Profile({ profile, user }: ProfileProps) {
  const router = useRouter();

  return (
    <Layout>
      <main className="container mx-auto xl:w-6/12 lg:w-full flex flex-col items-center justify-center p-4">
        {!profile?.tag ? (
          <div className="flex flex-col gap-4 my-8 justify-center items-center">
            <h1 className="text-3xl">Please setup your account</h1>
            <p className="text-sm w-64 text-center text-gray-500">You can always update these later in the settings.</p>
            <div className="border p-4 rounded">
              <EditSettings profile={profile} user={user} />
            </div>
          </div>
        ) : (
          <ProfileDisplay profile={profile} user={user} />
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

  const user = await prisma.user.findFirst({
    where: {
      id: session.user?.id,
    },
    include: {
      profile: true,
    }
  });

  if (!user) {
    return {
      redirect: {
        destination: '/error',
        permanent: false,
      },
      props: {},
    };
  }

  return {
    props: {
      profile: user?.profile,
      user: {
        id: user?.id,
        image: user?.image,
      }
    },
  };
}

export default Profile;
