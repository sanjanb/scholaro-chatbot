const mongoose = require("mongoose");
const OpenAI = require("openai");
const College = require("./models/College");
const Scholarship = require("./models/Scholarship");
require("dotenv").config();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/student-eligibility-db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Generate comprehensive college data with strict schema compliance
async function generateCollegesAI(category = "Engineering", count = 10) {
  console.log(`🤖 Generating ${count} ${category} colleges with OpenAI...`);

  const prompt = `
Generate ${count} realistic Indian ${category} colleges with EXACT schema compliance.

STRICT REQUIREMENTS:
- Every college must have ALL required fields
- Follow the exact JSON structure
- Use realistic Indian data
- Include diverse locations across India
- Mix of government and private institutions

Required JSON Schema:
{
  "name": "College Name",
  "location": {
    "city": "City Name", 
    "state": "State Name",
    "pincode": "123456"
  },
  "type": "Central" | "State" | "Private" | "Deemed",
  "courses": [
    {
      "name": "Course Name",
      "stream": "Engineering" | "Medical" | "Commerce" | "Arts" | "Management" | "Law" | "Science",
      "duration": "4 years",
      "fees": {
        "tuition": 200000,
        "hostel": 50000,
        "other": 25000
      },
      "eligibilityPercentage": {
        "general": 75,
        "obc": 68,
        "sc": 65,
        "st": 65
      },
      "seats": 120
    }
  ],
  "eligibilityCriteria": {
    "minimumPercentage": {
      "general": 70,
      "obc": 63,
      "sc": 60,
      "st": 60
    },
    "entranceExam": "JEE Main",
    "ageLimit": 23,
    "stream": ["Science", "Engineering"]
  },
  "contactInfo": {
    "website": "https://example.edu.in",
    "phone": "+91-11-12345678",
    "email": "admissions@example.edu.in"
  },
  "ranking": {
    "nirf": 25
  }
}

Generate ${count} colleges for ${category} stream. Return ONLY the JSON array, no additional text.
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a database generator for Indian colleges. Return ONLY valid JSON array with no additional text or formatting. Ensure all required fields are present.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 3500,
      temperature: 0.8,
    });

    let aiData = response.choices[0].message.content;

    // Clean up the response to extract JSON
    aiData = aiData.replace(/```json/g, "").replace(/```/g, "");
    aiData = aiData.trim();

    console.log("AI Response Preview:", aiData.substring(0, 500) + "...");

    let colleges;
    try {
      colleges = JSON.parse(aiData);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError.message);
      console.error("Raw response:", aiData);
      return 0;
    }

    if (!Array.isArray(colleges)) {
      console.error("❌ Response is not an array");
      return 0;
    }

    console.log(`✅ Generated ${colleges.length} colleges`);

    let saved = 0;
    // Save to database with validation
    for (const collegeData of colleges) {
      try {
        // Validate required fields
        if (!collegeData.name || !collegeData.location || !collegeData.type) {
          console.error(
            `❌ Missing required fields for college: ${
              collegeData.name || "Unknown"
            }`
          );
          continue;
        }

        // Check for duplicates
        const existingCollege = await College.findOne({
          name: collegeData.name,
        });
        if (existingCollege) {
          console.log(`⚠️ Skipped duplicate: ${collegeData.name}`);
          continue;
        }

        const college = new College(collegeData);
        await college.save();
        console.log(`✅ Saved: ${collegeData.name}`);
        saved++;
      } catch (error) {
        console.error(`❌ Error saving ${collegeData.name}:`, error.message);
      }
    }

    return saved;
  } catch (error) {
    console.error("❌ Error generating colleges:", error);
    return 0;
  }
}

// Generate scholarships with AI
async function generateScholarshipsAI(count = 15) {
  console.log(`🤖 Generating ${count} scholarships with OpenAI...`);

  const prompt = `
Generate ${count} realistic Indian scholarships with EXACT schema compliance.

Required JSON Schema:
{
  "name": "Scholarship Name",
  "provider": "Government" | "Corporate" | "Trust" | "NGO",
  "type": "Merit-based" | "Need-based" | "Category-based" | "Sports-based",
  "amount": {
    "value": 50000,
    "currency": "INR",
    "type": "Annual" | "One-time" | "Monthly"
  },
  "eligibilityCriteria": {
    "academicPercentage": {
      "minimum": 60,
      "maximum": 100
    },
    "familyIncome": {
      "maximum": 500000,
      "currency": "INR"
    },
    "age": {
      "minimum": 16,
      "maximum": 25
    },
    "category": ["General", "SC", "ST", "OBC", "Minority", "All"],
    "stream": ["All"] | ["Engineering", "Medical", "Arts"],
    "educationLevel": ["12th", "Undergraduate", "Postgraduate"],
    "state": [] | ["Punjab", "Delhi"],
    "gender": "All" | "Male" | "Female"
  },
  "applicationDetails": {
    "startDate": "2024-04-01T00:00:00.000Z",
    "endDate": "2024-06-30T00:00:00.000Z",
    "applicationMode": "Online" | "Offline",
    "website": "https://scholarships.gov.in",
    "documentsRequired": ["Income certificate", "Academic certificates"],
    "selectionProcess": "Merit-based selection"
  },
  "benefits": {
    "description": "Financial assistance for education",
    "additionalBenefits": ["Books allowance", "Hostel fees"]
  }
}

Generate ${count} diverse scholarships. Include government, corporate, and category-based scholarships.
Return ONLY the JSON array, no additional text.
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a database generator for Indian scholarships. Return ONLY valid JSON array with no additional text. Ensure all required fields are present.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 3500,
      temperature: 0.8,
    });

    let aiData = response.choices[0].message.content;

    // Clean up the response
    aiData = aiData.replace(/```json/g, "").replace(/```/g, "");
    aiData = aiData.trim();

    console.log("AI Response Preview:", aiData.substring(0, 500) + "...");

    let scholarships;
    try {
      scholarships = JSON.parse(aiData);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError.message);
      return 0;
    }

    if (!Array.isArray(scholarships)) {
      console.error("❌ Response is not an array");
      return 0;
    }

    console.log(`✅ Generated ${scholarships.length} scholarships`);

    let saved = 0;
    // Save to database
    for (const scholarshipData of scholarships) {
      try {
        // Check for duplicates
        const existingScholarship = await Scholarship.findOne({
          name: scholarshipData.name,
        });
        if (existingScholarship) {
          console.log(`⚠️ Skipped duplicate: ${scholarshipData.name}`);
          continue;
        }

        const scholarship = new Scholarship(scholarshipData);
        await scholarship.save();
        console.log(`✅ Saved: ${scholarshipData.name}`);
        saved++;
      } catch (error) {
        console.error(
          `❌ Error saving ${scholarshipData.name}:`,
          error.message
        );
      }
    }

    return saved;
  } catch (error) {
    console.error("❌ Error generating scholarships:", error);
    return 0;
  }
}

