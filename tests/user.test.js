const mongoose = require("mongoose");
const request = require("supertest");

require("dotenv").config();

let userName = "Jest Test"
let updateId = null;

describe("POST /api/register", () => {
    it("Add a new user to the database", async () => {
        const res = await request("http://pieces-316.herokuapp.com").post("/api/register").send({
            "firstName": "Iman",
            "lastName": "Ali",
            "userName": username,
            "email": "iman.ali@stonybrook.edu",
            "password": "iman1234",
            "passwordVerify": "iman1234"
        });
        expect(res.status).toBe(200);
        expect(res.body.user.userName).toBe(userName);
        expect(res.body.message).toBe("User has been registered!")
        updateId = res.body.user._id.toString()
    });
});

describe("POST /api/register", () => {
    it("Register without all fields", async () => {
        const res = await request("http://pieces-316.herokuapp.com").post("/api/register").send({
            "firstName": "Imaniman",
            "userName": "imantestingali",
            "email": "imantestingali@stonybrook.edu",
            "password": "iman1234",
            "passwordVerify": "iman1234"
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Please enter all required fields.")
    });
});

describe("POST /api/register", () => {
    it("Register with exisiting email", async () => {
        const res = await request("http://pieces-316.herokuapp.com").post("/api/register").send({
            "firstName": "Iman2",
            "lastName": "Ali2",
            "userName": "imantesting",
            "email": "iman.ali@stonybrook.edu",
            "password": "iman1234",
            "passwordVerify": "iman1234"
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("An account with this email address already exists.")
    });
});

describe("POST /api/register", () => {
    it("Register with exisiting username", async () => {
        const res = await request("http://pieces-316.herokuapp.com").post("/api/register").send({
            "firstName": "Iman2",
            "lastName": "Ali2",
            "userName": username,
            "email": "iman@stonybrook.edu",
            "password": "iman1234",
            "passwordVerify": "iman1234"
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("An account with this User Name already exists.")
    });
});


describe("POST /api/register", () => {
    it("Register with invalid password (<8 char)", async () => {
        const res = await request("http://pieces-316.herokuapp.com").post("/api/register").send({
            "firstName": "Iman2",
            "lastName": "Ali2",
            "userName": "username",
            "email": "imanali@stonybrook.edu",
            "password": "iman123",
            "passwordVerify": "iman123"
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Please enter a password of at least 8 characters.")
    });
});

describe("POST /api/register", () => {
    it("Register with invalid password (passwordVerify)", async () => {
        const res = await request("http://pieces-316.herokuapp.com").post("/api/register").send({
            "firstName": "Iman2",
            "lastName": "Ali2",
            "userName": "username123",
            "email": "imanali123@stonybrook.edu",
            "password": "iman123",
            "passwordVerify": "iman123123"
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Please enter the same password twice.")
    });
});

describe("POST /api/updateUser", () => {
    it("Update User)", async () => {
        const res = await request("http://pieces-316.herokuapp.com").post("/api/updateUser").send({
            "_id": updateId,
            "firstName": "Iman",
            "lastName": "Ali",
            "userName": "iman123",
            "email": "iman@gmail.com",
            "bio": "testing bio"
        });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("User has been updated!")
    });
});

