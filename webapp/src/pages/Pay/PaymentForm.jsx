import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

// Importer les layouts et le hook useIsMobile
import useIsMobile from '../../hooks/useIsMobile';
import MobileLayout from '../../mobile/components/MobileLayout/MobileLayout';
import { Header, Footer } from '../../desktop/components';

// Styles (assurez-vous d'avoir un fichier CSS ou d'utiliser styled-components, etc.)
import './Payment.css';

// Clé publique Stripe
const stripePromise = loadStripe('pk_test_VOTRE_CLE_PUBLIQUE');
const PAYMENT_MICROSERVICE_URL = 'http://localhost:8006';

// --- Le composant interne qui contient le formulaire ---
// Il a besoin d'être dans un composant séparé *même si c'est dans le même fichier*
// car il doit être enfant de <Elements> et utiliser useStripe/useElements
const CheckoutForm = ({ amount, orderId, clientSecret, onPaymentSuccess, onPaymentError }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!stripe || !elements || !cardComplete) {
      if (!cardComplete) setError("Veuillez compléter les informations de votre carte.");
      return;
    }

    setLoading(true);
    const cardElement = elements.getElement(CardElement);

    try {
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (confirmError) {
        setError(`Erreur de paiement : ${confirmError.message}`);
        if (onPaymentError) onPaymentError(confirmError);
      } else if (paymentIntent.status === 'succeeded') {
        console.log('Paiement réussi (interne):', paymentIntent);
        if (onPaymentSuccess) onPaymentSuccess(paymentIntent);
      } else {
         setError(`Statut inattendu : ${paymentIntent.status}`);
         if (onPaymentError) onPaymentError({ message: `Statut inattendu : ${paymentIntent.status}`});
      }
    } catch (err) {
        console.error("Erreur inattendue", err);
        setError("Une erreur technique est survenue.");
        if (onPaymentError) onPaymentError(err);
    } finally {
       setLoading(false);
    }
  };

  const cardElementOptions = { /* ... styles pour CardElement ... */ };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="form-row">
        <label htmlFor="card-element">Carte de crédit ou débit</label>
        <CardElement
          id="card-element"
          options={cardElementOptions}
          onChange={(e) => {
            setError(e.error ? e.error.message : "");
            setCardComplete(e.complete);
          }}
        />
      </div>
      {error && <div className="card-error" role="alert">{error}</div>}
      <button type="submit" disabled={!stripe || loading || !cardComplete} className="submit-button">
        {loading ? <div className="spinner"></div> : `Payer ${amount} EUR`}
      </button>
    </form>
  );
};


// --- Le composant Page principal ---
const PaymentForm = () => {
  const [clientSecret, setClientSecret] = useState('');
  const [loadingSecret, setLoadingSecret] = useState(true);
  const [errorSecret, setErrorSecret] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const orderData = location.state || {};
  const orderId = orderData.orderId || 'default_order_id';
  const amountInCents = orderData.amount || 500; // en centimes

  // Récupération du clientSecret (logique de l'ancien App.jsx)
  useEffect(() => {
    const fetchClientSecret = async () => {
       if (!orderId || !amountInCents) {
          setErrorSecret("Données de commande manquantes.");
          setLoadingSecret(false);
          return;
      }
      setLoadingSecret(true);
      setErrorSecret(null);
      try {
        const response = await axios.post(`${PAYMENT_MICROSERVICE_URL}/payment`, {
          order_id: orderId,
          amount: amountInCents / 100, // en EUR
        }/*, { headers: { 'Authorization': ... } }*/);

        if (response.data && response.data.client_secret) {
          setClientSecret(response.data.client_secret);
        } else {
          throw new Error("Réponse invalide (client_secret manquant)");
        }
      } catch (error) {
        console.error('Erreur fetch client secret:', error.response?.data || error.message);
        setErrorSecret(error.response?.data?.message || "Impossible d'initialiser le paiement.");
      } finally {
        setLoadingSecret(false);
      }
    };
    fetchClientSecret();
  }, [orderId, amountInCents]);

  // Callbacks pour le formulaire (logique de l'ancien App.jsx)
  const handlePaymentSuccess = (paymentIntent) => {
    console.log("Paiement Réussi!", paymentIntent);
    navigate('/order-confirmation', { state: { orderId: orderId, paymentIntentId: paymentIntent.id } });
  };

  const handlePaymentError = (error) => {
     console.error("Erreur Paiement:", error);
     // L'erreur est déjà affichée dans le formulaire, mais on pourrait logger ici
  };

  // Rendu conditionnel du contenu
  const renderContent = () => {
    if (loadingSecret) return <div className="loading-message">Initialisation...</div>;
    if (errorSecret) return <div className="error-message">Erreur: {errorSecret}</div>;
    if (!clientSecret) return <div className="error-message">Chargement impossible.</div>;

    const options = { clientSecret, appearance: { theme: 'stripe' } };

    // Ici, on utilise le <Elements> wrapper autour de <CheckoutForm>
    return (
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm
          amount={amountInCents / 100}
          orderId={orderId}
          clientSecret={clientSecret}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      </Elements>
    );
  };

  // Structure de la page avec layout adaptatif
  const PageContent = (
     <div className="payment-page-container">
      <h1>Finaliser votre paiement</h1>
      <p>Commande N°: {orderId}</p>
      {renderContent()}
    </div>
  );

  if (isMobile) {
    return <MobileLayout>{PageContent}</MobileLayout>;
  } else {
    return (
      <>
        <Header />
        <main className="desktop-main-content">{PageContent}</main>
        <Footer />
      </>
    );
  }
};

export default PaymentForm; // Exporter le composant Page unique