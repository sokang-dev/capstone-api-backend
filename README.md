# RMIT Capstone Project - OTP Generator
---

Collaborators:
- Sok Ang Ho
- Tina Te
- Adithya Gadiraju
- Harris Hall
- Marina Gawrguos
- Christina Terranova
- James Ng

## Local setup

#### Setting up local database
1. Install mariadb (Google on how to do that).
2. Run the `database.sql` script located at `/InfrastructureAWS/template/` directory. **Note: With the new update, `database.sql` script is just for initialising the database. Loopback will handle table creation and update with `npm run migrate`.**


#### Setting up LoopBack
1. Clone the repo.
2. Change directory to `otp-generator`.
3. Run `npm install` to install the project dependencies.
4. Run `npm run test` to build and test the project.
5. Create a new `.env` file at the root of `otp-generator` directory. Copy the scheme in `.env.example` file and fill in your local configuration of mariadb setup.
6. Run `npm run migrate` to create database tables. **Note: You will also need to run `npm run migrate` to update the database whenever there are changes to the models. `npm run migrate -- --rebuild` will delete all the data and rebuild the database again.**
7. Run `npm start` to start the server and now you can enjoy hacking and slashing the API endpoints. :)
---

