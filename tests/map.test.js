const request = require("supertest");

// let title = "JEST 2"

// let objectIdOfDeleted = null
// let ownerIdOfDeleted = null

/* Connects to the database before each test. */
// beforeEach(async () => {
//     await mongoose.connect(process.env.MONGODB_URI);
// });
  
// Closes database connection after test is finished. 
// afterEach(async () => {
//     await mongoose.connection.close();
// });

// // ADDING MAP SUCCESS
// describe("POST /api/map/newMap", () => {

//     let mapId;
//     let ownerId;
//     let title = 'JEST 99 MAP NAME'

//     it("Should add a Map to the database", async () => {
//         const res = await request("http://pieces-316.herokuapp.com").post("/api/map/newMap").send({
//             "title": title,
//             "mapDescription": "This map will be deleted vert shortly!",
//             "tags": ["188", "Scary"],
//             "mapBackgroundColor": "#188188",
//             "mapHeight": 1024,
//             "mapWidth": 1024,
//             "tileHeight": 64,
//             "tileWidth": 64,
//             "ownerId": "6355e171286afe702190fe10"
//         });
//         expect(res.status).toBe(201);
//         expect(res.body.map.title).toBe(title);
//         mapId = res.body.id.toString();
//         ownerId = res.body.map.ownerId;
//     });

//     afterAll(async() => {
//         await request("http://pieces-316.herokuapp.com").post("/api/map/deleteMap").query({
//             "id": mapId,
//             "ownerId": ownerId
//         })
//     })

// });

// // ADDING MAP WITH SAME NAME
// describe("POST /api/map/newMap", () => {
//     it("Can't add Map with name already taken", async () => {
//         const res = await request("http://pieces-316.herokuapp.com").post("/api/map/newMap").send({
//             "title": title,
//             "mapDescription": "This map will be deleted vert shortly!",
//             "tags": ["188", "Scary"],
//             "mapBackgroundColor": "#188188",
//             "mapHeight": 1024,
//             "mapWidth": 1024,
//             "tileHeight": 64,
//             "tileWidth": 64,
//             "ownerId": "6355e171286afe702190fe10"
//         });
//         expect(res.status).toBe(400);
//         expect(res.body.message).toBe("Another Map owned by the same User already has this name");
//     });
// });

// ADDING MAP WITH NEGATIVE HEIGHT
describe("POST /api/map/newMap", () => {
    it("Can't have negative height", async () => {
        const res = await request("http://pieces-316.herokuapp.com").post("/api/map/newMap").send({
            "title": "nojwoqjwojqowqjwqo",
            "mapDescription": "This map will be deleted vert shortly!",
            "tags": ["188", "Scary"],
            "mapBackgroundColor": "#188188",
            "mapHeight": -1024,
            "mapWidth": 1024,
            "tileHeight": 64,
            "tileWidth": 64,
            "ownerId": "6355e171286afe702190fe10"
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Map can not have a height of zero or less pixels.");
    });
});

// ADDING MAP WITH NEGATIVE WIDTH
describe("POST /api/map/newMap", () => {
    it("Can't have negative width", async () => {
        const res = await request("http://pieces-316.herokuapp.com").post("/api/map/newMap").send({
            "title": "nojwoqjwojqowqjwqo",
            "mapDescription": "This map will be deleted vert shortly!",
            "tags": ["188", "Scary"],
            "mapBackgroundColor": "#188188",
            "mapHeight": 1024,
            "mapWidth": -1024,
            "tileHeight": 64,
            "tileWidth": 64,
            "ownerId": "6355e171286afe702190fe10"
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Map can not have a width of zero or less pixels.");
    });
});

// ADDING MAP WITH NEGATIVE TILE HEIGHT
describe("POST /api/map/newMap", () => {
    it("Can't have negative tile height", async () => {
        const res = await request("http://pieces-316.herokuapp.com").post("/api/map/newMap").send({
            "title": "nojwoqjwojqowqjwqo",
            "mapDescription": "This map will be deleted vert shortly!",
            "tags": ["188", "Scary"],
            "mapBackgroundColor": "#188188",
            "mapHeight": 1024,
            "mapWidth": 1024,
            "tileHeight": -64,
            "tileWidth": 64,
            "ownerId": "6355e171286afe702190fe10"
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Map can not have a height of zero or less tiles.");
    });
});

// ADDING MAP WITH NEGATIVE TILE WIDTH
describe("POST /api/map/newMap", () => {
    it("Can't have negative tile width", async () => {
        const res = await request("http://pieces-316.herokuapp.com").post("/api/map/newMap").send({
            "title": "nojwoqjwojqowqjwqo",
            "mapDescription": "This map will be deleted vert shortly!",
            "tags": ["188", "Scary"],
            "mapBackgroundColor": "#188188",
            "mapHeight": 1024,
            "mapWidth": 1024,
            "tileHeight": 64,
            "tileWidth": -64,
            "ownerId": "6355e171286afe702190fe10"
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Map can not have a width of zero or less tiles.");
    });
});

// UPDATE MAP
// describe("POST /api/map/updateMap", () => {
    
//     let mapId;
//     let ownerId;
//     let title = "JEST 98 MAP NAME"

//     beforeAll(async() => {
//         const res = await request("http://pieces-316.herokuapp.com").post("/api/map/newMap").send({
//             "title": title,
//             "mapDescription": "This map will be deleted vert shortly!",
//             "tags": ["188", "Scary"],
//             "mapBackgroundColor": "#188188",
//             "mapHeight": 1024,
//             "mapWidth": 1024,
//             "tileHeight": 64,
//             "tileWidth": 64,
//             "ownerId": "6355e171286afe702190fe10"
//         });
//         mapId = res.body.id.toString();
//         ownerId = res.body.map.ownerId;
//     })

//     afterAll(async() => {
//         await request("http://pieces-316.herokuapp.com").post("/api/map/deleteMap").query({
//             "id": mapId,
//             "ownerId": ownerId
//         })
//     })

//     it("Updated Map description field", async () => {
    
//         const res = await request("http://pieces-316.herokuapp.com").post("/api/map/updateMap").send({
//             "mapDescription": "This is the new map description",
//             "tags": ["NEW TAG"]
//         }).query({
//             "id": mapId,
//             "ownerId": ownerId
//         });
//         expect(res.status).toBe(200);
//         expect(res.body.message).toBe("Map was successfully updated")
//     })
// })

// // PUBLISH MAP
// describe("POST /api/map/publishMap", () => {
//     it("Publishes Map", async () => {
//         const res = await request("http://pieces-316.herokuapp.com").post("/api/map/publishMap").send({
//             "isPublic": true
//         }).query({
//             "id": objectIdOfDeleted,
//             "ownerId": ownerIdOfDeleted
//         });
//         // console.log(res.status)
//         // console.log(res.body)
//         expect(res.status).toBe(200);
//         expect(res.body.message).toBe("Map was successfully updated")
//     })
// })

// // DELETING MAP SUCCESS
// describe("POST /api/map/deleteMap", () => {
//     it("Should delete a Map from the database", async () => {
//         const res = await request("http://pieces-316.herokuapp.com").post("/api/map/deleteMap").query({
//             "id": objectIdOfDeleted,
//             "ownerId": ownerIdOfDeleted
//         })
//         expect(res.status).toBe(200);
//         expect(res.body.data.title).toBe(title);
//     });
// });

