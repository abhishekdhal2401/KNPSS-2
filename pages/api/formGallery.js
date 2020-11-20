import nextConnect from "next-connect";
import Gallery from "../../models/gallery";
import mongooseConnection from "../../middleware/database";
import auth from '../../middleware/auth';

const multer = require("multer");
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (
    file.fieldname === "images" &&
    !(
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"||
      file.mimetype === "image/webp"
    )
  ) {
    cb(new Error("File Format not matched"));
  } else {
    cb(null, true);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  params: {
    Bucket: process.env.MY_BUCKET,
  },
  apiVersion: "2006-03-01",
  region: "ap-south-1",
  accessKeyId: process.env.MY_ACCESS_KEY,
  secretAccessKey: process.env.MY_SECRET_ACCESS_KEY,
});
const onError = (err, req, res) => {
  if (err.message === "File format not matched") {
    res.status(415).json({
      error: "File format not matched",
    });
  } else {
    res.status(500).json({ error: console.trace(err) });
  }
};

const handler = nextConnect({ onError });
handler.use(auth);

handler.use(upload.fields([{ name: "images" }]));
handler.post(async (req, res) => {
  let imgPath = [];
  //   upload files in aws
  const promise = !req.files.images
    ? null
    : req.files.images.map(async (image) => {
        const param = {
          Key:
            "files/gallery/" +
            new Date().toISOString() +
            "##**__" +
            image.originalname,
          Body: image.buffer,
          ContentType: image.mimetype,
        };
        const aws_file = await s3.upload(param).promise();
        return aws_file.Location;
      });
  imgPath = !req.files.images ? [] : await Promise.all(promise);
  //   upload gallery document in mongoDb
  const gallery = new Gallery({
    date: req.body.date,
    heading: req.body.heading,
    imagesPath: imgPath,
  });
  await gallery.save();
  //   return response on successful operation
  res.statusCode = 200;
  res.json({ result: "success" });
});

export default handler;


export const config = {
    api: {
      bodyParser: false,
    },
  };