package jwt

import (
	"fmt"
	"strconv"
	"time"

	JWT "github.com/dgrijalva/jwt-go"
)

// Sign jwt token for current uin.
func Sign(uin uint64, secret string, expired int64) (token string, err error) {
	jwt := JWT.New(JWT.SigningMethodHS256)
	claims := make(JWT.MapClaims)
	claims["exp"] = time.Now().Add(time.Duration(expired) * time.Second).Unix()
	claims["iat"] = time.Now().Unix()
	claims["comer_uin"] = fmt.Sprintf("%d", uin)
	jwt.Claims = claims
	token, _ = jwt.SignedString([]byte(secret))
	return
}

// Verify jwt token if success then return the uin.
func Verify(token, secret string) (uin uint64, err error) {
	auth, err := JWT.Parse(token, func(t *JWT.Token) (interface{}, error) {
		return []byte(secret), nil
	})
	if err != nil {
		return
	}
	claims, _ := auth.Claims.(JWT.MapClaims)
	uinStr, _ := claims["comer_uin"].(string)
	uin, err = strconv.ParseUint(uinStr, 10, 64)
	return
}
