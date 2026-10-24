const redis = require("redis");

const redisClient = redis.createClient({
  username: "default",
  password: "1oxI1GFmCovMVAvVXey8Bf2Rhp9zCNVt",
  socket: {
    host: "value-tendency-passionate-41146.db.redis.io",
    port: 11086,
  },
});

// const connectRedis = async () => {
//   await redisClient.connect();
//   console.log("Connected to Redis!");
// };

// connectRedis();

module.exports = redisClient;
