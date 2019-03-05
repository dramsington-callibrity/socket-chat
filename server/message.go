package main

//Message : Represents the shape of each message as it's sent to the client
type Message struct {
	UserName string `json:"username"`
	Channel  string `json:"channel"`
	Data     string `json:"content"`
}
