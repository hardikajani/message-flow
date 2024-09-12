import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { Message } from "@/model/User.model";
import { messageSchema } from "@/schemas/messageSchema";


export async function POST(request:Request) {
    await dbConnect();
    const {username, content} = await request.json();

    try {
        // Validate the message content using the messageSchema
    const validationResult = messageSchema.safeParse({ content });

    if (!validationResult.success) {
      return Response.json(
        {
        success: false,
        error: validationResult.error.issues[0].message,
      },
      { status: 400 }
    );
    }
        const user = await UserModel.findOne({username});
    
        if(!user){
            return Response.json(
                {
                    success: false,
                    error:"User not found"
                },
                {status:404});
        }
    
        if (!user.isAcceptingMessages) {
            return Response.json(
                {
                    success: false,
                    error:"User is not accepting messages"
                }, 
                {status:400});
        }
    
        const newMessage = {content, createdAt: new Date()};
        user.messages.push(newMessage as Message);
        await user.save();
        return Response.json(
            {
                success: true,
                message: "Message sent successfully"
            },
            {status:200}); 
    } catch (error) {
        console.log("Error sending message, ", error);
        return Response.json(
            {
                success: false,
                error:"Error sending message"
            },
            {status:500});
        
    }
}