# Simple and secure email-password storage

### The go to solution for email-password storage
* Keep your user's email and password in a secure and private.   
* The email and password are both salted and hashed.   
* It uses `argon2id` to hash the credentials.     
     
# Usage
* ## Initialize
```js
const vault = require("simple-and-secure-email-password");
const secureStore = vault.init(
    {
        "memcost": 8192, //optional (In KiB) per thread
        "threadcost": 2, //optional (default: 2) threads to use for hashing.
        "projectSalt": process.env.SALT // required (Should be same for the project)
    }
);
```
* ## Create a new user.
```js
const response = await secureStore.signup(email, password);
```
Response will look like this:   
considering the following email and password:   
```js
const email = "example@example.com";
const password = "Passw0rd123";
const projectSalt = "TopSecretSaltForCompany";
```
```js
{
    "email": "exa****@example.com"

    "passwordHash": "$argon2id$v=19$m=8192,t=5,p=2$PaoIRiMYKFKngRtPrCnCPcQwWm66/ybey3wY3GcfBdZqwHx5$Y8Hu/IQXFVohnFIJ70+Ve/ZynKS2E1XijxicX1L8uN2yoJeo",

    "EmailHash": "$argon2id$v=19$m=8192,t=5,p=2$pvpXhohD8hWPR/7f329yBes3s0JjFMM2yVFo34z6zd8aYe3Q$aVC0OwINXU7xi3J5bIO8jHZKXq3Q6f3nZ7ZjVRZrhM1qXzSs"
}   
```