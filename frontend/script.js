// API Base URL - Change this to your backend URL
const API_BASE_URL = "http://localhost:8002/api";

// DOM Elements
const studentForm = document.getElementById("studentForm");
const submitBtn = document.getElementById("submitBtn");
const loading = document.getElementById("loading");
const chatMessages = document.getElementById("chatMessages");

// Form submission handler
submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  // Get form data
  const formData = getFormData();

  // Validate required fields
  if (!validateForm(formData)) {
    return;
  }

  // Show user message
  addUserMessage(formData);

  // Show loading
  showLoading();

  try {
    // Make API call
    const response = await fetch(`${API_BASE_URL}/chatbot/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    // Hide loading
    hideLoading();

    if (data.success) {
      // Show bot response
      addBotMessage(data.message);

      // Show AI insights if available
      if (data.data.aiInsights) {
        showAIInsights(data.data.aiInsights);
      }

      // Show detailed results with AI enhancements
      showDetailedResults(data.data);

      // Show action plan if available
      if (data.data.actionPlan) {
        showActionPlan(data.data.actionPlan);
      }

      // Show success tips if available
      if (data.data.successTips) {
        showSuccessTips(data.data.successTips);
      }
    } else {
      addBotMessage(
        `❌ Sorry, I encountered an error: ${
          data.message || "Please try again later."
        }`
      );
    }
  } catch (error) {
    console.error("API Error:", error);
    hideLoading();
    addBotMessage(
      "❌ Sorry, I'm having trouble connecting to the server. Please check your internet connection and try again."
    );
  }
});

// Get form data
function getFormData() {
  return {
    percentage: parseFloat(document.getElementById("percentage").value),
    stream: document.getElementById("stream").value || null,
    category: document.getElementById("category").value,
    educationLevel: document.getElementById("educationLevel").value,
    state: document.getElementById("state").value.trim() || null,
    familyIncome: document.getElementById("familyIncome").value
      ? parseInt(document.getElementById("familyIncome").value)
      : null,
    age: document.getElementById("age").value
      ? parseInt(document.getElementById("age").value)
      : null,
    gender: document.getElementById("gender").value,
  };
}

// Validate form
function validateForm(data) {
  if (!data.percentage || data.percentage < 0 || data.percentage > 100) {
    alert("Please enter a valid academic percentage between 0 and 100.");
    return false;
  }

  if (data.age && (data.age < 15 || data.age > 30)) {
    alert("Please enter a valid age between 15 and 30.");
    return false;
  }

  return true;
}

// Add user message to chat
function addUserMessage(formData) {
  const messageDiv = document.createElement("div");
  messageDiv.className = "message user-message";

  let messageText = `I'm a ${formData.percentage}% ${formData.category} category student`;
  if (formData.stream) messageText += ` from ${formData.stream} stream`;
  if (formData.educationLevel !== "12th")
    messageText += ` at ${formData.educationLevel} level`;
  messageText += ".";

  if (formData.state) messageText += ` I prefer colleges in ${formData.state}.`;
  if (formData.familyIncome)
    messageText += ` My family's annual income is ₹${formData.familyIncome.toLocaleString()}.`;
  if (formData.age) messageText += ` I am ${formData.age} years old.`;

  messageText += " Please help me find suitable colleges and scholarships!";

  messageDiv.innerHTML = `
        <div class="message-content">
            <i class="fas fa-user"></i>
            <div class="text">
                <p>${messageText}</p>
            </div>
        </div>
    `;

  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add bot message to chat
function addBotMessage(message) {
  const messageDiv = document.createElement("div");
  messageDiv.className = "message bot-message";

  // Convert newlines to paragraphs and format the message
  const formattedMessage = formatBotMessage(message);

  messageDiv.innerHTML = `
        <div class="message-content">
            <i class="fas fa-robot"></i>
            <div class="text">
                ${formattedMessage}
            </div>
        </div>
    `;

  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Format bot message
function formatBotMessage(message) {
  // Split by double newlines to create paragraphs
  const paragraphs = message.split("\\n\\n");

  return paragraphs
    .map((paragraph) => {
      // Split single newlines within paragraphs
      const lines = paragraph.split("\\n");
      const formattedLines = lines.map((line) => {
        // Format bold text
        line = line.replace(/\\*\\*(.*?)\\*\\*/g, "<strong>$1</strong>");
        return line;
      });

      if (formattedLines.length === 1) {
        return `<p>${formattedLines[0]}</p>`;
      } else {
        return `<p>${formattedLines.join("<br>")}</p>`;
      }
    })
    .join("");
}

// Show loading
function showLoading() {
  loading.classList.add("show");
  studentForm.style.display = "none";
}

// Hide loading
function hideLoading() {
  loading.classList.remove("show");
  // Keep form hidden after first submission to show results
}

// Show detailed results
function showDetailedResults(data) {
  // Remove existing results
  const existingResults = document.querySelector(".results");
  if (existingResults) {
    existingResults.remove();
  }

  const resultsDiv = document.createElement("div");
  resultsDiv.className = "results";

  let resultsHTML = `
        <div class="results-section">
            <h4><i class="fas fa-chart-bar"></i> Summary</h4>
            <div class="summary-cards">
                <div class="summary-card">
                    <strong>${data.summary.totalColleges}</strong> eligible colleges found
                </div>
                <div class="summary-card">
                    <strong>${data.summary.totalScholarships}</strong> eligible scholarships found
                </div>
            </div>
        </div>
    `;

  // Colleges section
  if (data.eligibleColleges && data.eligibleColleges.length > 0) {
    resultsHTML += `
            <div class="results-section">
                <h4><i class="fas fa-university"></i> Eligible Colleges</h4>
                <div class="results-grid">
        `;

    data.eligibleColleges.slice(0, 6).forEach((college) => {
      const courses = college.courses.map((course) => course.name).join(", ");

      // AI enhancements
      const aiScore = college.aiScore || 0;
      const aiReasoning = college.aiReasoning || [];
      const priority = college.recommendationPriority || "Medium";

      resultsHTML += `
                <div class="result-card ${priority.toLowerCase()}-priority">
                    <div class="card-header">
                        <h5>${college.name}</h5>
                        ${
                          aiScore > 0
                            ? `
                            <div class="ai-score">
                                <span class="score-badge priority-${priority.toLowerCase()}">${aiScore}</span>
                                <small>AI Score</small>
                            </div>
                        `
                            : ""
                        }
                    </div>
                    <p><strong>Location:</strong> ${college.location.city}, ${
        college.location.state
      }</p>
                    <p><strong>Type:</strong> ${college.type}</p>
                    ${
                      college.ranking && college.ranking.nirf
                        ? `<p><strong>NIRF Rank:</strong> ${college.ranking.nirf}</p>`
                        : ""
                    }
                    ${
                      courses
                        ? `<p><strong>Available Courses:</strong> ${courses}</p>`
                        : ""
                    }
                    ${
                      aiReasoning.length > 0
                        ? `
                        <div class="ai-reasoning">
                            <strong>Why this college:</strong>
                            <ul class="reasoning-list">
                                ${aiReasoning
                                  .slice(0, 3)
                                  .map((reason) => `<li>${reason}</li>`)
                                  .join("")}
                            </ul>
                        </div>
                    `
                        : ""
                    }
                    <div class="tags">
                        <span class="tag">${college.type}</span>
                        ${
                          priority !== "Medium"
                            ? `<span class="tag priority-tag">${priority} Priority</span>`
                            : ""
                        }
                        ${college.courses
                          .map(
                            (course) =>
                              `<span class="tag">${
                                course.stream || "General"
                              }</span>`
                          )
                          .join("")}
                    </div>
                </div>
            `;
    });

    resultsHTML += `</div></div>`;
  }

  // Scholarships section
  if (data.eligibleScholarships && data.eligibleScholarships.length > 0) {
    resultsHTML += `
            <div class="results-section">
                <h4><i class="fas fa-hand-holding-usd"></i> Eligible Scholarships</h4>
                <div class="results-grid">
        `;

    data.eligibleScholarships.slice(0, 6).forEach((scholarship) => {
      // AI enhancements
      const aiScore = scholarship.aiScore || 0;
      const aiReasoning = scholarship.aiReasoning || [];
      const priority = scholarship.recommendationPriority || "Medium";

      resultsHTML += `
                <div class="result-card ${priority.toLowerCase()}-priority">
                    <div class="card-header">
                        <h5>${scholarship.name}</h5>
                        ${
                          aiScore > 0
                            ? `
                            <div class="ai-score">
                                <span class="score-badge priority-${priority.toLowerCase()}">${aiScore}</span>
                                <small>AI Score</small>
                            </div>
                        `
                            : ""
                        }
                    </div>
                    <p><strong>Provider:</strong> ${scholarship.provider}</p>
                    <p><strong>Type:</strong> ${scholarship.type}</p>
                    <p><strong>Amount:</strong> ₹${scholarship.amount.value.toLocaleString()} (${
        scholarship.amount.type
      })</p>
                    ${
                      scholarship.eligibilityCriteria.academicPercentage
                        ? `<p><strong>Min. Percentage:</strong> ${scholarship.eligibilityCriteria.academicPercentage.minimum}%</p>`
                        : ""
                    }
                    ${
                      aiReasoning.length > 0
                        ? `
                        <div class="ai-reasoning">
                            <strong>Why this scholarship:</strong>
                            <ul class="reasoning-list">
                                ${aiReasoning
                                  .slice(0, 3)
                                  .map((reason) => `<li>${reason}</li>`)
                                  .join("")}
                            </ul>
                        </div>
                    `
                        : ""
                    }
                    <div class="tags">
                        <span class="tag">${scholarship.provider}</span>
                        <span class="tag">${scholarship.type}</span>
                        ${
                          priority !== "Medium"
                            ? `<span class="tag priority-tag">${priority} Priority</span>`
                            : ""
                        }
                    </div>
                </div>
            `;
    });

    resultsHTML += `</div></div>`;
  }

  // Add "Search Again" button
  resultsHTML += `
        <div class="search-again-section" style="text-align: center; margin-top: 2rem;">
            <button onclick="resetForm()" class="submit-btn" style="width: auto; padding: 0.75rem 2rem;">
                <i class="fas fa-search"></i>
                Search Again
            </button>
        </div>
    `;

  resultsDiv.innerHTML = resultsHTML;
  document.querySelector(".chat-container").appendChild(resultsDiv);

  // Add summary card styles and AI enhancements
  const style = document.createElement("style");
  style.textContent = `
        .summary-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 1rem;
        }
        
        .summary-card {
            background: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            text-align: center;
            border-left: 4px solid #28a745;
        }
        
        .summary-card strong {
            font-size: 1.5rem;
            color: #28a745;
            display: block;
            margin-bottom: 0.25rem;
        }
        
        /* AI Enhanced Card Styles */
        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
        }
        
        .card-header h5 {
            margin: 0;
            flex: 1;
        }
        
        .ai-score {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-left: 1rem;
        }
        
        .score-badge {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            border-radius: 50%;
            color: white;
            font-weight: bold;
            min-width: 2rem;
            text-align: center;
            font-size: 0.9rem;
        }
        
        .priority-high .score-badge, .score-badge.priority-high {
            background: #28a745;
        }
        
        .priority-medium .score-badge, .score-badge.priority-medium {
            background: #ffc107;
            color: #212529;
        }
        
        .priority-low .score-badge, .score-badge.priority-low {
            background: #6c757d;
        }
        
        .ai-score small {
            font-size: 0.7rem;
            margin-top: 0.25rem;
            opacity: 0.7;
        }
        
        .ai-reasoning {
            background: #f8f9fa;
            padding: 0.75rem;
            border-radius: 6px;
            margin: 0.5rem 0;
            border-left: 3px solid #007bff;
        }
        
        .reasoning-list {
            margin: 0.5rem 0 0 0;
            padding-left: 1rem;
            font-size: 0.9rem;
            line-height: 1.4;
        }
        
        .reasoning-list li {
            margin-bottom: 0.25rem;
            color: #666;
        }
        
        .priority-tag {
            background: #007bff !important;
            color: white !important;
        }
        
        .high-priority {
            border-left: 4px solid #28a745;
        }
        
        .medium-priority {
            border-left: 4px solid #ffc107;
        }
        
        .low-priority {
            border-left: 4px solid #6c757d;
        }
        
        .result-card {
            position: relative;
        }
        
        .high-priority::before {
            content: "🎯";
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            font-size: 1.2rem;
        }
        
        .medium-priority::before {
            content: "📋";
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            font-size: 1.2rem;
        }
        
        .low-priority::before {
            content: "📝";
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            font-size: 1.2rem;
        }
    `;
  document.head.appendChild(style);
}

// Reset form function
function resetForm() {
  // Show form again
  studentForm.style.display = "block";

  // Remove results
  const existingResults = document.querySelector(".results");
  if (existingResults) {
    existingResults.remove();
  }

  // Clear form fields (optional)
  // document.getElementById('studentForm').reset();

  // Scroll to form
  studentForm.scrollIntoView({ behavior: "smooth" });
}

// Handle enter key in form inputs
document
  .querySelectorAll("#studentForm input, #studentForm select")
  .forEach((input) => {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submitBtn.click();
      }
    });
  });

