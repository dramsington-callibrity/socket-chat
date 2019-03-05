package main

import (
	jwtverifier "github.com/okta/okta-jwt-verifier-golang"
)

//NewOktaVerifier : Returns the configured jwt verifier
func NewOktaVerifier(jwtSecret string, issuer string) *jwtverifier.JwtVerifier {
	toValidate := map[string]string{}
	toValidate["aud"] = "api://default"
	toValidate["cid"] = string(jwtSecret)

	jwtVerifierSetup := jwtverifier.JwtVerifier{
		Issuer:           issuer,
		ClaimsToValidate: toValidate,
	}

	verifier := jwtVerifierSetup.New()
	return verifier
}
