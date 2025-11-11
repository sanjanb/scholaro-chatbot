const mongoose = require("mongoose");
const College = require("../backend/models/College");
const Scholarship = require("../backend/models/Scholarship");

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/scholaro";

// Sample college data
const sampleColleges = [
  {
    name: "Indian Institute of Technology Delhi",
    location: {
      city: "New Delhi",
      state: "Delhi",
      address: "Hauz Khas, New Delhi, Delhi 110016"
    },
    type: "Central",
    establishedYear: 1961,
    courses: [
      {
        name: "Computer Science Engineering",
        stream: "Science",
        duration: "4 years",
        eligibilityPercentage: {
          general: 85,
          obc: 80,
          "sc/st": 75
        }
      },
      {
        name: "Mechanical Engineering",
        stream: "Science",
        duration: "4 years",
        eligibilityPercentage: {
          general: 83,
          obc: 78,
          "sc/st": 73
        }
      }
    ],
    eligibilityCriteria: {
      minimumPercentage: {
        general: 85,
        obc: 80,
        "sc/st": 75
      },
      entranceExam: "JEE Advanced"
    },
    ranking: {
      nirf: 1
    },
    contactInfo: {
      website: "https://www.iitd.ac.in/",
      email: "webmaster@admin.iitd.ac.in",
      phone: "+91-11-2659-1938"
    }
  },
  {
    name: "Indian Institute of Technology Bombay",
    location: {
      city: "Mumbai",
      state: "Maharashtra",
      address: "Powai, Mumbai, Maharashtra 400076"
    },
    type: "Central",
    establishedYear: 1958,
    courses: [
      {
        name: "Computer Science Engineering",
        stream: "Science",
        duration: "4 years",
        eligibilityPercentage: {
          general: 85,
          obc: 80,
          "sc/st": 75
        }
      },
      {
        name: "Electrical Engineering",
        stream: "Science",
        duration: "4 years",
        eligibilityPercentage: {
          general: 84,
          obc: 79,
          "sc/st": 74
        }
      }
    ],
    eligibilityCriteria: {
      minimumPercentage: {
        general: 85,
        obc: 80,
        "sc/st": 75
      },
      entranceExam: "JEE Advanced"
    },
    ranking: {
      nirf: 3
    },
    contactInfo: {
      website: "https://www.iitb.ac.in/",
      email: "webmaster@iitb.ac.in",
      phone: "+91-22-2572-2545"
    }
  },
  {
    name: "Delhi University",
    location: {
      city: "New Delhi",
      state: "Delhi",
      address: "University Enclave, Delhi 110007"
    },
    type: "Central",
    establishedYear: 1922,
    courses: [
      {
        name: "B.Com (Hons)",
        stream: "Commerce",
        duration: "3 years",
        eligibilityPercentage: {
          general: 75,
          obc: 70,
          "sc/st": 65
        }
      },
      {
        name: "B.A. Economics (Hons)",
        stream: "Arts",
        duration: "3 years",
        eligibilityPercentage: {
          general: 80,
          obc: 75,
          "sc/st": 70
        }
      },
      {
        name: "B.Sc Physics (Hons)",
        stream: "Science",
        duration: "3 years",
        eligibilityPercentage: {
          general: 78,
          obc: 73,
          "sc/st": 68
        }
      }
    ],
    eligibilityCriteria: {
      minimumPercentage: {
        general: 75,
        obc: 70,
        "sc/st": 65
      },
      entranceExam: "DU Entrance Test"
    },
    ranking: {
      nirf: 11
    },
    contactInfo: {
      website: "https://www.du.ac.in/",
      email: "info@du.ac.in",
      phone: "+91-11-2766-7861"
    }
  },
  {
    name: "Jawaharlal Nehru University",
    location: {
      city: "New Delhi",
      state: "Delhi",
      address: "New Mehrauli Road, New Delhi 110067"
    },
    type: "Central",
    establishedYear: 1969,
    courses: [
      {
        name: "B.A. (Hons) Economics",
        stream: "Arts",
        duration: "3 years",
        eligibilityPercentage: {
          general: 70,
          obc: 65,
          "sc/st": 60
        }
      },
      {
        name: "B.A. (Hons) Political Science",
        stream: "Arts",
        duration: "3 years",
        eligibilityPercentage: {
          general: 68,
          obc: 63,
          "sc/st": 58
        }
      }
    ],
    eligibilityCriteria: {
      minimumPercentage: {
        general: 70,
        obc: 65,
        "sc/st": 60
      },
      entranceExam: "JNUEE"
    },
    ranking: {
      nirf: 3
    },
    contactInfo: {
      website: "https://www.jnu.ac.in/",
      email: "info@jnu.ac.in",
      phone: "+91-11-2670-4077"
    }
  },
  {
    name: "Banaras Hindu University",
    location: {
      city: "Varanasi",
      state: "Uttar Pradesh",
      address: "Varanasi, Uttar Pradesh 221005"
    },
    type: "Central",
    establishedYear: 1916,
    courses: [
      {
        name: "B.Tech Computer Science",
        stream: "Science",
        duration: "4 years",
        eligibilityPercentage: {
          general: 80,
          obc: 75,
          "sc/st": 70
        }
      },
      {
        name: "B.Com",
        stream: "Commerce",
        duration: "3 years",
        eligibilityPercentage: {
          general: 65,
          obc: 60,
          "sc/st": 55
        }
      }
    ],
    eligibilityCriteria: {
      minimumPercentage: {
        general: 65,
        obc: 60,
        "sc/st": 55
      },
      entranceExam: "BHU UET"
    },
    ranking: {
      nirf: 8
    },
    contactInfo: {
      website: "https://www.bhu.ac.in/",
      email: "info@bhu.ac.in",
      phone: "+91-542-230-7077"
    }
  },
  {
    name: "Pune University",
    location: {
      city: "Pune",
      state: "Maharashtra",
      address: "Ganeshkhind, Pune, Maharashtra 411007"
    },
    type: "State",
    establishedYear: 1949,
    courses: [
      {
        name: "B.E. Computer Engineering",
        stream: "Science",
        duration: "4 years",
        eligibilityPercentage: {
          general: 75,
          obc: 70,
          "sc/st": 65
        }
      },
      {
        name: "B.Com",
        stream: "Commerce",
        duration: "3 years",
        eligibilityPercentage: {
          general: 60,
          obc: 55,
          "sc/st": 50
        }
      }
    ],
    eligibilityCriteria: {
      minimumPercentage: {
        general: 60,
        obc: 55,
        "sc/st": 50
      },
      entranceExam: "MHT CET"
    },
    ranking: {
      nirf: 15
    },
    contactInfo: {
      website: "https://www.unipune.ac.in/",
      email: "info@unipune.ac.in",
      phone: "+91-20-2569-2039"
    }
  },
  {
    name: "Mumbai University",
    location: {
      city: "Mumbai",
      state: "Maharashtra", 
      address: "Fort, Mumbai, Maharashtra 400032"
    },
    type: "State",
    establishedYear: 1857,
    courses: [
      {
        name: "B.Com",
        stream: "Commerce",
        duration: "3 years",
        eligibilityPercentage: {
          general: 60,
          obc: 55,
          "sc/st": 50
        }
      },
      {
        name: "B.Sc Information Technology",
        stream: "Science",
        duration: "3 years",
        eligibilityPercentage: {
          general: 65,
          obc: 60,
          "sc/st": 55
        }
      }
    ],
    eligibilityCriteria: {
      minimumPercentage: {
        general: 60,
        obc: 55,
        "sc/st": 50
      },
      entranceExam: "Merit Based"
    },
    ranking: {
      nirf: 18
    },
    contactInfo: {
      website: "https://mu.ac.in/",
      email: "info@mu.ac.in",
      phone: "+91-22-2652-6011"
    }
  },
  {
    name: "Amity University",
    location: {
      city: "Noida",
      state: "Uttar Pradesh",
      address: "Sector 125, Noida, Uttar Pradesh 201313"
    },
    type: "Private",
    establishedYear: 2005,
    courses: [
      {
        name: "B.Tech Computer Science",
        stream: "Science",
        duration: "4 years",
        eligibilityPercentage: {
          general: 65,
          obc: 60,
          "sc/st": 55
        }
      },
      {
        name: "BBA",
        stream: "Commerce",
        duration: "3 years",
        eligibilityPercentage: {
          general: 60,
          obc: 55,
          "sc/st": 50
        }
      }
    ],
    eligibilityCriteria: {
      minimumPercentage: {
        general: 60,
        obc: 55,
        "sc/st": 50
      },
      entranceExam: "Amity Entrance Test"
    },
    ranking: {
      nirf: 25
    },
    contactInfo: {
      website: "https://www.amity.edu/",
      email: "info@amity.edu",
      phone: "+91-120-4392-555"
    }
  },
  {
    name: "Lovely Professional University",
    location: {
      city: "Phagwara",
      state: "Punjab",
      address: "Phagwara, Punjab 144411"
    },
    type: "Private",
    establishedYear: 2005,
    courses: [
      {
        name: "B.Tech Computer Science",
        stream: "Science",
        duration: "4 years",
        eligibilityPercentage: {
          general: 60,
          obc: 55,
          "sc/st": 50
        }
      },
      {
        name: "BBA",
        stream: "Commerce", 
        duration: "3 years",
        eligibilityPercentage: {
          general: 55,
          obc: 50,
          "sc/st": 45
        }
      }
    ],
    eligibilityCriteria: {
      minimumPercentage: {
        general: 55,
        obc: 50,
        "sc/st": 45
      },
      entranceExam: "LPU NEST"
    },
    ranking: {
      nirf: 30
    },
    contactInfo: {
      website: "https://www.lpu.in/",
      email: "info@lpu.in",
      phone: "+91-1824-517-000"
    }
  },
  {
    name: "Christ University",
    location: {
      city: "Bangalore",
      state: "Karnataka",
      address: "Hosur Road, Bangalore, Karnataka 560029"
    },
    type: "Deemed",
    establishedYear: 1969,
    courses: [
      {
        name: "BBA",
        stream: "Commerce",
        duration: "3 years",
        eligibilityPercentage: {
          general: 70,
          obc: 65,
          "sc/st": 60
        }
      },
      {
        name: "B.Com (Hons)",
        stream: "Commerce",
        duration: "3 years",
        eligibilityPercentage: {
          general: 65,
          obc: 60,
          "sc/st": 55
        }
      }
    ],
    eligibilityCriteria: {
      minimumPercentage: {
        general: 65,
        obc: 60,
        "sc/st": 55
      },
      entranceExam: "Christ University Entrance Test"
    },
    ranking: {
      nirf: 22
    },
    contactInfo: {
      website: "https://christuniversity.in/",
      email: "info@christuniversity.in",
      phone: "+91-80-4012-9100"
    }
  }
];

async function checkAndPopulateData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check colleges count
    const collegeCount = await College.countDocuments();
    console.log(`Current colleges in database: ${collegeCount}`);

    if (collegeCount === 0) {
      console.log("No colleges found. Populating with sample data...");
      
      // Insert sample colleges
      await College.insertMany(sampleColleges);
      console.log(`Successfully inserted ${sampleColleges.length} colleges`);
    } else {
      console.log("Colleges already exist in database");
    }

    // Check scholarships count
    const scholarshipCount = await Scholarship.countDocuments();
    console.log(`Current scholarships in database: ${scholarshipCount}`);

    // Display summary
    const finalCollegeCount = await College.countDocuments();
    const finalScholarshipCount = await Scholarship.countDocuments();
    
    console.log("\n=== DATABASE SUMMARY ===");
    console.log(`Total Colleges: ${finalCollegeCount}`);
    console.log(`Total Scholarships: ${finalScholarshipCount}`);
    console.log("========================");

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.connection.close();
  }
}

// Run the script
checkAndPopulateData();