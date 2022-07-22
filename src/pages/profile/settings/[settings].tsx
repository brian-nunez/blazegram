import React, { useEffect, useMemo, useState } from 'react';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';
import classnames from 'classnames';
import Link from 'next/link';
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
  return (
    <Link
      href={`/profile/settings/${name}`}
    >
      <a
        className={classnames(
          'text-left text-base px-6 py-4 hover:bg-black/5 border-l-[0.19rem]', {
          'border-black font-bold': showHighlight,
          'border-transparent': !showHighlight,
        })}
      >
        {children}
      </a>
    </Link>
  );
}

function Settings() {
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
            <ComponentContent />
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

  return {
    props: {},
  };
}

export default Settings;
