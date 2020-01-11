import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import moment from "moment-timezone";
import multer from "multer";
import "~database";

const { CLIENT, inProduction, inTesting } = process.env;

//= ===========================================================//
/* APP MIDDLEWARE */
//= ===========================================================//
export default app => {
  app.use(
    multer({
      limits: {
        fileSize: 10240000, // limit file size to 10mb
        files: 1 // limit files to 1
      },
      fileFilter: (req, file, next) => {
        // check that the file is an accepted image format
        if (!/\.(jpe?g|png|gif|bmp)$/i.test(file.originalname)) {
          req.err = "That file extension is not accepted!";
          next(null, false);
        }
        next(null, true);
      }
    }).single("icon")
  );
  morgan.token("date", () => moment().format("MMMM Do YYYY, h:mm:ss a")); // date access log
  app.use(
    cors({
      origin: CLIENT
    })
  ); // allows receiving requests from front-end
  if (!inTesting) {
    app.use(
      morgan(
        inProduction
          ? ":remote-addr [:date] :referrer :method :url HTTP/:http-version :status :res[content-length]"
          : "tiny"
      )
    );
  } // logging framework
  app.use(
    compression({
      level: 6, // set compression level from 1 to 9 (6 by default)
      filter: (req, res) =>
        req.headers["x-no-compression"] ? false : compression.filter(req, res) // set predicate to determine whether to compress
    })
  );
  app.use(bodyParser.json()); // parses header requests (req.body)
  app.use(bodyParser.urlencoded({ extended: true })); // allows objects and arrays to be URL-encoded
  // app.use(passport.initialize()); // initialize passport routes to accept req/res/next
  app.set("json spaces", 2); // sets JSON spaces for clarity
};
