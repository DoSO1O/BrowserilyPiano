/*/
 *  ______   ______   ______   ______   ______   ______   ______   ______   ______   ______   ______ 
 * |     _|_|     _|_|     _|_|     _|_|     _|_|     _|_|     _|_|     _|_|     _|_|     _|_|      |
 * | I  (_(_  n  (_(_  s  (_(_  t  (_(_  r  (_(_  u  (_(_  m  (_(_  e  (_(_  n_ (_(_  t_ (_(_  s_   |
 * |______| |______| |______| |______| |______| |______| |______| |______| |_( )__| |_( )__| |_( )__|
 *                                                                            _        _        _    
 *                                                                          _( )__   _( )__   _( )__ 
 *                                                                         |     _|_|     _|_|      |
 *                                                                         | .  (_(_  j  (_(_  s    |
 *                                                                         |______| |______| |______|
/*/



/**
 * Instruments.jsのルートクラス
 * 
 * @namespace
 * @author Genbu Hase
 */
const Instruments = (libRoot => {
	class Instruments {
		/**
		 * キーマッピングのデフォルト設定
		 * @return {Object<number, Array<String | Number>>}
		 */
		static get defaultMap () {
			return {
				90: ["C", 0],
				83: ["C#", 0],
				88: ["D", 0],
				68: ["D#", 0],
				67: ["E", 0],
				86: ["F", 0],
				71: ["F#", 0],
				66: ["G", 0],
				72: ["G#", 0],
				78: ["A", 0],
				74: ["A#", 0],
				77: ["B", 0],
				188: ["C", 1],
				76: ["C#", 1],
				190: ["D", 1],
				59: ["D#", 1],
				191: ["E", 1],
				220: ["F", 1]
			};
		}
	}

	/**
	 * 遅延処理に利用するタイマー
	 * 
	 * @type {Worker}
	 * @memberof Instruments
	 */
	const TIMER = new Worker(`${libRoot}/TimingManager.js`);



	/**
	 * 演奏に使用する楽器クラス
	 * 
	 * @memberof Instruments
	 * @author Genbu Hase
	 */
	class Instrument extends AudioContext {
		/** 楽器を生成します */
		constructor () {
			super();
			this.notesQue = [];

			TIMER.postMessage({ command: "getNextId" });
		}

		/**
		 * 楽器の波形タイプ
		 * @return {OscillatorType}
		 */
		get type () { return "sine" }

		/** @param {Number} [frequency] */
		createOscillator (frequency) {
			const oscillator = super.createOscillator();
			oscillator.type = this.type;
			frequency && (oscillator.frequency.value = frequency);

			return oscillator;
		}
		
		/**
		 * 音源を再生します
		 * 
		 * @param {Number | Note | Instruments.Chord} source 鍵盤番号 | 音符 | コード
		 * @param {Number} [duration] 再生時間[ms]
		 */
		async play (source, duration) {
			if (!(
				typeof source === "number" ||
				source instanceof Instruments.Note ||
				source instanceof Instruments.Chord
			)) throw new TypeError("1st argument, source is not acceptable");

			if (source instanceof Instruments.Chord) {
				const sounds = [];
				for (const note of source.notes) {
					const sound = this.createOscillator(note.frequency);
					
					sound.connect(this.destination);
					sound.start(0);

					sounds.push(
						new Promise(resolve => {
							if (!duration) resolve();

							let counter = 0;
							const detector = setInterval(() => {
								counter++;

								if (counter >= duration) {
									sound.stop(0);

									clearInterval(detector);
									resolve();
								}
							});
						})
					);
				}

				await Promise.all(sounds);
				return;
			}


		
			const sound = this.createOscillator(
				typeof source === "number" ? Instruments.Note.createFromIndex(source).frequency :
				source instanceof Instruments.Note ? source.frequency :
				null
			);

			sound.connect(this.destination);
			sound.start(0);

			await new Promise(resolve => {
				if (!duration) resolve();

				let counter = 0;
				const detector = setInterval(() => {
					counter++;
					if (counter < duration) return;

					sound.stop(0);

					clearInterval(detector);
					resolve();
				}, 1);
			});

			return;
		}
	}

	/**
	 * 音源となる基礎音クラス
	 * 
	 * @memberof Instruments
	 * @author Genbu Hase
	 */
	class Note {
		/** 基礎音の種類 */
		static get NoteType () { return ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"] }

		/**
		 * 鍵盤番号から基礎音を生成します
		 * 
		 * @param {Number} index 鍵盤番号
		 * @return {Note} 生成された基礎音
		 */
		static createFromIndex (index) {
			return new Note(Note.NoteType[index % 12], Math.floor(index / 12) + 1);
		}



		/**
		 * 基礎音を生成します
		 * 
		 * @param {String} scale スケール
		 * @param {Number} octave オクターブ数
		 */
		constructor (scale = "C", octave = 3) {
			this.scale = scale;
			this.octave = octave;
		}

		/**
		 * 鍵盤番号
		 * @return {Number}
		 */
		get noteIndex () { return Note.NoteType.indexOf(this.scale) + 12 * (this.octave - 1) }

		/**
		 * 音源の周波数
		 * @return {Number}
		 */
		get frequency () { return 27.500 * Math.pow(2, this.noteIndex / 12) }

		/** @return {String} */
		toString () { return `${this.scale}${this.octave}` }
	}

	/**
	 * 和音(コード)クラス
	 * 
	 * @memberof Instruments
	 * @author Genbu Hase
	 */
	class Chord {
		/** コードの種類 */
		static get ChordType () {
			return {
				MAJOR: [0, 4, 7],
				MINOR: [0, 3, 7],
				SUS2: [0, 2, 7],
				SUS4: [0, 5, 7],
				AUG: [0, 4, 8]
			};
		}



		/**
		 * 基礎音と対応したコードを生成します
		 * 
		 * @param {Instruments.Note} rootNote
		 * @param {Instruments.Chord.ChordType} type
		 */
		constructor (rootNote, type) {
			if (!(rootNote instanceof Instruments.Note)) throw new TypeError("1st argument, rootNote must be Note");
			
			this.root = rootNote;
			this.notes = [ rootNote, new Instruments.Note(rootNote.frequency + type[1]), new Instruments.Note(rootNote.frequency + type[2]) ];
		}
	}



	Object.defineProperties(Instruments, {
		TIMER: { value: TIMER, enumerable: true },

		Instrument: { value: Instrument },
		Note: { value: Note },
		Chord: { value: Chord }
	});
	
	Instruments.TIMER = TIMER;

	Instruments.Instrument = Instrument;
	Instruments.Note = Note;
	Instruments.Chord = Chord;

	return Instruments;
})(
	(() => {
		/** Instruments.jsのルートファイル名 */
		const libMainFile = "Instruments.js";
		/** @type {HTMLScriptElement} */
		const script = document.querySelector(`Script[Src$="${libMainFile}"]`);
		
		return script.src.split("/").slice(0, -1).join("/");
	})()
);