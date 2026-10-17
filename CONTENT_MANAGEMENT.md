# Content management

THE VACHAS is a static website. One designated editor maintains its public information in TypeScript data files and publishes approved changes through the project repository. Visitors do not need to log in. There is no member authentication, upload service, database, or in-browser editor.

## Before publishing

- Use only verified information and media approved for public use.
- The current workspace had no inherited website, photographs, posters, team roster, publication files, or social URLs. Empty arrays are intentional, not missing page features.
- `src/data/site.ts` and the wing descriptions contain starter copy based on the project brief. Verify and edit it before treating it as official.
- Never put private contact details, credentials, student records, or copyrighted material without permission in this public repository.

## Where content lives

| Content | Data file |
| --- | --- |
| Home-page headline, introduction, closing thought, mission, vision, activities, location | `src/data/site.ts` |
| Wings and wing descriptions | `src/data/wings.ts` |
| Photos shown on each wing detail page | `src/data/wings.ts` |
| Team members | `src/data/team.ts` |
| Events | `src/data/events.ts` |
| Books and other publications | `src/data/publications.ts` |
| Blog links and blog-card images | `src/data/blogs.ts` |
| Gallery images | `src/data/gallery.ts` |
| Achievements | `src/data/achievements.ts` |
| Recruitment status and application form | `src/data/recruitment.ts` |
| Contact email and social links | `src/data/socialLinks.ts` |
| Shared record types | `src/data/types.ts` |

Images and documents can be stored in `public/assets/` or linked from an approved, publicly accessible host. For files in this repository, reference them with a root-relative path such as `/assets/events/reading-day-poster.jpg`. Remote image URLs must use `https://` and remain publicly accessible. Use descriptive, lowercase filenames for local files.
The club logo is `public/vachas-logo.png`; the same supplied emblem is used in the header, footer, quote section, and favicon. Keep the original logo artwork intact when replacing this asset.

## Add, update, or remove content and links

Content is controlled by the arrays in `src/data/`. To publish an item, add its record to the relevant array. To update a URL or image, edit that record's field. To unpublish it, remove that record from the array (or remove just the relevant optional field). Save and preview locally, then run the production build and publish the repository changes.

The site accepts either local static file paths or public remote URLs for image fields:

```ts
image: '/assets/events/poetry-evening.jpg'
// or
image: 'https://images.example.org/approved/poetry-evening.jpg'
```

The same applies to publication `cover`, `pdf`, and `readingUrl`, blog `url` and `image`, and other URL fields. Remote storage providers may impose their own availability, bandwidth, and sharing-permission rules.
Remote article/file/image URLs should use `https://`; same-site static files should use root-relative paths such as `/assets/...`. The UI ignores unsafe or malformed external links and shows a fallback instead of a broken image if an image cannot load. A fallback can prevent a page error, but it cannot restore a file that has been removed by its external host. For dependable long-term availability, keep approved images and PDFs in this repository or use a stable file host with public links.

## Add or remove a hosted blog link

Add a record to the `blogs` array in `src/data/blogs.ts`. Each blog card opens its `url` in a new tab. Set `image` and `imageAlt` for an optional thumbnail, using a local image path or a public `https://` image URL.

```ts
import type { BlogPost } from './types'

export const blogs: BlogPost[] = [
  {
    slug: 'voices-of-a-language',
    title: 'Voices of a Language',
    excerpt: 'A short introduction to the hosted article.',
    category: 'Reflection',
    date: '2026-08-20',
    author: 'VACHAS Editorial Team',
    url: 'https://blog.example.org/voices-of-a-language',
    image: 'https://images.example.org/vachas/voices-cover.jpg',
    imageAlt: 'The approved cover image for Voices of a Language',
  },
]
```

Use the real article URL and image address; the example domains above are illustrative and must be replaced. To update a blog destination, edit `url`. To remove its thumbnail, remove `image` and `imageAlt`. To unpublish a blog, remove its object from the `blogs` array. The Blogs page remains available with an empty state; the homepage journal section appears only when blog entries exist.

## Add a publication cover or hosted PDF link

Add a record to `src/data/publications.ts`. Use either a locally stored file or a hosted public URL:

```ts
{
  slug: 'confirmed-title',
  title: 'Confirmed title',
  description: 'A verified description.',
  language: 'English',
  type: 'Anthology',
  year: 2026,
  cover: 'https://images.example.org/vachas/confirmed-cover.jpg',
  readingUrl: 'https://files.example.org/confirmed-publication.pdf',
  featured: true,
}
```

