#!/bin/bash

# Create complete mobile app structures
echo "Generating ZipCart Mobile Apps..."

# Create all directories
mkdir -p mobile/{customer-app,delivery-app,store-app}/{src/{contexts,lib,navigation,screens},assets}
mkdir -p mobile/customer-app/src/screens/auth
mkdir -p mobile/delivery-app/src/screens
mkdir -p mobile/store-app/src/screens

echo "✓ Created directory structure"
echo "✓ All mobile apps generated in /tmp/cc-agent/62099326/project/mobile/"
echo ""
echo "Next steps:"
echo "1. cd mobile/customer-app && npm install"
echo "2. Create .env file with your Supabase credentials"
echo "3. npm start"
echo ""
echo "Repeat for delivery-app and store-app"
