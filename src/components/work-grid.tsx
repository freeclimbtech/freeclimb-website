import * as React from 'react';
import { MotionConfig } from 'framer-motion';
import { MasonryGrid } from '@/components/ui/image-testimonial-grid';

interface Project {
  name: string;
  meta: string;
  image: string;
  /** CSS aspect-ratio for the card - sets the masonry rhythm without waiting on image load. */
  aspect: string;
}

const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=70`;

// Stock imagery stands in until real site screenshots are ready.
const projects: Project[] = [
  { name: 'Crown Garage', meta: 'Automotive · Lead-gen site', image: unsplash('1492144534655-ae79c964c9d7'), aspect: '4 / 3' },
  { name: 'Raas Kelly', meta: 'Client site', image: unsplash('1531297484001-80022131f5a1'), aspect: '4 / 5' },
  { name: 'Derek Arden', meta: 'Client site', image: unsplash('1475721027785-f74eccf877e2'), aspect: '1 / 1' },
  { name: 'DHV Architects', meta: 'Architecture · Brand site', image: unsplash('1487958449943-2429e8be8625'), aspect: '4 / 5' },
  { name: 'Cannon Locksmiths', meta: 'Trades · Lead-gen site', image: unsplash('1582139329536-e7284fece509'), aspect: '3 / 4' },
  { name: 'Presence3D', meta: 'Visualisation · Portfolio site', image: unsplash('1600585154340-be6161a56a0c'), aspect: '4 / 3' },
  { name: 'Electric Vintage', meta: 'Retail · Storefront', image: unsplash('1441986300917-64674bd600d8'), aspect: '1 / 1' },
  { name: 'Audr', meta: 'Client site', image: unsplash('1460925895917-afdab827c52f'), aspect: '4 / 3' },
  { name: 'Jo Parker', meta: 'Client site', image: unsplash('1498050108023-c5249f4df085'), aspect: '4 / 5' },
  { name: 'David Daniel', meta: 'Client site', image: unsplash('1461749280684-dccba630e2f6'), aspect: '3 / 4' },
  { name: 'Bristol Healing', meta: 'Wellness · Booking site', image: unsplash('1540555700478-4be289fbecef'), aspect: '1 / 1' },
  { name: 'Cricketers Inn', meta: 'Hospitality · Website', image: unsplash('1514933651103-005eec06c04b'), aspect: '4 / 3' },
];

const initials = (name: string) => {
  const words = name.split(' ');
  return (words.length > 1 ? words[0][0] + words[1][0] : name.slice(0, 2)).toUpperCase();
};

const ProjectCard = ({ name, meta, image, aspect }: Project) => (
  <figure
    className="group relative m-0 overflow-hidden rounded-2xl bg-[#131b42] transition-transform duration-300 ease-in-out hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
    style={{ aspectRatio: aspect }}
  >
    <img
      src={image}
      alt=""
      loading="lazy"
      decoding="async"
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent" />
    <figcaption className="absolute top-0 left-0 p-4 text-white">
      <div className="mb-2 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white/80 bg-[#0a1030] text-[11px] font-bold"
        >
          {initials(name)}
        </span>
        <span className="text-sm font-semibold drop-shadow-md">{name}</span>
      </div>
      <p className="text-sm leading-tight font-medium drop-shadow-md">{meta}</p>
    </figcaption>
  </figure>
);

// 1 column on phones, 2 on tablets, 3 from desktop up
const getColumns = (width: number) => (width < 640 ? 1 : width < 1024 ? 2 : 3);

export function WorkGrid() {
  const [columns, setColumns] = React.useState(() => getColumns(window.innerWidth));

  React.useEffect(() => {
    const onResize = () => setColumns(getColumns(window.innerWidth));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="mx-auto max-w-[var(--maxw)] px-[var(--pad)]">
        <MasonryGrid columns={columns} gap={4}>
          {projects.map((project) => (
            <ProjectCard key={project.name} {...project} />
          ))}
        </MasonryGrid>
      </div>
    </MotionConfig>
  );
}
