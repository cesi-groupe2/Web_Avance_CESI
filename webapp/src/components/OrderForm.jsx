const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);

  try {
    // Créer la commande
    const orderResponse = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        restaurant_id: restaurant.id,
        items: cartItems.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total_amount: total,
        delivery_address: formData.deliveryAddress,
        delivery_instructions: formData.deliveryInstructions,
        payment_method: formData.paymentMethod
      })
    });

    if (!orderResponse.ok) {
      throw new Error('Erreur lors de la création de la commande');
    }

    const orderData = await orderResponse.json();

    // Envoyer une notification au restaurant
    const notificationResponse = await fetch(`${import.meta.env.VITE_API_URL}/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        restaurant_id: restaurant.id,
        order_id: orderData.id,
        title: 'Nouvelle commande',
        message: `Nouvelle commande #${orderData.id} reçue. Montant total: ${total}€`,
        type: 'order'
      })
    });

    if (!notificationResponse.ok) {
      console.error('Erreur lors de l\'envoi de la notification');
    }

    // Vider le panier
    clearCart();
    
    // Rediriger vers la page de confirmation
    navigate(`/order-confirmation/${orderData.id}`);
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
}; 