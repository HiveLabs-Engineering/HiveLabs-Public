import axios from "axios";

export const getGameDetails = async (id: string) => {
  try {
    const gameInfo = await axios.get(
      `https://apis.roblox.com/universes/v1/places/${id}/universe`
    );
    const uniInfo = await axios.get(
      `https://games.roblox.com/v1/games?universeIds=${gameInfo.data.universeId}`
    );
    return uniInfo.data.data[0];
  } catch (error) {
    console.log(error);
    throw new Error(`${error}`);
  }
};
