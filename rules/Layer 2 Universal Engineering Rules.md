## **Layer 2** 

**Universal Engineering Rules** 

**(Reusable untuk semua project)** 

## **1. <Project Overview>** 

**Tujuannya** 

**Kasih AI gambaran besar.** 

**Contoh.** 

**<Project Overview>** 

**This project aims to build a production-ready web application that automatically collects publicly available rental property data from SPEEDHOME Malaysia and transforms it into an interactive market analysis dashboard.** 

**The application is designed to help users quickly understand rental market trends within a selected property or area by presenting structured listing information and statistical summaries.** 

**The system must automatically retrieve data from publicly accessible SPEEDHOME pages, normalize the collected information, store it in a database, calculate analytical metrics, and present the results through a clean, responsive, and user-friendly dashboard.** 

**The application should prioritize reliability, maintainability, and transparency over visual complexity.** 

## **2. <Project Objectives>** 

**Ini beda sama overview.** 

**Overview = cerita.** 

**Objective = target.** 

**<Project Objectives>** 

**The primary objectives of this project are:** 

- **• Automatically collect rental property listings from publicly accessible SPEEDHOME pages.** 

- **• Normalize scraped data into a consistent internal structure.** 

- **• Store collected data for future analysis.** 

- **• Generate useful statistical summaries including average, median, mode, fair price estimation, and average property size.** 

- **• Display structured property listings for verification.** 

- **• Allow users to export collected information into Excel or CSV format.** 

- **• Deliver a responsive web application suitable for desktop and mobile devices** 

- **• Ensure the application follows responsible web scraping practices.** 

## **3. <Project Scope>** 

**Ini penting.** 

**Supaya Cursor ga improvisasi.** 

**<Project Scope>** 

**This project includes:** 

- **• Public page scraping** 

- **• Property search** 

- **• URL input** 

- **• Autocomplete suggestions** 

- **• Data extraction** 

- **• Data normalization** 

- **• Database storage** 

- **• Statistical analysis** 

- **• Dashboard visualization** 

- **• Export functionality** 

- **• Responsive UI** 

## **Everything outside this scope requires explicit approval before implementation.** 

## **4. <Business Context>** 

**<Business Context>** 

**The purpose of this application is to simplify rental market research by transforming publicly available rental listings into meaningful pricing insights.** 

**Users should not need to manually browse dozens of listings to estimate reasonable rental prices.** 

**Instead, the application aggregates available listings, performs statistical calculations, and presents summarized information that supports better decision making.** 

## **5. <Target Users>** 

**Misalnya** 

**<Target Users>** 

**Primary Users:** 

- **• Property seekers** 

- **• Property investors** 

- **• Rental market researchers** 

- **• Internal business users** 

**Users are not expected to have technical knowledge.** 

**The interface should therefore remain intuitive and self-explanatory.** 

## **6. <Success Criteria>** 

**Ini bukan DoD.** 

**Ini project goal.** 

**<Success Criteria>** 

**The project is considered successful when:** 

- **• Users can successfully search or input a SPEEDHOME URL.** 

- **• Relevant listings are automatically collected.** 

- **• Data is normalized correctly.** 

- **• Analytics are generated accurately.** 

- **• Dashboard information is easy to understand.** 

- **• Export functionality works correctly.** 

## **● • The application performs reliably across desktop and mobile devices.** 

## **7. <Technology Stack>** 

**Ini jangan terlalu rigid.** 

**<Technology Stack>** 

**Preferred technologies include:** 

## **Frontend:** 

- **- Next.js** 

- **- TypeScript** 

- **- Tailwind CSS** 

- **- shadcn/ui** 

## **Backend:** 

## **● - Next.js API Routes** 

## **Database:** 

- **- Supabase** 

## **Scraping:** 

- **- Playwright** 

- **- Cheerio** 

**Visualization:** 

- **- Recharts** 

**Data Export:** 

- **- xlsx** 

- **- PapaParse** 

**Alternative technologies may be used only if they provide a clear technical advantage and receive prior approval.** 

## **8. <Project Architecture>** 

**Ini baru architecture project.** 

**Misalnya.** 

**<Project Architecture>** 

**The application should follow a layered architecture.** 

**Presentation Layer** 

## **↓** 

**Application Layer** 

## **↓** 

**Scraping Layer** 

## **↓** 

**Data Transformation Layer** 

## **↓** 

**Analytics Layer** 

## **↓** 

**Persistence Layer** 

## **↓** 

**Database** 

**Each layer should have clear responsibilities and minimal coupling.** 

## **<Scraping Strategy>** 

**The application relies on publicly accessible rental listings from SPEEDHOME Malaysia.** 

