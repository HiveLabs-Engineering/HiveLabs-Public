import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

export type robloxGroupInfo = {
  name: string;
  id: number;
};

export const getGroupInfo = async (
  id: string,
): Promise<robloxGroupInfo | null> => {
  try {
    let response = await fetch(
      `https://groups.roblox.com/v2/groups?groupIds=${id}`,
    );

    if (response.status === 200) {
      const data = (await response.json()) as any;
      return data.data[0] as robloxGroupInfo;
    } else {
      throw Error();
    }
  } catch (error) {
    return null;
  }
};
