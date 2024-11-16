import app from "../app";
import NewUser from "../models/newuser";
import Schemes from "../models/schemes.models";
import redis from "redis"


// i am using bitmasking to optimize the time for accessing all data

const findByCategory = async (req,res)=>{
    const index = req.body;
    // i want to get users with this category
    const user = await NewUser.findOne(categories[index]===1);
    return res.send(user);


}

const SchemesArray = async (req,res,next) => {
    const index = req.body;
    const schemes = await Schemes.findOne(categories[index]);

    res.send(schemes)

    next();


}

// it is done by admin
app.post("/newscheme",async (req,res)=>{
    const scheme = req.body;
    const categories = scheme.categories;
    //c++ logic 
    let v = Int16Array;
    for(let i=0;i<categories.size;i++){
        if(categories[i]===1){
            v.push_back(i);
        }
    }
    let user=[];
    for(let i=0;i<v.size;i++){
        //findbycategory to be declared;
        user+=findByCategory(v[i]);
    }
    // notification to be declared and to be send to all users
    // const notification = it is scheme
    // new scheme generated and its all detail is sended
    // i think i have to use redis to store schemes and notification
    
    res.send(notification);
    // it is broadcasted by admin to users

})

app.get("/schemes", async (req,res)=>{
    const categories = req.body;
    //c++ logic 
    vector<int> v(10);
    for(let i=0;i<categories.size;i++){
        if(categories[i]===1){
            v.push_back(i);
        }
    }
    // got all bit indexes
    let schemes;
    for(let i=0;i<v.length;i++){
        schemes+=SchemesArray(v[i]);
    }
    return res.send(schemes);
    // it is search filter by user


})

app.get("/userschemes", async (req,res) =>{
    let indexes = [];
    indexes = req.body;
    const id = req.id;
    const user = await NewUser.findById(id);
    if(user.schemes){
        return res.send(user.schemes)
    }
    let schemes;
    for(let i=0;i<indexes.length;i++){
        schemes+=await Schemes.findOne(categories[indexes[i]]);
    }
    
    user.schemes = schemes;
    // store schemes in redis for 1 day i.e 24hr to work efficiently

    await NewUser.findByIdAndUpdate(id,user)

    return res.send(schemes);
    // user get all its schemes

})

app.post("/allscheme",async (req,res)=>{
    //api call 
    //get all the schemes from api
    //i have to know that how to know that something changed in api data
    //some entry added or deleted
    //if any change update schemes
    if(prev==curr){
        // redis return;
        // this is called in useEffect in frontend it is continuously checking for new schemes
        // if something change in data
        // new response send else caching
        return res.send(prev);
    }
    let schemes;
    for(let i=0;i<10;i++){
        schemes+=await Schemes.findOne(categories[i]);
    }
    return res.send(schemes);
    
})

app.post("/voice-assistant", async (req,res)=>{
    // voice service
    // take voice based questionaire
    // take voice based answer in multiple languages
    // accuracy should be high of voice assistant
    // voice assistant means AI in project

})

