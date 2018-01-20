(function() {

	"use strict";

	if ( typeof module === "object" && module && typeof module.exports === "object" ) {
		module.exports = Trans;
	}
	else {
		window.JsLingua.Cls.Trans = Trans;
	}

	const specialBef = [
		//numbers,
		"0",
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		//punctuation,
		"#", //actually it is a dot, this is to prevent conflect
		",",
		"?",
		"'",
		"!",
		"/",
		"(",
		")",
		"&",
		":",
		";",
		"=",
		"+",
		"^", //actually it is a hyphen, this is to prevent conflect
		"_",
		"\"",
		"$",
		"@"
	],
	specialAft = [
		//numbers
		" ----- ",
		" .---- ",
		" ..--- ",
		" ...-- ",
		" ....- ",
		" ..... ",
		" -.... ",
		" --... ",
		" ---.. ",
		" ----. ",
		//punctuation
		" .-.-.- ",
		" --..-- ",
		" ..--.. ",
		" .----. ",
		" -.-.-- ",
		" -..-. ",
		" -.--. ",
		" -.--.- ",
		" .-... ",
		" ---... ",
		" -.-.-. ",
		" -...- ",
		" .-.-. ",
		" -....- ",
		" ..--.- ",
		" .-..-. ",
		" ...-..- ",
		" .--.-. "
	];

	Trans.specialCharTrans = getTransliterator(specialBef, specialAft);
	Trans.specialCharUntrans = getTransliterator(specialAft, specialBef);

	/**
	* This function returns another function which do the transformation
	*
	* @method getTransliterator
	* @private
	* @memberof Trans
	* @memberof Trans
	* @param  {String[]} srcTbl array which contains the source strings
	* @param  {String[]} dstTbl array which contains the destination strings
	* @return {Function}        a function which takes a string and transforme it using
	* srcTbl and dstTbl
	*/
	function getTransliterator(srcTbl, dstTbl) {
		return function(text) {
			let result = text;
			for (let i=0; i< srcTbl.length; i++) {
				let keyEscaped = srcTbl[i].replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
				result = result.replace(new RegExp(keyEscaped, "g"), dstTbl[i]);
			}
			return result;
		};
	}

	/**
	* translateration of the language words
	*
	* @class Trans
	* @param {String} langCode the code of the language: ara, jpn, etc.
	*/
	function Trans(langCode) {
		this.code = langCode;
		this.methods = {};
		//default method (here we will take the first added one)
		this.defMethod = "";

		this.currentMethod = "";

	  //Trans.newMethod.call("def", otherMourseBef, otherMourseAft);

	}

	//=========================================
	// Protected Static methods
	// ========================================

	/**
	* Add new transliteration method using two parallele tables
	*
	* @method newMethod
	* @protected
	* @memberof Trans
	* @param  {String} methodName the name of the method
	* @param  {String[]} langTbl    array of strigs, the languages characters
	* @param  {String[]} transTbl   array of strigs, their respective representations
	*/
	Trans.newMethod = function(methodName, langTbl, transTbl) {
		if (typeof methodName === "string" && methodName.length > 0) {
			this.methods[methodName] = {};
			if (this.defMethod.length < 1)
			this.currentMethod = this.defMethod = methodName;
			this.methods[methodName].trans = this.methods[methodName].untrans = function(text) {
				return text;
			};
			if (Array.isArray(langTbl)  && Array.isArray(transTbl))
			if (langTbl.length  === transTbl.length) {
				this.methods[methodName].trans = getTransliterator(langTbl, transTbl);
				this.methods[methodName].untrans = getTransliterator(transTbl, langTbl);
			}
		}
	};

	/**
	* Set transliteration methods directly
	*
	* @method setTransUntrasMethods
	* @protected
	* @memberof Trans
	* @param {String} methodName the name of the method
	* @param {Function} trans      function of transliteration
	* @param {Function} untrans    function of untransliteration
	*/
	Trans.setTransUntrasMethods = function(methodName, trans, untrans) {
		if (methodName in this.methods){

			if (typeof trans === "function") {
				this.methods[methodName].trans = trans;
			}

			if (typeof untrans === "function") {
				this.methods[methodName].untrans = untrans;
			}

		}
	};

	/**
	* add pre- and post-transliteration functions to a method
	*
	* @method addTransPrePostMethods
	* @protected
	* @memberof Trans
	* @param {String} methodName the name of the method
	* @param {Function} preFunc    function that executes before transliteration;
	* It takes a string and returns a string
	* @param {Function} postFunc   function that executes after transliteration;
	* It takes a string and returns a string
	*/
	Trans.addTransPrePostMethods = function(methodName, preFunc, postFunc) {
		if (methodName in this.methods){
			if (typeof preFunc === "function"){
				this.methods[methodName].preTrans = preFunc;
			}
			if (typeof postFunc === "function"){
				this.methods[methodName].postTrans = postFunc;
			}
		}
	};

	/**
	* add pre- and post-untransliteration functions to a method
	*
	* @method addUntransPrePostMethods
	* @protected
	* @memberof Trans
	* @param {String} methodName the name of the method
	* @param {Function} preFunc    function that executes before untransliteration;
	* It takes a string and returns a string
	* @param {Function} postFunc   function that executes after untransliteration;
	* It takes a string and returns a string
	*/
	Trans.addUntransPrePostMethods = function(methodName, preFunc, postFunc) {
		if (methodName in this.methods){
			if (typeof preFunc === "function"){
				this.methods[methodName].preUntrans = preFunc;
			}
			if (typeof postFunc === "function"){
				this.methods[methodName].postUntrans = postFunc;
			}
		}
	};


	//=============================================
	// Prototypes
	// ============================================
	let Me = Trans.prototype;


	/**
	* Sets the current method to be used for [un]transliteration
	*
	* @method setCurrentMethod
	* @public
	* @final
	* @memberof Trans
	* @param {String} methodName method's name
	*/
	Me.setCurrentMethod = function(methodName) {
		if (methodName in this.methods) {
			this.currentMethod = methodName;
		}
	};

	/**
	* Returns the list of available transliteration methods
	*
	* @method availableMethods
	* @public
	* @final
	* @memberof Trans
	* @return {String[]}  methods names
	*/
	Me.availableMethods = function() {
		return Object.keys(this.methods);
	};

	/**
	* gets the language's code
	*
	* @method getCode
	* @public
	* @final
	* @memberof Trans
	* @return {String}  the language's code
	*/
	Me.getCode = function() {
		return this.code;
	};

	/**
	* transliterate the text using the current method
	*
	* @method transliterate
	* @public
	* @final
	* @memberof Trans
	* @param  {String} text the untransliterated text (original)
	* @return {String}      the transliterated text
	*/
	Me.transliterate = function(text) {
		let result = text;

		if (typeof this.methods[this.currentMethod].preTrans === "function") {
			result = this.methods[this.currentMethod].preTrans(result);
		}

		result = this.methods[this.currentMethod].trans(result);

		if (typeof this.methods[this.currentMethod].postTrans === "function") {
			result = this.methods[this.currentMethod].postTrans(result);
		}
		return result;
	};

	/**
	* untransliterate the text using the current method
	*
	* @method untransliterate
	* @public
	* @final
	* @memberof Trans
	* @param  {String} text translaterated text
	* @return {String}      untranslaterated text (original text)
	*/
	Me.untransliterate = function(text) {
		let result = text;

		if (typeof this.methods[this.currentMethod].preUntrans === "function") {
			result = this.methods[this.currentMethod].preUntrans(result);
		}

		result = this.methods[this.currentMethod].untrans(result);

		if (typeof this.methods[this.currentMethod].postUntrans === "function") {
			result = this.methods[this.currentMethod].postUntrans(result);
		}
		return result;
	};

}());
