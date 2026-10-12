# Supabase presentation storage

Presentations upload as binary directly from the browser to Supabase Storage. The topic stores only the returned public URL. Maximum size: 25 MiB (26,214,400 bytes). No Base64 or local Vercel disk fallback is used for new presentation uploads.

Deployment requirements:
- Use the correct active project's HTTPS VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or existing supported publishable-key variable). Rebuild after changing VITE_ variables.
- Create a public bucket named presentations, with a file-size limit of at least 26,214,400 bytes and PPTX/PDF MIME types allowed. Public read is needed by the existing presentation viewer and is not permission to upload.
- INSERT on storage.objects must be limited to authorized administrators by your project's RLS policy. Do not grant anonymous public writes just to fix uploads.
- This app currently signs users in with Firebase. A Firebase login is not a Supabase session. The upload uses a Supabase session when present, otherwise the configured public API key; Storage RLS still applies. If there is no configured identity bridge/session with an appropriate admin policy, configure that integration or an authenticated server-issued signed upload URL before deployment.
- Never put a service-role key in VITE_ variables.

The earlier screenshot showed ERR_NAME_NOT_RESOLVED for the configured Supabase host. Check the exact project URL and active project status. Changing upload code cannot repair an unavailable/incorrect project hostname.

Local checks cover limits, direct binary transfer, short metadata URLs, and error paths with a mocked network. Live bucket, RLS and production upload have not been tested; console access is not available here.
