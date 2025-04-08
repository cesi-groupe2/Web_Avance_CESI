package columns

// Column names for Menuitem defined as constants for consistency and immutability.
const (
	MenuitemColumnIDMenuItem        = "id_menu_item"
	MenuitemColumnName              = "name"
	MenuitemColumnDescription       = "description"
	MenuitemColumnPrice             = "price"
	MenuitemColumnImage             = "image"
	MenuitemColumnCreatedAt = "created_at"
	MenuitemColumnIDRestaurant      = "id_restaurant"
)

// Column names for Restaurant defined as constants for consistency and immutability.
const (
	RestaurantColumnIDRestaurant          = "id_restaurant"
	RestaurantColumnName                  = "name"
	RestaurantColumnAddress               = "address"
	RestaurantColumnPicture               = "picture"
	RestaurantColumnLocalisationLatitude  = "localisation_latitude"
	RestaurantColumnLocalisationLongitude = "localisation_longitude"
	RestaurantColumnPhone                 = "phone"
	RestaurantColumnOpeningHours          = "opening_hours"
)
// Column names for Posserder defined as constants for consistency and immutability.
const (
	PosserderColumnIDPosserder         = "id_user"
	PosserderColumnIDRestaurant       = "id_restaurant"
)

// Column names for User defined as constants for consistency and immutability.
const (
	UserColumnIDUser            = "id_user"
	UserColumnEmail             = "email"
	UserColumnPasswordHash      = "password_hash"
	UserColumnProfilPicture     = "profil_picture"
	UserColumnFirstName         = "first_name"
	UserColumnLastName          = "last_name"
	UserColumnPhone             = "phone"
	UserColumnCreatedAt         = "created_at"
	UserColumnDeliveryAdress    = "delivery_adress"
	UserColumnFacturationAdress = "facturation_adress"
	UserColumnIDRole            = "id_role"
	UserColumnSponsorshipCode   = "sponsorship_code"
	UserColumnAlreadySponsored  = "already_sponsored"
)
