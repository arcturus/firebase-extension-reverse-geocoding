"use strict";

const config = require("./config");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const NodeGeocoder = require("node-geocoder");

const geocoderOptions = {
  provider: "google",
  apiKey: config.apiKey,
  formatter: null,
};

const geocoder = new NodeGeocoder(geocoderOptions);

let ChangeType;

(function(ChangeType) {
  ChangeType[(ChangeType["CREATE"] = 0)] = "CREATE";
  ChangeType[(ChangeType["DELETE"] = 1)] = "DELETE";
  ChangeType[(ChangeType["UPDATE"] = 2)] = "UPDATE";
})(ChangeType || (ChangeType = {}));

const getChangeType = (change) => {
  if (!change.after.exists) {
    return ChangeType.DELETE;
  }
  if (!change.before.exists) {
    return ChangeType.CREATE;
  }
  return ChangeType.UPDATE;
};

admin.initializeApp();

module.exports.fsreversegeocoding =
functions.handler.firestore.document.onWrite(
    async (change) => {
      const changeType = getChangeType(change);
      try {
        switch (changeType) {
          case ChangeType.CREATE:
            await handleCreateDocument(change.after);
            break;
          case ChangeType.DELETE:
            break;
          case ChangeType.UPDATE:
            await handleUpdateDocument(change.before, change.after);
            break;
        }
      } catch (err) {
        console.error("Firebase Reverse Geocoding error: " + err);
      }
    },
);

const handleCreateDocument = async (snapshot) => {
  await processEntry(snapshot);
};

const handleUpdateDocument = async (before, after) => {
  const {latitudeFieldName,
    longitudeFieldName,
    outputFieldName} = config;

  const latBefore = before.get(latitudeFieldName);
  const lonBefore = before.get(longitudeFieldName);

  const latAfter = after.get(latitudeFieldName);
  const lonAfter = after.get(longitudeFieldName);

  const address = after.get(outputFieldName);

  if (latBefore == latAfter && lonBefore == lonAfter && address) {
    return;
  }

  await processEntry(after);
};

const extractLatLon = (snapshot) => {
  const {latitudeFieldName, longitudeFieldName} = config;

  const lat = snapshot.get(latitudeFieldName);
  const lon = snapshot.get(longitudeFieldName);

  if (!lat || !lon) {
    return null;
  }

  return {
    lat,
    lon,
  };
};

const processEntry = async (snapshot) => {
  const point = extractLatLon(snapshot);
  if (point == null) {
    console.info("No latitude or longitude for document", snapshot);
    return;
  }

  const address = await geocoder.reverse(point);

  if (!address) {
    console.info("Could not reverse geocode", point);
    return;
  }

  await updateEntry(snapshot, address);
};

const updateEntry = async (snapshot, address) => {
  await admin.firestore().runTransaction((transaction) => {
    transaction.update(
        snapshot.ref,
        config.outputFieldName,
        address,
    );
    return Promise.resolve();
  });
};
