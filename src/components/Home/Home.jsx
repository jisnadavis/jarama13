import React from 'react'
import './Home.css'

const Home = () => {
  return (
    <div className='Homecontainer'>
      <h1 className='heading'> Welcome to Jarama Catering</h1>

      <h2 className='subheading'>
        Manage your tasks and stay up to date in the restaurant
      </h2>

      <div className='description'>
        <div className='details'>
          <h3>Services</h3>
          <p>
            We organize weddings, corporate events, and personalized
            celebrations with an expert team.
          </p>
          <div className='imagehome'></div>
          <a
            href='https://mail.google.com/mail/?view=cm&fs=1&to=jaramacatering@gmail.com'
            target='_blank'
            rel='noopener noreferrer'
          >
            <button>Contact Us</button>
          </a>
        </div>

        <div className='details'>
          <h3>Join Our Team</h3>
          <p>Be part of our professional kitchen and service team.</p>
          <div className='imagehome1'></div>
          <a
            href='https://mail.google.com/mail/?view=cm&fs=1&to=jaramacatering@gmail.com'
            target='_blank'
            rel='noopener noreferrer'
          >
            <button>Send CV</button>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Home
