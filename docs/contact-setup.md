# Contact form setup

The public mailbox is hello@thepacificedge.ca. Chris confirmed that it is operational on 18 October 2026. The website implementation uses a Cloudflare Worker at /api/contact, native email sending, Turnstile and a rate-limiting binding. Both the public form and Worker delivery are disabled until hosted acceptance is complete.

## What is implemented

- Four visitor fields: name, email, optional organization and message, with matching browser and server length limits.
- Same-origin POST handling, a bounded request body, duplicate-field rejection and a hidden spam field.
- Server-side Turnstile verification that checks success, the configured hostname and the contact action.
- A per-IP rate-limiting binding set to five attempts per minute. Namespace 1001 must be checked for uniqueness within the Cloudflare account before deployment.
- A fixed recipient and sender of hello@thepacificedge.ca. Visitor data supplies only the Reply-To address and plain-text message content. The handler is not an email relay.
- Confirmation only after the email service returns a message ID. Errors do not report success, retry automatically or clear the visitor's message.
- A direct email option and an enquiry privacy page. Review builds never enable submission or load the Turnstile widget, even if live configuration values are present.

The handler does not create an enquiry database, write submitted content to application logs or send automatic acknowledgement emails to visitors.

## Cloudflare account configuration

1. Confirm that Email Sending is available on the account and onboard thepacificedge.ca as a sending domain. Follow the sending-domain DNS instructions and preserve the existing provider's incoming-mail configuration. A working mailbox alone does not verify the sending domain.
2. Verify hello@thepacificedge.ca as the destination address and retain the CONTACT_EMAIL binding's destination restriction. Confirm that the binding supports the structured send API used in worker/index.js.
3. Create a managed Turnstile widget for the intended hostname. The public sitekey goes into PUBLIC_TURNSTILE_SITE_KEY at build time. Store the private secret using `wrangler secret put TURNSTILE_SECRET_KEY`; never put it in PUBLIC_ variables or source control.
4. Confirm the rate-limit namespace is unused by unrelated Workers, or select a different positive integer namespace in wrangler.jsonc.
5. Keep SITE_ORIGIN aligned with the actual site origin. The production value is https://thepacificedge.ca. Redirect other hostnames to that canonical origin. A private staging site needs its own origin and permitted Turnstile hostname.
6. Review the enquiry privacy wording against the actual Cloudflare and mailbox setup.

The implementation follows these primary references:

- https://developers.cloudflare.com/workers/static-assets/routing/worker-script/
- https://developers.cloudflare.com/email-service/api/send-emails/workers-api/
- https://developers.cloudflare.com/email-service/configuration/send-bindings/
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/

## Build and runtime switches

PUBLIC_CONTACT_ENABLED and PUBLIC_TURNSTILE_SITE_KEY control the static form at build time. CONTACT_FORM_ENABLED in wrangler.jsonc controls the Worker. Both switches must be true for live operation. Each defaults to false; review mode overrides the public switch and leaves the form disabled.

The confirmed public address has a source default and can also be set with PUBLIC_CONTACT_EMAIL. This implementation delivers only to hello@thepacificedge.ca; change both the public configuration and the fixed Worker destination if the address changes in future.

wrangler.jsonc now includes worker/index.js as the entry point, ASSETS as the static binding, selective Worker routing for /api/contact, CONTACT_EMAIL for email and CONTACT_LIMITER for rate limiting. The project needs a current Wrangler version supporting these documented bindings when preparing a deployment. Local unit tests do not install Wrangler or contact Cloudflare.

## Local checks

Run `npm run test:contact` to test the handler with simulated verification, rate limiting and email delivery. These tests send no emails and make no network calls.

Run Astro check and build with ASTRO_TELEMETRY_DISABLED=1. Verify production output with `node scripts/check-output.mjs` and review output with `node scripts/check-output.mjs --review`.

Browser verification of the enabled form uses synthetic input and intercepted Turnstile and submission responses. It checks confirmation, preserved input on failure, duplicate-click prevention and the absence of automatic retries. This is separate from hosted acceptance.

## Hosted acceptance before activation

Use an approved private staging deployment with a real Turnstile key and secret and the account's verified email binding. Enable both form switches for that deployment. A live delivery test must be explicitly authorized before sending an email.

Confirm that one real submission produces one notification in hello@, that Reply-To addresses the visitor correctly, and that success appears only after acceptance by the email service. Check spam filtering and reply behavior in the mailbox. Also check invalid verification, expired tokens, rate limiting and an unavailable email binding. Failure must retain the entered message and provide a direct email option.

After acceptance, update the production switches, build with review disabled and run release:check with CONTACT_DELIVERY_VERIFIED=true and SITE_CONTENT_APPROVED=true. These are explicit acceptance records, not automatic evidence that delivery works. Review the final build before publication.

No Cloudflare resources, DNS records, secrets or mailbox settings have been changed by this implementation. Live sending and deployment remain pending.

## Protected website review on Cloudflare

The initial hosted build used main and successfully deployed the earlier website foundation. The current Coastal Editorial design remains on feature/coastal-editorial-site. Keep main as the production branch; use a branch Preview for this design until publication is approved.

In the Worker's Access settings, protect All traffic and restrict authentication to the Cloudflare account. Chris observed the Cloudflare sign-in prompt at the main workers.dev address on 18 October 2026. Repeat the unauthenticated check on the new Preview URL; a main-URL check alone does not verify every Preview URL.

In Settings > Build > Builds for Preview branches, enable Preview URLs. Keep the root at / and the build command at npm run build. Set the Preview command to `npx --yes wrangler@4.151.1 preview`; this version was used by the initial Cloudflare deployment and supports Worker Previews. Add these build variables to the Preview build configuration, separately from production:

| Name | Value |
| --- | --- |
| SITE_REVIEW | true |
| PUBLIC_CONTACT_ENABLED | false |
| ASTRO_TELEMETRY_DISABLED | 1 |

The explicit previews block in wrangler.jsonc keeps CONTACT_FORM_ENABLED false. Preview variables and resource bindings do not inherit production settings; assets stay at the top level. No email or rate-limit binding is configured for this website-only Preview, and no Turnstile secret is required. The contact handler fails closed without live configuration.

After saving the build settings, build feature/coastal-editorial-site and verify that the build reports that branch and the expected commit, runs the Preview command, and emits the Coastal Editorial routes including advisory, ai, first-nations and privacy. Open the returned Preview URL in a fresh private browser session to verify the login gate, then sign in and inspect the site. Contact fields must remain disabled with the review explanation visible. Do not connect the public domain or activate email delivery as part of this review.

The previews configuration follows https://developers.cloudflare.com/workers/previews/configuration/ and https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/ . Hosted acceptance remains required; local Astro and output checks do not validate Cloudflare provisioning or Access policy enforcement.
