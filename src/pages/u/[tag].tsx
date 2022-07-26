import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';
import { prisma } from '../../server/db/client';
import Layout from '../../components/layout';
import ProfileDisplay from '../../components/profile/display';
import { Profile, User } from '@prisma/client';

type ProfileProps = {
  profile: Partial<Profile>;
  user: Partial<User>;
};

function Profile({ profile, user }: ProfileProps) {

  return (
    <Layout>
      <main className="container mx-auto xl:w-6/12 lg:w-full flex flex-col items-center justify-center p-4">
        <ProfileDisplay profile={profile} user={user} />
      </main>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { tag } = ctx.query;

  console.log(ctx.query);

  if (!tag || Array.isArray(tag)) {
    return {
      props: {
        profile: {
          tag: null,
        },
        user: {},
      },
    };
  }

  const profile = await prisma.profile.findFirst({
    where: {
      tag,
    },
    include: {
      user: true,
    }
  });

  if (!profile || !profile.user) {
    return {
      props: {
        profile: {
          tag: null,
        },
        user: {},
      },
    };
  }

  const { user, ...rest } = profile;

  return {
    props: {
      profile: rest,
      user: {
        id: user?.id,
        image: user?.image,
      }
    },
  };
}

export default Profile;
