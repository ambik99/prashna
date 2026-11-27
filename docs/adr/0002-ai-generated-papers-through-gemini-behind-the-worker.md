# AI Generated Papers through Gemini, behind the Worker

Teachers can ask Prashna for a complete sample Paper. The Worker endpoint `POST /api/generate` builds the prompt on the server from a Blueprint, calls Gemini with the maker's key (a `wrangler secret`), checks the answer against the `Paper` schema and sends the Paper back. We chose a server-held key over asking teachers for their own Gemini key, because almost no teacher has one. This matches the earlier prototype in `ambik99/CBSEqpGenerator`, except that there the key sat in the browser.

## What leaves the device

Only the generation request (Class, Subject, Focus, difficulty and a bot-check token). The current Paper and the Question Bank never leave the device. AI generation is online-only; the rest of Prashna still works offline. Gemini is used on the paid tier, never the free tier, because the free tier's terms have allowed Google to use requests to improve its products. Confirm the current terms before launch.

## Cost controls

The endpoint is free and has no accounts, so anyone could script it. It is protected by:

- Cloudflare Turnstile on every request;
- a limit of 3 Papers an hour for each IP address;
- a global daily budget of $3 (the day in India), after which teachers are told to try again tomorrow;
- a maximum of about 16k output tokens;
- the cheapest model that writes good enough Papers (Gemini 3.5 Flash-Lite, with low thinking), at about $0.03 to $0.05 a Paper when this was decided.

Both limits are counted in one Durable Object (`worker/src/limits.ts`), so every request sees the same numbers. Cloudflare's rate-limit binding was the first idea for the hourly limit, but its window is at most 60 seconds. IP addresses are stored only as hashes, and only for the hour they count. The spending is worked out from the token counts Gemini reports for each call.

When the marks do not add up to the Blueprint's total, the Worker retries once (the retry counts towards the budget). If they still do not add up, the Paper loads anyway and Target Marks shows the gap. It never fails silently.

## Considered Options

- **The teacher's own API key**: rejected, because almost no teacher has one.
- **Cloudflare Workers AI**: rejected, because the Papers it writes are noticeably worse.
- **Claude or OpenAI**: Gemini was the maker's choice, and it is the cheapest for this job. The Gemini call is kept in one small module so the provider can be changed.
