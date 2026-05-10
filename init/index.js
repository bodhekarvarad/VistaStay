require("dotenv").config();

const mongoose = require("mongoose");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const Listing = require("../models/listing");

const initData = require("./data.js");

const mapToken = process.env.MAPBOX_TOKEN;

const geocodingClient = mbxGeocoding({
    accessToken: mapToken,
});

const MONGO_URI = "mongodb://127.0.0.1:27017/wanderlustdb";

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URI);
}

const initDB = async () => {

    await Listing.deleteMany({});

    const listingsWithGeometry = await Promise.all(
        initData.data.map(async (obj) => {

            let response = await geocodingClient
                .forwardGeocode({
                    query: obj.location,
                    limit: 1,
                })
                .send();

            return {
                ...obj,

                owner: "69de2bddfa28adf264acfb93",

                geometry: response.body.features[0].geometry,
            };
        })
    );

    await Listing.insertMany(listingsWithGeometry);

    console.log("Data initialized");
};

initDB();