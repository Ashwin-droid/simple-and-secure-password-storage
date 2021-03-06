# Simple and secure email-password storage

![GitHub top language](https://img.shields.io/github/languages/top/Ashwin-droid/simple-and-secure-password-storage)
![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/Ashwin-droid/simple-and-secure-password-storage)
![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/email-password)
![npm bundle size](https://img.shields.io/bundlephobia/min/email-password)
![GitHub repo size](https://img.shields.io/github/repo-size/Ashwin-droid/simple-and-secure-password-storage)
![NPM](https://img.shields.io/npm/l/email-password)
![npm](https://img.shields.io/npm/v/email-password)
![npm downloads](https://img.shields.io/npm/dt/email-password)

### The go to solution for email-password storage
* Keep your user's email and password in a secure and private.   
* The email and password are both salted and hashed.   
* It uses `argon2id` to hash the credentials.  
* Fully working demo project is available [here](https://github.com/Ashwin-droid/Test-code-for-email-password)   
     
# Usage
* ## Initialize
  ```js
  const vault = require("email-password");
  const secureStore = vault.init(
      {
          "memCost": 8192, //optional (In KiB) per thread
          "threadCost": 2, //optional (default: 2) threads to use for hashing.
          "lessSecureMode": false, //optional (default: false) if true, it will reduce the security slightly and increase the performance.
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
  ### Note:   
  Do store all the fields as-is in the database. Else it is guaranteed to not work.   
  For unique identification use the `EmailHash` field.   
  * High security mode
    ```js
    {
        "email": "exa****@example.com"
  
        "passwordHash": "$argon2id$v=19$m=8192,t=5,p=2$PaoIRiMYKFKngRtPrCnCPcQwWm66/ybey3wY3GcfBdZqwHx5$Y8Hu/IQXFVohnFIJ70+Ve/ZynKS2E1XijxicX1L8uN2yoJeo",
  
        "EmailHash": "$argon2id$v=19$m=8192,t=5,p=2$pvpXhohD8hWPR/7f329yBes3s0JjFMM2yVFo34z6zd8aYe3Q$aVC0OwINXU7xi3J5bIO8jHZKXq3Q6f3nZ7ZjVRZrhM1qXzSs"
    }   
    ```
  * Low security mode
    ```js
    {
        "email": "exa****@example.com"
  
        "passwordHash": "$argon2id$v=19$m=8192,t=5,p=2$PaoIRiMYKFKngRtPrCnCPcQwWm66/ybey3wY3GcfBdZqwHx5$Y8Hu/IQXFVohnFIJ70+Ve/ZynKS2E1XijxicX1L8uN2yoJeo",
  
        "EmailHash": "76ba11cbaa72d99b7b1e48693fd2e6e54dc81e248ec21d33afec3a48a15f1f8afbccd8a72d3d969c99790f99dda18db4573aa3c1737b43371e071dcdffce9795"
    }   
    ```
* ## Lookup a user in DB
  * High security mode:
    ```js
    const mailFromUser = "example@example.com"
    const response = secureStore.getMail(mailfromUser); // exa****@example.com
    /**
     * TODO: Lookup in the DB and return all possible matches on the email field. Also don't forget to check wether the user exists or not.
    */
    const user = await secureStore.lookup(UserArrayFromDB, MailFromUser);
    // user will be returned as described above.
    ```
  * Low security mode:
    ```js
    const mailFromUser = "example@example.com"
    const response = secureStore.getMailHash(mailfromUser); // 76ba11cbaa72d99b7b1e48693fd2e6e54dc81e248ec21d33afec3a48a15f1f8afbccd8a72d3d969c99790f99dda18db4573aa3c1737b43371e071dcdffce9795
    /**
     * TODO: Lookup in the DB on the emailHash field and the match. Also don't forget to check wether the user exists or not.
    */
    // the result would be your user object.
    ```
* ## Login a user
  ```js
  const response = await secureStore.verify(email, password, user.passwordHash);
  if (response) {
      // User is logged in successfully
  } else {
      // Password error
  }
  ```

# How does it work?
## At a glance
* The email and password are both salted.
* The salted email is a part of the password's hash.
* password is salted as following:   
`password + projectSalt + saltedEmail`
* email is salted as following:   
`example@example.com` => 
  ```js
  `example${projectSalt}@${projectSalt}example.com`
  ```
* Then it is hashed via argon2id for ultra security.
* If this module is implemented correctly it is 99.99% Immune to any attacks and breaches.
* Because you need three things to break the password's hash (mail, password, projectSalt), to crack it the hacker needs to get hold of the mail and password salt making rainbow tables a thing of the past.
* Additionally for added safety argon2 adds a salt of its own.
* Due to this super simple passwords like `12345678`, `qwertyuip` next to impossible to break.
* NOTE: By no means we recommend to use weak passwords.
* In less secure mode the email is hashed with SHA3-512 instead of argon2id.
* NOTE: In less secure mode only the email (with salt) is hashed with SHA3-512 instead of argon2id, Passwords are still hashed with argon2id.
* This is because argon2 adds a salt (Hence the second step in lookup) of its own and SHA3-512 is much faster than argon2.