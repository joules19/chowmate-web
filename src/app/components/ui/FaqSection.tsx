import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

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
      className={`w-full h-[60px] rounded-lg flex justify-between text-[18px] font-semibold items-center p-4 cursor-pointer transition-all duration-300 ${selected ? "bg-black text-white" : "bg-transparent text-dark-1 border border-gray-1"
        }`}
      onClick={onSelect}
    >
      <h2 className={selected ? "text-white" : "text-black"}>{faq.question}</h2>
      {selected && <Icon icon="akar-icons:ribbon" width={24} height={24} className="text-primary-5" />}
    </div>
  );
};

const FaqSection: React.FC<FaqSectionProps> = ({ faqs }) => {
  const [selectedQuestion, setSelectedQuestion] = useState<string>(faqs.length > 0 ? faqs[0].question : "");

  return (
    <div className="container mx-auto bg-black p-4 flex mt-52">
      <div className="mx-auto w-5/6 h-[734px] bg-primary-fade rounded-[24px] border-[7px] border-black px-[42px] py-[50px] flex gap-8 mt-[-84px]">
        {/* Left Side (FAQs) */}
        <div className="flex flex-1 flex-col gap-[30px]">
          <h1 className="text-[36px] font-semibold">FAQs.</h1>
          <div className="flex flex-col gap-3 w-full h-[480px] overflow-y-scroll scrollbar pr-3 me-[-16px]">
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
        <div className="flex flex-1 flex-col gap-[30px]">
          <h1 className="text-[36px] font-semibold">Ans.</h1>
          <div className="flex flex-col w-full h-[545px] bg-primary-5 rounded-[24px] p-6">
            <div className="flex flex-col gap-4 ">
              <Icon icon="akar-icons:ribbon" width={40} height={40} className="text-black -ml-1" />
              <p className="text-black text-[20px] font-semibold">
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
