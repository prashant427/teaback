import mongoose from "mongoose";

type connectionObject = {
    isConnected?: number;
}

const connection: connectionObject = {};

    export async function dbConnect():Promise<void> {
    if(connection.isConnected) {
        console.log("Already connected to database");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI as string|| "");
        connection.isConnected = db.connection.readyState;
        console.log("Connected to database");
    } catch (error) {
        console.log("Error connecting to database:", error);
        console.error("Error connecting to database:", error);
    }
}
