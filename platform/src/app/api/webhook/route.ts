import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";
import { editPresence } from "~/util/billing.service";
const prisma = new PrismaClient();

const Stripe = require("stripe");
const stripe = new Stripe("");
const endpointSecret = "";

export const POST = async (req: NextRequest, res: NextResponse) => {
  const sig = req.headers.get("stripe-signature");
  let event;

  if (!sig) {
    console.error("⚠️  Missing Stripe signature.");
    return new Response("Webhook Error: Missing Stripe signature", {
      status: 400,
    });
  }

  try {
    const reqs = await req.text();
    event = stripe.webhooks.constructEvent(reqs, sig, endpointSecret);
  } catch (err) {
    console.error(`⚠️  Webhook signature verification failed: ${err}`);
    return new Response(`Webhook Error: ${err}`, { status: 400 });
  }

  const { type, data } = event;
  const subscription = data.object;

  try {
    if (
      type == "checkout.session.completed" ||
      type == "customer.subscription.created"
    ) {
      await prisma.groups.update({
        where: { stripe_id: subscription.customer.toString() },
        data: { payment_required: false },
      });
    } else if (subscription.id) {
      editPresence(subscription.id);
    }

    return new Response(`Customer ID: ${subscription.customer.toString()}`, {
      status: 200,
    });
  } catch (err) {
    console.error(`⚠️  Database update failed: ${err}`);
    return new Response(`Database Error: ${err}`, { status: 500 });
  }
};
