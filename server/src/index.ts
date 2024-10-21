import express from "express";
import multer from "multer";
import path from "path";
import cors from "cors";

const app = express();
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename(req, file, cb) {
      const uniqueSuffix = `img-${Date.now()}`;
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb(new Error("Images only. Accepted file types: jpeg, jpg, png."));
    }
  },
  limits: { fileSize: 5000000 },
});

app.use(cors());
app.use(express.json());

app.post("/api/v1/images/single", upload.single("image"), (req, res) => {
  const body = req.body;
  const file = req.file;

  return res.status(201).json({ ok: true, data: { body, file } });
});

app.post("/api/v1/images/array", upload.array("images", 5), (req, res) => {
  const body = req.body;
  const files = req.files;

  return res.status(201).json({ ok: true, data: { body, files } });
});

app.post(
  "/api/v1/images/fields",
  upload.fields([
    { name: "images", maxCount: 3 },
    { name: "photos", maxCount: 2 },
  ]),
  (req, res) => {
    const body = req.body;
    const files = req.files;

    return res.status(201).json({ ok: true, data: { body, files } });
  }
);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
