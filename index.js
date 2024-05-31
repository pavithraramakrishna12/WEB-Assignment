const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = "mongodb+srv://pavithra:pavi1210@nodeapi.gkff3he.mongodb.net/?retryWrites=true&w=majority&appName=NodeAPI";

const studentSchema = new mongoose.Schema({
    name: String,
    age: Number,
    grade: String
});

const Student = mongoose.model('Student', studentSchema);

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

async function connectToDatabase() {
    try {
        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

connectToDatabase();

app.post('/addStudent', async (req, res) => {
    const { name, age, grade } = req.body;
    console.log('Received request to add student:', { name, age, grade });
    try {
        const student = new Student({ name, age, grade });
        const result = await student.save();
        res.json({ message: "Student added successfully", insertedId: result._id });
    } catch (error) {
        console.error("Error adding student:", error);
        res.status(500).json({ error: "Failed to add student" });
    }
});

app.get('/students', async (req, res) => {
    try {
        const students = await Student.find({});
        res.json(students);
    } catch (error) {
        console.error("Error retrieving students:", error);
        res.status(500).json({ error: "Failed to retrieve students" });
    }
});

app.get('/studentData', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'studentData.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

