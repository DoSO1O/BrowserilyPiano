/* global Instruments */



const ques = {};

const piano = new Instruments.Instrument();
piano.on("initialized").then(piano => {
	window.addEventListener("keydown", event => {
		const noteInfo = Instruments.defaultMap[event.keyCode];

		if (!noteInfo) return;
		const note = new Instruments.Note(noteInfo[0], 5 + noteInfo[1]);

		if (!(note.toString() in ques)) {
			piano.play(note).then(uuids => ques[note.toString()] = uuids);
		}
	});

	window.addEventListener("keyup", event => {
		const noteInfo = Instruments.defaultMap[event.keyCode];

		if (!noteInfo) return;
		const note = new Instruments.Note(noteInfo[0], 5 + noteInfo[1]);

		if (note.toString() in ques) {
			const uuids = ques[note.toString()];

			Instruments.TIMER.requestCommand("Note.stop", [ ...ques[note.toString()], 0 ],
				noteInfo => noteInfo.instrumentId === uuids[0] && noteInfo.noteId === uuids[1]
			).then(noteInfo => {
				piano.stop(noteInfo.noteId);
				delete ques[note.toString()];
			});
		}
	});
});