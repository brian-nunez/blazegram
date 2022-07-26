import React, { useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Profile, User } from '@prisma/client';
import Input from '../formFields/input';
import Textarea from '../formFields/Textarea';
import { trpc } from '../../utils/trpc';
import { useRouter } from 'next/router';

const sweetalert = withReactContent(Swal)

const schema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  tag: z.string().min(1, { message: 'Tag is required' }),
  description: z.string().optional(),
});

type EditSchema = z.infer<typeof schema>;

type EditSettingsProps = {
  onSuccess?: () => void;
  onError?: () => void;
  user: Partial<User>;
  profile: Partial<Profile>;
};

function EditSettings({
  onSuccess,
  onError,
  profile,
  user,
}: EditSettingsProps) {
  const router = useRouter();
  const updateProfile = trpc.useMutation(['profile.update'], {
    onSuccess: () => {
      sweetalert.fire({
        title: 'Profile Updated',
        icon: 'success',
        didClose: () => {
          if (onSuccess) {
            onSuccess();
          }

          router.reload();
        }
      });
    },
    onError: (e) => {
      if (e.message === 'CONFLICT') {
        sweetalert.fire({
          title: 'Profile Already Exists',
          text: 'Please choose a different tag',
          icon: 'error',
        });
        return;
      }
      sweetalert.fire({
        title: 'Something went wrong',
        icon: 'error',
      });

      if (onError) {
        onError();
      }
    }
  });

  const onSubmit = useCallback((values: EditSchema) => {
    updateProfile.mutate({
      ...values,
      profileId: profile?.id,
    });
  }, [profile]);

  const {
    handleSubmit,
    register,
    trigger,
    formState: { errors },
    setValue,
  } = useForm<EditSchema>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    setValue('name', profile?.name || '');
    setValue('tag', profile?.tag || '');
    setValue('description', profile?.description || '');
  }, [profile, setValue]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-start items-center gap-4">
        <Image
          src={user?.image || 'https://via.placeholder.com/150'}
          alt="Picture"
          width={30}
          height={30}
          className="rounded-full cursor-pointer"
        />
        <h1 className="font-sans text-xl">{profile?.tag || 'Tag Needed'}</h1>
      </div>
      <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit(onSubmit)}>
        <p className="text-sm">Required if marked with *</p>
        <div>
          <Input
            {...register('name', {
              maxLength: 20,
            })}
            maxLength={20}
            label={
              <span>
                Name<span className="text-red-500">*</span>
              </span>
            }
          />
          <p className="text-slate-500">This can be different from your real name</p>
          {errors.name && <span className="text-red-500 mt-1">{errors.name.message}</span>}
        </div>
        <div>
          <Input
            {...register('tag')}
            maxLength={40}
            label={
              <span>
                Tag<span className="text-red-500">*</span>
              </span>
            }
          />
          {errors.tag && <span className="text-red-500 mt-1">{errors.tag.message}</span>}
        </div>
        <div>
          <Textarea
            {...register('description')}
            label="Description"
          />
          {errors.description && <span className="text-red-500 mt-1">{errors.description.message}</span>}
        </div>
        <button
          type="submit"
          onClick={() => { trigger('tag'); }}
          className="text-white bg-purple-500 rounded font-bold px-4 py-2 my-4"
        >
          Save
        </button>
      </form>
    </div >
  );
}

export default EditSettings;
