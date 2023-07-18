# Find a Pet API

This API was designed to connect pet-seeking individuals with responsible pet adoption organisations. It allows organisations to register and authenticate using JWT. Authenticated organisations can add pets for adoption to the platform, visualize their profile, manage their pets, and perform account-related operations. Pet seekers can search for pets using filters and view paginated results with the ability to sort and access detailed pet information, including the contact details of the respective organisation.

The API follows the TDD approach, employs Factory and Repository design patterns, and includes both end-to-end and unit tests to ensure reliability and correctness.

## Database Schema:
The API uses Prisma as the ORM to interact with the database.

## Technologies

- Node.js
- TypeScript
- Prisma
- Fastify
- Docker
- Vitest
