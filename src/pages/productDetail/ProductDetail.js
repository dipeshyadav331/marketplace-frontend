import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import dummyImg from "../../assets/naruto.jpeg";
import { axiosClient } from "../../utils/axiosClient";
import "./ProductDetail.scss";
import Loader from "../../components/loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../redux/cartSlice";
import { loadStripe } from "@stripe/stripe-js";

function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cartReducer.cart);
  const quantity =
    cart.find((item) => item.key === params.productId)?.quantity || 0;

  let totalAmount = 0;
  cart.forEach((item) => (totalAmount += item.quantity * item.price));
  const isCartEmpty = cart.length === 0;

  async function handleCheckout() {
    try {
      const response = await axiosClient.post("/orders", {
        products: cart,
      });

      const stripe = await loadStripe(
        `${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`
      );
      const data = await stripe.redirectToCheckout({
        sessionId: response.data.stripeId,
      });

      console.log("stripe data", data);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchData() {
    const productResponse = await axiosClient.get(
      `/products?filters[key][$eq]=${params.productId}&populate=*`
    );
    if (productResponse.data.data.length > 0) {
      setProduct(productResponse.data.data[0]);
    }
  }

  useEffect(() => {
    setProduct(null);
    fetchData();
  }, [params]);

  if (!product) {
    return <Loader />;
  }

  return (
    <div className="ProductDetail">
      <div className="container">
        <div className="product-layout">
          <div className="product-img">
            <img
              src={product?.attributes.image.data.attributes.url}
              alt="product img"
            />

            <div className="product-info">
              <h1 className="heading">{product?.attributes.title}</h1>
              <h3 className="price">₹ {product?.attributes.price}</h3>
              <p className="description">{product?.attributes.desc}</p>
              <div className="cart-options">
                <div className="quantity-selector">
                  <span
                    className="btn decrement"
                    onClick={() => dispatch(removeFromCart(product))}
                  >
                    -
                  </span>
                  <span className="quantity">{quantity}</span>
                  <span
                    className="btn increment"
                    onClick={() => dispatch(addToCart(product))}
                  >
                    +
                  </span>
                </div>
                <button
                  className="btn-primary add-to-cart"
                  onClick={() => dispatch(addToCart(product))}
                >
                  Add to Cart
                </button>
              </div>
            </div>

            {!isCartEmpty && (
              <div className="checkout-infoo">
                <div className="total-amount">
                  <h3 className="total-message">Total:</h3>
                  <h3 className="total-value">₹ {totalAmount}</h3>
                </div>
                <div className="checkout btn-primary" onClick={handleCheckout}>
                  Checkout now
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
