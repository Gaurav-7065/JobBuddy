import mongoose from 'mongoose'

async function Connect_Db(params) {
    try{
      await mongoose.connect(process.env.MONGO_URI);
    console.log("Db connected")
    }
    catch(e){
        console.log("Error!",e);
    }
    
}

export default Connect_Db;