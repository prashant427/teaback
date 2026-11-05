import { getServerSession } from "next-auth";

import { authOptions } from "../../auth/[...nextauth]/option";
import { dbConnect } from "@/lib/dbconfig";
import { UserModel } from "@/models/user";

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await context.params;

  const session = await getServerSession(authOptions);

  if (!session?.user?.username) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }

  try {
    const user = await UserModel.findOne({ username: session.user.username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    if (!id) {
      return Response.json(
        {
          success: false,
          message: "Message id is required",
        },
        { status: 400 }
      );
    }

    const previousCount = user.messages.length;
    user.messages = user.messages.filter(
      (message) => message._id?.toString() !== id
    );

    if (user.messages.length === previousCount) {
      return Response.json(
        {
          success: false,
          message: "Message not found",
        },
        { status: 404 }
      );
    }

    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message deleted",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message", error);
    return Response.json(
      {
        success: false,
        message: "Error deleting message",
      },
      { status: 500 }
    );
  }
}
