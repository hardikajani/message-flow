import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function DELETE(request: Request, {params}: {params: {messageid: string}}) {
    const messageId = params.messageid
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User

    if (!session || !session?.user) {
        return Response.json(
            {
                success: false,
                message: "Unauthorized"
            },
            { status: 401 }
        )
    }

    try {
        const updatedResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: new mongoose.Types.ObjectId(messageId) } } }
        );
        if (updatedResult.modifiedCount == 0) {
            return Response.json(
                {
                    success: false,
                    message: "messages not updated or already deleted"
                },
                { status: 404 }
            )
        }
        return Response.json(
            {
                success: true,
                message: "messages deleted successfully"
            },
            { status: 200 }
        )
    } catch (error) {
        console.log("Error delete message route" ,error)
        return Response.json(
            {
                success: false,
                message: "Error delete message route"
            },
            { status: 500 }
        )
    }  

}