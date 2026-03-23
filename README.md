# AI Recipe Creator


![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)

---

## Features

- **AI Recipe Generation** — Enter your available ingredients and let Google Gemini AI craft personalized recipes with step-by-step instructions.
- **Pantry Management** — Track and manage your pantry items to always know what's available.
- **Smart Suggestions** — Get AI-powered recipe suggestions based on what's currently in your pantry.
- **Explore Recipes** — Browse and discover recipes across different categories and cuisines.
- **Recipe Details** — View detailed instructions, ingredients, cooking time, difficulty level, and pro tips.
- **Save Recipes** — Save your favorite generated recipes for later.
- **Authentication** — Secure user authentication powered by Clerk.
- **Responsive Design** — Fully responsive UI that works beautifully on desktop, tablet, and mobile.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **Vite 6** | Build tool & dev server |
| **TailwindCSS 3** | Utility-first styling |
| **React Router 7** | Client-side routing |
| **TanStack React Query** | Server state management |
| **Radix UI** | Accessible UI primitives (Dialog, Select, Tabs, Dropdown) |
| **Lucide React** | Icon library |
| **React Hook Form + Zod** | Form handling & validation |
| **Sonner** | Toast notifications |
| **Clerk** | Authentication |

### AI
| Technology | Purpose |
|---|---|
| **Google Gemini 2.0 Flash** | AI recipe generation & suggestions |

### Backend (Optional)
| Technology | Purpose |
|---|---|
| **Express.js** | REST API server (backup) |
| **Strapi** | Headless CMS backend |

---

## Project Structure

```
RecipeGenAi/
├── src/
│   ├── components/
│   │   ├── layout/          # Header, Footer, Layout
│   │   ├── recipe/          # RecipeCard
│   │   └── ui/              # Button, Card, Dialog, Input, Select, Tabs, Badge, Skeleton
│   ├── hooks/               # useAI, usePantry, useRecipes
│   ├── pages/
│   │   ├── Home.jsx         # Landing page
│   │   ├── Explore.jsx      # Browse recipes
│   │   ├── AIRecipe.jsx     # AI recipe generator
│   │   ├── Pantry.jsx       # Pantry management
│   │   ├── PantrySuggestions.jsx  # AI-powered suggestions
│   │   ├── MyRecipes.jsx    # Saved recipes
│   │   ├── RecipeDetail.jsx # Recipe detail view
│   │   ├── Category.jsx     # Category-based browsing
│   │   └── Pricing.jsx      # Pricing page
│   ├── services/
│   │   ├── aiService.js     # Gemini AI integration
│   │   ├── api.js           # Axios API client
│   │   ├── recipeService.js # Recipe CRUD operations
│   │   ├── pantryService.js # Pantry CRUD operations
│   │   └── userService.js   # User operations
│   ├── lib/                 # Utility functions
│   ├── App.jsx              # Routes & app shell
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── backend-express-backup/  # Express.js backend (backup)
├── backend-strapi/          # Strapi CMS backend
├── index.html               # HTML entry
├── tailwind.config.js       # Tailwind configuration
├── vite.config.js           # Vite configuration
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- A **Google Gemini API Key** — Get one free at [Google AI Studio](https://aistudio.google.com/apikey)
- A **Clerk account** — Sign up at [clerk.com](https://clerk.com)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/GiRi908/recipe-gen-ai.git
   cd recipe-gen-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**

   Visit [http://localhost:5173](http://localhost:5173)

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `VITE_GEMINI_API_KEY` | Google Gemini API key for AI recipe generation | Yes |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key for authentication | Yes |

---

## Key Pages

| Page | Description |
|---|---|
| **Home** | Landing page with featured recipes and app overview |
| **AI Recipe** | Enter ingredients & preferences to generate custom recipes |
| **Pantry** | Add, edit, and manage your pantry inventory |
| **Pantry Suggestions** | Get AI-powered recipe ideas from your pantry items |
| **Explore** | Browse and discover recipes by category |
| **My Recipes** | View and manage your saved recipes |
| **Pricing** | Subscription plans and pricing details |

---

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Made with love by <a href="https://github.com/GiRi908">GiRi908</a>
</p>
