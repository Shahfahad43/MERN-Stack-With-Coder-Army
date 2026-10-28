const redisClient = require("../Config/redis");
// Total time: 60 min
const windowSize = 3600; // here is seconds

const maxRequest = 60;

const rateLimiter = async (req, res, next) => {
  try {
    const key = `IP:${req.ip}`;

    const currentTime = Date.now() / 1000;
    const windowTime = currentTime - windowSize;

    // remove all that values which came before this time.
    redisClient.zRemRangeByScore(key, 0, windowTime);

    // knowing about the total number of remaining count
    const numberOfRequest = await redisClient.zCard(key);

    if (numberOfRequest >= maxRequest) {
      throw new Error("Number of requests exceeded!");
    }

    await redisClient.zAdd(key, [
      { score: currentTime, value: `${currentTime}:${Math.random()}` },
    ]);

    // Total time to live (TTL) should be increased
    await redisClient.expire(key, windowSize);

    next();
  } catch (error) {
    return res.send(error);
  }
};

module.exports = rateLimiter;

// NOTE: Copy all the code of the day 24 for running this code. and run npm install to install all the dependencies
