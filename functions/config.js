/**
 * This files will read all the configurable parameters
 * (via environmental variables) and will offer them through a
 *  simple object.
 */

"use strict";

module.exports.default = {
  location: process.env.LOCATION,
  latitudeFieldName: process.env.LATITUDE_FIELD_NAME,
  longitudeFieldName: process.env.LONGITUDE_FIELD_NAME,
  outputFieldName: process.env.OUTPUT_FIELD_NAME,
  apiKey: process.env.GOOGLE_MAPS_API_KEY,
};

