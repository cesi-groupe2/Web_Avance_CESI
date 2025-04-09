  <RestaurantCard>
    <RestaurantLink to={`/restaurant/${restaurant.id_restaurant}`}>
      <RestaurantImage 
        src={restaurant.image || 'https://via.placeholder.com/400x200?text=Restaurant'} 
        alt={restaurant.name}
      />
      <RestaurantInfo>
        <RestaurantName>{restaurant.name}</RestaurantName>
        <RestaurantAddress>{restaurant.address}</RestaurantAddress>
      </RestaurantInfo>
    </RestaurantLink>
  </RestaurantCard> 