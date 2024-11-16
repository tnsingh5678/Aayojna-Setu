import mongoose from "mongoose";

const newuser = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your Name!"],
        minLength: [3, "Name must contain at least 3 Characters!"],
        maxLength: [30, "Name cannot exceed 30 Characters!"],
    },
    email: {
        type: String,
        required: [true, "Please enter your Email!"],
        validate: [validator.isEmail, "Please provide a valid Email!"],
    },
    phone: {
        type: Number,
        required: [true, "Please enter your Phone Number!"],
        minLength: [10, "Please provide valid Phone Number"]
    },
    password: {
        type: String,
        required: [true, "Please provide a Password!"],
        minLength: [8, "Password must contain at least 8 characters!"],
        maxLength: [32, "Password cannot exceed 32 characters!"],
        select: false,
    },
    categories: {
        type: Array(10,false),
        required: false,
        // i will true all those fields that user choose
    },
    schemes: {
        type: Array,
        required: false,
        //store all current schemes for user
    },
    notification:{
        type: String,
        required: false
    }
})

const NewUser = mongoose.model("NEWUSER",newuser);

export default NewUser