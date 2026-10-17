import type { Wing } from './types'

export const wings: Wing[] = [
  {
    slug: 'telugu',
    name: 'Telugu Wing',
    category: 'Language',
    summary: 'A home for Telugu language and literary expression.',
    purpose: 'Create space for students to engage with Telugu through literature and creative expression.',
    responsibilities: ['Language-focused activities', 'Creative and editorial contributions', 'Collaboration on club events'],
    photos: [
      
    ],
    recruitment: 'announcements',
    draft: true,
  },
  {
    slug: 'hindi',
    name: 'Hindi Wing',
    category: 'Language',
    summary: 'A space to explore Hindi language and literature.',
    purpose: 'Bring students together around Hindi writing, reading, and expression.',
    responsibilities: ['Language-focused activities', 'Creative and editorial contributions', 'Collaboration on club events'],
    recruitment: 'announcements',
    draft: true,
  },
  {
    slug: 'english',
    name: 'English Wing',
    category: 'Language',
    summary: 'An invitation to read, write, and think in English.',
    purpose: 'Encourage literary exchange and creative expression in English.',
    responsibilities: ['Language-focused activities', 'Creative and editorial contributions', 'Collaboration on club events'],
    photos: [
      {
        image: '/assets/wings/english-wing-literary-session.jpg',
        caption: 'Participants take part in a literary session',
        alt: 'Students listening and taking part in a literary session',
      },
    ],
    recruitment: 'announcements',
    draft: true,
  },
  {
    slug: 'public-relations',
    name: 'Public Relations',
    category: 'Operations',
    summary: 'Help the club communicate and connect with its community.',
    purpose: 'Support clear communication between the club, its campus community, and collaborators.',
    responsibilities: ['Event communication', 'Community outreach', 'Sharing approved club updates'],
    recruitment: 'announcements',
    draft: true,
  },
  {
    slug: 'designing',
    name: 'Designing',
    category: 'Operations',
    summary: 'Give club ideas a thoughtful visual voice.',
    purpose: 'Contribute visual design to club communications, events, and publications.',
    responsibilities: ['Visual communication', 'Event and publication design', 'Collaborating with other wings'],
    recruitment: 'announcements',
    draft: true,
  },
  {
    slug: 'content-editorial',
    name: 'Content & Editorial',
    category: 'Operations',
    summary: 'Shape words for events, communications, and publications.',
    purpose: 'Support the club’s written voice and help bring literary work into the world.',
    responsibilities: ['Writing and editing', 'Editorial coordination', 'Collaborating on publications and events'],
    recruitment: 'announcements',
    draft: true,
  },
]
