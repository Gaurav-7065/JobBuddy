import mongoose from "mongoose";

const tokenBlacklistSchema=new mongoose.Schema({
    token:{
        type:String,
        required:[true,"token is required to be added in blacklist"]
    }
},
{
    timestamps:true
})

const tokenBlacklistModel=mongoose.model("tokenBlacklistSchema",tokenBlacklistSchema);

export default tokenBlacklistModel;