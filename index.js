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

const securityParameters = {
  timeCost: 5,
  memoryCost: 8192,
  parallelism: 2,
  hashLength: 36,
  type: argon2.argon2id,
  saltLength: 36
};

// test

async function main(){
    let password = "password";
    console.log(password);
    const hash = await argon2.hash(password, securityParameters);
    console.log(hash);
    const isValid = await argon2.verify(hash, password);
    console.log(isValid);
    password = "wrong password";
    const isValid2 = await argon2.verify(hash, password);
    console.log(isValid2);
}

main();