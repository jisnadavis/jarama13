import React from 'react'
import './Home.css'
const Home = () => {
  return (
    <div className='Homecontainer'>
      <img
        className='background-image'
        src='https://images.squarespace-cdn.com/content/v1/5e29c65c4c22026b05a85704/1589220793923-SO1JPZ8ZS756B2831F6I/Cafe+Website+Background+straight+lines-06.png'
        alt='Background'
      />

      <h1 className='heading'> Impulsa tu Carrera en la Hostelería:</h1>
      <div className='animation-container'>
        <div className='a01'>La felicidad empieza</div>
        <div className='a02'>a traves del paladar</div>
      </div>
    </div>
  )
}

export default Home
