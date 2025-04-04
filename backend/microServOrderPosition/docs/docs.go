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
        "/": {
            "post": {
                "description": "Create an order position",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "OrderPosition"
                ],
                "summary": "Create an order position",
                "parameters": [
                    {
                        "description": "Order Position",
                        "name": "orderPositionHistory",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/mongoModels.OrderPositionHistory"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "/createLite": {
            "post": {
                "description": "Create an order position with less order position informations, only the order id, and the position are required",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "OrderPosition"
                ],
                "summary": "Create an order position with less order position informations",
                "parameters": [
                    {
                        "description": "Order Position",
                        "name": "orderPositionHistory",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/mongoModels.OrderPositionHistory"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "/journey/{orderID}": {
            "get": {
                "description": "Get the journey of an order by its id",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "OrderPosition"
                ],
                "summary": "Get the journey of an order by its id",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "Order ID",
                        "name": "orderID",
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
                                "$ref": "#/definitions/mongoModels.OrderPositionHistory"
                            }
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "/lastPosition/{orderID}": {
            "get": {
                "description": "Get the last position of an order by its id",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "OrderPosition"
                ],
                "summary": "Get the last position of an order by its id",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "Order ID",
                        "name": "orderID",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/mongoModels.OrderPositionHistory"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "mongoModels.OrderPositionHistory": {
            "type": "object",
            "properties": {
                "datetime": {
                    "type": "string"
                },
                "id": {
                    "type": "string"
                },
                "order_id": {
                    "type": "integer"
                },
                "position": {
                    "type": "string"
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
	Host:             "localhost:8020",
	BasePath:         "/orderPosition",
	Schemes:          []string{},
	Title:            "Swagger Easeat Order position API",
	Description:      "This is a microservice for managing orders positions",
	InfoInstanceName: "swagger",
	SwaggerTemplate:  docTemplate,
	LeftDelim:        "{{",
	RightDelim:       "}}",
}

func init() {
	swag.Register(SwaggerInfo.InstanceName(), SwaggerInfo)
}
