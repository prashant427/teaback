import { dbConnect } from "@/lib/dbconfig";
import { MessageModel, UserModel } from "@/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import { User } from "next-auth"
import { MessageDocument } from "@/models/user"

export async function POST(req: Request) {
    await dbConnect()

    const { username , content } = await req.json();
    

    try {
        if (!content) {
            return Response.json({
                success: false,
                message: "Message text is required",
            }, { status: 400 });
        }

        const user = await UserModel.findOne({ username }).exec();
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found",
            }, { status: 404 });
        }

        // is user accepting messages
        if (!user.msgAccepted) {
            return Response.json({
                success: false,
                message: "User is not accepting messages",
            }, { status: 403 });
        }

        const NewMessage = new MessageModel({
            
            content,
            timestamp: new Date(),
        });
        user.messages.push(NewMessage as MessageDocument);

        await user.save();

        console.log('New message saved:', NewMessage);
        return Response.json({
            success: true,
            message: "Message sent successfully",
        }, { status: 200 });

    } catch (error) {
        console.error('error on send message ',error)
        return Response.json({
            success: false,
            message: "Error sending message",
        }, { status: 500 })

    }

}