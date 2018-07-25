/*/
 *  88888 w           w            8b   d8                                                                  
 *    8   w 8d8b.d8b. w 8d8b. .d88 8YbmdP8 .d88 8d8b. .d88 .d88 .d88b 8d8b                                  
 *    8   8 8P Y8P Y8 8 8P Y8 8  8 8  "  8 8  8 8P Y8 8  8 8  8 8.dP' 8P                                    
 *    8   8 8   8   8 8 8   8 `Y88 8     8 `Y88 8   8 `Y88 `Y88 `Y88P 8                                     
 *                            wwdP                         wwdP                                             
 *                    w            w    8                                                                   
 *                    w 8d8b. d88b w .d88 .d88b                                                             
 *                    8 8P Y8 `Yb. 8 8  8 8.dP'                                                             
 *                    8 8   8 Y88P 8 `Y88 `Y88P                                                             
 *                                                                                                          
 *                                888             w                                     w            w      
 *                                 8  8d8b. d88b w8ww 8d8b 8   8 8d8b.d8b. .d88b 8d8b. w8ww d88b     w d88b 
 *                                 8  8P Y8 `Yb.  8   8P   8b d8 8P Y8P Y8 8.dP' 8P Y8  8   `Yb.     8 `Yb. 
 *                                888 8   8 Y88P  Y8P 8    `Y8P8 8   8   8 `Y88P 8   8  Y8P Y88P w   8 Y88P 
 *                                                                                                 wdP      
/*/



/* eslint-env worker */
importScripts("./Errors.js");



/**
 * TimingManagerのルートオブジェクト
 * 
 * @namespace
 * @author Genbu Hase
 */
const TimingManager = (() => {
	const TimingManager = {};



	/**
	 * 生成された楽器のコレクション
	 * @memberof TimingManager
	 */
	const instruments = [];

	/**
	 * 実行できるコマンド
	 * @memberof TimingManager
	 */
	const Commands = {
		/**
		 * ブラウザ側に値を返す
		 * 
		 * @param {any} result 返す値
		 * @return {any} 返した値
		 */
		return (result) {
			self.postMessage(result);
			return result;
		},

		/**
		 * 下層部のコマンドを参照して返す
		 * 
		 * @param {String} schemeStr 参照文字列
		 * @return {any} 参照されたコマンド
		 */
		deepBrowse (schemeStr) {
			if (!schemeStr) throw new TypeError("<'scheme' | 1st argment> is required");

			const nests = schemeStr.split(".");

			let deepest = Commands;
			for (const nest of nests) {
				try {
					deepest = deepest[nest];
				} catch (error) {
					throw new ReferenceError("Provided scheme doesn't exist");
				}
			}

			return deepest;
		},

		Instruments: {
			/**
			 * 次の空き楽器IDを返す
			 * @return {Number} 楽器ID
			 */
			getNextId () {
				const index = instruments.findIndex(instrument => !instrument);
				return Commands.return(index < 0 ? instruments.length : index);
			}
		}
	};

	

	Object.defineProperties(TimingManager, {
		instruments: { value: instruments, enumerable: true },
		Commands: { value: Commands, enumerable: true }
	});

	TimingManager.instruments = instruments;
	TimingManager.Commands = Commands;
	
	return TimingManager;
})();

/**
 * @typedef {Object} CommandRequest
 * @prop {String} command 実行するコマンド名
 * @prop {Array<any>} arguments コマンドの引数
 */



self.addEventListener("message", event => {
	/** @type {CommandRequest} */
	const data = event.data;

	if (!data.command) throw new TypeError("'command' must be String");
	if (!TimingManager.Commands.deepBrowse(data.command)) throw new ReferenceError("Provided command doesn't exist");
	if (!data.arguments) data.arguments = [];

	TimingManager.Commands.deepBrowse(data.command)(...data.arguments);
});