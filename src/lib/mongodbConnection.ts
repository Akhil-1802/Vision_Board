import mongoose from "mongoose";


const MongoURL = process.env.MONGODB_URI!


let cached = global.mongoose


if(!cached)
    cached = global.mongoose = {conn : null , promise : null}


export async function dbConnection() {
    if(cached.conn)
        return cached.conn

    if(!cached.promise){
        const options = {
            bufferCommands : true,
            maxPoolSize : 10
        }
        cached.promise = mongoose.connect(MongoURL , options)
        .then(()=> mongoose.connection)
    }

    try {
        cached.conn = await cached.promise
    } catch (error) {
        cached.promise = null
        throw error
    }
    return cached.conn
}