import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://192.168.1.211:4200/auth/signin');
  await page.getByPlaceholder('Usuario').fill('jose.jara');
  await page.getByPlaceholder('Password').fill('123@maxi');
  await page.getByRole('button', { name: 'Acceder' }).click();
  await page.locator('a:has-text("Procesos")').click();
  await page.locator('xpath=//a[@href="/finance/loan-payments"]').click();
  const paciente = 'MX124-001992';
  await page.fill('input[aria-autocomplete="list"]', paciente);
  const opcionPaciente = page.locator('xpath=//li[@role="option"]');
  await opcionPaciente.click();
  await page.locator('button:has-text("Buscar")').click();
  await page.waitForTimeout(3000);
  const data = await page.locator('table tbody td span.image-text').count();
  console.log("cuotasCargadas: ", data);

  if (data) {
    const checkbox = page.locator("xpath=//input[@type='checkbox' and not(@disabled)]");
    console.log("checkbox: ", checkbox);
    try {
      await checkbox.first().waitFor({ state: 'visible', timeout: 5000 });
      
    } catch (error) {
      console.log("Error: El checkbox no está visible o habilitado.");
      await page.pause();  
      return;
    }
    const isCheckboxVisible = await checkbox.first().isVisible();
    console.log("Checkbox visible:", isCheckboxVisible);

    if (isCheckboxVisible) {
      await checkbox.first().check(); 
    } else {
      console.log("El checkbox no es visible");
    }

  } else {
    console.log("No se encontraron cuotas para pagar");
  }
  await page.locator('button.btn.btn-sm.btn-success.mt-4.ml-1').nth(0).click(); //Pendiente colocar id
  

  const dataRow = page.locator('tr.pointer-modal');
  await dataRow.first().click();

  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  await page.locator("xpath=//input[@id='PaymentDate']").fill(todayString);
  await page.waitForTimeout(1000);
  await page.locator("xpath=//select[@id='ExchangeRateDay']").selectOption({ index: 1 });
  await page.waitForTimeout(1000);
  await page.locator("xpath=//select[@id='PaymentMethod']").selectOption({ index: 1 });
  await page.waitForTimeout(1000);
  await page.locator("xpath=//select[@id='BankAccount']").selectOption({ index: 1 });
  await page.waitForTimeout(1000);
  const numberOperation = "1234"
  await page.locator("xpath=//input[@id='OperationNumber']").fill(numberOperation);
  await page.waitForTimeout(1000);
  await page.locator("xpath=//select[@id='DocumentSerie']").selectOption({ index: 0 });
  await page.waitForTimeout(1000);
  await page.locator("xpath=//input[@id='DocumentDate']").fill(todayString);
  await page.waitForTimeout(1000);
  await page.locator("xpath=//input[@name='description']").fill('Texto de prueba automatizacion');
  await page.waitForTimeout(1000);
  const path = require('path');
  const filePath = path.join('C:', 'Users', 'user', 'Documents', 'ImageTesting.jpg');
  await page.waitForTimeout(3000);
  await page.locator("xpath=//input[@type='file']").setInputFiles(filePath);
  await page.waitForTimeout(1000);
  const valueUnitInput = await page.locator("xpath=//input[@id='AttentionAmount']");
  const value = await valueUnitInput.inputValue();
  if (parseFloat(value) > 0) {
    await page.locator("xpath=//button[@id='btn-asignar']").click();
    await page.pause();
  }else {
    console.log("valor negativo");
    await valueUnitInput.fill('1');
    await page.waitForTimeout(1000);
    await page.locator('#btn-asignar').click();
    await page.pause();
  }
  await page.locator("xpath=//button[@id='guarda-facturacion']").click();
  
  await page.pause();
});