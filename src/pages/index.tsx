import type { NextPage } from "next";
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
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
          onClick={() => { signOut(); }}
        >
          <a
            className="text-white bg-sky-500 rounded font-bold px-4 py-2 my-4"
          >
            View Account
          </a>
        </Link>
        {status === 'authenticated' && <button className="text-white bg-sky-500 rounded font-bold px-4 py-2" onClick={() => { signOut(); }}>Logout</button>}
      </main>
    </Layout>
  );
};

export default Home;
