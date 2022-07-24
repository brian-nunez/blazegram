import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const profileRouter = createRouter()
  .query("getByTag", {
    input: z
      .object({
        tag: z.string(),
      }),
    async resolve({ input, ctx }) {
      const profile = await ctx.prisma.profile.findFirst({
        where: {
          tag: input.tag,
        },
        include: {
          user: true,
        }
      });

      if (!profile) {
        return {
          name: null,
          tag: null,
          description: null,
          image: null,
          followers: null,
          following: null,
          posts: [],
        };
      }
      const { user: { image } } = profile;

      return {
        name: profile.name,
        tag: profile.tag,
        description: profile.description,
        image,
        followers: 0,
        following: 0,
        posts: [],
      };
    },
  })
  .middleware(async ({ ctx, next }) => {
    // Any queries or mutations after this middleware will
    // raise an error unless there is a current session
    if (!ctx.session?.user?.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next();
  })
  .query('getSelfInfo', {
    async resolve({ ctx }) {

      const user = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.session?.user?.id,
        },
        include: {
          profile: true,
        }
      });

      return user?.profile || null;
    }
  })
  .mutation('update', {
    input: z
      .object({
        name: z.string().min(1, { message: 'Name is required' }),
        tag: z.string().min(1, { message: 'Tag is required' }),
        description: z.string().optional(),
        profileId: z.string().optional(),
      }),
    async resolve({ ctx, input }) {
      if (!ctx.session?.user?.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      try {

        const profileExists = await ctx.prisma.profile.findFirst({
          where: {
            tag: input.tag,
            user: {
              id: {
                notIn: [ctx.session?.user?.id],
              }
            },
          },
          include: {
            user: true,
          }
        });

        if (profileExists) {
          throw new TRPCError({ code: 'CONFLICT', message: 'Tag already exists' });
        }

        if (input.profileId) {
          return await ctx.prisma.profile.update({
            where: {
              id: input.profileId,
            },
            data: {
              name: input.name,
              tag: input.tag,
              description: input.description,
            },
          });
        }

        const user = await ctx.prisma.user.update({
          where: {
            id: ctx.session?.user?.id,
          },
          data: {
            profile: {
              create: {
                name: input.name,
                tag: input.tag,
                description: input.description,
              },
            },
          },
          include: {
            profile: true,
          }
        });

        return user.profile;
      } catch (e) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }
  });
