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
const addItemToDom = (title, text, id, dateNote, colorSkin) => {
	const el = createNote(title, text, id, dateNote, colorSkin);
	notesEL.appendChild(el);
	return el;
};

const addNewNote = (title, text, dateNote, colorSkin) => {
	const id = generateId();
	const noteEL = addItemToDom(title, text, id, dateNote);
	addItemToLocalStorage({ id: id, title: title, text: text, dateNote: dateNote, colorSkin: colorSkin }, "notes");
	const el = editWindow(title, text, id, noteEL, dateNote);
	conteiner.appendChild(el);
};

const fetchNotes = () => {
	const notes = getLocalStorageState("notes", []);
	notes.forEach((note) => {
		addItemToDom(note.title, note.text, note.id, note.dateNote, note.colorSkin);
	});
};

const conteiner = document.querySelector('.container');
const notesEL = document.querySelector('.column__body');
const addBtn = document.querySelector('.add__btn');

// Note creation feature
function createNote(title, text, id, dateNote, colorSkin) {
	const noteEL = document.createElement('div');
	noteEL.classList.add('note');
	noteEL.setAttribute("id", id);
	noteEL.setAttribute("style", `transform: translate(0px, 0px);`);
	noteEL.innerHTML = `
	<div class="note-data" style="background-color: ${colorSkin};">
		<div>
			<div class="note-header">
				<pre id="note-title" >${title}</pre>
				<div class="note-btn" id="opacity" >
					<button id="opacity" class="note-edit"><img src="img/edit.png"></button>
					<button id="opacity" class="note-delete"><img src="img/trash.png"></button>
				</div>
			</div>
			<div class="note-text-el">
				<pre id="note-text">${text}</pre>
			</div>
		</div>
		
		<div class = "date-box">
			<p class="note-date">${dateNote}</p>
		</div>
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
		const el = editWindow(title, text, id, noteEL, dateNote, colorSkin);
		conteiner.appendChild(el);
	});

	deleteBtn.addEventListener('click', (e) => {
		const el = deleteNoteWindow(title, text, id, noteEL);
		conteiner.appendChild(el);
	});

	titleEl.addEventListener('click', (e) => {
		const el = editWindow(title, text, id, noteEL, dateNote, colorSkin);
		conteiner.appendChild(el);
	});
	textEl.addEventListener('click', (e) => {
		const el = editWindow(title, text, id, noteEL, dateNote, colorSkin);
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
	const editWinEL = document.querySelector('.window-box2');

	yesBtn.addEventListener('click', (e) => {
		removeItemFromLocalStorage({ id: id }, "notes");
		noteEL.remove();
		location.reload();
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
function editWindow(title, text, id, noteEL, dateNote, colorSkin) {
	const editWinEL = document.createElement('div');
	editWinEL.classList.add('window-box2');
	editWinEL.innerHTML = `
	<div class="note-edit-window" style="background-color:${colorSkin};">
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
			<p class="note-date" style="display: none;">${fDate()}</p>
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
		const chekTitleEdit = titleInputEL.value.length;
		const chekTextEdit = textInputEL.value.length;
		if (chekTextEdit == 0 && chekTitleEdit == 0) {
			removeItemFromLocalStorage({ id: id }, "notes");
			noteEL.remove();
			location.reload();
			delWinEL.remove();
			if (editWinEL != null) {
				editWinEL.remove();
			}
		}
		editWinEL.remove();
		location.reload();
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

		// const list = textEl.innerText.slice(' ');

		// const text = list.map(value => {
		// 	if (value.indexOf('http') !== -1) {
		// 		return `'<a href="${value}">${value}</a>'`
		// 	}

		// 	if (/g/.test(value)) {
		// 		return `'<a href="${value}">${value}</a>'`
		// 	}

		// 	if (/g/.test(value)) {
		// 		return `'<a href="${value}">${value}</a>'`
		// 	}

		// 	return value
		// }).join(' ');

		updateItemFromLocalStorage({ id: id, title: e.target.value, text: textEl.innerText, dateNote: dateP.innerText, colorSkin: colorSkin }, "notes");
	});

	textInputEL.addEventListener('input', (e) => {
		textEl.innerText = e.target.value;
		updateItemFromLocalStorage({ id: id, title: titleEl.innerText, text: e.target.value, dateNote: dateP.innerText, colorSkin: colorSkin }, "notes");
	});

	dateP.addEventListener('input', (e) => {
		dateEL.innerText = e.target.value;
		updateItemFromLocalStorage({ id: id, title: titleEl.innerText, text: textEl.innerHTML, dateNote: e.target.value, colorSkin: colorSkin }, "notes");
	});


	// Reskin selection window
	function choicSkinWindow() {
		const skinWin = document.createElement('div');
		skinWin.classList.add('window-box');
		skinWin.innerHTML = `
		<div class="messga-box">
			<div class="skin-win">
				<p>Виберіть колір нотатки</p>
				<div class="skin-win-btn">
					<button class="yellow"><img class="img-note-skin" src="img/align-left.png"></button>
					<button class="blue"><img class="img-note-skin" src="img/align-left.png"></button>
					<button class="green"><img class="img-note-skin" src="img/align-left.png"></button>
					<button class="pink"><img class="img-note-skin" src="img/align-left.png"></button>
				</div>
				<div class="skin-dont-btn">
					<button class="btn-standart">СКИНУТИ</button>
					<button class="btn-dont">ВІДМІНИТИ</button>
				</div>
			</div>
		</div>
	`;

		const noteEditWin = document.querySelector('.note-edit-window');

		let bgColor = "";

		const yellowBtn = skinWin.querySelector('.yellow');
		yellowBtn.addEventListener('click', (e) => {
			noteEditWin.style.backgroundColor = "rgb(255 247 198)";
			bgColor = "rgb(255 247 198)";
			updateItemFromLocalStorage({ id: id, title: titleEl.innerText, text: textEl.innerText, dateNote: dateP.innerText, colorSkin: bgColor }, "notes");
			skinWin.remove();
		});

		const blueBtn = skinWin.querySelector('.blue');
		blueBtn.addEventListener('click', (e) => {
			noteEditWin.style.backgroundColor = "rgb(208 243 255)";
			bgColor = "rgb(208 243 255)";
			updateItemFromLocalStorage({ id: id, title: titleEl.innerText, text: textEl.innerText, dateNote: dateP.innerText, colorSkin: bgColor }, "notes");
			skinWin.remove();
		});

		const greenBtn = skinWin.querySelector('.green');
		greenBtn.addEventListener('click', (e) => {
			noteEditWin.style.backgroundColor = "rgb(200 255 200)";
			bgColor = "rgb(200 255 200)";
			updateItemFromLocalStorage({ id: id, title: titleEl.innerText, text: textEl.innerText, dateNote: dateP.innerText, colorSkin: bgColor }, "notes");
			skinWin.remove();
		});

		const pinkBtn = skinWin.querySelector('.pink');
		pinkBtn.addEventListener('click', (e) => {
			noteEditWin.style.backgroundColor = "rgb(255 222 227)";
			bgColor = "rgb(255 222 227)";
			updateItemFromLocalStorage({ id: id, title: titleEl.innerText, text: textEl.innerText, dateNote: dateP.innerText, colorSkin: bgColor }, "notes");
			skinWin.remove();
		});

		const standartBtn = skinWin.querySelector('.btn-standart');
		standartBtn.addEventListener('click', (e) => {
			noteEditWin.style.backgroundColor = "";
			bgColor = "";
			updateItemFromLocalStorage({ id: id, title: titleEl.innerText, text: textEl.innerText, dateNote: dateP.innerText, colorSkin: bgColor }, "notes");
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

	return editWinEL;
}

// Search
function fSearch() {
	const myInput = document.getElementById('myInput');
	const filter = myInput.value.toUpperCase();

	const noteElement = notesEL.querySelectorAll('.note');
	const qwer = notesEL.querySelectorAll('.note-header');
	const textEL = notesEL.querySelectorAll('.note-text-el');

	for (let i = 0; i < qwer.length; i++) {
		const noteTitle = qwer[i].getElementsByTagName('pre')[0];
		const aTitle = noteTitle.innerHTML.toUpperCase().indexOf(filter);
		const noteText = textEL[i].getElementsByTagName('pre')[0];
		const bText = noteText.innerHTML.toUpperCase().indexOf(filter);

		if (aTitle > -1 || bText > -1) {
			noteElement[i].style.display = "";
		} else {
			noteElement[i].style.display = "none";
		}
	}

	// for (let i = 0; i < textEL.length; i++) {
	// 	const noteTitle = textEL[i].getElementsByTagName('pre')[0];
	// 	if (noteTitle.innerHTML.toUpperCase().indexOf(filter) > -1) {
	// 		noteElement[i].style.display = "";
	// 	} else {
	// 		noteElement[i].style.display = "none";
	// 	}
	// }
}


function firstMessga() {
	const firstMesg = document.createElement('div');
	firstMesg.classList.add('first-inf-block');
	firstMesg.innerHTML = `
		<p class="first-inf">ЩОБ СТОВРИТИ НОТАТКУ НАТИСНІТЬ <br> <br> <span class="add-btn">+</span></p>
	`;

	const addBtnTwo = firstMesg.querySelector('.add-btn');
	addBtnTwo.addEventListener('click', (e) => {
		addNewNote("", "", fDate(), ``);
	});

	return firstMesg;
}



addBtn.addEventListener('click', (e) => {
	addNewNote("", "", fDate(), ``);
});

fetchNotes();


function createFirstMessag() {
	const list = [];
	document.querySelectorAll('.note').forEach((value) => list.push(value));

	if (list.length < 1) {
		const firstEl = firstMessga();
		notesEL.appendChild(firstEl);
	}
}
createFirstMessag();


// const list = [];

// document.querySelectorAll('.note').forEach((value) => list.push(value.getBoundingClientRect()));

// console.log(list);