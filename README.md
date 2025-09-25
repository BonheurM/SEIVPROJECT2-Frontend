# Tutorial Frontend in Vue 3

This application create and maintain a list of tutorials that can have multiple lessons within. Please visit https://github.com/OC-ComputerScience/tutorial-backend-simple for the backend repository.

## Project Setup

1. Clone the project into your **XAMPP/xamppfiles/htdocs** directory.

```
git clone https://github.com/OC-ComputerScience/tutorial-frontend-vue3-simple.git
```

2. Install the project.

```
npm install
```

3. Make sure **Apache** is running.

   - We recommend using XAMPP to serve this project.
   - In XAMPP, make sure that **Apache** is running.


4. Compile and run the project locally.

```
npm run dev
```

5. If you are wanting to serve your project for production:
    - You will need to have a **.htaccess** file.
    - It should be in your **public** folder.
    - Visual Studio Code will auto format it to where the file will not be read correctly, so add the following rule to your **settings.json** in Visual Studio Code.

```
"files.associations": {
    "**/*.htaccess": "plaintext"
},
```

6. (Optional) Compile the project for production.

```
npm run build
```
7. For deployment to AWS set up repository secrects for the values in the .env for the AWS configurtation.
   
    - SERVER_SSH_KEY = '** SSH key from the PEM file for AWS EC2 instance **'
