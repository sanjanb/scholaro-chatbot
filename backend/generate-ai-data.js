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

// Generate colleges using OpenAI
async function generateCollegesWithAI() {
  console.log("🤖 Generating colleges with OpenAI...");

  const prompt = `
Generate 20 diverse Indian colleges and universities with complete details. Include a mix of:
- IITs, NITs, IIMs, AIIMS
- Central universities, State universities  
- Private universities
- Technical institutes, Medical colleges, Management schools

For each college, provide:
- Name, Location (city, state, pincode)
- Type (Central/State/Private/Deemed)
- NIRF ranking (realistic)
- 2-4 courses with details (name, stream, duration, fees, eligibility percentage by category, seats)
- Contact information (website, phone, email)
- Eligibility criteria (minimum percentage by category, entrance exam, age limit, streams)

Return as a JSON array. Make the data realistic and diverse across India.

Example format:
[
  {
    "name": "Indian Institute of Technology Kanpur",
    "location": {
      "city": "Kanpur",
      "state": "Uttar Pradesh",
      "pincode": "208016"
    },
    "type": "Central",
    "ranking": {
      "nirf": 4
    },
    "courses": [
      {
        "name": "B.Tech Computer Science",
        "stream": "Engineering",
        "duration": "4 years",
        "fees": {
          "tuition": 250000,
          "hostel": 55000,
          "other": 30000
        },
        "eligibilityPercentage": {
          "general": 76,
          "obc": 69,
          "sc": 66,
          "st": 66
        },
        "seats": 130
      }
    ],
    "eligibilityCriteria": {
      "minimumPercentage": {
        "general": 72,
        "obc": 65,
        "sc": 62,
        "st": 62
      },
      "entranceExam": "JEE Advanced",
      "ageLimit": 25,
      "stream": ["Science", "Engineering"]
    },
    "contactInfo": {
      "website": "https://www.iitk.ac.in",
      "phone": "+91-512-2597000",
      "email": "admissions@iitk.ac.in"
    }
  }
]
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert on Indian higher education. Generate realistic, comprehensive college data in valid JSON format.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    const aiData = response.choices[0].message.content;
    console.log("Raw AI Response:", aiData);

    // Extract JSON from response
    const jsonMatch = aiData.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No JSON array found in AI response");
    }

    const colleges = JSON.parse(jsonMatch[0]);
    console.log(`✅ Generated ${colleges.length} colleges`);

    // Save to database
    for (const collegeData of colleges) {
      try {
        const college = new College(collegeData);
        await college.save();
        console.log(`✅ Saved: ${collegeData.name}`);
      } catch (error) {
        console.error(`❌ Error saving ${collegeData.name}:`, error.message);
      }
    }

    return colleges.length;
  } catch (error) {
    console.error("❌ Error generating colleges:", error);
    throw error;
  }
}

// Generate scholarships using OpenAI
async function generateScholarshipsWithAI() {
  console.log("🤖 Generating scholarships with OpenAI...");

  const prompt = `
Generate 25 diverse Indian scholarships with complete details. Include:
- Government scholarships (central/state)
- Corporate scholarships
- Trust/Foundation scholarships
- Category-based scholarships (SC/ST/OBC/Minority)
- Merit-based scholarships
- Need-based scholarships
- Subject-specific scholarships

For each scholarship, provide:
- Name, Provider, Type
- Amount (value, currency, type - annual/one-time/monthly)
- Eligibility criteria (academic percentage, family income, age, category, stream, education level, state, gender)
- Application details (dates, mode, website, required documents, selection process)
- Benefits description and additional benefits

Return as a JSON array with realistic Indian scholarship data.

Example format:
[
  {
    "name": "Prime Minister's Scholarship Scheme",
    "provider": "Government",
    "type": "Merit-based",
    "amount": {
      "value": 36000,
      "currency": "INR",
      "type": "Annual"
    },
    "eligibilityCriteria": {
      "academicPercentage": {
        "minimum": 80,
        "maximum": 100
      },
      "familyIncome": {
        "maximum": 600000,
        "currency": "INR"
      },
      "age": {
        "minimum": 18,
        "maximum": 25
      },
      "category": ["All"],
      "stream": ["All"],
      "educationLevel": ["Undergraduate", "Postgraduate"],
      "state": [],
      "gender": "All"
    },
    "applicationDetails": {
      "startDate": "2024-04-01T00:00:00.000Z",
      "endDate": "2024-06-30T00:00:00.000Z",
      "applicationMode": "Online",
      "website": "https://scholarships.gov.in",
      "documentsRequired": ["Academic certificates", "Income certificate", "Domicile certificate"],
      "selectionProcess": "Merit and means based"
    },
    "benefits": {
      "description": "Financial assistance for higher education",
      "additionalBenefits": ["Career guidance", "Mentorship program"]
    }
  }
]
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert on Indian scholarships and financial aid. Generate realistic, comprehensive scholarship data in valid JSON format.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    const aiData = response.choices[0].message.content;
    console.log("Raw AI Response Length:", aiData.length);

    // Extract JSON from response
    const jsonMatch = aiData.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No JSON array found in AI response");
    }

    const scholarships = JSON.parse(jsonMatch[0]);
    console.log(`✅ Generated ${scholarships.length} scholarships`);

    // Save to database
    for (const scholarshipData of scholarships) {
      try {
        const scholarship = new Scholarship(scholarshipData);
        await scholarship.save();
        console.log(`✅ Saved: ${scholarshipData.name}`);
      } catch (error) {
        console.error(
          `❌ Error saving ${scholarshipData.name}:`,
          error.message
        );
      }
    }

    return scholarships.length;
  } catch (error) {
    console.error("❌ Error generating scholarships:", error);
    throw error;
  }
}

