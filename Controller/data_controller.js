const { intern } = require("../Models/data_model");

exports.addInternships = async (req, res) => {
  try {
    const internships = req.body;
    console.log('Received internships data:', internships);

    if (!Array.isArray(internships)) {
      return res.status(400).json({ message: 'Invalid data format. Expected an array of internship objects.' });
    }

    const savedInternships = [];
    const ignoredInternships = [];

    for (let data of internships) {
      const { title, location, qualification } = data;

      const existingInternship = await intern.findOne({ title, location });

      if (!existingInternship) {
        const newInternship = new intern({ title, location, qualification });
        await newInternship.save();
        savedInternships.push(newInternship);
      } else {
        ignoredInternships.push({ title, location });
      }
    }

    res.status(201).json({ 
      message: 'Internship data processed successfully', 
      saved: savedInternships.length, 
      ignored: ignoredInternships.length 
    });
  } catch (error) {
    console.error('Error processing internship data:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.showInternships = async (req, res) => {
    try {
        const internships = await intern.find(); 
        res.status(200).json(internships);
    } catch (error) {
        console.error('Error fetching internships:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

