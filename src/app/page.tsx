import HoverCard from '@/components/HoverCard';

export default function Home() {
  const cards = [
    {
      title: 'Next.js',
      image: '/next.svg',
      description: 'The React framework for production.',
      hoverContent: 'Build fast, scalable web apps with Next.js. Features include SSR, SSG, and API routes.'
    },
    {
      title: 'Vercel',
      image: '/vercel.svg',
      description: 'Deploy your apps with ease.',
      hoverContent: 'Vercel provides seamless deployment for Next.js apps with global CDN and edge functions.'
    },
    {
      title: 'React',
      image: '/globe.svg',
      description: 'A JavaScript library for building user interfaces.',
      hoverContent: 'React lets you build encapsulated components that manage their own state.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">Hover Cards Demo</h1>
      <div className="flex flex-wrap justify-center gap-8">
        {cards.map((card, index) => (
          <HoverCard
            key={index}
            title={card.title}
            image={card.image}
            description={card.description}
            hoverContent={card.hoverContent}
          />
        ))}
      </div>
    </div>
  );
}
