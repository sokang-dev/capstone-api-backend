# OTP Generator
---

## Local setup

#### Setting up local database
1. Install mariadb (Google on how to do that)
2. Run the `database.sql` script located at `Infrastructure/template/` directory
**Note:** Later on, hopefully we wouldn't need to run `database.sql` script, we would depend on LoopBack migrate feature.

#### Setting up LoopBack
1. Clone the repo.
2. Change directory to `otp-generator`.
3. Run `npm install` to install the project dependencies.
4. Run `npm run test` to build and test the project.
5. Create a new `.env` file at the root of `otp-generator` directory. Copy the scheme in `.env.example` file and fill in your local configuration of mariadb setup.
6. Run `npm start` to start the server and now you can enjoy hacking and slashing the API endpoints. :)
---

