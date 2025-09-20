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
# Architecture

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

  ---

## 🛠️ Setup & Installation

### Prerequisites
- **Node.js** v18+  
- **npm** or **yarn**  
- **Supabase** project with the hackathon dataset loaded (or access to a Postgres instance)  
- **n8n** instance (local or cloud) with an accessible webhook URL  
- **Gemini / Google AI Studio** API credentials (API key)  
- (Optional) **Vercel** account for deployment



### 1. Clone the repo
```bash
git clone <REPO_URL>
cd accuquery-ai
```



### 2. Install dependencies
```bash
npm install
# or
# yarn
```



### 3. Environment variables
Create a `.env` file in the repo root with the following variables (replace placeholders):

```env
VITE_SUPABASE_URL=https://<your-supabase-project>.supabase.co
VITE_SUPABASE_KEY=<your-supabase-key>
GEMINI_API_KEY=<your-gemini-api-key>
N8N_WEBHOOK_URL=<your-n8n-webhook-url>
```

**Notes:**
- Use a Supabase **service role** key for server-side workflows during testing (keep it private).  
- If your Supabase requires SSL, ensure your DB client (n8n or Postgres node) is configured to use SSL.



### 4. Run the frontend (development)
```bash
npm run dev
# Default Vite URL: http://localhost:5173
```



### 5. (Optional) Build & deploy to Vercel
```bash
npm run build
# then follow Vercel CLI or dashboard steps:
vercel deploy
```



### 6. Load the dataset into Supabase (quick guide)
1. Export Excel sheets to CSV (one CSV per table).  
2. In Supabase dashboard → Table Editor → Import CSV → select the target table (or create table schema first).  
3. Verify column types (timestamps, integers, text) and import each CSV.  
4. Optionally run any schema adjustments / indexes via SQL editor in Supabase.



### 7. Configure n8n workflow
- Create a webhook node in your n8n instance and copy its URL.  
- Set `N8N_WEBHOOK_URL` in `.env` to that webhook (or configure frontend to call the webhook endpoint).  
- Ensure n8n has access to Supabase credentials (via secure environment variables in n8n) so it can execute queries.



### 8. Configure Gemini (LLM)
- Obtain API key from Google AI Studio (Gemini).  
- In the node that calls Gemini (n8n or backend), use `GEMINI_API_KEY` and follow the provider's recommended request format.  
- Ensure the model output is instructed to return JSON with keys like `sql`, `chart_type`, `x_axis`, `y_axis`.



### 9. Troubleshooting & Tips
- **CORS:** If the frontend cannot call the webhook, ensure CORS is allowed on the server or call via backend/n8n proxy.  
- **SQL safety:** During demo/hackathon use, LLM-generated SQL is acceptable. For production, sanitize or whitelist tables/columns.  
- **Supabase connection issues:** Verify project URL and key, and that network/firewall rules allow access from your environment.  
- **n8n webhook unreachable:** Confirm n8n is running and public (use ngrok for local testing if needed).



### 10. Run the demo flow (quick test)
1. Start frontend: `npm run dev`  
2. Ensure Supabase has the dataset and n8n webhook is active.  
3. Use the UI to submit a test query (e.g., “Show pending education checks by company”).  
4. Verify the workflow:
   - Query reached n8n webhook
   - Gemini returned JSON with `sql` + `chart_type`
   - n8n executed SQL on Supabase and returned rows
   - Frontend rendered the visualization

---


## 👥 Team Contributions
- **Chetan** – Supabase integration  
- **Pranav** – Workflow automation with n8n  
- **Priyanshu** – Knowledge base creation & integration  
- **Tanish** – Frontend & Canvas UI design  
- **Santosh** – Data modeling & report generation  
- **Piyush** – Project management & presentation design

## 🙌 Closing Note
AccuQuery AI is not just a chatbot — it is a **workspace for decisions**, transforming background screening into a smarter, faster, and more human process.  
Built with ❤️ during the Accurate Background Hackathon.
