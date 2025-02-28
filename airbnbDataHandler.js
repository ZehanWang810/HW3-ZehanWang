// airbnbDataHandler.js
import fs from 'fs/promises';
import csv from 'csv-parser';
import { createReadStream } from 'fs';
import readline from 'readline';

/**
 * Loads and parses the CSV file.
 * @param {string} filePath - Path to the CSV file.
 * @returns {Promise<Array<Object>>} - Parsed data.
 */
const loadData = async (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
};

/**
 * Filters listings by price range.
 * @param {Array<Object>} data - Listings data.
 * @param {number} minPrice - Minimum price.
 * @param {number} maxPrice - Maximum price.
 * @returns {Array<Object>} - Filtered data.
 */
const filterByPrice = (data, minPrice, maxPrice) => {
    return data.filter(item => {
        const price = parseFloat(item.price.replace('$', ''));
        return price >= minPrice && price <= maxPrice;
    });
};

/**
 * Filters listings by number of rooms.
 * @param {Array<Object>} data - Listings data.
 * @param {number} minRooms - Minimum number of rooms.
 * @param {number} maxRooms - Maximum number of rooms.
 * @returns {Array<Object>} - Filtered data.
 */
const filterByRooms = (data, minRooms, maxRooms) => {
    return data.filter(item => {
        const rooms = parseInt(item.bedrooms);
        return rooms >= minRooms && rooms <= maxRooms;
    });
};

/**
 * Filters listings by minimum rating.
 * @param {Array<Object>} data - Listings data.
 * @param {number} minRating - Minimum rating.
 * @returns {Array<Object>} - Filtered data.
 */
const filterByRating = (data, minRating) => {
    return data.filter(item => {
        const rating = parseFloat(item.review_scores_rating);
        return rating >= minRating;
    });
};

/**
 * Computes statistics for the listings.
 * @param {Array<Object>} data - Listings data.
 * @returns {Object} - Object containing total listings, average price, and ranked hosts.
 */
const computeStats = (data) => {
    const totalListings = data.length;
    const averagePrice = data.reduce((sum, item) => {
        return sum + parseFloat(item.price.replace('$', ''));
    }, 0) / totalListings;

    const hostListings = data.reduce((acc, item) => {
        acc[item.host_id] = (acc[item.host_id] || 0) + 1;
        return acc;
    }, {});

    const rankedHosts = Object.entries(hostListings)
        .sort((a, b) => b[1] - a[1])
        .map(([hostId, count]) => ({ hostId, count }));

    return {
        totalListings,
        averagePrice,
        rankedHosts
    };
};

/**
 * Exports the statistics to a file.
 * @param {string} filePath - Path to the export file.
 * @param {Object} stats - Statistics to export.
 * @returns {Promise<void>}
 */
const exportToFile = async (filePath, stats) => {
    const content = `Total Listings: ${stats.totalListings}\nAverage Price: $${stats.averagePrice.toFixed(2)}\n\nRanked Hosts:\n${stats.rankedHosts.map(host => `Host ID: ${host.hostId}, Listings: ${host.count}`).join('\n')}`;
    await fs.writeFile(filePath, content);
};

/**
 * Main function to load data and handle user input.
 */
const main = async () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter the path to the CSV file: ', async (filePath) => {
        try {
            const data = await loadData(filePath);

            rl.question('Enter minimum price: ', (minPrice) => {
                rl.question('Enter maximum price: ', (maxPrice) => {
                    rl.question('Enter minimum rooms: ', (minRooms) => {
                        rl.question('Enter maximum rooms: ', (maxRooms) => {
                            rl.question('Enter minimum rating: ', async (minRating) => {
                                // Filter data
                                const filteredData = filterByRating(
                                    filterByRooms(
                                        filterByPrice(data, parseFloat(minPrice), parseFloat(maxPrice)),
                                        parseInt(minRooms),
                                        parseInt(maxRooms)
                                    ),
                                    parseFloat(minRating)
                                );

                                // Compute statistics
                                const stats = computeStats(filteredData);
                                console.log('Total Listings:', stats.totalListings);
                                console.log('Average Price:', stats.averagePrice.toFixed(2));
                                console.log('Ranked Hosts:', stats.rankedHosts);

                                // Export to file
                                rl.question('Enter the export file path: ', async (exportPath) => {
                                    await exportToFile(exportPath, stats);
                                    console.log('Data exported successfully!');
                                    rl.close();
                                });
                            });
                        });
                    });
                });
            });
        } catch (error) {
            console.error('Error loading data:', error);
            rl.close();
        }
    });
};

// Start the main function
main();