const mongoose = require('mongoose');
const College = require('../backend/models/College');
const Scholarship = require('../backend/models/Scholarship');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-eligibility-db';

// Sample Colleges Data
const sampleColleges = [
  {
    name: "Indian Institute of Technology (IIT) Delhi",
    location: {
      state: "Delhi",
      city: "New Delhi",
      pincode: "110016"
    },
    type: "Central",
    courses: [
      {
        name: "B.Tech Computer Science",
        stream: "Engineering",
        eligibilityPercentage: { general: 75, obc: 68, sc: 65, st: 65 },
        fees: { tuition: 250000, hostel: 50000, other: 25000 },
        duration: "4 years",
        seats: 120
      },
      {
        name: "B.Tech Electrical Engineering",
        stream: "Engineering",
        eligibilityPercentage: { general: 73, obc: 66, sc: 63, st: 63 },
        fees: { tuition: 250000, hostel: 50000, other: 25000 },
        duration: "4 years",
        seats: 100
      }
    ],
    eligibilityCriteria: {
      minimumPercentage: { general: 70, obc: 63, sc: 60, st: 60 },
      entranceExam: "JEE Advanced",
      ageLimit: 25,
      stream: ["Science", "Engineering"]
    },
    contactInfo: {
      website: "https://www.iitd.ac.in",
      phone: "+91-11-26581234",
      email: "admissions@iitd.ac.in",
      address: "Hauz Khas, New Delhi, Delhi 110016"
    },
    ranking: { nirf: 2 },
    accreditation: "NAAC A++",
    established: 1961
  },
  {
    name: "Delhi University - St. Stephen's College",
    location: {
      state: "Delhi",
      city: "New Delhi",
      pincode: "110007"
    },
    type: "Central",
    courses: [
      {
        name: "B.A. Economics",
        stream: "Commerce",
        eligibilityPercentage: { general: 95, obc: 90, sc: 85, st: 85 },
        fees: { tuition: 15000, hostel: 30000, other: 10000 },
        duration: "3 years",
        seats: 40
      },
      {
        name: "B.Sc. Physics",
        stream: "Science",
        eligibilityPercentage: { general: 90, obc: 85, sc: 80, st: 80 },
        fees: { tuition: 15000, hostel: 30000, other: 10000 },
        duration: "3 years",
        seats: 35
      }
    ],
    eligibilityCriteria: {
      minimumPercentage: { general: 85, obc: 80, sc: 75, st: 75 },
      entranceExam: "DU Entrance Test",
      ageLimit: 22,
      stream: ["Science", "Commerce", "Arts"]
    },
    contactInfo: {
      website: "https://www.ststephens.edu",
      phone: "+91-11-27667204",
      email: "principal@ststephens.edu",
      address: "University Enclave, Delhi 110007"
    },
    ranking: { nirf: 15 },
    accreditation: "NAAC A++",
    established: 1881
  },
  {
    name: "Government Medical College, Mumbai",
    location: {
      state: "Maharashtra",
      city: "Mumbai",
      pincode: "400012"
    },
    type: "Government",
    courses: [
      {
        name: "MBBS",
        stream: "Medical",
        eligibilityPercentage: { general: 85, obc: 80, sc: 75, st: 75 },
        fees: { tuition: 50000, hostel: 25000, other: 15000 },
        duration: "5.5 years",
        seats: 150
      }
    ],
    eligibilityCriteria: {
      minimumPercentage: { general: 80, obc: 75, sc: 70, st: 70 },
      entranceExam: "NEET",
      ageLimit: 25,
      stream: ["Science", "Medical"]
    },
    contactInfo: {
      website: "https://www.gmcmumbai.edu",
      phone: "+91-22-24134000",
      email: "dean@gmcmumbai.edu",
      address: "Parel, Mumbai, Maharashtra 400012"
    },
    ranking: { nirf: 8 },
    accreditation: "NAAC A+",
    established: 1845
  },
  {
    name: "Lovely Professional University",
    location: {
      state: "Punjab",
      city: "Jalandhar",
      pincode: "144411"
    },
    type: "Private",
    courses: [
      {
        name: "B.Tech CSE",
        stream: "Engineering",
        eligibilityPercentage: { general: 60, obc: 55, sc: 50, st: 50 },
        fees: { tuition: 180000, hostel: 60000, other: 30000 },
        duration: "4 years",
        seats: 300
      },
      {
        name: "BBA",
        stream: "Management",
        eligibilityPercentage: { general: 55, obc: 50, sc: 45, st: 45 },
        fees: { tuition: 120000, hostel: 60000, other: 25000 },
        duration: "3 years",
        seats: 200
      },
      {
        name: "B.A. English",
        stream: "Arts",
        eligibilityPercentage: { general: 50, obc: 45, sc: 40, st: 40 },
        fees: { tuition: 80000, hostel: 60000, other: 20000 },
        duration: "3 years",
        seats: 100
      }
    ],
    eligibilityCriteria: {
      minimumPercentage: { general: 50, obc: 45, sc: 40, st: 40 },
      entranceExam: "LPUNEST",
      ageLimit: 23,
      stream: ["Science", "Commerce", "Arts", "Engineering", "Management"]
    },
    contactInfo: {
      website: "https://www.lpu.in",
      phone: "+91-1824-517000",
      email: "info@lpu.co.in",
      address: "Phagwara, Punjab 144411"
    },
    ranking: { nirf: 45 },
    accreditation: "NAAC A+",
    established: 2005
  },
  {
    name: "Presidency College, Chennai",
    location: {
      state: "Tamil Nadu",
      city: "Chennai",
      pincode: "600005"
    },
    type: "Government",
    courses: [
      {
        name: "B.Sc. Mathematics",
        stream: "Science",
        eligibilityPercentage: { general: 75, obc: 70, sc: 65, st: 65 },
        fees: { tuition: 8000, hostel: 15000, other: 5000 },
        duration: "3 years",
        seats: 80
      },
      {
        name: "B.A. Tamil Literature",
        stream: "Arts",
        eligibilityPercentage: { general: 65, obc: 60, sc: 55, st: 55 },
        fees: { tuition: 6000, hostel: 15000, other: 4000 },
        duration: "3 years",
        seats: 60
      }
    ],
    eligibilityCriteria: {
      minimumPercentage: { general: 60, obc: 55, sc: 50, st: 50 },
      entranceExam: "Tamil Nadu Common Entrance Test",
      ageLimit: 21,
      stream: ["Science", "Arts"]
    },
    contactInfo: {
      website: "https://www.presidencycollege.ac.in",
      phone: "+91-44-28510732",
      email: "principal@presidencycollege.ac.in",
      address: "Kamaraj Salai, Triplicane, Chennai 600005"
    },
    ranking: { nirf: 25 },
    accreditation: "NAAC A",
    established: 1840
  }
];

