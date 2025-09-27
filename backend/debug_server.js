const express = require("express");
const mongoose = require("mongoose");
const College = require("./models/College");
const Scholarship = require("./models/Scholarship");

const app = express();
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/student-eligibility-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Test endpoint to check database
app.get("/test/colleges", async (req, res) => {
  try {
    const colleges = await College.find({}).limit(5);
    res.json({
      success: true,
      count: colleges.length,
      colleges: colleges.map((c) => ({
        name: c.name,
        location: c.location,
        minimumPercentage: c.eligibilityCriteria.minimumPercentage,
      })),
    });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Test college query endpoint
app.post("/test/query", async (req, res) => {
  try {
    const { percentage = 85, stream, category = "General", state } = req.body;

    console.log("Query parameters:", { percentage, stream, category, state });

    const query = {};
    const categoryField = `eligibilityCriteria.minimumPercentage.${category.toLowerCase()}`;
    query[categoryField] = { $lte: percentage };

    if (stream) {
      query["courses.stream"] = stream;
    }

    if (state) {
      query["location.state"] = new RegExp(state, "i");
    }

    console.log("MongoDB query:", JSON.stringify(query, null, 2));

    const colleges = await College.find(query)
      .select(
        "name location type courses eligibilityCriteria contactInfo ranking"
      )
      .limit(20)
      .sort({ "ranking.nirf": 1 });

    console.log("Raw colleges found:", colleges.length);

    // Filter courses
    const filtered = colleges.filter((college) => {
      const eligibleCourses = college.courses.filter((course) => {
        if (stream && course.stream !== stream) return false;
        const requiredPercentage =
          course.eligibilityPercentage?.[category.toLowerCase()];
        if (requiredPercentage && percentage < requiredPercentage) return false;
        return true;
      });

      if (eligibleCourses.length > 0) {
        college.courses = eligibleCourses;
        return true;
      }
      return false;
    });

    console.log("Filtered colleges:", filtered.length);

    res.json({
      success: true,
      query: { percentage, stream, category, state },
      mongoQuery: query,
      rawCount: colleges.length,
      filteredCount: filtered.length,
      colleges: filtered.map((c) => ({
        name: c.name,
        location: c.location,
        type: c.type,
        courses: c.courses,
        minimumPercentage: c.eligibilityCriteria.minimumPercentage,
      })),
    });
  } catch (error) {
    console.error("Query error:", error);
    res.json({ success: false, error: error.message, stack: error.stack });
  }
});

app.listen(8003, () => {
  console.log("Debug server running on http://localhost:8003");
  console.log("Test endpoints:");
  console.log("- GET  /test/colleges - Check database");
  console.log("- POST /test/query - Test college query");
});
