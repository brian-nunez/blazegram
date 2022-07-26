import React, { useEffect, useMemo, useState } from 'react';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import classnames from 'classnames';
import { Profile, User } from '@prisma/client';
import { prisma } from '../../../server/db/client';
import Layout from '../../../components/layout';
import EditSettings from '../../../components/settings/EditSettings';

const settingsMap = {
  edit: {
    title: 'Edit Settings',
    component: EditSettings,
  },
  help: {
    title: 'Help',
    component: () => <div>Help</div>,
  },
};

enum SettingState {
  edit = 'edit',
  help = 'help',
}

function SettingOption({
  children,
  showHighlight = false,
  name,
}: {
  children: React.ReactNode;
  showHighlight: boolean;
  name: String;
}) {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        router.replace(`/profile/settings/${name}`);
      }}
      className={classnames(
        'text-left text-base px-6 py-4 hover:bg-black/5 border-l-[0.19rem]', {
        'border-black font-bold': showHighlight,
        'border-transparent': !showHighlight,
      })}
    >
      {children}
    </button>
  );
}

type SettingsProps = {
  profile: Partial<Profile>;
  user: Partial<User>;
};

function Settings({
  user,
  profile,
}: SettingsProps) {
  const router = useRouter();
  const [setting, setSetting] = useState<SettingState>(SettingState.edit);
  const ComponentContent = useMemo(() => {
    return settingsMap[setting].component;
  }, [setting]);

  useEffect(() => {
    if (!Object.keys(settingsMap).includes(router.query.settings as string)) {
      router.push('/profile/settings/edit');
    }
  }, [setting, router]);

  useEffect(() => {
    setSetting(router.query.settings as SettingState);
  }, [router.query.settings]);

  return (
    <Layout title="Settings">
      <main className="container xl:w-6/12 lg:w-full md:w-full sm:w-full flex justify-center items-center mx-auto my-6">
        <div className="w-full h-full border-[0.125rem] border-stone-300 grid grid-cols-4 rounded">
          <div className="col-span-1 border-r-[0.125rem] border-stone-300 flex flex-col w-full">
            <SettingOption
              name={SettingState.edit}
              showHighlight={setting === SettingState.edit}
            >
              {settingsMap.edit.title}
            </SettingOption>
            <SettingOption
              name={SettingState.help}
              showHighlight={setting === SettingState.help}
            >
              {settingsMap.help.title}
            </SettingOption>
          </div>
          <div className="col-span-3 px-16 py-8">
            <ComponentContent profile={profile} user={user} />
          </div>
        </div>
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

  if (!user || !user.profile) {
    return {
      redirect: {
        destination: '/error',
        permanent: false,
      },
      props: {},
    };
  }

  const { profile, ...rest } = user;

  return {
    props: {
      profile,
      user: rest,
    },
  };
}

export default Settings;
