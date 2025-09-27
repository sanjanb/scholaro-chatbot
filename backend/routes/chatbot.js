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

// Helper function to generate chatbot response
function generateChatbotResponse({
  percentage,
  stream,
  category,
  eligibleColleges,
  eligibleScholarships,
}) {
  let response = `Great! Based on your ${percentage}% score`;

  if (stream) response += ` in ${stream}`;
  if (category !== "General") response += ` (${category} category)`;

  response += `, here's what I found for you:\n\n`;

  // Colleges summary
  if (eligibleColleges.length > 0) {
    response += `🎓 **COLLEGES (${eligibleColleges.length} found):**\n`;
    eligibleColleges.slice(0, 5).forEach((college, index) => {
      response += `${index + 1}. ${college.name} - ${college.location.city}, ${
        college.location.state
      }\n`;
      response += `   Type: ${college.type}`;
      if (college.ranking?.nirf)
        response += ` | NIRF Rank: ${college.ranking.nirf}`;
      response += "\n";
    });
    if (eligibleColleges.length > 5) {
      response += `   ... and ${eligibleColleges.length - 5} more colleges\n`;
    }
    response += "\n";
  } else {
    response += `🎓 **COLLEGES:** Unfortunately, I couldn't find any colleges matching your criteria. You might want to consider improving your percentage or looking at different streams.\n\n`;
  }

  // Scholarships summary
  if (eligibleScholarships.length > 0) {
    response += `💰 **SCHOLARSHIPS (${eligibleScholarships.length} found):**\n`;
    eligibleScholarships.slice(0, 5).forEach((scholarship, index) => {
      response += `${index + 1}. ${scholarship.name}\n`;
      response += `   Provider: ${
        scholarship.provider
      } | Amount: ₹${scholarship.amount.value.toLocaleString()} (${
        scholarship.amount.type
      })\n`;
      response += `   Type: ${scholarship.type}\n`;
    });
    if (eligibleScholarships.length > 5) {
      response += `   ... and ${
        eligibleScholarships.length - 5
      } more scholarships\n`;
    }
    response += "\n";
  } else {
    response += `💰 **SCHOLARSHIPS:** No scholarships found for your current criteria. Consider checking eligibility requirements or improving your academic performance.\n\n`;
  }

  response += `📝 **Next Steps:**\n`;
  response += `1. Review the detailed information for each option\n`;
  response += `2. Check application deadlines and requirements\n`;
  response += `3. Prepare necessary documents\n`;
  response += `4. Apply to multiple colleges and scholarships to increase your chances\n\n`;
  response += `Need more specific information? Feel free to ask!`;

  return response;
}

module.exports = router;
