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

// Note creation feature
function createNote(title, text, id, dateNote) {
	const noteEL = document.createElement('div');
	noteEL.classList.add('note');
	noteEL.setAttribute("id", id);
	noteEL.innerHTML = `
		<div>
			<div class="note-header">
				<pre id="note-title" > ${title}</pre>
				<div class="note-btn" id="opacity" >
					<button id="opacity" class="note-edit"><img src="img/edit.png"></button>
					<button id="opacity" class="note-delete"><img src="img/trash.png"></button>
				</div>
			</div>
			<pre id="note-text">${text}</pre>
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
	const titleEl = noteEL.querySelector('#note-title');
	const textEl = noteEL.querySelector('#note-text');

	editBtn.addEventListener('click', (e) => {
		const el = editWindow(title, text, id, noteEL, dateNote);
		conteiner.appendChild(el);
	});

	deleteBtn.addEventListener('click', (e) => {
		const el = deleteNoteWindow(title, text, id, noteEL);
		conteiner.appendChild(el);
	});

	titleEl.addEventListener('click', (e) => {
		const el = editWindow(title, text, id, noteEL, dateNote);
		conteiner.appendChild(el);
	});
	textEl.addEventListener('click', (e) => {
		const el = editWindow(title, text, id, noteEL, dateNote);
		conteiner.appendChild(el);
	});


	return noteEL;
}

// Date generalization
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

// Deletion confirmation window
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

	delWinEL.addEventListener('click', (e) => {
		delWinEL.remove();
	});



	return delWinEL;
}

// Note editing window
function editWindow(title, text, id, noteEL) {
	const editWinEL = document.createElement('div');
	editWinEL.classList.add('window-box');
	editWinEL.innerHTML = `
	<div class="note-edit-window">
		<div class="note-content">
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

		<div class = "date-box">
			<p class="note-date">${fDate()}</p>
		</div>
	</div>
`;

	// const noteEditWin = editWinEL.querySelector('.note-edit-window');
	const exitBtn = editWinEL.querySelector('.win-note-exit');
	const delNote = editWinEL.querySelector('.win-note-delete');
	const saveBtn = editWinEL.querySelector('.win-note-save');
	const skinBtn = editWinEL.querySelector('.win-note-skin');
	const titleInputEL = editWinEL.querySelector('#win-note-title-input');
	const textInputEL = editWinEL.querySelector('#win-note-textarea');
	const dateP = editWinEL.querySelector('.note-date');
	const dateEL = noteEL.querySelector('.note-date');
	const titleEl = noteEL.querySelector('#note-title');
	const textEl = noteEL.querySelector('#note-text');

	exitBtn.addEventListener('click', (e) => {
		editWinEL.remove();
	});

	skinBtn.addEventListener('click', (e) => {
		const el = choicSkinWindow(noteEL);
		conteiner.appendChild(el);
	});

	saveBtn.addEventListener('click', (e) => {
		editWinEL.remove();
		location.reload();

	});

	delNote.addEventListener('click', (e) => {
		const el = deleteNoteWindow(title, text, id, noteEL);
		conteiner.appendChild(el);
	});


	titleInputEL.addEventListener('input', (e) => {
		titleEl.innerText = e.target.value;
		updateItemFromLocalStorage({ id: id, title: e.target.value, text: textEl.innerText, dateNote: dateP.innerText }, "notes");
	});

	textInputEL.addEventListener('input', (e) => {
		textEl.innerText = e.target.value;
		updateItemFromLocalStorage({ id: id, title: titleEl.innerText, text: e.target.value, dateNote: dateP.innerText }, "notes");
	});

	dateP.addEventListener('input', (e) => {
		dateEL.innerText = e.target.value;
		updateItemFromLocalStorage({ id: id, title: titleEl.innerText, text: textEl.innerHTML, dateNote: e.target.value }, "notes");
	});

	return editWinEL;
}

// Reskin selection window
function choicSkinWindow(noteEL) {
	const skinWin = document.createElement('div');
	skinWin.classList.add('window-box');
	skinWin.innerHTML = `
	<div class="messga-box">
		<div class="skin-win">
			<p>Виберіть колір нотатки</p>
			<div class="skin-win-btn">
				<button class="red"><img class="img-note-skin" src="img/align-left.png"></button>
				<button class="blue"><img class="img-note-skin" src="img/align-left.png"></button>
				<button class="green"><img class="img-note-skin" src="img/align-left.png"></button>
				<button class="pink"><img class="img-note-skin" src="img/align-left.png"></button>
			</div>
			<div class="skin-dont-btn">
				<button class="btn-dont">ВІДМІНИТИ</button>
			</div>
		</div>
	</div>
`;

	const noteEditWin = document.querySelector('.note-edit-window');

	const redBtn = skinWin.querySelector('.red');
	redBtn.addEventListener('click', (e) => {
		noteEditWin.style.backgroundColor = "lightcoral";
		noteEditWin.style.border = "2px solid rgb(173, 102, 102)";
		noteEL.style.backgroundColor = "lightcoral";
		noteEL.style.border = "2px solid rgb(173, 102, 102)";
		skinWin.remove();
	});

	const blueBtn = skinWin.querySelector('.blue');
	blueBtn.addEventListener('click', (e) => {
		noteEditWin.style.backgroundColor = "lightblue";
		noteEditWin.style.border = "2px solid rgb(140 140 255)";
		noteEL.style.backgroundColor = "lightblue";
		noteEL.style.border = "2px solid rgb(140 140 255)";
		skinWin.remove();
	});

	const greenBtn = skinWin.querySelector('.green');
	greenBtn.addEventListener('click', (e) => {
		noteEditWin.style.backgroundColor = "lightgreen";
		noteEditWin.style.border = "2px solid rgb(118, 167, 118)";
		noteEL.style.backgroundColor = "lightgreen";
		noteEL.style.border = "2px solid rgb(118, 167, 118)";
		skinWin.remove();
	});

	const pinkBtn = skinWin.querySelector('.pink');
	pinkBtn.addEventListener('click', (e) => {
		noteEditWin.style.backgroundColor = "lightpink";
		noteEditWin.style.border = "2px solid rgb(255, 156, 173)";
		noteEL.style.backgroundColor = "lightpink";
		noteEL.style.border = "2px solid rgb(255, 156, 173)";
		skinWin.remove();
	});

	const dontBtn = skinWin.querySelector('.btn-dont');
	dontBtn.addEventListener('click', (e) => {
		skinWin.remove();
	});

	skinWin.addEventListener('click', (e) => {
		skinWin.remove();
	});


	return skinWin;
}

// Search
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