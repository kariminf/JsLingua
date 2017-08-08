(function(){

  if ( typeof module === "object" && module && typeof module.exports === "object" ) {
    module.exports = Morpho;
  } else {
    window.JsLingua.Cls.Morpho = Morpho;
  }

  /**
  * Morphology of a specific language
  *
  * @class Morpho
  * @constructor
  * @param {string} langCode Language ISO693-2 code: ara, jpn, eng, etc.
  */
  function Morpho(langCode) {

    this.code = langCode;
    //Contains stemmers
    this.stemmers = {};
    this.currentStemmer = "";
    this.g = {
      debugFunction: dummyDebug
    };
  }

  /**
  * A debugging function which do nothing
  * @method dummyDebug
  * @private
  */
  function dummyDebug() {}

  /**
  * A debugging function which pushes the arguments to the cosoles log
  * @method realDebug
  * @private
  */
  function realDebug(){
    console.log(Array.prototype.slice.call(arguments).join(' '));
  }

  var C = Object.freeze;

  /**
  * The part of speech: Noun, Verb, Adjective,
  * Adverb, Preposition, Pronoun
  * @access Morpho.Feature.POS
  * @attribute PoS
  * @readOnly
  * @static
  * @type {object}
  */
  var PoS = C({
    N: "noun",
    V: "verb",
    Adj: "adjective",
    Adv: "adverb",
    Prep: "preposition",
    Pron: "pronoun"
  });

  /**
  * The tense: Past, Present, Future
  * @access Morpho.Feature.Tense
  * @attribute Tense
  * @readOnly
  * @static
  * @type {object}
  */
  var Tense = C({
    Pa: "past",
    Pr: "present",
    Fu: "future"
  });

  /**
  * The aspect: Simple, Continuous, Perfect, PerfectContinuous
  * @access Morpho.Feature.Aspect
  * @attribute Aspect
  * @readOnly
  * @static
  * @type {object}
  */
  var Aspect = C({
    S: "simple",
    C: "continuous",
    P: "perfect",
    PC: "perfect-continuous"
  });

  /**
  * The mood: Indicative, Subjunctive, Conditional,
  * Optative, Imperative, Jussive, Potential,
  * Hypothetical, Inferential
  * @access Morpho.Feature.Mood
  * @attribute Mood
  * @readOnly
  * @static
  * @type {object}
  */
  var Mood = C({
    Indi: "indicative",
    Subj: "subjunctive",
    Cond: "conditional",
    Opta: "optative",
    Impe: "imperative",
    Juss: "jussive",
    Pote: "potential",
    Hypo: "hypothetical",
    Infe: "inferential"
  });

  /**
  * The voice: Active,Passive, Middle
  * @access Morpho.Feature.Voice
  * @attribute Voice
  * @readOnly
  * @static
  * @type {object}
  */
  var Voice = C({
    A: "active",
    P: "passive",
    M: "middle"
  });

  /**
  * The grammatical number: Singular, Dual, Plural
  * @access Morpho.Feature.Number
  * @attribute GNumber
  * @readOnly
  * @static
  * @type {object}
  */
  var GNumber = C({
    S: "singular",
    D: "dual",
    P: "plural"
  });

  /**
  * The case: Nominative, Accusative, Genitive, Dative,
  * Prepositional, Ablative, Instrumental, Vocative
  * @access Morpho.Feature.Case
  * @attribute Case
  * @readOnly
  * @static
  * @type {object}
  */
  var Case = C({
    Nom: "nominative",
    Acc: "accusative",
    Gen: "genitive",
    Dat: "dative",
    Pre: "prepositional",
    Abl: "ablative",
    Ins: "instrumental",
    Voc: "vocative"
  });

  /**
  * The person: First, Second, Third.
  * @access Morpho.Feature.Person
  * @attribute Person
  * @readOnly
  * @static
  * @type {object}
  */
  var Person = C({
    F: "first",
    S: "second",
    T: "third"
  });

  /**
  * The gender: Masculine, Feminine, Neuter.
  * @access Morpho.Feature.Gender
  * @attribute Gender
  * @readOnly
  * @static
  * @type {object}
  */
  var Gender = C({
    M: "masculine",
    F: "feminine",
    N: "neuter"
  });

  /**
  * This is a map to different morphology features:
  * <ul>
  * <li>POS</li>
  * <li>Tense</li>
  * <li>Aspect</li>
  * <li>Mood</li>
  * <li>Voice</li>
  * <li>Number: It returns <a href="#attr_Num">Num</a></li>
  * <li>Case: It returns <a href="#attr_Case">Case</a></li>
  * <li>Person: It returns <a href="#attr_Person">Person</a></li>
  * <li>Gender: It returns <a href="#attr_Gender">Gender</a></li>
  * </ul>
  * We can access these features either by:<br>
  * Morpho.Feature.feature_name <br>
  * Or: <br>
  * Morpho.Feature["feature_name"]
  *
  * @attribute Feature
  * @access Morpho.Feature
  * @readOnly
  * @static
  * @type {object}
  */
  Morpho.Feature = C({
    POS: PoS,
    Tense: Tense,
    Aspect: Aspect,
    Mood: Mood,
    Voice: Voice,
    Number: GNumber,
    Case: Case,
    Person: Person,
    Gender: Gender
  });


  //=========================================
  // Protected Static methods
  // ========================================

  /**
  * Add new stemmer method
  * @method newStemmer
  * @protected
  * @static
  * @param  {string} stemmerName the name of the stemmer
  * @param  {string} stemmerDesc   the description of the stemmer
  * @param  {function} stemmerFct   the function stem(word)
  */
  Morpho.newStemmer = function (stemmerName, stemmerDesc, stemmerFct) {
    if (typeof stemmerName === "string" && stemmerName.length > 0){
      this.stemmers[stemmerName] = {};
      this.stemmers[stemmerName].desc = stemmerDesc;
      this.stemmers[stemmerName].fct = stemmerFct;
    }
  }

  //===================================================
  // Prototypes
  //===================================================
  var Me = Morpho.prototype;

  /**
  * Enables the debugging messages
  * @method enableDebug
  */
  Me.enableDebug = function(){
    this.g.debugFunction = realDebug;
  }

  /**
  * disables the debugging messages
  * @method disableDebug
  */
  Me.disableDebug = function(){
    this.g.debugFunction = dummyDebug;
  }

  /**
  * Sets the current stemmer
  * @method setCurrentStemmer
  * @param {string} StemmerName stemmer method's name
  */
  Me.setCurrentStemmer = function (StemmerName) {
    if (StemmerName in this.stemmers){
      this.currentStemmer = StemmerName;
    }
  }

  /**
  * Returns the list of available stemming methods
  * @method availableStemmers
  * @return {array}  Array of Strings containing stemmers names
  */
  Me.availableStemmers = function(){
    return Object.keys(this.stemmers);
  }

  /**
  * This method is used to recover the name of the tense
  * @param  {Tense} tense the tense which we want to get the name
  * @return {String}       the name of the tense in the selected language
  */
  Me.getTenseName = function(tense){
    var T = Tense;
    switch (tense) {
      case T.Pa:
      return "past";
      case T.Pr:
      return "present";
      case T.Fu:
      return "future";
    }

    return "";
  }

  /**
  * This function returns an object of available conjugation forms
  * ```
  * {
  *  "form_name": {opts}
  * }
  * ```
  * @public
  * @method getForms
  * @return {array}  Array of tenses available for the language
  */
  Me.getForms = function(){
    //Past and Present are defaults
    return {
      "Indicative present": {
        mood: Mood.Ind,
        tense: Tense.Pr,
        aspect: Aspect.S
      },
      "Indicative past": {
        mood: Mood.Ind,
        tense: Tense.Pa,
        aspect: Aspect.S
      },
      "Indicative future": {
        mood: Mood.Ind,
        tense: Tense.Fu,
        aspect: Aspect.C
      }
    };
  }


  /**
  * Each language has a conjugation table model.
  * For example, in English, Arabic and French, we put pronouns in rows.
  * As for Japanese, the conjugation doesn't follow that pattern.
  * @method getConjugModel
  * @return {[type]}   [description]
  */
  Me.getConjugModel = function(){
    //Past and Present are defaults
    return {
      rows: ["Pronoun"],
      cols: ["Voice", "Negation"]
    };
  }

  Me.getOptLists = function(optLabel){
    return [];
  }

  Me.getOptName = function(optLabel, opts){
    return "";
  }

  /**
  * This function is used for verb conjugation
  * @method conjugate
  * @param  {string} verb the word to be conjugated
  * @param  {object} opts  options for tense, case, voice, aspect, person, number, gender, mood, and other
  * @return {string}      inflected word
  */
  Me.conjugate = function(verb, opts){
    return verb;
  }



  /**
  * Get the personal pronoun using options like: person, gender, etc.<br>
  * for example, the parameters for the personal pronoun "I": <br>
  * ```
  *    {
  *      person: Morpho.Feature.Person.First,
  *      number: Morpho.Feature.Number.Singular
  *    }
  * ```
  * @method getPronounName
  * @param  {object} opts An object containing parameters: person, gender, number.
  * @return {string}      the pronoun
  */
  Me.getPronounName = function(opts){
    return "";
  }

  /**
  * This function is used for noun inflexion<br>
  * For example: noun to plural nouns
  * @method declenseNoun
  * @param  {string} noun the noun to be inflected
  * @param  {object} opts  the options: number for example
  * @return {string}      the inflected noun
  */
  Me.declenseNoun = function(noun, opts){
    return noun;
  }

  /**
  * Stem a word: delete prefixes, suffixes and infixes
  * @method stem
  * @param  {string} word the word to be stemmed
  * @return {string}      stemmed word
  */
  Me.stem = function(word){
    var stemmer = this.stemmers[this.currentStemmer];
    if (typeof stemmer !== "object") return word;
    if (typeof stemmer.fct !== "function") return word;
    return stemmer.fct(word);
  }

  /**
  * lemmatize a word: return it to its origin
  * @method lemmatize
  * @param  {string} word the word to be lemmatized
  * @return {string}      lemmatized word
  */
  Me.lemmatize = function(word){
    return word;
  }

  /**
  * Normalization method, used to delete non used chars or to replace some with others, etc.
  * @method normalize
  * @param  {string} word the word to be normalized
  * @param  {string} opts some options (optional) where each language defines its own
  * normalization options
  * @return {string}      normalized word
  */
  Me.normalize = function(word, opts){
    return word;
  }

  //========================================================================
  // HELPERS
  // =======================================================================

  function parseConjModelBranch(morpho, branch){
    var result = {
      labels: [], // Array[Array[string]]: each level have many labels
      spans: [1], // spans of each level
      opts: [{}]
    };

    for (var bi = 0; bi < branch.length; bi++){
      var tmpOpts = [];
      var opts = morpho.getOptLists(branch[bi]);
      for(var si = 0; si < result.spans.length; si++){
        result.spans[si] *= opts.length;
      }
      var labels = [];
      result.opts.forEach(function(val, idx, a){
        opts.forEach(function(val2, idx2, a2){
          var fuseOpts = Object.assign({}, val, val2);
          tmpOpts.push(fuseOpts);
          if(!idx){//we process labels just once
            labels.push(morpho.getOptName(branch[bi], val2));
          }
        });
      });

      result.opts = tmpOpts;
      result.spans.push(1);
      result.labels.push(labels);

    }
    result.spans.shift();

    return result;
  }

  Morpho.parseConjModel = function(morpho) {

    var result = {
      rows: {},
      cols: {}
    }

    if (! (morpho instanceof Morpho)) return result;

    var model = morpho.getConjugModel();

    result.rows = parseConjModelBranch(morpho, model.rows);
    result.cols = parseConjModelBranch(morpho, model.cols);

    return result;

  }

}());
