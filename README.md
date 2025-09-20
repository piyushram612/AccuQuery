# 🚀 AccuQuery AI
*Conversational Intelligence for Background Screening*  
*Smarter. Faster. More Human.*
AccuQuery AI is a role-aware conversational assistant for background screening that transforms natural-language queries into instant SQL-driven insights and visualizations (tailored to recruiters, HR managers, and compliance officers). Built with React + Vite + TypeScript, Supabase, n8n, and Gemini, it delivers rapid, actionable reporting inside an interactive Canvas workspace.


---

## 📖 Project Overview
Recruiters, HR managers, and compliance officers often drown in dashboards, filters, and predefined reports when using background check platforms. The information is there — but finding it is slow, frustrating, and risky for compliance.

**AccuQuery AI** solves this by turning background screening into a conversational, role-aware experience. Instead of navigating menus, users ask a question in natural language and receive the right answer in the right format:
- Recruiters → candidate-level details  
- HR managers → aggregated insights & visualizations  
- Compliance officers → risk-focused reports  

AccuQuery AI creates a **workspace experience** (like a canvas/jam board) where queries become interactive cards that can be pinned, drilled into, or exported.
# Architecture (text diagram)

   User (Recruiter / HR / Compliance)
                   │
                   ▼
            🌐 Frontend (React + Vite + TypeScript, deployed on Vercel)  
                   │  
                   ▼  
      🔗 Webhook → n8n Workflow Orchestrator  
                   │  
          ┌────────┴─────────┐  
          │                  │  
   🤖 Gemini LLM       📂 Supabase (Postgres)  
 (NLP → SQL + Chart)      (Hackathon Dataset)  
          │   (returns SQL)   │  
          └──────▶ Query Execution  
                   │   
                   ▼  
     📊 Visualization + Summaries + Reports  
                   │  
                   ▼  
          🖼️ Canvas Workspace (UI)  
## ⚙️ Tech Stack
- **Frontend**: React + Vite + TypeScript  
- **Deployment**: Vercel  
- **Database**: Supabase (Postgres)  
- **Automation / Orchestration**: n8n workflows  
- **AI**: Gemini (NLP → SQL + visualization classification)  
- **Repo language breakdown**: TypeScript 92.5%, MDX 3.3%, JavaScript 2.6%, CSS 1.3%, HTML 0.3%

## 🔑 Features
- **Role-based outputs** – recruiter, HR, compliance views adapt automatically  
- **Natural language → SQL** via Gemini  
- **Visualizations** – bar/line/pie/table outputs chosen by model & rendered in Canvas  
- **Workflow automation** – n8n handles query execution, email/report exports  
- **Canvas workspace** – interactive cards for each query (summary, chart, table, export)

## 📊 Dataset Usage
We use the provided hackathon dataset **as-is** and host it in Supabase. The dataset includes candidate-level checks (EDU, CRIM, EMP), adjudication states, timestamps for TAT, disputes, and related metadata — enabling queries like:
- “Show pending education checks by company”
- “Average turnaround time for CRIM checks last week”
- “Dispute rate by search type”
## 🖥️ How It Works (high level)
1. User enters a natural-language query in the chat UI (role selected or detected).  
2. The frontend calls an n8n webhook with the query.  
3. n8n forwards the query to Gemini for:
   - SQL generation (targeting Supabase schema)
   - Visualization suggestion (`chart_type`, `x_axis`, `y_axis`)
4. n8n executes the SQL on Supabase (Postgres) and returns rows.  
5. A Code node in n8n shapes the rows into chart-ready JSON (labels, values, chart_type).  
6. Frontend Canvas receives the JSON and:
   - Renders chart/table/summary
   - Provides context menu (Export PDF, Email via n8n, Drill-down, Pin to Dashboard)

### Prerequisites
- Node.js v18+  
- npm or yarn  
- Supabase project with the hackathon dataset loaded  
- n8n instance (local or cloud) and an accessible webhook URL  
- Gemini API credentials (Google AI Studio)
# Clone & run (commands)
git clone <REPO_URL>
cd accuquery-ai

# install
npm install

# run dev frontend (Vite)
npm run dev
# Example .env (create in repo root)
VITE_SUPABASE_URL=https://<your-supabase-project>.supabase.co
VITE_SUPABASE_KEY=<your-supabase-key>
GEMINI_API_KEY=<your-gemini-api-key>
N8N_WEBHOOK_URL=<your-n8n-webhook-url>
## 👥 Team Contributions
- **Chetan** – Supabase integration  
- **Pranav** – Workflow automation with n8n  
- **Priyanshu** – Knowledge base creation & integration  
- **Tanish** – Frontend & Canvas UI design  
- **Santosh** – Data modeling & report generation  
- **Piyush** – Project management & presentation design

## 🙌 Closing Note
AccuQuery AI is not just a chatbot — it is a **workspace for decisions**, transforming background screening into a smarter, faster, and more human process.   Built with ❤️ during the Accurate Background Hackathon.
