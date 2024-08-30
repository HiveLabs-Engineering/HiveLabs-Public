import { useState, useEffect } from "react";
import Castle from "@castleio/castle-js";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function activeStaff(id: string) {
  return prisma.activity.findMany({
    where: {
      workspace: `${id}`,
      ended: false,
    },
  });
}
