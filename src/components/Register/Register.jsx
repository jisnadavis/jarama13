import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Usefetch from '../Customhook/Usefetch'
import './Register.css'

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()
  const { data, error, loading, fetchdata } = Usefetch()
  const [showForm, setShowForm] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')
  const submitForm = (formdata) => {
    const endpoint = '/api/v1/staffs/'
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formdata)
    }
    setIsSubmitting(true)
    setApiError('')
    fetchdata(endpoint, options)
  }
  useEffect(() => {
    if (!loading && isSubmitting) {
      setIsSubmitting(false)
    }
  }, [loading, isSubmitting])
  const errorMessage =
    error === 'Error: 409'
      ? 'The email is already registered.'
      : 'cant not register the staff'
  const handleinputchange = () => {
    if (apiError) setApiError('')
  }
  return (
    <div className='register-formcontainer'>
      {isSubmitting && (
        <img
          src='https://thoughtsonprogramming.wordpress.com/wp-content/uploads/2018/11/spinner.gif'
          className='loading-image'
          alt='Loading...'
        />
      )}
      {showForm && !isSubmitting && !data && !error && (
        <form className='register-form' onSubmit={handleSubmit(submitForm)}>
          <label htmlFor='name'> Enter your Name:</label>
          <input
            type='text'
            id='name'
            name='name'
            {...register('name', { required: 'Name is required' })}
            onChange={handleinputchange}
          />
          {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
          <label htmlFor='apellidos'>Enter your apellidos</label>
          <input
            type='text'
            id='apellidos'
            name='apellidos'
            {...register('apellidos', { required: 'Apellidos is required' })}
            onChange={handleinputchange}
          />
          {errors.apellidos && (
            <p style={{ color: 'red' }}>{errors.apellidos.message}</p>
          )}
          <label htmlFor='email'>Enter your email id:</label>
          <input
            type='text'
            id='email'
            name='email'
            {...register('email', {
              required: 'Please enter your email ID',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
              }
            })}
            style={{ borderColor: errors.email ? 'red' : 'black' }}
            onChange={handleinputchange}
          />
          {errors.email && (
            <p style={{ color: 'red' }}>{errors.email.message}</p>
          )}

          <label htmlFor='NIE'>Enter your NIE</label>
          <input
            type='text'
            id='NIE'
            {...register('NIE', {
              required: 'Please enter your NIE',
              pattern: {
                value: /^[A-Za-z][0-9]{7}[A-Za-z]$/,
                message: 'Please enter a valid NIE'
              }
            })}
            onChange={handleinputchange}
          />
          {errors.NIE && <p style={{ color: 'red' }}>{errors.NIE.message}</p>}
          <label htmlFor='dirreccion'>Enter your direccion</label>
          <input
            type='text'
            id='dirreccion'
            {...register('dirreccion', {
              required: 'Please enter your direccion'
            })}
            onChange={handleinputchange}
          />
          {errors.dirreccion && (
            <p style={{ color: 'red' }}>{errors.dirreccion.message}</p>
          )}
          <label htmlFor='password'>Enter your password</label>
          <input
            type='password'
            id='password'
            {...register('password', {
              required: 'Please enter your password'
            })}
          />
          {errors.password && (
            <p style={{ color: 'red' }}>{errors.password.message}</p>
          )}
          <button type='submit' className='general'>
            Submit
          </button>
        </form>
      )}
      {data && (
        <div className='successs'>
          <p>You are successfully registered, {data.name}.</p>
          <button
            onClick={() => {
              setIsSubmitting(false)
              window.location.href = '/login'
            }}
            className='goback'
          >
            login
          </button>
        </div>
      )}
      {error && (
        <div className='registererror'>
          <p style={{ color: 'red' }}>{errorMessage}</p>
          <button
            onClick={() => {
              setShowForm(true)
              setIsSubmitting(false)
              window.location.reload()
            }}
            className='goback'
          >
            go back
          </button>
        </div>
      )}
    </div>
  )
}

export default Register
