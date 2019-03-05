package main

import (
	"net/http"
	"runtime"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/sirupsen/logrus"
	log "github.com/sirupsen/logrus"
	ginlogrus "github.com/toorop/gin-logrus"
)

//Config : loads the config to be used in the upgrader
var config = LoadConfig()

//Upgrader : the configured upgrader that will handle websocket upgrading
var Upgrader = websocket.Upgrader{
	ReadBufferSize:  config.readBufferSize,
	WriteBufferSize: config.writeBufferSize,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

/*
* =======================
* SOCKET_CHAT
* =======================
 */

func main() {
	logrus := logrus.New()

	log.WithFields(log.Fields{
		"version": VERSION,
		"port":    config.port,
		"cores":   runtime.NumCPU()}).Info("Initializing Server")

	log.WithFields(log.Fields{
		"read-buffer-size":  config.readBufferSize,
		"write-buffer-size": config.writeBufferSize,
		"max-connections":   config.maxConnections}).Debug("Configuration options:")

	r := gin.New()
	r.Use(ginlogrus.Logger(logrus), gin.Recovery(), cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"POST", "GET", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Authorization", "Content-Type", "Accept", "Content-Length"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return true
		},
		MaxAge: 12 * time.Hour,
	}))
	r.Use(static.Serve("/static/", static.LocalFile("/static", true)))
	r.NoRoute(func(c *gin.Context) {
		c.File("index.html")
	})

	s := NewServer()

	r.GET("/", func(c *gin.Context) {
		http.ServeFile(c.Writer, c.Request, "index.html")
		http.ServeFile(c.Writer, c.Request, "asset-manifest.json")
		http.ServeFile(c.Writer, c.Request, "manifest.json")
		http.ServeFile(c.Writer, c.Request, "service-worker.js")
	})

	r.POST("/register", s.RegisterNewUser)

	r.POST("/register-okta", s.RegisterNewOktaUser)

	r.PUT("/command", s.HandleServerCommand)

	r.GET("/ws", s.ServeNewConnection)

	err := r.Run(":" + config.port)
	if err != nil {
		log.Fatal("Run: ", err)
	}
}
