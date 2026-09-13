export interface JourneyStep {
  number: string;
  period: string;
  title: string;
  description: string;
  technologies: string[];
}

export const journeySteps: JourneyStep[] = [
  {
    number: '01',
    period: 'STAGE 1',
    title: 'Started Web Development',
    description: 'Learned HTML, CSS, and modern JavaScript fundamentals. Built interactive client-side projects and mastered DOM manipulation, layouts, and responsiveness.',
    technologies: ['HTML5', 'CSS3', 'JavaScript']
  },
  {
    number: '02',
    period: 'STAGE 2',
    title: 'Worked with PHP & Laravel',
    description: 'Built full-stack applications with server-side architecture, relational database design in MySQL, MVC patterns, and RESTful APIs.',
    technologies: ['PHP', 'Laravel', 'MySQL']
  },
  {
    number: '03',
    period: 'STAGE 3',
    title: 'Moved to ASP.NET Core',
    description: 'Developed robust, database-driven C# applications using Entity Framework Core, SQL Server, layered architecture, and secure identity systems.',
    technologies: ['C#', 'ASP.NET Core', 'SQL Server', 'EF Core']
  },
  {
    number: '04',
    period: 'STAGE 4',
    title: 'Exploring 3D & Modern Web',
    description: 'Creating immersive digital experiences and interactive 3D simulations using React, TypeScript, Three.js, and GSAP scroll choreographies.',
    technologies: ['React', 'Three.js', 'GSAP', 'TypeScript']
  },
  {
    number: '05',
    period: 'STAGE 5',
    title: 'Future',
    description: 'Continuous learning, deepening enterprise cloud architecture, exploring advanced WebGL graphics, and building impactful high-scale software.',
    technologies: ['Keep Learning', 'Building', 'Innovating']
  }
];
