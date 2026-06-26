import { useState } from 'react';
import { Link } from 'react-router-dom';

interface FAQItem {
  q: string;
  a: string;
}

const faqs: FAQItem[] = [
  {
    q: 'Is your gold BIS hallmarked?',
    a: 'Yes, all our gold jewelry is 100% BIS hallmarked, ensuring the purity and quality of every piece. We provide a certificate of authenticity with every purchase.',
  },
  {
    q: 'What is your exchange policy?',
    a: 'We offer zero-deduction exchange on old gold jewelry, regardless of where you originally purchased it. Our expert appraisers will evaluate the purity and weight, and you can exchange it for any new piece in our collection.',
  },
  {
    q: 'Do you provide diamond certification?',
    a: 'Absolutely. All our diamond jewelry comes with IGI or GIA certification, detailing the cut, color, clarity, and carat weight of each diamond.',
  },
  {
    q: 'Can I get custom jewelry designed?',
    a: 'Yes! We specialize in custom jewelry design. Bring us your ideas, sketches, or reference images, and our skilled artisans will bring your vision to life. Visit our store for a consultation.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept cash, all major credit/debit cards, UPI (GPay, PhonePe, Paytm), net banking, and bank transfers. We also offer easy EMI options on select purchases.',
  },
  {
    q: 'What is your return policy?',
    a: 'We offer a 7-day exchange policy on all purchases. Items must be in original condition with all certificates. Custom-designed pieces are non-returnable but can be altered.',
  },
  {
    q: 'Do you offer free shipping?',
    a: 'Yes, we offer free shipping on orders above ₹10,000. For orders below this amount, a nominal shipping charge applies. We ship across India with full insurance.',
  },
  {
    q: 'How can I check the current gold rate?',
    a: 'You can visit our store for the latest gold rates, or give us a call at 9975956777 or 7498005240 for the current day\'s rate. Our rates are competitive and updated daily based on market prices.',
  },
  {
    q: 'Do you provide jewelry repair and maintenance services?',
    a: 'Yes, we offer comprehensive jewelry repair and maintenance services including resizing, stone tightening, polishing, and rhodium plating. Visit our store for a free assessment.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      <div className="page-hero faq-hero">
        <div className="container">
          <h1>Frequently Asked Questions</h1>
          <p>Everything you need to know about M/S. RAMESHKUMAR PUKHARAJ PORWAL JEWELLERS</p>
        </div>
      </div>

      <div className="container faq-content">
        <div className="faq-intro">
          <h2>Have Questions? We're Here to Help</h2>
          <p>
            Find answers to our most commonly asked questions. If you don't see what you're
            looking for, please don't hesitate to contact us directly.
          </p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? 'open' : ''}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                <span>{faq.q}</span>
                <span className="faq-arrow">{openIndex === index ? '−' : '+'}</span>
              </div>
              <div className={`faq-answer ${openIndex === index ? 'open' : ''}`}>
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="faq-cta">
          <h3>Still Have Questions?</h3>
          <p>We'd love to hear from you. Reach out to us anytime.</p>
          <div className="faq-cta-actions">
            <a href="tel:+919975956777" className="btn btn-primary btn-lg">
              📞 Call 9975956777
            </a>
            <Link to="/contact" className="btn btn-outline btn-lg">
              Send a Message →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
