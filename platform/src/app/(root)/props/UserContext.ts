import { User } from "@prisma/client";
import { createContext } from "react";

export const LayoutContext = createContext<User | null>(null);
