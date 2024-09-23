const { test, expect } = require('@playwright/test');

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

// Create an array to store the extracted data
const questionData = [];

  // Extract the question title
  const titleElement = await page.locator('.s-post-summary--content-title a').first();
  const title = await titleElement.innerText();

   // Extract tags
   const tagListContainer = await page.locator('.js-post-tag-list-wrapper').first();
   const listItems = await tagListContainer.locator('li');
 
   const tags = [];
   for (const item of await listItems.elementHandles()) {
     const tagText = await item.textContent();
     tags.push(tagText.trim()); 
   }
   // Vetify that tags contain javascript or else test fails
   expect(tags).toContain('javascript');
  

  // Extract the vote count
  const voteCountElement = await page.locator('.s-post-summary--stats-item-number').first();
  const voteCount = await voteCountElement.innerText();


  // Extract the timestamp
  const timestampElement = await page.locator('.s-user-card--time span').first();
  const timestamp = await timestampElement.innerText();
  

  // Add the extracted data to the array
  questionData.push({
  title,
  tags,
  voteCount,
  timestamp
});
 
console.log("Question data:", questionData);
});

