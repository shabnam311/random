# ClassVault Architecture Diagram & Description

```mermaid
graph TD
    Client[React SPA Vite] --> Auth[Supabase Auth]
    Client --> DB[Supabase Postgres]
    Client --> Storage[Supabase Storage]
    
    subgraph Frontend
        Router[React Router]
        AuthForm[Authentication UI]
        StudentView[Student Workspace]
        TeacherView[Teacher Ledger Overview]
        
        Router --> AuthForm
        Router --> StudentView
        Router --> TeacherView
    end
    
    subgraph Supabase BaaS
        Auth --> Users(users)
        DB --> Classes(classes)
        DB --> Projects(projects)
        DB --> Groups(groups)
        DB --> Files(files)
        DB --> Activity(activity_log)
        
        Storage --> Buckets(Project Files)
    end
```

## Description
- **Frontend**: A React SPA built with Vite. UI state is managed mostly within components using React hooks. Routing is handled by `react-router-dom`.
- **Backend (BaaS)**: Supabase acts as the sole backend, utilizing PostgreSQL for relational data mapping (classes, groups, users) and Supabase Storage for project files.
- **Security**: Authentication is handled directly via Supabase Auth. Authorization is enforced via Row Level Security (RLS) on the Postgres tables (ensuring students can only access their group's files).
