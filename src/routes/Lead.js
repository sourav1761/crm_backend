// const express = require("express");
// const router = express.Router();
// const leadsController = require("../controllers/leadController");
// const leadCtrl = require("../controllers/leadController");


// router.post("/", leadCtrl.createLead);
// router.get("/", leadCtrl.getLeads);
// router.get("/:id", leadCtrl.getLeadById);
// router.patch("/:id", leadCtrl.updateLead);
// router.patch("/:id/case", leadCtrl.markCaseCompletion);

// module.exports = router;



// const express = require("express");
// const router = express.Router();
// const leadCtrl = require("../controllers/leadController");
// const leadCtrl = require("../controllers/leadController");


// router.post("/", leadCtrl.createLead);
// router.get("/", leadCtrl.getLeads);
// router.get("/:id", leadCtrl.getLeadById);
// router.patch("/:id", leadCtrl.updateLead);
// router.patch("/:id/case", leadCtrl.markCaseCompletion);

// module.exports = router;



// src/routes/Lead.js
const express = require("express");
const router = express.Router();

const leadCtrl = require("../controllers/leadController");

// CREATE lead
router.post("/", leadCtrl.createLead);

// GET all leads
router.get("/", leadCtrl.getLeads);

// GET one lead
router.get("/:id", leadCtrl.getLeadById);

// UPDATE lead
router.patch("/:id", leadCtrl.updateLead);

// MARK CASE COMPLETION
router.patch("/:id/case", leadCtrl.markCaseCompletion);

module.exports = router;
