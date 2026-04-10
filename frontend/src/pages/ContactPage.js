import { useState } from 'react';
import Nav from '../components/Nav';  // ← make sure this line exists

function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all fields.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <>
      <Nav />   {/* ← make sure this line exists */}
      <div className="contact-page">
        <h1>Contact Us</h1>
        {submitted ? (
          <p className="success-msg">Thank you, {formData.name}! We'll get back to you soon.</p>
        ) : (
          <div className="form">
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" />
            <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Your message..." />
            <button onClick={handleSubmit}>Send Message</button>
          </div>
        )}
      </div>
    </>
  );
}

export default ContactPage;