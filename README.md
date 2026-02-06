<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app
This repository contains a small React + Vite app (AI Studio integration) for
managing smart queues.

View the deployed app in AI Studio: https://ai.studio/apps/drive/1jqQ_DOREfAXl5AiJo94PdGdeR9Q2QnY6

## Quick Start

**Prerequisites:** Node.js (16+ recommended) and `npm` or `pnpm`.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create an environment file with your Gemini API key:

   ```text
   # .env.local
   GEMINI_API_KEY=your_api_key_here
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open the app in your browser at `http://localhost:3000` (Vite default).

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — build production assets
- `npm run preview` — preview the production build locally

## Notes

- The project uses the Gemini API; keep your API key secret and do not commit it.
- Add additional environment variables in `.env.local` as needed.

## License

This repository is licensed under the MIT License — see the `LICENSE` file for details.
