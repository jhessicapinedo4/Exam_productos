import mongoose from "mongoose";

const conectionDB = async() => {
    await mongoose.connect(process.env.URI).then((res)=>{
        console.log("Conectando a base de datos Mongo DB");
    })

}

export default conectionDB;
