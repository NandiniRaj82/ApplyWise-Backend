const router = require("express").Router();
const usersController = require("./Controller/user_controller.js");
const dataController = require("./Controller/data_controller.js");

router.post("/api/v1/users/add-user", usersController.userSignup);
router.post("/api/v1/users/login",usersController.login);


router.post("/api/v1/data/add-data",dataController.addInternships);
router.get("/api/v1/data/show-data",dataController.showInternships);


module.exports = router;