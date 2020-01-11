import mkdir from "mkdirp";
import fs from "fs";
import {
  createRandomString,
  currentDirectory,
  sendError
} from "~utils/helpers";

const unableToProcessFile = "Unable to process the requested file.";

// attempts to save an uploaded image to 'uploads' as unique file
export default async (req, res, next) => {
  try {
    // if there's an error or missing file, throw error or a generic error message (see above)
    // in 'middlewares/index.js' there's a multer middleware configuration (see L16-L28) that
    // determines if the file uploaded is allowed
    if (req.err || !req.file) throw req.err || unableToProcessFile;

    // deconstruct the buffer and originalname from req.file
    const { buffer, originalname } = req.file;

    // set current root directory to save to
    const dirPath = `${currentDirectory}/uploads`;

    // generate a unique string to avoid naming collisions
    const filename = `${Date.now()}-${createRandomString()}-${originalname}`;

    // set path to save the image to
    const filepath = `uploads/${filename}`;

    // check that 'uploads' exists
    await new Promise((res, rej) =>
      mkdir(dirPath, err => {
        !err ? res() : rej(err);
      })
    );

    // write file to 'uploads/filepath.ext' using the buffer
    await fs.writeFileSync(`${filepath}`, buffer);

    // add filepath to req.file (to send back to the createIcon controller)
    req.file.path = filepath;

    // invoke next function
    next();
  } catch (err) {
    return sendError(err, res);
  }
};