// Sample Scholarships Data
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
      gender: "All"
    },
    applicationDetails: {
      startDate: new Date("2024-04-01"),
      endDate: new Date("2024-06-30"),
      applicationMode: "Online",
      website: "https://scholarships.gov.in",
      documentsRequired: ["Mark sheet", "Income certificate", "Caste certificate"],
      selectionProcess: "Merit-based selection"
    },
    benefits: {
      description: "Annual scholarship for meritorious students",
      additionalBenefits: ["Books allowance", "Study materials"]
    },
    isActive: true,
    isRecurring: true,
    tags: ["Merit", "Government", "Academic Excellence"]
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
      gender: "All"
    },
    applicationDetails: {
      startDate: new Date("2024-05-01"),
      endDate: new Date("2024-07-31"),
      applicationMode: "Online",
      website: "https://scholarships.gov.in",
      documentsRequired: ["Caste certificate", "Income certificate", "Bank details"],
      selectionProcess: "Document verification"
    },
    benefits: {
      description: "Financial assistance for SC/ST category students",
      additionalBenefits: ["Hostel fees", "Maintenance allowance"]
    },
    isActive: true,
    isRecurring: true,
    tags: ["SC", "ST", "Category-based", "Government"]
  },
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
      gender: "All"
    },
    applicationDetails: {
      startDate: new Date("2024-06-01"),
      endDate: new Date("2024-08-15"),
      applicationMode: "Online",
      website: "https://inspire-dst.gov.in",
      documentsRequired: ["Science stream certificate", "Income proof", "Bank account"],
      selectionProcess: "Merit and interview"
    },
    benefits: {
      description: "Scholarship for students pursuing science courses",
      additionalBenefits: ["Research exposure", "Internship opportunities"]
    },
    isActive: true,
    isRecurring: true,
    tags: ["Science", "Merit", "INSPIRE", "Research"]
  },
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
      gender: "Female"
    },
    applicationDetails: {
      startDate: new Date("2024-03-01"),
      endDate: new Date("2024-05-31"),
      applicationMode: "Both",
      website: "https://www.girlchildeducation.org",
      documentsRequired: ["Income certificate", "Gender certificate", "Academic records"],
      selectionProcess: "Need assessment and merit"
    },
    benefits: {
      description: "One-time grant for girl students from economically weaker sections",
      additionalBenefits: ["Career counseling", "Mentorship program"]
    },
    isActive: true,
    isRecurring: false,
    tags: ["Girl Child", "Women Empowerment", "Education", "NGO"]
  },
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
      gender: "All"
    },
    applicationDetails: {
      startDate: new Date("2024-07-01"),
      endDate: new Date("2024-09-30"),
      applicationMode: "Online",
      website: "https://www.techmahindra.com/scholarships",
      documentsRequired: ["Academic transcripts", "Income proof", "Personal statement"],
      selectionProcess: "Online test and interview"
    },
    benefits: {
      description: "Annual scholarship with internship opportunities",
      additionalBenefits: ["Internship guarantee", "Job placement assistance", "Laptop"]
    },
    isActive: true,
    isRecurring: true,
    tags: ["Corporate", "Technology", "Internship", "Job Placement"]
  },
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
      gender: "All"
    },
    applicationDetails: {
      startDate: new Date("2024-04-15"),
      endDate: new Date("2024-07-15"),
      applicationMode: "Online",
      website: "https://scholarships.gov.in/minority",
      documentsRequired: ["Minority certificate", "Income proof", "Educational certificates"],
      selectionProcess: "Document verification"
    },
    benefits: {
      description: "Financial support for minority community students",
      additionalBenefits: ["Fee reimbursement", "Book allowance"]
    },
    isActive: true,
    isRecurring: true,
    tags: ["Minority", "Community Support", "Government", "Inclusive Education"]
  },
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
      gender: "All"
    },
    applicationDetails: {
      startDate: new Date("2024-05-15"),
      endDate: new Date("2024-08-30"),
      applicationMode: "Online",
      website: "https://www.engineeringexcellence.edu.in",
      documentsRequired: ["JEE scores", "State domicile", "Academic records"],
      selectionProcess: "JEE rank based selection"
    },
    benefits: {
      description: "One-time award for top engineering aspirants",
      additionalBenefits: ["College admission guidance", "Career counseling"]
    },
    isActive: true,
    isRecurring: false,
    tags: ["Engineering", "State-specific", "JEE", "Excellence Award"]
  }
];

