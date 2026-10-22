# Contact form setup

## Current production acceptance — 22 October 2026

PR #5 was merged as d76584f and its Cloudflare production build succeeded. Chris attached thepacificedge.ca as a Production custom domain after removing only the two conflicting apex A records, retaining the existing mail records. The apex custom domain is also declared in wrangler.jsonc so future deployments retain it.

The first production form attempt returned unavailable. The subsequent diagnostic release, 40a8d2e, deployed successfully and GET /api/contact reported PE03: the Worker could not see TURNSTILE_SECRET_KEY. Chris confirmed that the existing value was a build secret, then added it under Production Runtime variables and secrets. After the deployment step, he explicitly confirmed the configuration check, production email receipt and Reply-To checks: "All confirmed - we're good". Production delivery is accepted on that user-reported basis. No agent submission or independent browser/mailbox inspection was performed, and the private secret was never received or recorded.

Remaining domain task: configure and verify the Cloudflare www.thepacificedge.ca-to-thepacificedge.ca redirect, preserving paths and query strings. The existing proxied www CNAME can remain. This zone rule is outside Wrangler source.

## Historical setup notes

The chronological notes below preserve earlier preparation states. Statements about pending publication or production acceptance are superseded by the current acceptance record above.

The public mailbox is hello@thepacificedge.ca. Chris confirmed that it is operational on 18 October 2026. The website implementation uses a Cloudflare Worker at /api/contact, native email sending, Turnstile and a rate-limiting binding. On 22 October, Chris reported a successful protected Preview submission and explicitly confirmed receipt at hello@ and that Reply targets the entered visitor address. Production source activation is prepared; the production runtime secret, merge, domain connection and public acceptance remain pending.

On 22 October, Chris verified hello@thepacificedge.ca as a Cloudflare destination and subsequently confirmed access to paid Email Sending. Apex sending-domain onboarding proposed changing the existing DMARC policy, so the selected sending domain is forms.thepacificedge.ca. Chris's revised DNS review lists MX and SPF at cf-bounce.forms.thepacificedge.ca, DKIM at cf-bounce._domainkey.forms.thepacificedge.ca and DMARC at _dmarc.forms.thepacificedge.ca. His subsequent dashboard capture reports Sending status Enabled and DNS records Configured. Independent DNS reads confirm the subdomain bounce MX and DMARC records, while the apex Google Workspace MX and original quarantine DMARC policy remain unchanged. The local Worker now sends from website@forms.thepacificedge.ca to hello@thepacificedge.ca; all 18 simulated contact-handler tests pass. The protected Preview delivery and Reply-To checks were subsequently accepted by Chris; production setup remains pending.

## What is implemented

- Four visitor fields: name, email, optional organization and message, with matching browser and server length limits.
- Same-origin POST handling, a bounded request body, duplicate-field rejection and a hidden spam field.
- Server-side Turnstile verification that checks success, the configured hostname and the contact action.
- A per-IP rate-limiting binding set to five attempts per minute. Namespace 1001 must be checked for uniqueness within the Cloudflare account before deployment.
- A fixed recipient of hello@thepacificedge.ca and sender of website@forms.thepacificedge.ca. Visitor data supplies only the Reply-To address and plain-text message content. The handler is not an email relay.
- Confirmation only after the email service returns a message ID. Errors do not report success, retry automatically or clear the visitor's message.
- A direct email option and an enquiry privacy page. Ordinary review builds never enable submission or load the Turnstile widget, even if live configuration values are present. The dedicated protected contact-test build is an explicit exception.

The handler does not create an enquiry database, write submitted content to application logs or send automatic acknowledgement emails to visitors.

## Cloudflare account configuration

1. Onboard forms.thepacificedge.ca in Email Sending, using the forms subdomain under the thepacificedge.ca zone. Follow the sending-domain DNS instructions and preserve the apex Google Workspace MX and existing DMARC records. Confirm that the sending domain is verified; a working destination mailbox alone does not verify it.
2. Verify hello@thepacificedge.ca as the destination address and retain the CONTACT_EMAIL binding's destination restriction. Confirm that the binding supports the structured send API used in worker/index.js.
3. Create a managed Turnstile widget for the intended hostname. The public sitekey goes into PUBLIC_TURNSTILE_SITE_KEY at build time. Store the private secret under the production Worker's Runtime variables and secrets, then deploy, or use `wrangler secret put TURNSTILE_SECRET_KEY`. A build secret alone does not configure the production runtime. Never put it in PUBLIC_ variables or source control.
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

