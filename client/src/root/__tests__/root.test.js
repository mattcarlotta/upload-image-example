import App from "../index";

const wrapper = mount(<App />);

describe("Root", () => {
	it("renders without errors", () => {
		expect(wrapper.find("#home").exists()).toBeTruthy();
	});
});
