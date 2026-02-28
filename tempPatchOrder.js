const fs = require('fs');
const path = 'src/App.jsx';
let text = fs.readFileSync(path, 'utf8');
const startToken = "      {orderOpen && selectedProfile && (";
const endToken = "      {snackbar.open";
const start = text.indexOf(startToken);
const end = text.indexOf(endToken, start);
if (start === -1 || end === -1) {
  throw new Error('Markers not found');
}
const newBlock =       {orderOpen && selectedProfile && (
        <div style={styles.modalOverlay} className="modal-overlay booking-modal" onClick={() => setOrderOpen(false)}>
          <div style={{ ...styles.modalContent, maxWidth: 560 }} className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader} className="modal-header">
              <h2 style={styles.modalTitle} className="modal-title">Book {selectedProfile.name}</h2>
              <button style={styles.closeBtn} className="close-btn" onClick={() => setOrderOpen(false)}>Ã—</button>
            </div>
            <div style={{ padding: 32 }}>
              <div style={styles.bookingHeader} className="booking-header">
                <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 6px' }}>Booking Details</p>
                <p style={styles.bookingPrice} className="booking-price">\ / hour</p>
                <p style={styles.bookingSubtitle} className="booking-subtitle">{selectedProfile.name}, {selectedProfile.age} â€¢ {selectedProfile.location}</p>
              </div>
              <form id="booking-form" style={styles.bookingForm} onSubmit={(e) => { e.preventDefault(); handleSubmitOrder(); }}>
                <div style={styles.bookingSummary}>
                  <div style={styles.bookingSummaryRow}>
                    <span style={styles.bookingSummaryLabel}>Companion</span>
                    <span style={styles.bookingSummaryValue}>{selectedProfile.name}</span>
                  </div>
                  <div style={styles.bookingSummaryRow}>
                    <span style={styles.bookingSummaryLabel}>Location</span>
                    <span style={styles.bookingSummaryValue}>{selectedProfile.location.split(',')[0]}</span>
                  </div>
                  <div style={styles.bookingSummaryRow}>
                    <span style={styles.bookingSummaryLabel}>Duration</span>
                    <span style={styles.bookingSummaryValue}>{orderForm.duration}</span>
                  </div>
                  <div style={styles.bookingSummaryRow}>
                    <span style={styles.bookingSummaryLabel}>Rate</span>
                    <span style={styles.bookingSummaryValue}>\ / hour</span>
                  </div>
                </div>
                {[
                  { placeholder: 'Your Name *', key: 'name' },
                  { placeholder: 'Email Address *', key: 'email' },
                  { placeholder: 'Phone Number', key: 'phone' }
                ].map(({ placeholder, key }) => (
                  <input
                    key={key}
                    type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'}
                    placeholder={placeholder}
                    value={orderForm[key]}
                    onChange={(e) => setOrderForm({ ...orderForm, [key]: e.target.value })}
                    style={{ ...styles.searchInput, marginBottom: 16, borderRadius: 12, border: '2px solid #e5e7eb', padding: '14px 16px' }}
                    className="form-input"
                  />
                ))}
                <select
                  value={orderForm.duration}
                  onChange={(e) => setOrderForm({ ...orderForm, duration: e.target.value })}
                  style={{ ...styles.searchInput, marginBottom: 16, borderRadius: 12, border: '2px solid #e5e7eb', padding: '14px 16px', background: colors.white }}
                  className="form-select"
                >
                  <option value="1 hour">1 Hour - \</option>
                  <option value="2 hours">2 Hours - \</option>
                  <option value="3 hours">3 Hours - \</option>
                  <option value="overnight">Overnight - \</option>
                </select>
                <textarea
                  placeholder="Additional Notes"
                  value={orderForm.notes}
                  onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                  style={{ ...styles.searchInput, minHeight: 100, marginBottom: 16, borderRadius: 12, border: '2px solid #e5e7eb', padding: '14px 16px' }}
                  className="form-textarea"
                />
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', marginBottom: 12 }} className="terms-label">
                  <input
                    type="checkbox"
                    checked={orderForm.agreeToTerms}
                    onChange={(e) => setOrderForm({ ...orderForm, agreeToTerms: e.target.checked })}
                    style={{ marginTop: 4, width: 18, height: 18, accentColor: colors.primary }}
                  />
                  <span style={{ fontSize: 14, color: '#4b5563' }}>I understand that payment is required for booking appointments *</span>
                </label>
              </form>
              <p style={styles.bookingFooterNote}>A Meetup concierge will follow up within 12 hours to lock in the date and assist with any requests.</p>
            </div>
            <div style={styles.modalActions} className="modal-actions">
              <button 
                style={{ ...styles.viewBtn, flex: 1, borderRadius: 12 }} 
                className="btn-close"
                onClick={() => setOrderOpen(false)}
              >
                Cancel
              </button>
              <button 
                style={{ ...styles.modalBookBtn, flex: 1, borderRadius: 12, opacity: orderReady ? 1 : 0.6, cursor: orderReady ? 'pointer' : 'not-allowed' }} 
                className="btn-book-now"
                onClick={handleSubmitOrder}
                disabled={!orderReady}
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </div>
      )}
;
text = text.slice(0, start) + newBlock + text.slice(end);
fs.writeFileSync(path, text);
