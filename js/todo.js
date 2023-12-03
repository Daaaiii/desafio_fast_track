const btnLogout = document.getElementById("logout");
const btnTask = document.getElementById("task-btn");

function addZero(num) {
	return num < 10 ? "0" + num : num;
}

window.onload = function () {
	setInterval(() => {
		const time = document.getElementById("time");
		let hours = new Date();
		let now = addZero(hours.getHours()) + ":" + addZero(hours.getMinutes());
		time.innerText = now;
	}, 1000);

	const day = document.getElementById("today");
	let data = new Date();

	let today =
		addZero(data.getDate()) +
		"/" +
		addZero(data.getMonth() + 1) +
		"/" +
		data.getFullYear();
	day.innerText = today;
};

const logout = () => {
	btnLogout.addEventListener("click", function (event) {
		event.preventDefault();
		window.location.href = "index.html";
	});
};
logout();

const checkInputs = () => {
	const inputIds = [
		"task",
		"init",
		"hourInit",
		"end",
		"hourEnd",
		"description",
	];

	for (const inputId of inputIds) {
		const inputValue = document.getElementById(inputId).value.trim();

		if (inputValue === "") {
			return false;
		}
	}
	return true;
};

const createTask = () => {
	btnTask.addEventListener("click", (event) => {
		event.preventDefault();

		const form = document.querySelector(".needs-validation");

		if (!form.checkValidity()) {
			form.classList.add("was-validated");
			return;
		}

		const taskName = document.getElementById("task").value;
		const initDate = document.getElementById("init").value;
		const initTime = document.getElementById("hourInit").value;
		const endDate = document.getElementById("end").value;
		const endTime = document.getElementById("hourEnd").value;
		const description = document.getElementById("description").value;
		const taskId = new Date().getTime().toString();
		let existingTasks = [];
		const existingTasksJSON = localStorage.getItem("taskData");

		if (existingTasksJSON) {
			try {
				existingTasks = JSON.parse(existingTasksJSON);
			} catch (error) {
				console.error("Erro ao analisar tarefas existentes:", error);
			}
		}
		const task = {
			id: taskId,
			taskName: taskName,
			initDate: initDate,
			initTime: initTime,
			endDate: endDate,
			endTime: endTime,
			description: description,
		};

		const taskJSON = JSON.stringify(task);
        console.log('taskjson',taskJSON)
        console.log('existingTasks',existingTasks)
        existingTasks.push(taskJSON);

		localStorage.setItem("taskData", existingTasks);

		const successAlert = document.createElement("div");
		successAlert.className = "alert alert-success mt-3";
		successAlert.textContent = "Tarefa criada e salva com sucesso!";

		document.getElementById("alert").appendChild(successAlert);

		setTimeout(() => {
			successAlert.remove();
		}, 2000);
	});
};

createTask();
