const express = require("express");
const router = express.Router();
const College = require("../models/College");
const Scholarship = require("../models/Scholarship");
const openaiService = require("../services/openaiService");

// Chatbot endpoint for student queries with AI enhancement
router.post("/query", async (req, res) => {
  try {
    const {
      percentage,
      stream,
      category = "General",
      state,
      educationLevel = "12th",
      familyIncome,
      age,
      gender = "All",
    } = req.body;

    // Validate required fields
    if (!percentage) {
      return res.status(400).json({
        error: "Percentage is required",
        message: "Please provide your academic percentage",
      });
    }

    const studentData = {
      percentage,
      stream,
      category,
      state,
      educationLevel,
      familyIncome,
      age,
      gender,
    };

    // Find eligible colleges
    const eligibleColleges = await findEligibleColleges({
      percentage,
      stream,
      category,
      state,
    });

    // Find eligible scholarships
    const eligibleScholarships = await findEligibleScholarships({
      percentage,
      stream,
      category,
      state,
      educationLevel,
      familyIncome,
      age,
      gender,
    });

    // Get AI-powered analysis and recommendations
    const aiEnhancedResponse =
      await openaiService.analyzeEligibilityAndRecommend(
        studentData,
        eligibleColleges,
        eligibleScholarships
      );

    // Prepare response with AI insights
    const response = {
      success: true,
      data: {
        studentInfo: studentData,
        eligibleColleges:
          aiEnhancedResponse.recommendations?.colleges || eligibleColleges,
        eligibleScholarships:
          aiEnhancedResponse.recommendations?.scholarships ||
          eligibleScholarships,
        summary: {
          totalColleges: eligibleColleges.length,
          totalScholarships: eligibleScholarships.length,
        },
        // AI-powered enhancements
        aiInsights: aiEnhancedResponse.aiInsights,
        actionPlan: aiEnhancedResponse.actionPlan,
        successTips: aiEnhancedResponse.successTips,
      },
      message: aiEnhancedResponse.enhancedMessage,
    };

    // Add traditional response as fallback
    if (!aiEnhancedResponse.enhancedMessage) {
      response.message = generateChatbotResponse({
        percentage,
        stream,
        category,
        eligibleColleges,
        eligibleScholarships,
      });
    }

    res.json(response);
  } catch (error) {
    console.error("Chatbot query error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Something went wrong while processing your query",
    });
  }
});

// New endpoint for detailed AI analysis
router.post("/analyze", async (req, res) => {
  try {
    const studentData = req.body;

    if (!studentData.percentage) {
      return res.status(400).json({
        error: "Percentage is required",
        message: "Please provide your academic percentage",
      });
    }

    // Get basic eligibility data
    const eligibleColleges = await findEligibleColleges(studentData);
    const eligibleScholarships = await findEligibleScholarships(studentData);

    // Get comprehensive AI analysis
    const analysis = await openaiService.analyzeEligibilityAndRecommend(
      studentData,
      eligibleColleges,
      eligibleScholarships
    );

    res.json({
      success: true,
      analysis: analysis.aiInsights.analysis,
      recommendations: analysis.recommendations,
      actionPlan: analysis.actionPlan,
      successTips: analysis.successTips,
      isAIGenerated: analysis.aiInsights.isAIGenerated,
    });
  } catch (error) {
    console.error("AI analysis error:", error);
    res.status(500).json({
      error: "Analysis failed",
      message: "Unable to generate detailed analysis",
    });
  }
});