**Scraping must be performed responsibly, predictably, and respectfully.** 

## **Always follow these principles:** 

- **• Respect robots.txt and only access publicly permitted pages.** 

- **• Never crawl disallowed routes.** 

- **• Never bypass authentication, CAPTCHA, or any access restriction.** 

- **• Never attempt to scrape private or protected content.** 

- **• Introduce a reasonable delay between requests to minimize server load.** 

- **• Avoid sending excessive concurrent requests.** 

- **• Retry failed requests using exponential backoff where appropriate.** 

- **• Stop scraping immediately if repeated blocking responses are detected.** 

## **Scraping should prioritize reliability over speed.** 

**The objective is to collect accurate data without negatively impacting the target website.** 

**If the website structure changes or required data cannot be extracted, explain the issue clearly instead of generating fabricated data.** 

## **<Data Collection Rules>** 

**Only collect information that is publicly available on the target listing pages.** 

**For every property listing, attempt to collect the following information whenever available:** 

- **• Listing Title** 

- **• Property Name** 

- **• Area Name** 

- **• Monthly Rental Price** 

- **• Annual Rental Price (calculated when necessary)** 

- **• Rental Type** 

- **• Number of Bedrooms** 

- **• Property Size (sqft)** 

- **• Furniture Status** 

- **• Property Type** 

- **• Listing URL** 

## **If a field is unavailable:** 

- **• Return a clear "Not Available" value.** 

- **• Never fabricate missing information.** 

- **• Never infer values without sufficient evidence.** 

**Each collected record should represent a single property listing.** 

## **<Data Validation Rules>** 

## **Before storing or displaying data, validate every collected record.** 

## **Validation should include:** 

- **• Required fields are present.** 

- **• Price values are numeric.** 

- **• Property size is numeric when available.** 

- **• URLs are valid.** 

- **• Bedroom values follow expected formats.** 

- **• Furniture status is normalized into predefined categories.** 

**Normalize inconsistent values whenever possible.** 

**Examples:** 

**"Fully Furnished"** 

**"Fully furnished"** 

## **"FULLY FURNISHED"** 

## **↓** 

**Fully Furnished** 

## **If validation fails:** 

- **• Skip invalid fields safely.** 

- **• Log validation issues.** 

- **• Continue processing remaining records whenever possible.** 

**The application should fail gracefully rather than terminating the entire collection process.** 

## **<Database Standards>** 

**Supabase serves as the primary persistent storage.** 

## **Database design should prioritize:** 

- **• Data consistency** 

- **• Normalized structures where appropriate** 

- **• Easy querying** 

- **• Future scalability** 

## **Avoid unnecessary duplication.** 

**Each listing should contain:** 

- **• Unique identifier** 

- **• Source URL** 

- **• Area** 

- **• Property Name** 

- **• Listing Information** 

- **• Rental Details** 

- **• Scraping Timestamp** 

**Duplicate listings should be detected using appropriate identifiers such as listing URL or listing ID whenever available.** 

**Do not insert duplicate records unnecessarily.** 

## **<Analytics Rules>** 

**After successful data collection, generate statistical summaries for each property type whenever sufficient data exists.** 

**Analytics should include:** 

- **• Total Listings** 

- **• Average Rental Price** 

- **• Median Rental Price** 

- **• Mode Rental Price** 

- **• Estimated Fair Price** 

- **• Average Property Size** 

## **Group analytics by:** 

## **• Studio** 

- **• 1 Bedroom** 

- **• 2 Bedroom** 

- **• 3 Bedroom** 

## **• Additional room categories when available** 

**Statistical calculations must use validated numerical data only.** 

**Never include invalid or missing values in analytical calculations.** 

**If insufficient data exists for a calculation, clearly indicate that the statistic cannot be computed.** 

## **<Business Rules>** 

**Business requirements always take precedence over technical preferences.** 

**The application must always display transparent and verifiable information.** 

**Every displayed listing should be traceable back to its original SPEEDHOME page.** 

## **Rental prices should remain consistent with the source data.** 

## **Whenever yearly rental values are unavailable, calculate them using:** 

## **Annual Price = Monthly Price × 12** 

## **If multiple rental types exist:** 

- **• Display each rental type clearly.** 

- **• Never merge different rental periods into a single value** 

## **Unavailable rental types should be displayed explicitly as:** 

## **"Not Available"** 

**Never leave important business information blank** 

## **<UI/UX Standards>** 

**The interface should prioritize clarity, readability, and efficiency.** 

## **Users should immediately understand:** 

- **• What data was collected.** 

- **• How many listings were found.** 

- **• Which statistics are being displayed.** 

- **• Where the original listing can be verified.** 

