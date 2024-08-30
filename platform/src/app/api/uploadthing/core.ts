import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { api } from "~/trpc/react";
import jwt from "jsonwebtoken";

const f = createUploadthing();

// Updated auth function to validate JWT
const auth = (req: Request) => {
  const token = req.headers.get("hive_colony");
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, `${process.env.JWT_TOKEN}`);
    return { user: decoded };
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await auth(req);

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { data: user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
