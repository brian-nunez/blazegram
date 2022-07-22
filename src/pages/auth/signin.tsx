import React from 'react';
import { getProviders, getSession, signIn } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import type { Provider } from 'next-auth/providers';
import Layout from '../../components/layout';
import GithubIcon from '../../components/icons/github';

type SignInProps = {
  providers: Provider[];
}

const SignIn: React.FC<SignInProps> = ({ providers }) => {
  return (
    <Layout>
      <main className="container mx-auto xl:w-6/12 lg:w-full flex flex-col gap-4 my-8 justify-center items-center">
        <h1 className="text-4xl ">Login to your account</h1>
        <button
          key="github"
          type="button"
          className="rounded font-bold text-xl px-4 py-2 my-4 flex gap-1 text-white font-sans bg-black"
          onClick={() => signIn('github')}
        >
          <GithubIcon />
          <span>Github</span>
        </button>
      </main>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const providers = await getProviders();
  const session = await getSession({ ctx });

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
      props: {
        providers,
      },
    };
  }

  return {
    props: {
      providers,
    },
  };
}


export default SignIn;