`readingUrl` displays a Read Online action. Use `pdf` instead when linking directly to an authorized PDF file; it displays Download PDF. Remove either field to remove that action. Remove the publication object from the array to unpublish the title. Only link files the club is permitted to distribute.

## Add or remove gallery pictures by URL

Add a `GalleryImage` record in `src/data/gallery.ts`. Its `image` can be a local path or a public remote image address:

```ts
{
  image: 'https://images.example.org/vachas/workshop-01.jpg',
  caption: 'A moment from the workshop',
  event: 'Confirmed workshop',
  date: '2026-08-20',
  category: 'Workshop',
  alt: 'Students taking part in a writing workshop',
}
```

Change `image` to replace the picture or remove that record from the `gallery` array to take it off the site. Keep its caption and alt text accurate. For an image attached to an event, add the URL to the event's `photos` array in `src/data/events.ts`.

The currently configured gallery photos are stored in `public/assets/gallery/`. To add more:

1. Copy an approved picture into `public/assets/gallery/` (create the folder if it does not exist).
2. Add a new object to the `gallery` array in `src/data/gallery.ts`, using its `/assets/gallery/filename.jpg` path.
3. Add a clear caption, category, and accurate alt text. Add the event and date only if confirmed.
4. Save and preview `/gallery`. Remove a picture by deleting its record from the array; delete its asset file too if no other page uses it.
5. Run `npm run build`, then publish your repository changes.

The gallery page has a category filter and a keyboard-dismissable lightbox with previous/next navigation. Image files are copied into the project, so their availability does not depend on the original attachment path or an external host.

## Add photos to a wing page

Wing-specific photos are stored under `public/assets/wings/` and attached to the matching wing record in `src/data/wings.ts`. The Telugu Wing currently has two photos and the English Wing has one. Their gallery appears on the wing's detail page (`/wings/telugu` or `/wings/english`), not as separate cards in the general gallery.

To add a photo:

1. Copy the approved image into `public/assets/wings/`.
2. Add a `photos` entry to the correct wing in `src/data/wings.ts`:

```ts
photos: [
  {
    image: '/assets/wings/my-wing-photo.jpg',
    caption: 'A short, accurate caption',
    alt: 'A clear description of the photo for screen readers',
  },
],
```

Append additional objects inside that wing's existing `photos` array; do not replace the existing array unless you intend to remove those images. To remove just one photo, delete only its object from the array. The detail page shows the photo grid and an accessible lightbox; no page component edits are needed.

## Add or update an event

Add an object to the `events` array in `src/data/events.ts`. Dates use ISO format (`YYYY-MM-DD`); omit unknown dates instead of guessing.

```ts
{
  slug: 'confirmed-event-slug',
  title: 'Confirmed event title',
  date: '2026-08-20',
  venue: 'Confirmed public venue',
  description: 'A short, verified description.',
  category: 'Workshop',
  wing: 'Confirmed organizing wing',
  poster: '/assets/posters/confirmed-event.jpg',
  photos: ['/assets/events/confirmed-event-01.jpg'],
  featured: true,
  highlights: ['A confirmed highlight'],
}
```

To update an event, edit its existing record. The `slug` becomes its detail-page URL, so change it only when necessary. Set `featured: false` to remove it from the home-page feature list without removing it from the archive. Poster and photo fields are optional; omit them until approved files exist. `endDate`, `externalUrl`, and `publication` are also optional.

## Add photographs and posters

1. Obtain permission to publish the photo or poster.
2. Copy the optimized image into `public/assets/events/` or `public/assets/posters/` (create the folder if needed).
3. Add its path to the appropriate event record. For standalone gallery entries, add a record to `src/data/gallery.ts`:

```ts
{
  image: '/assets/events/confirmed-event-01.jpg',
  caption: 'A concise caption',
  event: 'Confirmed event title',
  date: '2026-08-20',
  category: 'Workshop',
  alt: 'Students participating in the confirmed workshop',
}
```

Write useful alt text describing the image. Avoid personal or sensitive details.

## Add a book or publication

Place its approved cover in `public/assets/book-covers/` and, if permission allows, its PDF in `public/assets/publications/`. The cover image is the publication's display picture on both its archive card and detail page; it is separate from the PDF itself.

To add a cover to an existing publication, copy the image into `public/assets/book-covers/` and set that record's `cover` to its root-relative path. For example:

