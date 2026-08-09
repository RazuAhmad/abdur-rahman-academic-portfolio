# Md. Abdur Rahman — Academic Portfolio

A responsive academic and creative portfolio presenting work across law, technology, EU compliance, digital governance, photography, and videography.

## Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Contact form delivery

Copy `.env.example` to `.env.local`, add a Resend API key, and set `CONTACT_FROM_EMAIL` to an address on a verified sending domain. `CONTACT_TO_EMAIL` controls where messages from the floating contact form are delivered. Without these values, the form presents a direct email-app fallback instead of losing the visitor's message.

## Content updates

- Edit structured showcase, photography, and videography data in `src/data/portfolio.ts`.
- Add photograph paths to the `photographs` collection; portrait, landscape, square, and panoramic ratios are supported.
- Add YouTube or Vimeo IDs and thumbnails to the `videoProjects` collection.
- Replace `public/abdur-rahman-photo.jpeg` when an updated portrait is available.
