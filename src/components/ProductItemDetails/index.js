import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productsList: {},
    quantity: 1,
    similarProductsData: [],
    apiStatus: apiStatusConstants.inProgress,
  }

  componentDidMount() {
    this.fetchData()
  }

  formatData = data => ({
    id: data.id,
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  fetchData = async () => {
    const {match} = this.props
    const {id} = match.params
    const jwtToken = Cookies.get('jwt_token')
    const option = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(`https://apis.ccbp.in/products/${id}`, option)
    if (response.ok) {
      const fetchedData = await response.json()
      console.log(fetchedData)
      const updatedData = this.formatData(fetchedData)
      const updatedSimilarProductsData = fetchedData.similar_products.map(
        eachProduct => this.formatData(eachProduct),
      )
      this.setState({
        productsList: updatedData,
        similarProductsData: updatedSimilarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    }

    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  increment = () => {
    this.setState(prevState => ({
      quantity: prevState.quantity + 1,
    }))
  }

  decrement = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({
        quantity: prevState.quantity - 1,
      }))
    }
  }

  rendersuccessView = () => {
    const {similarProductsData, productsList} = this.state
    const {
      imageUrl,
      title,
      brand,
      totalReviews,
      rating,
      availability,
      price,
      description,
    } = productsList
    const {quantity} = this.state
    return (
      <div className="success-container">
        <div className="first-container">
          <img src={imageUrl} className="src-image" alt="product" />
          <div className="first-content">
            <h1 className="first-heading">{title}</h1>
            <p className="first-price">Rs {price}/- </p>
            <div className="rating-holder">
              <div className="rating">
                <p className="para">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  className="star-img"
                  alt="star"
                />
              </div>
              <p className="review">{totalReviews} Reviews</p>
            </div>
            <p className="first-para">{description}</p>
            <p className="review">
              <span className="first-bold">Available: </span>
              {availability}
            </p>
            <p className="review">
              <span className="first-bold">Brand: </span>
              {brand}
            </p>
            <hr />
            <div className="quantity-holder">
              <button type="button" className="btn" data-testid="minus">
                <BsDashSquare className="btn-icons" onClick={this.decrement} />
              </button>
              <p className="number">{quantity}</p>
              <button type="button" className="btn" data-testid="plus">
                <BsPlusSquare className="btn-icons" onClick={this.increment} />
              </button>
            </div>
            <button type="button" className="add-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-heading">Similar Products</h1>
        <ul className="similar-list">
          {similarProductsData.map(eachItem => (
            <SimilarProductItem key={eachItem.id} productDetails={eachItem} />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-view">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="failure-img"
      />
      <h1 className="failure-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="continue-shopping">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderLoaderView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderProductDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.rendersuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          {this.renderProductDetails()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
