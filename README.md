# Ironhat Plumbing redesign

React 19, Tailwind CSS 4 and Vite. Responsive single-page redesign based on the services and business details at https://ironhatplumbing.com.au/.

## Development

```sh
npm install
npm run dev
```

## Production

```sh
npm run build
npm run preview
```

The production output is `dist/`. Service links preselect the enquiry service. The mobile contact bar, three-step process and entrance animations are active. Animations respect reduced-motion preferences.

## Approved photos, reviews and credentials

Edit `src/site-content.js` to populate real content. Put approved photos in `public/projects/` and use relative paths such as `projects/before.jpg`. Before/after comparisons include a keyboard-accessible slider. Add Sam's approved portrait through `samPhoto`.

Empty gallery, testimonial and licence/insurance slots are clearly labelled drafts in the development preview. Unpopulated sections are hidden in production; no reviews, ratings, licence details or insurance claims are fabricated. The registered-business detail uses the ABN on the original website.

## Direct enquiry delivery

Create and activate a Formspree-compatible HTTPS endpoint accepting form-data POST requests with JSON responses. Verify its recipient email and allowed origins with the provider. Copy `.env.example` to `.env.local`, set `VITE_FORM_ENDPOINT`, and restart Vite. For GitHub Pages, set the same public endpoint in the repository's Actions variable `VITE_FORM_ENDPOINT`, then rebuild/deploy. Endpoint URLs are public; never use a private API key here.

With an endpoint configured, the form sends directly and handles loading, timeouts and errors without clearing details on failure. With no endpoint, it prepares a mailto email and explicitly tells visitors to send it in their email app. Email delivery has not been verified until a real endpoint is connected and tested. The site does not store enquiries itself.

The hard-hat wordmark is a redesign concept. The plumbing photograph is illustrative stock photography from Unsplash, not an Ironhat project (asset source: https://images.unsplash.com/photo-1607472586893-edb57bdc0e39). Replace with approved project photography for the live business site. Fonts are loaded from Google Fonts; icons are from Lucide.
