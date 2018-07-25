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