const puppeteer = require('puppeteer');

async function scrapeCongressMembers(url) {
    // Launch a new browser instance
    const browser = await puppeteer.launch({ headless: true });
    // Open a new page
    const page = await browser.newPage();
    
    // Navigate to the URL
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    
    // Extract congress members' names from the page
    const congressMembers = await page.evaluate(() => {
        const members = [];
        
        // Select all <a> tags inside elements with class 'result-heading'
        const items = document.querySelectorAll('.expanded .result-heading a');
        
        console.log(items);
        
        // Iterate through each element and push the text content (name) to the array
        items.forEach(item => {
            console.log(item.innerHTML)
            members.push({
                name: item.innerText.trim()
            });
        });
        
        return members;
    });

    // Close the browser
    await browser.close();
    
    return congressMembers;
}

// URL to scrape
const url = 'https://www.congress.gov/members?pageSize=100&q=%7B%22member-state%22%3A%22Alabama%22%7D';

scrapeCongressMembers(url).then(data => {
    console.log(data);  // Output the scraped data
}).catch(error => {
    console.error('Error:', error);
});
