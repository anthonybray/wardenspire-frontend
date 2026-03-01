# Contributing to Wardenspire Frontend

Thank you for your interest in contributing to Wardenspire! This document provides guidelines and instructions for contributing.

## Getting Started

1. **Fork the repository** and clone your fork locally
2. **Set up your development environment:**
   ```bash
   cd frontend
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Ensure the backend API is running** (see main README.md for setup instructions)

## Development Workflow

1. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes** following the coding standards below

3. **Test your changes** in the browser

4. **Run type checking:**
   ```bash
   npm run build  # This runs TypeScript compilation
   ```

5. **Commit your changes** with clear, descriptive commit messages

6. **Push to your fork** and create a Pull Request

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` types when possible
- Use meaningful variable and function names

### React/Component Guidelines

- Use functional components with hooks
- Keep components focused and reusable
- Extract complex logic into custom hooks or utilities
- Follow the existing component structure

### Code Organization

- Keep files under 500 lines when possible
- Separate components, utilities, and API calls
- Use the existing structure as a guide

### UI/Styling

- **Follow the style guide** in `docs/style_guide.md`
- Use Material-UI (MUI) components where possible
- Maintain consistency with existing UI patterns
- Ensure accessibility (keyboard navigation, ARIA labels, etc.)

### Testing

- Test your changes manually in the browser
- Test in different browsers if applicable
- Verify the UI follows the style guide

## Pull Request Process

1. **Update documentation** if you've changed functionality
2. **Test your changes** thoroughly
3. **Ensure TypeScript compilation succeeds** (`npm run build`)
4. **Follow the UI style guide** (docs/style_guide.md)
5. **Fill out the PR template** completely
6. **Request review** from maintainers

## Commit Messages

Use clear, descriptive commit messages:

```
feat: Add zone management UI component
fix: Resolve map rendering issue on mobile
docs: Update component documentation
refactor: Simplify zone selector logic
style: Update button colors per style guide
```

## UI Style Guide

**Important:** All UI changes must follow the style guide in `docs/style_guide.md`. Key points:

- Use the defined color palette
- Follow button styles (option, confirm, delete)
- Maintain consistent spacing and typography
- Use the correct dialog/modal styling

## Questions?

If you have questions or need help, please:
- Open an issue for discussion
- Check the existing documentation in `docs/`
- Review the codebase for examples
- Refer to the style guide in `docs/style_guide.md`

Thank you for contributing to Wardenspire!
