const request = require('supertest');

require('dotenv').config();

/**
 * Attempt to create a new tile with missing parameter: tileData
 */
describe('POST /api/tile/newTile', () => {
    it('Should add a Tile to the database', async () => {
        const res = await request('http://pieces-316.herokuapp.com').post('/api/tile/newTile').send({
            "tilesetId": "6355e171286afe702190fe10",
            "height": 64,
            "width": 64,
            "userId": "6355e171286afe702190fe10"
        });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("You must provide a tilesetId, height, tileData, and width");
    });
});

/**
 * Attempt to create a new tile with missing parameter: userId
 */
describe('POST /api/tile/newTile', () => {
    it('Should add a Tile to the database', async () => {
        const res = await request('http://pieces-316.herokuapp.com').post('/api/tile/newTile').send({
            "tilesetId": "6355e171286afe702190fe10",
            "height": 64,
            "width": 64,
            "tileData": ["rgba(0,0,0,0)"]
        });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("You must provide a tilesetId, height, tileData, and width");
    });
});

/**
 * Attempt to create a new tile with missing parameter: width
*/
describe('POST /api/tile/newTile', () => {
    it('Should add a Tile to the database', async () => {
        const res = await request('http://pieces-316.herokuapp.com').post('/api/tile/newTile').send({
            "height": 64,
            "userId": "6355e171286afe702190fe10",
            "tileData": ["rgba(0,0,0,0)"]
        });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("You must provide a tilesetId, height, tileData, and width");
    });
});

/**
 * Attempt to create a new tile with missing parameter: height
*/
describe('POST /api/tile/newTile', () => {
    it('Should add a Tile to the database', async () => {
        const res = await request('http://pieces-316.herokuapp.com').post('/api/tile/newTile').send({
            "width": 64,
            "userId": "6355e171286afe702190fe10",
            "tileData": ["rgba(0,0,0,0)"]
        });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("You must provide a tilesetId, height, tileData, and width");
    });
});

/**
 * Attempt to create a new tile with missing parameter: all
*/
describe('POST /api/tile/newTile', () => {
    it('Should add a Tile to the database', async () => {
        const res = await request('http://pieces-316.herokuapp.com').post('/api/tile/newTile').send({

        });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("You must provide a tilesetId, height, tileData, and width");
    });
});

/**
 * Attempt to create a new tile with negative height
*/
describe('POST /api/tile/newTile', () => {
    it('Should add a Tile to the database', async () => {
        const res = await request('http://pieces-316.herokuapp.com').post('/api/tile/newTile').send({
            "height": -15,
            "width": 64,
            "userId": "6355e171286afe702190fe10",
            "tilesetId": "6355e171286afe702190fe10",
            "tileData": ["rgba(0,0,0,0)"]
        });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Height and width must be greater than 0");
    });
});

/**
 * Attempt to create a new tile with 0 height
*/
describe('POST /api/tile/newTile', () => {
    it('Should add a Tile to the database', async () => {
        const res = await request('http://pieces-316.herokuapp.com').post('/api/tile/newTile').send({
            "height": 0,
            "width": 64,
            "userId": "6355e171286afe702190fe10",
            "tilesetId": "6355e171286afe702190fe10",
            "tileData": ["rgba(0,0,0,0)"]
        });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("You must provide a tilesetId, height, tileData, and width");
    });
});

/**
 * Attempt to create a new tile with negative width
*/
describe('POST /api/tile/newTile', () => {
    it('Should add a Tile to the database', async () => {
        const res = await request('http://pieces-316.herokuapp.com').post('/api/tile/newTile').send({
            "height": 64,
            "width": -15,
            "userId": "6355e171286afe702190fe10",
            "tilesetId": "6355e171286afe702190fe10",
            "tileData": ["rgba(0,0,0,0)"]
        });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Height and width must be greater than 0");
    });
});

/**
 * Attempt to create a new tile with 0 width
*/
describe('POST /api/tile/newTile', () => {
    it('Should add a Tile to the database', async () => {
        const res = await request('http://pieces-316.herokuapp.com').post('/api/tile/newTile').send({
            "height": 64,
            "width": 0,
            "userId": "6355e171286afe702190fe10",
            "tilesetId": "6355e171286afe702190fe10",
            "tileData": ["rgba(0,0,0,0)"]
        });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("You must provide a tilesetId, height, tileData, and width");
    });
});

/**
 * Attempt to create a new tile with too large height
*/
describe('POST /api/tile/newTile', () => {
    it('Should add a Tile to the database', async () => {
        const res = await request('http://pieces-316.herokuapp.com').post('/api/tile/newTile').send({
            "height": 1252,
            "width": 64,
            "userId": "6355e171286afe702190fe10",
            "tilesetId": "6355e171286afe702190fe10",
            "tileData": ["rgba(0,0,0,0)"]
        });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Height and width must be less than 100");
    });
});

/**
 * Attempt to create a new tile with too large width
*/
describe('POST /api/tile/newTile', () => {
    it('Should add a Tile to the database', async () => {
        const res = await request('http://pieces-316.herokuapp.com').post('/api/tile/newTile').send({
            "height": 64,
            "width": 1252,
            "userId": "6355e171286afe702190fe10",
            "tilesetId": "6355e171286afe702190fe10",
            "tileData": ["rgba(0,0,0,0)"]
        });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Height and width must be less than 100");
    });
});

/**
 * Attempt to create a new tile from an unknown user
 */
describe('POST /api/tile/newTile', () => {
    it('Should add a Tile to the database', async () => {
        const res = await request('http://pieces-316.herokuapp.com').post('/api/tile/newTile').send({
            "height": 64,
            "width": 64,
            "userId": "6355e171286afe702190fe11",
            "tilesetId": "6355e171286afe702190fe10",
            "tileData": ["rgba(0,0,0,0)"]
        });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Tileset not found");
    });
});

/**
 * Attempt to create a new tile with all parameters
*/
/**
describe('POST /api/tile/newTile', () => {
    it('Should add a Tile to the database', async () => {
        const res = await request('http://pieces-316.herokuapp.com').post('/api/tile/newTile').send({
            "height": 22,
            "width": 22,
            "userId": "6356e452281db1470ee812cb",
            "tilesetId": "6356e373281db1470ee812c8",
            "tileData": ["rgba(0,0,0,0)"]
        });
        expect(res.status).toBe(201);
        expect(res.body.error).toBe("Tile created!");
        expect(res.body.id).toBeDefined();
    });
});
*/