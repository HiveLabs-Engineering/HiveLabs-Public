import { jwtVerify, SignJWT } from "jose";
import { api } from "~/trpc/react";

interface UserJwtPayload {
  jti: string;
  iat: number;
}

export const getJwtSecretKey = () => {
  const secret = process.env.JWT_TOKEN;

  if (!secret || secret.length === 0) {
    throw new Error("The JWT_TOKEN is not set for HiveLabs yet.");
  }

  return secret;
};

export const verifyAuth = async (token: string) => {
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(getJwtSecretKey()),
    );

    return verified.payload;
  } catch (error) {
    console.log(error);
    throw new Error("Your token has expired.");
  }
};

export const validateEmail = async (code: string) => {
  try {
    console.log("VAIDSATE");

    const response = api.auth.validate.useMutation();
    response.mutate(
      { code: `${code}` },
      {
        onSuccess: (data) => {
          return data;
        },
      },
    );
  } catch (error) {
    console.log(error);
    throw new Error("Your token has expired.");
  }
};

export const getUser = async (token: string) => {
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(getJwtSecretKey()),
    );

    return verified.payload;
  } catch (error) {
    console.log(error);
    throw new Error("Your token has expired.");
  }
};
