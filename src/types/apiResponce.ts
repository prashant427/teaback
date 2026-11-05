import { MessageDocument } from "@/models/user";

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: unknown;
  isAcceptingMsg?: boolean;
  messages?: Array<MessageDocument>;
}