async function populateDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await College.deleteMany({});
    await Scholarship.deleteMany({});
    console.log('Cleared existing data');

    // Insert sample colleges
    const colleges = await College.insertMany(sampleColleges);
    console.log(`✅ Inserted ${colleges.length} sample colleges`);

    // Insert sample scholarships
    const scholarships = await Scholarship.insertMany(sampleScholarships);
    console.log(`✅ Inserted ${scholarships.length} sample scholarships`);

    console.log('\\n📊 Sample data summary:');
    console.log(`- Total Colleges: ${colleges.length}`);
    console.log(`- Total Scholarships: ${scholarships.length}`);
    
    console.log('\\n🏫 Colleges by State:');
    const collegesByState = {};
    colleges.forEach(college => {
      collegesByState[college.location.state] = (collegesByState[college.location.state] || 0) + 1;
    });
    Object.entries(collegesByState).forEach(([state, count]) => {
      console.log(`  ${state}: ${count} colleges`);
    });

    console.log('\\n💰 Scholarships by Provider:');
    const scholarshipsByProvider = {};
    scholarships.forEach(scholarship => {
      scholarshipsByProvider[scholarship.provider] = (scholarshipsByProvider[scholarship.provider] || 0) + 1;
    });
    Object.entries(scholarshipsByProvider).forEach(([provider, count]) => {
      console.log(`  ${provider}: ${count} scholarships`);
    });

    console.log('\\n🎯 Database population completed successfully!');
    console.log('\\nYou can now:');
    console.log('1. Start the backend server: cd backend && npm install && npm start');
    console.log('2. Open the frontend: cd frontend && open index.html in browser');
    console.log('3. Test with sample data like:');
    console.log('   - 85% General category Science student');
    console.log('   - 70% SC category Engineering student');
    console.log('   - 60% General category Arts student from Punjab');

  } catch (error) {
    console.error('❌ Error populating database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\\n📝 Database connection closed');
  }
}

// Run the population script
if (require.main === module) {
  populateDatabase();
}

module.exports = {
  sampleColleges,
  sampleScholarships,
  populateDatabase
};