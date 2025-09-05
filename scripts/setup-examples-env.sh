#!/bin/bash

# Ensure script is run from repository root
if [ ! -f "scripts/setup-examples-env.sh" ]; then
    echo "Error: This script must be run from the repository root"
    echo "Please run: ./scripts/setup-examples-env.sh"
    exit 1
fi

# Check if .env file exists in root directory
if [ ! -f .env ]; then
    echo "Creating .env file in root directory..."
    cp .env.example .env
fi

# Read environment variables from root .env
source .env

# Find all .env.example files in examples directory
find examples -name ".env.example" | while read -r example_file; do
    # Get the directory containing the .env.example file
    dir=$(dirname "$example_file")
    
    # Create or update .env file
    echo "Updating .env file in $dir..."
    cp "$example_file" "$dir/.env"
    
    # Replace placeholder values with actual values from root .env
    # Handle both macOS and Linux sed syntax
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|\${WRITE_KEY}|$WRITE_KEY|g" "$dir/.env"
        sed -i '' "s|\${DATAPLANE_URL}|$DATAPLANE_URL|g" "$dir/.env"
        sed -i '' "s|\${CONFIG_SERVER_HOST}|$CONFIG_SERVER_HOST|g" "$dir/.env"
    else
        # Linux and others
        sed -i "s|\${WRITE_KEY}|$WRITE_KEY|g" "$dir/.env"
        sed -i "s|\${DATAPLANE_URL}|$DATAPLANE_URL|g" "$dir/.env"
        sed -i "s|\${CONFIG_SERVER_HOST}|$CONFIG_SERVER_HOST|g" "$dir/.env"
    fi
done

echo "Environment setup complete!" 
