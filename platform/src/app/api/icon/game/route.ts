import { NextRequest } from "next/server";
import fetch from "node-fetch";

export const GET = async (req: NextRequest) => {
  try {
    // Logging to check the URL construction
    console.log("Request URL:", req.nextUrl.toString());

    const target = new URL(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?${req.nextUrl.searchParams.toString()}`,
    );
    const response = await fetch(target, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Logging to check response status and body
    console.log("Response Status:", response.status);

    if (response.status === 200) {
      const body = (await response.json()) as { data: any[] };
      const imageUrl = body.data[0].imageUrl;
      const imageResponse = await fetch(imageUrl); // Fetch the image

      if (imageResponse.ok) {
        const imageBuffer = await imageResponse.buffer(); // Convert the image to buffer
        return new Response(imageBuffer, {
          status: 200,
          headers: {
            "Content-Type": "image/png", // You may need to adjust the content type based on the actual image type
          },
        });
      } else {
        throw new Error("Unable to fetch image");
      }
    } else {
      throw new Error("Unable to fetch user avatar headshot...");
    }
  } catch (error) {
    console.log("Error:", error);
    // Return error message
    return new Response(JSON.stringify({ error: error }), {
      status: 500, // Indicate an error
      headers: {
        "Content-Type": "application/json", // Adjust content type as needed
      },
    });
  }
};
