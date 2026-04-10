# Resume Optimizer v0

Claude agent skill that tailors resumes to specific job descriptions

## Problem This Skill Solves

### The Core Problem

Job seekers struggle to tailor their resumes for specific roles while maintaining authenticity and formatting.

Specifically, this skill addresses:

- **Relevance Mismatch:** Generic resumes don't highlight the most relevant experience for each job posting
- **Skills Discoverability:** Important skills get buried among less relevant ones
- **Time-Intensive Manual Work:** Manually analyzing job descriptions and reordering content takes hours
- **Format Destruction:** Most resume tools destroy carefully crafted formatting when making edits
- **Loss of Authenticity:** Many tools add corporate jargon or change factual data, making resumes feel "AI-generated"
- **Page Limit Constraints:** Candidates need to fit everything on 1 page without losing important content

### The Solution Approach

- **AI-Powered Job Analysis:** Automatically extracts key requirements, skills (technical + soft), and competencies from job postings
- **Intelligent Content Reordering:** Scores and reorders resume bullets by relevance rather than chronological order
- **Smart Skills Prioritization:** Moves job-relevant skills to the top while preserving all others
- **Format Preservation:** Generates manual update instructions (for Google Docs) rather than auto-editing, preserving your formatting
- **Data Integrity:** Never changes facts, dates, or metrics — only reorders and emphasizes existing content
- **Skills Gap Analysis:** Identifies missing skills to help candidates prepare for interviews or decide if they're a good fit

## Tech Stack

| Category | Technology |
|---|---|
| Core Language | Python 3.9+ |
| Document Processing | pdfplumber (0.9.0+), PyPDF2 (3.0.0+), python-docx (0.8.11+) |
| Web & Data Processing | requests (2.28.0+), beautifulsoup4 (4.11.0+) |
| Google Docs Integration (Optional) | google-api-python-client (2.80.0+), google-auth (2.16.0+), google-auth-oauthlib (1.0.0+), google-auth-httplib2 (0.1.0+) |
| Built-in Python Libraries | pathlib, difflib, re (regex), dataclasses, argparse |

## Architecture Pattern

Modular Design: Separation of concerns across 5 core modules:

- `resume_analyzer.py` - Input parsing
- `job_matcher.py` - Requirement extraction
- `optimizer.py` - Core optimization logic
- `skills_analyzer.py` - Gap analysis
- `google_docs_helper.py` - Output formatting
- `main.py` - Orchestration layer

## Key Algorithms

### Relevance Scoring Algorithm (in optimizer.py)

- Keyword matching: +2.0 per job skill found
- Leadership verbs: +0.5-1.0 for senior roles
- Quantifiable metrics: +0.5 per data point
- Importance weighting: 3x (required), 2x (preferred), 1x (nice-to-have)

### Skill Extraction (in job_matcher.py)

- Pattern matching for technical skills (Python, SQL, AWS, etc.)
- PM competency detection (stakeholder management, GTM, roadmap)
- Requirement categorization using NLP patterns

### Content Preservation

- No factual changes to dates, numbers, or achievements
- Section order preservation
- Bullet reordering within sections only

## Output Formats

- Plain text (.txt)
- Microsoft Word (.docx)
- Google Docs manual instructions
- Detailed change tracking reports

## Example: Resume Optimization for Cult.fit PM2 Role

### Optimization Strategy

Emphasize 0-to-1 building, rapid experimentation, user engagement focus.

### Key Changes Made

- Total Sections Modified: 2 (Experience, Skills)
- Bullets Reordered: 8 (prioritized 0-to-1 work)
- Bullets Reframed: 8 (added job-specific keywords)
- New Content Added: Fitness interest in Skills section
- Word Count: Maintained within 1-page limit

### Detailed Changes

**Experience - Product Manager 1 (Current Role):**

Reordered and reframed bullets to lead with 0-to-1 product development (Annual Flashback scaling to 5.2M+ users), added language like "rapid experimentation," "hypothesis-driven A/B testing," "user research to identify content preferences," and "established performance metrics."

**Experience - Associate Product Manager 2:**

Added "0-to-1" framing to voice search launch, replaced technical details with user research language, added "hypothesis testing and validation," and emphasized cross-functional collaboration with "design, analytics, engineering, and business teams."

**Experience - Associate Product Manager 1:**

Moved Pills in Search to bullet 1 (strongest 0-to-1 example), added "market research and user trend analysis," emphasized "high ownership in building industry-first experience."

**Skills & Interests:**

Completely reframed. Product Management skills listed first: 0-to-1 product development, rapid experimentation & hypothesis testing, user research & persona definition, customer journey optimization. Removed overly AI-specific terms (NER, semantic deduplication). Added "Personal: Fitness enthusiast" to address job's fitness industry preference.

### Keywords Added/Emphasized

- 0-to-1 product development (4 mentions)
- Rapid experimentation (4 mentions)
- Hypothesis testing (3 mentions)
- User research / user analysis (3 mentions)
- Customer journey optimization (3 mentions)
- Data-driven (3 mentions)
- Cross-functional collaboration (1 detailed mention)
- Performance metrics (2 mentions)

### Strategic Positioning

The optimized resume positions the candidate as:

1. Serial 0-to-1 Product Builder (4 explicit examples)
2. Experimentation Expert
3. User-Obsessed PM
4. Engagement & Retention Specialist (73.4%, 82% completion rates)
5. Cross-functional Leader
6. Data-Driven Executor
7. High-Ownership Mindset
8. Fitness Enthusiast (strategic for role)
9. Tier 1 Education (IIT Delhi + Entrepreneurship minor)

### Strength of Match

Overall Match: EXCEPTIONAL (90-95%)

- Multiple 0-to-1 products (exactly what they need)
- Proven rapid experimentation (core to the role)
- Strong engagement metrics (critical for subscription fitness)
- IIT Delhi degree (Tier 1 preference)
- 3+ years PM experience (meets requirement)
- Cross-functional leadership (required)

Only Gap: No direct fitness industry experience (listed as "a plus," not required). Mitigated by adding fitness interest and emphasizing transferable skills.
