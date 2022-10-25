const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");
const Request = require("fetch").Request

const { createMap }  = require('../controllers/map-controller');

require("dotenv").config();

/* Connects to the database before each test. */
// beforeEach(async () => {
//     await mongoose.connect(process.env.MONGODB_URI);
// });
  
// Closes database connection after test is finished. 
// afterEach(async () => {
//     await mongoose.connection.close();
// });

// 
describe("POST /api/map/newMap", () => {
    it("Should add a Map to the database", async () => {
        const res = await request("http://pieces-316.herokuapp.com").post("/api/map/newMap").send({
            "mapName": "JEST MAP 5",
            "mapDescription": "This map was added from a test case using Jest!!",
            "tags": ["188", "Scary"],
            "mapBackgroundColor": "#188188",
            "mapHeight": 1024,
            "mapWidth": 1024,
            "tileHeight": 64,
            "tileWidth": 64,
            "ownerId": "6355e171286afe702190fe10"
        });
        console.log(res.error)
        expect(res.status).toBe(201);
        console.log(res.body)
        expect(res.body.map.mapName).toBe("JEST MAP 5");
    });
  });

describe("POST /api/map/newMap", () => {
    it("Should add a Map to the database", async () => {
        const res = await request("http://pieces-316.herokuapp.com").post("/api/map/newMap").send({
            "mapName": "JEST MAP 6",
            "mapDescription": "This map was added from a test case using Jest!!",
            "tags": ["188", "Scary"],
            "mapBackgroundColor": "#188188",
            "mapHeight": 1024,
            "mapWidth": 1024,
            "tileHeight": 64,
            "tileWidth": 64,
            "ownerId": "6355e171286afe702190fe10"
        });
        console.log(res.error)
        expect(res.status).toBe(201);
        console.log(res.body)
        expect(res.body.map.mapName).toBe("JEST MAP 6");
    });
  });