import multer from "multer";
import uuid4 from "uuid4";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const id = uuid4();
    cb(null, (file.fieldname = id));
  },
});

export const upload = multer({ storage: storage });
