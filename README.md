# BSMI Anatomy

An independent digital learning platform for medical students, focused on human anatomy and practical study resources. The project is being developed to make anatomy learning more accessible to Uzbek-speaking students.

**Live application:** https://bsmi-taqtimot.vercel.app  
**Source code:** https://github.com/asadbekistamov99-hash/BSMI-TAQTIMOT

> **Project status:** Actively developed. Features and deployment configuration may change. This is an independent educational project and is not an official product of Bukhara State Medical Institute (BSMI).

## What it provides

The repository currently includes an anatomy learning application with the following areas:

- **Anatomy learning:** structured medical learning materials and anatomy topics.
- **3D learning resources:** an atlas-style experience and 3D model catalogue to support spatial understanding.
- **Quizzes and practice:** interactive learning and assessment features.
- **Presentation resources:** presentation upload and storage workflows.
- **AI-assisted learning:** Gemini-powered assistant capabilities, subject to valid API configuration and available quotas.
- **Administration:** tools for managing learning resources and application content.
- **Optional backend integrations:** configuration paths for Supabase and Appwrite.

The exact feature availability depends on the current deployment configuration and connected services.

## Technology

- React 19 and TypeScript
- Vite
- Tailwind CSS
- Three.js / Google Model Viewer
- Express
- Google Gemini API
- Optional Supabase and Appwrite integrations

## Run locally

### Requirements

- Node.js (a current LTS release is recommended)
- npm

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/asadbekistamov99-hash/BSMI-TAQTIMOT.git
   cd BSMI-TAQTIMOT
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create your local environment file:

   ```bash
   cp .env.example .env
   ```

4. Open `.env` and configure the services you intend to use. At minimum, add your own Gemini API key if you want to use Gemini-powered features. Configure Supabase or Appwrite only if you intend to use those integrations.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL printed by the development server.

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the application in development mode. |
| `npm run build` | Builds the frontend and bundles the server. |
| `npm start` | Starts the bundled server after a successful build. |
| `npm run preview` | Runs the Vite preview server. |
| `npm run lint` | Runs the TypeScript compiler check. |
| `npm run clean` | Removes the generated `dist` directory. |

## Environment variables and security

- Never commit a real `.env` file, API key, access token, database credential, or production password.
- Replace every example or default credential with a strong, unique value before deploying.
- Keep server-only secrets on the server. Do not expose private API keys through client-side variables.
- Restrict access to administrative functions and rotate any credential that may have been exposed.
- Review the provider documentation before enabling Gemini, Supabase, Appwrite, OAuth, or biometric features.

The `.env.example` file is a configuration reference only. It must not be used as a production secrets file.

## Educational and medical disclaimer

BSMI Anatomy is an educational study aid. It is not a substitute for formal medical education, clinical supervision, professional medical advice, or an authoritative anatomical reference. Users should verify important medical information against trusted textbooks and institutional teaching materials.

## Contributing

Issues, suggestions, and pull requests are welcome. Please:

1. Describe the problem or proposed improvement clearly.
2. Include reproduction steps for bug reports.
3. Add or update tests when relevant.
4. Avoid including secrets, private student information, or copyrighted materials without permission.

## License and third-party materials

The original software source code authored for this project is made available under the MIT License; see [LICENSE](./LICENSE).

The MIT License does **not** automatically relicense third-party dependencies, external 3D models, images, videos, presentations, textbooks, logos, fonts, or other materials. Those items remain subject to their own copyright and license terms. Do not reuse or redistribute them unless their applicable terms allow it.

---

Maintained by **Asadbek Istamov**  
GitHub: https://github.com/asadbekistamov99-hash
