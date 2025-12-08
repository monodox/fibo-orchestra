# Fibo Orchestra

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red.svg)
![Python](https://img.shields.io/badge/python-3.11+-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-18+-green.svg)

An **open-source** JSON-native visual generation console built on Bria FIBO, designed to give creators precise, deterministic control over camera, lighting, FOV, palettes, and HDR parameters.

> 🎨 **Open Source AI Image Generation Platform** - Free to use, modify, and distribute under the MIT License.

## Features

- **FIBO Integration**: Built on Bria's FIBO model - the first open-source, JSON-native text-to-image model
- **Two Generation Modes**: Generate (prompt-to-JSON), Inspire (image-to-prompt)
- **Visual Console**: Clean React/Next.js interface for managing projects and renders
- **Controllability Panel**: Precise control over camera, lighting, FOV, palette, and HDR
- **Structured Prompts**: VLM-guided JSON prompts for professional control
- **Batch Parameter Sweeps**: Run multiple parameter variations efficiently
- **Project & History Management**: Full render history tracking and project organization
- **Multi-Provider Support**: Bria, Replicate, FAL.ai, and Runware with automatic provider detection
- **Flexible API Key Management**: Client-side keys for prototyping; backend environment variables for production

## Getting Started

### Prerequisites

- Node.js 18+ 
- Python 3.11+
- npm or yarn
- API Keys: Bria, Replicate, or FAL.ai (get from respective platforms)
- Optional: Redis (for production queue), MinIO/S3 (for storage)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the console.

### Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Unix/Mac
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend API available at [http://localhost:8000](http://localhost:8000)

### API Keys Setup

You can add API keys either through the web interface or environment variables:

**Option 1: Web Interface (For Prototyping/Development)**
1. Start the application
2. Navigate to **Integrations** page in the sidebar
3. Add your API keys for any of these providers:
   - **Bria**: [https://bria.ai](https://bria.ai) (Recommended for FIBO features)
   - **Replicate**: [https://replicate.com](https://replicate.com)
   - **FAL.ai**: [https://fal.ai](https://fal.ai)
   - **Runware**: [https://runware.ai](https://runware.ai)
4. Keys are stored in browser localStorage

> ⚠️ **Security Notice**: Client-side API key storage is suitable for prototyping and development only. For production deployments, always use backend environment variables (Option 2) to keep your API keys secure.

**Option 2: Environment Variables (Recommended for Production)**
Add to `backend/.env`:
```bash
BRIA_API_KEY=your_bria_key
REPLICATE_API_TOKEN=your_replicate_token
FAL_API_KEY=your_fal_key
RUNWARE_API_KEY=your_runware_key
RENDER_PROVIDER=bria  # or replicate, fal, runware
```

The system will automatically detect and use available API keys, prioritizing Bria for FIBO-specific features.

### Docker (Optional)

```bash
docker-compose up
```

## Tech Stack

### Frontend
- **Framework**: Next.js 14, React 18
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Icons**: Lucide React
- **Language**: TypeScript

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.11
- **AI Models**: Bria FIBO, Replicate, FAL.ai
- **Queue**: Redis + RQ
- **Storage**: S3/MinIO (with local fallback)
- **Testing**: Pytest with coverage

## Project Structure

```
fibo-orchestra/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── console/          # Console pages
│   │   │   │   ├── dashboard/    # Overview & metrics
│   │   │   │   ├── projects/     # Project management
│   │   │   │   ├── generate/     # Prompt-to-JSON & Inspire
│   │   │   │   ├── history/      # Render history
│   │   │   │   ├── integrations/ # API integrations
│   │   │   │   ├── docs/         # FIBO schema docs
│   │   │   │   └── settings/     # User settings
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── ui/               # shadcn/ui components
│   │   │   ├── ConsoleSidebar.tsx
│   │   │   └── ConsoleHeader.tsx
│   │   └── lib/
│   │       └── utils.ts
│   ├── package.json
│   └── next.config.js
├── backend/
│   ├── app/
│   │   ├── main.py               # FastAPI app
│   │   ├── translator.py         # Prompt-to-JSON
│   │   ├── fibo_client.py        # Render client
│   │   ├── tasks.py              # Batch processing
│   │   └── schemas/
│   │       └── fibo_schema.json
│   ├── requirements.txt
│   └── Dockerfile
└── docker-compose.yml
```

## FIBO Model

This project integrates [Bria FIBO](https://huggingface.co/briaai/FIBO) - the first open-source, JSON-native text-to-image model:

- **8B parameters** trained on structured JSON captions (1,000+ words)
- **Three modes**: Generate, Refine, Inspire
- **Professional control**: Lighting, camera, composition, color
- **Licensed data**: 100% commercially licensed training data
- **Disentangled**: Modify single attributes without breaking the scene

### Using FIBO

**Generate Mode** (Prompt → JSON → Image):
```bash
curl -X POST http://localhost:8000/api/v1/translate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"cinematic portrait with warm lighting"}'
```

**Render Preview**:
```bash
curl -X POST http://localhost:8000/api/v1/render-preview \
  -H "Content-Type: application/json" \
  -d '{"fibo_json":{"prompt_text":"test","camera":45,"fov":35,"lighting":"soft_rim","palette":"warm","hdr":false}}'
```

**Using Different Providers**:

Bria (FIBO):
```bash
RENDER_PROVIDER=bria
BRIA_API_KEY=your_bria_key
```

Replicate:
```bash
RENDER_PROVIDER=replicate
REPLICATE_API_TOKEN=your_replicate_token
```

FAL.ai:
```bash
RENDER_PROVIDER=fal
FAL_API_KEY=your_fal_key
```

Runware:
```bash
RENDER_PROVIDER=runware
RUNWARE_API_KEY=your_runware_key
```

The system automatically detects available API keys and selects the best provider, prioritizing Bria for FIBO-specific features.

### FIBO License

FIBO model is open source for **non-commercial use** under the [Bria FIBO License](https://bria.ai/bria-fibo-license-agreement/).
For commercial use, contact [Bria AI](https://bria.ai).

## License

MIT License - see [LICENSE](LICENSE) file for details.

**Note**: This project's code is MIT licensed, but FIBO model usage is subject to Bria's license terms.

## License

This project is **open source** and available under the [MIT License](LICENSE).

```
MIT License

Copyright (c) 2025 Fibo Orchestra Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## Contributing

We welcome contributions from the community! 🎉

This is an **open-source project** and we'd love your help to make it better:

- 🐛 **Bug Reports**: Found an issue? Open a GitHub issue
- 💡 **Feature Requests**: Have an idea? We'd love to hear it
- 🔧 **Pull Requests**: Want to contribute code? PRs are welcome
- 📖 **Documentation**: Help improve our docs
- ⭐ **Star the Project**: Show your support on GitHub

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.

## Community & Support

- **GitHub Issues**: Report bugs or request features
- **Discussions**: Join community discussions
- **Documentation**: Check our [docs page](/console/docs)

## Security

See [SECURITY.md](SECURITY.md) for security policies and how to report vulnerabilities.

## Code of Conduct

We are committed to providing a welcoming and inclusive community. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for our community guidelines.

## Project Goals & Impact

**Why This Project Matters:**

Fibo Orchestra democratizes access to professional-grade AI image generation by:

- 🎯 **Deterministic Control**: JSON-based parameters enable reproducible, professional results
- 🔓 **Open Source**: Free access to enterprise-level image generation capabilities
- 🎨 **Creative Freedom**: Fine-grained control over lighting, camera, composition without prompt engineering
- 🚀 **Multi-Provider**: Not locked into a single API - use Bria, Replicate, FAL, or Runware
- 📊 **Project Management**: Professional workflow with batch processing, history, and organization
- 🌐 **Web-First**: No local GPU required - accessible from any browser

**Technical Innovation:**

- First open-source console for FIBO's structured prompt generation
- Automatic provider detection and fallback
- Client-side key management for rapid prototyping
- RESTful API design enabling third-party integrations

## Why Open Source?

Fibo Orchestra is open source because we believe:

- 🌍 **AI tools should be accessible** to everyone
- 🤝 **Community-driven development** creates better software
- 🔓 **Transparency** builds trust and enables innovation
- 🎓 **Learning** is enhanced when code is available to study
- 🚀 **Collaboration** accelerates progress

## Acknowledgments

- **Bria AI** for the FIBO model and API
- **Open Source Community** for contributions and feedback
- **Hugging Face** for model hosting
- **Replicate**, **FAL.ai**, and **Runware** for inference infrastructure

## Citation

If you use FIBO in your work, please cite:

```bibtex
@article{gutflaish2025generating,
  title={Generating an Image From 1,000 Words: Enhancing Text-to-Image With Structured Captions},
  author={Gutflaish, Eyal and Kachlon, Eliran and Zisman, Hezi and Hacham, Tal and Sarid, Nimrod and Visheratin, Alexander and Huberman, Saar and Davidi, Gal and Bukchin, Guy and Goldberg, Kfir and others},
  journal={arXiv preprint arXiv:2511.06876},
  year={2025}
}
```
