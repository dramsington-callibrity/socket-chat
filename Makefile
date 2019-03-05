cfg ?= .env
include $(cfg)
export $(shell sed 's/=.*//' $(cfg))
export UID=$(whoami)

.PHONY: help

help:
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.DEFAULT_GOAL := help


init: ## initialises this directory - use once only
	@$(MAKE) _pre ARG="init"
release: ## builds the application - outputs an `app` binary
	@$(MAKE) _release VERSION=$(MAKE version.bump)
build: ## builds the application for prod - outputs an `app` binary
	@$(MAKE) _pre ARG="build"
test: build ## runs tests in watch-mode
	@$(MAKE) _pre ARG="test"
test.once: build ## runs tests once
	@$(MAKE) _pre ARG="test -coverprofile c.out"
dev: ## runs the application in dev mode
	@docker-compose up
start: build ## runs the application in prod mode
	@$(MAKE) _pre ARG="start"
shell: ## creates a shell in a fresh container generated from the image, usable for development on non-linux machines
	@$(MAKE) _pre ARG="shell"
version.get: ## retrieves the latest version we are at
	@docker run -v "$(CURDIR)/server/:/app" zephinzer/vtscripts:latest get-latest -q
version.bump: ## bumps the version by 1: specify VERSION as "patch", "minor", or "major", to be specific about things
	@docker run -v "$(CURDIR)/server/:/app" zephinzer/vtscripts:latest iterate ${VERSION} -i

# base command to run other scripts
_pre:
	@docker run \
    -it \
    -P "3000:3000" \
    -u $$(id -u) \
    -v "$(CURDIR)/server/.cache/pkg:/go/pkg" \
    -v "$(CURDIR)/server/:/go/src/app" \
    zephinzer/golang-dev:$(GOLANG_DEV_VERSION) ${ARG}

# base command to build a release
_release:
	@docker build -t $(REPO):$(VERSION) .
