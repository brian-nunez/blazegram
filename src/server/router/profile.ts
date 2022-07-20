import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const profileRouter = createRouter()
  .query("getByTag", {
    input: z
      .object({
        tag: z.string(),
      }),
    resolve({ input }) {
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
  });
