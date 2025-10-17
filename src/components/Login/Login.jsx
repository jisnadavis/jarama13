import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Usefetch from '../Customhook/Usefetch'
import './Login.css'

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const { data, error, loading, fetchdata } = Usefetch()
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [apiError, setApiError] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowForm(true)
    }, 10)
    return () => clearTimeout(timer)
  }, [])

  const submitForm = (formdata) => {
    const endpoint = '/api/v1/staffs/login'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formdata)
    }
    setSubmitting(true)
    setApiError('')
    fetchdata(endpoint, options)
  }

  useEffect(() => {
    if (!loading && submitting && data) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('staff', JSON.stringify(data.staff))
      setSubmitting(false)
      setTimeout(() => {
        window.location.href = '/'
      }, 1500)
    } else if (!loading && submitting && error) {
      setSubmitting(false)
      setApiError(
        error === 'Error: 400'
          ? 'Invalid email or password'
          : 'Cannot login the staff'
      )
    }
  }, [loading, submitting, data, error])

  const handleInputChange = () => {
    if (apiError) setApiError('')
  }

  return (
    <div className='login-container'>
      {submitting && !data && !apiError && (
        <div className='loading'>
          <img
            src='https://thoughtsonprogramming.wordpress.com/wp-content/uploads/2018/11/spinner.gif'
            className='loading-image'
            alt='Loading...'
          />
          <p>Logging in...</p>
        </div>
      )}

      {(!submitting || apiError) && showForm && !data && (
        <form className='login-form' onSubmit={handleSubmit(submitForm)}>
          <label htmlFor='email'>Enter your email id:</label>
          <input
            type='text'
            id='email'
            {...register('email', { required: 'Please enter your email ID' })}
            onChange={handleInputChange}
          />
          {errors.email && (
            <p style={{ color: 'red' }}>{errors.email.message}</p>
          )}

          <label htmlFor='password'>Enter your password</label>
          <input
            type='password'
            id='password'
            {...register('password', {
              required: 'Please enter your password'
            })}
            onChange={handleInputChange}
          />
          {errors.password && (
            <p style={{ color: 'red' }}>{errors.password.message}</p>
          )}

          <button type='submit' className='general'>
            Login
          </button>

          {apiError && (
            <p style={{ color: 'red', marginTop: '1rem' }}>{apiError}</p>
          )}
        </form>
      )}

      {data && (
        <div className='success-message'>
          <h2>Login successful!</h2>
          <p>Welcome back, {data.staff.name}!</p>
        </div>
      )}
    </div>
  )
}

export default Login
