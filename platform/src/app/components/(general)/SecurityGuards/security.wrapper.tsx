import { useEffect, useState } from "react";
import Castle from "@castleio/castle-js";
import { api } from "~/trpc/react";

const useSecurity = () => {
  const [castleToken, setCastleToken] = useState<string | null>(null);

  useEffect(() => {
    const castle = Castle.configure({
      pk: "",
    });

    castle.createRequestToken().then((requestToken: string) => {
      setCastleToken(requestToken);
    });
  }, []);

  useEffect(() => {
    if (castleToken) {
      async function securityRequest(token: string) {
        await api.security.risk.useQuery({ token });
      }

      securityRequest(castleToken);
    }
  }, [castleToken]);
};

const SecurityComponent: React.FC = () => {
  useSecurity();

  return null;
};

export default SecurityComponent;
