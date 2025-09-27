const mongoose = require("mongoose");
const College = require("./models/College");
const Scholarship = require("./models/Scholarship");

// MongoDB connection
const MONGODB_URI = "mongodb://localhost:27017/student-eligibility-db";

// Comprehensive Colleges Data
const sampleColleges = [
  // IITs
  {
    name: "Indian Institute of Technology Delhi",
    location: { state: "Delhi", city: "New Delhi", pincode: "110016" },
    type: "Central",
    courses: [
      {
        name: "B.Tech Computer Science",
        stream: "Engineering",
        eligibilityPercentage: { general: 75, obc: 68, sc: 65, st: 65 },
        fees: { tuition: 250000, hostel: 50000, other: 25000 },
        duration: "4 years",
        seats: 120,
      },
      {
        name: "B.Tech Electrical Engineering",
        stream: "Engineering",
        eligibilityPercentage: { general: 73, obc: 66, sc: 63, st: 63 },
        fees: { tuition: 250000, hostel: 50000, other: 25000 },
        duration: "4 years",
        seats: 100,
      },
    ],
    eligibilityCriteria: {
      minimumPercentage: { general: 70, obc: 63, sc: 60, st: 60 },
      entranceExam: "JEE Advanced",
      ageLimit: 25,
      stream: ["Science", "Engineering"],
    },
    contactInfo: {
      website: "https://www.iitd.ac.in",
      phone: "+91-11-26581234",
      email: "admissions@iitd.ac.in",
    },
    ranking: { nirf: 2 },
    accreditation: "NAAC A++",
    established: 1961,
  },
  {
    name: "Indian Institute of Technology Bombay",
    location: { state: "Maharashtra", city: "Mumbai", pincode: "400076" },
    type: "Central",
    courses: [
      {
        name: "B.Tech Computer Science",
        stream: "Engineering",
        eligibilityPercentage: { general: 78, obc: 71, sc: 68, st: 68 },
        fees: { tuition: 250000, hostel: 60000, other: 30000 },
        duration: "4 years",
        seats: 140,
      },
      {
        name: "B.Tech Mechanical Engineering",
        stream: "Engineering",
        eligibilityPercentage: { general: 74, obc: 67, sc: 64, st: 64 },
        fees: { tuition: 250000, hostel: 60000, other: 30000 },
        duration: "4 years",
        seats: 110,
      },
    ],
    eligibilityCriteria: {
      minimumPercentage: { general: 72, obc: 65, sc: 62, st: 62 },
      entranceExam: "JEE Advanced",
      ageLimit: 25,
      stream: ["Science", "Engineering"],
    },
    contactInfo: {
      website: "https://www.iitb.ac.in",
      phone: "+91-22-25722545",
      email: "admissions@iitb.ac.in",
    },
    ranking: { nirf: 1 },
    accreditation: "NAAC A++",
    established: 1958,
  },
  {
    name: "Indian Institute of Technology Madras",
    location: { state: "Tamil Nadu", city: "Chennai", pincode: "600036" },
    type: "Central",
    courses: [
      {
        name: "B.Tech Aerospace Engineering",
        stream: "Engineering",
        eligibilityPercentage: { general: 76, obc: 69, sc: 66, st: 66 },
        fees: { tuition: 250000, hostel: 45000, other: 25000 },
        duration: "4 years",
        seats: 90,
      },
    ],
    eligibilityCriteria: {
      minimumPercentage: { general: 71, obc: 64, sc: 61, st: 61 },
      entranceExam: "JEE Advanced",
      ageLimit: 25,
      stream: ["Science", "Engineering"],
    },
    contactInfo: {
      website: "https://www.iitm.ac.in",
      phone: "+91-44-22574010",
      email: "admissions@iitm.ac.in",
    },
    ranking: { nirf: 3 },
    accreditation: "NAAC A++",
    established: 1959,
  },

  // Medical Colleges
  {
    name: "All Institute of Medical Sciences Delhi",
    location: { state: "Delhi", city: "New Delhi", pincode: "110029" },
    type: "Central",
    courses: [
      {
        name: "MBBS",
        stream: "Medical",
        eligibilityPercentage: { general: 90, obc: 85, sc: 80, st: 80 },
        fees: { tuition: 5500, hostel: 15000, other: 10000 },
        duration: "5.5 years",
        seats: 125,
      },
    ],
    eligibilityCriteria: {
      minimumPercentage: { general: 85, obc: 80, sc: 75, st: 75 },
      entranceExam: "NEET",
      ageLimit: 25,
      stream: ["Science", "Medical"],
    },
    contactInfo: {
      website: "https://www.aiims.edu",
      phone: "+91-11-26588500",
      email: "admissions@aiims.edu",
    },
    ranking: { nirf: 1 },
    accreditation: "NAAC A++",
    established: 1956,
  },
  {
    name: "Government Medical College Mumbai",
    location: { state: "Maharashtra", city: "Mumbai", pincode: "400012" },
    type: "Government",
    courses: [
      {
        name: "MBBS",
        stream: "Medical",
        eligibilityPercentage: { general: 85, obc: 80, sc: 75, st: 75 },
        fees: { tuition: 50000, hostel: 25000, other: 15000 },
        duration: "5.5 years",
        seats: 150,
      },
      {
        name: "BDS",
        stream: "Medical",
        eligibilityPercentage: { general: 80, obc: 75, sc: 70, st: 70 },
        fees: { tuition: 40000, hostel: 20000, other: 12000 },
        duration: "4 years",
        seats: 60,
      },
    ],
    eligibilityCriteria: {
      minimumPercentage: { general: 80, obc: 75, sc: 70, st: 70 },
      entranceExam: "NEET",
      ageLimit: 25,
      stream: ["Science", "Medical"],
    },
    contactInfo: {
      website: "https://www.gmcmumbai.edu",
      phone: "+91-22-24134000",
      email: "dean@gmcmumbai.edu",
    },
    ranking: { nirf: 8 },
    accreditation: "NAAC A+",
    established: 1845,
  },

  // Commerce & Management
  {
    name: "St. Stephen's College Delhi",
    location: { state: "Delhi", city: "New Delhi", pincode: "110007" },
    type: "Central",
    courses: [
      {
        name: "B.A. Economics",
        stream: "Commerce",
        eligibilityPercentage: { general: 95, obc: 90, sc: 85, st: 85 },
        fees: { tuition: 15000, hostel: 30000, other: 10000 },
        duration: "3 years",
        seats: 40,
      },
      {
        name: "B.Sc. Physics",
        stream: "Science",
        eligibilityPercentage: { general: 90, obc: 85, sc: 80, st: 80 },
        fees: { tuition: 15000, hostel: 30000, other: 10000 },
        duration: "3 years",
        seats: 35,
      },
    ],
    eligibilityCriteria: {
      minimumPercentage: { general: 85, obc: 80, sc: 75, st: 75 },
      entranceExam: "DU Entrance Test",
      ageLimit: 22,
      stream: ["Science", "Commerce", "Arts"],
    },
    contactInfo: {
      website: "https://www.ststephens.edu",
      phone: "+91-11-27667204",
      email: "principal@ststephens.edu",
    },
    ranking: { nirf: 15 },
    established: 1881,
  },
  {
    name: "Indian Institute of Management Ahmedabad",
    location: { state: "Gujarat", city: "Ahmedabad", pincode: "380015" },
    type: "Central",
    courses: [
      {
        name: "Post Graduate Programme in Management",
        stream: "Management",
        eligibilityPercentage: { general: 80, obc: 75, sc: 70, st: 70 },
        fees: { tuition: 2500000, hostel: 100000, other: 50000 },
        duration: "2 years",
        seats: 395,
      },
    ],
    eligibilityCriteria: {
      minimumPercentage: { general: 75, obc: 70, sc: 65, st: 65 },
      entranceExam: "CAT",
      ageLimit: 28,
      stream: ["Commerce", "Management", "Arts", "Science"],
    },
    contactInfo: {
      website: "https://www.iima.ac.in",
      phone: "+91-79-66324000",
      email: "admissions@iima.ac.in",
    },
    ranking: { nirf: 1 },
    accreditation: "NAAC A++",
    established: 1961,
  },

  // Liberal Arts & Science
  {
    name: "Ashoka University",
    location: { state: "Haryana", city: "Sonipat", pincode: "131029" },
    type: "Private",
    courses: [
      {
        name: "Bachelor of Arts (Liberal Studies)",
        stream: "Arts",
        eligibilityPercentage: { general: 85, obc: 80, sc: 75, st: 75 },
        fees: { tuition: 650000, hostel: 200000, other: 50000 },
        duration: "3 years",
        seats: 200,
      },
      {
        name: "B.Sc. Physics",
        stream: "Science",
        eligibilityPercentage: { general: 80, obc: 75, sc: 70, st: 70 },
        fees: { tuition: 650000, hostel: 200000, other: 50000 },
        duration: "3 years",
        seats: 60,
      },
    ],
    eligibilityCriteria: {
      minimumPercentage: { general: 75, obc: 70, sc: 65, st: 65 },
      entranceExam: "Ashoka Aptitude Test",
      ageLimit: 22,
      stream: ["Science", "Commerce", "Arts"],
    },
    contactInfo: {
      website: "https://www.ashoka.edu.in",
      phone: "+91-130-2300400",
      email: "admissions@ashoka.edu.in",
    },
    ranking: { nirf: 25 },
    accreditation: "NAAC A",
    established: 2014,
  },

  // State Universities
  {
    name: "Lovely Professional University",
    location: { state: "Punjab", city: "Jalandhar", pincode: "144411" },
    type: "Private",
    courses: [
      {
        name: "B.Tech CSE",
        stream: "Engineering",
        eligibilityPercentage: { general: 60, obc: 55, sc: 50, st: 50 },
        fees: { tuition: 180000, hostel: 60000, other: 30000 },
        duration: "4 years",
        seats: 300,
      },
      {
        name: "BBA",
        stream: "Management",
        eligibilityPercentage: { general: 55, obc: 50, sc: 45, st: 45 },
        fees: { tuition: 120000, hostel: 60000, other: 25000 },
        duration: "3 years",
        seats: 200,
      },
      {
        name: "B.A. English",
        stream: "Arts",
        eligibilityPercentage: { general: 50, obc: 45, sc: 40, st: 40 },
        fees: { tuition: 80000, hostel: 60000, other: 20000 },
        duration: "3 years",
        seats: 100,
      },
    ],
    eligibilityCriteria: {
      minimumPercentage: { general: 50, obc: 45, sc: 40, st: 40 },
      entranceExam: "LPUNEST",
      ageLimit: 23,
      stream: ["Science", "Commerce", "Arts", "Engineering", "Management"],
    },
    contactInfo: {
      website: "https://www.lpu.in",
      phone: "+91-1824-517000",
      email: "info@lpu.co.in",
    },
    ranking: { nirf: 45 },
    accreditation: "NAAC A+",
    established: 2005,
  },
  {
    name: "Presidency College Chennai",
    location: { state: "Tamil Nadu", city: "Chennai", pincode: "600005" },
    type: "Government",
    courses: [
      {
        name: "B.Sc. Mathematics",
        stream: "Science",
        eligibilityPercentage: { general: 75, obc: 70, sc: 65, st: 65 },
        fees: { tuition: 8000, hostel: 15000, other: 5000 },
        duration: "3 years",
        seats: 80,
      },
      {
        name: "B.A. Tamil Literature",
        stream: "Arts",
        eligibilityPercentage: { general: 65, obc: 60, sc: 55, st: 55 },
        fees: { tuition: 6000, hostel: 15000, other: 4000 },
        duration: "3 years",
        seats: 60,
      },
    ],
    eligibilityCriteria: {
      minimumPercentage: { general: 60, obc: 55, sc: 50, st: 50 },
      entranceExam: "Tamil Nadu Common Entrance Test",
      ageLimit: 21,
      stream: ["Science", "Arts"],
    },
    contactInfo: {
      website: "https://www.presidencycollege.ac.in",
      phone: "+91-44-28510732",
      email: "principal@presidencycollege.ac.in",
    },
    ranking: { nirf: 25 },
    accreditation: "NAAC A",
    established: 1840,
  },

  // Law Colleges
  {
    name: "National Law School of India University",
    location: { state: "Karnataka", city: "Bengaluru", pincode: "560072" },
    type: "Central",
    courses: [
      {
        name: "B.A. LL.B. (Hons.)",
        stream: "Law",
        eligibilityPercentage: { general: 85, obc: 80, sc: 75, st: 75 },
        fees: { tuition: 200000, hostel: 80000, other: 20000 },
        duration: "5 years",
        seats: 80,
      },
    ],
    eligibilityCriteria: {
      minimumPercentage: { general: 80, obc: 75, sc: 70, st: 70 },
      entranceExam: "CLAT",
      ageLimit: 25,
      stream: ["Commerce", "Arts", "Science"],
    },
    contactInfo: {
      website: "https://www.nls.ac.in",
      phone: "+91-80-23217996",
      email: "registrar@nls.ac.in",
    },
    ranking: { nirf: 1 },
    accreditation: "NAAC A++",
    established: 1987,
  },

  // Regional Colleges
  {
    name: "Jadavpur University",
    location: { state: "West Bengal", city: "Kolkata", pincode: "700032" },
    type: "Government",
    courses: [
      {
        name: "B.E. Computer Science",
        stream: "Engineering",
        eligibilityPercentage: { general: 80, obc: 75, sc: 70, st: 70 },
        fees: { tuition: 25000, hostel: 20000, other: 10000 },
        duration: "4 years",
        seats: 60,
      },
      {
        name: "B.A. English",
        stream: "Arts",
        eligibilityPercentage: { general: 70, obc: 65, sc: 60, st: 60 },
        fees: { tuition: 8000, hostel: 18000, other: 8000 },
        duration: "3 years",
        seats: 45,
      },
    ],
    eligibilityCriteria: {
      minimumPercentage: { general: 65, obc: 60, sc: 55, st: 55 },
      entranceExam: "JU Entrance Test",
      ageLimit: 22,
      stream: ["Science", "Commerce", "Arts", "Engineering"],
    },
    contactInfo: {
      website: "https://www.jaduniv.edu.in",
      phone: "+91-33-24146666",
      email: "registrar@jaduniv.edu.in",
    },
    ranking: { nirf: 12 },
    accreditation: "NAAC A",
    established: 1955,
  },
  {
    name: "University of Rajasthan",
    location: { state: "Rajasthan", city: "Jaipur", pincode: "302004" },
    type: "Government",
    courses: [
      {
        name: "B.Com",
        stream: "Commerce",
        eligibilityPercentage: { general: 60, obc: 55, sc: 50, st: 50 },
        fees: { tuition: 12000, hostel: 25000, other: 8000 },
        duration: "3 years",
        seats: 120,
      },
      {
        name: "B.A. Political Science",
        stream: "Arts",
        eligibilityPercentage: { general: 55, obc: 50, sc: 45, st: 45 },
        fees: { tuition: 10000, hostel: 25000, other: 6000 },
        duration: "3 years",
        seats: 90,
      },
    ],
    eligibilityCriteria: {
      minimumPercentage: { general: 50, obc: 45, sc: 40, st: 40 },
      entranceExam: "Merit Based",
      ageLimit: 25,
      stream: ["Commerce", "Arts", "Science"],
    },
    contactInfo: {
      website: "https://www.uniraj.ac.in",
      phone: "+91-141-2710004",
      email: "registrar@uniraj.ac.in",
    },
    ranking: { nirf: 35 },
    accreditation: "NAAC B++",
    established: 1947,
  },
];

