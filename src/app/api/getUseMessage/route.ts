import { dbConnect } from "@/lib/dbconfig";
import { UserModel } from "@/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import { User } from "next-auth"
import mongoose, { Mongoose } from "mongoose";

export async function GET(req: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions);
    const user: User = session?.user

    if (!session || !session?.user) {
        console.log("user is not loged in ")
        return Response.json({
            success: false,
            message: "not Aunthenticated ",

        }, { status: 401 })

    }
    // const userId = new mongoose.Types.ObjectId(user?._id)
    const username = user?.username

    try {
        const user = await UserModel.aggregate([
            {$match: {username: username}},
            {$unwind: "$messages"},
            {$sort: {"messages.timestamp": -1}},
            {$group: {
                _id: "$_id",
                messages: {$push: "$messages"}
            }}
        ])
        console.log("user messages",user)
        if (!user|| user.length === 0) {
            console.log("User messages  not found");
                return Response.json({
                    success: false,
                    message: "User messages not found",
                }, { status: 404 });
        }

        return Response.json({
            success: true,
            data: user,
            messages: user[0].messages
        }, { status: 200 });

    } catch (error) {
        console.error("Error retrieving user message accept status", error);
        return Response.json({
            success: false,
            message: "Error retrieving user message accept status",
        }, { status: 500 });
    }
}