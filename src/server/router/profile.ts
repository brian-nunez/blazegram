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
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
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

      return {
        name: 'Star Yak Ranch',
        tag: input.tag,
        bio: 'Our ranch has over 150 #Yaks in the outskirts of Casper, Wyoming 🏔 Welcome to the STAR herd! 🤠 Yak meat & #Yak jerky NOW available!! 🥩🔽',
        image: 'https://instagram.fphx1-1.fna.fbcdn.net/v/t51.2885-19/277250736_1011358553129505_2258315445097067279_n.jpg?stp=dst-jpg_s320x320&_nc_ht=instagram.fphx1-1.fna.fbcdn.net&_nc_cat=109&_nc_ohc=K_fPCZmSBl8AX9mhGJR&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AT-ZinzncKp5oej2I3jURLfRJCGcUuHSilRmGZKHZpPpcg&oe=62DBF73C&_nc_sid=8fd12b',
        followers: 140000,
        following: 39,
        posts: [
          {
            id: '1',
            url: 'https://instagram.fphx1-1.fna.fbcdn.net/v/t51.2885-15/293172250_459379719337458_468229782892807160_n.jpg?stp=dst-jpg_e35&_nc_ht=instagram.fphx1-1.fna.fbcdn.net&_nc_cat=106&_nc_ohc=dldLneNUJA0AX_0IGTK&edm=ALQROFkBAAAA&ccb=7-5&ig_cache_key=Mjg4MDExMTMwNjI4Mjg5OTA0NA%3D%3D.2-ccb7-5&oh=00_AT9otIL6ql7uDA-QsXbxPEIqStuzydwxbroh3zKb4Sw2lw&oe=62DC3EC7&_nc_sid=30a2ef',
          },
          {
            id: '2',
            url: 'https://instagram.fphx1-2.fna.fbcdn.net/v/t51.2885-15/292344997_419482533429733_3581814567891629399_n.jpg?stp=dst-jpg_e35_s1080x1080&_nc_ht=instagram.fphx1-2.fna.fbcdn.net&_nc_cat=101&_nc_ohc=9zZ31F74r0oAX9k5U_5&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AT_tGoOzsaNpHAf_uR91kZcD87WRadwUS784n1SsXjyLmg&oe=62DB23C4&_nc_sid=8fd12b',
          },
          {
            id: '3',
            url: 'https://instagram.fphx1-1.fna.fbcdn.net/v/t51.2885-15/293172250_459379719337458_468229782892807160_n.jpg?stp=dst-jpg_e35&_nc_ht=instagram.fphx1-1.fna.fbcdn.net&_nc_cat=106&_nc_ohc=dldLneNUJA0AX_0IGTK&edm=ALQROFkBAAAA&ccb=7-5&ig_cache_key=Mjg4MDExMTMwNjI4Mjg5OTA0NA%3D%3D.2-ccb7-5&oh=00_AT9otIL6ql7uDA-QsXbxPEIqStuzydwxbroh3zKb4Sw2lw&oe=62DC3EC7&_nc_sid=30a2ef',
          },
          {
            id: '4',
            url: 'https://instagram.fphx1-2.fna.fbcdn.net/v/t51.2885-15/292344997_419482533429733_3581814567891629399_n.jpg?stp=dst-jpg_e35_s1080x1080&_nc_ht=instagram.fphx1-2.fna.fbcdn.net&_nc_cat=101&_nc_ohc=9zZ31F74r0oAX9k5U_5&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AT_tGoOzsaNpHAf_uR91kZcD87WRadwUS784n1SsXjyLmg&oe=62DB23C4&_nc_sid=8fd12b',
          },
        ],
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