// Comprehensive Scholarships Data
const sampleScholarships = [
  // Government Merit Scholarships
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

  // Category-based Scholarships
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
    name: "OBC Scholarship Programme",
    provider: "Government",
    type: "Category-based",
    amount: { value: 25000, currency: "INR", type: "Annual" },
    eligibilityCriteria: {
      academicPercentage: { minimum: 65, maximum: 100 },
      category: ["OBC"],
      familyIncome: { maximum: 300000, currency: "INR" },
      stream: ["All"],
      educationLevel: ["12th", "Undergraduate", "Postgraduate"],
      state: [],
      age: { minimum: 16, maximum: 28 },
      gender: "All",
    },
    applicationDetails: {
      startDate: new Date("2024-04-15"),
      endDate: new Date("2024-07-15"),
      applicationMode: "Online",
      website: "https://scholarships.gov.in",
      documentsRequired: [
        "OBC certificate",
        "Income proof",
        "Academic records",
      ],
      selectionProcess: "Merit cum means based",
    },
    benefits: {
      description: "Educational support for OBC category students",
      additionalBenefits: ["Fee reimbursement", "Book allowance"],
    },
    isActive: true,
    isRecurring: true,
    tags: ["OBC", "Government", "Educational Support"],
  },

  // Science & Technology Scholarships
  {
    name: "Inspire Scholarship for Science Students",
    provider: "Government",
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
    name: "KVPY Fellowship",
    provider: "Government",
    type: "Merit-based",
    amount: { value: 75000, currency: "INR", type: "Annual" },
    eligibilityCriteria: {
      academicPercentage: { minimum: 75, maximum: 100 },
      category: ["All"],
      familyIncome: { maximum: 1000000, currency: "INR" },
      stream: ["Science"],
      educationLevel: ["12th", "Undergraduate"],
      state: [],
      age: { minimum: 16, maximum: 23 },
      gender: "All",
    },
    applicationDetails: {
      startDate: new Date("2024-07-01"),
      endDate: new Date("2024-09-30"),
      applicationMode: "Online",
      website: "https://kvpy.iisc.ernet.in",
      documentsRequired: ["Academic transcripts", "KVPY exam scorecard"],
      selectionProcess: "Written test and interview",
    },
    benefits: {
      description: "Fellowship for basic science research aptitude",
      additionalBenefits: ["Summer camps", "Research mentorship"],
    },
    isActive: true,
    isRecurring: true,
    tags: ["Science", "Research", "KVPY", "Fellowship"],
  },

  // Gender-specific Scholarships
  {
    name: "Girl Child Education Grant",
    provider: "NGO",
    type: "Need-based",
    amount: { value: 25000, currency: "INR", type: "One-time" },
    eligibilityCriteria: {
      academicPercentage: { minimum: 70, maximum: 100 },
      category: ["All"],
      familyIncome: { maximum: 400000, currency: "INR" },
      stream: ["All"],
      educationLevel: ["12th", "Undergraduate"],
      state: [],
      age: { minimum: 16, maximum: 25 },
      gender: "Female",
    },
    applicationDetails: {
      startDate: new Date("2024-03-01"),
      endDate: new Date("2024-05-31"),
      applicationMode: "Both",
      website: "https://www.girlchildeducation.org",
      documentsRequired: [
        "Income certificate",
        "Gender certificate",
        "Academic records",
      ],
      selectionProcess: "Need assessment and merit",
    },
    benefits: {
      description:
        "One-time grant for girl students from economically weaker sections",
      additionalBenefits: ["Career counseling", "Mentorship program"],
    },
    isActive: true,
    isRecurring: false,
    tags: ["Girl Child", "Women Empowerment", "Education", "NGO"],
  },
  {
    name: "Indira Gandhi Scholarship for Single Girl Child",
    provider: "Government",
    type: "Need-based",
    amount: { value: 36200, currency: "INR", type: "Annual" },
    eligibilityCriteria: {
      academicPercentage: { minimum: 60, maximum: 100 },
      category: ["All"],
      familyIncome: { maximum: 600000, currency: "INR" },
      stream: ["All"],
      educationLevel: ["Postgraduate"],
      state: [],
      age: { minimum: 21, maximum: 30 },
      gender: "Female",
    },
    applicationDetails: {
      startDate: new Date("2024-08-01"),
      endDate: new Date("2024-10-31"),
      applicationMode: "Online",
      website: "https://www.ugc.ac.in",
      documentsRequired: [
        "Single girl child certificate",
        "Income certificate",
      ],
      selectionProcess: "Merit-based selection",
    },
    benefits: {
      description:
        "Support for single girl child pursuing postgraduate studies",
      additionalBenefits: ["Additional allowances for research"],
    },
    isActive: true,
    isRecurring: true,
    tags: ["Single Girl Child", "UGC", "Postgraduate", "Women"],
  },

  // Corporate Scholarships
  {
    name: "Tech Mahindra Smart Academy Scholarship",
    provider: "Corporate",
    type: "Merit-based",
    amount: { value: 100000, currency: "INR", type: "Annual" },
    eligibilityCriteria: {
      academicPercentage: { minimum: 75, maximum: 100 },
      category: ["All"],
      familyIncome: { maximum: 500000, currency: "INR" },
      stream: ["Engineering", "Science"],
      educationLevel: ["Undergraduate"],
      state: [],
      age: { minimum: 17, maximum: 23 },
      gender: "All",
    },
    applicationDetails: {
      startDate: new Date("2024-07-01"),
      endDate: new Date("2024-09-30"),
      applicationMode: "Online",
      website: "https://www.techmahindra.com/scholarships",
      documentsRequired: [
        "Academic transcripts",
        "Income proof",
        "Personal statement",
      ],
      selectionProcess: "Online test and interview",
    },
    benefits: {
      description: "Annual scholarship with internship opportunities",
      additionalBenefits: [
        "Internship guarantee",
        "Job placement assistance",
        "Laptop",
      ],
    },
    isActive: true,
    isRecurring: true,
    tags: ["Corporate", "Technology", "Internship", "Job Placement"],
  },
  {
    name: "Tata Scholarship Programme",
    provider: "Corporate",
    type: "Merit-based",
    amount: { value: 120000, currency: "INR", type: "Annual" },
    eligibilityCriteria: {
      academicPercentage: { minimum: 80, maximum: 100 },
      category: ["All"],
      familyIncome: { maximum: 400000, currency: "INR" },
      stream: ["All"],
      educationLevel: ["Undergraduate", "Postgraduate"],
      state: [],
      age: { minimum: 18, maximum: 25 },
      gender: "All",
    },
    applicationDetails: {
      startDate: new Date("2024-06-15"),
      endDate: new Date("2024-08-31"),
      applicationMode: "Online",
      website: "https://www.tatatrusts.org",
      documentsRequired: [
        "Academic records",
        "Income certificate",
        "Recommendation letter",
      ],
      selectionProcess: "Application review and interview",
    },
    benefits: {
      description: "Comprehensive scholarship for deserving students",
      additionalBenefits: ["Leadership development", "Career guidance"],
    },
    isActive: true,
    isRecurring: true,
    tags: ["Tata", "Corporate", "Leadership", "Comprehensive"],
  },

  // Minority Community Scholarships
  {
    name: "Minority Community Education Support",
    provider: "Government",
    type: "Category-based",
    amount: { value: 40000, currency: "INR", type: "Annual" },
    eligibilityCriteria: {
      academicPercentage: { minimum: 50, maximum: 100 },
      category: ["Minority"],
      familyIncome: { maximum: 200000, currency: "INR" },
      stream: ["All"],
      educationLevel: ["All"],
      state: [],
      age: { minimum: 16, maximum: 35 },
      gender: "All",
    },
    applicationDetails: {
      startDate: new Date("2024-04-15"),
      endDate: new Date("2024-07-15"),
      applicationMode: "Online",
      website: "https://scholarships.gov.in/minority",
      documentsRequired: [
        "Minority certificate",
        "Income proof",
        "Educational certificates",
      ],
      selectionProcess: "Document verification",
    },
    benefits: {
      description: "Financial support for minority community students",
      additionalBenefits: ["Fee reimbursement", "Book allowance"],
    },
    isActive: true,
    isRecurring: true,
    tags: [
      "Minority",
      "Community Support",
      "Government",
      "Inclusive Education",
    ],
  },
  {
    name: "Maulana Azad National Fellowship",
    provider: "Government",
    type: "Category-based",
    amount: { value: 25000, currency: "INR", type: "Monthly" },
    eligibilityCriteria: {
      academicPercentage: { minimum: 55, maximum: 100 },
      category: ["Minority"],
      familyIncome: { maximum: 600000, currency: "INR" },
      stream: ["All"],
      educationLevel: ["Postgraduate", "Doctorate"],
      state: [],
      age: { minimum: 22, maximum: 35 },
      gender: "All",
    },
    applicationDetails: {
      startDate: new Date("2024-09-01"),
      endDate: new Date("2024-11-30"),
      applicationMode: "Online",
      website: "https://www.ugc.ac.in",
      documentsRequired: [
        "Minority certificate",
        "Research proposal",
        "NET qualification",
      ],
      selectionProcess: "UGC-NET and interview",
    },
    benefits: {
      description: "Fellowship for minority students pursuing research",
      additionalBenefits: ["Research allowance", "Conference support"],
    },
    isActive: true,
    isRecurring: true,
    tags: ["Minority", "Research", "Fellowship", "UGC"],
  },

  // State-specific Scholarships
  {
    name: "State-wise Engineering Excellence Award",
    provider: "Educational Institution",
    type: "Merit-based",
    amount: { value: 60000, currency: "INR", type: "One-time" },
    eligibilityCriteria: {
      academicPercentage: { minimum: 90, maximum: 100 },
      category: ["All"],
      familyIncome: { maximum: 1000000, currency: "INR" },
      stream: ["Engineering"],
      educationLevel: ["12th"],
      state: ["Maharashtra", "Karnataka", "Tamil Nadu"],
      age: { minimum: 17, maximum: 20 },
      gender: "All",
    },
    applicationDetails: {
      startDate: new Date("2024-05-15"),
      endDate: new Date("2024-08-30"),
      applicationMode: "Online",
      website: "https://www.engineeringexcellence.edu.in",
      documentsRequired: ["JEE scores", "State domicile", "Academic records"],
      selectionProcess: "JEE rank based selection",
    },
    benefits: {
      description: "One-time award for top engineering aspirants",
      additionalBenefits: ["College admission guidance", "Career counseling"],
    },
    isActive: true,
    isRecurring: false,
    tags: ["Engineering", "State-specific", "JEE", "Excellence Award"],
  },
  {
    name: "Punjab State Scholarship",
    provider: "Government",
    type: "Need-based",
    amount: { value: 15000, currency: "INR", type: "Annual" },
    eligibilityCriteria: {
      academicPercentage: { minimum: 60, maximum: 100 },
      category: ["All"],
      familyIncome: { maximum: 300000, currency: "INR" },
      stream: ["All"],
      educationLevel: ["All"],
      state: ["Punjab"],
      age: { minimum: 16, maximum: 30 },
      gender: "All",
    },
    applicationDetails: {
      startDate: new Date("2024-04-01"),
      endDate: new Date("2024-06-30"),
      applicationMode: "Online",
      website: "https://punjabscholarship.gov.in",
      documentsRequired: [
        "Domicile certificate",
        "Income certificate",
        "Academic records",
      ],
      selectionProcess: "Merit cum means",
    },
    benefits: {
      description: "State scholarship for Punjab domicile students",
      additionalBenefits: ["Fee assistance", "Book allowance"],
    },
    isActive: true,
    isRecurring: true,
    tags: ["Punjab", "State", "Need-based", "Domicile"],
  },

  // Professional Course Scholarships
  {
    name: "Medical Students Scholarship Scheme",
    provider: "Government",
    type: "Merit-based",
    amount: { value: 90000, currency: "INR", type: "Annual" },
    eligibilityCriteria: {
      academicPercentage: { minimum: 85, maximum: 100 },
      category: ["All"],
      familyIncome: { maximum: 800000, currency: "INR" },
      stream: ["Medical"],
      educationLevel: ["Undergraduate"],
      state: [],
      age: { minimum: 17, maximum: 25 },
      gender: "All",
    },
    applicationDetails: {
      startDate: new Date("2024-08-01"),
      endDate: new Date("2024-10-31"),
      applicationMode: "Online",
      website: "https://www.nmc.org.in",
      documentsRequired: [
        "NEET scorecard",
        "Medical admission proof",
        "Income certificate",
      ],
      selectionProcess: "NEET rank based",
    },
    benefits: {
      description: "Support for medical students with excellent NEET scores",
      additionalBenefits: ["Clinical training support", "Medical equipment"],
    },
    isActive: true,
    isRecurring: true,
    tags: ["Medical", "NEET", "Professional", "Healthcare"],
  },
  {
    name: "Law Students Merit Scholarship",
    provider: "Educational Institution",
    type: "Merit-based",
    amount: { value: 45000, currency: "INR", type: "Annual" },
    eligibilityCriteria: {
      academicPercentage: { minimum: 80, maximum: 100 },
      category: ["All"],
      familyIncome: { maximum: 700000, currency: "INR" },
      stream: ["Law"],
      educationLevel: ["Undergraduate", "Postgraduate"],
      state: [],
      age: { minimum: 18, maximum: 25 },
      gender: "All",
    },
    applicationDetails: {
      startDate: new Date("2024-07-15"),
      endDate: new Date("2024-09-15"),
      applicationMode: "Online",
      website: "https://www.lawscholarship.org",
      documentsRequired: [
        "CLAT scorecard",
        "Law college admission",
        "Academic records",
      ],
      selectionProcess: "CLAT rank and college performance",
    },
    benefits: {
      description: "Merit scholarship for law students",
      additionalBenefits: [
        "Legal internship opportunities",
        "Court visit programs",
      ],
    },
    isActive: true,
    isRecurring: true,
    tags: ["Law", "Legal", "CLAT", "Professional"],
  },

  // International Study Scholarships
  {
    name: "Study Abroad Merit Scholarship",
    provider: "Educational Institution",
    type: "Merit-based",
    amount: { value: 500000, currency: "INR", type: "One-time" },
    eligibilityCriteria: {
      academicPercentage: { minimum: 90, maximum: 100 },
      category: ["All"],
      familyIncome: { maximum: 1500000, currency: "INR" },
      stream: ["All"],
      educationLevel: ["Undergraduate", "Postgraduate"],
      state: [],
      age: { minimum: 18, maximum: 28 },
      gender: "All",
    },
    applicationDetails: {
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-03-31"),
      applicationMode: "Online",
      website: "https://www.studyabroadscholarship.org",
      documentsRequired: [
        "International admission letter",
        "IELTS/TOEFL scores",
        "SOP",
      ],
      selectionProcess: "Academic merit and interview",
    },
    benefits: {
      description: "Financial support for studying abroad",
      additionalBenefits: ["Visa assistance", "Pre-departure orientation"],
    },
    isActive: true,
    isRecurring: false,
    tags: ["Study Abroad", "International", "Merit", "Global Education"],
  },
];

