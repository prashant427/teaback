import { MessageDocument } from "@/models/user";

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  isAcceptingMsg?: boolean;
  messages?: Array<MessageDocument>;
}
