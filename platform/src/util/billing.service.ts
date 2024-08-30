import Stripe from "stripe";
const stripe = new Stripe("");

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createStripeCustomer = async (
  name: String,
  email: String,
): Promise<Stripe.Customer> => {
  try {
    return await stripe.customers.create({
      name: `${name}`,
      email: `${email}`,
    });
  } catch (error) {
    throw new Error("Failed to create customer");
  }
};

export const editPresence = async (id: String) => {
  try {
    const subs = stripe.subscriptions.retrieve(`${id}`);

    if ((await subs).status == "active") {
      return await prisma.groups.update({
        where: { stripe_id: `${(await subs).customer}` },
        data: { payment_required: false },
      });
    } else {
      return await prisma.groups.update({
        where: { stripe_id: `${(await subs).customer}` },
        data: { payment_required: true },
      });
    }
  } catch (error) {
    throw new Error(`${error}`);
  }
};
