import { Groups } from "@prisma/client";
import { createContext } from "react";

export const GroupContext = createContext<Groups | null>(null);
