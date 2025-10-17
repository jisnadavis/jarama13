import React, { useEffect, useState } from 'react'
import Usefetch from '../Customhook/Usefetch'
import './Getevent.css'

const Getevents = () => {
  const { error, fetchdata, data } = Usefetch()
  const [Showevents, Setshowevents] = useState(false)
  const [loading, setLoading] = useState(false) // 👈 New state for loading

  const endpoint = '/api/v1/eventos'
  const token = localStorage.getItem('token')
  const options = {
    method: 'get',
    headers: {
      Authorization: `bearer ${token}`
    }
  }

  useEffect(() => {
    setLoading(true) // 👈 Show loading when starting fetch
    fetchdata(endpoint, options)
      .then(() => {
        Setshowevents(true)
      })
      .finally(() => {
        setLoading(false) // 👈 Hide loading after fetch completes
      })
  }, [])

  const errorMessage =
    error === 'Error: 400'
      ? 'Cannot show any events only authorized persons can see the events'
      : 'Unknown error'

  return (
    <div className='eventcontainer'>
      {loading && (
        <div className='loading'>
          <img
            src='https://thoughtsonprogramming.wordpress.com/wp-content/uploads/2018/11/spinner.gif'
            alt='Loading...'
            className='loading_img'
          />{' '}
          <p>Loading events...</p>
        </div>
      )}

      {Showevents && !loading && (
        <div className='eventparticular'>
          {Array.isArray(data) &&
            data.map((event) => (
              <div key={event._id} className='eventimg'>
                <img src={event.eventimg} alt={event.title} />
                <div className='eventdes'>
                  <h1>{event.title}</h1>
                  <h2>date: {event.date.split('T')[0]}</h2>
                  <h3>pax: {event.Number_of_attendees}</h3>
                  <p>{event.description}</p>
                </div>
              </div>
            ))}
        </div>
      )}

      {error && !loading && (
        <div className='eventerror'>
          <p style={{ color: 'red' }}>{errorMessage}</p>
          <button
            onClick={() => {
              window.location.href = '/'
            }}
            className='goback'
          >
            Go back
          </button>
        </div>
      )}
    </div>
  )
}

export default Getevents