// Generate specific category data
async function generateByCategory() {
  console.log("🌟 Generating data by categories...");

  const categories = [
    { type: "Engineering", count: 8 },
    { type: "Medical", count: 6 },
    { type: "Management", count: 5 },
    { type: "Arts", count: 4 },
    { type: "Law", count: 3 },
    { type: "Science", count: 4 },
  ];

  let totalColleges = 0;

  for (const category of categories) {
    console.log(`\n📚 Generating ${category.type} colleges...`);
    const saved = await generateCollegesAI(category.type, category.count);
    totalColleges += saved;

    // Add a small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  console.log(`\n💰 Generating scholarships...`);
  const scholarships = await generateScholarshipsAI(20);

  return { colleges: totalColleges, scholarships };
}

// Main function
async function main() {
  try {
    console.log("🚀 Starting AI-powered data generation...");

    // Check OpenAI API key
    if (
      !process.env.OPENAI_API_KEY ||
      process.env.OPENAI_API_KEY === "your_openai_api_key_here"
    ) {
      console.error("❌ Please set your OpenAI API key in the .env file");
      process.exit(1);
    }

    // Check current data
    const currentColleges = await College.countDocuments();
    const currentScholarships = await Scholarship.countDocuments();

    console.log(
      `📊 Current data: ${currentColleges} colleges, ${currentScholarships} scholarships`
    );

    const choice = process.argv[2] || "categories";

    let generated = { colleges: 0, scholarships: 0 };

    switch (choice) {
      case "colleges":
        generated.colleges = await generateCollegesAI("Engineering", 10);
        break;

      case "scholarships":
        generated.scholarships = await generateScholarshipsAI(15);
        break;

      case "categories":
        generated = await generateByCategory();
        break;

      default:
        console.log(
          "Usage: node generate-ai-data-v2.js [colleges|scholarships|categories]"
        );
        break;
    }

    // Final count
    const finalColleges = await College.countDocuments();
    const finalScholarships = await Scholarship.countDocuments();

    console.log("\n🎉 Generation complete!");
    console.log(
      `📊 Final data: ${finalColleges} colleges, ${finalScholarships} scholarships`
    );
    console.log(
      `➕ Added: ${generated.colleges} colleges, ${generated.scholarships} scholarships`
    );
  } catch (error) {
    console.error("❌ Fatal error:", error);
  } finally {
    mongoose.connection.close();
  }
}

// Handle command line arguments
if (require.main === module) {
  main();
}

module.exports = {
  generateCollegesAI,
  generateScholarshipsAI,
  generateByCategory,
};
