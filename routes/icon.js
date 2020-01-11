import { createIcon } from "~controllers/icon";
import saveIcon from "~utils/saveIcon";

// accepts incoming 'POST' requests to '/api/upload-icon'
// saveIcon is a file saving middleware (see utils/saveIcon.js)
// createIcon is the controller (see controllers/icon.js)
export default app => {
  app.post("/api/upload-icon", saveIcon, createIcon);
};
