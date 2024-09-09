import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
});

export async function GET(request: Request){
    await dbConnect();
    try {

        const {searchParams} = new URL(request.url);
        const queryParam = {
            username: searchParams.get("username")
        }

        // validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam);
        console.log("Result", result);

        if (!result.success) {
            const usernameError = result.error.format().username?._errors || []
            return Response.json(
                {
                    success: false,
                    message: usernameError?.length > 0 
                    ? usernameError.join(', ')
                    : 'Invalid quety parameters'
                },
                {
                    status: 400
                }
            )
        }

        const {username} = result.data;

        const existingVarifiedUse = await UserModel.findOne({username, isVerified: true})

        if(existingVarifiedUse){
            return Response.json(
                {
                    success: false,
                    message: "Username alredy taken"
                },
                {
                    status: 400
                }
            )
        }
        return Response.json(
            {
                success: true,
                message: "Username is available"
            },
            {
                status: 200
            }
        )
        
        
    } catch (error) {
        console.log("error checking username" , error);
        return Response.json(
            {
                success: false,
                message: "error checking username"
            },
            {
                status: 500
            }
        )
    }
}
