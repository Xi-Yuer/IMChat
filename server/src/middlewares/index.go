package middlewares

import (
	"ImChat/src/config"
	"ImChat/src/handlers"
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

// Token 验证
func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			handlers.NoAuth(c)
			c.Abort()
			return
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return config.SecretKey, nil
		})
		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "无效的令牌"})
			c.Abort()
			return
		}
		c.Set("account", token.Claims.(jwt.MapClaims)["account"])
		c.Set("id", token.Claims.(jwt.MapClaims)["id"])

		c.Next()
	}
}
