import React, { useEffect, useState } from 'react'
import Usefetch from '../Customhook/Usefetch'
import './Getproductsbycategory.css'
const Getproductsbycategory = () => {
  const { data, fetchdata, error } = Usefetch()
  const [showproducts, setShowproducts] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [filteredProducts, setFilteredProducts] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowproducts(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  const endpoint = '/api/v1/products'
  const token = localStorage.getItem('token')
  const options = {
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  useEffect(() => {
    fetchdata(endpoint, options)
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      const filtered = (data || []).filter(
        (product) => product.categoria === selectedCategory
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(data || [])
    }
  }, [selectedCategory, data])

  const errorMessage =
    error === 'Error: 400'
      ? 'Cannot show any products, only authorized persons can view the products'
      : 'Unknown error'

  const categories = [
    'salsa',
    'verdura',
    'pescado',
    'limpieza',
    'carne',
    'cafe',
    'bebida',
    'cerveza',
    'vino',
    'whisky',
    'gin',
    'agua',
    'zumo',
    'tonico'
  ]

  const handleSearchClick = () => {
    setShowSearchResults(true)
  }

  const handleGoBack = () => {
    setShowSearchResults(false)
    setSelectedCategory('')
  }

  return (
    <div className='getproducts_category'>
      {!showproducts && !error && (
        <img
          className='loading_img'
          src='https://thoughtsonprogramming.wordpress.com/wp-content/uploads/2018/11/spinner.gif'
          alt='loading'
        />
      )}

      {showproducts && !showSearchResults && (
        <div className='productparticular'>
          <div className='category-filter'>
            <label>Select Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value=''>--Choose Category--</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <button onClick={handleSearchClick} className='general'>
              Search
            </button>
          </div>
        </div>
      )}
      {showSearchResults && (
        <>
          <div className='filterdproducts'>
            {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product._id} className='productdescription'>
                  <div className='eventdes'>
                    <h1>{product.name_of_the_products}</h1>
                    <div className='pdes'>
                      <h2>
                        Expiry:{' '}
                        {
                          new Date(product.fecha_de_caducidad)
                            .toISOString()
                            .split('T')[0]
                        }
                      </h2>
                    </div>
                    <div className='pdes'>
                      <h3>Category:{product.categoria}</h3>
                    </div>
                    <div className='pdes'>
                      <h3>Provider:{product.provedor}</h3>
                    </div>
                    <div className='pdes'>
                      <h3>Stock:{product.stock}</h3>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No products available for this category.</p>
            )}
          </div>

          <div className='gobackk'>
            <button onClick={handleGoBack}>Go Back</button>
          </div>
        </>
      )}

      {error && (
        <div>
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

export default Getproductsbycategory
