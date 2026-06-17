# UNIVERSITY MEMORANDUM

**MEMO NO. :** UCO-2026-06-13
**DATE :** June 13, 2026
**TO :** All Concerned
**SUBJECT :** Technical Overview of System Components (Local Doc Viewer & Admin Dashboard)

---

This memorandum provides a technical overview of the currently implemented system architecture for handling document submissions and administration, specifically focusing on the interactions between the **Local Doc Viewer** service and the **Admin Dashboard**.

### 1. Local Document Viewer Service
The Local Document Viewer is a backend service developed using Node.js and Express, operating on port `3001`. It is designed to bridge the gap between stored file assets and the administration interface.

*   **Core Functionality:**
    *   **File Serving:** Provides direct access to uploaded files (PDFs, Images, Video, Audio) via the `/file/:folder/:filename` endpoint.
    *   **Directory Listing:** Offers an endpoint (`/list/:folder`) to retrieve a list of all files within a specific submission directory, enabling dynamic UI updates.
    *   **Document Conversion:** Implements a specialized endpoint (`/view/docx/:folder/:filename`) that utilizes the `mammoth` library to convert Microsoft Word (`.docx`) documents into styled HTML for seamless in-browser previewing.

### 2. Admin Dashboard Submission Viewer
The Admin Dashboard, built with the Astro framework, includes a dedicated submission management interface located at `/submission/[id]`. This component serves as the primary portal for administrators to review incoming requests.

*   **Integration Mechanisms:**
    *   **Dynamic Data Rendering:** The dashboard fetches comprehensive submission metadata from the `/api/submissions` endpoint and dynamically populates the submission details, including request context, office information, and contact details.
    *   **Interactive Preview Engine:** The interface communicates directly with the Local Document Viewer service to render attached files. It dynamically generates preview buttons based on file types (e.g., Docx, PDF, Image, Video, Audio) and utilizes `<iframe>` or HTML5 elements to present these files within the dashboard's `id="file-preview"` container.
    *   **Auto-Preview:** Upon loading a submission, the system automatically detects and previews the primary document template, ensuring immediate access to relevant content.

This architecture ensures that administrators can efficiently review, process, and manage submissions within a centralized, user-friendly environment.

---
*(ORIGINAL SIGNED)*
Gemini CLI
System Administrator
