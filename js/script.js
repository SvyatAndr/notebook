//*---Utils
const isBrowser = () => typeof window !== "undefined";

const generateId = () => {
	return Math.random().toString(16).slice(2);
};

//*---Local storage service
const addItemToLocalStorage = (item, key) => {
	let array = getLocalStorageState(key, []);
	array.push(item);
	saveLocalStorageState(key, array);
};

const removeItemFromLocalStorage = (item, key) => {
	let array = getLocalStorageState(key, []);
	let resultArray = array.filter((el) => el.id !== item.id);
	saveLocalStorageState(key, resultArray);
};

const updateItemFromLocalStorage = (item, key) => {
	let array = getLocalStorageState(key, []);
	const updatedItems = array.map(el => {
		if (el.id === item.id) {
			return item;
		}
		return el;
	});
	saveLocalStorageState(key, updatedItems);
};

const saveLocalStorageState = (key, value) => {
	if (!isBrowser()) {
		return;
	}
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (e) {
		console.log(e);
	}
};

const getLocalStorageState = (key, defaultValue) => {
	if (!isBrowser()) {
		return defaultValue;
	}
	try {
		const data = localStorage.getItem(key);
		if (data) {
			try {
				return JSON.parse(data);
			} catch (e) {
				console.log(e);
			}
		}
		return defaultValue;
	} catch (e) {
		console.log(e);
	}
	return defaultValue;
};

//*---Notes management
const addItemToDom = (title, text, id, dateNote) => {
	const el = createNote(title, text, id, dateNote);
	notesEL.appendChild(el);
};

const addNewNote = (title, text, dateNote) => {
	const id = generateId();
	addItemToDom(title, text, id, dateNote);
	addItemToLocalStorage({ id: id, title: title, text: text, dateNote: dateNote }, "notes");
};

const fetchNotes = () => {
	const notes = getLocalStorageState("notes", []);
	notes.forEach((note) => {
		addItemToDom(note.title, note.text, note.id, note.dateNote);
	});
};

const conteiner = document.querySelector('.container');
const notesEL = document.querySelector('.column__body');
const addBtn = document.querySelector('.add__btn');

// Фунція створення нотатки
function createNote(title, text, id, dateNote) {
	const noteEL = document.createElement('div');
	noteEL.classList.add('note');
	noteEL.setAttribute("id", id);
	noteEL.innerHTML = `
		<div>
			<div class="note-header">
				<p id="note-title" >${title}</p>
				<div class="note-btn" id="opacity" >
					<button id="opacity" class="note-edit"><img src="img/edit.png"></button>
					<button id="opacity" class="note-delete"><img src="img/trash.png"></button>
				</div>
			</div>
			<p id="note-text">${text}</p>
		</div>
		
		<div class = "date-box">
			<p class="note-date">${dateNote}</p>
		</div>
	`;

	const elem = noteEL.querySelector('#opacity');
	noteEL.onmouseover = function () {
		elem.style.display = "flex";
	};
	noteEL.onmouseleave = function () {
		elem.style.display = "none";
	};

	const editBtn = noteEL.querySelector('.note-edit');
	const deleteBtn = noteEL.querySelector('.note-delete');
	// const titleEl = noteEL.querySelector('#note-title');
	// const textEl = noteEL.querySelector('#note-text');
	// const titleInputEL = noteEL.querySelector('#note-title-input');
	// const textInputEL = noteEL.querySelector('#note-textarea');

	editBtn.addEventListener('click', (e) => {
		// titleEl.classList.toggle('hidden');
		// textEl.classList.toggle('hidden');
		// titleInputEL.classList.toggle('hidden');
		// textInputEL.classList.toggle('hidden');
		const el = editWindow(title, text, id, noteEL);
		conteiner.appendChild(el);
	});

	deleteBtn.addEventListener('click', (e) => {
		const el = deleteNoteWindow(title, text, id, noteEL);
		conteiner.appendChild(el);
	});

	// titleInputEL.addEventListener('input', (e) => {
	// 	titleEl.innerText = e.target.value;
	// 	updateItemFromLocalStorage({ id: id, title: titleEl.innerHTML, text: textEl.innerHTML }, "notes");
	// });

	// textInputEL.addEventListener('input', (e) => {
	// 	textEl.innerText = e.target.value;
	// 	updateItemFromLocalStorage({ id: id, title: titleEl.innerHTML, text: textEl.innerHTML }, "notes");
	// });


	return noteEL;
}

//Генарація дати
function fDate() {
	const nowDate = new Date();
	const month = ['Січеня', 'Лютого', 'Березеня',
		'Квітеня', 'Травеня', 'Червеня',
		'Липеня', 'Серпеня', 'Вересеня',
		'Жовтеня', 'Листопада', 'Груденя'];
	const strDate = `${nowDate.getDate()} ${month[nowDate.getMonth()]} ${nowDate.getHours()}:${nowDate.getMinutes()}`;
	console.log(strDate);

	return strDate;
}

