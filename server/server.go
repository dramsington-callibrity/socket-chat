package main

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

//Server : Represents the central managements of User connections/disconnections
type Server struct {
	Users      map[string]*User
	Connect    chan *User
	Disconnect chan *User
}

//NewServer : function that initializes the server and starts the goroutine to handle users connecting and disconnecting
func NewServer() *Server {
	s := &Server{
		Users:      map[string]*User{},
		Connect:    make(chan *User),
		Disconnect: make(chan *User),
	}

	go s.MaintainUserList()

	return s
}

//MaintainUserList : goroutine that tracks users for the lifetime of the server
func (s *Server) MaintainUserList() {
	log.Debug("Tracking users...")

	for {
		select {
		case u := <-s.Connect:
			if len(s.Users) >= config.maxConnections {
				log.WithFields(log.Fields{"User": u.UserName}).Warn("MAX_CONNECTIONS limit reached, dropping new connection")
				u.Disconnect()
			}

			log.WithFields(log.Fields{"User": u.UserName}).Debug("Registering User")
			u.Server = s
			s.Users[u.UserName] = u
			s.NotifyServerStatus("")
			go u.Listen()
		case u := <-s.Disconnect:
			log.WithFields(log.Fields{"User": u.UserName}).Debug("Disconnecting User")
			delete(s.Users, u.UserName)
			s.NotifyServerStatus("")
			u.Disconnect()
		}
	}
}

// RegisterNewUser : Handles a /register and will create a new access token
func (s *Server) RegisterNewUser(c *gin.Context) {
	var auth Auth
	if err := c.ShouldBindJSON(&auth); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for _, User := range s.Users {
		if auth.UserName == User.UserName {
			c.JSON(http.StatusUnauthorized, gin.H{"status": "username taken"})
			return
		}
	}

	var token, err = AuthorizeNewUser(auth.UserName, auth.Channel)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "token creation failed"})
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "token": token})
}

// RegisterNewOktaUser : Handles a /register and will create a new access token
func (s *Server) RegisterNewOktaUser(c *gin.Context) {
	oktaToken := strings.TrimSpace(strings.TrimPrefix(c.Request.Header.Get("Authorization"), "Bearer"))
	Verifier := config.verifier

	if _, err := Verifier.VerifyAccessToken(oktaToken); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	var auth Auth
	if err := c.ShouldBindJSON(&auth); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for _, User := range s.Users {
		if auth.UserName == User.UserName {
			c.JSON(http.StatusConflict, gin.H{"status": "username taken"})
			return
		}
	}

	log.WithFields(log.Fields{"Auth": auth}).Debug("Authorizing new user...")
	var token, err = AuthorizeNewUser(auth.UserName, auth.Channel)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "token creation failed"})
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "token": token})
}

// ServeNewConnection : handles the web request to /ws and upgrades to websocket connection. Verifies token
func (s *Server) ServeNewConnection(c *gin.Context) {
	auth := strings.TrimSpace(strings.TrimPrefix(c.Request.Header.Get("Authorization"), "Bearer"))
	if auth == "" {
		c.Request.ParseForm()
		auth = c.Request.Form.Get("auth")
		log.WithFields(log.Fields{"auth": auth}).Debug("Empty Authorization header, trying querystring auth param")
	}

	accessKey, err := VerifyAccessKey(auth)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "token creation failed"})
		return
	}

	connection, err := config.Upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.WithFields(log.Fields{"error": err.Error()}).Warn("Can't upgrade connection")
		c.JSON(http.StatusUnauthorized, gin.H{"status": err.Error()})
		return
	}

	user := NewUser(connection, accessKey)
	s.Connect <- user
}

// ServerStatus : Information included to update users on the server status
type ServerStatus struct {
	Users   int    `json:"users"`
	Command string `json:"command"`
	Type    string `json:"type"`
}

// TokenUpgrade : Shape of the message to describe a token upgrade command
type TokenUpgrade struct {
	Token   string `json:"token"`
	Command string `json:"command"`
	Type    string `json:"type"`
}

// NotifyServerStatus : Sends a message to update all users on how many users are connected and command value if any
func (s *Server) NotifyServerStatus(command string) {
	serverStatus := ServerStatus{
		len(s.Users),
		command,
		"update",
	}
	if content, err := json.Marshal(serverStatus); err == nil {
		for _, user := range s.Users {
			var message = Message{
				UserName: "SYSTEM",
				Channel:  "lobby",
				Data:     string(content),
			}
			user.ws.WriteJSON(message)
		}
	}
}

// HandleServerCommand : Calls the notify for a command if the parameters are present and correct
func (s *Server) HandleServerCommand(c *gin.Context) {
	c.Request.ParseForm()
	command := c.Request.Form.Get("command")
	secret := c.Request.Form.Get("secret")
	if command != "" && secret == string(config.jwtSecret) {
		s.NotifyServerStatus(command)
		if command == "authorize_channel:chat" {
			for _, user := range s.Users {
				token, User, err := AuthorizeNewChannel(user.UserName, "chat", s)
				if err == nil {
					s.Users[user.UserName] = User
					tokenUpgrade := TokenUpgrade{
						token,
						"upgrade:token",
						"update",
					}
					if content, err := json.Marshal(tokenUpgrade); err == nil {
						var message = Message{
							UserName: "SYSTEM",
							Channel:  "lobby",
							Data:     string(content),
						}
						user.ws.WriteJSON(message)
					}
				}
			}
		}
	}
}
