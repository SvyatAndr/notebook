//*---Utils
const isBrowser = () => typeof window !== "undefined"

const generateId = () => {
	return Math.random().toString(16).slice(2);
}

//*---Local storage service
const addItemToLocalStorage = (item, key) => {
	let array = getLocalStorageState(key, [])
	array.push(item);
	saveLocalStorageState(key, array);
}

const removeItemFromLocalStorage = (item, key) => {
	let array = getLocalStorageState(key, []);
	let resultArray = array.filter((el) => el.id !== item.id)
	saveLocalStorageState(key, resultArray);
}

const updateItemFromLocalStorage = (item, key) => {
	let array = getLocalStorageState(key, []);
	const updatedItems = array.map(el => {
		if (el.id === item.id) {
			return item;
		}
		return el;
	});
	saveLocalStorageState(key, updatedItems);
}

const saveLocalStorageState = (key, value) => {
	if (!isBrowser()) {
		return;
	}
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (e) {
		console.log(e);
	}
}

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
}

//*---Notes management
const addItemToDom = (title, text, id) => {
	const el = createNote(title, text, id);
	notesEL.appendChild(el);
}

const addNewNote = (title, text) => {
	const id = generateId();
	addItemToDom(title, text, id);
	addItemToLocalStorage({ id: id, title: title, text: text }, "notes");
}

const fetchNotes = () => {
	const notes = getLocalStorageState("notes", []);
	notes.forEach((note) => {
		addItemToDom(note.title, note.text, note.id);
	})
}

const notesEL = document.querySelector('.column__body');
const addBtn = document.querySelector('.add__btn');

function createNote(title, text, id) {

	const noteEL = document.createElement('div');
	noteEL.classList.add('note');
	noteEL.setAttribute("id", id);
	noteEL.innerHTML = `
		<div class="note-header">
			<p id="note-title" >${title}</p>
			<textarea id="note-title-input" class="hidden" maxlength="50" placeholder="Ваш заголовок">${title}</textarea>
			<div class="note-btn">
				<button class="note-edit"><img src="img/edit.png"></button>
				<button class="note-delete"><img src="img/trash.png"></button>
			</div>
		</div>
		<p id="note-text">${text}</p>
		<textarea id="note-textarea" class="hidden" maxlength="2000" placeholder="Ваш текст..." >${text}</textarea>
	`;

	const editBtn = noteEL.querySelector('.note-edit');
	const deleteBtn = noteEL.querySelector('.note-delete');
	const titleEl = noteEL.querySelector('#note-title');
	const textEl = noteEL.querySelector('#note-text');
	const titleInputEL = noteEL.querySelector('#note-title-input');
	const textInputEL = noteEL.querySelector('#note-textarea');

	editBtn.addEventListener('click', (e) => {
		titleEl.classList.toggle('hidden');
		textEl.classList.toggle('hidden');
		titleInputEL.classList.toggle('hidden');
		textInputEL.classList.toggle('hidden');
	});

	deleteBtn.addEventListener('click', (e) => {
		removeItemFromLocalStorage({ id: id }, "notes");
		noteEL.remove();
	});

	titleInputEL.addEventListener('input', (e) => {
		titleEl.innerText = e.target.value;
		updateItemFromLocalStorage({ id: id, title: titleEl.innerHTML, text: textEl.innerHTML }, "notes")
	});

	textInputEL.addEventListener('input', (e) => {
		textEl.innerText = e.target.value;
		updateItemFromLocalStorage({ id: id, title: titleEl.innerHTML, text: textEl.innerHTML }, "notes")
	});

	return noteEL;
}

window.addEventListener('load', (e) => {
	fetchNotes();
});

addBtn.addEventListener('click', (e) => {
	addNewNote("Ваш заголовок", "Ваш текст...");
});