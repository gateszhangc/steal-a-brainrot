'use client';

import React, { useState } from 'react';
import { FAQItem } from '../../lib/seo/types';
import { FAQSchema } from './SchemaMarkup';

interface FAQProps {
  items: FAQItem[];
  title?: string;
  includeSchema?: boolean;
  className?: string;
  maxItems?: number;
  showAll?: boolean;
}

export function FAQ({
  items,
  title = 'Frequently Asked Questions',
  includeSchema = true,
  className = '',
  maxItems,
  showAll = false
}: FAQProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [showMore, setShowMore] = useState(showAll);

  // Limit items if maxItems is provided and showAll is false
  const displayItems = showAll || !maxItems
    ? items
    : items.slice(0, maxItems);

  const remainingItems = !showAll && maxItems
    ? items.slice(maxItems)
    : [];

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleItem(index);
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <>
      {includeSchema && <FAQSchema faqs={items} />}

      <div className={`faq-container ${className}`}>
        {title && (
          <h2 className="faq-title text-2xl font-bold text-center mb-8 text-gray-800">
            {title}
          </h2>
        )}

        <div className="faq-list space-y-4">
          {displayItems.map((item, index) => (
            <div
              key={index}
              className="faq-item border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:border-blue-300 hover:shadow-md"
            >
              <button
                className="faq-question w-full px-6 py-4 text-left bg-white hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset transition-colors duration-150"
                onClick={() => toggleItem(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                aria-expanded={openItems.has(index)}
                aria-controls={`faq-answer-${index}`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="faq-question-text text-lg font-medium text-gray-800 pr-4">
                    {item.question}
                  </h3>
                  <div
                    className={`faq-icon flex-shrink-0 w-6 h-6 text-blue-500 transition-transform duration-200 ${
                      openItems.has(index) ? 'rotate-45' : ''
                    }`}
                  >
                    <svg
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v12m6-6H6"
                      />
                    </svg>
                  </div>
                </div>
              </button>

              <div
                id={`faq-answer-${index}`}
                className={`faq-answer overflow-hidden transition-all duration-300 ${
                  openItems.has(index) ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div
                    className="faq-answer-text text-gray-600 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: item.answer.replace(/\n/g, '<br />')
                    }}
                  />
                </div>
              </div>
            </div>
          ))}

          {!showAll && remainingItems.length > 0 && (
            <div className="faq-show-more text-center pt-4">
              <button
                onClick={() => setShowMore(true)}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150"
              >
                Show {remainingItems.length} More {remainingItems.length === 1 ? 'Question' : 'Questions'}
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .faq-container {
          max-width: 800px;
          margin: 0 auto;
        }

        @media (max-width: 640px) {
          .faq-title {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
          }

          .faq-question-text {
            font-size: 1rem;
          }

          .faq-answer-text {
            font-size: 0.875rem;
          }

          .faq-question {
            padding: 1rem;
          }

          .faq-answer > div {
            padding: 1rem;
          }
        }
      `}</style>
    </>
  );
}

// FAQ Category Component for organizing FAQs by category
interface FAQCategoryProps {
  categories: {
    [category: string]: FAQItem[];
  };
  className?: string;
}

export function FAQCategories({ categories, className = '' }: FAQCategoryProps) {
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set(['General']));

  const toggleCategory = (category: string) => {
    const newOpenCategories = new Set(openCategories);
    if (newOpenCategories.has(category)) {
      newOpenCategories.delete(category);
    } else {
      newOpenCategories.add(category);
    }
    setOpenCategories(newOpenCategories);
  };

  return (
    <div className={`faq-categories ${className}`}>
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
        Help & FAQ Center
      </h2>

      <div className="space-y-6">
        {Object.entries(categories).map(([category, items]) => (
          <div
            key={category}
            className="faq-category border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              className="category-header w-full px-6 py-4 text-left bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset transition-colors duration-150"
              onClick={() => toggleCategory(category)}
              aria-expanded={openCategories.has(category)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  {category}
                  <span className="ml-2 text-sm text-gray-500">
                    ({items.length} {items.length === 1 ? 'question' : 'questions'})
                  </span>
                </h3>
                <div
                  className={`w-6 h-6 text-gray-500 transition-transform duration-200 ${
                    openCategories.has(category) ? 'rotate-180' : ''
                  }`}
                >
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </button>

            <div
              className={`category-content transition-all duration-300 ${
                openCategories.has(category) ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
              }`}
            >
              <div className="p-6 bg-white">
                <FAQ
                  items={items}
                  includeSchema={false}
                  className="border-0 shadow-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Hook for getting FAQ data
export function useFAQData(category?: string) {
  // This would typically fetch from your API or config
  // For now, we'll return the data from our SEO config
  const allFAQs = [
    {
      question: "What is Steal a Brainrot?",
      answer: "Steal a Brainrot is a free online multiplayer game where players compete to collect brainrot characters. The game features various game modes, colorful graphics, and addictive gameplay inspired by popular Roblox games.",
      category: "General"
    },
    {
      question: "How do you play Steal a Brainrot?",
      answer: "Playing Steal a Brainrot is simple! Use your mouse or keyboard to move your character around the game area. Collect brainrot items while avoiding other players who might try to steal your collection. The more brainrots you collect, the higher your score!",
      category: "Gameplay"
    },
    {
      question: "Is Steal a Brainrot free to play?",
      answer: "Yes! Steal a Brainrot is completely free to play. There are no downloads, registrations, or payments required. Simply visit the website and start playing instantly in your web browser.",
      category: "General"
    },
    {
      question: "Can I play Steal a Brainrot on mobile devices?",
      answer: "Yes, Steal a Brainrot is optimized for both desktop and mobile devices. The game automatically adjusts to your screen size, ensuring a great gaming experience whether you're playing on a phone, tablet, or computer.",
      category: "Compatibility"
    },
    {
      question: "Are there different game modes in Steal a Brainrot?",
      answer: "Yes! Steal a Brainrot offers multiple game modes including classic collection, competitive multiplayer, team battles, and special event modes. Each mode provides a unique gameplay experience and challenges.",
      category: "Gameplay"
    }
  ];

  if (category) {
    return allFAQs.filter(faq => faq.category === category);
  }

  return allFAQs;
}

export default FAQ;