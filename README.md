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

The production output is `dist/`. Service links preselect the enquiry service; the enquiry form validates details and prepares a mailto email. It has no server-side submission or storage. Visitors must send the prepared message from their email app.

The hard-hat wordmark is a redesign concept. The plumbing photograph is illustrative stock photography from Unsplash, not an Ironhat project: https://unsplash.com/photos/1607472586893-edb57bdc0e39 (asset source: https://images.unsplash.com/photo-1607472586893-edb57bdc0e39). Replace with approved project photography for the live business site. Fonts are loaded from Google Fonts; icons are from Lucide.
