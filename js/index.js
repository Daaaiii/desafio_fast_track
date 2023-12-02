const btnLogin = document.querySelector(".login");
const btnRegister = document.querySelector(".register");
const alerts = document.querySelectorAll("small");


const validateForm = (formId, fieldIds) => {
	const formElements = fieldIds.map(
		(id) => document.getElementById(`${formId}${id}`).value
	);

	if (formElements.some((element) => !element)) {
		showErrorMessage(alerts, formId);
		return false;
	} else {
		hideErrorMessage(alerts, formId);
		clearFields(fieldIds, formId);
		return true;
	}
};

const login = () => {
	btnLogin.addEventListener("click", function (event) {
		event.preventDefault();

		if (validateForm("login", ["Email", "Password"])) {
			
			// const user={
			// 	email,
			// 	password
			// }
			// localStorage.setItem("loggedUser", JSON.stringify(user));



			window.location.href = "todo.html";
		}
	});
};

login();

const register = () => {
	btnRegister.addEventListener("click", function (event) {
		event.preventDefault();

		validateForm("register", ["Name", "Email", "Password"]);
		// const name = document.getElementById("registerName").value;
		// console.log(name);

		// const user = {
		// 	name,
		// 	email,
		// 	password,
		// };
		// localStorage.setItem("user", JSON.stringify(user));
	});
};

register();

const showErrorMessage = (inputs, form) => {
	inputs.forEach((input) => {
		const errorMessageAttribute = input.getAttribute("data-error-message");

		const smallElement = document.querySelector(
			`.error-message[data-error-message="${errorMessageAttribute}"][data-form="${form}"]`
		);
		if (smallElement) {
			smallElement.innerText = errorMessageAttribute;
			smallElement.classList.remove("d-none");
		}
	});
};

const hideErrorMessage = (inputs, form) => {
	inputs.forEach((input) => {
		const errorMessageAttribute = input.getAttribute("data-error-message");
		const smallElement = document.querySelector(
			`.error-message[data-error-message="${errorMessageAttribute}"][data-form="${form}"]`
		);
		if (smallElement) {
			smallElement.classList.add("d-none");
		}
	});
};

const clearFields = (fieldIds, form) => {
	fieldIds.forEach((id) => {
		document.getElementById(`${form}${id}`).value = "";
	});
};
