import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import styled from "styled-components";
import { FiCreditCard, FiMapPin, FiClock, FiInfo, FiCheckCircle } from "react-icons/fi";
import Header from "../../../components/Header";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import { useAuth } from "../../../contexts/AuthContext";
import { useCart } from "../../../contexts/CartContext";

const CheckoutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null); // Pour afficher l'erreur de paiement
  const { currentUser } = useAuth();
  const { cartItems, updateItemQuantity, removeItem, clearCart, getCartTotal, restaurant } = useCart();
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    additionalInfo: ""
  });

  // Populating delivery info if user data exists
  useEffect(() => {
    if (currentUser) {
      setDeliveryInfo({
        address: currentUser.Address || "",
        city: currentUser.City || "",
        postalCode: currentUser.PostalCode || "",
        phone: currentUser.Phone || "",
        additionalInfo: currentUser.AdditionalInfo || ""
      });
    }
  }, [currentUser]);

  const subtotal = getCartTotal();
  const deliveryFee = restaurant ? restaurant.deliveryFee || 2.99 : 2.99;
  const total = subtotal + deliveryFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      updateItemQuantity(item.id, item.quantity - 1);
    } else {
      removeItem(item.id);
    }
  };

 };

  const handleIncrease = (item) => {
    updateItemQuantity(item.id, item.quantity + 1);
  };

  const handleContinue = () => {
    setShowDeliveryForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaymentError(null); // Réinitialiser l'erreur

    if (!stripe || !elements) {
      console.error("Stripe ou Elements non chargé");
      setPaymentError("Le module de paiement n'est pas prêt. Veuillez réessayer.");
      return;
    }

  // Récupérer l'élément CardElement monté
  const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      console.error("CardElement non trouvé");
      setPaymentError("Erreur interne du formulaire de paiement.");
      return;
    }
  
    // Vérifier les informations de livraison (déjà dans votre code)
    if (!deliveryInfo.address || !deliveryInfo.city || !deliveryInfo.postalCode || !deliveryInfo.phone) {
      alert("Veuillez remplir toutes les informations de livraison.");
      return;
    }

    setLoading(true);

    try {
      // Create order data
      const orderData = {
        restaurantId: restaurant?.id,
        items: cartItems.map(item => ({
          id: item.id,
          quantity: item.quantity,
          options: item.options
        })),
        deliveryInfo: {
          ...deliveryInfo,
          firstName: currentUser?.FirstName || "",
          lastName: currentUser?.LastName || ""
        },
        total
      };

      const orderId = `ORDER-${Date.now()}`;

      const res = await fetch("http://localhost:8006/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          order_id: orderId,
          amount: total,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Erreur backend");
        setLoading(false);
        return;
      }

      const clientSecret = data.client_secret;

      // 2. Confirmer le paiement côté client avec le clientSecret
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            // Inclure des détails si nécessaire/souhaité
            name: `${currentUser?.FirstName || ''} ${currentUser?.LastName || ''}`.trim(),
            email: currentUser?.Email || '',
            phone: deliveryInfo.phone,
            address: {
                line1: deliveryInfo.address,
                city: deliveryInfo.city,
                postal_code: deliveryInfo.postalCode,
                country: 'FR', // Ou basé sur la localisation
            },
          },
        },
      });

      // 3. Résultat
      if (result.error) {
        // Afficher l'erreur de Stripe à l'utilisateur
        console.error("Erreur Stripe:", result.error.message);
        setPaymentError(`Erreur de paiement : ${result.error.message}`);
      } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        console.log("Paiement réussi:", result.paymentIntent);
        console.log("Commande soumise:", orderData);
        clearCart();
        navigate(`/order/tracking/${orderId}`);
      } else {
        console.warn("Statut inattendu:", result.paymentIntent?.status);
        setPaymentError("Le paiement n'a pas pu être complété. Statut: " + result.paymentIntent?.status);
      }
    } catch (error) {
      console.error("Erreur globale dans handleSubmit:", error);
      setPaymentError(error.message || "Une erreur inattendue est survenue.");
    } finally {
      setLoading(false);
    }

  if (cartItems.length === 0) {
    return (
      <>
        <Header />
        <CheckoutContainer>
          <Section>
            <SectionTitle>Votre panier</SectionTitle>
            <CartEmpty>
              <p>Votre panier est vide</p>
              <ContinueButton onClick={() => navigate("/restaurants")}>
                Parcourir les restaurants
              </ContinueButton>
            </CartEmpty>
          </Section>
        </CheckoutContainer>
      </>
    );
  }

  return (
    <>
      <Header />
      <CheckoutContainer>
        <CheckoutGrid>
          <CartSection>
            <SectionTitle>
              Votre panier
              {restaurant && <span>de {restaurant.name}</span>}
            </SectionTitle>

            {cartItems.map(item => (
              <CartItem key={item.id}>
                <ItemImage>
                  {item.image && <img src={item.image} alt={item.name} />}
                </ItemImage>
                <ItemDetails>
                  <ItemName>{item.name}</ItemName>
                  {item.options && Object.entries(item.options).length > 0 && (
                    <ItemOptions>
                      {Object.entries(item.options).map(([key, value]) => (
                        `${key}: ${value}`
                      )).join(", ")}
                    </ItemOptions>
                  )}
                  <QuantityControl>
                    <QuantityButton onClick={() => handleDecrease(item)}>-</QuantityButton>
                    <Quantity>{item.quantity}</Quantity>
                    <QuantityButton onClick={() => handleIncrease(item)}>+</QuantityButton>
                  </QuantityControl>
                </ItemDetails>
                <ItemPrice>{(item.price * item.quantity).toFixed(2)} €</ItemPrice>
              </CartItem>
            ))}

            {!showDeliveryForm && (
              <ContinueButton onClick={handleContinue}>
                Continuer
              </ContinueButton>
            )}
          </CartSection>

          {showDeliveryForm && (
            <DeliverySection>
              <SectionTitle>Informations de livraison</SectionTitle>
              <form onSubmit={handleSubmit}>
                <FormGrid>
                  <FullWidth>
                    <Input
                      label="Adresse de livraison"
                      name="address"
                      value={deliveryInfo.address}
                      onChange={handleInputChange}
                      required
                    />
                  </FullWidth>
                  <Input
                    label="Ville"
                    name="city"
                    value={deliveryInfo.city}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Code postal"
                    name="postalCode"
                    value={deliveryInfo.postalCode}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Téléphone"
                    name="phone"
                    value={deliveryInfo.phone}
                    onChange={handleInputChange}
                    required
                  />
                  <FullWidth>
                    <Input
                      label="Instructions supplémentaires"
                      name="additionalInfo"
                      value={deliveryInfo.additionalInfo}
                      onChange={handleInputChange}
                      placeholder="Étage, code d'entrée, etc."
                    />
                  </FullWidth>
                </FormGrid>
                <CheckoutButton
                  type="button" // Change type to button if not using form submission directly
                  onClick={handleSubmit} // Déclencher la logique ici
                  disabled={!stripe || !elements || loading || !deliveryInfo.address || !deliveryInfo.city || !deliveryInfo.postalCode || !deliveryInfo.phone}
                     >
                  {loading ? "Traitement..." : `Payer ${total.toFixed(2)} €`}
                </CheckoutButton>
              </form>
            </DeliverySection>
          )}

          <OrderSummary>
            <SectionTitle>Récapitulatif</SectionTitle>
            <PriceRow>
              <span>Sous-total</span>
              <span>{subtotal.toFixed(2)} €</span>
            </PriceRow>
            <PriceRow>
              <span>Frais de livraison</span>
              <span>{deliveryFee.toFixed(2)} €</span>
            </PriceRow>
            <PriceRow>
              <span>Total</span>
              <span>{total.toFixed(2)} €</span>
            </PriceRow>
          </OrderSummary>
        </CheckoutGrid>
      </CheckoutContainer>
    </>
  );
};

export default Checkout;