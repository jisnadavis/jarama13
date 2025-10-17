import React, { useEffect, useState } from 'react'
import Usefetch from '../Customhook/Usefetch'
import './Deleteproduct.css'

const Deleteproduct = () => {
  const { data, fetchdata, loading } = Usefetch()
  const [selectedCategory, setSelectedCategory] = useState('')
  const [filteredProducts, setFilteredProducts] = useState([])
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isCategorySelected, setIsCategorySelected] = useState(false)

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

  const token = localStorage.getItem('token')

  // Fetch products based on category
  const handleSearchClick = async () => {
    if (selectedCategory) {
      try {
        await fetchdata(`/api/v1/products/${selectedCategory}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` }
        })
        setIsCategorySelected(true)
        setErrorMessage('')
      } catch {
        setErrorMessage('Failed to fetch products. Please try again.')
      }
    }
  }

  useEffect(() => {
    setFilteredProducts(Array.isArray(data) ? data : [])
  }, [data])

  // Delete a product
  const handleDelete = async (productId) => {
    if (!productId) return

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this product?'
    )

    if (!confirmDelete) return

    try {
      await fetchdata(`/api/v1/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setSuccessMessage('Product deleted successfully!')

      await fetchdata(`/api/v1/products/${selectedCategory}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch {
      setErrorMessage('Failed to delete product. Please try again.')
    }
  }

  const handleGoBack = () => {
    setIsCategorySelected(false)
    setFilteredProducts([])
    setSelectedCategory('')
    setSuccessMessage('')
    setErrorMessage('')
  }

  return (
    <div className='delete-product-container'>
      {!isCategorySelected && (
        <>
          <div className='selectt'>
            <label>Select Category:</label>
            <select onChange={(e) => setSelectedCategory(e.target.value)}>
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
        </>
      )}

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {loading && <p className='load'>Loading products...</p>}

      {isCategorySelected && filteredProducts.length > 0 && (
        <div className='product-list'>
          <h3>Select a Product to Delete:</h3>
          {filteredProducts.map((product) => (
            <div key={product._id} className='product-itemm'>
              <span>{product.name_of_the_products}</span>
              <button
                onClick={() => handleDelete(product._id)}
                className='delete-btn'
              >
                Delete
              </button>
            </div>
          ))}
          <button onClick={handleGoBack} className='go-back-btn'>
            Go Back
          </button>
        </div>
      )}

      {isCategorySelected && filteredProducts.length === 0 && !loading && (
        <div>
          <p style={{ color: 'red' }}>
            No products found in the selected category.
          </p>
          <button onClick={handleGoBack} className='go-back-btn'>
            Go Back
          </button>
        </div>
      )}

      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  )
}

export default Deleteproduct
