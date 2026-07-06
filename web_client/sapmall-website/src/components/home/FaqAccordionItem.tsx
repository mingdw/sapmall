import React from 'react';
import { ChevronDown } from 'lucide-react';

type FaqAccordionItemProps = {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
};

/** FAQ 手风琴项 — 高度与透明度平滑过渡 */
const FaqAccordionItem: React.FC<FaqAccordionItemProps> = ({ question, answer, open, onToggle }) => (
  <div className={`faq-item ${open ? 'faq-item--open' : ''}`}>
    <button
      type="button"
      className="faq-item__trigger"
      aria-expanded={open}
      onClick={onToggle}
    >
      <span>{question}</span>
      <ChevronDown size={18} className="faq-item__chevron" strokeWidth={1.75} />
    </button>
    <div className="faq-item__answer-wrap" aria-hidden={!open}>
      <div className="faq-item__answer-inner">
        <div className="faq-item__answer">{answer}</div>
      </div>
    </div>
  </div>
);

export default FaqAccordionItem;
