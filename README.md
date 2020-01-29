# Doctor booking

## Stack
 - python 3.7+
 - Django
 - TypeScript + React + antd
 
## How to run
 
### Build front
 - `npm install`
 - `npm run build`
  
### Run application (dev)
 - create python virtual environment and activate it
 - `pip install -r requirements.txt`
 - `npm run start`
 
## How to use

### Login via drchrono
 - Log in to drchrono.com
 - Go to the API management page
 - Make a new application
 - Copy the SOCIAL_AUTH_CLIENT_ID and SOCIAL_AUTH_CLIENT_SECRET to your `.env` file.
 - Set your redirect URI to http://localhost:8080/complete/drchrono/
 - go to http://localhost:8000/dr/login
 - authenticate doctor with drchrono credentials
 
### Create appoinment
 - go to http://localhost:8000
 - fill form and push `Schedule`
 - You can check your appointment on https://app.drchrono.com/appointments page