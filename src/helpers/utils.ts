import fs from 'fs';
import mongoose from 'mongoose';
import crypto from 'crypto';

export const Utils = {
  data_get: function (arr, key, defaultValue?) {
    defaultValue = defaultValue || null;
    if (!arr || typeof arr === 'undefined') {
      return defaultValue;
    }
    if (typeof arr[key] != 'undefined' && arr[key] !== null) {
      return arr[key];
    }

    const keys = key.split('.');
    if (keys.length <= 1) {
      return defaultValue;
    }

    for (let i = 0; i < keys.length; i++) {
      const subArr = arr[keys[i]],
        keysTemp = keys;
      keysTemp.shift();

      return this.data_get(subArr, keysTemp.join('.'), defaultValue);
    }

    return defaultValue;
  },

  ObjectId: function (id) {
    if (typeof id === 'string') {
      return new mongoose.Types.ObjectId(id);
    }
    if (mongoose.Types.ObjectId.isValid(id)) {
      if (String(new mongoose.Types.ObjectId(id)) === id) {
        return id;
      } else {
        return new mongoose.Types.ObjectId(id);
      }
    }
    return id;
  },

  getImageLink: function (img, size) {
    size = size || '';
    if (img == null || img.length == 0) {
      return '';
    }

    if (img.substring(0, 4) == 'http') {
      return img;
    }
    if (size.length > 0) {
      const sizes = size.split('x');
      return (
        process.env.MEDIA_URL +
        '/resize/' +
        sizes[0] +
        '/' +
        sizes[1] +
        '/' +
        img
      );
    }
    return process.env.MEDIA_URL + img;
  },

  dateFormat: function (date, fstr, utc) {
    utc = utc ? 'getUTC' : 'get';
    return fstr.replace(/%[YmdHMS]/g, function (m) {
      switch (m) {
        case '%Y':
          return date[utc + 'FullYear'](); // no leading zeros required
        case '%m':
          m = 1 + date[utc + 'Month']();
          break;
        case '%d':
          m = date[utc + 'Date']();
          break;
        case '%H':
          m = date[utc + 'Hours']();
          break;
        case '%M':
          m = date[utc + 'Minutes']();
          break;
        case '%S':
          m = date[utc + 'Seconds']();
          break;
        default:
          return m.slice(1); // unknown code, remove %
      }
      // add leading zero if required
      return ('0' + m).slice(-2);
    });
  },

  isEmpty: function (obj) {
    if (typeof obj === 'object') {
      if (obj == null) {
        return true;
      }
      return Object.keys(obj).length === 0;
    } else if (Array.isArray(obj)) {
      return obj.length === 0;
    } else if (typeof obj === 'string') {
      return obj === 'null' || obj.length == 0;
    } else if (typeof obj === 'undefined') {
      return true;
    }

    return obj;
  },
  inArray: function (item, arr) {
    let isLike = false;
    for (let i = 0; i < arr.length; i++) {
      if (item == arr[i]) {
        isLike = true;
        break;
      }
    }
    return isLike;
  },
  validateEmail: function (email) {
    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );
    };
    const valid = validateEmail(email);
    //console.log('validateEmail', valid);

    return valid != null && valid.length > 0 ? true : false;
  },

  randomString: function (len, option) {
    option = option || {};
    const allCapsAlpha = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
    const allLowerAlpha = [...'abcdefghijklmnopqrstuvwxyz'];
    const allUniqueChars = [...'~!@#$%^&*()_+-=[]{}|;:\'",./<>?'];
    const allNumbers = [...'0123456789'];

    let base = [];
    if (option.only_number) {
      base = [...allNumbers];
    } else if (option.only_char) {
      base = [...allCapsAlpha, ...allLowerAlpha];
      if (option.include_unique) {
        base.push(...allUniqueChars);
      }
    }

    const generator = (base, len) => {
      return [...Array(len)]
        .map((i) => base[(Math.random() * base.length) | 0])
        .join('');
    };

    return generator(base, len);
  },

  randomScore: function () {
    const scores = [
      { score: [20, 30], pct: 5 }, // 20-30
      { score: [30, 40], pct: 15 }, // 30-40
      { score: [40, 50], pct: 20 }, // 40-50
      { score: [50, 60], pct: 20 }, // 40-50
      { score: [60, 70], pct: 15 }, // 40-50
      { score: [70, 80], pct: 15 }, // 40-50
      { score: [80, 90], pct: 9 }, // 40-50
      { score: [90, 100], pct: 1 }, // 40-50
    ];

    const expanded = scores.flatMap((score) => Array(score.pct).fill(score));
    const winner = expanded[Math.floor(Math.random() * expanded.length)];

    const score = this.generateRandom(winner.score[0], winner.score[1]);
    console.log('score', score);
    return score;
  },
  generateRandom: function (min = 0, max = 100) {
    // find diff
    const difference = max - min;

    // generate random number
    let rand = Math.random();

    // multiply with difference
    rand = Math.floor(rand * difference);

    // add with min value
    rand = rand + min;

    return rand;
  },
};
