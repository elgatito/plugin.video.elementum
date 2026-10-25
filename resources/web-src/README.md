# Elementum Web UI

React + TypeScript app served by the Elementum daemon at `/web/`. Built with [Vite](https://vite.dev), requires Node.js 24 (see `.nvmrc`).

- `npm ci`: install dependencies.
- `npm run dev`: dev server at http://localhost:5173/web/, API requests are proxied to the daemon at `127.0.0.1:65220`.
- `npm run lint`: type check, ESLint and Prettier check.
- `npm run format`: apply Prettier formatting.
- `npm run build`: build into `../web/`.

UI texts are translated with add-on's `resources/language/*/strings.po`, the same files Kodi uses.
To add a text, add it to `messages.pot` and every `strings.po` with a new ID, then map the ID to a key in `src/i18n/strings.ts` and use `t('key')`.
The build embeds only these IDs, and fails if one is missing in English `strings.po`.

The build output in `resources/web/` is committed, because the add-on ships it as is.
Always run `npm run build` and commit `resources/web/` together with source changes: CI rebuilds it and fails if it differs.
