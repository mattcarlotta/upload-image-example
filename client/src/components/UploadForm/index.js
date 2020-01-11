import React, { Component } from "react";
import isEmpty from "lodash/isEmpty";
import app from "~utils/axiosConfig";

// baseURL points to our API at: 'http://localhost:5000'
const { baseURL } = process.env;

const initialState = {
	icon: null,
	name: "",
	preview: null,
	size: 0,
	email: "",
	err: "",
	message: "",
	remoteicon: "",
};

export class UploadForm extends Component {
	state = initialState;

	// read file to retrieve name, preview, and size
	// set file details to state
	handleImage = ({ target: { files } }) => {
		if (!isEmpty(files)) {
			// for more info on FileReader, read this MDN:
			// https://developer.mozilla.org/en-US/docs/Web/API/FileReader
			const reader = new FileReader();

			// e.target.files contains the selected image
			const icon = files[0];

			// for more info on onloadend, read this MDN:
			// https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onloadend
			reader.onloadend = () => {
				this.setState({
					icon,
					name: icon.name,
					preview: URL.createObjectURL(icon),
					size: icon.size,
				});
			};

			// for more info on readAsDataURL, read this MDN:
			// https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
			reader.readAsDataURL(icon);
		}
	};

	// handles email inputs
	handleInput = ({ target: { value } }) => this.setState({ email: value });

	// resets back to initial state
	// have to use ref because inputs with 'type=file'
	// are read only
	handleReset = () => {
		this.setState(initialState, () => {
			this.iconInput.value = null;
		});
	};

	// handles form submits
	handleSubmit = async e => {
		e.preventDefault();
		const { icon, email } = this.state;

		// check to see if icon and email are present
		if (!icon || !email) {
			this.setState({ err: "You must include an icon and email address!" });
			return;
		}

		try {
			// append icon and email to FormData
			const fd = new FormData();
			fd.append("icon", icon);
			fd.append("email", email);

			// send formData to API (http://localhost:5000/api/upload-icon)
			const res = await app.post("upload-icon", fd);

			// reset and set API response to state (message and remoteicon come from API)
			this.setState(
				{
					...initialState,
					message: res.data.message,
					remoteicon: res.data.remoteicon,
				},
				() => (this.iconInput.value = null),
			);
		} catch (err) {
			this.setState({ err: err.toString(), message: "" });
		}
	};

	render() {
		const {
			email,
			err,
			icon,
			message,
			name,
			preview,
			remoteicon,
			size,
		} = this.state;

		return (
			<form
				css="margin: 0 auto; width: 500px;text-align: center;"
				onSubmit={this.handleSubmit}
			>
				<h1>Upload Icon</h1>
				{!icon ? (
					<input
						css="margin: 0 auto;width: 176px;"
						type="file"
						accept="image/*"
						ref={node => (this.iconInput = node)}
						onChange={this.handleImage}
					/>
				) : (
					<>
						<img css="max-width: 200px;" src={preview} alt="icon.png" />
						<p css="margin: 0; padding: 0;">
							({name} - {(size / 1024000).toFixed(2)}MB)
						</p>
					</>
				)}
				<br />
				<input
					type="text"
					placeholder="Insert email address..."
					value={email}
					onChange={this.handleInput}
				/>
				<br />
				<br />
				<button type="button" onClick={this.handleReset}>
					Reset
				</button>
				<button type="submit">Submit</button>
				{err && <p css="color: red;">{err}</p>}
				{message && <p css="color: green;">{message}</p>}
				{remoteicon && (
					<>
						<h1>Remote Icon:</h1>
						<img
							css="max-width: 200px;"
							src={`${baseURL}/${remoteicon}`}
							alt="remote.icon.png"
						/>
					</>
				)}
			</form>
		);
	}
}

export default UploadForm;
