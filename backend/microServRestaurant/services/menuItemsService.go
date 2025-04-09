package restaurantService

import (
	"fmt"
	"log"
	"strconv"
	"bytes"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/sqlDB/columns"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/sqlDB/dao/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"encoding/base64"
)

// GetMenuItemsByRestaurantId godoc
//	@Summary		Get menu items by restaurant id
//	@Description	Get menu items by restaurant id
//	@Tags			restaurant
//	@Security		BearerAuth
//	@Accept			json
//	@Produce		json
//	@Param			restaurantId	path		string	true	"Restaurant ID"
//	@Success		200				{array}		model.Menuitem
//	@Failure		400				{object}	map[string]string
//	@Router			/restaurant/{restaurantId}/menuitems [get]
func GetMenuItemsByRestaurantId(ctx *gin.Context, db *gorm.DB) {
	restaurantId := ctx.Param("restaurantId")
	var menuItems []model.Menuitem
	db.Where(fmt.Sprintf("%s = ?", columns.MenuitemColumnIDRestaurant), restaurantId).Find(&menuItems)

	// Convertir les images en base64
	for i := range menuItems {
		if len(menuItems[i].Image) > 0 {
			// Vérifier si l'image est déjà en base64 avec préfixe
			if !bytes.HasPrefix(menuItems[i].Image, []byte("data:image")) {
				menuItems[i].Image = []byte(base64.StdEncoding.EncodeToString(menuItems[i].Image))
			}
		} else {
			log.Printf("Aucune image trouvée pour l'item %d", menuItems[i].IDMenuItem)
		}
	}

	ctx.JSON(200, menuItems)
}

// CreateMenuItem godoc
//	@Summary		Get menu items by restaurant id
//	@Description	Get menu items by restaurant id
//	@Tags			menuitem
//	@Security		BearerAuth
//	@Accept			json
//	@Produce		json
//	@Param			restaurantId	path		int				true	"Restaurant id"
//	@Param			menuItem		body		model.Menuitem	true	"Menu item"
//	@Success		200				{object}	model.Menuitem
//	@Failure		400				{object}	map[string]string
//	@Failure		500				{object}	map[string]string
//	@Router			/restaurant/{restaurantId}/menuitems/new [post]
func CreateMenuItem(ctx *gin.Context, db *gorm.DB) {
	restaurantIdStr := ctx.Param("restaurantId")
	restaurantId, err := strconv.Atoi(restaurantIdStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid restaurant id"})
		return
	}

	var menuItem model.Menuitem
	if err := ctx.ShouldBindJSON(&menuItem); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid menu item"})
		return
	}

	menuItem.IDRestaurant = int32(restaurantId)

	if err := db.Create(&menuItem).Error; err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to create menu item"})
		return
	}

	ctx.JSON(201, menuItem)
}

// DeleteMenuItem godoc
//	@Summary		Delete menu item
//	@Description	Delete menu item by id
//	@Tags			menuitem
//	@Security		BearerAuth
//	@Accept			json
//	@Produce		json
//	@Param			restaurantId	path		int	true	"Restaurant id"
//	@Param			menuItemId		path		int	true	"Menu item id"
//	@Success		200				{object}	map[string]string
//	@Failure		400				{object}	map[string]string
//	@Failure		404				{object}	map[string]string
//	@Failure		500				{object}	map[string]string
//	@Router			/restaurant/{restaurantId}/menuitems/{menuItemId} [delete]
func DeleteMenuItem(ctx *gin.Context, db *gorm.DB) {
	restaurantIdStr := ctx.Param("restaurantId")
	menuItemIdStr := ctx.Param("menuItemId")

	restaurantId, err := strconv.Atoi(restaurantIdStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid restaurant id"})
		return
	}

	menuItemId, err := strconv.Atoi(menuItemIdStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid menu item id"})
		return
	}

	var menuItem model.Menuitem
	if err := db.Where(fmt.Sprintf("%s = ? AND %s = ?", columns.MenuitemColumnIDMenuItem, columns.MenuitemColumnIDRestaurant), menuItemId, restaurantId).First(&menuItem).Error; err != nil {
		ctx.JSON(404, gin.H{"error": "Menu item not found"})
		return
	}

	if err := db.Delete(&menuItem).Error; err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to delete menu item"})
		return
	}

	ctx.JSON(200, gin.H{"message": "Menu item deleted successfully"})
}

