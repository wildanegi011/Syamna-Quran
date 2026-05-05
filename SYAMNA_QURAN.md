# Syamna Quran: Modern Islamic Worship Companion

## 🌟 Short Description
**Syamna Quran** is a premium, modern digital platform designed to accompany Muslims in their daily worship. It provides a seamless and aesthetically pleasing experience for reading the Quran, studying Hadith, tracking spiritual progress, and accessing essential Islamic tools in one unified interface.

---

## 📖 Detailed Concept & Features

Syamna Quran is built on the philosophy of "Spiritual Serenity through Modern Technology." It aims to transform the digital worship experience from a simple utility into a beautiful, engaging journey. The platform leverages high-end UI/UX principles (Dark Tech aesthetic, fluid animations, and premium typography) to create a distraction-free environment for spiritual growth.

### Core Features:

1.  **🕋 Al-Quran (Digital Tilawah & Tadabbur)**
    *   Complete 114 Surahs with high-fidelity Arabic script.
    *   Integrated multi-language translations and Tafsir (detailed explanation) for deeper understanding.
    *   Modern reading interface with customizable layouts.

2.  **📚 Hadith Library**
    *   Curated collections of authentic Hadith.
    *   Easy navigation through categories and narrators.

3.  **🤲 Spiritual Toolkit (Doa & Dhikr)**
    *   Comprehensive library of daily supplications (Doa) and morning/evening Dhikr.
    *   Categorized for various life situations (travel, health, gratitude, etc.).

4.  **✨ Asmaul Husna**
    *   Interactive exploration of the 99 Beautiful Names of Allah.
    *   Meanings, benefits, and spiritual reflections for each name.

5.  **⏰ Precision Prayer Times (Jadwal Sholat)**
    *   Location-based accurate prayer timings.
    *   Countdown to the next prayer to help users manage their time around worship.

6.  **📈 Intelligent Progress Tracking (Future/In-Progress)**
    *   Integration with **Quran Foundation** to track reading streaks, memorization (Hafalan) progress, and daily goals.
    *   Personalized insights to help users stay consistent.

7.  **🎨 Premium Experience**
    *   **Dark Mode by Design**: Reduces eye strain during night-time worship.
    *   **Fluid Transitions**: Powered by Framer Motion for a "premium app" feel.
    *   **Responsive Layout**: Seamlessly works on mobile, tablet, and desktop.

---

## 🛠 API Usage Description (Quran Foundation Integration)

Syamna Quran utilizes the **Quran Foundation API** as its primary data backbone, ensuring authenticity and reliability of the sacred texts and translations.

### 1. Authentication Architecture
The application implements a robust OAuth2 integration with Quran Foundation:
*   **Machine-to-Machine (Client Credentials)**: Used for high-speed, secure fetching of public content (verses, chapters, translations). Tokens are managed and cached server-side for optimal performance.
*   **User-Centric (Authorization Code Flow with PKCE)**: Enables users to securely connect their Quran Foundation accounts to Syamna Quran, allowing for synchronization of reading progress and bookmarks across devices.

### 2. Primary Endpoints & Proxying
To ensure security and performance, all external API calls are proxied through internal routes:

*   **Proxy Route**: `/api/quran/[...path]`
    *   Acts as a gateway to any Quran Foundation endpoint.
    *   Automatically injects required headers (`x-auth-token`, `x-client-id`).
    *   Handles environment-specific configurations (Prelive vs Production).

*   **Chapters API**: `/api/quran/chapters`
    *   **Description**: Retrieves the full list of Surahs.
    *   **Query Params**: `language` (e.g., `id` for Indonesian).
    *   **Usage**: Populates the main Quran dashboard and navigation menus.

*   **Verses & Content**: Managed via the catch-all proxy to fetch specific Ayahs, audio recitations, and translation metadata.

### 3. Data Integrity
All responses from the Quran Foundation are validated and mapped to ensure that the sacred text is displayed accurately and respectfully within the Syamna Quran UI components.
