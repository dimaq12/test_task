import express from "express";
import { Request, Response } from "express";
import bodyParser from "body-parser";
import uuid4 from "uuid4";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";

import { database } from "./db-config";
import { verifyToken } from "./middleware/auth";
import { upload } from "./middleware/storage";

const app = express();
const BCRYPT_SALT_ROUNDS = 10;
const TOKEN_KEY = "@pTi*3G4ofdC";

interface IUser {
  user_id: string;
  username: string;
  password: string;
}

interface IUserRes {
  id: string;
  username: string;
  token: string;
}

interface AuthorizedRequest extends Request {
  user: IUser;
}

interface IFileRequest extends AuthorizedRequest {
  file: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
  };
}

interface IFileRecord {
  userId: string;
  fileId: string;
  size: number;
  path: string;
  mimetype: string;
  originalname: string;
  timestamp: number;
}

app.use(bodyParser.json());
app.use(cors());

app.post("/signup", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!(username && password)) {
    res.status(400).send("All input is required");
  }

  const users = database.getData("/users");

  const currentUser = users.find((user) => {
    return user.username === username;
  });

  if (currentUser && currentUser.username === username) {
    return res.status(409).send("User Already Exist. Please Login");
  }

  const user_id: string = uuid4();
  const encryptedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  const user: IUser = {
    user_id,
    username: req.body.username,
    password: encryptedPassword,
  };

  database.push("/users[]", user);

  const token = jwt.sign(
    { user_id: user.user_id, username: user.username },
    TOKEN_KEY,
    {
      expiresIn: "2h",
    }
  );
  // save user token
  const userResponse: IUserRes = { username, id: user_id, token };

  // return new user
  res.status(201).json(userResponse);
});

app.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!(username && password)) {
      res.status(400).send("All input is required");
    }

    const users = database.getData("/users");

    const currentUser: IUser = users.find((user) => {
      return user.username === username;
    });

    console.log(currentUser);

    if (currentUser && (await bcrypt.compare(password, currentUser.password))) {
      const token = jwt.sign(
        { user_id: currentUser.user_id, username: currentUser.username },
        TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      const userResponse: IUserRes = {
        username: currentUser.username,
        id: currentUser.user_id,
        token,
      };

      res.status(200).json(userResponse);
    }
    res.status(400).send("Invalid Credentials");
  } catch (error) {
    console.log(error);
  }
});

app.use(verifyToken);

app.get("/files", (req: AuthorizedRequest, res: Response) => {
  const { user_id } = req.user;

  const files = database.getData("/files");
  const userFiles = files.filter((fileRecord) => {
    return fileRecord.userId === user_id;
  });

  res.status(200).json(userFiles);
});

app.post(
  "/upload",
  upload.single("file"),
  (req: IFileRequest, res: Response) => {
    const { size, path, mimetype, originalname, fieldname } = req.file;
    const { user_id } = req.user;

    const files = database.getData("/files");

    const alreadyExist = files.find((file) => {
      return file.originalname === originalname;
    });

    if (alreadyExist) {
      return res.status(400).send("Already exists");
    }

    const fileRecord: IFileRecord = {
      userId: user_id,
      fileId: fieldname,
      size,
      path,
      mimetype,
      originalname,
      timestamp: Date.now(),
    };
    database.push("/files[]", fileRecord);

    res.status(201).json(fileRecord);
  }
);

app.get("/download/:id", (req: AuthorizedRequest, res: Response) => {
  try {
    const fileId = req.params.id;
    const { user_id } = req.user;
    const files = database.getData("/files");
    const fileRecord: IFileRecord = files.find((record) => {
      return record.fileId === fileId;
    });

    if (fileRecord.userId === user_id) {
      const file = `./${fileRecord.path}`;
      console.log(file);

      res.setHeader(
        "Content-disposition'",
        `attachment; filename=${fileRecord.originalname}`
      );
      res.setHeader("Content-type", fileRecord.mimetype);

      return res.status(200).download(file);
    }

    res.status(400).send("Forbidden");
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, () => {
  console.log("Application started on port 3000!");
});
