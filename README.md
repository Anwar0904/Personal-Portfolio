# ADM Platform

ADM Platform is a modern full-stack web application built with Next.js, TypeScript, and MongoDB for managing content-driven experiences and administrative workflows. It is designed as a scalable foundation for a digital brand, agency, or service platform with both public-facing pages and a structured admin-ready backend.

## Overview

This project combines a polished front end with a flexible content model, making it suitable for:

- marketing and service websites
- portfolio and case-study showcases
- blog and content publishing
- media and testimonial management
- role-based content administration

## Key Features

- Modern Next.js app router architecture
- TypeScript-first development experience
- MongoDB integration with Mongoose models
- Structured content models for blogs, portfolios, services, media, tags, and testimonials
- Environment-based configuration for database connectivity
- Reusable utilities, interfaces, validators, and services
- Organized documentation under the docs folder

## Tech Stack

- Framework: Next.js 16
- UI: React 19
- Language: TypeScript
- Styling: Tailwind CSS
- Database: MongoDB with Mongoose
- Tooling: ESLint, PostCSS

## Project Structure

```text
src/
  app/                # App router pages and API routes
  components/         # Reusable UI components
  config/             # Environment and app configuration
  constants/          # Shared constants and enums
  interfaces/         # TypeScript interfaces
  lib/                # Database and utility helpers
  models/             # Mongoose schemas and models
  repositories/       # Data access layer
  schemas/            # Structured schema definitions
  services/           # Business logic services
  types/              # Shared type definitions
  validators/         # Input validation logic
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a local environment file and provide your MongoDB connection string:

```bash
MONGODB_URL=your_mongodb_connection_string
NODE_ENV=development
```

For production deployments on Vercel, create a Vercel Blob store and add its
read/write token to the project environment variables:

```bash
BLOB_READ_WRITE_TOKEN=your_vercel_blob_read_write_token
```

Production media files are stored in Vercel Blob. Local development continues
to use `public/uploads/media`.

### 3. Run the development server

```bash
npm run dev
```

Open http://localhost:3000 to view the application.

## Available Scripts

```bash
npm run dev      # Start the development server
npm run build    # Create a production build
npm run start    # Run the production build locally
npm run lint     # Run ESLint checks
```

## Documentation

The repository includes structured documentation in the docs folder, covering:

- database design
- schema definitions
- content and collection planning

## Development Notes

The project is organized around a modular architecture that separates concerns across models, services, types, and UI layers. This makes it easier to extend the platform with new features, content types, and admin capabilities.

## Next Steps

Potential areas to expand include:

- authentication and authorization
- admin dashboard workflows
- media upload handling
- SEO and analytics integrations
- deployment pipelines for production environments

## Contributing

Contributions are welcome. If you are improving the platform, consider keeping the code modular, documenting new features clearly, and aligning changes with the existing architecture.
