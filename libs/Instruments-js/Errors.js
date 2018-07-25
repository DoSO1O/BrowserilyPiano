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
			 * @param {Number} argIndex 引数のインデックス
			 * @param {String} description エラー文(ex: "<TEST | 1st Argument> "に繋がる)
			 */
			constructor (argName, argIndex, description) {
				argIndex == 1 ?
					argIndex += "st" :
				argIndex == 2 ?
					argIndex += "nd" :
				argIndex == 3 ?
					argIndex += "rd" :
				argIndex += "th";
		
				super(`<'${argName}' | ${argIndex} Argument> ${description}`);
			}
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
			 * @param {Number} argIndex 引数のインデックス
			 */
			constructor (argName, argIndex) { super(argName, argIndex, "is not acceptable") }
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
			 * @param {Number} argIndex 引数のインデックス
			 */
			constructor (argName, argIndex) { super(argName, argIndex, "is required") }
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
		ArgumentError: { value: ArgumentError, enumerable: true }
	});

	Errors.ArgumentError = ArgumentError;

	return Errors;
})();