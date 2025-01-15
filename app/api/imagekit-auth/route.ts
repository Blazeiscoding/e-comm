import ImageKit  from "imagekit";
import { NextResponse } from "next/server";

const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
    privateKey: process.env.PRIVATE_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,

})


/*************  ✨ Codeium Command ⭐  *************/
/**
 * Handles GET requests to obtain ImageKit authentication parameters.
 * 
 * @returns {NextResponse} A JSON response containing the authentication 

/******  f418ebc6-fe42-4173-bed7-8288e09be579  *******/
export async function GET(){
    try {
        const authenticationParameters = imagekit.getAuthenticationParameters();
        return NextResponse.json(authenticationParameters)

    } catch (error) {
        return NextResponse.json({error},{status:500})
    }
}
