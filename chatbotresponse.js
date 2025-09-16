// chatbot.js — SuperSimpleDev compatible chatbot
// Features:
// - greeting responses (hello/hi/hey)
// - flip a coin, roll a dice (kept for compatibility)
// - "what is the date today"
// - country lookup: "capital of <country>" or "<country> capital" etc.
// - DOB parsing: "born", "my dob is", date-like text -> returns zodiac sign + 3 strengths + 3 weaknesses
// - polite fallback when not trained
// Exports Chatbot and chatbot (UMD)

const Chatbot = {
  // a small country database — add entries as you like
  countryData: {
    australia: { capital: "Canberra", continent: "Australia", code: "+61", language: "English" },
    "new zealand": { capital: "Wellington", continent: "Australia", code: "+64", language: "English, Maori" },
    thailand: { capital: "Bangkok", continent: "Asia", code: "+66", language: "Thai" },
    malaysia: { capital: "Kuala Lumpur", continent: "Asia", code: "+60", language: "Malay" },
    singapore: { capital: "Singapore", continent: "Asia", code: "+65", language: "English, Malay, Tamil, Mandarin" },
    philippines: { capital: "Manila", continent: "Asia", code: "+63", language: "Filipino, English" },
    japan: { capital: "Tokyo", continent: "Asia", code: "+81", language: "Japanese" },
    "south korea": { capital: "Seoul", continent: "Asia", code: "+82", language: "Korean" },
    china: { capital: "Beijing", continent: "Asia", code: "+86", language: "Mandarin" },
    russia: { capital: "Moscow", continent: "Europe/Asia", code: "+7", language: "Russian" },
    pakistan: { capital: "Islamabad", continent: "Asia", code: "+92", language: "Urdu" },
    india: { capital: "New Delhi", continent: "Asia", code: "+91", language: "Hindi, English" },
    afghanistan: { capital: "Kabul", continent: "Asia", code: "+93", language: "Pashto, Dari" },
    bangladesh: { capital: "Dhaka", continent: "Asia", code: "+880", language: "Bengali" },
    uae: { capital: "Abu Dhabi", continent: "Asia (Gulf)", code: "+971", language: "Arabic" },
    qatar: { capital: "Doha", continent: "Asia (Gulf)", code: "+974", language: "Arabic" },
    oman: { capital: "Muscat", continent: "Asia (Gulf)", code: "+968", language: "Arabic" },
    "saudi arabia": { capital: "Riyadh", continent: "Asia (Gulf)", code: "+966", language: "Arabic" },
    turkey: { capital: "Ankara", continent: "Europe/Asia", code: "+90", language: "Turkish" },
    germany: { capital: "Berlin", continent: "Europe", code: "+49", language: "German" },
    uk: { capital: "London", continent: "Europe", code: "+44", language: "English" },
    england: { capital: "London", continent: "Europe", code: "+44", language: "English" },
    italy: { capital: "Rome", continent: "Europe", code: "+39", language: "Italian" },
    france: { capital: "Paris", continent: "Europe", code: "+33", language: "French" },
    spain: { capital: "Madrid", continent: "Europe", code: "+34", language: "Spanish" },
    netherlands: { capital: "Amsterdam", continent: "Europe", code: "+31", language: "Dutch" },
    norway: { capital: "Oslo", continent: "Europe", code: "+47", language: "Norwegian" },
    denmark: { capital: "Copenhagen", continent: "Europe", code: "+45", language: "Danish" },
    sweden: { capital: "Stockholm", continent: "Europe", code: "+46", language: "Swedish" },
    usa: { capital: "Washington D.C.", continent: "North America", code: "+1", language: "English" },
    america: { capital: "Washington D.C.", continent: "North America", code: "+1", language: "English" },
    canada: { capital: "Ottawa", continent: "North America", code: "+1", language: "English, French" },
    brazil: { capital: "Brasília", continent: "South America", code: "+55", language: "Portuguese" },
    egypt: { capital: "Cairo", continent: "Africa", code: "+20", language: "Arabic" },
    kenya: { capital: "Nairobi", continent: "Africa", code: "+254", language: "Swahili, English" },
    nigeria: { capital: "Abuja", continent: "Africa", code: "+234", language: "English" },
    "south africa": { capital: "Pretoria", continent: "Africa", code: "+27", language: "Zulu, English, Afrikaans" },
  },
  
  zodiacProfiles: {
    aries: {
      strengths: ["Courageous", "Determined", "Confident"],
      weaknesses: ["Impulsive", "Impatient", "Short-tempered"]
    },
    taurus: {
      strengths: ["Reliable", "Patient", "Practical"],
      weaknesses: ["Stubborn", "Possessive", "Resistant to change"]
    },
    gemini: {
      strengths: ["Adaptable", "Outgoing", "Intelligent"],
      weaknesses: ["Indecisive", "Impulsive", "Inconsistent"]
    },
    cancer: {
      strengths: ["Loyal", "Empathetic", "Protective"],
      weaknesses: ["Moody", "Pessimistic", "Overly sensitive"]
    },
    leo: {
      strengths: ["Generous", "Warm-hearted", "Creative"],
      weaknesses: ["Arrogant", "Stubborn", "Domineering"]
    },
    virgo: {
      strengths: ["Analytical", "Hardworking", "Practical"],
      weaknesses: ["Overcritical", "Worrisome", "Perfectionist"]
    },
    libra: {
      strengths: ["Diplomatic", "Fair-minded", "Social"],
      weaknesses: ["Indecisive", "Avoids confrontations", "Self-pitying"]
    },
    scorpio: {
      strengths: ["Passionate", "Resourceful", "Brave"],
      weaknesses: ["Jealous", "Secretive", "Resentful"]
    },
    sagittarius: {
      strengths: ["Optimistic", "Independent", "Adventurous"],
      weaknesses: ["Irresponsible", "Tactless", "Restless"]
    },
    capricorn: {
      strengths: ["Disciplined", "Responsible", "Ambitious"],
      weaknesses: ["Pessimistic", "Stubborn", "Detached"]
    },
    aquarius: {
      strengths: ["Inventive", "Humanitarian", "Independent"],
      weaknesses: ["Unpredictable", "Detached", "Stubborn"]
    },
    pisces: {
      strengths: ["Compassionate", "Artistic", "Intuitive"],
      weaknesses: ["Over-sensitive", "Escapist", "Idealistic"]
    }
  },

  defaultResponses: {
    'hello hi': `Hello! How can I help you?`,
    'how are you': `I'm doing great! How can I help you?`,
    'flip a coin': function () {
      const randomNumber = Math.random();
      return randomNumber < 0.5 ? 'Sure! You got heads' : 'Sure! You got tails';
    },
    'roll a dice': function() {
      const diceResult = Math.floor(Math.random() * 6) + 1;
      return `Sure! You got ${diceResult}`;
    },
    'what is the date today': function () {
      const now = new Date();
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const month = months[now.getMonth()];
      const day = now.getDate();
      return `Today is ${month} ${day}`;
    },
    'thank': 'No problem! Let me know if you need help with anything else!',
  },

  additionalResponses: {},

  unsuccessfulResponse: `I am sorry — I haven't been trained to answer this question yet.`,

  emptyMessageResponse: `Sorry, it looks like your message is empty. Please send a message.`,

  /*********************
   * Utility functions
   *********************/
  compareTwoStrings: function (first, second) {
    first = first.replace(/\s+/g, '');
    second = second.replace(/\s+/g, '');

    if (first === second) return 1;
    if (first.length < 2 || second.length < 2) return 0;

    let firstBigrams = new Map();
    for (let i = 0; i < first.length - 1; i++) {
      const bigram = first.substring(i, i + 2);
      const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) + 1 : 1;
      firstBigrams.set(bigram, count);
    }

    let intersectionSize = 0;
    for (let i = 0; i < second.length - 1; i++) {
      const bigram = second.substring(i, i + 2);
      const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) : 0;
      if (count > 0) {
        firstBigrams.set(bigram, count - 1);
        intersectionSize++;
      }
    }

    return (2.0 * intersectionSize) / (first.length + second.length - 2);
  },

  stringSimilarity: function (mainString, targetStrings) {
    const ratings = [];
    let bestMatchIndex = 0;
    for (let i = 0; i < targetStrings.length; i++) {
      const currentTargetString = targetStrings[i];
      const currentRating = this.compareTwoStrings(mainString, currentTargetString);
      ratings.push({ target: currentTargetString, rating: currentRating });
      if (currentRating > ratings[bestMatchIndex].rating) {
        bestMatchIndex = i;
      }
    }
    return { ratings: ratings, bestMatch: ratings[bestMatchIndex], bestMatchIndex: bestMatchIndex };
  },

  /*********************
   * Parsing helpers
   *********************/
  _parseDateFromMessage: function (message) {
    // Try to find day and month (e.g., "5 april", "April 5", "1990-04-05", "05/04/1990", "born 5 april")
    const months = {
      january:1, february:2, march:3, april:4, may:5, june:6,
      july:7, august:8, september:9, october:10, november:11, december:12
    };

    // ISO / numeric date first (yyyy-mm-dd or dd/mm/yyyy or mm/dd/yyyy)
    const iso = message.match(/(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/);
    if (iso) {
      const y = parseInt(iso[1],10), m = parseInt(iso[2],10)-1, d = parseInt(iso[3],10);
      return new Date(y,m,d);
    }

    const slashed = message.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
    if (slashed) {
      let d = parseInt(slashed[1],10), m = parseInt(slashed[2],10)-1, y = parseInt(slashed[3],10);
      if (y < 100) y += 1900;
      return new Date(y,m,d);
    }

    // month name + day
    const monthNamePattern = new RegExp('\\b(' + Object.keys(months).join('|') + ')\\b', 'i');
    const monthMatch = message.match(monthNamePattern);
    if (monthMatch) {
      const monthName = monthMatch[1].toLowerCase();
      // find a day number near it
      const dayMatchBefore = message.match(new RegExp('(\\d{1,2})\\s+' + monthName, 'i'));
      const dayMatchAfter = message.match(new RegExp(monthName + '\\s+(\\d{1,2})', 'i'));
      let day = null;
      if (dayMatchBefore) day = parseInt(dayMatchBefore[1], 10);
      else if (dayMatchAfter) day = parseInt(dayMatchAfter[1], 10);
      if (day) {
        // use a default year (2000) if none provided — year doesn't matter for zodiac
        return new Date(2000, months[monthName]-1, day);
      }
    }

    return null;
  },

  _zodiacForDate: function (date) {
    if (!date) return null;
    const day = date.getDate();
    const month = date.getMonth() + 1; // 1-12

    // ranges inclusive start
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'pisces';
    return null;
  },

  /*********************
   * Main response logic
   *********************/
  getResponse: function (message) {
    if (!message) return this.emptyMessageResponse;

    const lower = message.toLowerCase().trim();

    // 1) If message obviously asks about a country / capital
    if (/\bcapital\b/.test(lower) || /\bcapital of\b/.test(lower) || /\bwhat is the capital\b/.test(lower) || /\bwhich is the capital\b/.test(lower)) {
      // try to find a country name in the message
      const countryKeys = Object.keys(this.countryData);
      for (let i = 0; i < countryKeys.length; i++) {
        const key = countryKeys[i];
        if (lower.includes(key)) {
          const d = this.countryData[key];
          return `${this._capitalizeWords(key)} — Capital: ${d.capital}; Continent: ${d.continent}; Country code: ${d.code}; Main language: ${d.language}.`;
        }
      }
      // fallback: try fuzzy match
      const { ratings, bestMatchIndex } = this.stringSimilarity(lower, countryKeys);
      const best = ratings[bestMatchIndex];
      if (best && best.rating > 0.3) {
        const d = this.countryData[best.target];
        return `${this._capitalizeWords(best.target)} — Capital: ${d.capital}; Continent: ${d.continent}; Country code: ${d.code}; Main language: ${d.language}.`;
      }
      return `I couldn't find that country in my database. Try writing the country name (e.g. "capital of Japan").`;
    }

    // 2) If message contains a country name directly (even without "capital")
    const countryKeys = Object.keys(this.countryData);
    for (let i = 0; i < countryKeys.length; i++) {
      const key = countryKeys[i];
      if (lower.includes(key) && /\bcapital\b/.test(lower) === false) {
        // if user just mentions a country, give short country summary
        const d = this.countryData[key];
        return `${this._capitalizeWords(key)} — Capital: ${d.capital}; Continent: ${d.continent}; Country code: ${d.code}; Main language: ${d.language}.`;
      }
    }

    // 3) If message looks like a date-of-birth question ("born", "dob", or contains a date)
    if (/\bborn\b/.test(lower) || /\bdate of birth\b/.test(lower) || /\bdob\b/.test(lower) || /\bmy birthday\b/.test(lower) || /\bwas born\b/.test(lower)) {
      const parsed = this._parseDateFromMessage(lower);
      if (!parsed) {
        return `If you'd like to know your zodiac sign and traits, tell me your date like "I was born on April 5" or "DOB 1990-04-05".`;
      }
      const zodiac = this._zodiacForDate(parsed);
      if (!zodiac) return this.unsuccessfulResponse;
      const profile = this.zodiacProfiles[zodiac];
      return `Your zodiac sign is ${this._capitalizeWords(zodiac)}. Strengths: ${profile.strengths.join(', ')}. Weaknesses: ${profile.weaknesses.join(', ')}.`;
    }

    // 4) If message is just a date string (e.g., "5 april" or "1990-04-05") -> treat as DOB
    const maybeDate = this._parseDateFromMessage(lower);
    if (maybeDate) {
      const zodiac = this._zodiacForDate(maybeDate);
      if (!zodiac) return this.unsuccessfulResponse;
      const profile = this.zodiacProfiles[zodiac];
      return `Zodiac: ${this._capitalizeWords(zodiac)}. Strengths: ${profile.strengths.join(', ')}. Weaknesses: ${profile.weaknesses.join(', ')}.`;
    }

    // 5) Greetings and other default responses (use similarity on default keys)
    const responses = { ...this.defaultResponses, ...this.additionalResponses };
    const keys = Object.keys(responses);
    const { ratings, bestMatchIndex } = this.stringSimilarity(lower, keys);
    const bestRating = ratings && ratings[bestMatchIndex] ? ratings[bestMatchIndex].rating : 0;
    if (bestRating > 0.3) {
      const bestKey = ratings[bestMatchIndex].target;
      const resp = responses[bestKey];
      if (typeof resp === 'function') return resp();
      return resp;
    }

    // 6) not understood
    return this.unsuccessfulResponse;
  },

  getResponseAsync: function (message) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getResponse(message));
      }, 600);
    });
  },

  addResponses: function (additionalResponses) {
    this.additionalResponses = {
      ...this.additionalResponses,
      ...additionalResponses
    };
  },

  /*********************
   * Small helpers
   *********************/
  _capitalizeWords: function (s) {
    return s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
};

// uuid polyfill (same approach used previously)
function uuidPolyfill() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (char) {
    const randomNumber = Math.random() * 16 | 0;
    const result = char === 'x' ? randomNumber : (randomNumber & 0x3 | 0x8);
    return result.toString(16);
  });
}

// UMD export (keeps compatibility with your setup)
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    if (typeof root.crypto === 'undefined') {
      try { root.crypto = {}; } catch (e) {}
    }
    if (root.crypto && typeof root.crypto.randomUUID !== 'function') {
      try { root.crypto.randomUUID = uuidPolyfill; } catch (e) {}
    }
    root.Chatbot = factory();
    root.chatbot = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  return Chatbot;
}));
