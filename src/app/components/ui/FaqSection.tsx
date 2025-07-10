"use client";
import { Icon } from "@iconify/react";
import { useState } from "react";

interface Faq {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  faqs: Faq[];
}

interface FaqItemProps {
  faq: Faq;
  selected: boolean;
  onSelect: () => void;
}

const FaqItem: React.FC<FaqItemProps> = ({ faq, selected, onSelect }) => {
  return (
    <div
      className={`w-full rounded-lg flex justify-between text-base sm:text-lg font-semibold items-center p-3 sm:p-4 cursor-pointer transition-all duration-300 ${selected ? "bg-black text-white" : "bg-transparent text-dark-1 border border-gray-1"
        }`}
      onClick={onSelect}
    >
      <h2 className={selected ? "text-white" : "text-black"}>{faq.question}</h2>
      {selected && <Icon icon="akar-icons:ribbon" className="w-5 h-5 sm:w-6 sm:h-6 text-primary-5" />}
    </div>
  );
};

const FaqSection: React.FC<FaqSectionProps> = ({ faqs }) => {
  const [selectedQuestion, setSelectedQuestion] = useState<string>(faqs.length > 0 ? faqs[0].question : "");

  return (
    <div className="container mx-auto bg-black p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl bg-primary-fade rounded-2xl sm:rounded-3xl border-4 sm:border-6 border-black px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10 flex flex-col lg:flex-row gap-6 sm:gap-8">
        {/* Left Side (FAQs) */}
        <div className="flex flex-1 flex-col gap-6 sm:gap-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">FAQs.</h1>
          <div className="flex flex-col gap-3 w-full max-h-[60vh] sm:max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent pr-2">
            {faqs.map((faq, index) => (
              <FaqItem
                key={index}
                faq={faq}
                selected={selectedQuestion === faq.question}
                onSelect={() => setSelectedQuestion(faq.question)}
              />
            ))}
          </div>
        </div>

        {/* Right Side (Answer Section) */}
        <div className="flex flex-1 flex-col gap-6 sm:gap-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">Ans.</h1>
          <div className="flex flex-col w-full bg-primary-5 rounded-2xl sm:rounded-3xl p-4 sm:p-6">
            <div className="flex flex-col gap-4">
              <Icon icon="akar-icons:ribbon" className="w-8 h-8 sm:w-10 sm:h-10 text-black -ml-1" />
              <p className="text-black text-base sm:text-lg lg:text-xl font-semibold">
                {faqs.find((faq) => faq.question === selectedQuestion)?.answer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqSection;