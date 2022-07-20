import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Layout from '../../components/layout';
import { trpc } from '../../utils/trpc';

function numberToString(num: number): string {
  if (typeof num === 'undefined') {
    return '0';
  }
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(0)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K`;
  }

  return num.toString();
}

function ProfileDisplay() {
  const router = useRouter();
  const { tag } = router.query as { tag: string };
  const profile = trpc.useQuery(['profile.getByTag', { tag }]);
  console.log(profile, tag);

  if (profile.isLoading) {
    return null;
  }

  if (profile.isError) {
    return <div>Error</div>;
  }

  return (
    <Layout title={`${profile?.data?.name} (@${profile.data?.tag})`}>
      <main className="container mx-auto xl:w-6/12 lg:w-full flex flex-col items-center justify-center p-4">
        <div className="flex xl:flex-row w-full md:flex-col">
          <div className="flex justify-center items-center rounded-full">
            <Image
              src={profile.data?.image || 'https://via.placeholder.com/150'}
              alt="Profile Image"
              width={200}
              height={200}
              className="rounded-full"
            />
          </div>
          <div className="flex flex-col w-full pl-16">
            <h1 className="text-2xl my-2 font-sans font-light">{profile?.data?.tag}</h1>
            <div className="flex justify-start items-center gap-16 my-2">
              <p>
                <span className="font-bold">{numberToString(profile.data?.posts?.length || 0)}</span> posts
              </p>
              <p>
                <span className="font-bold">{numberToString(profile.data?.followers || 0)}</span> followers
              </p>
              <p>
                <span className="font-bold">{numberToString(profile.data?.following || 0)}</span> following
              </p>
            </div>
            <p className="font-bold text-lg">{profile.data?.name}</p>
            <p className="font-sans text-lg">{profile?.data?.bio}</p>
          </div>
        </div>
        <hr className="w-full my-10" />
        <div className="w-full grid grid-cols-3 gap-4">
          {profile?.data?.posts.map((post) => (
            <div className="w-full h-full select-none relative" key={post.id}>
              <div
                className="absolute w-full h-full z-10 bg-red opacity-0 hover:opacity-100 hover:cursor-pointer"
              >
                <div className="flex justify-center items-center w-full h-full bg-slate-700/50">
                  <h1 className="text-2xl font-sans font-bold text-white">{post.id}</h1>
                </div>
              </div>
              <Image
                src={post.url}
                width={400}
                height={400}
                alt="Post Image"
                className="w-full h-full"
              />
            </div>
          ))}
        </div>
      </main>
    </Layout>
  );
}

export default ProfileDisplay;