// Вікно підтвердження видалення
function deleteNoteWindow(title, text, id, noteEL) {
	const delWinEL = document.createElement('div');
	delWinEL.classList.add('window-box');
	delWinEL.innerHTML = `
	<div class = "messga-box">
		<div class="del-win">
			<p>Ви дійсно хочете видалити нотатку?</p>
			<div class="del-win-btn">
				<button class = "yesBtn">ТАК</button>
				<button class = "dontdelBtn">ВІДМІНИТИ</button>
			</div>
		</div>
	</div>
`;

	const yesBtn = delWinEL.querySelector('.yesBtn');
	const dontdelBtn = delWinEL.querySelector('.dontdelBtn');
	const editWinEL = document.querySelector('.window-box');

	yesBtn.addEventListener('click', (e) => {
		removeItemFromLocalStorage({ id: id }, "notes");
		noteEL.remove();
		delWinEL.remove();
		if (editWinEL != null) {
			editWinEL.remove();
		}
	});

	dontdelBtn.addEventListener('click', (e) => {
		delWinEL.remove();
	});

	return delWinEL;
}

// Вікно редагування нотатки
function editWindow(title, text, id, noteEL) {
	const editWinEL = document.createElement('div');
	editWinEL.classList.add('window-box');
	editWinEL.innerHTML = `
	<div class="note-edit-window">
		<div class="win-note-header">
			<div class="div-btn">
				<button id="opacity" class="win-note-exit"><img src="img/arrow-left.png"></button>
				<div class="win-note-btn" id="opacity" >
					<button id="opacity" class="win-note-skin"><img src="img/skin.png"></button>
					<button id="opacity" class="win-note-save"><img src="img/save.png"></button>
					<button id="opacity" class="win-note-delete"><img src="img/trash.png"></button>
				</div>
			</div>
			<textarea id="win-note-title-input"  maxlength="50" placeholder="Ваш заголовок">${title}</textarea>
		</div>

	<textarea id="win-note-textarea"  maxlength="2000" placeholder="Ваш текст..." >${text}</textarea>
	</div>
`;

	const noteEditWin = editWinEL.querySelector('.note-edit-window');
	const exitBtn = editWinEL.querySelector('.win-note-exit');
	const delNote = editWinEL.querySelector('.win-note-delete');
	const saveBtn = editWinEL.querySelector('.win-note-save');
	const skinBtn = editWinEL.querySelector('.win-note-skin');
	const titleInputEL = editWinEL.querySelector('#win-note-title-input');
	const textInputEL = editWinEL.querySelector('#win-note-textarea');
	const titleEl = noteEL.querySelector('#note-title');
	const textEl = noteEL.querySelector('#note-text');

	exitBtn.addEventListener('click', (e) => {
		editWinEL.remove();
	});

	skinBtn.addEventListener('click', (e) => {
		noteEditWin.style.backgroundColor = "lightblue";
		noteEditWin.style.border = "2px solid rgb(140 140 255)";
		noteEL.style.backgroundColor = "lightblue";
		noteEL.style.border = "2px solid rgb(140 140 255)";
	});

	saveBtn.addEventListener('click', (e) => {
		editWinEL.remove();
	});

	delNote.addEventListener('click', (e) => {
		const el = deleteNoteWindow(title, text, id, noteEL);
		conteiner.appendChild(el);
	});


	titleInputEL.addEventListener('input', (e) => {
		titleEl.innerText = e.target.value;
		updateItemFromLocalStorage({ id: id, title: titleEl.innerHTML, text: textEl.innerHTML }, "notes");
	});

	textInputEL.addEventListener('input', (e) => {
		textEl.innerText = e.target.value;
		updateItemFromLocalStorage({ id: id, title: titleEl.innerHTML, text: textEl.innerHTML }, "notes");
	});

	return editWinEL;
}

//Пошук
function fSearch() {
	const myInput = document.getElementById('myInput');
	const filter = myInput.value.toUpperCase();

	const noteElement = notesEL.querySelectorAll('.note');
	const qwer = notesEL.querySelectorAll('.note-header');

	for (let i = 0; i < qwer.length; i++) {
		const noteTitle = qwer[i].getElementsByTagName('p')[0];
		if (noteTitle.innerHTML.toUpperCase().indexOf(filter) > -1) {
			noteElement[i].style.display = "";
		} else {
			noteElement[i].style.display = "none";
		}
	}
}

window.addEventListener('load', (e) => {
	fetchNotes();
});

addBtn.addEventListener('click', (e) => {
	addNewNote("", "", fDate());
});