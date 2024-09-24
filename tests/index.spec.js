const { test, expect } = require('@playwright/test');
const moment = require('moment');
let pagination = 2, currentTime = 0, previousTime = 0


test('Stack Overflow', async ({ page }) => {
  // Navigate to Stack Overflow's questions page and wait for page to load
  await page.goto('https://stackoverflow.com/questions', { waitUntil: 'load' });

   // Find and click the "Newest" button, waiting for it to load
   const newestButton = await page.locator('.s-btn--text[data-text="Newest"]', { waitUntil: 'load' });
   await newestButton.click();
 
   // Find and click the "Filter" button
   const filterButton = await page.locator('button[data-se-uql-target="toggleFormButton"]');
   await filterButton.click();
 
   // Find the text box and enter "javascript"
   const textBox = await page.locator('.s-input.js-tageditor-replacing');
   await textBox.fill('javascript');
  // Click the "Apply filter" button
  const applyButton = await page.locator('button[data-se-uql-target="applyButton"]');
  await applyButton.click();

  // Display questions 50 at a time
  const paginationButton = await page.locator('a[title="Show 50 items per page"]')
  await paginationButton.click()

  // Create an array to store the extracted data
  const questionData = [];

  do {
    for (let i = 0; i < 50; i++) {
    
      // Extract the question title
      const titleElement = await page.locator('.s-post-summary--content-title >> nth=' + i);
      const title = await titleElement.innerText();

      // Extract tags
      const tagListContainer = await page.locator('.js-post-tag-list-wrapper >> nth=' + i);
      const listItems = await tagListContainer.locator('li');
 
      const tags = [];
      for (const item of await listItems.elementHandles()) {
        const tagText = await item.textContent();
        tags.push(tagText.trim()); 
      }

      // Verify that tags contain javascript or else test fails
      expect(tags).toContain('javascript');
  

      // Extract the vote count
      const voteCountElement = await page.locator('.s-post-summary--stats-item-number >> nth=' + i);
      const voteCount = await voteCountElement.innerText();


      // Extract the timestamp
      const timestampElement = await page.locator('.s-user-card--time span >> nth=' + i);
      const timestamp = await timestampElement.innerText();
    
      // Convert relative timestamp to milliseconds using moment.js
      const timestampMilliseconds = moment.duration(timestamp).asMilliseconds();
      currentTime = timestampMilliseconds;
      // Verify that timestamp of the previous time is never higher than current, or else test fails
      expect(previousTime).not.toBeGreaterThan(currentTime);
      previousTime = currentTime;

      // Add the extracted data to the array of objects
      questionData.push({
      title,
      tags,
      voteCount,
      timestamp
      });

      // console.log(questionData);
  }
    
    // Navigate to next set of 50 questions
    const currentUrl = page.url();
    const newUrl = currentUrl + '&page=' + pagination;
    await page.goto(newUrl);
    pagination++; 
  
  } while (pagination <= 3);

    // console.log(questionData.length);

});

