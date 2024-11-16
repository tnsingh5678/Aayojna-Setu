import app from "../app";
import NewUser from "../models/newuser";
import Schemes from "../models/schemes.models";
import redis from "redis";

const redisClient = redis.createClient();

// findByCategory (fixing usage of categories array and adding error handling)
const findByCategory = async (index) => {
    try {
        const user = await NewUser.find({ categories: { $in: [index] } });
        return user;
    } catch (error) {
        console.error("Error finding user by category:", error);
        throw new Error("Failed to fetch user by category");
    }
};

// SchemesArray (fixing bitmask logic and caching)
const SchemesArray = async (index) => {
    try {
        const schemes = await Schemes.find({ categories: { $in: [index] } });
        return schemes;
    } catch (error) {
        console.error("Error fetching schemes by category:", error);
        throw new Error("Failed to fetch schemes");
    }
};

app.post("/newscheme", async (req, res) => {
    const scheme = req.body;
    const categories = scheme.categories;
    const v = [];

    // Collect category indexes where category is 1 (bitmasking logic)
    for (let i = 0; i < categories.length; i++) {
        if (categories[i] === 1) {
            v.push(i);
        }
    }

    let users = [];
    for (let i = 0; i < v.length; i++) {
        const usersInCategory = await findByCategory(v[i]);
        users = [...users, ...usersInCategory];
    }

    // Here, you'd want to send a notification to all users (real-time using sockets or Redis)
    const notification = { message: "New scheme generated", schemeDetails: scheme };

    // Example Redis caching (store scheme for 24 hours)
    redisClient.setEx("scheme_" + scheme.id, 86400, JSON.stringify(scheme));

    return res.send(notification);
});

// Schemes retrieval (with caching)
app.get("/schemes", async (req, res) => {
    const categories = req.body;
    const v = [];

    for (let i = 0; i < categories.length; i++) {
        if (categories[i] === 1) {
            v.push(i);
        }
    }

    let schemes = [];
    for (let i = 0; i < v.length; i++) {
        const schemesInCategory = await SchemesArray(v[i]);
        schemes = [...schemes, ...schemesInCategory];
    }

    // Example: Store schemes in cache for faster access
    redisClient.setEx("schemes", 86400, JSON.stringify(schemes));

    return res.send(schemes);
});

app.get("/userschemes", async (req, res) => {
    const indexes = req.body;
    const userId = req.id;
    const user = await NewUser.findById(userId);

    if (user.schemes) {
        return res.send(user.schemes);
    }

    let schemes = [];
    for (let i = 0; i < indexes.length; i++) {
        const scheme = await Schemes.findOne({ categories: { $in: [indexes[i]] } });
        schemes.push(scheme);
    }

    // Store schemes in Redis for caching (24-hour expiration)
    user.schemes = schemes;
    await NewUser.findByIdAndUpdate(userId, user);
    redisClient.setEx(`user_schemes_${userId}`, 86400, JSON.stringify(schemes));

    return res.send(schemes);
});

app.post("/allscheme", async (req, res) => {
    let schemes = [];
    for (let i = 0; i < 10; i++) {
        const scheme = await Schemes.findOne({ categories: { $in: [i] } });
        schemes.push(scheme);
    }

    // Store all schemes in Redis cache
    redisClient.setEx("all_schemes", 86400, JSON.stringify(schemes));

    return res.send(schemes);
});
