const mongoose = require("mongoose");
const Scholarship = require("./models/Scholarship");

// MongoDB connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/scholaro";

// Sample scholarship data
const sampleScholarships = [
  {
    name: "National Merit Scholarship",
    provider: "Government",
    type: "Merit-based",
    amount: { value: 50000, currency: "INR", type: "Annual" },
    eligibilityCriteria: {
      academicPercentage: { minimum: 85, maximum: 100 },
      category: ["All"],
      familyIncome: { maximum: 800000, currency: "INR" },
      stream: ["All"],
      educationLevel: ["12th", "Undergraduate"],
      state: [],
      age: { minimum: 16, maximum: 22 },
      gender: "All",
    },
    applicationDetails: {
      startDate: new Date("2024-04-01"),
      endDate: new Date("2024-06-30"),
      deadline: "June 30, 2024",
      applicationMode: "Online",
      website: "https://scholarships.gov.in",
      documentsRequired: [
        "Mark sheet",
        "Income certificate",
        "Caste certificate",
      ],
      selectionProcess: "Merit-based selection",
    },
    benefits: {
      description: "Annual scholarship for meritorious students",
      additionalBenefits: ["Books allowance", "Study materials"],
    },
    isActive: true,
    isRecurring: true,
    tags: ["Merit", "Government", "Academic Excellence"],
  },
  {
    name: "SC/ST Scholarship Scheme",
    provider: "Government",
    type: "Category-based",
    amount: { value: 30000, currency: "INR", type: "Annual" },
    eligibilityCriteria: {
      academicPercentage: { minimum: 60, maximum: 100 },
      category: ["SC", "ST"],
      familyIncome: { maximum: 250000, currency: "INR" },
      stream: ["All"],
      educationLevel: ["All"],
      state: [],
      age: { minimum: 16, maximum: 30 },
      gender: "All",
    },
    applicationDetails: {
      startDate: new Date("2024-05-01"),
      endDate: new Date("2024-07-31"),
      deadline: "July 31, 2024",
      applicationMode: "Online",
      website: "https://scholarships.gov.in",
      documentsRequired: [
        "Caste certificate",
        "Income certificate",
        "Bank details",
      ],
      selectionProcess: "Document verification",
    },
    benefits: {
      description: "Financial assistance for SC/ST category students",
      additionalBenefits: ["Hostel fees", "Maintenance allowance"],
    },
    isActive: true,
    isRecurring: true,
    tags: ["SC", "ST", "Category-based", "Government"],
  },
  {
    name: "INSPIRE Scholarship for Science Students",
    provider: "Department of Science and Technology",
    type: "Merit-based",
    amount: { value: 80000, currency: "INR", type: "Annual" },
    eligibilityCriteria: {
      academicPercentage: { minimum: 80, maximum: 100 },
      category: ["All"],
      familyIncome: { maximum: 600000, currency: "INR" },
      stream: ["Science"],
      educationLevel: ["Undergraduate"],
      state: [],
      age: { minimum: 17, maximum: 22 },
      gender: "All",
    },
    applicationDetails: {
      startDate: new Date("2024-06-01"),
      endDate: new Date("2024-08-15"),
      deadline: "August 15, 2024",
      applicationMode: "Online",
      website: "https://inspire-dst.gov.in",
      documentsRequired: [
        "Science stream certificate",
        "Income proof",
        "Bank account",
      ],
      selectionProcess: "Merit and interview",
    },
    benefits: {
      description: "Scholarship for students pursuing science courses",
      additionalBenefits: ["Research exposure", "Internship opportunities"],
    },
    isActive: true,
    isRecurring: true,
    tags: ["Science", "Merit", "INSPIRE", "Research"],
  },
  {
    name: "Girl Child Education Grant",
    provider: "Pratham Education Foundation",
    type: "Need-based",
    amount: { value: 25000, currency: "INR", type: "Annual" },
    eligibilityCriteria: {
      academicPercentage: { minimum: 70, maximum: 100 },
      category: ["All"],
      familyIncome: { maximum: 300000, currency: "INR" },
      stream: ["All"],
      educationLevel: ["12th", "Undergraduate"],
      state: [],
      age: { minimum: 16, maximum: 24 },
      gender: "Female",
    },
    applicationDetails: {
      startDate: new Date("2024-03-01"),
      endDate: new Date("2024-05-31"),
      deadline: "May 31, 2024",
      applicationMode: "Online",
      website: "https://www.pratham.org/scholarships",
      documentsRequired: [
        "Income certificate",
        "Gender certificate",
        "Academic records",
      ],
      selectionProcess: "Need assessment and interview",
    },
    benefits: {
      description: "Educational support for girl child",
      additionalBenefits: ["Mentorship program", "Career guidance"],
    },
    isActive: true,
    isRecurring: true,
    tags: ["Girls Education", "NGO", "Need-based"],
  },
  {
    name: "Tech Mahindra Smart Academy Scholarship",
    provider: "Tech Mahindra Foundation",
    type: "Merit-based",
    amount: { value: 100000, currency: "INR", type: "Annual" },
    eligibilityCriteria: {
      academicPercentage: { minimum: 75, maximum: 100 },
      category: ["All"],
      familyIncome: { maximum: 500000, currency: "INR" },
      stream: ["Engineering", "Science"],
      educationLevel: ["Undergraduate"],
      state: [],
      age: { minimum: 18, maximum: 25 },
      gender: "All",
    },
    applicationDetails: {
      startDate: new Date("2024-04-15"),
      endDate: new Date("2024-07-15"),
      deadline: "July 15, 2024",
      applicationMode: "Online",
      website: "https://www.techmahindra.com/scholarships",
      documentsRequired: [
        "Engineering admission proof",
        "Income certificate",
        "Academic transcripts",
      ],
      selectionProcess: "Written test and interview",
    },
    benefits: {
      description: "Annual scholarship with internship opportunities",
      additionalBenefits: [
        "Internship at Tech Mahindra",
        "Job placement assistance",
      ],
    },
    isActive: true,
    isRecurring: true,
    tags: ["Technology", "Engineering", "Corporate", "Internship"],
  },
  {
    name: "Minority Community Scholarship",
    provider: "Ministry of Minority Affairs",
    type: "Category-based",
    amount: { value: 35000, currency: "INR", type: "Annual" },
    eligibilityCriteria: {
      academicPercentage: { minimum: 65, maximum: 100 },
      category: ["Minority"],
      familyIncome: { maximum: 400000, currency: "INR" },
      stream: ["All"],
      educationLevel: ["All"],
      state: [],
      age: { minimum: 16, maximum: 28 },
      gender: "All",
    },
    applicationDetails: {
      startDate: new Date("2024-05-01"),
      endDate: new Date("2024-08-31"),
      deadline: "August 31, 2024",
      applicationMode: "Online",
      website: "https://scholarships.gov.in/minority",
      documentsRequired: [
        "Minority certificate",
        "Income proof",
        "Academic certificates",
      ],
      selectionProcess: "Document verification and merit",
    },
    benefits: {
      description: "Financial assistance for minority community students",
      additionalBenefits: [
        "Books and stationery allowance",
        "Examination fees",
      ],
    },
    isActive: true,
    isRecurring: true,
    tags: ["Minority", "Government", "Category-based"],
  },
  {
    name: "OBC Merit Scholarship",
    provider: "Government of India",
    type: "Category-based",
    amount: { value: 40000, currency: "INR", type: "Annual" },
    eligibilityCriteria: {
      academicPercentage: { minimum: 75, maximum: 100 },
      category: ["OBC"],
      familyIncome: { maximum: 600000, currency: "INR" },
      stream: ["All"],
      educationLevel: ["All"],
      state: [],
      age: { minimum: 16, maximum: 26 },
      gender: "All",
    },
    applicationDetails: {
      startDate: new Date("2024-04-01"),
      endDate: new Date("2024-06-30"),
      deadline: "June 30, 2024",
      applicationMode: "Online",
      website: "https://scholarships.gov.in",
      documentsRequired: [
        "OBC certificate",
        "Income certificate",
        "Mark sheets",
      ],
      selectionProcess: "Merit-based with income verification",
    },
    benefits: {
      description: "Merit scholarship for OBC category students",
      additionalBenefits: [
        "Study material support",
        "Skill development programs",
      ],
    },
    isActive: true,
    isRecurring: true,
    tags: ["OBC", "Merit", "Government"],
  },
  {
    name: "State Excellence Scholarship",
    provider: "State Government",
    type: "Merit-based",
    amount: { value: 60000, currency: "INR", type: "Annual" },
    eligibilityCriteria: {
      academicPercentage: { minimum: 90, maximum: 100 },
      category: ["All"],
      familyIncome: { maximum: 1000000, currency: "INR" },
      stream: ["All"],
      educationLevel: ["12th", "Undergraduate"],
      state: [],
      age: { minimum: 16, maximum: 24 },
      gender: "All",
    },
    applicationDetails: {
      startDate: new Date("2024-03-15"),
      endDate: new Date("2024-05-15"),
      deadline: "May 15, 2024",
      applicationMode: "Online",
      website: "https://stategovt-scholarships.in",
      documentsRequired: [
        "State domicile",
        "Mark sheets",
        "Income certificate",
      ],
      selectionProcess: "Top performers in state board exams",
    },
    benefits: {
      description: "Excellence award for top academic performers",
      additionalBenefits: [
        "Certificate of excellence",
        "Priority in college admissions",
      ],
    },
    isActive: true,
    isRecurring: true,
    tags: ["State", "Excellence", "Top Performers"],
  },
];

async function populateScholarships() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Check current scholarships
    const scholarshipCount = await Scholarship.countDocuments();
    console.log(`📊 Current scholarships in database: ${scholarshipCount}`);

    if (scholarshipCount === 0) {
      console.log("🔄 No scholarships found. Populating with sample data...");

      // Insert sample scholarships
      const result = await Scholarship.insertMany(sampleScholarships);
      console.log(`✅ Successfully inserted ${result.length} scholarships`);
    } else {
      console.log("ℹ️ Scholarships already exist in database");
    }

    // Display final summary
    const finalScholarshipCount = await Scholarship.countDocuments();

    console.log("\n" + "=".repeat(40));
    console.log("📋 SCHOLARSHIP SUMMARY");
    console.log("=".repeat(40));
    console.log(`💰 Total Scholarships: ${finalScholarshipCount}`);
    console.log("=".repeat(40));
    console.log("🎉 Scholarships are ready!");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("🔐 Database connection closed");
  }
}

// Run the script
populateScholarships();