// Show AI insights
function showAIInsights(aiInsights) {
  if (!aiInsights) return;

  const insightsDiv = document.createElement("div");
  insightsDiv.className = "ai-insights";

  let insightsHTML = `
    <div class="ai-section">
      <h4>
        <i class="fas fa-robot"></i> 
        ${aiInsights.isAIGenerated ? "AI-Powered Analysis" : "Smart Analysis"}
        ${aiInsights.isAIGenerated ? '<span class="ai-badge">AI</span>' : ""}
      </h4>
      <div class="ai-analysis">
        ${formatAIAnalysis(aiInsights.analysis)}
      </div>
      <div class="ai-timestamp">
        <small><i class="fas fa-clock"></i> Generated: ${new Date(
          aiInsights.timestamp
        ).toLocaleString()}</small>
      </div>
    </div>
  `;

  insightsDiv.innerHTML = insightsHTML;
  document.querySelector(".chat-container").appendChild(insightsDiv);

  // Add AI-specific styles
  if (!document.querySelector("#ai-styles")) {
    const style = document.createElement("style");
    style.id = "ai-styles";
    style.textContent = `
      .ai-insights {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        margin: 1rem 0;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
      }
      
      .ai-section {
        padding: 1.5rem;
        color: white;
      }
      
      .ai-section h4 {
        margin: 0 0 1rem 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.2rem;
      }
      
      .ai-badge {
        background: rgba(255, 255, 255, 0.2);
        padding: 0.2rem 0.5rem;
        border-radius: 12px;
        font-size: 0.7rem;
        font-weight: bold;
      }
      
      .ai-analysis {
        background: rgba(255, 255, 255, 0.1);
        padding: 1rem;
        border-radius: 8px;
        line-height: 1.6;
        white-space: pre-wrap;
        max-height: 300px;
        overflow-y: auto;
      }
      
      .ai-timestamp {
        margin-top: 1rem;
        opacity: 0.8;
      }
      
      .action-plan, .success-tips {
        margin: 1rem 0;
        background: #f8f9fa;
        border-radius: 8px;
        overflow: hidden;
        border-left: 4px solid #28a745;
      }
      
      .plan-section, .tips-section {
        padding: 1.5rem;
      }
      
      .plan-section h4, .tips-section h4 {
        margin: 0 0 1rem 0;
        color: #28a745;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .plan-list, .tips-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      
      .plan-list li, .tips-list li {
        padding: 0.5rem 0;
        border-bottom: 1px solid #e9ecef;
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
      }
      
      .plan-list li:last-child, .tips-list li:last-child {
        border-bottom: none;
      }
      
      .plan-list li::before {
        content: "📋";
        flex-shrink: 0;
      }
      
      .tips-list li::before {
        content: "💡";
        flex-shrink: 0;
      }
    `;
    document.head.appendChild(style);
  }
}