// Helper function to find eligible colleges
async function findEligibleColleges({ percentage, stream, category, state }) {
  const query = {};

  // Build query based on eligibility criteria
  const categoryField = `eligibilityCriteria.minimumPercentage.${category.toLowerCase()}`;
  query[categoryField] = { $lte: percentage };

  if (stream) {
    query["courses.stream"] = stream;
  }

  if (state) {
    query["location.state"] = new RegExp(state, "i");
  }

  try {
    const colleges = await College.find(query)
      .select(
        "name location type courses eligibilityCriteria contactInfo ranking"
      )
      .limit(20)
      .sort({ "ranking.nirf": 1 });

    return colleges.filter((college) => {
      // Additional filtering for courses based on student's percentage and category
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
  } catch (error) {
    console.error("Error finding eligible colleges:", error);
    return [];
  }
}

// Helper function to find eligible scholarships
async function findEligibleScholarships({
  percentage,
  stream,
  category,
  state,
  educationLevel,
  familyIncome,
  age,
  gender,
}) {
  const query = {
    isActive: true,
    "eligibilityCriteria.academicPercentage.minimum": { $lte: percentage },
  };

  // Category filter
  if (category !== "General") {
    query["eligibilityCriteria.category"] = { $in: [category, "All"] };
  }

  // Stream filter
  if (stream) {
    query["eligibilityCriteria.stream"] = { $in: [stream, "All"] };
  }

  // Education level filter
  query["eligibilityCriteria.educationLevel"] = {
    $in: [educationLevel, "All"],
  };

  // Family income filter
  if (familyIncome) {
    query.$or = [
      { "eligibilityCriteria.familyIncome.maximum": { $gte: familyIncome } },
      { "eligibilityCriteria.familyIncome.maximum": { $exists: false } },
    ];
  }

  // Age filter
  if (age) {
    query.$and = query.$and || [];
    query.$and.push({
      $or: [
        { "eligibilityCriteria.age.minimum": { $lte: age } },
        { "eligibilityCriteria.age.minimum": { $exists: false } },
      ],
    });
    query.$and.push({
      $or: [
        { "eligibilityCriteria.age.maximum": { $gte: age } },
        { "eligibilityCriteria.age.maximum": { $exists: false } },
      ],
    });
  }

  // Gender filter
  query["eligibilityCriteria.gender"] = { $in: [gender, "All"] };

  // State filter
  if (state) {
    query.$or = query.$or || [];
    query.$or.push(
      { "eligibilityCriteria.state": { $in: [state] } },
      { "eligibilityCriteria.state": { $size: 0 } }
    );
  }

  try {
    const scholarships = await Scholarship.find(query)
      .select(
        "name provider type amount eligibilityCriteria applicationDetails benefits"
      )
      .limit(15)
      .sort({ "amount.value": -1 });

    return scholarships;
  } catch (error) {
    console.error("Error finding eligible scholarships:", error);
    return [];
  }
}

// Helper function to generate chatbot response with clean formatting (no markdown)
function generateChatbotResponse({
  percentage,
  stream,
  category,
  eligibleColleges,
  eligibleScholarships,
}) {
  let response = "";

  // Header with student info
  response += "STUDENT PROFILE\n";
  response += "═".repeat(50) + "\n";
  response += `🎓 Academic Score: ${percentage}%\n`;
  if (stream) response += `📚 Stream: ${stream}\n`;
  if (category && category !== "General")
    response += `🎯 Category: ${category}\n`;
  response += "\n";

  // College recommendations
  response += "COLLEGE RECOMMENDATIONS\n";
  response += "═".repeat(50) + "\n";

  if (eligibleColleges.length > 0) {
    response += `🏫 Found ${eligibleColleges.length} Eligible Colleges\n\n`;

    const displayColleges = eligibleColleges.slice(0, 5);
    displayColleges.forEach((college, index) => {
      response += `${index + 1}. ${college.name}\n`;
      response += `   ${getCleanTypeBadge(college.type)} | Location: ${
        college.location.city
      }, ${college.location.state}\n`;
      if (college.ranking && college.ranking.nirf) {
        response += `   NIRF Ranking: ${college.ranking.nirf}\n`;
      }

      // Show available courses
      if (college.courses && college.courses.length > 0) {
        response += `   Available Courses: ${college.courses
          .slice(0, 3)
          .map((c) => c.name)
          .join(", ")}\n`;
        if (college.courses.length > 3) {
          response += `   ... and ${college.courses.length - 3} more courses\n`;
        }
      }
      response += "\n";
    });

    if (eligibleColleges.length > 5) {
      const remainingCount = eligibleColleges.length - 5;
      response += `   ➕ ${remainingCount} more colleges available - Check detailed results below!\n\n`;
    }
  } else {
    response += "⚠️ No Colleges Found for Current Criteria\n\n";
    response += "💡 Suggestions:\n";
    response += "   • Consider broadening your location preferences\n";
    response += "   • Look into private colleges with lower cutoffs\n";
    response += "   • Explore diploma or certificate programs\n";
    response += "   • Consider improving scores and applying next year\n\n";
  }

  // Scholarship recommendations
  response += "SCHOLARSHIP OPPORTUNITIES\n";
  response += "═".repeat(50) + "\n";

  if (eligibleScholarships.length > 0) {
    response += `💰 Found ${eligibleScholarships.length} Eligible Scholarships\n\n`;

    const displayScholarships = eligibleScholarships.slice(0, 4);
    displayScholarships.forEach((scholarship, index) => {
      response += `${index + 1}. ${scholarship.name}\n`;
      response += `   ${getCleanScholarshipType(
        scholarship.type
      )} | Provider: ${scholarship.provider}\n`;
      if (scholarship.amount && scholarship.amount.value) {
        response += `   Amount: ₹${scholarship.amount.value.toLocaleString()}\n`;
      }
      if (
        scholarship.applicationDetails &&
        scholarship.applicationDetails.deadline
      ) {
        response += `   Deadline: ${scholarship.applicationDetails.deadline}\n`;
      }
      response += "\n";
    });

    if (eligibleScholarships.length > 4) {
      const remainingCount = eligibleScholarships.length - 4;
      response += `   ➕ ${remainingCount} more scholarships available - Check detailed results below!\n\n`;
    }
  } else {
    response += "💰 SCHOLARSHIPS\n\n";
    response += "⚠️ No Scholarships Found for Current Criteria\n\n";
    response += "💡 Suggestions:\n";
    response += "   • Check family income eligibility limits\n";
    response += "   • Explore need-based scholarships\n";
    response += "   • Look into category-specific schemes\n";
    response += "   • Consider applying after improving scores\n\n";
  }

  // Action plan with priority
  response += "YOUR ACTION PLAN\n";
  response += "═".repeat(50) + "\n";
  response += "🎯 IMMEDIATE STEPS (Next 2 weeks):\n";
  response += "   1. 📋 Review detailed college and scholarship information\n";
  response += "   2. 📅 Note down application deadlines and requirements\n";
  response += "   3. 📁 Start collecting required documents\n\n";

  response += "📈 STRATEGIC APPROACH (Next 1-2 months):\n";
  response += `   4. 🎯 Apply to ${Math.min(
    eligibleColleges.length + 2,
    8
  )} colleges (mix of safe and stretch options)\n`;
  response += `   5. 💰 Apply for ${Math.min(
    eligibleScholarships.length,
    6
  )} scholarships\n`;
  response += "   6. 🔄 Keep backup options ready\n\n";

  response += "✨ SUCCESS TIPS:\n";
  response += "   • Start early - Don't wait for last minute\n";
  response += "   • Apply to multiple options to increase chances\n";
  response += "   • Keep all documents ready and organized\n";
  response += "   • Follow up regularly on application status\n\n";

  response +=
    "💬 Need help with specific colleges or scholarships? Just ask me!";

  return response;
}

// Helper function to get clean college type (without markdown)
function getCleanTypeBadge(type) {
  const badges = {
    Central: "Central University",
    State: "State University",
    Private: "Private Institution",
    Deemed: "Deemed University",
    Government: "Government College",
  };
  return badges[type] || type;
}

// Helper function to get clean scholarship type (without markdown)
function getCleanScholarshipType(type) {
  const badges = {
    "Merit-based": "Merit Based",
    "Need-based": "Need Based",
    "Category-based": "Category Based",
    "Sports-based": "Sports Based",
  };
  return badges[type] || type;
}

module.exports = router;
