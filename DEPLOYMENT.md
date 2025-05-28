# Vercel deployment instructions for CSUForum

1. Make sure your backend is deployed (e.g., on Render, Railway, or as Vercel serverless functions). If you want to use Vercel for both frontend and backend, you must move your backend code to `/api` in the root or set up a monorepo.
2. All static images for communities are now in `frontend/public/community/` and referenced as `/community/<filename>`.
3. The frontend is ready for Vercel static hosting. Push your code to GitHub and import the repo in Vercel.
4. Set the frontend build command to `npm run build` and output directory to `frontend/dist` in Vercel settings.
5. Set environment variables in Vercel dashboard to match your `.env` files (e.g., `VITE_API_BASE_URL`).
6. If you want to proxy API requests in development, use Vite's `proxy` option in `vite.config.js`.
7. If you want to use Vercel's rewrites, see `vercel.json` in the root.

For more details, see Vercel docs: https://vercel.com/docs/deployments/overview
