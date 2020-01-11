import random from "lodash/random";

// returns current working directory root
const currentDirectory = process.cwd();

// generates a unique string
const tokenGenerator = (str, tlen) => {
  const arr = [...str];
  const max = arr.length - 1;
  let token = "";
  for (let i = 0; i < tlen; i += 1) {
    const int = random(max);
    token += arr[int];
  }
  return token;
};

// generates a unique 32 character string
const createRandomString = () =>
  tokenGenerator(
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    32
  );

// sends back a generic 400 response with an error message
const sendError = (err, res) => res.status(400).json({ err: err.toString() });

export { currentDirectory, createRandomString, sendError };
