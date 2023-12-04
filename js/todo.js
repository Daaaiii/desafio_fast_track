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

	const user = JSON.parse(localStorage.getItem("LoggedUser"));

	const userName = document.getElementById("userName");
	userName.innerText = user[0].name;
	displayTasks();
	detailTask();
	changeTasks();
};

const logout = () => {
	btnLogout.addEventListener("click", function (event) {
		localStorage.removeItem('LoggedUser')
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
	btnTask.addEventListener("click", () => {
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
		const loggedUser = JSON.parse(localStorage.getItem("LoggedUser"));
		const users = JSON.parse(localStorage.getItem("users"));

		const currentUserIndex = users.findIndex((user) => {
			return user.email === loggedUser[0].email;
		});

		if (currentUserIndex !== -1) {
			const taskId = new Date().getTime().toString();
			const status = checkStatus({
                initDate: initDate,
                initTime: initTime,
                endDate: endDate,
                endTime: endTime
            });
			const task = {
				id: taskId,
				taskName: taskName,
				initDate: initDate,
				initTime: initTime,
				endDate: endDate,
				endTime: endTime,
				description: description,
				status: status,
			};

			users[currentUserIndex].tasks.push(task);

			localStorage.setItem("users", JSON.stringify(users));

			const successAlert = document.createElement("div");
			successAlert.className = "alert alert-success mt-3";
			successAlert.textContent = "Tarefa criada e salva com sucesso!";

			document.getElementById("alert").appendChild(successAlert);
		}
		setTimeout(() => {
			successAlert.remove();
		}, 8000);
	});
};

createTask();

const displayTasks = () => {
	const taskContainer = document.getElementById("taskContainer");

	const user = JSON.parse(localStorage.getItem("users"));
	const loggedUser = JSON.parse(localStorage.getItem("LoggedUser"));
	const users = JSON.parse(localStorage.getItem("users"));

	const currentUserIndex = users.findIndex((user) => {
		return user.email === loggedUser[0].email;
	});

	const userTasks = user[currentUserIndex].tasks;

	for (let i = 0; i < userTasks.length; i++) {
		const row = document.createElement("tr");
		const taskId = userTasks[i].id;
		row.setAttribute("data-task-id", taskId);

		const taskCell = document.createElement("td");
		taskCell.innerText = userTasks[i].taskName;
		taskCell.id = "taskID";
		taskCell.setAttribute("data-task-id", taskId);
		row.appendChild(taskCell);

		const startCell = document.createElement("td");
		startCell.innerText = formatDateTime(
			userTasks[i].initDate,
			userTasks[i].initTime
		);
		row.appendChild(startCell);

		const endCell = document.createElement("td");
		endCell.innerText = formatDateTime(
			userTasks[i].endDate,
			userTasks[i].endTime
		);
		row.appendChild(endCell);

		const statusCell = document.createElement("td");
		statusCell.innerText = userTasks[i].status;
		row.appendChild(statusCell);

		const changeCell = document.createElement("td");
		const changeButton = document.createElement("button");
		changeButton.className = "btn bg-warning";
		changeButton.id = "btn-change";
		changeButton.dataset.toggle = "modal";
		changeButton.dataset.target = "#changeTaskModal";
		changeButton.setAttribute("data-task-id", taskId);
		changeButton.innerText = "Alterar";
		changeCell.appendChild(changeButton);
		row.appendChild(changeCell);

		taskContainer.appendChild(row);
	}
};

const checkStatus = (task) => {
	const currentDate = new Date();

	const initDateTime = new Date(`${task.initDate} ${task.initTime}`);
	const endDateTime = new Date(`${task.endDate} ${task.endTime}`);

	if (currentDate < initDateTime) {
		return "Pendente";
	} else if (currentDate >= initDateTime && currentDate <= endDateTime) {
		return "Em andamento";
	} else {
		return "Em Atraso";
	}
};

const formatDateTime = (date, time) => {
	const formattedDate = new Date(date).toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});

	const formattedTime = time;

	return `${formattedDate} às ${formattedTime}`;
};

