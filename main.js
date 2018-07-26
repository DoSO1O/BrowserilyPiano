/* global Instruments */



const piano = new Instruments.Instrument();

window.addEventListener("keydown", event => {
	for (const code in Instruments.defaultMap) {
		if (event.keyCode == code) {
			const currentKey = Instruments.defaultMap[code];
			piano.play(new Instruments.Note(currentKey[0], 4 + currentKey[1], 1000));
		}
	}
});