package main

import (
	"github.com/gorilla/websocket"
	log "github.com/sirupsen/logrus"
)

// User : Represents a User connection / session
type User struct {
	UserName         string
	ws               *websocket.Conn
	AccessKey        *AccessKey
	Server           *Server
	Channel          string
	IncomingMessages chan *Message
}

// NewUser : Creates a new User and starts a goroutine for delivering messages
func NewUser(w *websocket.Conn, ak *AccessKey) *User {
	u := &User{
		UserName:         ak.StandardClaims.Id,
		ws:               w,
		AccessKey:        ak,
		Channel:          ak.Active,
		IncomingMessages: make(chan *Message),
	}
	log.WithFields(log.Fields{"User": u}).Debug("Creating User")

	go u.DistributeIncomingMessages()

	return u
}

// DistributeIncomingMessages : User goroutine to handle messages channel, writes to the websocket
func (u *User) DistributeIncomingMessages() {
	var message *Message

	for {
		message = <-u.IncomingMessages
		u.ws.WriteJSON(message)
	}
}

// Listen : User goroutine started from server after connecting. Calls publish.
func (u *User) Listen() {
	log.WithFields(log.Fields{"User": u.UserName}).Debug("Listening to User")
	for {
		message := &Message{}
		err := u.ws.ReadJSON(&message)
		if err != nil {
			log.WithFields(log.Fields{
				"user":  u.UserName,
				"error": err.Error()}).Warn("Error reading from socket, disconnecting")

			u.Server.Disconnect <- u
			break
		}

		message.UserName = u.UserName

		log.WithFields(log.Fields{"User": u.UserName, "Channel": message.Channel}).Debug("Received message from socket")

		if u.AccessKey.CanWrite(message.Channel) {
			go u.Publish(message)
		} else {
			log.WithFields(log.Fields{
				"User":    u.UserName,
				"Channel": message.Channel,
				"Data":    message.Data,
			}).Info("Message dropped due to insufficient write permissions")
		}
	}
}

// Disconnect : User function to close the websocket connection
func (u *User) Disconnect() {
	log.WithFields(log.Fields{"User": u.UserName}).Debug("Closing User")
	u.ws.Close()
}

// Publish : User goroutine that filters messages and checks access control before sending messages to the channel
func (u *User) Publish(message *Message) {
	message.UserName = u.UserName

	for _, user := range u.Server.Users {
		if message.Channel != user.AccessKey.Active {
			log.WithFields(log.Fields{"User": user.UserName, "UserChannel": user.AccessKey.Active, "Message": message}).Debug("skipping message for user")
			continue
		}
		for _, channel := range user.AccessKey.Read {
			if message.Channel == channel {
				user.IncomingMessages <- message
				break
			}
		}
	}
}
