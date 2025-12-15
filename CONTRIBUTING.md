# Contributing to Fibo Orchestra

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/monodox/fibo-orchestra.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Install frontend dependencies: `cd frontend && npm install`
5. Install backend dependencies: `cd backend && pip install -r requirements.txt`
6. Start development servers: Frontend `npm run dev`, Backend `uvicorn app.main:app --reload`

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow existing code formatting (Prettier/ESLint)
- Use meaningful variable and function names
- Add comments for complex logic

### Component Guidelines

- Place reusable components in `src/components/`
- Place UI primitives in `src/components/ui/`
- Use shadcn/ui patterns for consistency
- Keep components small and focused

### Commit Messages

Follow conventional commits format:

```
feat: add new feature
fix: resolve bug
docs: update documentation
style: formatting changes
refactor: code restructuring
test: add tests
chore: maintenance tasks
```

## Pull Request Process

1. Update documentation for any new features
2. Ensure all tests pass: `npm run build`
3. Update CHANGELOG.md with your changes
4. Submit PR with clear description of changes
5. Link any related issues

## Code Review

- All PRs require review before merging
- Address feedback promptly
- Keep PRs focused and reasonably sized
- Ensure CI checks pass

## Testing

- Write tests for new features
- Ensure existing tests pass
- Test across different browsers

## Questions?

Open an issue or reach out to maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
