# User Registration Application

A simple web application that allows users to register by submitting their name and email. The data is stored in MongoDB.

## Project Structure

```
user-registration-app/
├── api/
│   └── add-user.js     # API endpoint to add users to MongoDB
├── pages/
│   └── index.html      # Registration form
├── package.json        # Project dependencies
├── vercel.json         # Vercel deployment configuration
└── README.md           # Project documentation
```

## Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/studentsDB
   ```

3. Run the development server:
   ```
   npm run dev
   ```

## Deployment to Vercel

1. Push your project to GitHub:
   - Create a new repository on GitHub
   - Initialize git in your project folder and push to GitHub
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/user-registration-app.git
   git push -u origin main
   ```

2. Connect to Vercel:
   - Go to https://vercel.com and sign in with GitHub
   - Click "New Project" and import your repository
   - In the project settings, add the following environment variable:
     - Key: `MONGODB_URI`
     - Value: `mongodb+srv://labuser:labpass123@cluster0.xxxxxx.mongodb.net/studentsDB`
   - Deploy the project

3. Your application will be available at the URL provided by Vercel.

## Note

Make sure to replace the MongoDB connection string with your actual credentials before deploying.
