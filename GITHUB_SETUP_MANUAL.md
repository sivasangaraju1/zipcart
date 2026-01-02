# Manual GitHub Repository Setup Guide

Follow these steps to create repositories and push your mobile apps to GitHub.

## Step 1: Create GitHub Repositories

Go to [github.com/new](https://github.com/new) and create **three private repositories**:

1. **Repository 1:** `zipcart-customer-app`
   - Description: "ZipCart Customer Mobile App - Built with React Native"
   - Private repository
   - Do NOT initialize with README, .gitignore, or license

2. **Repository 2:** `zipcart-delivery-app`
   - Description: "ZipCart Delivery Driver Mobile App - Built with React Native"
   - Private repository
   - Do NOT initialize with README, .gitignore, or license

3. **Repository 3:** `zipcart-store-app`
   - Description: "ZipCart Store Management Mobile App - Built with React Native"
   - Private repository
   - Do NOT initialize with README, .gitignore, or license

## Step 2: Push Customer App

```bash
cd mobile/customer-app
git init
git add .
git commit -m "Initial commit: ZipCart Customer App"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/zipcart-customer-app.git
git push -u origin main
```

## Step 3: Push Delivery App

```bash
cd ../delivery-app
git init
git add .
git commit -m "Initial commit: ZipCart Delivery App"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/zipcart-delivery-app.git
git push -u origin main
```

## Step 4: Push Store App

```bash
cd ../store-app
git init
git add .
git commit -m "Initial commit: ZipCart Store App"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/zipcart-store-app.git
git push -u origin main
```

## Important Notes

- Replace `YOUR_USERNAME` with your actual GitHub username
- Make sure you're in the correct directory before running each set of commands
- If prompted for credentials, use your GitHub username and a personal access token (not your password)
- To create a personal access token: Settings → Developer settings → Personal access tokens → Generate new token

## Verification

After completing all steps, verify each repository is available at:
- https://github.com/YOUR_USERNAME/zipcart-customer-app
- https://github.com/YOUR_USERNAME/zipcart-delivery-app
- https://github.com/YOUR_USERNAME/zipcart-store-app

## Next Steps

Once all repositories are created, update the REPOSITORIES.md file with the actual URLs.
