import nextConnect from "next-connect";
import News from "../../models/news";
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
    cb(new Error("File format not matched"));
  } else if (
    file.fieldname === "pdfs" &&
    !(
      file.mimetype === "application/pdf" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
  ) {
    cb(new Error("File format not matched"));
  } else {
    cb(null, true);
  }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  params:{
    Bucket: process.env.MY_BUCKET,
  },
  apiVersion: "2006-03-01",
  region: "ap-south-1",
  accessKeyId: process.env.MY_ACCESS_KEY,
  secretAccessKey: process.env.MY_SECRET_ACCESS_KEY,
});

function onError(err, req, res) {
  if (err.message === "File format not matched") {
    res.status(200).json({
      error: "File format not matched",
    });
  } else {
    res.status(500).json({ error: err.toString() });
  }
  // OR: you may want to continue
}

const handler = nextConnect({ onError });

handler.use(auth);
handler.use(upload.fields([{ name: "images" }, { name: "pdfs" }]));

handler.post(async (req, res) => {
  console.log("Upload sequence initiating....");

  let imgPath = [];
  // console.log(req.files.images);
  // console.log(req.files.pdfs);
  const promise1 = !req.files.images
    ? null
    : req.files.images.map(async (file) => {
        console.log("Uploading images....");
        const param = {
          Key:
            "files/news/images/" +
            new Date().toISOString() +
            "_" +
            file.originalname,
          Body: file.buffer,
          ContentType: file.mimetype,
        };
        const aws_file = await s3.upload(param).promise();
        return aws_file.Location;
      });
  imgPath = req.files.images ? await Promise.all(promise1) : [];
  console.log(imgPath);
  let pdfPath = [];
  const promise2 = !req.files.pdfs
    ? null
    : req.files.pdfs.map(async (file) => {
        console.log("Uploading pdfs....");
        const param = {
          Key:
            "files/news/pdfs/" +
            new Date().toISOString() +
            "_" +
            file.originalname,
          Body: file.buffer,
          ContentType: file.mimetype,
        };
        const aws_file = await s3.upload(param).promise();

        return aws_file.Location;
      });
  pdfPath = promise2 ? await Promise.all(promise2) : [];
  console.log(pdfPath);
  const news = new News({
    date: req.body.date,
    heading: req.body.heading,
    content: req.body.content,
    imagesPath: imgPath,
    pdfsPath: pdfPath,
  });

  await news.save();

  console.log("Bye from backend");
  res.json({ result: "success" });
});

handler.get(async (req, res) => {
  res.json({ name: "John Doe" });
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
