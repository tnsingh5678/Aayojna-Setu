import mongoose from "mongoose";

const SchemeSchema = new mongoose.Schema({
    title :{
        type : String,
        required : [true,"title is required"],
        
    },
    description : {
        type : String,
        required : [true,"Description is required"],
    },
    detailed : {
        type : String,
        required : [true, "detailed description"]
    },
    link : {
        type : String ,
        required : [true, "link is required"]
    },
    categories : {
        type : [String] ,
        required : false,
    }
})

const Schemes = mongoose.model("SCHEMES",SchemeSchema)

export default Schemes;