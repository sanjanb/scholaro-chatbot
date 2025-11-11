const mongoose = require("mongoose");
const Scholarship = require("./models/Scholarship");
require("dotenv").config();

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

// Comprehensive scholarship data
const comprehensiveScholarships = [
  {
    name: "Dr. A.P.J. Abdul Kalam Scholarship",
    provider: "Government",
    type: "Merit-based",
    amount: {
      value: 60000,
      currency: "INR",
      type: "Annual",
    },
    eligibilityCriteria: {
      academicPercentage: {
        minimum: 80,
        maximum: 100,
      },
      familyIncome: {
        maximum: 600000,
        currency: "INR",
      },
      age: {
        minimum: 16,
        maximum: 25,
      },
      category: ["All"],
      stream: ["Science", "Engineering"],
      educationLevel: ["12th", "Undergraduate"],
      state: [],
      gender: "All",
    },
    applicationDetails: {
      startDate: new Date("2024-04-01"),
      endDate: new Date("2024-06-30"),
      applicationMode: "Online",
      website: "https://scholarships.gov.in",
      documentsRequired: [
        "Academic certificates",
        "Income certificate",
        "Domicile certificate",
      ],
      selectionProcess: "Merit-based selection",
    },
    benefits: {
      description: "Scholarship for excellence in Science and Technology",
      additionalBenefits: ["Laptop allowance", "Books allowance"],
    },
  },
  {
    name: "Kishore Vaigyanik Protsahan Yojana (KVPY)",
    provider: "Government",
    type: "Merit-based",
    amount: {
      value: 75000,
      currency: "INR",
      type: "Annual",
    },
    eligibilityCriteria: {
      academicPercentage: {
        minimum: 75,
        maximum: 100,
      },
      familyIncome: {
        maximum: 1000000,
        currency: "INR",
      },
      age: {
        minimum: 16,
        maximum: 22,
      },
      category: ["All"],
      stream: ["Science"],
      educationLevel: ["11th", "12th", "Undergraduate"],
      state: [],
      gender: "All",
    },
    applicationDetails: {
      startDate: new Date("2024-05-01"),
      endDate: new Date("2024-07-15"),
      applicationMode: "Online",
      website: "https://kvpy.iisc.ernet.in",
      documentsRequired: [
        "Academic transcripts",
        "Age proof",
        "Category certificate",
      ],
      selectionProcess: "Written test and interview",
    },
    benefits: {
      description: "Fellowship for students pursuing basic sciences",
      additionalBenefits: ["Research opportunities", "Mentorship program"],
    },
  },
  {
    name: "Inspire Scholarship for Higher Education",
    provider: "Government",
    type: "Merit-based",
    amount: {
      value: 80000,
      currency: "INR",
      type: "Annual",
    },
    eligibilityCriteria: {
      academicPercentage: {
        minimum: 85,
        maximum: 100,
      },
      familyIncome: {
        maximum: 500000,
        currency: "INR",
      },
      age: {
        minimum: 17,
        maximum: 22,
      },
      category: ["All"],
      stream: ["Science"],
      educationLevel: ["12th", "Undergraduate"],
      state: [],
      gender: "All",
    },
    applicationDetails: {
      startDate: new Date("2024-04-15"),
      endDate: new Date("2024-06-15"),
      applicationMode: "Online",
      website: "https://inspire-dst.gov.in",
      documentsRequired: [
        "Class 12 marksheet",
        "Income certificate",
        "Bank details",
      ],
      selectionProcess: "Merit list based on 12th marks",
    },
    benefits: {
      description: "Scholarship to attract youth to study natural sciences",
      additionalBenefits: ["Summer research internship", "Career guidance"],
    },
  },
  {
    name: "Reliance Foundation Scholarship",
    provider: "Corporate",
    type: "Need-based",
    amount: {
      value: 120000,
      currency: "INR",
      type: "Annual",
    },
    eligibilityCriteria: {
      academicPercentage: {
        minimum: 60,
        maximum: 100,
      },
      familyIncome: {
        maximum: 300000,
        currency: "INR",
      },
      age: {
        minimum: 16,
        maximum: 25,
      },
      category: ["All"],
      stream: ["All"],
      educationLevel: ["12th", "Undergraduate", "Postgraduate"],
      state: [],
      gender: "All",
    },
    applicationDetails: {
      startDate: new Date("2024-03-01"),
      endDate: new Date("2024-05-31"),
      applicationMode: "Online",
      website: "https://reliancefoundation.org",
      documentsRequired: [
        "Academic records",
        "Income proof",
        "Personal statement",
      ],
      selectionProcess: "Application review and interview",
    },
    benefits: {
      description: "Comprehensive support for deserving students",
      additionalBenefits: [
        "Mentorship",
        "Skill development workshops",
        "Internship opportunities",
      ],
    },
  },
  {
    name: "Tata Scholarship for Engineering Students",
    provider: "Corporate",
    type: "Merit-based",
    amount: {
      value: 100000,
      currency: "INR",
      type: "Annual",
    },
    eligibilityCriteria: {
      academicPercentage: {
        minimum: 75,
        maximum: 100,
      },
      familyIncome: {
        maximum: 800000,
        currency: "INR",
      },
      age: {
        minimum: 17,
        maximum: 23,
      },
      category: ["All"],
      stream: ["Engineering"],
      educationLevel: ["Undergraduate"],
      state: [],
      gender: "All",
    },
    applicationDetails: {
      startDate: new Date("2024-04-01"),
      endDate: new Date("2024-07-01"),
      applicationMode: "Online",
      website: "https://tatatrusts.org",
      documentsRequired: [
        "Engineering admission proof",
        "Academic certificates",
        "Income certificate",
      ],
      selectionProcess: "Merit-based evaluation",
    },
    benefits: {
      description: "Support for engineering education excellence",
      additionalBenefits: ["Industry internships", "Career placement support"],
    },
  },
  {
    name: "Girl Child Education Scholarship",
    provider: "Government",
    type: "Category-based",
    amount: {
      value: 45000,
      currency: "INR",
      type: "Annual",
    },
    eligibilityCriteria: {
      academicPercentage: {
        minimum: 60,
        maximum: 100,
      },
      familyIncome: {
        maximum: 400000,
        currency: "INR",
      },
      age: {
        minimum: 16,
        maximum: 25,
      },
      category: ["All"],
      stream: ["All"],
      educationLevel: ["12th", "Undergraduate", "Postgraduate"],
      state: [],
      gender: "Female",
    },
    applicationDetails: {
      startDate: new Date("2024-03-15"),
      endDate: new Date("2024-06-15"),
      applicationMode: "Online",
      website: "https://scholarships.gov.in",
      documentsRequired: [
        "Gender certificate",
        "Academic records",
        "Income proof",
      ],
      selectionProcess: "Merit cum means based",
    },
    benefits: {
      description: "Empowering girl child education",
      additionalBenefits: ["Skill development courses", "Safety training"],
    },
  },
  {
    name: "Central Sector Scholarship for College Students",
    provider: "Government",
    type: "Merit-based",
    amount: {
      value: 20000,
      currency: "INR",
      type: "Annual",
    },
    eligibilityCriteria: {
      academicPercentage: {
        minimum: 80,
        maximum: 100,
      },
      familyIncome: {
        maximum: 450000,
        currency: "INR",
      },
      age: {
        minimum: 18,
        maximum: 25,
      },
      category: ["All"],
      stream: ["All"],
      educationLevel: ["Undergraduate"],
      state: [],
      gender: "All",
    },
    applicationDetails: {
      startDate: new Date("2024-04-01"),
      endDate: new Date("2024-06-30"),
      applicationMode: "Online",
      website: "https://scholarships.gov.in",
      documentsRequired: [
        "12th marksheet",
        "Income certificate",
        "College admission proof",
      ],
      selectionProcess: "Merit list preparation",
    },
    benefits: {
      description: "Support for higher education expenses",
      additionalBenefits: ["Book allowance"],
    },
  },
  {
    name: "Google India Scholarship Program",
    provider: "Corporate",
    type: "Category-based",
    amount: {
      value: 150000,
      currency: "INR",
      type: "Annual",
    },
    eligibilityCriteria: {
      academicPercentage: {
        minimum: 70,
        maximum: 100,
      },
      familyIncome: {
        maximum: 600000,
        currency: "INR",
      },
      age: {
        minimum: 18,
        maximum: 26,
      },
      category: ["All"],
      stream: ["Engineering", "Science"],
      educationLevel: ["Undergraduate", "Postgraduate"],
      state: [],
      gender: "All",
    },
    applicationDetails: {
      startDate: new Date("2024-02-01"),
      endDate: new Date("2024-04-30"),
      applicationMode: "Online",
      website: "https://buildyourfuture.withgoogle.com",
      documentsRequired: [
        "Academic transcripts",
        "Project portfolio",
        "Essays",
      ],
      selectionProcess: "Application review and technical interview",
    },
    benefits: {
      description: "Technology education support for underrepresented groups",
      additionalBenefits: [
        "Google mentorship",
        "Tech workshops",
        "Internship opportunities",
      ],
    },
  },
  {
    name: "Sitaram Jindal Foundation Scholarship",
    provider: "Trust",
    type: "Need-based",
    amount: {
      value: 85000,
      currency: "INR",
      type: "Annual",
    },
    eligibilityCriteria: {
      academicPercentage: {
        minimum: 65,
        maximum: 100,
      },
      familyIncome: {
        maximum: 350000,
        currency: "INR",
      },
      age: {
        minimum: 16,
        maximum: 24,
      },
      category: ["All"],
      stream: ["All"],
      educationLevel: ["12th", "Undergraduate"],
      state: [],
      gender: "All",
    },
    applicationDetails: {
      startDate: new Date("2024-05-01"),
      endDate: new Date("2024-07-31"),
      applicationMode: "Online",
      website: "https://sjfscholarships.org",
      documentsRequired: [
        "Academic certificates",
        "Family income proof",
        "Character certificate",
      ],
      selectionProcess: "Document verification and interview",
    },
    benefits: {
      description:
        "Supporting meritorious students from economically weaker sections",
      additionalBenefits: [
        "Career counseling",
        "Personality development sessions",
      ],
    },
  },
  {
    name: "Aditya Birla Scholarship",
    provider: "Corporate",
    type: "Merit-based",
    amount: {
      value: 175000,
      currency: "INR",
      type: "Annual",
    },
    eligibilityCriteria: {
      academicPercentage: {
        minimum: 85,
        maximum: 100,
      },
      familyIncome: {
        maximum: 1000000,
        currency: "INR",
      },
      age: {
        minimum: 18,
        maximum: 22,
      },
      category: ["All"],
      stream: ["Engineering", "Management"],
      educationLevel: ["Undergraduate"],
      state: [],
      gender: "All",
    },
    applicationDetails: {
      startDate: new Date("2024-03-01"),
      endDate: new Date("2024-05-15"),
      applicationMode: "Online",
      website: "https://adityabirla.com/scholarships",
      documentsRequired: [
        "Entrance exam scores",
        "Academic records",
        "Extracurricular achievements",
      ],
      selectionProcess: "Multi-stage selection including group discussion",
    },
    benefits: {
      description:
        "Excellence award for top engineering and management students",
      additionalBenefits: [
        "Leadership training",
        "Industry exposure",
        "Alumni network access",
      ],
    },
  },
];

