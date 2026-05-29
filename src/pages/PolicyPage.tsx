import { useLocation } from 'react-router-dom';

interface PolicyConfig {
  title: string;
  subtitle: string;
  sections: { heading: string; content: string[] }[];
}

const policies: Record<string, PolicyConfig> = {
  'shipping-policy': {
    title: 'Shipping Policy',
    subtitle: 'Fast, insured and reliable delivery across India',
    sections: [
      {
        heading: 'Delivery Timeline',
        content: [
          'Orders are processed within 24-48 hours of confirmation.',
          'Standard delivery takes 3-7 business days across India.',
          'Express delivery options available at additional cost.',
          'Custom-designed pieces may take 10-15 business days.',
        ],
      },
      {
        heading: 'Shipping Charges',
        content: [
          'Free shipping on all orders above ₹10,000.',
          'Standard shipping charges of ₹150 for orders below ₹10,000.',
          'Express shipping charges calculated based on location and weight.',
          'No hidden charges - all applicable costs are shown at checkout.',
        ],
      },
      {
        heading: 'Order Tracking',
        content: [
          'Track your order using the tracking number sent to your registered mobile number.',
          'Real-time updates via SMS and email throughout the shipping process.',
          'Contact us if you haven\'t received your order within the estimated timeline.',
        ],
      },
      {
        heading: 'Shipping Insurance',
        content: [
          'All shipments are fully insured against loss or damage during transit.',
          'Signature required upon delivery for all jewelry items.',
          'Pictures of delivered items are captured as proof of delivery.',
        ],
      },
    ],
  },
  'return-policy': {
    title: 'Return & Exchange Policy',
    subtitle: 'Hassle-free returns and exchanges',
    sections: [
      {
        heading: 'Exchange Policy',
        content: [
          'We offer a 7-day exchange policy on all jewelry purchases.',
          'Items must be in original condition with all certifications and packaging.',
          'Exchange value will be based on the current market rate for gold.',
          'Custom-designed and personalized items are non-exchangeable.',
        ],
      },
      {
        heading: 'Gold Exchange Program',
        content: [
          'Exchange your old gold jewelry from any jeweler at our store.',
          'Zero deduction on gold purity assessment.',
          'Best market rates guaranteed for your old gold.',
          'Instant credit toward new jewelry purchase.',
        ],
      },
      {
        heading: 'Conditions for Exchange',
        content: [
          'Original receipt/bill is required for all exchanges.',
          'Jewelry must be in good condition without alterations.',
          'Diamond and gemstone pieces subject to individual assessment.',
          'Store credit issued for exchange value difference.',
        ],
      },
    ],
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    subtitle: 'We respect and protect your privacy',
    sections: [
      {
        heading: 'Information We Collect',
        content: [
          'Personal information provided during purchase or inquiry (name, phone, email, address).',
          'Transaction details for order processing and billing.',
          'Browsing behavior on our website to improve user experience.',
        ],
      },
      {
        heading: 'How We Use Your Information',
        content: [
          'To process and deliver your orders.',
          'To communicate about order status and customer service.',
          'To send promotional offers (only with your consent).',
          'To improve our products and services.',
        ],
      },
      {
        heading: 'Data Protection',
        content: [
          'Your information is stored securely and never shared with third parties without consent.',
          'We use industry-standard encryption for online transactions.',
          'You can request deletion of your data at any time.',
          'We do not store payment card information on our servers.',
        ],
      },
    ],
  },
  'terms-conditions': {
    title: 'Terms & Conditions',
    subtitle: 'Please read these terms carefully',
    sections: [
      {
        heading: 'General',
        content: [
          'All prices are subject to change based on market gold rates.',
          'Product images are for illustration; actual product may vary slightly.',
          'We reserve the right to modify these terms at any time.',
        ],
      },
      {
        heading: 'Pricing & Payment',
        content: [
          'Final price includes gold value, making charges, and applicable taxes.',
          'Payment must be made in full before order processing.',
          'EMI options available through partner banks on qualifying purchases.',
        ],
      },
      {
        heading: 'Warranty & Guarantee',
        content: [
          'All gold jewelry comes with a lifetime craftsmanship guarantee.',
          'Diamond certification provided for all diamond jewelry.',
          'Free cleaning and polishing for life on all purchases.',
        ],
      },
    ],
  },
};

const PolicyPage = () => {
  const location = useLocation();
  const path = location.pathname.replace('/', '');
  const policy = policies[path];

  if (!policy) {
    return (
      <div className="page-error">
        <div className="container">
          <h2>Policy Not Found</h2>
          <p>The policy page you're looking for doesn't exist.</p>
          <a href="/" className="btn btn-primary">Go Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="policy-page">
      <div className="page-hero policy-hero">
        <div className="container">
          <h1>{policy.title}</h1>
          <p>{policy.subtitle}</p>
        </div>
      </div>

      <div className="container policy-content">
        {policy.sections.map((section, index) => (
          <div key={index} className="policy-section">
            <h2>{section.heading}</h2>
            <ul className="policy-list">
              {section.content.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}

        <div className="policy-footer">
          <p>
            Last updated: January 2026. For any questions regarding our policies,
            please <a href="/contact">contact us</a> or call{' '}
            <a href="tel:+919975956777">9975956777</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;
