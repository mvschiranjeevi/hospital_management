
const express = require("express");
const router = express.Router();
const Insurance = require('../models/insurance');

router.post("/add-insurance/:id", async (req, res) => {
    console.log('hit!')
    try {
        const { patientId, company, type, validity, outOfThePocket, coverage } = req.body;

        const newInsurance = new Insurance({
            patientId,
            company,
            type,
            validity,
            outOfThePocket,
            coverage,
        });

        const savedInsurance = await newInsurance.save();
        res.status(201).json(savedInsurance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

});
router.get("/get-insurance/:patientId", async (req, res) => {
    try {
        const { patientId } = req.params; // Extracting patientId from URL parameters

        // Checking for a valid ObjectId to prevent potential errors when querying the database
        if (!req.params.patientId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send("Invalid Patient ID format.");
        }

        const insurances = await Insurance.find({ patientId: patientId });
        if (insurances.length === 0) {
            // If no insurance found for the patient
            return res.status(404).json({ message: "No insurances found for this patient." });
        }
        res.status(200).json(insurances);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;


