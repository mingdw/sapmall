package jwt

import (
	"fmt"
	"strconv"
	"time"

	JWT "github.com/golang-jwt/jwt/v5"
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
	// 解析JWT令牌并验证签名
	auth, err := JWT.Parse(token, func(t *JWT.Token) (interface{}, error) {
		// 验证签名方法
		if _, ok := t.Method.(*JWT.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		return []byte(secret), nil
	})
	
	if err != nil {
		return 0, fmt.Errorf("failed to parse token: %w", err)
	}
	
	// 验证令牌是否有效
	if !auth.Valid {
		return 0, fmt.Errorf("invalid token")
	}
	
	// 提取声明
	claims, ok := auth.Claims.(JWT.MapClaims)
	if !ok {
		return 0, fmt.Errorf("invalid token claims")
	}
	
	// 验证过期时间
	if exp, ok := claims["exp"].(float64); ok {
		if time.Now().Unix() > int64(exp) {
			return 0, fmt.Errorf("token has expired")
		}
	}
	
	// 提取用户ID
	uinStr, ok := claims["comer_uin"].(string)
	if !ok {
		return 0, fmt.Errorf("invalid user ID in token")
	}
	
	uin, err = strconv.ParseUint(uinStr, 10, 64)
	if err != nil {
		return 0, fmt.Errorf("invalid user ID format: %w", err)
	}
	
	return uin, nil
}
