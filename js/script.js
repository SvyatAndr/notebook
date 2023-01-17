const notesEL = document.querySelector('.column__body');
const addBtn = document.querySelector('.add__btn');

function createCart(title, text) {
	const noteEL = document.createElement('div');
	noteEL.classList.add('note');
	noteEL.innerHTML = `
		<div class="note-header">
			<p id="note-title">${title}</p>
			<textarea id="note-title-input" class="hidden">${title}</textarea>
			<div class="note-btn">
				<button class="note-edit">EDIT</button>
				<button class="note-delete">DELETE</button>
			</div>
		</div>
		<p id="note-text">${text}</p>
		<textarea id="note-textarea" class="hidden">${text}</textarea>
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
		noteEL.remove();
	});

	titleInputEL.addEventListener('input', (e) => {
		titleEl.innerText = e.target.value;
	});

	textInputEL.addEventListener('input', (e) => {
		textEl.innerText = e.target.value;
	});

	return noteEL;
}

addBtn.addEventListener('click', (e) => {
	const el = createCart("TITLE", "Text");
	notesEL.appendChild(el);
});
