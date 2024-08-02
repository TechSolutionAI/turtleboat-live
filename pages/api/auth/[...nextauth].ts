import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import LinkedinProvider from "next-auth/providers/linkedin";
import clientPromise from "@/utils/mongodb";
import { v2 as cloudinary } from "cloudinary";

const SERVER_ERR_MSG = "Something went wrong in a server.";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  api_key: process.env.CLOUDINARY_API_KEY ?? "",
  api_secret: process.env.CLOUDINARY_API_SECRET ?? "",
});

export const authOptions: any = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      httpOptions: {
        timeout: 10000, // Set timeout to 10 seconds
      },
    }),
    LinkedinProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID ?? "",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET ?? "",
      wellKnown:
        "https://www.linkedin.com/oauth/.well-known/openid-configuration",
      authorization: { params: { scope: "openid profile email" } },
      idToken: true,
      issuer: "https://www.linkedin.com",
      jwks_endpoint: "https://www.linkedin.com/oauth/openid/jwks",
      profile(profile, tokens) {
        const user: User = {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          tokens: 0,
          totalEarnedTokens: 0,
          createdAt: new Date().toString(),
          lastLogin: new Date().toString(),
          followers: [],
        };
        return Promise.resolve(user);
      },
    }),
  ],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.query.inviteId) {
    const cookieValue: string = req.query.inviteId.toString();
    const inviteCookie = cookie.serialize("hasValidInvite", cookieValue, {
      path: "/",
      httpOnly: true,
    });
    res.setHeader("Set-Cookie", inviteCookie);
  }

  const authOptions: any = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        httpOptions: {
          timeout: 10000, // Set timeout to 10 seconds
        },
      }),
      LinkedinProvider({
        clientId: process.env.LINKEDIN_CLIENT_ID ?? "",
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET ?? "",
        wellKnown:
          "https://www.linkedin.com/oauth/.well-known/openid-configuration",
        authorization: { params: { scope: "openid profile email" } },
        idToken: true,
        issuer: "https://www.linkedin.com",
        jwks_endpoint: "https://www.linkedin.com/oauth/openid/jwks",
        profile(profile, tokens) {
          const user: User = {
            id: profile.sub,
            name: profile.name,
            email: profile.email,
            image: profile.picture,
            tokens: 0,
            totalEarnedTokens: 0,
            createdAt: new Date().toString(),
            lastLogin: new Date().toString(),
            followers: [],
          };
          return Promise.resolve(user);
        },
      }),
    ],
    pages: {
      error: "/",
    },
    callbacks: {
      async session({ session }: any) {
        if (session) {
          try {
            const client = await clientPromise;
            const db = client.db(process.env.MONGODB_NAME);
            const result = await db
              .collection("users")
              .find({ email: session.user.email })
              .toArray();
            if (!result.length) {
              return Promise.reject(
                new Error("Couldn't find your account on DB!")
              );
            }
            session.user.role = result[0].role;
            session.user.id = result[0].id;
            session.user._id = result[0]._id;
            session.user.image = result[0].image;
            session.user.isNewUser = result[0].isNewUser;
            session.user.basicProfile = result[0].basicProfile;
            session.user.ventures = result[0].ventures;
            session.user.advancedProfile = result[0].advancedProfile;
            session.user.tokens = result[0].tokens;
            session.user.totalEarnedTokens = result[0].totalEarnedTokens;
            session.user.createdAt = result[0].createdAt;
            session.user.lastLogin = result[0].lastLogin;
            session.user.followers = result[0].followers;
          } catch (err: any) {
            return Promise.reject(err);
          }
          return Promise.resolve(session);
        }
        return Promise.reject(new Error("Your session has expired!"));
      },
      async signIn({ user }: any) {
        try {
          const client = await clientPromise;
          const db = client.db(process.env.MONGODB_NAME);

          const verifiedUsers = await db
            .collection("users")
            .find({ email: user.email })
            .toArray();

          let userImg = user.image;
          if (user.image) {
            const avatarUploadResult = await cloudinary.uploader.upload(
              user.image,
              {
                public_id: `ycity_files/${user.id}`,
                overwrite: true,
                timestamp: new Date().getTime(),
                resource_type: "auto",
                folder: "avatars",
                invalidate: true,
              }
            );
            userImg = avatarUploadResult.secure_url;
          }
          var username = user.name;
          if (verifiedUsers.length > 0) {
            username = verifiedUsers[0].isNewUser
              ? user.name
              : verifiedUsers[0]?.basicProfile?.firstName +
                " " +
                verifiedUsers[0]?.basicProfile?.lastName;
          }
          await db.collection("users").updateOne(
            {
              email: user.email,
            },
            {
              $set: {
                name: username,
                image: userImg,
                lastLogin: new Date(),
              },
            }
          );
          await db.collection("collaborations").updateMany(
            {
              "comments.user.email": user.email,
            },
            {
              $set: {
                "comments.$.user.name": username,
                "comments.$.user.image": userImg,
              },
            }
          );
          await db.collection("collaborations").updateMany(
            {
              "mentees.email": user.email,
            },
            {
              $set: {
                "mentees.$.name": username,
                "mentees.$.image": userImg,
              },
            }
          );
          await db.collection("collaborations").updateMany(
            {
              "mentors.email": user.email,
            },
            {
              $set: {
                "mentors.$.name": username,
                "mentors.$.image": userImg,
              },
            }
          );
          await db.collection("ninetyvideos").updateMany(
            {
              "author.email": user.email,
            },
            {
              $set: {
                "author.name": username,
                "author.image": userImg,
              },
            }
          );
          await db.collection("ninetyvideos").updateMany(
            {
              "comments.user.email": user.email,
            },
            {
              $set: {
                "comments.$.user.name": username,
                "comments.$.user.image": userImg,
              },
            }
          );
          await db.collection("nanotalkvideos").updateMany(
            {
              "author.email": user.email,
            },
            {
              $set: {
                "author.name": username,
                "author.image": userImg,
              },
            }
          );
          await db.collection("nanotalkvideos").updateMany(
            {
              "comments.user.email": user.email,
            },
            {
              $set: {
                "comments.$.user.name": username,
                "comments.$.user.image": userImg,
              },
            }
          );
          await db.collection("ventures").updateMany(
            {
              "mentee.email": user.email,
            },
            {
              $set: {
                "mentee.name": username,
                "mentee.image": userImg,
              },
            }
          );
          await db.collection("ventures").updateMany(
            {
              "mentors.email": user.email,
            },
            {
              $set: {
                "mentors.$.name": username,
                "mentors.$.image": userImg,
              },
            }
          );
          await db.collection("ventures").updateMany(
            {
              "course.modules.comments.user.email": user.email,
              "course.modules.comments": { $exists: true },
            },
            {
              $set: {
                "course.modules.$[module].comments.$[comment].user.name":
                  username,
                "course.modules.$[module].comments.$[comment].user.image":
                  userImg,
              },
            },
            {
              arrayFilters: [
                { "module.comments.user.email": user.email },
                { "comment.user.email": user.email },
              ],
            }
          );
          await db.collection("ventures").updateMany(
            {
              "era.request.members.email": user.email,
              "era.request.members": { $exists: true },
            },
            {
              $set: {
                "era.request.members.$[member].name": username,
                "era.request.members.$[member].image": userImg,
              },
            },
            {
              arrayFilters: [{ "member.email": user.email }],
            }
          );
          await db.collection("ventures").updateMany(
            {
              "era.response.user.email": user.email,
              "era.response": { $exists: true },
            },
            {
              $set: {
                "era.response.$[item].user.name": username,
                "era.response.$[item].user.image": userImg,
              },
            },
            {
              arrayFilters: [{ "item.user.email": user.email }],
            }
          );
          if (verifiedUsers.length > 0) {
            return Promise.resolve(true);
          } else {
            const inviteId = req.cookies.hasValidInvite;

            const removeCookie = cookie.serialize("hasValidInvite", "", {
              path: "/",
              httpOnly: true,
            });
            res.setHeader("Set-Cookie", removeCookie);

            if (!inviteId) {
              return Promise.reject(
                new Error("You have no account on Turtle Boat.")
              );
            } else {
              const verifiedInvites = await db
                .collection("invites")
                .find({ inviteId: inviteId, isExpired: false })
                .toArray();
              if (!verifiedInvites.length) {
                return Promise.reject(
                  new Error("Your invite url is invalid or expired!")
                );
              } else {
                let inviteData = await db
                  .collection("invites")
                  .findOne({ inviteId: inviteId });
                let result = await db
                  .collection("invites")
                  .updateOne(
                    { inviteId: inviteId },
                    { $set: { isExpired: true } }
                  );
                if (!result.matchedCount) {
                  return Promise.reject(new Error(SERVER_ERR_MSG));
                } else {
                  // Create venture if admin invited for specific course
                  let ventures: any[] = [];
                  // if (inviteData.courseId != '') {
                  //   const courseObjectId = new ObjectId(inviteData.courseId?.toString());
                  //   let courseData = await db
                  //     .collection("courses")
                  //     .findOne({ _id: courseObjectId });
                  //   if (courseData != null) {
                  //     const venture = await db
                  //       .collection("ventures")
                  //       .insertOne({
                  //         title: courseData.title,
                  //         description: courseData.description,
                  //         mentee: {
                  //           email: user.email,
                  //           name: user.name,
                  //           image: user.image
                  //         },
                  //         mentors: [],
                  //         course: courseData,
                  //         updatedAt: new Date(),
                  //         isArchive: false
                  //       });
                  //     if (!venture.acknowledged) {
                  //       return Promise.reject(new Error(SERVER_ERR_MSG));
                  //     } else {
                  //       // Increase course venture counts after creating venture
                  //       await db
                  //         .collection("courses")
                  //         .updateOne({ _id: courseObjectId }, { $set: { ventures: courseData.ventures + 1 } });
                  //       /////////////////////////////////
                  //       ventures.push({
                  //         ventureId: venture.insertedId,
                  //         role: "mentee",
                  //         status: "awaiting"
                  //       })
                  //     }
                  //   }
                  // }
                  ////////////////////////////////////////////////

                  // result = await db
                  //   .collection("users")
                  //   .insertOne({ ...user, role: "member", isNewUser: true, ventures: ventures });
                  result = await db.collection("users").insertOne({
                    ...user,
                    role: "member",
                    isNewUser: true,
                    ventures: ventures,
                    tokens: 0,
                    totalEarnedTokens: 0,
                    createdAt: new Date(),
                    lastLogin: new Date(),
                    followers: [],
                  });
                  if (!result.acknowledged) {
                    return Promise.reject(new Error(SERVER_ERR_MSG));
                  } else {
                    return { redirect: "/dashboard/profile" };
                  }
                }
              }
            }
          }
        } catch (err) {
          return Promise.reject(new Error(SERVER_ERR_MSG));
        }
      },
    },
  };
  return await NextAuth(req, res, authOptions);
}
