var gameLog = [];

var addButton = document.querySelector("#add_button");
var clearAllButton = document.querySelector("#del_all_button");

var loginButton = document.querySelector("#login_button");
var newUserButton = document.querySelector("#newuser_button");

//var gameTable = document.querySelector("#game_table");
var usernameInput = document.querySelector("#username_input");
var passwordInput = document.querySelector("#password_input");

var titleInput = document.querySelector("#title_input");
var genreInput = document.querySelector("#genre_input");
var consoleInput = document.querySelector("#console_input");
var ratingInput = document.querySelector("#rating_input");
var esrbInput = document.querySelector("#esrb_input");

var mainDiv = document.querySelector("#main_div");
var loginDiv = document.querySelector("#login_div");
var newUserDiv = document.querySelector("#new_user_div");

var deleteGame = function (id) {
	fetch(`https://kp-first-webapp.herokuapp.com/games/${id}`, {
		method: 'DELETE',
		credentials: 'include',
	}).then(function (response) {
		console.log("game deleted");
		getGames();
	});

};

var editGame = function(id, data) {
	fetch(`https://kp-first-webapp.herokuapp.com/games/${id}`, {
		method: 'PUT',
		credentials: 'include',
		body: data,
		headers: {
			"Content-type": "application/x-www-form-urlencoded"
		}
	}).then(function (response) {
		console.log("game updated");
		getGames();
	})
}

clearAllButton.onclick = function() {

	fetch("https://kp-first-webapp.herokuapp.com/games", {
		method: 'DELETE',
		credentials: 'include'}
	).then(function (response) {
		//load new data
		var gameList = document.querySelector("#game_table");
		getGames();
		console.log("games cleared");
	});
}

addButton.onclick = function() {
	var title = titleInput.value;
	var genre = genreInput.value;
	var console = consoleInput.value;
	var rating = ratingInput.value;
	var esrb = esrbInput.value;

	var data = "name=" + encodeURIComponent(title);
	data += "&genre=" + encodeURIComponent(genre);
	data += "&console=" + encodeURIComponent(console);
	data += "&rating=" + encodeURIComponent(rating);
	data += "&esrb=" + encodeURIComponent(esrb);

	clearInputBoxes();

	fetch("https://kp-first-webapp.herokuapp.com/games", {
		method: 'POST',
		credentials: 'include',
		body: data,
		headers: {
			"Content-type": "application/x-www-form-urlencoded"
		}
	}).then(function (response){
		getGames();
	})
}


function getGames() {
	fetch("https://kp-first-webapp.herokuapp.com/games", {
		credentials: 'include'
	}).then(function (response){
		if (response.status == 401) { //NOt logged in
			//TODO: show login/register forms
			mainDiv.style.display = "none";
			newUserDiv.style.display = "none";
			return;
		}
		if (response.status != 200) {
			//something weird happened, maybe show some kind of confused emoji/message or something
			return;
		}

		response.json().then(function(data){
			//TODO: show appropriate divs for data
			var loginDiv = document.querySelector("#login_div");
			var mainDiv = document.querySelector("#main_div");
			loginDiv.style.display = "none";
			mainDiv.style.display = "block";
			gameLog = data;
			clearTable();
			var tableRef = document.getElementById('game_table');
			data.forEach(function(game){
				fillTableRow(game);
			});
		});
	});
};

function clearTable(){
	var table = document.getElementById('game_table');;

	for (var i = table.rows.length - 1; i > 0; i--){
		table.deleteRow(i);
	}
}

