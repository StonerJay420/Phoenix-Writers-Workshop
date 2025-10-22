# Phoenix Workshop

A modern, full-featured React application built with TypeScript, Vite, and best practices for development workflow.

## Features

- **React 18** with TypeScript (strict mode enabled)
- **Vite** for lightning-fast development and optimized builds
- **Tailwind CSS** for utility-first styling with PostCSS and Autoprefixer
- **ESLint** with Airbnb style guide + Prettier for code quality
- **Vitest** + React Testing Library for unit and component testing
- **Storybook** for component documentation and development
- **PWA Support** with service worker and offline capabilities
- **Responsive AppShell** with collapsible sidebar navigation

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **pnpm** (v8 or higher)

If you don't have pnpm installed:
```bash
npm install -g pnpm
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd phoenix-workshop
```

2. Install dependencies:
```bash
pnpm install
```

## Available Scripts

### Development

Start the development server:
```bash
pnpm dev
```
The app will be available at `http://localhost:5173`

### Building

Build for production:
```bash
pnpm build
```

Preview production build:
```bash
pnpm preview
```

### Testing

Run tests in watch mode:
```bash
pnpm test
```

Run tests with UI:
```bash
pnpm test:ui
```

Generate coverage report:
```bash
pnpm test:coverage
```

### Linting

Run ESLint:
```bash
pnpm lint
```

Fix ESLint issues automatically:
```bash
pnpm lint:fix
```

### Storybook

Start Storybook for component development:
```bash
pnpm storybook
```
Storybook will be available at `http://localhost:6006`

Build Storybook for deployment:
```bash
pnpm build-storybook
```

## Project Structure

```
phoenix-workshop/
├── .storybook/           # Storybook configuration
├── public/               # Static assets
│   ├── manifest.json     # PWA manifest
│   └── favicon.svg       # App favicon
├── src/
│   ├── components/       # React components
│   │   ├── AppShell.tsx  # Main app shell component
│   │   ├── AppShell.stories.tsx  # Storybook stories
│   │   └── AppShell.test.tsx     # Component tests
│   ├── test/            # Test utilities
│   │   └── setup.ts     # Vitest setup
│   ├── App.tsx          # Root app component
│   ├── main.tsx         # App entry point
│   ├── index.css        # Global styles with Tailwind
│   └── vite-env.d.ts    # Vite TypeScript definitions
├── index.html           # HTML entry point
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration (strict mode)
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
├── .eslintrc.cjs        # ESLint configuration
└── .prettierrc          # Prettier configuration
```

## Technology Stack

### Core
- **React 18.2** - UI library
- **TypeScript 5.3** - Type safety (strict mode)
- **Vite 5** - Build tool and dev server

### Styling
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

### Code Quality
- **ESLint** - Code linting with Airbnb config
- **Prettier** - Code formatting
- **TypeScript ESLint** - TypeScript-specific linting rules

### Testing
- **Vitest** - Fast unit test framework
- **React Testing Library** - Component testing utilities
- **jsdom** - DOM implementation for tests

### Documentation
- **Storybook 7** - Component documentation and development

### PWA
- **vite-plugin-pwa** - PWA plugin for Vite
- **Workbox** - Service worker utilities

## AppShell Component

The `AppShell` component provides a responsive layout with:
- **Collapsible sidebar** with navigation menu
- **Header** with toggle button
- **Main content area** with scroll support
- **Mobile-friendly** responsive design

### Usage

```tsx
import AppShell from './components/AppShell';

function App() {
  return (
    <AppShell>
      <YourContent />
    </AppShell>
  );
}
```

## Configuration

### TypeScript Strict Mode

TypeScript is configured with strict mode and additional safety checks:
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noFallthroughCasesInSwitch: true`
- `noImplicitReturns: true`
- `noUncheckedIndexedAccess: true`

### ESLint

The project uses Airbnb's style guide with TypeScript support and Prettier integration.

### PWA

The app is configured as a Progressive Web App with:
- Service worker for offline support
- Web app manifest
- Installable on mobile and desktop

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `pnpm test`
4. Run linting: `pnpm lint:fix`
5. Commit your changes
6. Create a pull request

## License

MIT

## Getting Help

If you encounter any issues:
1. Check that all dependencies are installed: `pnpm install`
2. Clear the cache: `rm -rf node_modules/.vite`
3. Restart the dev server

For more information, visit the [Vite documentation](https://vitejs.dev/) or [React documentation](https://react.dev/).