Chris supplied the public Turnstile sitekey 0x4AAAAAAFhZOFMZaIq7bLvM on 22 October. It is the source default and is shown in .env.example; PUBLIC_TURNSTILE_SITE_KEY can override it. His subsequent capture shows an encrypted TURNSTILE_SECRET_KEY below the existing feature Preview's build settings; that does not establish a runtime secret. The earlier interpretation of this capture as runtime-secret confirmation was premature. Its value has not been exposed. The production secret still needs separate runtime configuration. Changing Previews Base alone does not update an existing Preview. The widget's allowed hostnames have not been independently confirmed. Production activation switches are now prepared in source; the production runtime secret and main deployment remain pending.

PUBLIC_CONTACT_ENABLED and PUBLIC_TURNSTILE_SITE_KEY control the static form at build time. CONTACT_FORM_ENABLED in wrangler.jsonc controls the Worker. Both switches must be true for live operation. Following Chris's confirmed acceptance, npm run build now explicitly disables review/test modes, enables the static form and checks production output. The production Worker switch is true in source. Ordinary build:review forces submission off, and default previews runtime configuration remains disabled. Use build:contact-test and its separate deploy configuration only for protected acceptance.

The confirmed public address has a source default and can also be set with PUBLIC_CONTACT_EMAIL. This implementation delivers only to hello@thepacificedge.ca; change both the public configuration and the fixed Worker destination if the address changes in future.

wrangler.jsonc now includes worker/index.js as the entry point, ASSETS as the static binding, selective Worker routing for /api/contact, CONTACT_EMAIL for email and CONTACT_LIMITER for rate limiting. The project needs a current Wrangler version supporting these documented bindings when preparing a deployment. Local unit tests do not install Wrangler or contact Cloudflare.

## Local checks

Run `npm run test:contact` to test the handler with simulated verification, rate limiting and email delivery. These tests send no emails and make no network calls.

Run Astro check and build with ASTRO_TELEMETRY_DISABLED=1. Verify production output with `node scripts/check-output.mjs` and review output with `node scripts/check-output.mjs --review`.

Browser verification of the enabled form uses synthetic input and intercepted Turnstile and submission responses. It checks confirmation, preserved input on failure, duplicate-click prevention and the absence of automatic retries. This is separate from hosted acceptance.

## Hosted acceptance before activation

Use an approved private staging deployment with a real Turnstile key and secret and the account's verified email binding. Enable both form switches for that deployment. A live delivery test must be explicitly authorized before sending an email.

For the existing feature Preview, set its build command to `npm run build:contact-test` and Preview command to `npm run deploy:contact-test`. The deploy script reads TURNSTILE_SECRET_KEY from the build environment and puts it into the exact existing Preview's runtime secrets using Wrangler's documented preview secret put command, then deploys with wrangler.contact-test.jsonc. It passes the private value through stdin, captures secret-upload output without printing it and stops before deployment if upload fails. It never stores the secret in source or generated files. First verify in a signed-out/private browser that its stable URL requires Cloudflare authentication; retain Access protection for all traffic during acceptance. The dedicated build keeps review content, the review banner and noindex metadata, but enables the form and displays a real-notification test notice. Ordinary `build:review` forces the test flag false and keeps submission disabled, including when inherited environment values request otherwise. The standalone test Wrangler configuration supplies the exact stable Preview origin, restricted email destination and separate rate-limit namespace 248796301; do not reuse that namespace for unrelated Workers. It contains no production email binding or enabled production form. Use this config with `wrangler preview` only. The default Wrangler configuration remains unchanged and disabled.

After the test build succeeds, Chris can submit one clearly labelled synthetic enquiry from the protected stable Preview contact page. A unique deployment URL has a different origin and is intentionally rejected by this configuration. Record receipt, Reply-To and the browser result before treating delivery as verified. Chris has now confirmed a received test notification and correct Reply-To behavior. Return to `npm run build:review` and the normal Preview command after acceptance unless continued protected form testing is needed.

The c56000f rebuild completed successfully at 14:00:59 Vancouver on 22 October. Chris's first hosted attempt returned the fixed temporarily-unavailable message and no email was observed. In this handler that response occurs before the email-send call; multiple configuration, rate-limit or verification-service branches can produce it. The ee4c8f8 correction explicitly provisions the runtime secret from the Cloudflare build secret. Chris subsequently reported that the test worked and explicitly confirmed mailbox receipt and the Reply-To target. This is user-reported hosted acceptance; the agent did not operate the browser, inspect the mailbox or send an email. The missing-runtime-secret diagnosis is supported by the successful correction, without a separate capture of the original runtime bindings.

Confirm that one real submission produces one notification in hello@, that Reply-To addresses the visitor correctly, and that success appears only after acceptance by the email service. Check spam filtering and reply behavior in the mailbox. Also check invalid verification, expired tokens, rate limiting and an unavailable email binding. Failure must retain the entered message and provide a direct email option.

