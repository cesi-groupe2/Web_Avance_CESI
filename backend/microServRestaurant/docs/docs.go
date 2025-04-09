// Package docs Code generated by swaggo/swag. DO NOT EDIT
package docs

import "github.com/swaggo/swag"

const docTemplate = `{
    "schemes": {{ marshal .Schemes }},
    "swagger": "2.0",
    "info": {
        "description": "{{escape .Description}}",
        "title": "{{.Title}}",
        "contact": {
            "name": "Groupe 2 FISA INFO A4 CESI (2025)",
            "url": "https://contact.easeat.fr",
            "email": "benjamin.guerre@viacesi.fr"
        },
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/restaurant/my": {
            "get": {
                "security": [
                    {
                        "BearerAuth": []
                    }
                ],
                "description": "Get the restaurants owned by the user",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "restaurant"
                ],
                "summary": "Get the restaurants owned by the user",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/model.Restaurant"
                            }
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    }
                }
            }
        },
        "/restaurant/nearby/{latitude}/{longitude}/{kmAround}": {
            "get": {
                "security": [
                    {
                        "BearerAuth": []
                    }
                ],
                "description": "Get nearby restaurants from the user's location",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "restaurant"
                ],
                "summary": "Get nearby restaurants",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Latitude of the user",
                        "name": "latitude",
                        "in": "path",
                        "required": true
                    },
                    {
                        "type": "string",
                        "description": "Longitude of the user",
                        "name": "longitude",
                        "in": "path",
                        "required": true
                    },
                    {
                        "type": "string",
                        "description": "Distance around the user in km",
                        "name": "kmAround",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/model.Restaurant"
                            }
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    }
                }
            }
        },
        "/restaurant/new": {
            "post": {
                "security": [
                    {
                        "BearerAuth": []
                    }
                ],
                "description": "Create a new restaurant",
                "consumes": [
                    "multipart/form-data"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "restaurant"
                ],
                "summary": "Create a new restaurant",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Name of the restaurant",
                        "name": "name",
                        "in": "formData",
                        "required": true
                    },
                    {
                        "type": "string",
                        "description": "Phone number of the restaurant",
                        "name": "phone",
                        "in": "formData",
                        "required": true
                    },
                    {
                        "type": "string",
                        "description": "Address of the restaurant",
                        "name": "address",
                        "in": "formData",
                        "required": true
                    },
                    {
                        "type": "string",
                        "description": "Latitude of the restaurant",
                        "name": "localisation_latitude",
                        "in": "formData",
                        "required": true
                    },
                    {
                        "type": "string",
                        "description": "Longitude of the restaurant",
                        "name": "localisation_longitude",
                        "in": "formData",
                        "required": true
                    },
                    {
                        "type": "file",
                        "description": "Picture of the restaurant",
                        "name": "picture",
                        "in": "formData",
                        "required": true
                    }
                ],
                "responses": {
                    "201": {
                        "description": "Created",
                        "schema": {
                            "$ref": "#/definitions/model.Restaurant"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    }
                }
            }
        },
        "/restaurant/{restaurantId}": {
            "get": {
                "security": [
                    {
                        "BearerAuth": []
                    }
                ],
                "description": "Get a restaurant by its id",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "restaurant"
                ],
                "summary": "Get a restaurant by its id",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Restaurant ID",
                        "name": "restaurantId",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/model.Restaurant"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    }
                }
            },
            "put": {
                "security": [
                    {
                        "BearerAuth": []
                    }
                ],
                "description": "Update a restaurant",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "restaurant"
                ],
                "summary": "Update a restaurant",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Restaurant ID",
                        "name": "restaurantId",
                        "in": "path",
                        "required": true
                    },
                    {
                        "description": "Restaurant object",
                        "name": "restaurant",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/model.Restaurant"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/model.Restaurant"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "404": {
                        "description": "Not Found",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    }
                }
            }
        },
        "/restaurant/{restaurantId}/menuitems": {
            "get": {
                "security": [
                    {
                        "BearerAuth": []
                    }
                ],
                "description": "Get menu items by restaurant id",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "restaurant"
                ],
                "summary": "Get menu items by restaurant id",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Restaurant ID",
                        "name": "restaurantId",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/model.Menuitem"
                            }
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    }
                }
            }
        },
        "/restaurant/{restaurantId}/menuitems/new": {
            "post": {
                "security": [
                    {
                        "BearerAuth": []
                    }
                ],
                "description": "Get menu items by restaurant id",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "menuitem"
                ],
                "summary": "Get menu items by restaurant id",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "Restaurant id",
                        "name": "restaurantId",
                        "in": "path",
                        "required": true
                    },
                    {
                        "description": "Menu item",
                        "name": "menuItem",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/model.Menuitem"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/model.Menuitem"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    }
                }
            }
        },
        "/restaurant/{restaurantId}/menuitems/{menuItemId}": {
            "get": {
                "security": [
                    {
                        "BearerAuth": []
                    }
                ],
                "description": "Get menu item by id",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "menuitem"
                ],
                "summary": "Get menu item by id",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "Restaurant id",
                        "name": "restaurantId",
                        "in": "path",
                        "required": true
                    },
                    {
                        "type": "integer",
                        "description": "Menu item id",
                        "name": "menuItemId",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/model.Menuitem"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "404": {
                        "description": "Not Found",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    }
                }
            },
            "put": {
                "security": [
                    {
                        "BearerAuth": []
                    }
                ],
                "description": "Update menu item by id",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "menuitem"
                ],
                "summary": "Update menu item",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "Restaurant id",
                        "name": "restaurantId",
                        "in": "path",
                        "required": true
                    },
                    {
                        "type": "integer",
                        "description": "Menu item id",
                        "name": "menuItemId",
                        "in": "path",
                        "required": true
                    },
                    {
                        "description": "Menu item",
                        "name": "menuItem",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/model.Menuitem"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/model.Menuitem"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "404": {
                        "description": "Not Found",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    }
                }
            },
            "delete": {
                "security": [
                    {
                        "BearerAuth": []
                    }
                ],
                "description": "Delete menu item by id",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "menuitem"
                ],
                "summary": "Delete menu item",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "Restaurant id",
                        "name": "restaurantId",
                        "in": "path",
                        "required": true
                    },
                    {
                        "type": "integer",
                        "description": "Menu item id",
                        "name": "menuItemId",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "404": {
                        "description": "Not Found",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "model.DayOpeningHours": {
            "type": "object",
            "properties": {
                "close": {
                    "type": "string"
                },
                "open": {
                    "type": "string"
                }
            }
        },
        "model.Menuitem": {
            "type": "object",
            "properties": {
                "created_at": {
                    "type": "string"
                },
                "description": {
                    "type": "string"
                },
                "id_menu_item": {
                    "type": "integer"
                },
                "id_restaurant": {
                    "type": "integer"
                },
                "image": {
                    "type": "array",
                    "items": {
                        "type": "integer"
                    }
                },
                "name": {
                    "type": "string"
                },
                "price": {
                    "type": "number"
                }
            }
        },
        "model.Restaurant": {
            "type": "object",
            "properties": {
                "address": {
                    "type": "string"
                },
                "id_restaurant": {
                    "type": "integer"
                },
                "localisation_latitude": {
                    "type": "number"
                },
                "localisation_longitude": {
                    "type": "number"
                },
                "name": {
                    "type": "string"
                },
                "opening_hours": {
                    "type": "string"
                },
                "phone": {
                    "type": "string"
                },
                "picture": {
                    "type": "array",
                    "items": {
                        "type": "integer"
                    }
                }
            }
        }
    },
    "securityDefinitions": {
        "BearerAuth": {
            "description": "Use /login to get your token and use it here",
            "type": "apiKey",
            "name": "Authorization",
            "in": "header"
        }
    }
}`

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo = &swag.Spec{
	Version:          "2.0",
	Host:             "localhost:8052",
	BasePath:         "/",
	Schemes:          []string{},
	Title:            "Swagger Easeat restaurant microservice",
	Description:      "This is a microservice for managing restaurants",
	InfoInstanceName: "swagger",
	SwaggerTemplate:  docTemplate,
	LeftDelim:        "{{",
	RightDelim:       "}}",
}

func init() {
	swag.Register(SwaggerInfo.InstanceName(), SwaggerInfo)
}
