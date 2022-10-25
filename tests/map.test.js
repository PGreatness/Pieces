const mongoose = require("mongoose");
const request = require("supertest");

require("dotenv").config();

let mapName = "JEST 1"

let objectIdOfDeleted = null
let ownerIdOfDeleted = null

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
            "mapName": mapName,
            "mapDescription": "This map will be deleted vert shortly!",
            "tags": ["188", "Scary"],
            "mapBackgroundColor": "#188188",
            "mapHeight": 1024,
            "mapWidth": 1024,
            "tileHeight": 64,
            "tileWidth": 64,
            "ownerId": "6355e171286afe702190fe10"
        });
        expect(res.status).toBe(201);
        expect(res.body.map.mapName).toBe(mapName);
        objectIdOfDeleted = res.body.id.toString();
        ownerIdOfDeleted = res.body.map.ownerId;
    });
});

describe("POST /api/map/deleteMap", () => {
    console.log("POST /api/map/deleteMap")
    it("Should delete a Map from the database", async () => {
        const res = await request("http://pieces-316.herokuapp.com").post("/api/map/deleteMap").query({
            "id": objectIdOfDeleted,
            "ownerId": ownerIdOfDeleted
        })
        expect(res.status).toBe(200);
        expect(res.body.data.mapName).toBe(mapName);
    });
});