Production preparation uses the accepted content and delivery confirmations to run release:check with CONTACT_DELIVERY_VERIFIED=true and SITE_CONTENT_APPROVED=true. These are explicit acceptance records, not automatic evidence that production delivery works. The production build verifies the enabled form, real widget sitekey, publication statuses and absence of review/test notices. Before merging, Chris must add TURNSTILE_SECRET_KEY to the production Worker's runtime Settings > Variables and Secrets (Production), outside Builds, using the same private key. Keep Access on All traffic until the main deployment and custom domain are configured; then change it to Previews only for public launch. Confirm the actual public-domain form and signed-out access after launch.

Chris configured Cloudflare sending DNS and the verified destination; the Preview deploy script provisions the runtime secret through his Cloudflare build environment. No private credential has been received by the agent or committed. Production delivery, domain connection and public launch remain pending.

## Protected website review on Cloudflare

The initial hosted build used main and successfully deployed the earlier website foundation. The current Coastal Editorial design remains on feature/coastal-editorial-site. Keep main as the production branch; use a branch Preview for this design until publication is approved.

In the Worker's Access settings, protect All traffic and restrict authentication to the Cloudflare account. Chris observed the Cloudflare sign-in prompt at the main workers.dev address on 18 October 2026. Repeat the unauthenticated check on the new Preview URL; a main-URL check alone does not verify every Preview URL.

In Settings > Build > Builds for Preview branches, enable Preview URLs. Keep the root at / and set the Preview build command to `npm run build:review`. Keep the production build command at `npm run build`. Set the Preview command to `npx --yes wrangler@4.151.1 preview`; this version was used by the initial Cloudflare deployment and supports Worker Previews. These build variables may remain in the Preview build configuration, separately from production; build:review explicitly sets them so review output does not depend on the dashboard flag being available:

| Name | Value |
| --- | --- |
| SITE_REVIEW | true |
| PUBLIC_CONTACT_ENABLED | false |
| ASTRO_TELEMETRY_DISABLED | 1 |

The explicit previews block in wrangler.jsonc keeps CONTACT_FORM_ENABLED false. Preview variables and resource bindings do not inherit production settings; assets stay at the top level. No email or rate-limit binding is configured for this website-only Preview, and no Turnstile secret is required. The contact handler fails closed without live configuration.

A hosted retry at 18:22 Vancouver time on 18 October still emitted production-mode content while using the correct feature branch and Preview deploy command. The log does not expose the effective SITE_REVIEW build value, so the exact dashboard-variable cause is unconfirmed. The explicit build:review command supplies the flags to both Astro child processes, then runs output checks that require the review banner, noindex metadata, review-only case routes and disabled contact controls. A missing review mode now fails the build before the Preview deploy command can run. The script adds no dependencies and disables Astro telemetry for its child processes.

Local validation of build:review started with conflicting SITE_REVIEW=false and PUBLIC_CONTACT_ENABLED=true values. Astro check reported zero diagnostics across 37 files; the forced review build passed 19 HTML-file and 585 local-reference checks, including the new banner and contact assertions. A separate production build passed the existing production publication checks. These local results do not establish the outcome of the next hosted build.

After saving the build settings, build feature/coastal-editorial-site and verify that the build reports that branch and the expected commit, runs the Preview command, and emits the Coastal Editorial routes including advisory, ai, first-nations and privacy. Open the returned Preview URL in a fresh private browser session to verify the login gate, then sign in and inspect the site. Contact fields must remain disabled with the review explanation visible. Do not connect the public domain or activate email delivery as part of this review.

The previews configuration follows https://developers.cloudflare.com/workers/previews/configuration/ and https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/ . Hosted acceptance remains required; local Astro and output checks do not validate Cloudflare provisioning or Access policy enforcement.

## Production unavailable-message diagnosis

GET /api/contact remains a 405 response with Allow: POST. It now reports either a fixed configuration reference or that the basic configuration checks passed. It reads no submitted values and makes no connector, verification or email calls. Passing this check establishes presence of required configuration and methods only; it does not prove credentials are valid, rate limiting works, Turnstile validates or email is delivered.

| Reference | Meaning |
| --- | --- |
| PE01 | SITE_ORIGIN is missing or invalid |
| PE02 | Runtime CONTACT_FORM_ENABLED is not true |
| PE03 | Runtime TURNSTILE_SECRET_KEY is absent |
| PE04 | CONTACT_EMAIL send method is absent |
| PE05 | CONTACT_LIMITER limit method is absent |
| PE06 | Request lacks CF-Connecting-IP |
| PE07 | Rate-limit service call failed |
| PE08 | Turnstile verification service returned a non-success HTTP response |
| PE09 | Verification request or response parsing failed |

Unavailable POST responses include these fixed references. No secret value, visitor input, IP address, token or raw provider error is returned or logged. The original production cause has not yet been identified; do not infer it solely from the successful preview-secret repair. Chris's widget success display does not independently establish server-side verification. No retry has been requested while the diagnostic deployment is prepared.
