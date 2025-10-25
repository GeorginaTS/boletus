
# Unit Testing with Vitest

This project uses **Vitest** for unit testing React components and pages. All main components have minimal tests to ensure they render without crashing and that required props and context are provided.

## Installation & Setup
- Install Vitest and its UI (if not already):
  ```sh
  npm install -D vitest
  ```
- Add this script to your `package.json`:
  ```json
  "test.unit": "vitest --ui"
  ```

---
- To open the Vitest UI in your browser:
---

## Useful Scripts
- `npm run test.unit` — Opens Vitest UI for unit tests
- `npm run lint` — Runs ESLint for code quality

## References
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/)

---


**Cypress** is used for end-to-end (E2E) testing to simulate user interactions and verify that the app works as expected. Only a few sample tests are included.

