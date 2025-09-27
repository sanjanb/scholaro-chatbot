# Scholaro-ChatBot 🎓

A comprehensive chatbot-based system that helps students identify colleges and scholarships they are eligible for based on their academic percentage and other criteria.

## Problem Statement

Students often struggle to identify which **colleges** and **scholarships** they are eligible for based on their academic percentage. The information is scattered across multiple sources, and eligibility criteria vary by institution and program. As a result, students spend significant time researching and may miss out on potential opportunities.

## Solution

This chatbot-based system allows students to simply input their **percentage (and optionally other details like stream, category, or location)**, and the system instantly provides:

1. **Eligible Colleges** - A list of colleges they can apply to
2. **Eligible Scholarships** - A list of scholarships they qualify for

The system uses a predefined dataset of colleges and scholarships stored in MongoDB with comprehensive eligibility criteria, ensuring a **simple, accessible, and interactive way** for students to explore their opportunities.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Frontend     │    │     Backend     │    │    Database     │
│   (HTML/CSS/JS) │◄──►│  (Node.js/Express)  │◄──►│    (MongoDB)    │
│                 │    │                 │    │                 │
│ • User Interface│    │ • REST API      │    │ • College Data  │
│ • Form Handling │    │ • Chatbot Logic │    │ • Scholarship   │
│ • Results Display│    │ • Search Engine │    │   Data          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Project Structure

```
Scholaro-ChatBot/
├── README.md
├── .gitignore
├── backend/                 # Node.js Backend API
│   ├── package.json
│   ├── server.js           # Main server file
│   ├── .env.example        # Environment variables template
│   ├── models/             # MongoDB Models
│   │   ├── College.js
│   │   └── Scholarship.js
│   └── routes/             # API Routes
│       ├── chatbot.js      # Main chatbot logic
│       ├── colleges.js     # College management
│       └── scholarships.js # Scholarship management
├── frontend/               # Frontend Interface
│   ├── index.html         # Main HTML file
│   ├── styles.css         # CSS styling
│   └── script.js          # JavaScript functionality
├── database/               # Database Related
│   └── sample-data.js     # Sample data population script
└── docs/                  # Documentation
```

## Installation & Setup

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone https://github.com/sanjanb/Scholaro-ChatBot.git
cd Scholaro-ChatBot
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
copy .env.example .env  # Windows
# or
cp .env.example .env   # macOS/Linux

# Edit .env file with your MongoDB connection string
```

**Environment Variables (.env):**

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student-eligibility-db
NODE_ENV=development
```

### 3. Database Setup

```bash
# Make sure MongoDB is running on your system

# Populate sample data (run from project root)
cd database
node sample-data.js
```

### 4. Start the Backend Server

```bash
cd backend
npm start
```

The backend server will be running at `http://localhost:5000`

### 5. Frontend Setup

Open `frontend/index.html` in your web browser or serve it using a local server:

```bash
# Option 1: Direct file opening
# Navigate to frontend/ and open index.html in browser

# Option 2: Using a local server (recommended)
cd frontend
python -m http.server 8000  # Python 3
# or
npx serve .                  # Node.js serve package
```

Access the frontend at `http://localhost:8000`

## API Documentation

### Base URL

```
http://localhost:5000/api
```

### Endpoints

#### 1. Chatbot Query

**POST** `/chatbot/query`

Query the chatbot for eligible colleges and scholarships.

**Request Body:**

```json
{
  "percentage": 85,
  "stream": "Science",
  "category": "General",
  "educationLevel": "12th",
  "state": "Delhi",
  "familyIncome": 500000,
  "age": 18,
  "gender": "All"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "studentInfo": { ... },
    "eligibleColleges": [ ... ],
    "eligibleScholarships": [ ... ],
    "summary": {
      "totalColleges": 3,
      "totalScholarships": 5
    }
  },
  "message": "Great! Based on your 85% score..."
}
```

#### 2. Get Colleges

**GET** `/colleges`

Get paginated list of all colleges with optional filters.

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `state` - Filter by state
- `stream` - Filter by stream
- `type` - Filter by college type

#### 3. Get Scholarships

**GET** `/scholarships`

Get paginated list of all scholarships with optional filters.

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `provider` - Filter by provider
- `type` - Filter by scholarship type
- `category` - Filter by category

#### 4. Search Colleges

**POST** `/colleges/search`

Search colleges by eligibility criteria.

#### 5. Search Scholarships

**POST** `/scholarships/search`

Search scholarships by eligibility criteria.

## Sample Data

The system comes with pre-populated sample data including:

