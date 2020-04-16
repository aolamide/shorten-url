const mongoose = require('mongoose');
const Str = require('@supercharge/strings');

//create Url Schema (format)
const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
  },
  unique_name: {
    type: String,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Assign randomly generated unique name to unique name field.
 * Then append unique name to short url.
 */
urlSchema.pre('save', async function (next) {
  if (
    this.unique_name === '' ||
    this.unique_name === null ||
    this.unique_name === undefined
  ) {
    let uniqueNameExist = true;
    let unique_name = generateUniqueName();

    while (uniqueNameExist) {
      const dbUniqueName = await this.constructor.findOne({ unique_name });

      if (dbUniqueName) {
        unique_name = generateUniqueName();
        uniqueNameExist = true;
      } else {
        this.unique_name = unique_name;
        uniqueNameExist = false;
      }
    }
  }

  this.shortUrl = this.shortUrl + this.unique_name;
  next();
});

/**
 * Generates randome unique name.
 * @returns {String} Generated unique name.
 */
const generateUniqueName = () => {
  return Str.random(7);
};

//Use schema to create a Url model
const Url = mongoose.model('Url', urlSchema);

//Export Url Model
module.exports = Url;
