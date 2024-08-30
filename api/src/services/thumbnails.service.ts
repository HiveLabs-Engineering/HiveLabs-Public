import axios from "axios";

export const getGameThumbnail = async (id: string) => {
  try {
    const thumbnail = await axios.get(
      `https://thumbnails.roblox.com/v1/games/icons?universeIds=${id}&returnPolicy=PlaceHolder&size=512x512&format=Png&isCircular=false`
    );
    return thumbnail.data.data[0].imageUrl;
  } catch (error) {
    console.log(error);
    throw new Error(`${error}`);
  }
};

export const getGroupThumbnail = async (id: string) => {
  try {
    const thumbnail = await axios.get(
      `https://thumbnails.roblox.com/v1/groups/icons?groupIds=${id}&size=420x420&format=Png&isCircular=false`
    );
    return thumbnail.data.data[0].imageUrl;
  } catch (error) {
    console.log(error);
    throw new Error(`${error}`);
  }
};
