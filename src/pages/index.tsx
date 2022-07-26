import type { GetServerSideProps, NextPage } from "next";
import Link from 'next/link';
import { getSession, signOut, useSession } from 'next-auth/react';
import { prisma } from "../server/db/client";
import Layout from "../components/layout";

const Home: NextPage = () => {
  const { status } = useSession();

  return (
    <Layout>
      <main className="flex flex-col mx-96 md:mx-72 items-center justify-center p-4">
        <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
          Create <span className="text-purple-300">T3</span> App
        </h1>
        <Link
          href="/u/demo_account"
        >
          <a
            className="text-white bg-purple-500 rounded font-bold px-4 py-2 my-4"
          >
            View Account
          </a>
        </Link>
        {status === 'authenticated' && <button className="text-white bg-purple-500 rounded font-bold px-4 py-2" onClick={() => { signOut(); }}>Logout</button>}
      </main>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession({ ctx });

  if (!session) {
    return {
      props: {},
    };
  }

  console.log(session);

  const user = await prisma.user.findFirst({
    where: {
      id: session.user?.id,
    },
    include: {
      profile: true,
    },
  });

  if (!user?.profile?.tag) {
    return {
      props: {},
      redirect: {
        destination: '/profile',
        permanent: true,
      }
    };
  }

  return {
    props: {},
  }
};

export default Home;
