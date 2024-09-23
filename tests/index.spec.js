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

  const currentUrl = page.url();
  // Add &pagesize=50 to the URL and reload
  const first50 = currentUrl.includes('?pagesize=50') ? currentUrl : `${currentUrl}?pagesize=50`;
  await page.goto(first50);

  // Extract the question text
  const titleElement = await page.locator('.s-post-summary--content-title a').first();
  const title = await titleElement.innerText();
  console.log("Title of the question:", title);

  // Extract the vote count
  const voteCountElement = await page.locator('.s-post-summary--stats-item-number').first();
  const voteCount = await voteCountElement.innerText();
  console.log(voteCount);

  // Extract the timestamp
  const timestampElement = await page.locator('.s-user-card--time span').first();
  const timestamp = await timestampElement.innerText();
  console.log(timestamp);

   // Extract tags
   const tagListContainer = await page.locator('.js-post-tag-list-wrapper').first();
   const listItems = await tagListContainer.locator('li');
 
   const tags = [];
   for (const item of await listItems.elementHandles()) {
     const tagText = await item.textContent();
     tags.push(tagText.trim()); // Remove leading/trailing whitespace
   }
   console.log(tags);
 
});