// Enhanced college data generation
async function generateEnhancedColleges() {
  console.log("🌟 Generating enhanced college data...");

  const categories = [
    "Top Engineering Colleges",
    "Medical Colleges",
    "Management Schools",
    "Liberal Arts Universities",
    "Technical Universities",
    "Agriculture Universities",
  ];

  let totalGenerated = 0;

  for (const category of categories) {
    const prompt = `
Generate 8 realistic Indian ${category.toLowerCase()} with complete details.

Requirements:
- Mix of government and private institutions
- Different states and regions
- Realistic NIRF rankings, fees, and eligibility criteria
- Multiple courses per college with detailed fee structure
- Proper contact information and entrance exam details

Return as valid JSON array format with all required fields matching the College schema.
`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are creating realistic ${category} data for India. Ensure JSON format matches the schema exactly.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 3000,
        temperature: 0.7,
      });

      const aiData = response.choices[0].message.content;
      const jsonMatch = aiData.match(/\[[\s\S]*\]/);

      if (jsonMatch) {
        const colleges = JSON.parse(jsonMatch[0]);

        for (const collegeData of colleges) {
          try {
            // Check if college already exists
            const existingCollege = await College.findOne({
              name: collegeData.name,
            });
            if (!existingCollege) {
              const college = new College(collegeData);
              await college.save();
              console.log(`✅ Saved ${category}: ${collegeData.name}`);
              totalGenerated++;
            } else {
              console.log(`⚠️ Skipped duplicate: ${collegeData.name}`);
            }
          } catch (error) {
            console.error(
              `❌ Error saving ${collegeData.name}:`,
              error.message
            );
          }
        }
      }
    } catch (error) {
      console.error(`❌ Error generating ${category}:`, error);
    }
  }

  return totalGenerated;
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

    let choice = process.argv[2] || "all";

    switch (choice) {
      case "colleges":
        await generateCollegesWithAI();
        break;

      case "scholarships":
        await generateScholarshipsWithAI();
        break;

      case "enhanced":
        await generateEnhancedColleges();
        break;

      case "all":
      default:
        console.log("📚 Generating colleges...");
        await generateEnhancedColleges();

        console.log("💰 Generating scholarships...");
        await generateScholarshipsWithAI();
        break;
    }

    // Final count
    const finalColleges = await College.countDocuments();
    const finalScholarships = await Scholarship.countDocuments();

    console.log("🎉 Generation complete!");
    console.log(
      `📊 Final data: ${finalColleges} colleges, ${finalScholarships} scholarships`
    );
    console.log(
      `➕ Added: ${finalColleges - currentColleges} colleges, ${
        finalScholarships - currentScholarships
      } scholarships`
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
  generateCollegesWithAI,
  generateScholarshipsWithAI,
  generateEnhancedColleges,
};
