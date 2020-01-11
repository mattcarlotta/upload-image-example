import User from "~models/user";
import { sendError } from "~utils/helpers";

// creates a new 'User' with an email and icon
const createIcon = async (req, res) => {
  try {
    const { email } = req.body;
    const { path } = req.file;

    // check that email and path exists
    if (!email || !path)
      throw "Unable to process that request. Missing an email or file!";

    // make sure email is unique
    const existingEmail = await User.findOne({ email });
    if (existingEmail) throw "That email is already in use!";

    // create a new user with an icon
    await User.create({ email, icon: path });

    // send a message and path back to client
    res.status(201).json({
      message: `Successfully added an icon to ${email}.`,
      remoteicon: path
    });
  } catch (err) {
    return sendError(err, res);
  }
};

export { createIcon };
