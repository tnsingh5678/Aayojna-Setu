// import app from '../app.js';
// import Redis from 'ioredis';
// import Scheme from '../models/schemes.models.js';  // Import the Scheme model

// // Initialize Redis client
// const redisClient = new Redis();
// await redisClient.connect();  // Connect to Redis server

// // Utility function to create a cache key based on the search parameters
// const createCacheKey = (categories) => {
//     return `schemes:${categories.join(',')}`;
// };



// // Route to get all schemes (with caching)
// app.get("/schemes", async (req, res) => {
//     const categories = req.query.categories ? req.query.categories.split(',') : [];

//     // Create a unique cache key based on categories
//     const cacheKey = createCacheKey(categories);

//     try {
//         // Check if the result is already cached in Redis
//         const cachedSchemes = await redisClient.get(cacheKey);
//         if (cachedSchemes) {
//             console.log("Returning cached schemes.");
//             return res.json(JSON.parse(cachedSchemes));
//         }

//         // Fetch schemes from the database
//         let schemes = [];
//         if (categories.length > 0) {
//             schemes = await Scheme.find({ categories: { $in: categories } });
//         } else {
//             schemes = await Scheme.find();  // Get all schemes if no categories specified
//         }

//         // Cache the result in Redis for future requests
//         redisClient.setEx(cacheKey, 86400, JSON.stringify(schemes));  // Cache for 24 hours

//         return res.json(schemes);

//     } catch (error) {
//         console.error("Error fetching schemes:", error);
//         return res.status(500).json({ error: "Failed to retrieve schemes" });
//     }
// });

// // Route to add a new scheme
// app.post("/newscheme", async (req, res) => {
//     const { schemeName, shortDescription, fullDescription, url, categories } = req.body;

//     // Validate incoming request body
//     if (!schemeName || !shortDescription || !fullDescription || !url) {
//         return res.status(400).json({ error: "All fields are required" });
//     }

//     try {
//         // Create a new scheme instance
//         const newScheme = new Scheme({
//             schemeName,
//             shortDescription,
//             fullDescription,
//             url,
//             categories,
//         });

//         // Save the scheme to the database
//         const savedScheme = await newScheme.save();

//         // Invalidate the cache (if any) since we've added a new scheme
//         redisClient.del(createCacheKey(categories));  // Delete the cache for the relevant categories

//         return res.status(201).json(savedScheme);

//     } catch (error) {
//         console.error("Error creating scheme:", error);
//         return res.status(500).json({ error: "Failed to create scheme" });
//     }
// });

// // Route to get schemes by category (with caching)
// app.get("/schemes/category", async (req, res) => {
//     const categories = req.query.categories ? req.query.categories.split(',') : [];

//     if (categories.length === 0) {
//         return res.status(400).json({ error: "Categories parameter is required" });
//     }

//     // Create a unique cache key based on categories
//     const cacheKey = createCacheKey(categories);

//     try {
//         // Check if the result is already cached in Redis
//         const cachedSchemes = await redisClient.get(cacheKey);
//         if (cachedSchemes) {
//             console.log("Returning cached schemes by category.");
//             return res.json(JSON.parse(cachedSchemes));
//         }

//         // Fetch schemes from the database by category
//         const schemes = await Scheme.find({ categories: { $in: categories } });

//         // Cache the result in Redis for future requests
//         redisClient.setEx(cacheKey, 86400, JSON.stringify(schemes));  // Cache for 24 hours

//         return res.json(schemes);

//     } catch (error) {
//         console.error("Error fetching schemes by category:", error);
//         return res.status(500).json({ error: "Failed to retrieve schemes by category" });
//     }
// });

// // Route to get schemes by ID (with caching)
// app.get("/schemes/:id", async (req, res) => {
//     const schemeId = req.params.id;

//     try {
//         // Check if the scheme is cached
//         const cachedScheme = await redisClient.get(`scheme:${schemeId}`);
//         if (cachedScheme) {
//             console.log("Returning cached scheme.");
//             return res.json(JSON.parse(cachedScheme));
//         }

//         // Fetch the scheme from the database
//         const scheme = await Scheme.findById(schemeId);

//         if (!scheme) {
//             return res.status(404).json({ error: "Scheme not found" });
//         }

//         // Cache the scheme for future requests
//         redisClient.setEx(`scheme:${schemeId}`, 86400, JSON.stringify(scheme));  // Cache for 24 hours

//         return res.json(scheme);

//     } catch (error) {
//         console.error("Error fetching scheme by ID:", error);
//         return res.status(500).json({ error: "Failed to retrieve scheme by ID" });
//     }
// });

