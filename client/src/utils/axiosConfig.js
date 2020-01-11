/* istanbul ignore file */
import get from "lodash/get";
import axios from "axios";

const { baseURL } = process.env;

// this sets a baseURL to all requests
// in development this is 'http://localhost:5000'
export const app = axios.create({
	baseURL: `${baseURL}/api`,
});

// this intercept incoming error messages
// otherwise axios consumes them and spits out
// a generic status error
app.interceptors.response.use(
	response => response,
	error => {
		const err = get(error, ["response", "data", "err"]);

		return Promise.reject(err || error.message);
	},
);

export default app;
