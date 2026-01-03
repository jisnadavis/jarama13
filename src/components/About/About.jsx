import React from 'react'
import './About.css'
const About = () => {
  return (
    <div className='aboutcontainer'>
      <h2>
        At Jarama Catering, we specialize in delivering high-quality food and
        exceptional service for events of all sizes.
      </h2>

      <p>
        With years of experience in the hospitality industry, our team is
        committed to creating memorable culinary experiences while maintaining
        the highest standards of organization and professionalism.
      </p>
      <div className='aboutlist'>
        <ul>
          <li>🍽️ 🍽️ Professional catering for private and corporate events</li>
          <li>👨‍🍳 👨‍🍳👨‍🍳 Experienced chefs and service staff</li>
          <li>📍 📍 Customized menus tailored to every occasion</li>
          <li>⭐ ⭐ Commitment to quality, teamwork, and excellence</li>
        </ul>
      </div>
    </div>
  )
}

export default About
