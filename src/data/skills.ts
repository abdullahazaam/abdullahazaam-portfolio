export interface TechSkill {
  id: string;
  name: string;
  category: 'Backend & Systems' | 'Creative & Frontend' | 'Data & DevOps';
  roleLabel: string;
  iconName: string;
  level: string;
}

export const techSkills: TechSkill[] = [
  // Backend & .NET
  {
    id: 'csharp',
    name: 'C#',
    category: 'Backend & Systems',
    roleLabel: 'Core Language',
    iconName: 'csharp',
    level: 'Advanced'
  },
  {
    id: 'aspnet',
    name: 'ASP.NET Core',
    category: 'Backend & Systems',
    roleLabel: 'Web Architecture & APIs',
    iconName: 'aspnet',
    level: 'Enterprise'
  },
  {
    id: 'efcore',
    name: 'Entity Framework',
    category: 'Backend & Systems',
    roleLabel: 'ORM & Data Modeling',
    iconName: 'efcore',
    level: 'Production'
  },
  {
    id: 'sqlserver',
    name: 'SQL Server',
    category: 'Data & DevOps',
    roleLabel: 'Relational Database',
    iconName: 'sqlserver',
    level: 'Enterprise'
  },
  {
    id: 'php',
    name: 'PHP',
    category: 'Backend & Systems',
    roleLabel: 'Server-Side Language',
    iconName: 'php',
    level: 'Advanced'
  },
  {
    id: 'laravel',
    name: 'Laravel',
    category: 'Backend & Systems',
    roleLabel: 'MVC Full-Stack Framework',
    iconName: 'laravel',
    level: 'Advanced'
  },
  {
    id: 'mysql',
    name: 'MySQL',
    category: 'Data & DevOps',
    roleLabel: 'Relational Database',
    iconName: 'mysql',
    level: 'Advanced'
  },

  // Creative Frontend & Web
  {
    id: 'react',
    name: 'React',
    category: 'Creative & Frontend',
    roleLabel: 'Component UI Library',
    iconName: 'react',
    level: 'Advanced'
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'Creative & Frontend',
    roleLabel: 'Static Type System',
    iconName: 'typescript',
    level: 'Advanced'
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'Creative & Frontend',
    roleLabel: 'ESNext Language Core',
    iconName: 'javascript',
    level: 'Advanced'
  },
  {
    id: 'threejs',
    name: 'Three.js',
    category: 'Creative & Frontend',
    roleLabel: '3D Graphics & WebGL',
    iconName: 'threejs',
    level: 'Interactive'
  },
  {
    id: 'gsap',
    name: 'GSAP',
    category: 'Creative & Frontend',
    roleLabel: 'Scroll & Motion Engine',
    iconName: 'gsap',
    level: 'Choreography'
  },
  {
    id: 'html5',
    name: 'HTML5',
    category: 'Creative & Frontend',
    roleLabel: 'Semantic Web Structure',
    iconName: 'html5',
    level: 'Foundation'
  },
  {
    id: 'css3',
    name: 'CSS3',
    category: 'Creative & Frontend',
    roleLabel: 'Modern Layouts & Styling',
    iconName: 'css3',
    level: 'Foundation'
  },
  {
    id: 'bootstrap',
    name: 'Bootstrap',
    category: 'Creative & Frontend',
    roleLabel: 'Responsive UI Toolkit',
    iconName: 'bootstrap',
    level: 'Proficient'
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'Creative & Frontend',
    roleLabel: 'Utility-First Styling',
    iconName: 'tailwind',
    level: 'Advanced'
  },

  // Tools & Version Control
  {
    id: 'git',
    name: 'Git',
    category: 'Data & DevOps',
    roleLabel: 'Version Control',
    iconName: 'git',
    level: 'Proficient'
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'Data & DevOps',
    roleLabel: 'Repositories & CI/CD',
    iconName: 'github',
    level: 'Proficient'
  }
];
