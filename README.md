🚀 AccuQuery AIConversational Intelligence for Background Screening Smarter. Faster. More Human.AccuQuery AI is a role-aware conversational assistant for background screening that transforms natural-language queries into instant SQL-driven insights and visualizations (tailored to recruiters, HR managers, and compliance officers). Built with React + Vite + TypeScript, Supabase, n8n, and Gemini, it delivers rapid, actionable reporting inside an interactive Canvas workspace.📖 Project OverviewRecruiters, HR managers, and compliance officers often drown in dashboards, filters, and predefined reports when using background check platforms. The information is there — but finding it is slow, frustrating, and risky for compliance.AccuQuery AI solves this by turning background screening into a conversational, role-aware experience. Instead of navigating menus, users ask a question in natural language and receive the right answer in the right format:Recruiters → candidate-level detailsHR managers → aggregated insights & visualizationsCompliance officers → risk-focused reportsAccuQuery AI creates a workspace experience (like a canvas/jam board) where queries become interactive cards that can be pinned, drilled into, or exported.🏛️ ArchitectureHere is a high-level overview of the application's architecture:    User (Recruiter / HR / Compliance)
                   │
                   ▼
       🌐 Frontend (React + Vite + TypeScript, deployed on Vercel)  
                   │  
                   ▼  
       🔗 Webhook → n8n Workflow Orchestrator  
                   │  
         ┌─────────┴─────────┐  
         │                   │  
    🤖 Gemini LLM        📂 Supabase (Postgres)  
(NLP → SQL + Chart)     (Hackathon Dataset)  
         │   (returns SQL)   │  
         └───────▶ Query Execution  
                         │   
                         ▼  
       📊 Visualization + Summaries + Reports  
                         │  
                         ▼  
            🖼️ Canvas Workspace (UI)  
⚙️ Tech StackFrontend: React + Vite + TypeScriptDeployment: VercelDatabase: Supabase (Postgres)Automation / Orchestration: n8n workflowsAI: Gemini (NLP → SQL + visualization classification)Repo language breakdown: TypeScript 92.5%, MDX 3.3%, JavaScript 2.6%, CSS 1.3%, HTML 0.3%🔑 FeaturesRole-based outputs – recruiter, HR, compliance views adapt automaticallyNatural language → SQL via GeminiVisualizations – bar/line/pie/table outputs chosen by model & rendered in CanvasWorkflow automation – n8n handles query execution, email/report exportsCanvas workspace – interactive cards for each query (summary, chart, table, export)📊 Dataset UsageWe use the provided hackathon dataset as-is and host it in Supabase. The dataset includes candidate-level checks (EDU, CRIM, EMP), adjudication states, timestamps for TAT, disputes, and related metadata — enabling queries like:“Show pending education checks by company”“Average turnaround time for CRIM checks last week”“Dispute rate by search type”🖥️ How It Works (High Level)User enters a natural-language query in the chat UI (role selected or detected).The frontend calls an n8n webhook with the query.n8n forwards the query to Gemini for:SQL generation (targeting Supabase schema)Visualization suggestion (chart_type, x_axis, y_axis)n8n executes the SQL on Supabase (Postgres) and returns rows.A Code node in n8n shapes the rows into chart-ready JSON (labels, values, chart_type).Frontend Canvas receives the JSON and:Renders chart/table/summaryProvides context menu (Export PDF, Email via n8n, Drill-down, Pin to Dashboard)🚀 Getting StartedPrerequisitesNode.js v18+npm or yarnA Supabase project with the hackathon dataset loaded.An n8n instance (local or cloud) and an accessible webhook URL.Gemini API credentials (from Google AI Studio).Installation & SetupClone the repository:git clone <REPO_URL>
cd accuquery-ai
Install dependencies:npm install
Create an environment file:Create a .env file in the root of the project and add the following variables:VITE_SUPABASE_URL=https://<your-supabase-project>.supabase.co
VITE_SUPABASE_KEY=<your-supabase-key>
GEMINI_API_KEY=<your-gemini-api-key>
N8N_WEBHOOK_URL=<your-n8n-webhook-url>
Run the development server:npm run dev
👥 Team ContributionsChetan – Supabase integrationPranav – Workflow automation with n8nPriyanshu – Knowledge base creation & integrationTanish – Frontend & Canvas UI designSantosh – Data modeling & report generationPiyush – Project management & presentation design🙌 Closing NoteAccuQuery AI is not just a chatbot — it is a workspace for decisions, transforming background screening into a smarter, faster, and more human process.Built with ❤️ during the Accurate Background Hackathon.
