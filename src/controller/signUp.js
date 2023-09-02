// express router
const express = require('express');
const router = express.Router();

//env
const PATH = process.env.SERVER_PATH;
const DOMAIN = process.env.SERVER_DOMAIN ?? "";

// model
const { register } = require(PATH + '/src/model/account');

router.post('/', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;
        const phoneNumber = req.body.phoneNumber;
        const imageUrl = DOMAIN + "/image/defaultImage.jpg";
        const [data, status] = await register(email, password, name, phoneNumber, imageUrl);
        switch (status) {
            case "SUCCESS":
                res.json({ state: "SUCCESS" });
                break;
            case "FAILURE":
                res.json({ state: "FAILURE", data });
                break;
            default:
                throw data;
        }
    } catch (err) {
        console.error(err);
        res.status(500);
        res.json({ state: "ERROR" });
    }
});

module.exports = router;