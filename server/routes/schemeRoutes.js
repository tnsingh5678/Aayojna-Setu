// routes/schemesRoutes.js
import express from 'express';
import Scheme from "../models/schemes.models.js"
import { redisClient,redisPubSubClient } from '../redis.js';

// const redisClient = new Redis();  // Initialize Redis client
// redisClient.connect().catch(console.error);
const router = express.Router();




// Initialize Redis client
// const redisClient = new Redis();  // You might want to handle Redis initialization elsewhere (see notes)
// redisClient.connect();  // Connect to Redis server

// Utility function to create a cache key based on the search parameters
const createCacheKey = (categories) => {
    categories = categories || [];
    return `schemes:${categories.join(',')}`;
};

// Route to get all schemes (with caching)
router.get("/", async (req, res) => {
    const categories = req.query.categories ? req.query.categories.split(',') : [];

    // Create a unique cache key based on categories
    const cacheKey = createCacheKey(categories);

    try {
        // Check if the result is already cached in Redis
        const cachedSchemes = await redisClient.get(cacheKey);
        if (cachedSchemes) {
            console.log("Returning cached schemes.");
            return res.json(JSON.parse(cachedSchemes));
        }

        // Fetch schemes from the database
        let schemes = [];
        if (categories.length > 0) {
            schemes = await Scheme.find({ categories: { $in: categories } });
        } else {
            schemes = await Scheme.find();  // Get all schemes if no categories specified
        }

        // Cache the result in Redis for future requests
       // redisClient.setEx(cacheKey, 86400, JSON.stringify(schemes));  // Cache for 24 hours
        redisClient.setex(cacheKey, 86400, JSON.stringify(schemes))

        return res.json(schemes);
    } catch (error) {
        console.error("Error fetching schemes:", error);
        return res.status(500).json({ error: "Failed to retrieve schemes" });
    }
});

// Route to add a new scheme
router.post("/newscheme", async (req, res) => {
    const { schemeName, shortDescription, fullDescription, url, categories } = req.body;

    // Validate incoming request body
    if (!schemeName || !shortDescription || !fullDescription || !url) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // Create a new scheme instance
        const newScheme = new Scheme({
            schemeName,
            shortDescription,
            fullDescription,
            url,
            categories,
        });

        // Save the scheme to the database
        const savedScheme = await newScheme.save();

        // Invalidate the cache (if any) since we've added a new scheme
        redisClient.del(createCacheKey(categories));  // Delete the cache for the relevant categories

        return res.status(201).json(savedScheme);
    } catch (error) {
        console.error("Error creating scheme:", error);
        return res.status(500).json({ error: "Failed to create scheme" });
    }
});

// Route to get schemes by category (with caching)
router.get("/category", async (req, res) => {
    const categories = req.query.categories ? req.query.categories.split(',') : [];

    if (categories.length === 0) {
        return res.status(400).json({ error: "Categories parameter is required" });
    }

    // Create a unique cache key based on categories
    const cacheKey = createCacheKey(categories);

    try {
        // Check if the result is already cached in Redis
        const cachedSchemes = await redisClient.get(cacheKey);
        if (cachedSchemes) {
            console.log("Returning cached schemes by category.");
            return res.json(JSON.parse(cachedSchemes));
        }

        // Fetch schemes from the database by category
        const schemes = await Scheme.find({ categories: { $in: categories } });

        // Cache the result in Redis for future requests
        redisClient.setex(cacheKey, 86400, JSON.stringify(schemes));  // Cache for 24 hours

        return res.json(schemes);
    } catch (error) {
        console.error("Error fetching schemes by category:", error);
        return res.status(500).json({ error: "Failed to retrieve schemes by category" });
    }
});

// Route to get schemes by ID (with caching)
router.get("/:id", async (req, res) => {
    const schemeId = req.params.id;

    try {
        // Check if the scheme is cached
        const cachedScheme = await redisClient.get(`scheme:${schemeId}`);
        if (cachedScheme) {
            console.log("Returning cached scheme.");
            return res.json(JSON.parse(cachedScheme));
        }

        // Fetch the scheme from the database
        const scheme = await Scheme.findById(schemeId);

        if (!scheme) {
            return res.status(404).json({ error: "Scheme not found" });
        }

        // Cache the scheme for future requests
        redisClient.setex(`scheme:${schemeId}`, 86400, JSON.stringify(scheme));  // Cache for 24 hours

        return res.json(scheme);
    } catch (error) {
        console.error("Error fetching scheme by ID:", error);
        return res.status(500).json({ error: "Failed to retrieve scheme by ID" });
    }
});

redisPubSubClient.subscribe('new-scheme', (err, count) => {
    if (err) {
        console.error("Failed to subscribe to channel:", err);
    } else {
        console.log(`Subscribed to ${count} channel(s). Listening for messages...`);
    }
});

router.post("/send-notification", async (req, res) => {
    const { type, data } = req.body;

    if (!type || !data) {
        return res.status(400).json({ error: "Type and data fields are required" });
    }

    try {
        const message = { type, data };
        redisClient.publish('new-scheme', JSON.stringify(message));

        return res.status(200).json({ message: "Notification sent successfully" });
    } catch (error) {
        console.error("Error sending notification:", error);
        return res.status(500).json({ error: "Failed to send notification" });
    }
});


// Listening to the "new-scheme" Pub/Sub channel
redisPubSubClient.on('message', async (channel, message) => {
    if (channel === 'new-scheme') {
        const newScheme = JSON.parse(message);
        console.log('New scheme notification received:', newScheme);

        // Invalidate the cache for this scheme category
        const cacheKey = createCacheKey(newScheme.categories);
        redisClient.del(cacheKey); // Delete the cache for this category

        // Optionally, fetch the updated data from Redis or the DB
        const updatedSchemes = await fetchDataFromRedis(cacheKey); // Helper function to fetch from Redis
        console.log(updatedSchemes);
    }
});

export default router;
