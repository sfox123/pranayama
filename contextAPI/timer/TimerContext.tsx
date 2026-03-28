import { TimerProps } from "@/types";
import { createContext} from "react";

export const TimerContext = createContext<TimerProps | undefined>(undefined);
