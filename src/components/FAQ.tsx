import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I book a lawyer consultation?",
      answer:
        "Simply sign up on our platform, browse through our verified lawyers, and select the one that matches your needs. You can then schedule a consultation at your preferred time and choose between online or offline meetings.",
    },
    {
      question: "Is my personal data and information safe?",
      answer:
        "Absolutely. We use bank-level encryption and security measures to protect all your personal information. All communications between you and your lawyer are confidential and secure.",
    },
    {
      question: "How are lawyers verified on your platform?",
      answer:
        "All lawyers undergo a thorough verification process including license validation, background checks, professional references, and review of their experience and qualifications before being approved on our platform.",
    },
    {
      question: "What are the consultation fees?",
      answer:
        "Consultation fees vary depending on the lawyer's experience and specialization. You can see the hourly rates on each lawyer's profile before booking. We offer transparent pricing with no hidden fees.",
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer:
        "Yes, we offer a satisfaction guarantee. If you're not satisfied with your consultation, you can request a refund within 24 hours of your session, and we'll review your case.",
    },
    {
      question: "Do you offer legal services in multiple languages?",
      answer:
        "Yes, we have lawyers who speak various languages. You can filter lawyers by language preference when browsing profiles to find someone who speaks your preferred language.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="py-20 bg-gradient-to-br from-slate-50 to-blue-50"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-600">
            Find answers to common questions about our legal consultation
            services.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 text-left flex justify-between items-center hover:bg-white/80 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-slate-800 pr-4">
                  {faq.question}
                </h3>
                {openFAQ === index ? (
                  <ChevronUp className="h-5 w-5 text-blue-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />
                )}
              </button>

              {openFAQ === index && (
                <div className="px-6 pb-6">
                  <div className="border-t border-slate-200 pt-4">
                    <p className="text-slate-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
