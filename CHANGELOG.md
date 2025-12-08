# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup with Next.js 14 and React 18
- Console dashboard with metrics and recent renders
- Project management system
- Prompt-to-JSON generator with FIBO integration
- Render history tracking
- Integration page for API key management
- Multi-provider support (Bria, Replicate, FAL.ai, Runware)
- Client-side API key storage via localStorage
- Inspire mode for image-to-prompt generation
- FIBO schema documentation
- User settings and preferences
- Collapsible sidebar navigation
- Responsive UI with Tailwind CSS
- shadcn/ui component library integration

### Changed
- API key handling: Moved from environment variables to frontend localStorage
- Provider detection: Automatic selection based on available API keys
- Generation workflow: Simplified to Generate and Inspire modes

### Removed
- Refine feature (consolidated into main generation flow)
- Compare page (streamlined navigation)

### Fixed
- API key propagation from frontend to backend
- Runware integration: Added required `model` parameter
- Empty prompt handling in refine workflow
- Bria API error handling for semantic validation
- Provider fallback logic for better reliability

### Security
- API keys stored client-side in localStorage (never in source code)
- Secure API key transmission to backend via request headers

## [0.1.0] - 2024-01-XX

### Added
- Initial release
- Core console functionality
- Basic project and render management
