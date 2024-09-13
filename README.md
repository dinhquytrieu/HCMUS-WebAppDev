# HCMUS-WebAppDev
# How to build source code and config
## System Requirements
- **Node.js**: Latest version (download from nodejs.org)
- **NPM**: Latest version (installed with Node.js)
- **Database**: MongoDB
## Installation and configuration
### Initial Setup
1. **Clone project**:
   ```
   git clone [https://github.com/dinhquytrieu/HCMUS-WebAppDev]
   ```
2. **Setup packages and libraries**:
   ```
   npm install
   ```
### Configuration
Information about configuring environment variables and external resources:
- **Environment variables**:
  - `MAIN_PORT`: 3000
  - `AUX_PORT`: 1234
  - `DB_URL`:
    ```bash
    AS_DATABASE=mongodb+srv://moziweb:moziweb@mozi.xtfgldl.mongodb.net/as?retryWrites=true&w=majority
    MS_DATABASE=mongodb+srv://moziweb:moziweb@mozi.xtfgldl.mongodb.net/ms?retryWrites=true&w=majority
    ```
  - `JWT_ACCESS_KEY`: jwtaccesstokensecret

Set these variables in a `.env` file in the root directory of your project.
### Directory structure
Main directory structure of the project:
```
/auxiliary
  	/cert
	/config
	/controllers
	/helpers
	/models
	/routes
	/source
/main
  	/config
	/controllers
	/helpers
  	/models
  	/routes
  	/source
/node_modules
/routes
/source
.env

```
## Build project
- **Open terminal screen in the directory 'src' and enter following command**:
  ```
  npm start
  ```
- **Access**:
  - Open the browser and access `http://localhost:3000`
## Testing
Detailed instructions on how to perform automated testing:
```
npm test
```
## Contribute
Instructions on how people can contribute to our project:
1. Fork and clone project.
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit changes (`git commit -am 'Add some feature'`)
4. Push into the branch (`git push origin feature-branch`)
5. Create a Pull Request.
