const request = require("supertest");

let tilesetName = "testTilesetJest2"
let objectIdOfDeleted = null
let ownerIdOfDeleted = null

describe("POST /api/tileset/newTileset", () => {
    afterAll(async () => {
        await request("http://pieces-316.herokuapp.com").post("/api/tileset/deleteTileset").query({
            "id": objectIdOfDeleted,
            "ownerId": ownerIdOfDeleted
        })
    });

    it("Should add a Tileset to the database", async () => {
        const res = await request("http://pieces-316.herokuapp.com").post("/api/tileset/newTileset").send({
            "tilesetName": tilesetName,
            "imagePixelHeight": 64,
            "imagePixelWidth": 64,
            "tileHeight": 8,
            "tileWidth": 8,
            "source": "testSource",
            "ownerId": "635364191c83e20194521f1e",
            "isPublic": false,
            "isLocked": false
        });
        expect(res.status).toBe(200);
        console.log(res.body)
        expect(res.body.tileset.tilesetName).toBe(tilesetName);
        expect(res.body.message).toBe("A tileset has been created!")
        objectIdOfDeleted = res.body.id.toString();
        ownerIdOfDeleted = res.body.tileset.ownerId;
    });
});

describe("POST /api/tileset/newTileset", () => {
    beforeAll(async () => {
        const res = await request("http://pieces-316.herokuapp.com").post("/api/tileset/newTileset").send({
            "tilesetName": tilesetName,
            "imagePixelHeight": 64,
            "imagePixelWidth": 64,
            "tileHeight": 8,
            "tileWidth": 8,
            "source": "testSource",
            "ownerId": "635364191c83e20194521f1e",
            "isPublic": false,
            "isLocked": false
        });
        objectIdOfDeleted = res.body.id.toString();
        ownerIdOfDeleted = res.body.tileset.ownerId;
    })

    afterAll(async () => {
        await request("http://pieces-316.herokuapp.com").post("/api/tileset/deleteTileset").query({
            "id": objectIdOfDeleted,
            "ownerId": ownerIdOfDeleted
        })
    });

    it("Should fail to add a Tileset of the same name to the database", async () => {
        const res = await request("http://pieces-316.herokuapp.com").post("/api/tileset/newTileset").send({
            "tilesetName": tilesetName,
            "imagePixelHeight": 64,
            "imagePixelWidth": 64,
            "tileHeight": 8,
            "tileWidth": 8,
            "source": "testSource",
            "ownerId": "635364191c83e20194521f1e",
            "isPublic": false,
            "isLocked": false
        });
        expect(res.status).toBe(400);
        expect(res.body.errorMessage).toBe("Another Tileset owned by the same User already has this name.")
    });
});

describe("POST /api/tileset/updateTileset", () => {
    beforeAll(async () => {
        const res = await request("http://pieces-316.herokuapp.com").post("/api/tileset/newTileset").send({
            "tilesetName": tilesetName,
            "imagePixelHeight": 64,
            "imagePixelWidth": 64,
            "tileHeight": 8,
            "tileWidth": 8,
            "source": "testSource",
            "ownerId": "635364191c83e20194521f1e",
            "isPublic": false,
            "isLocked": false
        });
        objectIdOfDeleted = res.body.id.toString();
        ownerIdOfDeleted = res.body.tileset.ownerId;
    })

    afterAll(async () => {
        await request("http://pieces-316.herokuapp.com").post("/api/tileset/deleteTileset").query({
            "id": objectIdOfDeleted,
            "ownerId": ownerIdOfDeleted
        })
    });
    
    it("Should update Tileset imagePixelHeight field", async () => {
        const res = await request("http://pieces-316.herokuapp.com").post("/api/tileset/updateTileset").send({
            "imagePixelHeight": 128,
        }).query({
            "id": objectIdOfDeleted,
            "ownerId": ownerIdOfDeleted
        });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Tileset was successfully updated")
    })
})

describe("POST /api/tileset/deleteTileset", () => {
    beforeAll(async () => {
        const res = await request("http://pieces-316.herokuapp.com").post("/api/tileset/newTileset").send({
            "tilesetName": tilesetName,
            "imagePixelHeight": 64,
            "imagePixelWidth": 64,
            "tileHeight": 8,
            "tileWidth": 8,
            "source": "testSource",
            "ownerId": "635364191c83e20194521f1e",
            "isPublic": false,
            "isLocked": false
        });
        objectIdOfDeleted = res.body.id.toString();
        ownerIdOfDeleted = res.body.tileset.ownerId;
    })
    
    it("Should delete Tileset from the database", async () => {
        const res = await request("http://pieces-316.herokuapp.com").post("/api/tileset/deleteTileset").query({
            "id": objectIdOfDeleted,
            "ownerId": ownerIdOfDeleted
        })
        expect(res.status).toBe(200);
        expect(res.body.data.tilesetName).toBe(tilesetName);
    });
});