## **Always provide:** 

- 

- **• Loading indicators** 

- **• Progress feedback during scraping** 

- **• Friendly error messages** 

- **• Empty state illustrations or messages** 

- **• Clear success confirmation** 

**Avoid unnecessary animations or decorative elements that distract from the data.** 

**Favor clean layouts, consistent spacing, and intuitive interactions.** 

## **<Responsive Standards>** 

**The application must remain fully usable across desktop, tablet, and mobile devices.** 

**Layouts should adapt gracefully to different screen sizes.** 

**Large tables should support horizontal scrolling without breaking the interface.** 

## **Interactive components should remain accessible on touch devices.** 

**No content should overlap, overflow, or become inaccessible on smaller screens.** 

**Responsiveness should never compromise readability or functionality.** 

## **<Performance Requirements>** 

## **Optimize the application for a fast and responsive user experience.** 

**Prioritize:** 

- **• Efficient data fetching** 

- **• Minimal unnecessary rendering** 

- **• Optimized table rendering** 

- **• Fast statistical calculations** 

- **• Lightweight UI interactions** 

**Avoid performing expensive calculations repeatedly.** 

**Reuse computed values whenever appropriate.** 

**Large datasets should remain responsive through pagination, virtualization, or incremental rendering when necessary.** 

## **<Security Requirements>** 

**Only access publicly available information.** 

**Never attempt to bypass website security mechanisms.** 

**Validate all user-provided URLs before processing.** 

**Prevent injection attacks by validating and sanitizing user input.** 

**Store all sensitive configuration securely using environment variables.** 

**Do not expose internal implementation details through the user interface.** 

**All external requests should be handled safely and predictably.** 

## **<Deployment Requirements>** 

**The application must be deployable to Vercel without requiring significant code changes.** 

**Environment configuration should remain portable across development and production environments.** 

## **Supabase credentials should be configured through environment variables.** 

**The production build must complete successfully without linting or TypeScript errors. The deployed application should function consistently with the local development environment.** 

## **<Project Constraints>** 

**The following constraints must always be respected:** 

- **• Do not collect data outside publicly accessible SPEEDHOME pages.** 

- **• Do not fabricate missing listing information.** 

- **• Do not implement features outside the approved project scope.** 

- **• Do not modify business requirements without approval.** 

- **• Do not sacrifice maintainability for implementation speed.** 

## **Whenever technical limitations prevent full implementation:** 

- **• Explain the limitation.** 

- **• Describe the impact.** 

- **• Recommend the most appropriate solution.** 

- **• Wait for approval before changing the implementation strategy.** 

## **<Out of Scope>** 

**The following features are intentionally excluded from this project unless explicitly requested:** 

- **• User Authentication** 

- **• User Registration** 

- **• Role-Based Access Control** 

- **• Payment Processing** 

- **• Property Booking** 

- **• Admin Dashboard** 

- **• Real-Time Notifications** 

- **• Manual Property Management** 

- **• AI Price Prediction** 

- **• Machine Learning Models** 

- **• Recommendation Engines** 

- **• Real-Time Synchronization** 

- **• Multi-Tenant Support** 

## **Avoid introducing additional features beyond the approved scope.** 

## **<Project Deliverables>** 

## **The final project should include:** 

- **• Production-ready web application** 

- **• Responsive user interface** 

- **• Automated SPEEDHOME data collection** 

- **• Structured property listings** 

- **• Statistical price summary dashboard** 

- **• Search and URL input functionality** 

- **• CSV and Excel export capability** 

- **• Supabase database integration** 

- **• Vercel deployment configuration** 

- **• Clean project architecture** 

- **• Well-structured documentation** 

**The delivered solution should demonstrate both technical quality and alignment with the approved business requirements.** 

## **<Acceptance Criteria>** 

**Bukan PRD, tapi aturan global bahwa setiap fitur baru wajib memenuhi acceptance criteria sebelum dianggap selesai.** 

## **<Known Risks & Mitigation>** 

## **Misalnya:** 

- **Struktur HTML SPEEDHOME berubah.** 

- **Rate limit atau blocking saat scraping.** 

- **Data tidak lengkap atau format tidak konsisten.** 

- **Duplicate listings.** 

- **Perubahan robots.txt.** 

## **Cursor jadi sudah punya strategi mitigasi sejak awal.** 

**<Future Scalability>** 

## **Ini menjelaskan bahwa arsitektur harus memudahkan penambahan:** 

- **Website properti lain (PropertyGuru, iProperty, dll.)** 

- **Scheduled scraping.** 

- **Multi-source aggregation.** 

- **Dashboard analytics yang lebih kompleks.** 

