const btnLogout = document.getElementById("logout");

function addZero(num) {
    return num < 10 ? "0" + num : num;
}

window.onload = function () {
    setInterval(() => {
        const time = document.getElementById("time");
        let hours = new Date();
        let now =
            addZero(hours.getHours()) +
            ":" +
            addZero(hours.getMinutes()) +
            ":" +
            addZero(hours.getSeconds());
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
        // localStorage.removeItem()
        window.location.href = "index.html";
    });
};
logout();
