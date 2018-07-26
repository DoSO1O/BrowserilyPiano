/*/
 *  8888                                                                                                 
 *  8www 8d8b 8d8b .d8b. 8d8b d88b                                                                       
 *  8    8P   8P   8' .8 8P   `Yb.                                                                       
 *  8888 8    8    `Y8P' 8    Y88P                                                                       
 *                                                                                                       
 *                 w            w    8                                                                   
 *                 w 8d8b. d88b w .d88 .d88b                                                             
 *                 8 8P Y8 `Yb. 8 8  8 8.dP'                                                             
 *                 8 8   8 Y88P 8 `Y88 `Y88P                                                             
 *                                                                                                       
 *                             888             w                                     w            w      
 *                              8  8d8b. d88b w8ww 8d8b 8   8 8d8b.d8b. .d88b 8d8b. w8ww d88b     w d88b 
 *                              8  8P Y8 `Yb.  8   8P   8b d8 8P Y8P Y8 8.dP' 8P Y8  8   `Yb.     8 `Yb. 
 *                             888 8   8 Y88P  Y8P 8    `Y8P8 8   8   8 `Y88P 8   8  Y8P Y88P w   8 Y88P 
 *                                                                                              wdP      
/*/



/**
 * 独自エラーの定義部
 * 
 * @namespace
 * @author Genbu Hase
 */
const Errors = (() => {
	const Errors = {};



	const ArgumentError = (() => {
		/**
		 * 引数に関するエラー
		 * 
		 * @memberof Errors
		 * @extends TypeError
		 */
		class ArgumentError extends TypeError {
			/**
			 * ArgumentErrorを生成
			 * 
			 * @param {String} argName 引数名
			 * @param {Number} [argIndex] 引数のインデックス
			 * @param {String} [description=""] エラー文(ex: "<TEST | 1st Argument> "に繋がる)
			 */
			constructor (argName, argIndex, description = "") {
				if (argIndex) {
					!argIndex ?
						argIndex = "One of Arguments" :
					argIndex == 1 ?
						argIndex += "st" :
					argIndex == 2 ?
						argIndex += "nd" :
					argIndex == 3 ?
						argIndex += "rd" :
					argIndex += "th";

					super(`<'${argName}' | ${argIndex} Argument> ${description}`);
				} else {
					super(`'${argName}' ${description}`);
				}
			}

			get name () { return "ArgumentError" }
		}



		/**
		 * 許容されない引数型である事を示す
		 * 
		 * @memberof Errors
		 * @extends ArgumentError
		 */
		class ArgumentNotAcceptableError extends ArgumentError {
			/**
			 * ArgumentNotAcceptableErrorを生成
			 * 
			 * @param {String} argName 引数名
			 * @param {Number} [argIndex] 引数のインデックス
			 * @param {String | Array<String>} [acceptables] 許容される引数型名
			 */
			constructor (argName, argIndex, acceptables) {
				if (!acceptables) {
					super(argName, argIndex, "is not acceptable");
				} else {
					//must be String
					//must be String, Number, or Array

					if (!Array.isArray(acceptables) || (Array.isArray(acceptables) && acceptables.length === 1)) {
						super(argName, argIndex, `must be ${acceptables}`);
					} else {
						let listed = "";
						acceptables.forEach((acceptable, index) => {
							if (index === acceptables.length - 1) return listed += `or ${acceptable}`;

							return listed += `${acceptable}, `;
						});

						super(argName, argIndex, `must be ${listed}`);
					}
				}
			}

			get name () { return "ArgumentNotAcceptableError" }
		}

		/**
		 * 引数の定義が必須である事を示す
		 * 
		 * @memberof Errors
		 * @extends ArgumentError
		 */
		class ArgumentNotDefinedError extends ArgumentError {
			/**
			 * ArgumentNotDefinedErrorを生成
			 * 
			 * @param {String} argName 引数名
			 * @param {Number} [argIndex] 引数のインデックス
			 */
			constructor (argName, argIndex) { super(argName, argIndex, "is required") }

			get name () { return "ArgumentNotDefinedError" }
		}



		Object.defineProperties(ArgumentError, {
			ArgumentNotAcceptableError: { value: ArgumentNotAcceptableError },
			ArgumentNotDefinedError: { value: ArgumentNotDefinedError }
		});

		ArgumentError.ArgumentNotAcceptableError = ArgumentNotAcceptableError;
		ArgumentError.ArgumentNotDefinedError = ArgumentNotDefinedError;

		return ArgumentError;
	})();



	Object.defineProperties(Errors, {
		ArgumentError: { value: ArgumentError }
	});

	Errors.ArgumentError = ArgumentError;

	return Errors;
})();