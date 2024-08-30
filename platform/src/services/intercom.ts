import { jwtVerify, SignJWT } from "jose";
import fetch from "node-fetch";
import { api } from "~/trpc/react";

interface UserJwtPayload {
  jti: string;
  iat: number;
}

export const getIntercomCustomer = async (userId: string) => {
  try {
    const resp = await fetch(``, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Intercom-Version": "2.11",
        Authorization: "",
      },
      body: JSON.stringify({
        query: {
          operator: "AND",
          value: [
            {
              field: "external_id",
              operator: "=",
              value: `${userId}`,
            },
          ],
        },
        pagination: { per_page: 5 },
      }),
    });

    const data = await resp.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Your token has expired.");
  }
};

export const connectCustomer = async (userId: string, companyId: string) => {
  try {
    const resp = await fetch(``, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Intercom-Version": "2.11",
        Authorization: "",
      },
      body: JSON.stringify({
        id: `${companyId}`,
      }),
    });

    const data = await resp.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Your token has expired.");
  }
};