// Format AI analysis text
function formatAIAnalysis(analysis) {
  if (!analysis) return "";

  // Format the analysis text with better structure
  return analysis
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n\n/g, "\n")
    .replace(/(\d+\.\s)/g, "\n$1");
}

// Show action plan
function showActionPlan(actionPlan) {
  if (!actionPlan || !Array.isArray(actionPlan) || actionPlan.length === 0)
    return;

  const planDiv = document.createElement("div");
  planDiv.className = "action-plan";

  let planHTML = `
    <div class="plan-section">
      <h4><i class="fas fa-tasks"></i> Recommended Action Plan</h4>
      <ul class="plan-list">
        ${actionPlan
          .map((item) => `<li>${item.replace(/^\d+\.\s*/, "")}</li>`)
          .join("")}
      </ul>
    </div>
  `;

  planDiv.innerHTML = planHTML;
  document.querySelector(".chat-container").appendChild(planDiv);
}

// Show success tips
function showSuccessTips(successTips) {
  if (!successTips || !Array.isArray(successTips) || successTips.length === 0)
    return;

  const tipsDiv = document.createElement("div");
  tipsDiv.className = "success-tips";

  let tipsHTML = `
    <div class="tips-section">
      <h4><i class="fas fa-lightbulb"></i> Success Tips</h4>
      <ul class="tips-list">
        ${successTips.map((tip) => `<li>${tip}</li>`).join("")}
      </ul>
    </div>
  `;

  tipsDiv.innerHTML = tipsHTML;
  document.querySelector(".chat-container").appendChild(tipsDiv);
}
