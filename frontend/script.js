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

      // Show detailed results
      showDetailedResults(data.data);
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
      resultsHTML += `
                <div class="result-card">
                    <h5>${college.name}</h5>
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
                    <div class="tags">
                        <span class="tag">${college.type}</span>
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
      resultsHTML += `
                <div class="result-card">
                    <h5>${scholarship.name}</h5>
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
                    <div class="tags">
                        <span class="tag">${scholarship.provider}</span>
                        <span class="tag">${scholarship.type}</span>
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

  // Add summary card styles
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