```ts
cover: '/assets/book-covers/activities-to-be-conducted.png',
```

Keep its existing `pdf` path unchanged if the downloadable document is still the same. For a future publication, add a record to `src/data/publications.ts`:

```ts
{
  slug: 'confirmed-title',
  title: 'Confirmed title',
  subtitle: 'Optional subtitle',
  description: 'A verified description of the work.',
  language: 'English',
  type: 'Anthology',
  year: 2026,
  cover: '/assets/book-covers/confirmed-title.jpg',
  author: 'Confirmed author or collective',
  editorialTeam: ['Confirmed editor'],
  tableOfContents: ['Optional confirmed section'],
  pdf: '/assets/publications/confirmed-title.pdf',
  featured: true,
}
```

The cover may also be a public `https://` image URL. Only set `pdf` for a file the club is authorized to distribute. Alternatively set `readingUrl` to a verified, authorized reading page or hosted PDF URL. Without either property the site does not display a download or read button. Keep unknown optional details out of the record.

After adding or changing a publication or its image, run `npm run build`, then commit and push the data and asset changes so Netlify or Vercel can deploy them.

## Add a team member or change a designation

Put approved portraits in `public/assets/team/` (create the folder if needed), then add each member to the `team` array in `src/data/team.ts`. Active entries appear on the Executive Team page. Set `category` to `'Core Team'` to also show that member's portrait on the About page:

```ts
{
  slug: 'member-name',
  name: 'Member Name',
  image: '/assets/team/member-name.jpg',
  designation: 'Confirmed designation',
  wing: 'Confirmed wing',
  category: 'Core Team',
  biography: 'Short approved public biography.',
  order: 1,
  active: true,
}
```

To change a designation, update `designation` in that record. `image`, `wing`, and `links` are optional. Use `active: false` to retain a record in source while removing it from the public directory. Do not add private contact data.

## Add a wing

Add an object to `src/data/wings.ts`:

```ts
{
  slug: 'new-wing',
  name: 'Confirmed wing name',
  category: 'Operations',
  summary: 'A concise verified introduction.',
  purpose: 'A plain-language explanation approved by the club.',
  responsibilities: ['Confirmed responsibility'],
  recruitment: 'announcements',
  draft: false,
}
```

Use `Language` or `Operations` for `category`, and one of `open`, `closed`, or `announcements` for recruitment. The directory and join page read this list automatically.

The home-page headline and supporting copy are `heroTitle`, `heroIntroduction`, and `closingThought` in `src/data/site.ts`. These editable fields feed the home hero and the dark quote band above the footer. The hero illustration is an original project asset at `public/assets/vachas-writing.svg`; replace it only with club-approved artwork and update the image path in `src/App.tsx`.

## Add achievements

Add verified entries to `src/data/achievements.ts`:

```ts
{
  title: 'Confirmed milestone',
  date: '2026-08-20',
  description: 'A concise, factual description.',
  category: 'Publication',
  referenceUrl: 'https://example.org/verified-reference',
}
```

Omit unverified dates, images, and reference URLs. The page and home-page section remain hidden when there are no achievement records.

## Recruitment, contact, and social links

In `src/data/recruitment.ts`, set `status` to `'open'`, `'closed'`, or `'announcements'`; edit `message`; and set `applicationUrl` only to an active, verified form. If no form is available, leave the URL empty.

Set the verified public email in `contactEmail` in `src/data/socialLinks.ts`. Add verified public channels to `socialLinks`:

```ts
export const socialLinks: SocialLink[] = [
  { label: 'VACHAS Instagram', url: 'https://www.instagram.com/kl_vachas/' },
  { label: 'Instagram', url: 'https://www.instagram.com/kvs_karthikeya/' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/company/klvachas/' },
]
```

Do not add example links or use a nonfunctional contact form.

## Preview and publish

1. Run `npm install` once after cloning the repository.
2. Run `npm run dev` and open the local URL printed by Vite.
3. Check the affected page, its detail link, keyboard access, and narrow mobile layout.
4. Run `npm run build`; resolve any TypeScript or build errors before publishing.
5. Commit and push the reviewed data and media changes through GitHub. The configured Netlify or Vercel project can then build and publish the static `dist/` site.

Deep-link fallback is configured in `netlify.toml` and `vercel.json`. No credentials belong in the client source. Private member access would require a separate authentication/content service or backend; this public static portfolio does not provide that.
