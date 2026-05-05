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

5.  **⏰ Precision Prayer Times**
    *   Accurate prayer timings based on location.
    *   Countdown to the next prayer to help with worship time management.

6.  **📈 Intelligent Progress Tracking**
    *   Integration with **Quran Foundation** to track reading streaks, memorization progress, and daily goals.
    *   Personalized insights to help users stay consistent (*istiqomah*).

---

## 🛠 API Integration & Usage Description

Syamna Quran utilizes the **Quran Foundation API** ecosystem as its primary data backbone to ensure the authenticity and quality of the sacred texts and supporting content.

Below are the details of the integrated APIs and their functions:

### 1. **Quran Foundation Content API**
This API is used to fetch public content that forms the core of the application.
*   **Function**: 
    *   Fetching the list of Surahs and Juz.
    *   Retrieving Quranic text (Uthmani/IndoPak scripts).
    *   Fetching audio metadata for murottal playback from various Qaris.
    *   Retrieving translations and Tafsir.
*   **Implementation**: Processed via the internal proxy `/api/quran/[...path]` using the *Client Credentials* flow for high performance.

### 2. **Quran Foundation User API**
Used for personalization features that require a user account.
*   **Function**:
    *   Synchronizing reading history across devices.
    *   Saving bookmarks and favorite verses.
    *   Tracking daily reading progress statistics.
*   **Implementation**: Processed via the proxy `/api/quran/user/[...path]` with OAuth2 authentication (Bearer Token).

### 3. **Quran Reflect API**
Syamna Quran integrates social features to deepen the understanding of verses.
*   **Function**:
    *   Displaying *Tadabbur* posts from the Quran Reflect community.
    *   Allowing users to view deep reflections related to specific verses.
*   **Implementation**: Integrated into the `/api/quran/user/tadabburs` route.

### 4. **OIDC UserInfo API**
Used for user identity management.
*   **Function**:
    *   Retrieving user profile data (name, profile picture, email) after login.
    *   Ensuring user sessions are secure and valid.
*   **Implementation**: Processed via the `/api/quran/user/profile` endpoint.

### 5. **Authentication & Security (OAuth2)**
The security system uses industry-standard OAuth2 protocols:
*   **Authorization Code Flow + PKCE**: Used during browser-based login to securely connect the user's Quran Foundation account.
*   **Token Management**: The system automatically handles *token refreshing* if a session is about to expire, preventing the need for frequent logins.

---

## 🎨 Technology Architecture
*   **Proxy System**: All API requests from the client are routed through the server (Next.js API Routes) to hide API Keys/Secrets and automatically handle token injection.
*   **Caching**: Content data (such as the list of Surahs) is stored in a cache to reduce the load on external APIs and speed up load times.
