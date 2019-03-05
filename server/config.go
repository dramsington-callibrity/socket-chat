package main

import (
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"github.com/ianschenck/envflag"
	jwtverifier "github.com/okta/okta-jwt-verifier-golang"
	log "github.com/sirupsen/logrus"
)

//Config : Represents the settings that control the server
type Config struct {
	Upgrader        websocket.Upgrader
	jwtSecret       []byte
	issuer          string
	verifier        jwtverifier.JwtVerifier
	port            string
	version         string
	readBufferSize  int
	writeBufferSize int
	maxConnections  int
	checkOrigin     bool
	log             log.Level
	launchUnixTime  int64
}

//LoadConfig : creates the config based on runtime flags as well as environment variables
func LoadConfig() *Config {
	c := &Config{}

	secret := envflag.String(
		"SECRET",
		"",
		"JWT secret used to validate access keys.")
	issuer := envflag.String(
		"ISSUER",
		"",
		"JWT issuer")
	port := envflag.String(
		"PORT",
		"4000",
		"Port in which to serve websocket connections")
	logLevel := envflag.String(
		"LOGLEVEL",
		"debug",
		"Log level, accepts: 'debug', 'info', 'warning', 'error', 'fatal', 'panic'")

	maxConnections := envflag.Int(
		"MAX_CONNECTIONS",
		255,
		"Maximum amount of permitted concurrent connections")

	readBufferSize := envflag.Int(
		"READ_BUFFER_SIZE",
		1024,
		"Size (in bytes) for the read buffer")

	writeBufferSize := envflag.Int(
		"WRITE_BUFFER_SIZE",
		1024,
		"Size (in bytes) for the write buffer")

	checkOrigin := envflag.Bool(
		"CHECK_ORIGIN",
		false,
		"Compare the Origin and Host request header during websocket handshake")

	envflag.Parse()

	c.jwtSecret = []byte(*secret)
	c.issuer = *issuer
	c.verifier = *NewOktaVerifier(string(c.jwtSecret), c.issuer)
	c.port = *port
	c.maxConnections = *maxConnections
	c.readBufferSize = *readBufferSize
	c.writeBufferSize = *writeBufferSize
	c.checkOrigin = *checkOrigin

	c.Upgrader = websocket.Upgrader{
		ReadBufferSize:  c.readBufferSize,
		WriteBufferSize: c.writeBufferSize,
	}

	if !c.checkOrigin {
		c.Upgrader.CheckOrigin = func(r *http.Request) bool {
			return true
		}
	}

	c.launchUnixTime = time.Now().Unix()

	var err error
	c.log, err = log.ParseLevel(*logLevel)
	if err != nil {
		log.WithFields(log.Fields{"error": err}).Panic("Unparsable log level")
	}
	log.SetLevel(c.log)

	return c
}