### Colleges (5 institutions)

- **IIT Delhi** - Engineering programs
- **St. Stephen's College, Delhi** - Arts & Commerce
- **Government Medical College, Mumbai** - Medical programs
- **Lovely Professional University** - Multi-disciplinary
- **Presidency College, Chennai** - Science & Arts

### Scholarships (7 schemes)

- **National Merit Scholarship** - Government merit-based
- **SC/ST Scholarship Scheme** - Category-based support
- **Inspire Scholarship** - Science students
- **Girl Child Education Grant** - Gender-specific
- **Tech Mahindra Scholarship** - Corporate sponsorship
- **Minority Community Support** - Community-based
- **Engineering Excellence Award** - State-specific

## Usage Examples

### Example 1: High-performing Science Student

**Input:**

- Percentage: 90%
- Stream: Science
- Category: General

**Expected Results:**

- IIT Delhi (Engineering courses)
- Government Medical College (MBBS)
- National Merit Scholarship
- Inspire Scholarship for Science Students

### Example 2: Commerce Student with Economic Background

**Input:**

- Percentage: 75%
- Stream: Commerce
- Category: General
- Family Income: ₹3,00,000

**Expected Results:**

- St. Stephen's College (Economics)
- National Merit Scholarship
- Various need-based scholarships

### Example 3: SC Category Engineering Aspirant

**Input:**

- Percentage: 65%
- Stream: Engineering
- Category: SC

**Expected Results:**

- IIT Delhi (with relaxed cutoffs)
- Lovely Professional University
- SC/ST Scholarship Scheme
- National Merit Scholarship

## Features

### Core Features

- ✅ **Intelligent Matching** - Matches students with eligible colleges and scholarships
- ✅ **Multi-criteria Filtering** - Percentage, stream, category, location, income
- ✅ **Interactive Chatbot Interface** - User-friendly conversation flow
- ✅ **Comprehensive Database** - Detailed college and scholarship information
- ✅ **Responsive Design** - Works on desktop and mobile devices

### Advanced Features

- ✅ **Category-wise Cutoffs** - Different eligibility for General/OBC/SC/ST
- ✅ **Income-based Filtering** - Family income consideration for scholarships
- ✅ **State-wise Preferences** - Location-based college recommendations
- ✅ **Real-time Results** - Instant matching and display
- ✅ **Detailed Information** - Fees, duration, contact details, rankings

## Future Enhancements

### Phase 2 Features

- [ ] **User Authentication** - Personal profiles and saved searches
- [ ] **Application Tracking** - Track application status
- [ ] **Notification System** - Deadline reminders and updates
- [ ] **Integration with APIs** - Real-time data from official sources
- [ ] **Advanced Analytics** - Success rate tracking and recommendations

### Phase 3 Features

- [ ] **Machine Learning** - Predictive matching based on historical data
- [ ] **Document Management** - Upload and manage application documents
- [ ] **Counseling Integration** - Connect with career counselors
- [ ] **Mobile App** - Native iOS and Android applications

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:** Make sure MongoDB is running on your system.

#### 2. CORS Error

```
Access to fetch at 'http://localhost:5000/api/chatbot/query' from origin 'null' has been blocked by CORS policy
```

**Solution:** Serve the frontend using a local server instead of opening the HTML file directly.

#### 3. No Results Found

**Solution:**

- Check if sample data is populated: `node database/sample-data.js`
- Verify MongoDB connection
- Check if the percentage meets minimum eligibility criteria

#### 4. Backend Dependencies Error

```
Cannot find module 'express'
```

**Solution:** Run `npm install` in the backend directory.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow consistent coding style
- Add comments for complex logic
- Test new features thoroughly
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:

- Create an issue on GitHub
- Check the troubleshooting section
- Review the API documentation

## Acknowledgments

- Thanks to all educational institutions providing open data
- MongoDB community for excellent documentation
- Express.js team for the robust framework
- All contributors and testers

---

**Built with ❤️ to help students find their perfect educational opportunities!**

## Contact

For any queries and suggestions, please reach out through:

- GitHub Issues
- Email: [sanjanacharraya1234@gmail.com]
- LinkedIn: [Your LinkedIn Profile]

---

### Quick Start Commands

```bash
# Complete setup in one go (after installing prerequisites)
git clone https://github.com/sanjanb/Scholaro-ChatBot.git
cd Scholaro-ChatBot
cd backend && npm install && cd ../database && node sample-data.js && cd ../backend && npm start
```

Then open `frontend/index.html` in your browser and start exploring!
