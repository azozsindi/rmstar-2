# RM STAR — Enterprise Energy, Fuel Stations & Car Wash

A complete, production-grade corporate digital platform, fuel station locator, diesel wholesale procurement portal, vehicle care operations, and secure administrative CMS for **RM STAR**.

---

## 1. Brand Identity & Design System

- **Brand Name**: RM STAR
- **Corporate Slogan (Arabic)**: «RM STAR — شراكة تُبنى على الثقة»
- **Corporate Slogan (English)**: "RM STAR — Built on Trust. Driven by Excellence."
- **Brand Palette**:
  - Deep Black: `#080808` (Dominant luxury background)
  - Charcoal: `#151515` / `#121212` (Cards and structured surfaces)
  - Luxury Gold: `#C8A45D` (Headings, fine borders, active states, key accents)
  - Champagne Gold: `#E2C98A` (Gradient highlights and icons)
  - Ivory White: `#F4F1E9` (High-contrast typography)
  - Muted Gray: `#A6A6A6` (Secondary text and metadata)
- **Emblem**: Geometric 8-pointed multifaceted star emblem integrated with architectural typography.

---

## 2. Bilingual Support (Arabic & English)

- **Default Language**: Arabic (`ar`) with full **RTL** (`dir="rtl"`) layout and `Tajawal` luxury typography.
- **English Language**: English (`en`) with **LTR** (`dir="ltr"`) layout and `Plus Jakarta Sans` typography.
- **Language Switcher**: Persistent in the header and mobile navigation, instantaneously updating layout direction, navigation, forms, validation messages, and CMS interfaces.

---

## 3. Technology Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide Icons, Motion.
- **Authentication**: Firebase Authentication (Google Auth Popup with RBAC validation).
- **Database**: Cloud Firestore (Enterprise Edition provisioned in AI Studio).
- **Security Rules**: Strict `firestore.rules` enforcing attribute-based access control (ABAC), deny-by-default, and public privacy on quotation requests and customer contact submissions.
- **Deployment Targets**: AI Studio Dev / Cloud Run & Vercel.

---

## 4. Cloud Firestore Collections Schema

| Collection | Schema Entity | Access Policy |
| :--- | :--- | :--- |
| `siteSettings` | `SiteSettings` | Public Read (`global` doc), Admin Write |
| `stations` | `FuelStation` | Public Read if `isPublished == true`, Admin Write |
| `carWashBranches` | `CarWashBranch` | Public Read if `isPublished == true`, Admin Write |
| `carWashServices` | `CarWashService` | Public Read if `isPublished == true`, Admin Write |
| `partners` | `Partner` | Public Read if `isPublished == true`, Admin Write |
| `news` | `NewsArticle` | Public Read if `isPublished == true`, Admin Write |
| `quotationRequests` | `QuotationRequest` | Public Create (strict field validation), Admin Read/Update/Delete |
| `contactMessages` | `ContactMessage` | Public Create (strict field validation), Admin Read/Update/Delete |
| `admins` | `AdminProfile` | Signed-In Read, Superadmin Write |

---

## 5. First Administrator Provisioning

The application has bootstrapped administrative authorization for:
- **Primary Superadmin Email**: `AzozSindi23@gmail.com`

### How to Sign In:
1. Click the **Shield Icon** in the top navigation bar or **CMS** link in the footer.
2. Click **Sign in with Google** using `AzozSindi23@gmail.com`.
3. The system validates the account and unlocks the full **RM STAR Central Management CMS**.

### Adding Additional Administrators:
In the Cloud Firestore database under the `admins` collection, add a document with document ID matching the user's Firebase UID:
```json
{
  "email": "executive@rmstar.com",
  "role": "superadmin",
  "addedAt": "2026-10-10T00:00:00Z"
}
```

---

## 6. How to Deploy on Vercel

1. **Push to GitHub**:
   Ensure all changes are committed and pushed to your GitHub repository.
2. **Import into Vercel**:
   - Go to [vercel.com](https://vercel.com) and click **Add New Project**.
   - Select your GitHub repository.
   - Framework Preset: **Vite**.
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. **Configure Environment Variables**:
   Add the variables defined in `.env.example`:
   - `APP_URL`: Your Vercel deployment URL (e.g. `https://rm-star.vercel.app`)
4. **Authorize Vercel Domain in Firebase**:
   - In the Firebase Console -> **Authentication** -> **Settings** -> **Authorized Domains**.
   - Add your Vercel deployment domain (e.g., `rm-star.vercel.app`).
5. **Connect Custom Domain (Later)**:
   - In Vercel Project Settings -> **Domains**, add your custom domain (e.g. `rmstar.com`).
   - Add the custom domain to Firebase **Authorized Domains**.
   - No code rebuilding or codebase changes are required.

---

## 7. Build and Verification Commands

```bash
# Build production bundle
npm run build

# Run typecheck and linting
npm run lint

# Run development server
npm run dev
```
