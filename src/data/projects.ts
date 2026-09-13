export interface CleanProject {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  featured: boolean;
  shortDescription: string;
  tags: string[];
  liveUrl?: string;
  githubUrl: string;
  previewType: 'nexus' | 'commerce' | 'career' | 'greetings' | 'logistics';
  imageUrl?: string;
}

export const projects: CleanProject[] = [
  {
    id: 'nexus-2050',
    title: 'NEXUS 2050',
    subtitle: 'Interactive 3D Smart-City Intelligence',
    category: '3D WebGL Experience',
    featured: true,
    shortDescription:
      'Interactive 3D smart-city intelligence experience with real-time WebGL rendering, custom procedural shaders, and GSAP scroll trajectories.',
    tags: ['React', 'Three.js', 'GSAP'],
    liveUrl: 'https://nexus-2050.vercel.app',
    githubUrl: 'https://github.com/abdullahazaam/NEXUS-2050',
    previewType: 'nexus',
    imageUrl: '/nexus-2050.png'
  },
  {
    id: 'hamara-commerce',
    title: 'Hamara Commerce',
    subtitle: 'Enterprise ASP.NET Core MVC E-Commerce',
    category: 'Full-Stack Enterprise',
    featured: true,
    shortDescription:
      'Advanced e-commerce platform with full features: ASP.NET Core MVC, SQL Server, session store, secure auth, and order tracking.',
    tags: ['ASP.NET Core', 'SQL Server'],
    liveUrl: 'http://hamara-commerce.runasp.net/',
    githubUrl: 'https://github.com/abdullahazaam/Hamara-Ecommerce',
    previewType: 'commerce',
    imageUrl: '/Hamara-Commerce.png'
  },
  {
    id: 'path-seeker',
    title: 'PathSeeker',
    subtitle: 'Intelligent Career Guidance Platform',
    category: 'Full-Stack Web App',
    featured: false,
    shortDescription:
      'Career guidance platform with assessments and resources, psychometric scoring, and multi-tier role portals.',
    tags: ['Laravel', 'MySQL'],
    liveUrl: 'https://path-seeker-production.up.railway.app',
    githubUrl: 'https://github.com/abdullahazaam/Path-Seeker',
    previewType: 'career',
    imageUrl: '/path-seeker.png'
  },
  {
    id: 'e-greetings',
    title: 'E-Greetings',
    subtitle: 'Digital Greeting & Scheduled Delivery',
    category: '.NET Web Platform',
    featured: false,
    shortDescription:
      'Digital greeting platform with subscriptions and cards, personalized templates, and automated email dispatch.',
    tags: ['ASP.NET Core', 'SQL Server'],
    liveUrl: 'http://e-greeting.runasp.net/',
    githubUrl: 'https://github.com/abdullahazaam/E-Greetings',
    previewType: 'greetings',
    imageUrl: '/E-Greeting.png'
  },
  {
    id: 'zero-hunger',
    title: 'Zero Hunger',
    subtitle: 'Food Donation & Delivery Network',
    category: 'Full-Stack Logistics',
    featured: false,
    shortDescription:
      'Food donation and delivery coordination platform connecting donors, verified NGOs, and volunteer routing.',
    tags: ['PHP', 'MySQL'],
    githubUrl: 'https://github.com/abdullahazaam/Zero-Hunger',
    previewType: 'logistics',
    imageUrl: '/Zero-Hunger.png'
  }
];
