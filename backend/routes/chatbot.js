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

// Helper function to generate chatbot response with clean formatting
function generateChatbotResponse({
  percentage,
  stream,
  category,
  eligibleColleges,
  eligibleScholarships,
}) {
  let response = "";

  // Welcome header with student info
  response += `🎯 PERSONALIZED RECOMMENDATIONS\n\n`;
  response += `👤 Your Profile:\n`;
  response += `   📊 Academic Score: ${percentage}%`;
  if (stream) response += ` | 📚 Stream: ${stream}`;
  if (category !== "General") response += ` | 🏷️ Category: ${category}`;
  response += "\n\n";

  // Performance assessment
  let assessment = "";
  if (percentage >= 90) {
    assessment =
      "🌟 Excellent Performance! You're eligible for top-tier institutions and premium scholarships.";
  } else if (percentage >= 80) {
    assessment =
      "⭐ Very Good Performance! You have access to quality institutions and good scholarship opportunities.";
  } else if (percentage >= 70) {
    assessment =
      "👍 Good Performance! Multiple college options and scholarship possibilities are available.";
  } else if (percentage >= 60) {
    assessment =
      "📈 Fair Performance! Focus on colleges with moderate requirements and explore need-based scholarships.";
  } else {
    assessment =
      "💪 Room for Improvement! Consider alternative pathways and skill-based programs.";
  }
  response += `${assessment}\n\n`;

  // Colleges section with clean formatting
  response += "══════════════════════════════════════════════════\n";
  if (eligibleColleges.length > 0) {
    response += `🎓 ELIGIBLE COLLEGES (${eligibleColleges.length} Found)\n\n`;

    // Top colleges with detailed info
    eligibleColleges.slice(0, 5).forEach((college, index) => {
      const rankInfo = college.ranking?.nirf
        ? ` 🏆 NIRF Rank ${college.ranking.nirf}`
        : "";
      const typeBadge = getCleanTypeBadge(college.type);

      response += `${index + 1}. ${college.name}${rankInfo}\n`;
      response += `   📍 Location: ${college.location.city}, ${college.location.state}\n`;
      response += `   🏛️ Type: ${typeBadge}\n`;

      // Course details
      if (college.courses && college.courses.length > 0) {
        const course = college.courses[0];
        if (course.fees) {
          const totalFees =
            (course.fees.tuition || 0) +
            (course.fees.hostel || 0) +
            (course.fees.other || 0);
          response += `   💰 Annual Fees: ₹${totalFees.toLocaleString()}\n`;
        }
        const courseNames = college.courses
          .map((c) => c.name)
          .slice(0, 2)
          .join(", ");
        response += `   📚 Available Courses: ${courseNames}\n`;
      }
      response += "\n";
    });

    if (eligibleColleges.length > 5) {
      response += `   ➕ ${
        eligibleColleges.length - 5
      } more colleges available - Check detailed results below!\n\n`;
    }
  } else {
    response += `🎓 COLLEGES\n\n`;
    response += `⚠️ No Direct Matches Found\n\n`;
    response += `💡 Suggestions:\n`;
    response += `   • Consider improving academic score for better options\n`;
    response += `   • Explore different streams or specializations\n`;
    response += `   • Look into diploma or certificate programs\n`;
    response += `   • Check state-specific quota colleges\n\n`;
  }

  // Scholarships section with clean formatting
  response += "══════════════════════════════════════════════════\n";
  if (eligibleScholarships.length > 0) {
    response += `💰 SCHOLARSHIP OPPORTUNITIES (${eligibleScholarships.length} Found)\n\n`;

    // Group scholarships by value
    const highValue = eligibleScholarships.filter(
      (s) => s.amount.value >= 75000
    );
    const mediumValue = eligibleScholarships.filter(
      (s) => s.amount.value >= 40000 && s.amount.value < 75000
    );
    const regularValue = eligibleScholarships.filter(
      (s) => s.amount.value < 40000
    );

    if (highValue.length > 0) {
      response += `🌟 HIGH-VALUE SCHOLARSHIPS:\n`;
      highValue.slice(0, 3).forEach((scholarship, index) => {
        response += `   ${index + 1}. ${scholarship.name}\n`;
        response += `      💵 Amount: ₹${scholarship.amount.value.toLocaleString()} (${
          scholarship.amount.type
        })\n`;
        response += `      🏢 Provider: ${scholarship.provider}\n`;
        response += `      🎯 Type: ${getCleanScholarshipType(
          scholarship.type
        )}\n\n`;
      });
    }

    if (mediumValue.length > 0) {
      response += `⭐ GOOD SCHOLARSHIPS:\n`;
      mediumValue.slice(0, 3).forEach((scholarship, index) => {
        response += `   ${index + 1}. ${scholarship.name}\n`;
        response += `      💵 Amount: ₹${scholarship.amount.value.toLocaleString()} (${
          scholarship.amount.type
        })\n`;
        response += `      🏢 Provider: ${scholarship.provider}\n`;
        response += `      🎯 Type: ${getCleanScholarshipType(
          scholarship.type
        )}\n\n`;
      });
    }

    if (regularValue.length > 0 && highValue.length + mediumValue.length < 5) {
      const remaining = regularValue.slice(
        0,
        5 - (highValue.slice(0, 3).length + mediumValue.slice(0, 3).length)
      );
      if (remaining.length > 0) {
        response += `📋 ADDITIONAL SCHOLARSHIPS:\n`;
        remaining.forEach((scholarship, index) => {
          response += `   ${index + 1}. ${scholarship.name}\n`;
          response += `      💵 Amount: ₹${scholarship.amount.value.toLocaleString()} (${
            scholarship.amount.type
          })\n`;
          response += `      🏢 Provider: ${scholarship.provider}\n\n`;
        });
      }
    }

    const totalDisplayed = Math.min(6, eligibleScholarships.length);
    if (eligibleScholarships.length > totalDisplayed) {
      response += `   ➕ ${
        eligibleScholarships.length - totalDisplayed
      } more scholarships available - Check detailed results below!\n\n`;
    }
  } else {
    response += `💰 SCHOLARSHIPS\n\n`;
    response += `⚠️ No Scholarships Found for Current Criteria\n\n`;
    response += `💡 Suggestions:\n`;
    response += `   • Check family income eligibility limits\n`;
    response += `   • Explore need-based scholarships\n`;
    response += `   • Look into category-specific schemes\n`;
    response += `   • Consider applying after improving scores\n\n`;
  }

  // Action plan with priority
  response += "══════════════════════════════════════════════════\n";
  response += `🚀 YOUR ACTION PLAN\n\n`;
  response += `🎯 IMMEDIATE STEPS (Next 2 weeks):\n`;
  response += `   1. 📋 Review detailed college and scholarship information\n`;
  response += `   2. 📅 Note down application deadlines and requirements\n`;
  response += `   3. 📁 Start collecting required documents\n\n`;

  response += `📈 STRATEGIC APPROACH (Next 1-2 months):\n`;
  response += `   4. 🎯 Apply to ${Math.min(
    eligibleColleges.length + 2,
    8
  )} colleges (mix of safe and stretch options)\n`;
  response += `   5. 💰 Apply for ${Math.min(
    eligibleScholarships.length,
    6
  )} scholarships\n`;
  response += `   6. 🔄 Keep backup options ready\n\n`;

  response += `✨ SUCCESS TIPS:\n`;
  response += `   • Start early - Don't wait for last minute\n`;
  response += `   • Apply to multiple options to increase chances\n`;
  response += `   • Keep all documents ready and organized\n`;
  response += `   • Follow up regularly on application status\n\n`;

  response += `💬 Need help with specific colleges or scholarships? Just ask me!`;

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
