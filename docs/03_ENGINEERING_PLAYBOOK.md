## # Engineering Playbook 

> Version: 1.0.0 

> Project: SPEEDHOME Rental Price Dashboard 

> Owner: Project Manager 

> Audience: AI Engineer (Cursor), Future Contributors 

--- 

## # 1. Purpose 

This document defines the engineering standards, development workflow, and implementation guidelines for the SPEEDHOME Rental Price Dashboard project. 

Its purpose is to ensure that every implementation follows a consistent architecture, coding standard, and engineering practice throughout the project lifecycle. 

This document complements the System Prompt and Product Requirements Document (PRD). 

--- 

## # 2. Engineering Philosophy 

The project follows several core engineering principles. 

- Business requirements always come first. 

- Simplicity is preferred over unnecessary complexity. 

- Maintainability is more valuable than quick implementation. 

- Readability is prioritized over clever code. 

- Every implementation should be scalable. 

- Components should be reusable whenever possible. 

- Every feature should be testable. 

- Long-term software quality takes priority over short-term delivery speed. 

--- 

## # 3. Technology Stack 

## ## Frontend 

- Next.js 

- React 

- TypeScript 

- Tailwind CSS 

- shadcn/ui 

## ## Backend 

- Next.js Route Handlers 

## ## Database 

- Supabase 

## ## Scraping 

- Playwright 

- Cheerio 

## ## Charts 

- Recharts 

## ## Data Export 

- xlsx 

- PapaParse 

## ## Development Tools 

- ESLint 

- Prettier 

- Git 

- Vercel 

--- 

## # 4. High-Level Architecture 

The application follows a layered architecture. 

## Presentation Layer 

↓ 

Application Layer 

↓ 

Scraping Layer 

## ↓ 

Transformation Layer 

## ↓ 

## Analytics Layer 

## ↓ 

Persistence Layer 

## ↓ 

## Supabase 

Each layer should have clear responsibilities with minimal coupling. 

--- 

## # 5. Project Folder Structure 

(To be defined during project initialization.) 

Example: 

app/ components/ features/ services/ lib/ hooks/ types/ utils/ styles/ public/ 

--- 

# 6. Naming Conventions 

## Components 

PascalCase 

Example 

PropertyCard.tsx 

--- 

## Hooks 

camelCase 

Example 

useScraper.ts 

--- 

## Utility Functions 

camelCase 

Example 

calculateMedian.ts 

--- 

## Constants 

UPPER_SNAKE_CASE 

Example 

DEFAULT_PAGE_SIZE 

--- 

## Types 

PascalCase 

Example 

PropertyListing 

--- 

## Database Tables 

snake_case 

Example 

property_listings 

--- 

## # 7. Code Organization 

Each feature should be organized by responsibility. 

Avoid mixing: 

- UI 

- Business Logic 

- API 

- Database 

- Utilities 

within the same file. 

Keep files focused on a single responsibility. 

--- 

## # 8. Component Design Principles 

Components should be: 

- Small 

- Reusable 

- Predictable 

- Easy to test 

Separate: 

Container Components 

Presentation Components 

Reusable UI Components 

Avoid oversized components. 

--- 

## # 9. State Management Strategy 

Use local component state whenever possible. 

Only introduce global state when multiple unrelated components require shared data. 

Avoid unnecessary global state management. 

--- 

## # 10. API Design Standards 

API routes should: 

- Have clear responsibilities. 

- Return consistent response structures. 

- Validate all incoming requests. 

- Handle errors gracefully. 

Never expose internal implementation details. 

--- 

## # 11. Database Standards 

Supabase is the primary database. 

Database tables should: 

- Avoid duplication. 

- Support future scalability. 

- Store timestamps. 

- Use appropriate indexes when needed. 

--- 

## # 12. Error Handling Strategy 

Every error should be: 

- Logged 

- Explained 

- Recoverable whenever possible 

Never fail silently. 

Always provide meaningful feedback. 

--- 

## # 13. Logging Strategy 

Log: 

- Scraping progress 

- Validation failures 

- Database operations 

- Unexpected errors 

Avoid logging sensitive information. 

--- 

## # 14. Environment Variables 

All secrets must be stored inside: 

## .env.local 

Never hardcode: 

- API Keys 

- Database URLs 

- Tokens 

--- 

## # 15. Dependency Management 

Only install packages that provide clear value. 

Avoid duplicate libraries. 

Keep dependencies updated. 

Remove unused packages. 

--- 

## # 16. Git Workflow 

Feature-based development. 

One feature per branch. 

Never commit directly to main. 

--- 

# 17. Branch Naming Convention 

feature/ 

bugfix/ 

refactor/ 

docs/ 

Example 

feature/property-search 

--- 

# 18. Commit Convention 

Use Conventional Commits. 

Examples: 

feat: 

fix: 

refactor: 

docs: 

style: 

test: 

--- 

# 19. Pull Request Checklist 

Before merging: 

- Requirements completed 

- Code reviewed 

- TypeScript passes 

- Lint passes 

- Tests pass 

- Documentation updated 

--- 

# 20. Development Workflow 

Requirement 

↓ 

Planning 

## ↓ 

Architecture Review 

## ↓ 

Implementation 

## ↓ 

Self Review 

## ↓ 

Testing 

↓ 

Documentation 

↓ 

Done 

--- 

## # 21. Testing Workflow 

Each feature should be verified against: 

- Functional requirements 

- Edge cases 

- Error handling 

- Responsive behavior 

--- 

- # 22. Performance Guidelines 

Prioritize: 

- Fast rendering 

- Efficient data fetching 

- Optimized calculations 

- Minimal bundle size 

--- 

## # 23. Security Guidelines 

Validate all user input. 

Never expose secrets. 

Respect robots.txt. 

Never scrape restricted pages. 

--- 

## # 24. Definition of Ready 

A task is ready when: 

- Requirements are approved. 

- Scope is clear. 

- Acceptance Criteria exist. 

- Dependencies are identified. 

--- 

## # 25. Definition of Done 

A task is complete when: 

- Requirements satisfied 

- Code reviewed 

- Tests passed 

- Documentation updated 

- Ready for deployment 

--- 

## # 26. Project Directory Reference 

This document should be read together with: 

- System Prompt 

- PRD 

- Architecture Document 

- Roadmap 

- QA Plan 

# - Runtime Instructions 

