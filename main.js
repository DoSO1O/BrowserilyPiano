/* global Instruments */



const currentQues = [];
const piano = new Instruments.Instrument();

for (const code in Instruments.defaultMap) {
	window.addEventListener("keydown", event => {
		if (event.keyCode == code) {
			const currentKey = Instruments.defaultMap[code];
			piano.play(new Instruments.Note(currentKey[0], 5 + currentKey[1]));
		}
	});
}