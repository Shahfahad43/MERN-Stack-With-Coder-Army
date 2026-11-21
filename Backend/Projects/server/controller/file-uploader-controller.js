import mongoose from "mongoose";

const url = "http://localhost:8000"; // Apna backend port rakhna

const getBucket = (bucketName = "photos") => {
  return new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName,
  });
};

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(404).json("File not found!");
    }
    const fileUrl = `${url}/file/${req.file.filename}`;
    return res.status(200).json(fileUrl);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const getImage = async (req, res) => {
  try {
    const filename = req.params.filename;

    // 1. Pehle 'photos' bucket mein dekho
    let bucket = getBucket("photos");
    let files = await bucket.find({ filename }).toArray();

    // 2. Agar 'photos' mein nahi mili (jaise purani PDF), toh 'fs' bucket mein dekho
    if (!files || files.length === 0) {
      bucket = getBucket("fs");
      files = await bucket.find({ filename }).toArray();
    }

    if (!files || files.length === 0) {
      return res.status(404).json("File not found in database!");
    }

    const readStream = bucket.openDownloadStream(files[0]._id);
    readStream.pipe(res);
  } catch (error) {
    console.log("getImage Error:", error);
    return res.status(500).json(error.message);
  }
};
