import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import { dbConnect } from "@/lib/dbconfig";
import { UserModel } from "@/models/user";
import {User} from "next-auth"


export async function POST(req: Request) {
    dbConnect()
    const session = await getServerSession( authOptions);
    const user: User = session?.user

    // Your logic here
    if(!session || !session?.user){
        console.log("user is not loged in ")
        return Response.json({
            success: false,
            message: "not Aunthenticated ",

        },{status : 401})

    }
    const userId = user?.username


    const {msgAccepted} = await req.json()

    console.log("msgAccepted",msgAccepted)

    try {
        // Your logic here
        const updatedUser = await UserModel.findOneAndUpdate({ username: userId } , { msgAccepted: msgAccepted }, { new: true });
        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "Failed to update message status",
            }, { status: 401 });
        }
        return Response.json({
            success: true,
            message: "Message status updated successfully",
            data: updatedUser
        },{
            status: 200
        });

    } catch (error) {
        console.error("Error accept message Status ", error);
        return Response.json({
            success: false,
            message: "Error accept message Status ",
        }, { status: 500 });
    }

}

export async function GET(req: Request) {
    dbConnect()
    const session = await getServerSession(authOptions);
    console.log("session",session)
    const user: User = session?.user

    if (!session || !session?.user) {
        console.log("user is not loged in ")
        return Response.json({
            success: false,
            message: "not Aunthenticated ",

        }, { status: 401 })

    }
    const userId = user?.username

    try {
        const user = await UserModel.findOne({ username: userId });
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found",
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            message: "User retrieved successfully",
            data: user,
            msgAccepted: user.msgAccepted
        }, {
            status: 200
        });

    } catch (error) {
        console.error("Error retrieving user message accept status", error);
        return Response.json({
            success: false,
            message: "Error retrieving user message accept status",
        }, { status: 500 });
    }
}