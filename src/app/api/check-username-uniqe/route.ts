import { dbConnect } from "@/lib/dbconfig";
import { UserModel } from "@/models/user"; 
import { NextRequest } from "next/server";
import {z} from "zod"
import { usernameSchema } from "@/Schemas/signupSchema";

const usernameQuerySchema = z.object({
   username: usernameSchema
});

export async function GET(request: NextRequest) {
    if(request.method !== "GET"){
        return Response.json({
            success: false,
            message: "Method not allowed get sa aao"
        }, { status: 405 });
    }

   await dbConnect();

   try {
        const { searchParams } = new URL(request.url);
        const queryParam =  {
            username:{
                username: searchParams.get("username")
            }
        }
        console.log(queryParam)

        //validate user
        const validationResult = usernameQuerySchema.safeParse(queryParam);
        console.log("validationResult", validationResult);
        if (!validationResult.success) {
            return Response.json({
                success: false,
                message: "Invalid username",
                errors: validationResult.error.format().username?._errors || []
            }, { status: 400 });
        }

        const {username} = validationResult.data.username;
        const existingUser = await UserModel.findOne({ username , isVerified: true}).exec();
        if (existingUser) {
            return Response.json({
                success: false,
                message: "Username already exists"
            }, { status: 409 });
        }

        return Response.json({
            success: true,
            message: "Username is available"
        }, { status: 200 });

   } catch (error) {
      console.error("Error checking username:", error);
      return Response.json({
         success: false,
         message: "Error checking username",
      }, { status: 500 });
   }
}