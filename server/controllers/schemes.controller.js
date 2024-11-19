// import app from "../app.js";
// import NewUser from "../models/newuser.js";
// import Schemes from "../models/schemes.models.js";
// //import client from "../redis.js";
// import Redis from "ioredis";

// const redisClient = Redis.createClient();
// await redisClient.connect();
// // async function init(){
// //     client.set("user:4","Singh")
// //     const result = await client.get("user:4")

// //     console.log(result)
// // }
// // init();

// //Utility function to create a cache key based on the search parameters
// const createCacheKey = (categories) => {
//     return `schemes:${categories.join(',')}`;
// };

// //findByCategory (fixing usage of categories array and adding error handling)
// const findByCategory = async (index) => {
//     try {
//         const user = await NewUser.find({ categories: { $in: [index] } });
//         return user;
//     } catch (error) {
//         console.error("Error finding user by category:", error);
//         throw new Error("Failed to fetch user by category");
//     }
// };

// // SchemesArray (fixing bitmask logic and caching)
// const SchemesArray = async (index) => {
//     try {
//         const schemes = await Schemes.find({ categories: { $in: [index] } });
//         return schemes;
//     } catch (error) {
//         console.error("Error fetching schemes by category:", error);
//         throw new Error("Failed to fetch schemes");
//     }
// };

// // Schemes retrieval with caching logic
// app.get("/schemes", async (req, res) => {
//     const categories = req.body;  // Assume it's an array of category indexes

//     // Create a unique cache key based on categories
//     const cacheKey = createCacheKey(categories);

//     // Check if the result is already cached in Redis
//     const cachedSchemes = await redisClient.get(cacheKey);

//     if (cachedSchemes) {
//         // Return the cached data if available
//         console.log("Returning cached schemes.");
//         return res.send(JSON.parse(cachedSchemes));
//     }

//     // If not cached, fetch data from the database
//     const v = [];

//     for (let i = 0; i < categories.length; i++) {
//         if (categories[i] === 1) {
//             v.push(i);
//         }
//     }

//     let schemes = [];
//     for (let i = 0; i < v.length; i++) {
//         const schemesInCategory = await SchemesArray(v[i]);
//         schemes = [...schemes, ...schemesInCategory];
//     }

//     // Cache the retrieved schemes in Redis for future use
//     redisClient.setEx(cacheKey, 86400, JSON.stringify(schemes));  // Cache for 24 hours

//     return res.send(schemes);
// });

// // Newscheme endpoint (create and update cache)
// app.post("/newscheme", async (req, res) => {
//     const scheme = req.body;
//     const categories = scheme.categories;
//     const v = [];

//     // Collect category indexes where category is 1 (bitmasking logic)
//     for (let i = 0; i < categories.length; i++) {
//         if (categories[i] === 1) {
//             v.push(i);
//         }
//     }

//     let users = [];
//     for (let i = 0; i < v.length; i++) {
//         const usersInCategory = await findByCategory(v[i]);
//         users = [...users, ...usersInCategory];
//     }

//     // Here, you'd want to send a notification to all users (real-time using sockets or Redis)
//     const notification = { message: "New scheme generated", schemeDetails: scheme };

//     // Invalidate or update the relevant cache (if necessary)
//     const cacheKey = createCacheKey(categories);
//     redisClient.del(cacheKey);  // Delete the old cache if it's there, to force a refresh on next request

//     // Example Redis caching (store scheme for 24 hours)
//     redisClient.setEx("scheme_" + scheme.id, 86400, JSON.stringify(scheme));

//     return res.send(notification);
// });

// // Userschemes retrieval with caching (24-hour cache)
// app.get("/userschemes", async (req, res) => {
//     const indexes = req.body;
//     const userId = req.id;
//     const user = await NewUser.findById(userId);

//     // Check if user schemes are already cached in Redis
//     const userCacheKey = `user_schemes_${userId}`;
//     const cachedUserSchemes = await redisClient.get(userCacheKey);

//     if (cachedUserSchemes) {
//         console.log("Returning cached user schemes.");
//         return res.send(JSON.parse(cachedUserSchemes));
//     }

//     // If not cached, fetch data from the database
//     let schemes = [];
//     for (let i = 0; i < indexes.length; i++) {
//         const scheme = await Schemes.findOne({ categories: { $in: [indexes[i]] } });
//         schemes.push(scheme);
//     }

//     // Cache the schemes for this user
//     redisClient.setEx(userCacheKey, 86400, JSON.stringify(schemes));  // Cache for 24 hours

//     // Update user schemes in the database
//     user.schemes = schemes;
//     await NewUser.findByIdAndUpdate(userId, user);

//     return res.send(schemes);
// });

// // Allscheme endpoint (cache all schemes)
// app.post("/allscheme", async (req, res) => {
//     let schemes = [];
//     for (let i = 0; i < 10; i++) {
//         const scheme = await Schemes.findOne({ categories: { $in: [i] } });
//         schemes.push(scheme);
//     }

//     // Cache all schemes
//     redisClient.setEx("all_schemes", 86400, JSON.stringify(schemes));  // Cache for 24 hours

//     return res.send(schemes);
// });
