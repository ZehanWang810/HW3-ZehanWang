# Airbnb Data Handler

This is a Node.js application for processing Airbnb listing data. It allows users to filter listings by price, number of rooms, and rating, compute statistics, and export the results to a file.

## Features

- Load and parse CSV data.
- Filter listings by price, rooms, and rating.
- Compute total listings, average price, and ranked hosts.
- Export results to a file.

## Prerequisites

Before running the application, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Usage
1.Run the program: node airbnbDataHandler.js
2.Follow the prompts to:
Enter the path to the CSV file (e.g., airbnb_data.csv).
Enter filtering criteria (minimum price, maximum price, minimum rooms, maximum rooms, minimum rating).
Enter the export file path (e.g., output.txt).

Example:
node airbnbDataHandler.js
Enter the path to the CSV file: airbnb_data.csv
Enter minimum price: 50
Enter maximum price: 200
Enter minimum rooms: 1
Enter maximum rooms: 3
Enter minimum rating: 4.5
Enter the export file path: output.txt
Data exported successfully!

## Documentation
JSDoc documentation is available in the out/ directory. To generate the documentation, run:
npx jsdoc airbnbDataHandler.js
Then open out/index.html in your browser.

## GenAI Usage
In this project, I used DeepSeek, a generative AI model
prompt:
Identifying Required Functions in airbnbDataHandler.js:The AI helped me identify the necessary functions for the Airbnb data handler
Function Design (Inputs and Outputs):The AI provided guidance on the inputs and outputs for each function
Configuring ESLint and Prettier:The AI provided step-by-step instructions for setting up ESLint and Prettier
Writing the README.md:The AI provided a template for the README.md file
