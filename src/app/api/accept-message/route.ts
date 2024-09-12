import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";

export async function POST(request: Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user

    if(!session || !session?.user){
        return Response.json(
            {
                success: false,
                message: "Unauthorized"
            },
            { status: 401 }
        )
    }
    const userId = user._id;
    const {acceptMessage} = await request.json()
    try {
        const updateUser = await UserModel.findByIdAndUpdate(
            userId, 
            {acceptMessage}, 
            {new: true}
        )
        if(!updateUser){
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 404 }
            )
        }
        return Response.json(
            {
                success: true,
                message: "Message acceptance status updated successfully",
                updateUser,
            },
            { status: 200 }
        )
        
    } catch (error) {
        console.log("faild to update user status to accept messages", error);
        return Response.json(
            {
                success: false,
                message: "faild to update user status to accept messages"
            },
            { status: 500 }
        )
        
    }
}


export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user

    if(!session || !session?.user){
        return Response.json(
            {
                success: false,
                message: "Unauthorized"
            },
            { status: 401 }
        )
    }
    const userId = user._id;

    try {
        const foundedUser = await UserModel.findById(userId)
        if(!foundedUser){
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 404 }
            )
        }
        return Response.json(
            {
                success: true,
                // message: "Message acceptance status fetched successfully",
                isAcceptingMessages: foundedUser.isAcceptingMessages,
            },
            { status: 200 }
        )
    } catch (error) {
        console.log("Error is getting message acceptance status", error);
        return Response.json(
            {
                success: false,
                message: "Error is getting message acceptance status"
            },
            { status: 500 }
        )
    }
}

