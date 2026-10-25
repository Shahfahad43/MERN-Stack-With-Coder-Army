const redisClient = require("../Config/redis");

const rateLimiter = async (req, res, next) => {
  try {
    const ip = req.ip;
    console.log(ip);
    const count = await redisClient.incr(ip);
    // What does the above function do? -> Increasing the value of ip by one if exists. If doesn't then first create an ip inside.

    // Now if it is the first time, then first set the time for which the user is able to make request.
    if (count == 1) await redisClient.expire(3600); // 1hour = 3600s

    if (count > 10) throw new Error("User limit exceeded!");
    console.log(count);
    next();
  } catch (error) {
    return res.send(error);
  }
};

module.exports = rateLimiter;

// NOTE: Copy all the code of the day 24 for running this code. and run npm install to install all the dependencies
