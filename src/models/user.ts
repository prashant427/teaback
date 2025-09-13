import mongoose,{Schema,Document} from "mongoose";

export interface UserDocument extends Document{  
  username:string;
  email:string;
  password:string;
  verifyCode:string;
  verifyCodeExpiry:Date;
  isVerified:boolean;
  msgAccepted:boolean;
  messages: MessageDocument[]
}

export interface MessageDocument extends Document{
  
  content:string;
  timestamp:Date;
}
const messagesSchema: Schema<MessageDocument> = new Schema({
  content:{type:String,required:true},
  timestamp:{type:Date,default:Date.now}
});

const userSchema: Schema<UserDocument> = new Schema({
  username:{type:String,required:[true,"Username is required"]},
  email:{type:String,required:[true,"Email is required"],unique:true,match:[/^\S+@\S+\.\S+$/, "Email is invalid vary chalak bro!"]},
  password:{type:String,required:[true,"Password is required"]},
  verifyCode:{type:String,default:"0000"},
  verifyCodeExpiry:{type:Date,},
  isVerified:{type:Boolean,default:false},

  msgAccepted:{type:Boolean,default:false},
  messages:[messagesSchema]
});

export const UserModel = mongoose.models.User as mongoose.Model<UserDocument> || mongoose.model<UserDocument>("User",userSchema);
export const MessageModel = mongoose.models.Message as mongoose.Model<MessageDocument> || mongoose.model<MessageDocument>("Message",messagesSchema);
