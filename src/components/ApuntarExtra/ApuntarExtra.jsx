import React, { useEffect, useState } from 'react'
import Usefetch from '../Customhook/Usefetch'
import { useForm } from 'react-hook-form'
import './ApuntarExtra.css'

const ApuntarExtra = () => {
  const [Showextraform, setShowextraform] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const { loading, error, fetchdata, data } = Usefetch()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const today = new Date().toISOString().split('T')[0]
  const staff = JSON.parse(localStorage.getItem('staff'))
  const staffid = staff?._id

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false)
      setShowextraform(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  const apuntarextra = async (formdata) => {
    const payload = {
      name_of_the_staff: staffid,
      fecha: formdata.fecha,
      hours: Number(formdata.hours),
      lugar: formdata.lugar
    }

    const endpoint = `/api/v1/extrahour/${staffid}`
    const token = localStorage.getItem('token')
    const options = {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
    setIsSubmitting(true)
    await fetchdata(endpoint, options)
  }

  useEffect(() => {
    if (!loading && isSubmitting) {
      setIsSubmitting(false)
    }
  }, [loading, isSubmitting])

  const errorMessage =
    error === 'Error: 400'
      ? 'Invalid date format or invalid time.'
      : error === 'Error: 404'
      ? 'Staff member not found.'
      : 'An unknown error occurred.'

  return (
    <div className='apuntarextra'>
      {initialLoading && (
        <div className='loading-container'>
          <img
            className='loading_img'
            src='https://thoughtsonprogramming.wordpress.com/wp-content/uploads/2018/11/spinner.gif'
            alt='Loading...'
          />
          <p>Loading form...</p>
        </div>
      )}

      {isSubmitting && !initialLoading && (
        <div className='loading-container'>
          <img
            className='loading_img'
            src='https://thoughtsonprogramming.wordpress.com/wp-content/uploads/2018/11/spinner.gif'
            alt='Submitting...'
          />
          <p>Submitting...</p>
        </div>
      )}

      {Showextraform && !isSubmitting && !data && !error && (
        <form
          onSubmit={handleSubmit(apuntarextra)}
          className='Apuntarextraform'
        >
          <input
            type='hidden'
            id='name_of_the_staff'
            value={staffid || ''}
            {...register('name_of_the_staff')}
          />
          <label htmlFor='fecha'>Enter date of your extra hours</label>
          <input
            id='fecha'
            type='date'
            max={today}
            {...register('fecha', { required: 'Please enter a date' })}
          />
          {errors.fecha && (
            <p style={{ color: 'red' }}>{errors.fecha.message}</p>
          )}

          <label htmlFor='hours'>Enter total hours of your extra hours</label>
          <input
            id='hours'
            type='number'
            {...register('hours', {
              required: 'Please enter your extra hours'
            })}
          />
          {errors.hours && (
            <p style={{ color: 'red' }}>{errors.hours.message}</p>
          )}

          <label htmlFor='lugar'>Enter the place of your work</label>
          <input
            id='lugar'
            type='text'
            {...register('lugar', {
              required: 'Please enter the place of work'
            })}
          />
          {errors.lugar && (
            <p style={{ color: 'red' }}>{errors.lugar.message}</p>
          )}

          <button type='submit' className='general' disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      )}

      {data && !initialLoading && (
        <div className='Apuntarextrasuccess'>
          <p>You successfully created your extra, {staff.name}.</p>
          <button onClick={() => window.location.reload()} className='goback'>
            Go back
          </button>
        </div>
      )}

      {error && !initialLoading && (
        <div>
          <p style={{ color: 'red' }}>{errorMessage}</p>
          <button onClick={() => window.location.reload()} className='goback'>
            Go back
          </button>
        </div>
      )}
    </div>
  )
}

export default ApuntarExtra
