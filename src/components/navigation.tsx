import React, { useState, useMemo } from 'react';
import { HomeIcon, PlusCircleIcon, UserCircleIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

function Navigation() {
  const { data, status } = useSession();
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const actions = useMemo(() => {
    if (status === 'loading') return null;
    if (status === 'authenticated') {
      return (
        <React.Fragment>
          <Link href="/">
            <HomeIcon className="text-black h-7 w-7 cursor-pointer hover:bg-slate-100 rounded scale-150 p-1" />
          </Link>
          <Link href="/">
            <PlusCircleIcon className="text-black h-7 w-7 cursor-pointer rounded-md hover:bg-slate-100 scale-150 p-1" />
          </Link>
          <Image
            src={data?.user?.image || 'https://via.placeholder.com/150'}
            alt="Picture"
            width={30}
            height={30}
            className="rounded-full cursor-pointer"
          />
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <button
          className="bg-sky-500 text-white font-bold text-base py-1 px-3 rounded"
          onClick={() => { signIn('github'); }}
        >Log In</button>
        <button
          className="text-sky-500 bg-white font-bold text-base py-1 px-3"
          onClick={() => { signIn('github'); }}
        >Sign Up</button>
      </React.Fragment>
    );
  }, [status, data?.user?.image]);

  return (
    <div className="flex flex-col w-full border-b-2 bg-white">
      <div className="container w-7/12 flex xl:flex-row lg:flex-col mx-auto md:gap-4 items-center justify-between py-2 px-8 bg-white">
        <h1
          className="flex items-center py-4 gap-2 text-2xl font-extrabold uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500"
        >
          <Link href="/">
            Blazegram
          </Link>
        </h1>
        <div className="flex gap-2">
          {status !== 'loading' && (
            <form onSubmit={(e) => {
              e.preventDefault();
              router.push(`/u/${searchValue}`);
            }}>
              <input
                name="search"
                type="search"
                placeholder="🔍 Search"
                value={searchValue}
                onChange={onChange}
                className="w-full rounded pl-4 pr-8 py-2 text-lg font-semibold text-slate-400 bg-slate-100 focus:outline-none"
              />
            </form>
          )}
        </div>
        <div className="flex gap-5">
          {actions}
        </div>
      </div>
    </div>
  );
}

export default Navigation;
