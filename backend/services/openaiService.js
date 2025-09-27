const OpenAI = require("openai");

class OpenAIService {
  constructor() {
    // Initialize OpenAI client
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "demo-key",
    });

    // Flag to check if API key is configured
    this.isConfigured =
      process.env.OPENAI_API_KEY &&
      process.env.OPENAI_API_KEY !== "your_openai_api_key_here" &&
      process.env.OPENAI_API_KEY !== "demo-key";
  }

  /**
   * Analyze student eligibility and provide personalized recommendations
   * @param {Object} studentData - Student information
   * @param {Array} eligibleColleges - Colleges found by basic filtering
   * @param {Array} eligibleScholarships - Scholarships found by basic filtering
   * @returns {Object} Enhanced recommendations with AI insights
   */
  async analyzeEligibilityAndRecommend(
    studentData,
    eligibleColleges,
    eligibleScholarships
  ) {
    if (!this.isConfigured) {
      // Return enhanced response without OpenAI if not configured
      return this.getFallbackRecommendations(
        studentData,
        eligibleColleges,
        eligibleScholarships
      );
    }

    try {
      const prompt = this.buildAnalysisPrompt(
        studentData,
        eligibleColleges,
        eligibleScholarships
      );

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an expert education counselor with deep knowledge of Indian higher education, admission processes, and scholarship opportunities. Provide personalized, actionable advice to help students make informed decisions about their education.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1500,
        temperature: 0.7,
      });

      const aiAnalysis = response.choices[0].message.content;
      return this.parseAIResponse(
        aiAnalysis,
        studentData,
        eligibleColleges,
        eligibleScholarships
      );
    } catch (error) {
      console.error("OpenAI API Error:", error);
      // Fallback to rule-based recommendations if OpenAI fails
      return this.getFallbackRecommendations(
        studentData,
        eligibleColleges,
        eligibleScholarships
      );
    }
  }

  /**
   * Build comprehensive prompt for OpenAI analysis
   */
  buildAnalysisPrompt(studentData, eligibleColleges, eligibleScholarships) {
    const {
      percentage,
      stream,
      category,
      state,
      educationLevel,
      familyIncome,
      age,
      gender,
    } = studentData;

    let prompt = `
STUDENT PROFILE ANALYSIS REQUEST

Student Details:
- Academic Percentage: ${percentage}%
- Stream: ${stream || "Not specified"}
- Category: ${category}
- Education Level: ${educationLevel}
- State Preference: ${state || "No preference"}
- Family Income: ${
      familyIncome ? `₹${familyIncome.toLocaleString()}` : "Not provided"
    }
- Age: ${age || "Not provided"}
- Gender: ${gender}

ELIGIBLE COLLEGES FOUND (${eligibleColleges.length}):
${eligibleColleges
  .slice(0, 8)
  .map(
    (college, index) => `
${index + 1}. ${college.name}
   - Location: ${college.location.city}, ${college.location.state}
   - Type: ${college.type}
   - NIRF Rank: ${college.ranking?.nirf || "Not ranked"}
   - Courses: ${college.courses
     .map((c) => `${c.name} (${c.stream})`)
     .join(", ")}
   - Fees: ₹${college.courses[0]?.fees?.tuition || "N/A"}/year
`
  )
  .join("")}

ELIGIBLE SCHOLARSHIPS FOUND (${eligibleScholarships.length}):
${eligibleScholarships
  .slice(0, 8)
  .map(
    (scholarship, index) => `
${index + 1}. ${scholarship.name}
   - Provider: ${scholarship.provider}
   - Type: ${scholarship.type}
   - Amount: ₹${scholarship.amount.value.toLocaleString()} (${
      scholarship.amount.type
    })
   - Min. Percentage: ${
     scholarship.eligibilityCriteria.academicPercentage?.minimum || "N/A"
   }%
`
  )
  .join("")}

ANALYSIS REQUIREMENTS:
1. **Eligibility Assessment**: Analyze the student's profile comprehensively
2. **College Rankings**: Rank the top 5 colleges based on the student's profile, considering factors like:
   - Academic fit (percentage vs requirements)
   - Career goals alignment
   - Financial feasibility
   - Location preferences
   - Admission probability
3. **Scholarship Prioritization**: Rank top 5 scholarships by:
   - Eligibility match
   - Award amount
   - Application difficulty
   - Success probability
4. **Strategic Recommendations**: Provide actionable advice on:
   - Application strategy
   - Areas for improvement
   - Timeline planning
   - Document preparation
5. **Alternative Suggestions**: If limited options, suggest ways to improve eligibility

RESPONSE FORMAT:
Provide a structured analysis with:
- Overall Assessment
- Top 5 College Recommendations (with reasons)
- Top 5 Scholarship Recommendations (with reasons)
- Strategic Action Plan
- Tips for Success

Keep the response informative, encouraging, and actionable.
`;

    return prompt.trim();
  }

  /**
   * Parse and structure the AI response
   */
  parseAIResponse(
    aiAnalysis,
    studentData,
    eligibleColleges,
    eligibleScholarships
  ) {
    return {
      aiInsights: {
        analysis: aiAnalysis,
        isAIGenerated: true,
        timestamp: new Date().toISOString(),
      },
      enhancedMessage: this.generateEnhancedMessage(studentData, aiAnalysis),
      recommendations: {
        colleges: this.rankColleges(eligibleColleges, studentData),
        scholarships: this.rankScholarships(eligibleScholarships, studentData),
      },
      actionPlan: this.extractActionPlan(aiAnalysis),
      successTips: this.extractSuccessTips(aiAnalysis),
    };
  }

  /**
   * Generate enhanced conversational message
   */
  generateEnhancedMessage(studentData, aiAnalysis) {
    const { percentage, stream, category } = studentData;

    let message = `🎓 **AI-Powered Analysis Complete!**\n\n`;
    message += `Based on your ${percentage}% score`;
    if (stream) message += ` in ${stream}`;
    if (category !== "General") message += ` (${category} category)`;
    message += `, here's my comprehensive recommendation:\n\n`;

    // Add a condensed version of AI insights
    const lines = aiAnalysis.split("\n");
    const summary = lines.slice(0, 8).join("\n");
    message += `${summary}\n\n`;

    message += `💡 **Key Insights:**\n`;
    message += `• Personalized recommendations based on your profile\n`;
    message += `• Strategic application approach suggested\n`;
    message += `• Timeline and preparation guidance included\n\n`;

    return message;
  }

  /**
   * Intelligent college ranking based on student profile
   */
  rankColleges(colleges, studentData) {
    return colleges
      .map((college) => {
        let score = 0;
        let reasoning = [];

        // Academic fit scoring
        const course = college.courses[0];
        if (course) {
          const requiredPercentage =
            course.eligibilityPercentage?.[
              studentData.category.toLowerCase()
            ] ||
            college.eligibilityCriteria?.minimumPercentage?.[
              studentData.category.toLowerCase()
            ] ||
            50;

          const percentageDiff = studentData.percentage - requiredPercentage;
          if (percentageDiff >= 20) {
            score += 30;
            reasoning.push(
              "Excellent academic match - well above requirements"
            );
          } else if (percentageDiff >= 10) {
            score += 20;
            reasoning.push(
              "Good academic fit - comfortably meets requirements"
            );
          } else if (percentageDiff >= 0) {
            score += 10;
            reasoning.push("Meets minimum requirements");
          }
        }

        // Stream alignment
        if (
          studentData.stream &&
          college.courses.some((c) => c.stream === studentData.stream)
        ) {
          score += 25;
          reasoning.push(`Perfect stream match for ${studentData.stream}`);
        }

        // Location preference
        if (
          studentData.state &&
          college.location.state.toLowerCase() ===
            studentData.state.toLowerCase()
        ) {
          score += 15;
          reasoning.push("Matches your preferred state");
        }

        // Ranking bonus
        if (college.ranking?.nirf && college.ranking.nirf <= 10) {
          score += 20;
          reasoning.push(
            `Top-tier institution (NIRF Rank: ${college.ranking.nirf})`
          );
        } else if (college.ranking?.nirf && college.ranking.nirf <= 50) {
          score += 10;
          reasoning.push(
            `Well-ranked institution (NIRF Rank: ${college.ranking.nirf})`
          );
        }

        // Affordability (if income provided)
        if (studentData.familyIncome && course?.fees) {
          const annualFees =
            course.fees.tuition +
            (course.fees.hostel || 0) +
            (course.fees.other || 0);
          const affordabilityRatio = annualFees / studentData.familyIncome;

          if (affordabilityRatio <= 0.2) {
            score += 15;
            reasoning.push("Highly affordable based on family income");
          } else if (affordabilityRatio <= 0.4) {
            score += 10;
            reasoning.push("Reasonably affordable");
          } else if (affordabilityRatio > 0.6) {
            score -= 10;
            reasoning.push("May require financial assistance");
          }
        }

        return {
          ...(college.toObject ? college.toObject() : college),
          aiScore: score,
          aiReasoning: reasoning,
          recommendationPriority:
            score >= 60 ? "High" : score >= 40 ? "Medium" : "Low",
        };
      })
      .sort((a, b) => b.aiScore - a.aiScore);
  }

  /**
   * Intelligent scholarship ranking
   */
  rankScholarships(scholarships, studentData) {
    return scholarships
      .map((scholarship) => {
        let score = 0;
        let reasoning = [];

        // Percentage fit
        const minPercentage =
          scholarship.eligibilityCriteria.academicPercentage?.minimum || 0;
        const percentageBuffer = studentData.percentage - minPercentage;

        if (percentageBuffer >= 20) {
          score += 25;
          reasoning.push("Excellent academic match - high success probability");
        } else if (percentageBuffer >= 10) {
          score += 15;
          reasoning.push("Good academic fit");
        } else if (percentageBuffer >= 0) {
          score += 10;
          reasoning.push("Meets minimum requirements");
        }

        // Award amount
        const amount = scholarship.amount.value;
        if (amount >= 75000) {
          score += 20;
          reasoning.push("High-value scholarship");
        } else if (amount >= 40000) {
          score += 15;
          reasoning.push("Good financial support");
        } else if (amount >= 20000) {
          score += 10;
          reasoning.push("Moderate financial assistance");
        }

        // Category match
        const categories = scholarship.eligibilityCriteria.category || [];
        if (
          categories.includes(studentData.category) ||
          categories.includes("All")
        ) {
          score += 15;
          reasoning.push(`Perfect category match for ${studentData.category}`);
        }

        // Income eligibility
        if (
          studentData.familyIncome &&
          scholarship.eligibilityCriteria.familyIncome?.maximum
        ) {
          if (
            studentData.familyIncome <=
            scholarship.eligibilityCriteria.familyIncome.maximum
          ) {
            score += 20;
            reasoning.push("Income criteria satisfied");
          } else {
            score -= 30;
            reasoning.push("Income exceeds eligibility limit");
          }
        }

        // Stream match
        const eligibleStreams = scholarship.eligibilityCriteria.stream || [];
        if (
          studentData.stream &&
          (eligibleStreams.includes(studentData.stream) ||
            eligibleStreams.includes("All"))
        ) {
          score += 10;
          reasoning.push("Stream requirements met");
        }

        // Provider trust factor
        if (scholarship.provider === "Government") {
          score += 10;
          reasoning.push("Government-backed reliability");
        } else if (scholarship.provider === "Corporate") {
          score += 5;
          reasoning.push("Corporate scholarship with additional benefits");
        }

        return {
          ...(scholarship.toObject ? scholarship.toObject() : scholarship),
          aiScore: score,
          aiReasoning: reasoning,
          recommendationPriority:
            score >= 60 ? "High" : score >= 40 ? "Medium" : "Low",
        };
      })
      .sort((a, b) => b.aiScore - a.aiScore);
  }

  /**
   * Extract action plan from AI response
   */
  extractActionPlan(aiAnalysis) {
    // Simple extraction - in a real implementation, you might use more sophisticated NLP
    const lines = aiAnalysis.split("\n");
    const actionLines = lines.filter(
      (line) =>
        line.includes("action") ||
        line.includes("step") ||
        line.includes("recommendation") ||
        line.match(/^\d+\./)
    );

    return actionLines.length > 0
      ? actionLines.slice(0, 5)
      : [
          "1. Apply to multiple colleges to increase chances",
          "2. Prepare all required documents in advance",
          "3. Meet application deadlines",
          "4. Apply for multiple scholarships",
          "5. Consider backup options",
        ];
  }

  /**
   * Extract success tips from AI response
   */
  extractSuccessTips(aiAnalysis) {
    // Extract tips or provide default ones
    return [
      "Start applications early to avoid last-minute rush",
      "Prepare a compelling personal statement",
      "Get strong letters of recommendation",
      "Keep all documents organized and ready",
      "Follow up on application status regularly",
    ];
  }

  /**
   * Fallback recommendations when OpenAI is not available
   */
  getFallbackRecommendations(
    studentData,
    eligibleColleges,
    eligibleScholarships
  ) {
    const { percentage, stream, category } = studentData;

    let message = `📊 **Analysis Complete!**\n\n`;
    message += `Based on your ${percentage}% score`;
    if (stream) message += ` in ${stream}`;
    if (category !== "General") message += ` (${category} category)`;
    message += `, here's my recommendation:\n\n`;

    // Simple rule-based analysis
    if (percentage >= 90) {
      message += `🎯 **Excellent Performance!** You're eligible for top-tier institutions and merit scholarships.\n\n`;
    } else if (percentage >= 75) {
      message += `👍 **Good Performance!** You have solid options across multiple institutions.\n\n`;
    } else if (percentage >= 60) {
      message += `📈 **Fair Performance!** Focus on colleges with moderate requirements and need-based scholarships.\n\n`;
    } else {
      message += `💪 **Room for Improvement!** Consider improving scores or exploring alternative pathways.\n\n`;
    }

    return {
      aiInsights: {
        analysis: message,
        isAIGenerated: false,
        timestamp: new Date().toISOString(),
      },
      enhancedMessage: message,
      recommendations: {
        colleges: this.rankColleges(eligibleColleges, studentData),
        scholarships: this.rankScholarships(eligibleScholarships, studentData),
      },
      actionPlan: [
        "1. Apply to colleges within your percentage range",
        "2. Explore both merit and need-based scholarships",
        "3. Prepare required documents early",
        "4. Consider multiple application rounds",
        "5. Have backup options ready",
      ],
      successTips: [
        "Research thoroughly before applying",
        "Meet all eligibility criteria",
        "Submit applications before deadlines",
        "Keep track of all applications",
        "Stay positive and persistent",
      ],
    };
  }
}

module.exports = new OpenAIService();
