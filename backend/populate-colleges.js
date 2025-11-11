const mongoose = require("mongoose");
const College = require("./models/College");
const Scholarship = require("./models/Scholarship");

// MongoDB connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/scholaro";

// Sample college data with correct schema format
const sampleColleges = [
  {
    name: "Indian Institute of Technology Delhi",
    location: {
      city: "New Delhi",
      state: "Delhi",
    },
    type: "Central",
    established: 1961,
    courses: [
      {
        name: "Computer Science Engineering",
        stream: "Engineering",
        duration: "4 years",
        eligibilityPercentage: {
          general: 85,
          obc: 80,
          sc: 75,
          st: 75,
        },
      },
      {
        name: "Mechanical Engineering",
        stream: "Engineering",
        duration: "4 years",
        eligibilityPercentage: {
          general: 83,
          obc: 78,
          sc: 73,
          st: 73,
        },
      },
    ],
    eligibilityCriteria: {
      minimumPercentage: {
        general: 85,
        obc: 80,
        sc: 75,
        st: 75,
      },
      entranceExam: "JEE Advanced",
    },
    ranking: {
      nirf: 1,
    },
    contactInfo: {
      website: "https://www.iitd.ac.in/",
      email: "webmaster@admin.iitd.ac.in",
      phone: "+91-11-2659-1938",
      address: "Hauz Khas, New Delhi, Delhi 110016",
    },
  },
  {
    name: "Indian Institute of Technology Bombay",
    location: {
      city: "Mumbai",
      state: "Maharashtra",
    },
    type: "Central",
    established: 1958,
    courses: [
      {
        name: "Computer Science Engineering",
        stream: "Engineering",
        duration: "4 years",
        eligibilityPercentage: {
          general: 85,
          obc: 80,
          sc: 75,
          st: 75,
        },
      },
      {
        name: "Electrical Engineering",
        stream: "Engineering",
        duration: "4 years",
        eligibilityPercentage: {
          general: 84,
          obc: 79,
          sc: 74,
          st: 74,
        },
      },
    ],
    eligibilityCriteria: {
      minimumPercentage: {
        general: 85,
        obc: 80,
        sc: 75,
        st: 75,
      },
      entranceExam: "JEE Advanced",
    },
    ranking: {
      nirf: 3,
    },
    contactInfo: {
      website: "https://www.iitb.ac.in/",
      email: "webmaster@iitb.ac.in",
      phone: "+91-22-2572-2545",
      address: "Powai, Mumbai, Maharashtra 400076",
    },
  },
  {
    name: "Delhi University",
    location: {
      city: "New Delhi",
      state: "Delhi",
    },
    type: "Central",
    established: 1922,
    courses: [
      {
        name: "B.Com (Hons)",
        stream: "Commerce",
        duration: "3 years",
        eligibilityPercentage: {
          general: 75,
          obc: 70,
          sc: 65,
          st: 65,
        },
      },
      {
        name: "B.A. Economics (Hons)",
        stream: "Arts",
        duration: "3 years",
        eligibilityPercentage: {
          general: 80,
          obc: 75,
          sc: 70,
          st: 70,
        },
      },
      {
        name: "B.Sc Physics (Hons)",
        stream: "Science",
        duration: "3 years",
        eligibilityPercentage: {
          general: 78,
          obc: 73,
          sc: 68,
          st: 68,
        },
      },
    ],
    eligibilityCriteria: {
      minimumPercentage: {
        general: 75,
        obc: 70,
        sc: 65,
        st: 65,
      },
      entranceExam: "DU Entrance Test",
    },
    ranking: {
      nirf: 11,
    },
    contactInfo: {
      website: "https://www.du.ac.in/",
      email: "info@du.ac.in",
      phone: "+91-11-2766-7861",
      address: "University Enclave, Delhi 110007",
    },
  },
  {
    name: "Amity University",
    location: {
      city: "Noida",
      state: "Uttar Pradesh",
    },
    type: "Private",
    established: 2005,
    courses: [
      {
        name: "B.Tech Computer Science",
        stream: "Engineering",
        duration: "4 years",
        eligibilityPercentage: {
          general: 65,
          obc: 60,
          sc: 55,
          st: 55,
        },
      },
      {
        name: "BBA",
        stream: "Management",
        duration: "3 years",
        eligibilityPercentage: {
          general: 60,
          obc: 55,
          sc: 50,
          st: 50,
        },
      },
    ],
    eligibilityCriteria: {
      minimumPercentage: {
        general: 60,
        obc: 55,
        sc: 50,
        st: 50,
      },
      entranceExam: "Amity Entrance Test",
    },
    ranking: {
      nirf: 25,
    },
    contactInfo: {
      website: "https://www.amity.edu/",
      email: "info@amity.edu",
      phone: "+91-120-4392-555",
      address: "Sector 125, Noida, Uttar Pradesh 201313",
    },
  },
  {
    name: "Lovely Professional University",
    location: {
      city: "Phagwara",
      state: "Punjab",
    },
    type: "Private",
    established: 2005,
    courses: [
      {
        name: "B.Tech Computer Science",
        stream: "Engineering",
        duration: "4 years",
        eligibilityPercentage: {
          general: 60,
          obc: 55,
          sc: 50,
          st: 50,
        },
      },
      {
        name: "BBA",
        stream: "Management",
        duration: "3 years",
        eligibilityPercentage: {
          general: 55,
          obc: 50,
          sc: 45,
          st: 45,
        },
      },
    ],
    eligibilityCriteria: {
      minimumPercentage: {
        general: 55,
        obc: 50,
        sc: 45,
        st: 45,
      },
      entranceExam: "LPU NEST",
    },
    ranking: {
      nirf: 30,
    },
    contactInfo: {
      website: "https://www.lpu.in/",
      email: "info@lpu.in",
      phone: "+91-1824-517-000",
      address: "Phagwara, Punjab 144411",
    },
  },
  {
    name: "Christ University",
    location: {
      city: "Bangalore",
      state: "Karnataka",
    },
    type: "Deemed",
    established: 1969,
    courses: [
      {
        name: "BBA",
        stream: "Management",
        duration: "3 years",
        eligibilityPercentage: {
          general: 70,
          obc: 65,
          sc: 60,
          st: 60,
        },
      },
      {
        name: "B.Com (Hons)",
        stream: "Commerce",
        duration: "3 years",
        eligibilityPercentage: {
          general: 65,
          obc: 60,
          sc: 55,
          st: 55,
        },
      },
    ],
    eligibilityCriteria: {
      minimumPercentage: {
        general: 65,
        obc: 60,
        sc: 55,
        st: 55,
      },
      entranceExam: "Christ University Entrance Test",
    },
    ranking: {
      nirf: 22,
    },
    contactInfo: {
      website: "https://christuniversity.in/",
      email: "info@christuniversity.in",
      phone: "+91-80-4012-9100",
      address: "Hosur Road, Bangalore, Karnataka 560029",
    },
  },
  {
    name: "Mumbai University",
    location: {
      city: "Mumbai",
      state: "Maharashtra",
    },
    type: "Government",
    established: 1857,
    courses: [
      {
        name: "B.Com",
        stream: "Commerce",
        duration: "3 years",
        eligibilityPercentage: {
          general: 60,
          obc: 55,
          sc: 50,
          st: 50,
        },
      },
      {
        name: "B.Sc Information Technology",
        stream: "Science",
        duration: "3 years",
        eligibilityPercentage: {
          general: 65,
          obc: 60,
          sc: 55,
          st: 55,
        },
      },
    ],
    eligibilityCriteria: {
      minimumPercentage: {
        general: 60,
        obc: 55,
        sc: 50,
        st: 50,
      },
      entranceExam: "Merit Based",
    },
    ranking: {
      nirf: 18,
    },
    contactInfo: {
      website: "https://mu.ac.in/",
      email: "info@mu.ac.in",
      phone: "+91-22-2652-6011",
      address: "Fort, Mumbai, Maharashtra 400032",
    },
  },
  {
    name: "Pune University",
    location: {
      city: "Pune",
      state: "Maharashtra",
    },
    type: "Government",
    established: 1949,
    courses: [
      {
        name: "B.E. Computer Engineering",
        stream: "Engineering",
        duration: "4 years",
        eligibilityPercentage: {
          general: 75,
          obc: 70,
          sc: 65,
          st: 65,
        },
      },
      {
        name: "B.Com",
        stream: "Commerce",
        duration: "3 years",
        eligibilityPercentage: {
          general: 60,
          obc: 55,
          sc: 50,
          st: 50,
        },
      },
    ],
    eligibilityCriteria: {
      minimumPercentage: {
        general: 60,
        obc: 55,
        sc: 50,
        st: 50,
      },
      entranceExam: "MHT CET",
    },
    ranking: {
      nirf: 15,
    },
    contactInfo: {
      website: "https://www.unipune.ac.in/",
      email: "info@unipune.ac.in",
      phone: "+91-20-2569-2039",
      address: "Ganeshkhind, Pune, Maharashtra 411007",
    },
  },
];

async function checkAndPopulateData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Check current data
    const collegeCount = await College.countDocuments();
    const scholarshipCount = await Scholarship.countDocuments();

    console.log(`📊 Current colleges in database: ${collegeCount}`);
    console.log(`📊 Current scholarships in database: ${scholarshipCount}`);

    if (collegeCount === 0) {
      console.log("🔄 No colleges found. Populating with sample data...");

      // Insert sample colleges
      const result = await College.insertMany(sampleColleges);
      console.log(`✅ Successfully inserted ${result.length} colleges`);
    } else {
      console.log("ℹ️ Colleges already exist in database");
    }

    // Display final summary
    const finalCollegeCount = await College.countDocuments();
    const finalScholarshipCount = await Scholarship.countDocuments();

    console.log("\n" + "=".repeat(40));
    console.log("📋 DATABASE SUMMARY");
    console.log("=".repeat(40));
    console.log(`🏫 Total Colleges: ${finalCollegeCount}`);
    console.log(`💰 Total Scholarships: ${finalScholarshipCount}`);
    console.log("=".repeat(40));
    console.log("🎉 Database is ready for the chatbot!");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("🔐 Database connection closed");
  }
}

// Run the script
checkAndPopulateData();
