import dayjs from "dayjs";
import axios from "axios";
import { useState } from "react";
import { formatMoney } from "../../utils/money";
import { DeliveryOptions } from "./DeliveryOptions";

export function OrderSummary({ cart, deliveryOptions, loadCart }) {
  const [editingProductId, setEditingProductId] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const updateQuantity = async (productId) => {
    await axios.put(`/api/cart-items/${productId}`, {
      quantity: Number(quantity)
    });

    await loadCart();
    setEditingProductId(null);
  };

  return (
    <div className="order-summary">
      {deliveryOptions.length > 0 && cart.map((cartItem) => {
        const selectedDeliveryOption = deliveryOptions
          .find((deliveryOption) => {
            return deliveryOption.id === cartItem.deliveryOptionId;
          });

        const deleteCartItem = async () => {
          await axios.delete(`/api/cart-items/${cartItem.productId}`);
          await loadCart();
        };

        return (
          <div key={cartItem.productId} className="cart-item-container">
            <div className="delivery-date">
              Delivery date: {dayjs(selectedDeliveryOption.estimatedDeliveryTimeMs).format('dddd, MMMM D')}
              Tuesday, June 21
            </div>

            <div className="cart-item-details-grid">
              <img className="product-image"
                src={cartItem.product.image} />

              <div className="cart-item-details">
                <div className="product-name">
                  {cartItem.product.name}
                </div>
                <div className="product-price">
                  {formatMoney(cartItem.product.priceCents)}
                </div>
                <div className="product-quantity">

                  {editingProductId === cartItem.productId ? (
                    <>
                      Quantity:
                      <input
                        type="number"
                        className="quantity-input"
                        min="1"
                        max="10"
                        value={quantity}
                        onChange={(event) => {
                          setQuantity(event.target.value);
                        }}
                      />

                      <span
                        className="update-quantity-link link-primary"
                        onClick={() => updateQuantity(cartItem.productId)}
                      >
                        Save
                      </span>
                    </>
                  ) : (
                    <>
                      Quantity:
                      <span className="quantity-label">
                        {cartItem.quantity}
                      </span>

                      <span
                        className="update-quantity-link link-primary"
                        onClick={() => {
                          setEditingProductId(cartItem.productId);
                          setQuantity(cartItem.quantity);
                        }}
                      >
                        Update
                      </span>
                    </>
                  )}

                  <span
                    className="delete-quantity-link link-primary"
                    onClick={deleteCartItem}
                  >
                    Delete
                  </span>

                </div>
              </div>

              <DeliveryOptions deliveryOptions={deliveryOptions} cartItem={cartItem} loadCart={loadCart} />
            </div>
          </div>
        );
      })}
    </div>
  );
}