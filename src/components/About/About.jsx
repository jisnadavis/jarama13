import React from 'react'
import './About.css'
const About = () => {
  return (
    <div className='aboutcontainer'>
      <h1>About us</h1>
      <h2>
        At JARAMA, we combine great food with smart management. Our team is at
        the heart of everything we do, and we make sure every detail is well
        organized:
      </h2>

      <div className='aboutlist'>
        <ul>
          <li>
            👨‍🍳 Staff Management – keep track of staff details, duties, and extra
            hours
          </li>
          <li>
            📅 Events – plan upcoming restaurant events and team activities...
          </li>
          <li>
            📦Stock Control – manage product details and inventory to ensure
            freshness.
          </li>
        </ul>
      </div>
    </div>
  )
}

export default About
