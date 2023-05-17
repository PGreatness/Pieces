const request = require("supertest");

let userName = "Jest Test"
let updateId = null;
let updateIdDuplicate = null;

describe("POST /api/register", () => {
    it("Add a new user to the database", async () => {
        const res = await request(process.env.PUBLIC_URL || "http://pieces-316.herokuapp.com").post("/api/register").send({
            "firstName": "Iman",
            "lastName": "Ali",
            "userName": userName,
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
        const res = await request(process.env.PUBLIC_URL || "http://pieces-316.herokuapp.com").post("/api/register").send({
            "firstName": "Imaniman",
            "userName": "imantestingali",
            "email": "iman1@stonybrook.edu",
            "password": "iman1234",
            "passwordVerify": "iman1234"
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Please enter all required fields.")
    });
});

describe("POST /api/register", () => {
    it("Register with exisiting email", async () => {
        const res = await request(process.env.PUBLIC_URL || "http://pieces-316.herokuapp.com").post("/api/register").send({
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
        const res = await request(process.env.PUBLIC_URL || "http://pieces-316.herokuapp.com").post("/api/register").send({
            "firstName": "Iman2",
            "lastName": "Ali2",
            "userName": userName,
            "email": "iman2@stonybrook.edu",
            "password": "iman1234",
            "passwordVerify": "iman1234"
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("An account with this User Name already exists.")
    });
});


describe("POST /api/register", () => {
    it("Register with invalid password (<8 char)", async () => {
        const res = await request(process.env.PUBLIC_URL || "http://pieces-316.herokuapp.com").post("/api/register").send({
            "firstName": "Iman2",
            "lastName": "Ali2",
            "userName": "username",
            "email": "iman3@stonybrook.edu",
            "password": "iman123",
            "passwordVerify": "iman123"
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Please enter a password of at least 8 characters.")
    });
});

describe("POST /api/register", () => {
    it("Register with invalid password (passwordVerify)", async () => {
        const res = await request(process.env.PUBLIC_URL || "http://pieces-316.herokuapp.com").post("/api/register").send({
            "firstName": "Iman2",
            "lastName": "Ali2",
            "userName": "username123",
            "email": "iman4@stonybrook.edu",
            "password": "iman123456",
            "passwordVerify": "iman123123"
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Please enter the same password twice.")
    });
});

describe("POST /api/updateUser", () => {
    it("Update User)", async () => {
        const res = await request(process.env.PUBLIC_URL || "http://pieces-316.herokuapp.com").post("/api/updateUser").send({
            "_id": updateId,
            "firstName": "Iman",
            "lastName": "Ali",
            "userName": "iman123",
            "email": "iman.ali@stonybrook.edu",
            "bio": "testing bio"
        });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("User has been updated!")
    });
});


describe("POST /api/changePassword", () => {
    it("Change Password)", async () => {
        const res = await request(process.env.PUBLIC_URL || "http://pieces-316.herokuapp.com").post("/api/changePassword").send({
            "email": "iman.ali@stonybrook.edu",
            "currentPassword": "iman1234",
            "newPassword": "testinttttt",
            "repeatNewPassword": "testinttttt"
        });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("User password has been changed!")
    });
});

describe("POST /api/changePassword", () => {
    it("Change Password (repeat no match))", async () => {
        const res = await request(process.env.PUBLIC_URL || "http://pieces-316.herokuapp.com").post("/api/changePassword").send({
            "email": "iman.ali@stonybrook.edu",
            "currentPassword": "iman1234",
            "newPassword": "testinttttt",
            "repeatNewPassword": "testin"
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("New Password Must Match!")
    });
});

describe("POST /api/changePassword", () => {
    it("Change Password (missing args))", async () => {
        const res = await request(process.env.PUBLIC_URL || "http://pieces-316.herokuapp.com").post("/api/changePassword").send({
            "email": "iman.ali@stonybrook.edu",
            "currentPassword": "iman1234",
            "repeatNewPassword": "testinttttt"
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Must Provide All Required Arguments to Change Password!")
    });
});

describe("POST /api/changePassword", () => {
    it("Change Password (no user))", async () => {
        const res = await request(process.env.PUBLIC_URL || "http://pieces-316.herokuapp.com").post("/api/changePassword").send({
            "email": "unknown@stonybrook.edu",
            "currentPassword": "iman1234",
            "newPassword": "testinttttt",
            "repeatNewPassword": "testinttttt"
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Account With Specified Email Not Found!")
    });
});
