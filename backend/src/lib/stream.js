import {StreamChat} from "stream-chat";
import "dotenv/config"

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret){
    console.error("Stream Api key or secret is missing");
}

const stramClient = StreamChat.getInstance(apiKey,apiSecret);

export const upsertUserStream = async (userData)=>{
    try {
        await stramClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.error("Error upserting stream user :",error);
    }
}

export const generateStramToken = (userId)=>{

}