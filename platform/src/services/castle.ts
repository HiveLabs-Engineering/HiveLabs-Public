import { useState, useEffect } from "react";
import Castle from "@castleio/castle-js";
export async function useCastleToken() {
  // const [castletoken, setCastleToken] = useState("");

  const castle = Castle.configure({
    pk: process.env.CASTLEKEY,
    apiUrl: "https://api.castle.io/",
  });

  // castle.createRequestToken().then(token => {
  //     setCastleToken(token);
  // });

  const castletoken = await castle.createRequestToken();

  return castletoken;
}
