import { useEffect, useState } from 'react';

const SECTION_IDS = ['home', 'core-values', 'features', 'roadmap', 'about', 'support'] as const;

export type SectionId = (typeof SECTION_IDS)[number];

/** 根据滚动位置高亮当前导航区块 */
export function useActiveSection() {
  const [activeId, setActiveId] = useState<SectionId>('home');

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id as SectionId);
        }
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.25, 0.5] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return activeId;
}

export { SECTION_IDS };
