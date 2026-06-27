## # Project Constitution 

> Version: 1.0.0 

- Status: Active 

- Project: SPEEDHOME Rental Price Dashboard 

--- 

## # Purpose 

This document defines the project-specific engineering rules, business context, implementation boundaries, and technical constraints for the SPEEDHOME Rental Price Dashboard. 

Unlike the Engineering Constitution, this document is specific to this project and should be treated as the primary source of project context. 

--- 

## # Project Overview 

The SPEEDHOME Rental Price Dashboard is a production-ready web application that automatically collects publicly available rental property data from SPEEDHOME Malaysia. 

The application transforms raw listing information into structured market insights through statistical analysis and an interactive dashboard. 

--- 

## # Project Objectives 

The application shall: 

- Collect publicly available rental listings. 

- Normalize extracted data. 

- Store data inside Supabase. 

- Calculate pricing statistics. 

- Display searchable dashboards. 

- Export data as Excel and CSV. 

- Support desktop and mobile devices. 

--- 

## # Project Scope 

Included: 

- URL Search 

- Area Search 

- Autocomplete 

- Web Scraping 

- Data Parsing 

- Data Validation 

- Statistics 

- Dashboard 

- Export 

- Responsive UI 

Everything else requires approval. 

--- 

## # Business Context 

Users should be able to estimate rental prices without manually comparing dozens of listings. 

The dashboard transforms scattered public information into actionable pricing insights. 

--- 

## # Target Users 

Primary users: 

- Property seekers 

- Property investors 

- Market researchers 

- Internal business teams 

The interface should remain intuitive for non-technical users. 

--- 

## # Success Criteria 

The project succeeds when: 

- Data collection is reliable. - Statistics are accurate. - Dashboard is responsive. - Export works correctly. 

- Users can verify every listing. 

--- 

## # Technology Stack 

Frontend 

- Next.js 

- TypeScript 

- Tailwind CSS 

- shadcn/ui 

Backend 

- Next.js Route Handlers 

Database 

- Supabase 

Scraping 

- Playwright 

- Cheerio 

Charts 

- Recharts 

Export 

- xlsx 

- PapaParse 

--- 

# Project Architecture 

Presentation 

↓ 

Application 

↓ 

Scraping 

↓ 

## Transformation 

## ↓ 

## Analytics 

## ↓ 

## Persistence 

## ↓ 

Supabase 

--- 

## # Scraping Strategy 

## Always: 

- Respect robots.txt 

- Access only public pages 

- Introduce reasonable request delays 

- Retry responsibly 

- Stop when blocking responses occur 

## Never: 

- Scrape restricted pages 

- Bypass authentication 

- Generate fabricated data 

--- 

## # Data Collection Rules 

## Collect whenever available: 

- Listing Title 

- Property Name 

- Area 

- Monthly Price 

- Annual Price 

- Bedrooms 

- Furniture Status 

- Property Size 

- Property Type 

## - Listing URL 

Missing information must be reported as **Not Available**. 

--- 

## # Data Validation Rules 

## Validate: 

- Numeric prices 

- Numeric property size 

- Valid URLs 

- Bedroom formats 

- Furniture categories 

Normalize inconsistent values before storage. 

--- 

## # Database Standards 

Supabase is the source of persistence. 

Avoid duplicate listings. 

Store timestamps. 

Support future scalability. 

--- 

## # Analytics Rules 

Calculate: 

- Listing Count 

- Average Price 

- Median Price 

- Mode Price 

- Fair Price 

- Average Size 

Group by property type whenever possible. 

--- 

# Business Rules 

Business rules override technical preferences. 

Every displayed listing must be verifiable. 

Annual rental should equal: 

Monthly Price × 12 

Unavailable values must never appear blank. 

--- 

## # UI/UX Standards 

Prioritize: 

- Simplicity 

- Readability 

- Transparency 

- Data clarity 

Always provide: 

- Loading indicators 

- Progress feedback 

- Empty states 

- Friendly errors 

- Success confirmation 

--- 

# Responsive Standards 

Support: 

- Desktop 

- Tablet 

- Mobile 

Large tables should scroll horizontally. 

No content should overlap. 

--- 

# Performance Requirements 

Optimize: 

- Data fetching 

- Rendering 

- Statistical calculations 

Avoid unnecessary processing. 

--- 

# Security Requirements 

Validate user input. 

Protect secrets. 

Use environment variables. 

Respect robots.txt. 

--- 

# Deployment Requirements 

Deploy successfully to: 

- Vercel 

Database: 

- Supabase 

No build errors. 

No TypeScript errors. 

No lint errors. 

--- 

# Project Constraints 

Never: 

- Scrape private content 

- Invent listing data 

- Modify requirements 

- Exceed approved scope 

Explain technical limitations instead of hiding them. 

--- 

# Out of Scope 

Excluded: 

- Authentication 

- Payments 

- Booking 

- Admin Dashboard 

- AI Prediction 

- Recommendation Engine 

- Notifications 

- Real-time Sync 

--- 

# Project Deliverables 

The final solution includes: 

- Production-ready application 

- Responsive dashboard 

- Automated scraping 

- Statistical analysis 

- Search functionality 

- Export capability 

- Database integration 

- Deployment configuration 

- Documentation 

--- 

# Acceptance Criteria 

A feature is complete only when: 

- Business requirements are satisfied. 

- Acceptance criteria are met. 

- Tests pass. 

- Documentation is updated. 

- Code follows engineering standards. 

--- 

## # Known Risks & Mitigation 

Potential risks include: 

- HTML structure changes. 

- Scraping rate limits. 

- Incomplete source data. 

- Duplicate listings. 

- Robots.txt updates. 

The application should fail gracefully and report issues transparently. 

--- 

## # Future Scalability 

The architecture should support future expansion, including: 

- Additional property listing providers. 

- Scheduled scraping. 

- Multi-source aggregation. 

- Enhanced analytics. 

- Additional dashboard modules. 

