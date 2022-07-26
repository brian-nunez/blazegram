import React from "react";
import Image from 'next/image';
import { Profile, User } from "@prisma/client";

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

type ProfileDisplayProps = {
  profile: Partial<Profile>;
  user: Partial<User>;
};

function ProfileDisplay({ profile, user }: ProfileDisplayProps) {
  if (!profile?.tag) {
    return (
      <h1 className="text-center text-2xl font-bold">
        Profile not found
      </h1>
    );
  }

  return (
    <React.Fragment>
      <div className="flex xl:flex-row w-full md:flex-col">
        <div className="flex justify-center items-center rounded-full">
          <Image
            src={user?.image || 'https://via.placeholder.com/150'}
            alt="Profile Image"
            width={200}
            height={200}
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col w-full pl-16">
          <h1 className="text-2xl my-2 font-sans font-light">{profile?.tag}</h1>
          <div className="flex justify-start items-center gap-16 my-2">
            {/* <p>
              <span className="font-bold">{numberToString(profile?.posts?.length || 0)}</span> posts
            </p> */}
            <p>
              <span className="font-bold">{numberToString(profile?.followers || 0)}</span> followers
            </p>
            <p>
              <span className="font-bold">{numberToString(profile?.following || 0)}</span> following
            </p>
          </div>
          <p className="font-bold text-lg">{profile?.name}</p>
          <p className="font-sans text-lg">{profile?.description}</p>
        </div>
      </div>
      <hr className="w-full my-10" />
      {/* <div className="w-full grid grid-cols-3 gap-4">
        {profile?.posts?.map((post: any) => (
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
      </div> */}
    </React.Fragment>
  );
}

export default ProfileDisplay;