async function addScholarships() {
  console.log("📚 Adding comprehensive scholarship data...");

  let added = 0;
  let skipped = 0;

  for (const scholarshipData of comprehensiveScholarships) {
    try {
      // Check if scholarship already exists
      const existingScholarship = await Scholarship.findOne({
        name: scholarshipData.name,
      });

      if (existingScholarship) {
        console.log(`⚠️ Skipped duplicate: ${scholarshipData.name}`);
        skipped++;
        continue;
      }

      const scholarship = new Scholarship(scholarshipData);
      await scholarship.save();
      console.log(`✅ Added: ${scholarshipData.name}`);
      added++;
    } catch (error) {
      console.error(`❌ Error adding ${scholarshipData.name}:`, error.message);
    }
  }

  console.log(`\n🎉 Scholarship addition complete!`);
  console.log(`➕ Added: ${added} scholarships`);
  console.log(`⚠️ Skipped: ${skipped} duplicates`);

  // Final count
  const totalScholarships = await Scholarship.countDocuments();
  console.log(`📊 Total scholarships in database: ${totalScholarships}`);
}

async function main() {
  try {
    const currentCount = await Scholarship.countDocuments();
    console.log(`📊 Current scholarships: ${currentCount}`);

    await addScholarships();
  } catch (error) {
    console.error("❌ Fatal error:", error);
  } finally {
    mongoose.connection.close();
  }
}

if (require.main === module) {
  main();
}

module.exports = { addScholarships };
