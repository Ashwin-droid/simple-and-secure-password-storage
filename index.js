/**
 * MIT License
 *
 * Copyright (c) 2022 Ashwin-droid
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */
const argon2 = require("argon2");

var securityParameters = {
  timeCost: 5, // illitrations
  memoryCost: 8192, // kibibytes 16MiB (as 1 per thread)
  parallelism: 2, // threads
  hashLength: 36, // length of hash
  type: argon2.argon2id, // type of hash
  saltLength: 36 // length of salt
};

var projectSalt = "";
var functions = {};

const emailPassowordSalter = (email, password) => {
  email = email.toLowerCase();
  //check if email is a non null, non empty string
  if (typeof email === "string" && email.length > 0) {
    //validate email with regex
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
      throw new Error("email is not valid");
    }
    //check if password is a non null, non empty string
    if (typeof password === "string" && password.length > 0) {
      const splitMail = email.split("@");
      const saltyMail = splitMail.join(`${projectSalt}@${projectSalt}`);
      const saltyPassword = `${saltyMail}${projectSalt}${password}`;
      const finalEmail =
        splitMail[0].substring(0, Math.floor(splitMail[0].length / 2)) +
        "*".repeat(Math.ceil(splitMail[0].length / 2)) +
        "@" +
        splitMail[1];
      return {
        email: finalEmail,
        password: saltyPassword,
        saltyMail
      };
    } else {
      throw new Error("password is not valid");
    }
  } else {
    throw new Error("email is not valid");
  }
};

functions.getmail = (email) => {
  email = email.toLowerCase();
  return emailPassowordSalter(email, "00").email;
  /**
   * @param {string} email - email to lookup
   * @returns {Email To Lookup}
   */
};

functions.lookup = async (userArray, mailTolookup) => {
  mailTolookup = mailTolookup.toLowerCase();
  mailTolookup = emailPassowordSalter(mailTolookup, "00").saltyMail;
  for (user of userArray){
    var workaround = await argon2.verify(user.emailHash , mailTolookup );
    if (workaround) {
      return user;
    }
  }
}

functions.verify = async (email, password, passwordHash) => {
  email = email.toLowerCase();
  return await argon2.verify(
    passwordHash,
    emailPassowordSalter(email, password).password
  );
  /**
   * @param {string} email - email to verify
   * @param {string} password - password to verify
   * @param {string} passwordHash - hash of password to verify
   * @returns {boolean} - true if verified, false if not
   * @throws {Error} - if email or password is not a string
   */
};

functions.signup = async (email, password) => {
  email = email.toLowerCase();
  const salted = emailPassowordSalter(email, password);
  const PasswordHash = await argon2.hash(salted.password, securityParameters);
  const EmailHash = await argon2.hash(salted.saltyMail, securityParameters);
  return {
    email: salted.email,
    passwordHash: PasswordHash,
    emailHash: EmailHash
  };
  /**
   * @param {string} email - email to signup
   * @param {string} password - password to signup
   * @returns {object} - object with email, passwordHash, and emailHash
   */
};

module.exports.init = (params) => {
  securityParameters.memoryCost =
    params.memcost || securityParameters.memoryCost;
  securityParameters.parallelism =
    params.threadcost || securityParameters.parallelism;
  //check if params.projectSalt is a non null, non empty string
  if (
    typeof params.projectSalt === "string" &&
    params.projectSalt.length > 0
  ) {
    projectSalt = params.projectSalt;
    return functions;
  } else {
    throw new Error("projectSalt is not a string or is empty");
  }
};
