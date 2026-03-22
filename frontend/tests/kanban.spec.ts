import { test, expect } from '@playwright/test';

test.describe('Kanban Board MVP', () => {
  test('should load the board with 5 default columns', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page.locator('h1')).toHaveText('Project Alpha');
    
    // Check for standard 5 columns using exact heading locators
    await expect(page.getByRole('heading', { name: 'To Do', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'In Progress', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Review', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Testing', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Done', exact: true })).toBeVisible();
  });

  test('should allow deleting a card', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Identify the delete button inside the card that contains specific text
    const deleteBtn = page.getByRole('button', { name: 'Delete card' }).first();
    await expect(deleteBtn).toBeEnabled();
    await deleteBtn.click();
    
    // We expect the 'Project kick-off' card to be deleted since it's the first one in the list
    await expect(page.getByText('Project kick-off', { exact: true })).not.toBeVisible();
  });
});