async function populate() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await College.deleteMany({});
    await Scholarship.deleteMany({});
    console.log("Cleared existing data");

    // Insert sample data
    const colleges = await College.insertMany(sampleColleges);
    const scholarships = await Scholarship.insertMany(sampleScholarships);

    console.log("✅ Comprehensive sample data inserted successfully!");
    console.log(`📊 Summary:`);
    console.log(`- ${colleges.length} colleges added`);
    console.log(`- ${scholarships.length} scholarships added`);

    console.log("\n🏫 Colleges by State:");
    const collegesByState = {};
    colleges.forEach((college) => {
      collegesByState[college.location.state] =
        (collegesByState[college.location.state] || 0) + 1;
    });
    Object.entries(collegesByState).forEach(([state, count]) => {
      console.log(`  ${state}: ${count} colleges`);
    });

    console.log("\n💰 Scholarships by Provider:");
    const scholarshipsByProvider = {};
    scholarships.forEach((scholarship) => {
      scholarshipsByProvider[scholarship.provider] =
        (scholarshipsByProvider[scholarship.provider] || 0) + 1;
    });
    Object.entries(scholarshipsByProvider).forEach(([provider, count]) => {
      console.log(`  ${provider}: ${count} scholarships`);
    });

    console.log("\n🎓 Colleges by Stream:");
    const collegesByStream = {};
    colleges.forEach((college) => {
      college.courses.forEach((course) => {
        collegesByStream[course.stream] =
          (collegesByStream[course.stream] || 0) + 1;
      });
    });
    Object.entries(collegesByStream).forEach(([stream, count]) => {
      console.log(`  ${stream}: ${count} courses`);
    });

    console.log("\n💡 Test these scenarios:");
    console.log(
      "1. 90% General Science student - Should find IIT colleges and merit scholarships"
    );
    console.log(
      "2. 65% SC Engineering student - Should find category-based scholarships"
    );
    console.log(
      "3. 75% Female Commerce student - Should find St. Stephens and girl-child scholarships"
    );
    console.log(
      "4. 85% General Medical student - Should find AIIMS and medical scholarships"
    );
    console.log(
      "5. 60% OBC Arts student from Punjab - Should find LPU and state scholarships"
    );
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("📝 Database connection closed");
  }
}

populate();
