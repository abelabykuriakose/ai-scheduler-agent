#  AI Task Scheduler Agent

An intelligent, full-stack task management application that uses the **Google Gemini API** to analyze unstructured conversational user inputs and automatically categorize tasks into a visual **Eisenhower Matrix** (Urgent vs. Important grid) using strict structured JSON schemas.

---

## Features

* **Natural Language Processing:** Tell the agent your tasks naturally (e.g., *"I need to study for finals, it's really important but it's not due for two weeks"*).
* **Structured AI Routing:** Built with Express and the `@google/genai` SDK to dynamically enforce valid JSON extractions.
* **Contextual Clarification:** If you forget to mention the urgency or importance metrics, the AI agent will gracefully ask you follow-up questions to clarify before saving.
* **Real-time Dashboard Grid:** React-based frontend built on Vite that segments your tasks seamlessly across four clear-cut operational quadrants.

---

## Tech Stack

* **Frontend:** React, Vite, JavaScript (ES6+), CSS Grid.
* **Backend:** Node.js, Express, CORS middleware.
* **AI Engine:** Google Gemini (`gemini-1.5-flash`), Structured Schemas.

---

## Installation & Setup

Follow these quick steps to spin up the environment locally on your machine.

### 1. Clone the Repository
```bash
git clone [https://github.com/YOUR_GITHUB_USERNAME/ai-scheduler-agent.git](https://github.com/YOUR_GITHUB_USERNAME/ai-scheduler-agent.git)
cd ai-scheduler-agent
