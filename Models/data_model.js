const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
    title: {
         type: String, 
         required: true
         },
    location: { 
        type: String, 
        required: true 
    },
    qualification: {
         type: String,
         required: true
    }
});

const intern = mongoose.model("InternData", internshipSchema    );
module.exports = {
    intern
};