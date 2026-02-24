# Wedding Event Online Gallery

## Development Setup

This project is configured with standardized code formatting and linting tools.

### Available Scripts

```bash
# Development
npm run dev          # Start development server on port 8080

# Code Quality
npm run lint         # Run ESLint and fix issues automatically
npm run lint:check   # Check for linting issues without fixing
npm run format       # Format all code with Prettier
npm run format:check # Check code formatting without changing files
npm run type-check   # Run TypeScript type checking

# Production
npm run build        # Build the application
npm run start        # Start production server
```

### Code Standards

This project uses:

- **ESLint** for code quality and consistency
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Tailwind CSS** for styling

### VS Code Setup

The project includes VS Code workspace settings that automatically:

- Format code on save
- Fix ESLint issues on save
- Organize imports

#### Required VS Code Extensions

Install these extensions for the best development experience:

- Prettier - Code formatter
- ESLint
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features
- EditorConfig for VS Code

### Formatting Rules

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for JS/TS, single quotes for JSX attributes
- **Semicolons**: Always use semicolons
- **Line width**: 80 characters
- **Trailing commas**: ES5 compatible
- **End of line**: LF (Unix style)

### Git Hooks (Optional)

To ensure code quality before commits, you can add pre-commit hooks:

```bash
# Install husky for git hooks
npm install --save-dev husky lint-staged

# Add to package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,css,md}": ["prettier --write"]
  }
}
```

### Project Structure

```
wedding-event-online/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── public/             # Static assets
├── .vscode/            # VS Code settings
├── .prettierrc         # Prettier configuration
├── .editorconfig       # Editor configuration
├── eslint.config.mjs   # ESLint configuration
└── tsconfig.json       # TypeScript configuration
```

### Configuration Files

- **`.prettierrc`** - Prettier formatting rules
- **`.editorconfig`** - Cross-editor consistency
- **`eslint.config.mjs`** - ESLint rules and plugins
- **`.vscode/settings.json`** - VS Code workspace settings
- **`.vscode/extensions.json`** - Recommended extensions

This setup ensures consistent code style across the team and automatic formatting on save in VS Code.
