# Socket-Chat

Before you start you need an Okta account. After you set that up:
```bash
cp .env-sample .env
cd app/ && npm install
```
Edit the .env file you just copied and replace it with the appropriate details. Note that REACT_APP_ environment variables are named that way so that they are not discarded by react-scripts.

Enter the command below after you have done the above and returned to the directory where Makefile resides
```
make dev
```