// UpdateMenuItem godoc
//	@Summary		Update menu item
//	@Description	Update menu item by id
//	@Tags			menuitem
//	@Security		BearerAuth
//	@Accept			json
//	@Produce		json
//	@Param			restaurantId	path		int				true	"Restaurant id"
//	@Param			menuItemId		path		int				true	"Menu item id"
//	@Param			menuItem		body		model.Menuitem	true	"Menu item"
//	@Success		200				{object}	model.Menuitem
//	@Failure		400				{object}	map[string]string
//	@Failure		404				{object}	map[string]string
//	@Failure		500				{object}	map[string]string
//	@Router			/restaurant/{restaurantId}/menuitems/{menuItemId} [put]
func UpdateMenuItem(ctx *gin.Context, db *gorm.DB) {
	restaurantIdStr := ctx.Param("restaurantId")
	menuItemIdStr := ctx.Param("menuItemId")

	restaurantId, err := strconv.Atoi(restaurantIdStr)
	if err != nil {
		log.Println("Error converting restaurantId to int:", err)
		ctx.JSON(400, gin.H{"error": "Invalid restaurant id"})
		return
	}

	menuItemId, err := strconv.Atoi(menuItemIdStr)
	if err != nil {
		log.Println("Error converting menuItemId to int:", err)
		ctx.JSON(400, gin.H{"error": "Invalid menu item id"})
		return
	}

	var menuItem model.Menuitem
	if err := db.Where(fmt.Sprintf("%s = ? AND %s = ?", columns.MenuitemColumnIDMenuItem, columns.MenuitemColumnIDRestaurant), menuItemId, restaurantId).First(&menuItem).Error; err != nil {
		log.Println("Error finding menu item:", err)
		ctx.JSON(404, gin.H{"error": "Menu item not found"})
		return
	}

	if err := db.Save(&menuItem).Error; err != nil {
		log.Println("Error saving menu item:", err)
		ctx.JSON(500, gin.H{"error": "Failed to update menu item"})
		return
	}

	ctx.JSON(200, menuItem)
}

// GetMenuItemById godoc
//	@Summary		Get menu item by id
//	@Description	Get menu item by id
//	@Tags			menuitem
//	@Security		BearerAuth
//	@Accept			json
//	@Produce		json
//	@Param			restaurantId	path		int	true	"Restaurant id"
//	@Param			menuItemId		path		int	true	"Menu item id"
//	@Success		200				{object}	model.Menuitem
//	@Failure		400				{object}	map[string]string
//	@Failure		404				{object}	map[string]string
//	@Failure		500				{object}	map[string]string
//	@Router			/restaurant/{restaurantId}/menuitems/{menuItemId} [get]
func GetMenuItemById(ctx *gin.Context, db *gorm.DB) {
	restaurantIdStr := ctx.Param("restaurantId")
	menuItemIdStr := ctx.Param("menuItemId")

	restaurantId, err := strconv.Atoi(restaurantIdStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid restaurant id"})
		return
	}

	menuItemId, err := strconv.Atoi(menuItemIdStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid menu item id"})
		return
	}

	var menuItem model.Menuitem
	if err := db.Where("id = ? AND restaurant_id = ?", menuItemId, restaurantId).First(&menuItem).Error; err != nil {
		ctx.JSON(404, gin.H{"error": "Menu item not found"})
		return
	}

	ctx.JSON(200, menuItem)
}