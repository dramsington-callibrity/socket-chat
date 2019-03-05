package main

import (
	"errors"

	jwt "github.com/dgrijalva/jwt-go"
	log "github.com/sirupsen/logrus"
)

//Auth : Represents necessary fields to create a token
type Auth struct {
	UserName string `form:"username" json:"username" xml:"username" binding:"required"`
	Channel  string `form:"channel" json:"channel" xml:"channel" binding:"required"`
}

//AccessKey : Represents claims stored in the JWT
type AccessKey struct {
	Read   []string `json:"read"`
	Write  []string `json:"write"`
	API    bool     `json:"api"`
	Active string   `json:"active"`

	jwt.StandardClaims
}

//AuthorizeNewUser : Creates a valid access key for the user to utilize for given channel
func AuthorizeNewUser(username string, channel string) (string, error) {
	c := make([]string, 1)
	c = append(c, channel)
	claims := &AccessKey{
		c,
		c,
		false,
		channel,
		jwt.StandardClaims{
			Id:     username,
			Issuer: "SocketChat",
		},
	}
	log.WithFields(log.Fields{"User": username, "Channel": channel, "Claims": claims}).Debug("AuthorizingNewUser")

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString(config.jwtSecret)
	if err != nil {
		log.WithFields(log.Fields{"error": err.Error()}).Warn("Can't create token")
		return "error", err
	}
	return signedToken, nil
}

//AuthorizeNewChannel : Creates a new token to add permissions for a new channel - returns the token & user
func AuthorizeNewChannel(username string, channel string, s *Server) (string, *User, error) {
	user := User{}
	for _, u := range s.Users {
		if u.UserName == username {
			user = *u
		}
	}
	if channel := user.Channel; channel != "" {
		c := make([]string, len(user.AccessKey.Read)+1)
		c = append(c, channel)
		claims := &AccessKey{
			c,
			c,
			false,
			channel,
			jwt.StandardClaims{
				Id:     username,
				Issuer: "SocketChat",
			},
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		signedToken, err := token.SignedString(config.jwtSecret)
		if err != nil {
			log.WithFields(log.Fields{"error": err.Error()}).Warn("Can't create token (add channel)")
			return "", nil, errors.New("error")
		}
		user.Channel = channel
		user.AccessKey = claims
		return signedToken, &user, nil
	}

	return "", &user, errors.New("User invalid, not adding channel")
}

//VerifyAccessKey : Verifies the Authorization: Bearer token, returning a key if successful
func VerifyAccessKey(auth string) (*AccessKey, error) {
	ak := AccessKey{}

	verifyFunc := func(t *jwt.Token) (interface{}, error) {
		return config.jwtSecret, nil
	}

	token, err := jwt.ParseWithClaims(auth, &ak, verifyFunc)
	if err != nil {
		return &ak, err
	}

	if claims, ok := token.Claims.(*AccessKey); ok && token.Valid {
		ak.Read = claims.Read
		ak.Write = claims.Write
		ak.API = !!claims.API
		return &ak, nil
	}
	return &ak, errors.New("invalid token")
}

//CanWrite : Permission check for Writing to a channel
func (ak *AccessKey) CanWrite(channel string) bool {
	for _, c := range ak.Write {
		if c == channel {
			return true
		}
	}

	return false
}

//CanRead : Permission check for Reading from a channel
func (ak *AccessKey) CanRead(channel string) bool {
	for _, c := range ak.Read {
		if c == channel {
			return true
		}
	}

	return false
}
