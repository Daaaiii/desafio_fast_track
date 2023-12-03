const btnLogin = document.querySelector(".login");
const btnRegister = document.querySelector(".register");
const alerts = document.querySelectorAll("small");

const validateForm = (formId) => {
	const form = document.getElementById(formId);

	if (!form.checkValidity()) {
		form.classList.add("was-validated");
		return false;
	}

	return true;
};

const clearFields = (fieldIds, form) => {
	fieldIds.forEach((id) => {
		const element = document.getElementById(`${form}${id}`);
		if (element) {
			element.value = "";
		} else {
			console.error(`Element with ${form}${id} not found.`);
		}
	});
};
const checkUser = (email, password) => {
	const users = JSON.parse(localStorage.getItem("users"));
	const foundUser = users.filter(
		(user) => user.email === email && user.password === password
	);
	if (foundUser.length === 0) {
		const email = document.getElementsByClassName("no-auth")[0];
		const password = document.getElementsByClassName("no-auth")[1];
		email.innerHTML = "Email inválido";
		password.innerHTML = "Senha inválida";

		return false;
	}

	localStorage.setItem("LoggedUser", JSON.stringify(foundUser));
	return true;
};

const login = () => {
	btnLogin.addEventListener("click", function (event) {
		event.preventDefault();
		const email = document.getElementById("loginEmail").value;
		const password = document.getElementById("loginPassword").value;

		if (validateForm("login")) {
			if (checkUser(email, password)) {
				clearFields(["Email", "Password"], "login");
				window.location.href = "todo.html";
			}
		}
	});
};

login();

const register = () => {
	btnRegister.addEventListener("click", function (event) {
		event.preventDefault();

		if (validateForm("register")) {
			const name = document.getElementById("registerName").value;
			const email = document.getElementById("registerEmail").value;
			const password = document.getElementById("registerPassword").value;
			let users = JSON.parse(localStorage.getItem("users")) || [];
			const user = {
				name: name,
				email: email,
				password: password,
				tasks:[]
			};
			users.push(user);

			localStorage.setItem("users", JSON.stringify(users));
			localStorage.setItem('LoggedUser',JSON.stringify(user))

			clearFields(["Name", "Email", "Password"], "register");
			window.location.href = "todo.html";
		}
	});
};

register();
