(function () {

  "use strict";

  //TODO see https://en.wikipedia.org/wiki/English_irregular_verbs#List
  let Morpho = {};
  if ( typeof module === "object" && module && typeof module.exports === "object" ) {
    Morpho = require("../morpho.js");
    module.exports = FraMorpho;
  } else {
    Morpho = window.JsLingua.Cls.Morpho;
    window.JsLingua.addService("Morpho", "fra", FraMorpho);
  }

  //Different global features
  let F = Morpho.Feature,
  Tense = F.Tense,
  Mood = F.Mood,
  Voice = F.Voice,
  GNumber = F.Number,
  Aspect = F.Aspect,
  Gender = F.Gender,
  Person = F.Person;

  let g;

  function FraMorpho() {
    Morpho.call(this, "fra");
    Morpho.newStemmer.call(this, "snowballFrStemmer", "French Snowball stemmr", snowballStemmer);

    //Morpho.addNounDeclension.call(this, "singularToPlural", singular2plural);
    g = this.g;
  }

  FraMorpho.prototype = Object.create(Morpho.prototype);
  let Me = FraMorpho.prototype;

  Me.constructor = FraMorpho;

  Me.getPronounOpts = function() {
    return [
        {person:Person.F, number: GNumber.S}, //Je
        {person:Person.S, number: GNumber.S},//Tu
        {person:Person.T, number: GNumber.S, gender: Gender.M},//Il
        {person:Person.T, number: GNumber.S, gender: Gender.F},//Elle
        {person:Person.F, number: GNumber.P}, //Nous
        {person:Person.S, number: GNumber.P},//Vous
        {person:Person.T, number: GNumber.P, gender: Gender.M},//Ils
        {person:Person.T, number: GNumber.P, gender: Gender.F}//Elles

    ];
  };


  Me.getPronounName = function(opts) {
    switch (opts.person) {
      case Person.F:
      if (opts.number === GNumber.S) return "Je";
      else return "Nous";

      case Person.S:
      if (opts.number === GNumber.S) return "Tu";
      return "Vous";

      case Person.T:
      let pl = (opts.number === GNumber.S)? "": "s";
      if (opts.gender === Gender.M) return "Il" + pl;
      return "Elle" + pl;
    }
    return "";
  };

  //https://en.wikipedia.org/wiki/French_conjugation
  Me.getForms = function() {
    return  {
      //Indicative
      "Indicative Present (présent)": {
        mood: Mood.Ind,
        tense: Tense.Pr,
        aspect: Aspect.S
      },
      "Indicative Present perfect (passé composé)": {
        mood: Mood.Ind,
        tense: Tense.Pr,
        aspect: Aspect.P
      },
      "Indicative Imperfect (imparfait)": {
        mood: Mood.Ind,
        tense: Tense.Pr,
        aspect: Aspect.I
      },
      //Exprime une action passée, achevée, d'une durée plutôt longue et antérieure à une autre action passée:
      //https://www.francaisfacile.com/exercices/exercice-francais-2/exercice-francais-8681.php
      "Indicative Pluperfect (plus-que-parfait)": {
        mood: Mood.Ind,
        tense: Tense.Pa,
        aspect: Aspect.P,
        period: "long"
      },
      "Indicative Simple past (passé simple)": {
        mood: Mood.Ind,
        tense: Tense.Pa,
        aspect: Aspect.S
      },
      //Exprime une action passée, achevée, d'une durée assez brève et antérieure à une autre action passée:
      //https://www.francaisfacile.com/exercices/exercice-francais-2/exercice-francais-8681.php
      "Indicative Past perfect (passé antérieur)": {
        mood: Mood.Ind,
        tense: Tense.Pa,
        aspect: Aspect.P,
        period: "short"
      },
      "Indicative Simple future (futur simple)": {
        mood: Mood.Ind,
        tense: Tense.Fu,
        aspect: Aspect.S
      },
      "Indicative Future perfect (futur antérieur)": {
        mood: Mood.Ind,
        tense: Tense.Fu,
        aspect: Aspect.P
      },

      //Subjunctive
      "Subjunctive Present": {
        mood: Mood.Sub,
        tense: Tense.Pr,
        aspect: Aspect.S
      },
      "Subjunctive Past (passé)": {
        mood: Mood.Sub,
        tense: Tense.Pa,
        aspect: Aspect.S
      },
      "Subjunctive Imperfect": {
        mood: Mood.Sub,
        tense: Tense.Pr,
        aspect: Aspect.I
      },
      "Subjunctive Pluperfect": {
        mood: Mood.Sub,
        tense: Tense.Pa,
        aspect: Aspect.P
      },

      //Imperative
      "Imperative Present": {
        mood: Mood.Imp,
        tense: Tense.Pr
      },
      "Imperative Past": {
        mood: Mood.Imp,
        tense: Tense.Pa
      },

      //Conditional
      "Conditional Present": {
        mood: Mood.Cnd,
        tense: Tense.Pr
      },
      "Conditional Past (form 1)": {
        mood: Mood.Cnd,
        tense: Tense.Pa,
        form: 1
      },
      "Conditional Past (form 2)": {
        mood: Mood.Cnd,
        tense: Tense.Pa,
        form: 2
      }
    };
  };

  //let C = Object.freeze;

  //=================
  //Conjugation zone
  //=================

  //Second group verbs
  //https://en.wiktionary.org/w/index.php?title=Category:French_second_group_verbs&pageuntil=MURIR%0Amurir#mw-pages
  const verbs2g = {
    //     A
    // ==========
    "ab": {
      "asourd": 1, "âtard": 1, "êt": 1, "ol": 1, "onn": 1,
      "out": 1, "réag": 1, "rout": 1, "rut": 1
    },
    "ac": {
      "calm": 1, "compl": 1, "courc": 1, "croup": 1
    },
    "ad": {
      "ouc": 1, "vert": 1
    },
    "af": {
      "fad": 1, "faibl": 1, "ferm": 1, "franch": 1
    },
    "ag": {
      "": 1, "on": 1, "rand": 1, "uerr": 1
    },
    "ah": {
      "ur": 1
    },
    "ai": {
      "gr": 1
    },
    "al": {
      "angu": 1, "ent": 1, "lot": 1, "ourd": 1, "un": 1
    },
    "am": {
      "aigr": 1, "ars": 1, "at": 1, "enu": 1, "err": 1, "eubl": 1,
      "inc": 1, "oindr": 1, "oll": 1, "ort": 1, "ui": 1
    },
    "an": {
      "éant": 1, "obl": 1, "ord": 1
    },
    "ap": {
      "lan": 1, "lat": 1, "pauvr": 1, "pesant": 1, "plaud": 1, "profond": 1
    },
    "ar": {
      "rond": 1
    },
    "as": {
      "sag": 1, "sain": 1, "serv": 1, "s": 1, "sombr": 1, "sort": 1,
      "soup": 1, "soupl": 1, "sourd": 1, "souv": 1, "sujett": 1
    },
    "at": {
      "tendr": 1, "tér": 1, "terr": 1, "tiéd": 1
    },
    "av": {
      "ach": 1, "ert": 1, "eul": 1, "il": 1
    },

    //      B
    // ============
    "ba": {
      "nn": 1, "rr": 1, "ud": 1
    },
    "bâ": {
      "t": 1
    },
    "bé": {
      "n": 1
    },
    "bl": {
      "anch": 1, "êm": 1, "ett": 1, "eu": 1, "ond": 1, "ott": 1
    },
    "bo": {
      "nd": 1, "uff": 1
    },
    "br": {
      "and": 1, "un": 1
      //"uire": 1,

    },

    //    C
    // ========
    "ca": {
      "nd": 1
    },
    "ch": {
      "auv": 1, "ér": 1, "ois": 1
    },
    "co": {
      "mpat": 1, "nvert": 1, "sais": 1, "t": 1
    },
    "cr": {
      "ép": 1, "oup": 1
    },

    //     D
    // ==========
    "dé": {
      "crép": 1, "fin": 1, "fléch": 1, "fraîch": 1, "garn": 1, "gauch": 1,
      "glut": 1, "gourd": 1, "gross": 1, "guerp": 1, "mol": 1, "mun": 1,
      "pér": 1, "roug": 1, "sempl": 1, "sinvest": 1, "sobé": 1,
      "sun": 1
    },
    "de": {
      "ssais": 1, "ssert": 1
    },
    "di": {
      "vert": 1
    },
    "du": {
      "rc": 1
    },

    //     E
    // ==========
    "éb": {
      "ah": 1, "aub": 1, "aud": 1, "lou": 1
    },
    "éc": {
      "lairc": 1, "rapout": 1
    },
    "ef": {
      "fleur": 1
    },
    "él": {
      "arg": 1
    },
    "em": {
      "bell": 1, "bout": 1, "pl": 1, "puant": 1
    },
    "en": {
      "chér": 1, "durc": 1, "fou": 1, "glout": 1, "gourd": 1, "hard": 1,
      "laid": 1, "nobl": 1, "orgueill": 1, "rich": 1, "sevel": 1, "vah": 1
    },
    "ép": {
      "aiss": 1, "anou": 1
    },
    "éq": {
      "uarr": 1
    },
    "es": {
      "tourb": 1
    },
    "ét": {
      "abl": 1, "ourd": 1, "réc": 1
    },
    "év": {
      "anou": 1
    },

    //      F
    // ===========
    "fa": {
      "ibl": 1, "ill": 1, "rc": 1
    },
    "fi": {
      "n": 1
    },
    "fl": {
      "éch": 1, "étr": 1, "eur": 1, "or": 1
    },
    "fo": {
      "rc": 1, "u": 1, "urb": 1, "urn": 1
    },
    "fr": {
      "aîch": 1, "anch": 1, "ém": 1, "oid": 1
    },

    //      G
    // ============
    "ga": {
      "rant": 1, "rn": 1, "uch": 1, "ud": 1
    },
    "gé": {
      "m": 1
    },
    "gl": {
      "ap": 1
    },
    "gr": {
      "and": 1, "av": 1, "oss": 1
    },
    "gu": {
      "ér": 1
    },

    //     H
    // ==========
    "ha": {
      "v": 1
    },
    "he": {
      "nn": 1
    },
    "ho": {
      "nn": 1
    },

    //    I
    // =========
    "im": {
      "part": 1
    },
    "in": {
      "fléch": 1, "terag": 1, "terconvert": 1, "tervert": 1, "vert": 1, "vest": 1
    },

    //     J
    // =========
    "ja": {
      "ill": 1, "un": 1
    },
    "jo": {
      "u": 1
    },

    //    L
    // =========
    "la": {
      "id": 1, "ngu": 1
    },
    "lo": {
      "t": 1
    },

    //   M
    // ========
    "ma": {
      "igr": 1
    },
    "me": {
      "urtr": 1
    },
    "mi": {
      "nc": 1
    },
    "mo": {
      "is": 1, "ll": 1
    },
    "mu": {
      "g": 1, "n": 1, "r": 1
    },
    "mû": {
      "r": 1
    },
    "na": {
      "nt": 1
    },
    "no": {
      "irc": 1, "urr": 1
    },
    "ob": {
      "é": 1, "scurc": 1
    },
    "ou": {
      "rd": 1
    },

    //    P
    // =========
    "pâ": {
      "l": 1,
      "t": 1
    },
    "pé": {
      "r": 1,
      "tr": 1
    },
    "pe": {
      "rvert": 1
    },
    "po": {
      "l": 1, "urr": 1
    },
    "pr": {
      "æmun": 1, "édéfin": 1, "émun": 1
    },
    "pu": {
      "n": 1
    },

    //     R
    // =========
    "ra": {
      "ccourc": 1, "corn": 1, "douc": 1, "fferm": 1, "fraich": 1, "fraîch": 1,
      "gaillard": 1, "id": 1, "jeun": 1, "lent": 1, "moll": 1, "nc": 1,
      "ss": 1, "ssort": 1, "v": 1
    },
    "ré": {
      "ag": 1, "assort": 1, "enchér": 1, "fléch": 1, "g": 1, "invest": 1,
      "jou": 1, "part": 1, "tabl": 1, "tréc": 1, "un": 1, "uss": 1
    },
    "re": {
      "bât": 1, "bond": 1, "ço": 1, "convert": 1, "crép": 1, "défin": 1,
      "fleur": 1, "froid": 1, "garn": 1, "mbrun": 1, "mpl": 1, "nchér": 1,
      "nforc": 1, "pétr": 1, "pun": 1, "splend": 1, "ssais": 1, "ssort": 1,
      "ssurg": 1, "surg": 1, "tent": 1, "verd": 1, "vern": 1
    },
    "ro": {
      "id": 1, "s": 1, "ug": 1, "uss": 1
    },
    "rô": {
      "t": 1
    },
    "ru": {
      "g": 1
    },


    //     S
    // ===========
    "sa": {
      "is": 1, "l": 1, "ur": 1
    },
    "se": {
      "rt": 1
    },
    "sé": {
      "v": 1
    },
    "su": {
      "b": 1, "bvert": 1, "renchér": 1, "rg": 1, "rinvest": 1
    },

    //    T
    // =========
    "ta": {
      "p": 1, "r": 1
    },
    "te": {
      "rn": 1
    },
    "ti": {
      "éd": 1
    },
    "tr": {
      "ah": 1, "ans": 1, "avest": 1
    },

    //  U
    // =========
    "un": {
      "": 1
    },

    //    V
    // =========
    "va": {
      "g": 1
    },
    "ve": {
      "rd": 1, "rn": 1
    },
    "vi": {
      "eill": 1
    },
    "vo": {
      "m": 1
    },
    "vr": {
      "omb": 1
    }

  };

  /**
   * An object to be a midium between different functions
   * @type {Object}
   */
  let verbInfo = {
    /**
     * The verb
     * @type {String}
     */
    verb: "",
    /**
     * The group of the verb
     * @type {Number}
     */
    group: 0
  };

  /**
   * Get the verbs group: 1, 2 or 3. You have to verify for irregular verbs:
   * être, avoir, aller; Since they are not considered here.
   * @method getVerbGroupe
   * @param  {string}    verb the verb
   */
  function verbGroup(verb) {

    if (verbInfo.verb === verb) return;

    verbInfo.verb = verb;

    if (verb.endsWith("er")) {
      verbInfo.group = 1;
      return;
    }

    if (verb.endsWith("ir") && verb.length > 3) {
      let idx = verbs2g[verb.slice(0, 2)];
      verb = verb.slice(2, -2);
      if (idx && idx[verb]) {
        verbInfo.group = 2;
        return;
      }
    }

    verbInfo.group = 3;

  }



  //Override conjugate function
  //TODO french conjugation
  Me.conjugate = function(verb, opts) {

    verbGroup(verb);

    return "";

  };

  //=========================================================
  //                 STEMMERS
  //=========================================================

  //http://snowball.tartarus.org/algorithms/french/stemmer.html
  const vowels = "aeiouyâàëéêèïîôûù";

  //TODO complete snowball stemmer
  function snowballStemmer(word) {

    //The word must be lower case
    //============================
    word = word.toLowerCase();

    //vowel marking: considering some vowels as cosonents
    //===================================================
    //TODO these are in conflict; fix may be using a loop rather than regexp
    word = word.replace("qu", "qU");
    word = word.replace(new RegExp("([" + vowels + "])([ui])([" + vowels + "])", "g"),
    function(match, p1, p2, p3, offset, string) {
      return p1 + p2.toUpperCase() + p3;
    }
    );
    word = word.replace(new RegExp("([" + vowels + "])y", "g"), "$1Y");
    word = word.replace(new RegExp("y([" + vowels + "])", "g"), "Y$1");


    //mark regions
    //============
    let rv = "", r1 = "", r2 = "";
    let m;
    let reg = new RegExp("^[" + vowels + "]{2}.(.*)$");
    if ((m = reg.exec(word)) != null) { //the word starts with two vowels
      rv = m[1];
    }
    else { //The word don't start with two vowels
      reg = new RegExp("^(par|col|tap)(.*)$");
      if ((m = reg.exec(word)) != null) rv = m[2];//if it starts with par, col or tap
      else { //otherwise, it's the string after the first vowel with is not a starting one
        reg = new RegExp("^.[^" + vowels + "]*" + "[" + vowels + "]" + "(.*)$");
        if ((m = reg.exec(word)) != null) rv = m[1];
      }
    }

    //R1 is the region after the first non-vowel following a vowel,
    //or the end of the word if there is no such non-vowel.
    reg = new RegExp("^[^" + vowels + "]*[" + vowels + "]+[^" + vowels + "](.*)$");
    if ((m = reg.exec(word)) != null) r1 = m[1];

    //R2 is the region after the first non-vowel following a vowel in R1,
    //or the end of the word if there is no such non-vowel
    if ((m = reg.exec(r1)) != null) r2 = m[1];

    //console.log("rv= " + rv + ", r1= " + r1 + ", r2= " + r2);


    let pastWord = word;
    //Step 1
    let  processed = step1(word, rv, r1, r2);
    //console.log(processed);
    word = processed.stem;

    //console.log("step1 word= " + word);

    if (processed.next) {
      word = step2(word, rv, r2);
    }

    //console.log("step2 word= " + word);

    if (word != pastWord) {
      //step3
      word = step3(word);
    }

    //console.log("step3 word= " + word);

    //The word hasn't been altered in any step
    if (word === pastWord) {
      //step4
      word = step4(word, rv, r2);
    }

    //console.log("step4 word= " + word);

    //Step 5: Undouble
    //If the word ends enn, onn, ett, ell or eill, delete the last letter
    if (/(?:enn|onn|ett|ei?ll)$/.test(word)) word = word.slice(0, -1);

    //Step 6: Un-accent
    //If the words ends é or è followed by at least one non-vowel, remove the accent from the e.
    word = word.replace(new RegExp("[éè]([^" + vowels + "]+)$"), "e$1");

    return word.toLowerCase();
  }

  function step4(word, rv, r2) {
    //If the word ends s, not preceded by a, i, o, u, è or s, delete it.
    if(/[^aiouès]s$/.test(word)) word = word.slice(0, -1);

    //ion
    if (r2.endsWith("ion") && /ion[st]$/.test(rv)) return word.slice(0, -3);
    //ier   ière   Ier   Ière
    {
      let m, reg = new RegExp("^.*([iI](?:er|ère))$");
      if ((m = reg.exec(word)) != null && rv.endsWith(m[1])) return word.slice(0, -m[1].length) + "i";
    }

    //e in rv too
    if (word.endsWith("e")) return word.slice(0, -1);

    //&& rv.endsWith("e")
    if (word.endsWith("gue")) return word.slice(0, -1);


    return word;

  }

  function step3(word) {
    if (word.endsWith("Y")) return word.slice(0, -1) + "i";
    if (word.endsWith("ç")) return word.slice(0, -1) + "c";
    return word;
  }

  //Verb suffixes removal
  function step2(word, rv, r2) {
    let m, reg;

    //Step 2a: Verb suffixes beginning i
    //Search for the longest among the following suffixes and if found, delete if preceded by a non-vowel.
    //îmes   ît   îtes   i   ie   ies   ir   ira   irai   iraIent   irais
    //  irait   iras   irent   irez   iriez   irions   irons   iront   is
    //  issaIent   issais   issait   issant   issante   issantes   issants
    //   isse   issent   isses   issez   issiez   issions   issons   it
    reg = new RegExp("(îmes|ît|it|îtes|ie?s?|i[rst]|ir(?:as?|ai|ont)|iss(?:ante?s?|es?)|(ir|iss)(?:ai[st]|aIent|i?ons|i?ez|ent))$");
    if ((m = reg.exec(word)) != null) {
      if ((new RegExp("[^" + vowels + "]" + m[1])).test(rv)) return word.slice(0, -m[1].length);
    }

    //Step 2b: Other verb suffixes
    //ions: delete if in R2
    if (word.endsWith("ions") && r2.endsWith("ions")) return word.slice(0, -4);
    //é   ée   ées   és   èrent   er   era   erai   eraIent   erais   erait
    //eras   erez   eriez   erions   erons   eront   ez   iez
    reg = new RegExp("^.*(er|i?ez|èrent|ée?s?|er(?:as?|ai[st]?|i?ez|i?ons|ont|aIent))$");
    if ((m = reg.exec(word)) != null) {
      if (rv.indexOf(m[1]) > -1) return word.slice(0, -m[1].length);
    }
    //âmes   ât   âtes   a   ai   aIent   ais   ait   ant   ante   antes   ants
    //as   asse   assent   asses   assiez   assions
    reg = new RegExp("^.*(ât|â[tm]es|as?|ai[st]?|ante?s?|aIent|ass(?:es?|ent|iez|ions))$");
    if ((m = reg.exec(word)) != null && rv.indexOf(m[1]) > -1) {
      word = word.slice(0, -m[1].length);
      //if preceded by e, delete
      if (word.endsWith("e") && rv.indexOf("e" + m[1]) > -1) return word.slice(0, -1);
      return word;
    }


    return word;
  }

  //Standard suffix removal
  function step1(word, rv, r1, r2) {
    let m, reg;

    //ance   iqUe   isme   able   iste   eux   ances   iqUes   ismes   ables   istes
    reg = new RegExp("^.*(eux|ances?|iqUes?|ismes?|ables?|istes?)$");
    if ((m = reg.exec(word)) != null) {
      if (r2.endsWith(m[1])) return {stem:word.slice(0, -m[1].length), next:false};
    }

    //atrice   ateur   ation   atrices   ateurs   ations
    reg = new RegExp("^.*(atrices?|ateurs?|ations?)$");
    if ((m = reg.exec(word)) != null) {
      if (r2.endsWith(m[1])) {
        word = word.slice(0, -m[1].length);
        if (!word.endsWith("ic")) return {stem:word, next:false};
        if (r2.endsWith("ic" + m[1])) return {stem:word.slice(0, -2), next:false};
        return {stem:word.slice(0, -1) + "qU", next:false};
      }
    }

    //logie   logies
    reg = new RegExp("^.*log(ies?)$");
    if ((m = reg.exec(word)) != null) {
      if (r2.endsWith("log" + m[1])) return {stem:word.slice(0, -m[1].length), next:false};
    }

    //usion   ution   usions   utions
    reg = new RegExp("^.*u(sions?|tions?)$");
    if ((m = reg.exec(word)) != null) {
      if (r2.endsWith("u" + m[1])) return {stem:word.slice(0, -m[1].length), next:false};
    }

    //ence   ences
    reg = new RegExp("^.*en(ces?)$");
    if ((m = reg.exec(word)) != null) {
      if (r2.endsWith("en" + m[1])) return {stem:word.slice(0, -m[1].length) + "t", next:false};
    }

    //ement   ements
    reg = new RegExp("^.*(ements?)$");
    if ((m = reg.exec(word)) != null && rv.endsWith(m[1])) {
        //delete if in RV
        word = word.slice(0, -m[1].length);
        //if preceded by iv, delete if in R2 (and if further preceded by at, delete if in R2)
        if (r2.endsWith("iv" + m[1])) {//here word.endsWith("iv") ommited since r2 is the end
          word = word.slice(0, -2);
          if (r2.endsWith("ivat" + m[1])) return {stem:word.slice(0, -2), next:false};
          return {stem:word, next:false};
        }
        //if preceded by eus, delete if in R2, else replace by eux if in R1, otherwise,
        if (word.endsWith("eus")) {
          if (r2.endsWith("eus" + m[1])) return {stem:word.slice(0, -3), next:false};
          if (r2.endsWith("eus" + m[1])) return {stem:word.slice(0, -1) + "x", next:false};
        }
        //if preceded by abl or iqU, delete if in R2, otherwise,
        if ( (new RegExp("^.*(abl|iqU)" + m[1] + "$")).test(r2)) {
          return {stem:word.slice(0, -3), next:false};
        }
        //if preceded by ièr or Ièr, replace by i if in RV
        if ( (new RegExp("^.*[iI]èr" + m[1] + "$")).test(rv)) {
          return {stem:word.slice(0, -3) + "i", next:false};
        }
        //otherwise
        return {stem:word, next:false};
    }//end ement(s)

    //ité   ités
    reg = new RegExp("^.*(ités?)$");
    if ((m = reg.exec(word)) != null && r2.endsWith(m[1])) {
      //delete if in R2
      word = word.slice(0, -m[1].length);
      //if preceded by abil, delete if in R2, else replace by abl
      if (word.endsWith("abil")){
        if (r2.endsWith("abil" + m[1])) return {stem:word.slice(0, -4), next:false};
        return {stem:word.slice(0, -2) + "l", next:false};
      }
      //if preceded by ic, delete if in R2, else replace by iqU
      if (word.endsWith("ic")){
        word = word.slice(0, -2);
        if (r2.endsWith("ic" + m[1])) return {stem:word, next:false};
        return {stem:word + "iqU", next:false};
      }
      //if preceded by iv, delete if in R2
      if (r2.endsWith("iv" + m[1])) return {stem:word.slice(0, -2), next:false};
      //otherwise
      return {stem:word, next:false};
    }

    //if ive ifs ives
    reg = new RegExp("^.*(ifs?|ives?)$");
    if ((m = reg.exec(word)) != null && r2.endsWith(m[1])) {
      //delete if in R2
      word = word.slice(0, -m[1].length);
      //if preceded by at, delete if in R2
      if (r2.endsWith("at" + m[1])) {
        word = word.slice(0, 2);
        if (! word.endsWith("ic")) return {stem:word, next:false};
        //and if further preceded by ic, delete if in R2, else replace by iqU
        word = word.slice(0, 2);
        if (r2.endsWith("icat" + m[1])) return {stem:word, next:false};
        return {stem:word + "iqU", next:false};
      }
    }

    //eaux
    if (word.endsWith("eaux")) return {stem:word.slice(0, -1), next:false};

    //aux replace with al if in R1
    if (r1.endsWith("aux")) return {stem:word.slice(0, -2) + "l", next:false};

    //euse euses
    reg = new RegExp("^.*(euses?)$");
    if ((m = reg.exec(word)) != null) {
      //delete if in R2
      if (r2.endsWith(m[1])) return {stem:word.slice(0, -m[1].length), next:false};
      //else replace by eux if in R1
      if (r1.endsWith(m[1])) return {stem:word.slice(0, 2-m[1].length) + "x", next:false};
    }

    //issement issements
    reg = new RegExp("^.*[^" + vowels + "](issements?)$");
    if ((m = reg.exec(word)) != null) {
      //delete if in R1 and preceded by a non-vowel
      if (r1.endsWith(m[1])) return {stem:word.slice(0, -m[1].length), next:false};
    }

    // amment, emment
    reg = new RegExp("^.*([ae])mment$");
    if ((m = reg.exec(word)) != null) {
      //replace with ant, ent if in RV
      if (rv.endsWith(m[1] + "mment")) return {stem:word.slice(0, -5) + "nt", next:false};
    }

    // ment ments
    reg = new RegExp("^.*(ments?)$");
    if ((m = reg.exec(word)) != null) {
      //delete if preceded by a vowel in RV
      if ((new RegExp("^.*[" + vowels + "]" + m[1]) + "$").test(rv)) return {stem:word.slice(0, -m[1].length), next:false};
    }

    return {stem:word, next:true};
  }

  //TODO normalization of words
  Me.normalize = function(word, _opts){
    return word;
  };


}());
