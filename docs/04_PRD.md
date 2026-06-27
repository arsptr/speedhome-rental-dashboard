## **Product Requirements Document (PRD)** 

Version: 1.0.0 Status: Active Project: SPEEDHOME Rental Price Dashboard 

## **Executive Summary** 

The SPEEDHOME Rental Price Dashboard is a web application that automatically collects publicly available rental property listings from SPEEDHOME Malaysia and transforms them into an easy-to-understand pricing dashboard. 

Users can search a property area or paste a SPEEDHOME URL. The application will scrape available listings, calculate summary statistics, display detailed property information, and allow users to export the results. 

This project is developed as an MVP to satisfy the technical assessment requirements while maintaining clean architecture and production-ready engineering practices. 

## **Problem Statement** 

Rental price comparison currently requires users to manually browse multiple property listings and estimate market prices themselves. 

This process is time-consuming and makes it difficult to identify reasonable rental prices within a specific area. 

The application solves this problem by automatically collecting publicly available listing data and presenting summarized pricing insights. 

## **Project Objectives** 

The application shall: 

- Allow users to search rental properties by SPEEDHOME URL or property/area name. 

- Automatically collect publicly available property listings. 

- Display summary pricing statistics. 

- Display complete listing information. 

- Export collected data into Excel or CSV. 

- Support desktop and mobile devices. 

1 

- Be deployable to Vercel. 

- Use Supabase as the database. 

## **Project Scope** 

## **In Scope** 

- Search by URL 

- Search by property/area name 

- Autocomplete suggestions 

- Public page scraping 

- Data validation 

- Price summary dashboard 

- Property listing table 

- CSV export 

- Excel export 

- Responsive interface 

- Supabase integration 

- Vercel deployment 

## **Out of Scope** 

- Authentication 

- User management 

- Property booking 

- Payment 

- Admin panel 

- AI price prediction 

- Notifications 

- Scheduled scraping 

- Multi-source scraping 

## **Target Users** 

Primary users include: 

- Property seekers 

- Property investors 

- Market researchers 

Users are assumed to have little or no technical knowledge. 

2 

## **Functional Requirements** 

|ID|Requirement|Priority|
|---|---|---|
|FR-001|User can paste a SPEEDHOME URL.|High|
|FR-002|User can search property or area names.|High|
|FR-003|Display autocomplete suggestions while typing.|High|
|FR-004|Scrape publicly available SPEEDHOME listings.|High|
|FR-005|Store scraped data in Supabase.|High|
|FR-006|Display price summary statistics.|High|
|FR-007|Display detailed property listing table.|High|
|FR-008|Display monthly rental price.|High|
|FR-009|Display yearly rental price.|High|
|FR-010|Display property size (sqft).|High|
|FR-011|Display furniture status.|High|
|FR-012|Display direct SPEEDHOME listing link.|High|
|FR-013|Export results as CSV.|Medium|
|FR-014|Export results as Excel (.xlsx).|Medium|
|FR-015|Display unavailable rental types as "Not Available".|High|
|FR-016|Support responsive layout for mobile devices.|High|



## **Non-Functional Requirements** 

## **Performance** 

- Dashboard should remain responsive while loading. • Scraping requests should include reasonable delays. • Avoid duplicate scraping requests. 

## **Reliability** 

- Invalid data should not break the application. • Failed scraping should display meaningful error messages. 

3 

## **Security** 

- Only scrape publicly accessible pages. 

- Respect robots.txt. 

- Store secrets using environment variables. 

## **Maintainability** 

- Follow the Engineering Constitution and Engineering Playbook. • Keep business logic separated from UI. 

## **User Flow** 

1. User opens the application. 

2. User enters a SPEEDHOME URL or property name. 

3. Application displays autocomplete suggestions (if applicable). 

4. User starts the search. 

5. Application scrapes publicly available listings. 

6. Data is validated and stored in Supabase. 

7. Dashboard displays summary statistics. 

8. Dashboard displays detailed property listings. 

9. User exports the results if needed. 

## **Acceptance Criteria** 

The MVP is considered complete when: 

- User can search by URL. 

- User can search by property name. 

- Autocomplete works. 

- Public data is successfully scraped. 

- Summary statistics are displayed. 

- Listing table is displayed. 

- Export to CSV works. 

- Export to Excel works. 

- Mobile layout works. 

- Application successfully deploys to Vercel. 

- Supabase integration works. 

- No TypeScript errors. 

- No production build errors. 

4 

## **Success Metrics** 

The MVP is considered successful if: 

- All mandatory technical assessment requirements are implemented. 

- Scraped data is accurate and verifiable. 

- Users can understand pricing information without reading raw listings. 

- The application can be demonstrated end-to-end during the technical interview. 

## **Assumptions** 

- SPEEDHOME public pages remain accessible. 

- Required information exists on public listing pages. 

- robots.txt continues allowing the required scraping path. 

- Internet connection is available during scraping. 

## **Dependencies** 

External dependencies include: 

- SPEEDHOME public website 

- Supabase 

- Vercel 

- Playwright 

- Cheerio 

## **References** 

- Project Overview 

- Engineering Constitution 

- Project Constitution 

- Engineering Playbook 

5 