const detailTask = () => {
	const taskRows = document.querySelectorAll("#taskContainer tr");
	const taskTitle = document.getElementById("taskDetailModalLabel");
	const users = JSON.parse(localStorage.getItem("users"));
	const loggedUser = JSON.parse(localStorage.getItem("LoggedUser"));
	const user = users.filter((user) => user.email === loggedUser[0].email);

	const userTasks = user[0].tasks;

	const modal = new bootstrap.Modal(document.getElementById("taskDetailModal"));

	taskRows.forEach((row) => {
		const taskNameCell = row.querySelector("td:first-child");
		taskNameCell.addEventListener("click", () => {
			const taskId = row.getAttribute("data-task-id");
			const task = userTasks.find((t) => t.id === taskId);
			taskTitle.innerText = task.taskName;

			const modalBody = document.querySelector(".modal-body");

			modalBody.innerHTML = `
			<p>Início: ${task.initDate} às ${task.initTime}</p>
			<p>Término: ${task.endDate} às ${task.endTime}</p>
			<p>Descrição: ${task.description}</p>
            `;

			modal.show();
		});
	});
	const closeModalBtn = document.getElementById("closeModalBtn");
	closeModalBtn.addEventListener("click", () => {
		modal.hide();
	});
};

const changeTasks = () => {
	const changeBtns = document.querySelectorAll("#btn-change");
	const modal = new bootstrap.Modal(document.getElementById("changeTaskModal"));
	const users = JSON.parse(localStorage.getItem("users"));
	const loggedUser = JSON.parse(localStorage.getItem("LoggedUser"));
	const user = users.filter((user) => user.email === loggedUser[0].email);
	const currentUserIndex = users.findIndex(
		(u) => u.email === loggedUser[0].email
	);

	const tasks = user[0].tasks;

	const taskTitle = document.getElementById("task-modal");
	const initDate = document.getElementById("init-modal");
	const hourInit = document.getElementById("hourInit-modal");
	const endDate = document.getElementById("end-modal");
	const hourEnd = document.getElementById("hourEnd-modal");
	const description = document.getElementById("description-modal");

	const changeTaskBtn = document.getElementById("change-task-modal");
	const deleteTaskBtn = document.getElementById("delete-task");
	const doneTaskBtn = document.getElementById("done-task");
	const cancelTaskBtn = document.getElementById("cancel-task");



	changeBtns.forEach((changeBtn) => {
		changeBtn.addEventListener("click", () => {
			
			const taskId = changeBtn.getAttribute("data-task-id");	
			const task = tasks.find((t) => t.id === taskId);
			if(task.status !== 'Realizada'){
				doneTaskBtn.innerText = 'Marcar como realizada'
			}else{
				doneTaskBtn.innerText = 'Marcar como não realizada'
			}		

			taskTitle.value = task.taskName;
			initDate.value = task.initDate;
			hourInit.value = task.initTime;
			endDate.value = task.endDate;
			hourEnd.value = task.endTime;
			description.value = task.description;

			modal.show();

			changeTaskBtn.addEventListener("click", () => {				
				const updatedTask = tasks.find((task) => task.id === taskId);
				updatedTask.taskName = taskTitle.value;
				updatedTask.value = initDate.value;
				updatedTask.initTime = hourInit.value;
				updatedTask.value = endDate.value;
				updatedTask.endTime = hourEnd.value;
				updatedTask.description = description.value;

				users[currentUserIndex].tasks = tasks;

				localStorage.setItem("users", JSON.stringify(users));
				modal.hide();
			});

			deleteTaskBtn.addEventListener("click", () => {
				const taskIndex = tasks.findIndex((t) => t.id === taskId);

				if (taskIndex !== -1) {
					tasks.splice(taskIndex, 1);

					users[currentUserIndex].tasks = tasks;
					localStorage.setItem("users", JSON.stringify(users));

					modal.hide();
				}
			});

			doneTaskBtn.addEventListener("click", (e) => {
				
				const task = tasks.find((t) => t.id === taskId);
				const taskIndex = tasks.findIndex((t) => t.id === taskId);

			if(task.status !== 'Realizada'){
				doneTaskBtn.innerText = 'Marcar como realizada'
				tasks[taskIndex].status = "Realizada";

				users[currentUserIndex].tasks = tasks;
				localStorage.setItem("users", JSON.stringify(users));
				modal.hide();
			}else{
				doneTaskBtn.innerText = 'Marcar como não realizada'
				tasks[taskIndex].status = checkStatus(task);

				users[currentUserIndex].tasks = tasks;
				localStorage.setItem("users", JSON.stringify(users));
				modal.hide();
			}

				
			});

			cancelTaskBtn.addEventListener("click", () => {
				modal.hide();
			});
		});
	});
};
