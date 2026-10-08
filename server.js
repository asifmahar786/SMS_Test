const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ======================================
// MIDDLEWARE
// ======================================
app.use(
   {origin:process.env.FRONTEND_URL}
);
app.use(express.json());


// ======================================
// MONGODB CONNECTION
// ======================================

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((error) => {
    console.log("MongoDB Connection Error:");
    console.log(error.message);
  });
// ======================================
// STUDENT SCHEMA
// ======================================
const studentSchema = new mongoose.Schema(
  {
     id: {
      type: Number,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      trim: true
    },

    course: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// ======================================
// STUDENT MODEL
// ======================================
const Student = mongoose.model(
  "Student",
  studentSchema
);
// ======================================
// HOME ROUTE
// ======================================

app.get("/", (req, res) => {

  res.json({
    message: "Student Management API is Running"
  });

});
// ======================================
// 1. POST - ADD STUDENT
// ======================================

app.post("/students", async (req, res) => {

  try {

    const { name, email, course } = req.body;

    // Validation
    if (
      !name ||
      !email ||
      !course
    ) {

      return res.status(400).json({
        message: "Name, Email and Course are required"
      });

    }


    // New Student Create
    const student = await Student.create({

      id: id,

      name: name.trim(),

      email: email.trim(),

      course: course.trim()

    });


    res.status(201).json({

      message: "Student Added Successfully",

      student: student

    });


  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});
// ======================================
// 2. GET - ALL STUDENTS
// ======================================
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


// ======================================
// 3. GET - STUDENT BY ID
// ======================================

app.get("/students/:id", async (req, res) => {

  try {

    // URL se custom ID lena
    const id = Number(req.params.id);

    // Check ID valid hai ya nahi
    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid Student ID"
      });
    }

    // Custom numeric ID se MongoDB mein search
    const student = await Student.findOne({
      id: id
    });

    // Student nahi mila
    if (!student) {
      return res.status(404).json({
        message: "Student Not Found"
      });
    }

    // Student mil gaya
    res.status(200).json(student);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});



// ======================================
// 404 ROUTE
// ======================================
app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found"
  });
});


// ======================================
// START SERVER
// ======================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `Server is running on http://localhost:${PORT}`
  );

});

module.exports = app;