function fillTableRow(game) {
	var tableRef = document.getElementById('game_table');
	var newRow = tableRef.insertRow(-1);

	var nameCell = newRow.insertCell(0);
	var nameText = document.createTextNode(game.name);
	nameCell.appendChild(nameText);

	var genreCell = newRow.insertCell(1);
	var genreText = document.createTextNode(game.genre);
	genreCell.appendChild(genreText);

	var consoleCell = newRow.insertCell(2);
	var consoleText = document.createTextNode(game.console);
	consoleCell.appendChild(consoleText);

	var ratingCell = newRow.insertCell(3);
	var ratingText = document.createTextNode(game.rating);
	ratingCell.appendChild(ratingText);

	var esrbCell = newRow.insertCell(4);
	var esrbText = document.createTextNode(game.esrb);
	esrbCell.appendChild(esrbText);

	var editCell = newRow.insertCell(5);
	var editButton = document.createElement("button");
	editButton.className = "reload_button";
	editButton.innerHTML = "Edit";
	editButton.onclick = function () {
		var mainDiv = document.getElementById("main_div");
		var editDiv = document.getElementById("edit_div");
		mainDiv.style.display = "none";
		editDiv.style.display = "inline-block";

		var editName = document.getElementById("edit_title");
		var editGenre = document.getElementById("edit_genre");
		var editConsole = document.getElementById("edit_console");
		var editRating = document.getElementById("edit_rating");
		var editEsrb = document.getElementById("edit_esrb");

		editName.value = game.name;
		editGenre.value = game.genre;
		editConsole.value = game.console;
		editRating.value = game.rating;
		editEsrb.value = game.esrb;

		var saveButton = document.getElementById("finish_edit_button");
		saveButton.onclick = function () {
			var title = editName.value;
			var genre = editGenre.value;
			var console = editConsole.value;
			var rating = editRating.value;
			var esrb = editEsrb.value;
			var id = game.id;

			var data = "name=" + encodeURIComponent(title);
			data += "&genre=" + encodeURIComponent(genre);
			data += "&console=" + encodeURIComponent(console);
			data += "&rating=" + encodeURIComponent(rating);
			data += "&esrb=" + encodeURIComponent(esrb);
			data += "&id=" + encodeURIComponent(id);

			editGame(id, data);
			mainDiv.style.display = "block";
			editDiv.style.display = "none";
			getGames();
		}

		var reloadButton = document.getElementById("reload_button");
		reloadButton.onclick = function() {
			editName.value = game.name;
			editGenre.value = game.genre;
			editConsole.value = game.console;
			editRating.value = game.rating;
			editEsrb.value = game.esrb;
		}

	}
	
	editCell.appendChild(editButton);

	var deleteCell = newRow.insertCell(6);
	var deleteButton = document.createElement("button");
	deleteButton.className = "clear";
	deleteButton.innerHTML = "Delete";
	deleteButton.onclick = function () {
		var proceed = confirm(`Do you want to delete ${game.name}?`);
		if (proceed){
			deleteGame(game.id);
			getGames();
		}
	}
	deleteCell.appendChild(deleteButton);
}

function clearInputBoxes() {
	titleInput.value = "";
	genreInput.value = "";
	consoleInput.value = "";
	ratingInput.value = "";
	esrbInput.value = "";
}

var addNewUser = function(firstname, lastname, username, password) {
	var data = "firstname=" + firstname;
	data += "&lastname=" + lastname;
	data += "&username=" + username;
	data += "&password=" + password;

	fetch("https://kp-first-webapp.herokuapp.com/users", {
		method: 'POST',
		credentials: 'include',
		body: data,
		headers: {
			"Content-type": "application/x-www-form-urlencoded"
		}
	}).then(function (response){
		if (response.status == 422) {
			newUserInvalid();
		}
		if (response.status == 201) {
			newUserOk();
		}
	})

}

newUserButton.onclick = function() {
	var loginDiv = document.querySelector("#login_div");
	var newUserDiv = document.querySelector("#new_user_div");
	loginDiv.style.display = "none";
	newUserDiv.style.display = "inline-block";

	var firstNameInput = document.querySelector("#first_name_input");
	var lastNameInput = document.querySelector("#last_name_input");
	var usernameInput = document.querySelector("#new_username_input");
	var passwordInput = document.querySelector("#new_password_input");

	var createUserButton = document.querySelector("#create_user_button");
	createUserButton.onclick = function () {
		var firstName = firstNameInput.value;
		var lastName = lastNameInput.value;
		var username = usernameInput.value;
		var password = passwordInput.value;
		addNewUser(firstName, lastName, username, password);
		firstNameInput.value = "";
		lastNameInput.value = "";
		usernameInput.value = "";
		passwordInput.value = "";
	}
}

loginButton.onclick = function() {
	var usernameInput = document.querySelector("#username_input");
	var passwordInput = document.querySelector("#password_input");
	var username = usernameInput.value;
	var password = passwordInput.value;

	var data = "username=" + username;
	data += "&password=" + password;

	fetch("https://kp-first-webapp.herokuapp.com/sessions", {
		method: 'POST',
		credentials: 'include',
		body: data,
		headers: {
			"Content-type": "application/x-www-form-urlencoded"
		}
	}).then(function (response){
		if (response.status == 201) {
			getGames();
		}
		if (response.status == 401) {
			window.alert("Incorrect username/password");
		}

	})
}

var newUserOk = function() {
	loginDiv.style.display = "flex";
	newUserDiv.style.display = "none";
	window.alert("Account successfully created");
}

var newUserInvalid = function()  {
	window.alert("There is already an account with that username. Please use a different one.");
}


getGames();
