export type RecruitmentStatus = 'open' | 'closed' | 'announcements'

export interface SiteContent {
  name: string
  tagline: string
  heroTitle: string
  heroIntroduction: string
  closingThought: string
  introduction: string
  location: string
  mission: string
  vision: string
  values: string[]
  activities: string[]
  editorNote: string
}

export interface Wing {
  slug: string
  name: string
  category: 'Language' | 'Operations'
  summary: string
  purpose: string
  responsibilities: string[]
  photos?: WingPhoto[]
  lead?: string
  recruitment: RecruitmentStatus
  draft: boolean
}

export interface WingPhoto {
  image: string
  caption: string
  alt: string
}

export interface TeamMember {
  slug: string
  name: string
  image?: string
  designation: string
  wing?: string
  category: string
  biography: string
  order: number
  active: boolean
  links?: { label: string; url: string }[]
}

export interface ClubEvent {
  slug: string
  title: string
  date?: string
  endDate?: string
  venue?: string
  description: string
  category: string
  wing?: string
  poster?: string
  photos: string[]
  featured: boolean
  externalUrl?: string
  highlights?: string[]
  publication?: string
}

export interface Publication {
  slug: string
  title: string
  subtitle?: string
  description: string
  language?: string
  type: string
  year?: number
  cover?: string
  author?: string
  editorialTeam?: string[]
  wing?: string
  tableOfContents?: string[]
  pdf?: string
  readingUrl?: string
  featured: boolean
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  date?: string
  author?: string
  image?: string
  imageAlt?: string
  url: string
}

export interface GalleryImage {
  image: string
  caption: string
  event?: string
  date?: string
  category: string
  alt: string
}

export interface Achievement {
  title: string
  date?: string
  description: string
  category: string
  image?: string
  referenceUrl?: string
}

export interface SocialLink {
  label: string
  url: string
}
