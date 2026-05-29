const GoldRate = () => {
  const rates = [
    { purity: '24K (99.9%)', rate: '7,250/g', change: '+45' },
    { purity: '22K (91.6%)', rate: '6,640/g', change: '+40' },
    { purity: '18K (75.0%)', rate: '5,440/g', change: '+35' },
    { purity: '14K (58.5%)', rate: '4,240/g', change: '+25' },
  ];

  return (
    <div className="goldrate-page">
      <div className="page-hero goldrate-hero">
        <div className="container">
          <h1>Gold Rate Today</h1>
          <p>Current market rates updated daily</p>
        </div>
      </div>

      <div className="container goldrate-content">
        <div className="goldrate-card">
          <div className="goldrate-header">
            <span className="goldrate-icon">📈</span>
            <div>
              <h2>Live Gold Rates</h2>
              <p className="goldrate-date">Rates as of today - Ishwarpur</p>
            </div>
          </div>

          <div className="goldrate-table-wrapper">
            <table className="goldrate-table">
              <thead>
                <tr>
                  <th>Purity</th>
                  <th>Rate Per Gram</th>
                  <th>Today's Change</th>
                </tr>
              </thead>
              <tbody>
                {rates.map((rate, index) => (
                  <tr key={index}>
                    <td><strong>{rate.purity}</strong></td>
                    <td className="goldrate-value">₹{rate.rate}</td>
                    <td className="goldrate-change positive">+{rate.change}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="goldrate-note">
            <p>
              * Rates are indicative and may vary at the store. Please visit our store
              or call us for the most accurate and up-to-date rates.
            </p>
          </div>
        </div>

        <div className="goldrate-info">
          <h3>Understanding Gold Rates</h3>
          <div className="goldrate-info-grid">
            <div className="goldrate-info-card">
              <h4>24K Gold</h4>
              <p>Pure gold (99.9%). Used for investments like bars and coins. Too soft for most jewelry.</p>
            </div>
            <div className="goldrate-info-card">
              <h4>22K Gold</h4>
              <p>91.6% pure gold mixed with other metals for durability. The standard for Indian jewelry.</p>
            </div>
            <div className="goldrate-info-card">
              <h4>Making Charges</h4>
              <p>Charges for craftsmanship, typically 8-15% of gold value for standard designs.</p>
            </div>
            <div className="goldrate-info-card">
              <h4>GST</h4>
              <p>3% GST applies on the total value including making charges.</p>
            </div>
          </div>
        </div>

        <div className="goldrate-cta">
          <p>For the latest rates and personalized assistance, give us a call.</p>
          <a href="tel:+919975956777" className="btn btn-primary btn-lg">
            📞 Call 9975956777
          </a>
        </div>
      </div>
    </div>
  );
};

export default GoldRate;
