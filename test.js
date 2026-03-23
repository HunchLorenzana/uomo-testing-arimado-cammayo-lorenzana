const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const assert = require("assert");
const BASE_URL = "https://uomo-ecommerce-website.netlify.app";
const RECORD_MODE = false; // Change to false to disable the pause
const RECORD_DELAY_MS = 2000; // Delay in milliseconds

async function recordPause(driver) 
{
    if (RECORD_MODE) 
    {
        await driver.sleep(RECORD_DELAY_MS);
    }
}

// Driver configuration to disable chrome logs
async function setupSilentChromeDriver() 
{
    let options = new chrome.Options();
    options.addArguments("--log-level=3", "--silent", "--disable-logging");
    options.excludeSwitches("enable-logging"); 
    return await new Builder().forBrowser("chrome").setChromeOptions(options).build();
}

async function closePopupIfPresent(driver) 
{
    try 
    {
        await driver.sleep(1000); 
        let closeBtn = await driver.wait(until.elementLocated(By.className('close-button')), 3000);
        await driver.wait(until.elementIsVisible(closeBtn), 3000);
        await closeBtn.click();
        await driver.sleep(1000); 
    } catch (error) 
    {
        // if no popup appears, continue
    }
}

async function scrollToElement(driver, element) 
{
    await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", element);
    await driver.sleep(1500); 
}

runTests();

async function runTests() 
{
    await authenticationTesting();
    await productTesting();
    await cartTesting();
    await checkoutTesting();
}

// 1. AUTHENTICATION TESTING
async function authenticationTesting() 
{
    console.log("\nStarting Authentication Testing:");

    // TC01: Empty Login Field Validation
    let driver1 = await setupSilentChromeDriver();
    try 
    {
        await driver1.get(BASE_URL + "/loginSignUp");
        await driver1.manage().window().maximize();
        await closePopupIfPresent(driver1);

        await driver1.findElement(By.xpath("//button[text()='Log In']")).click();
        
        let expectedMessage = "Please fill out this field.";
        let element = await driver1.findElement(By.css("input[type='email']"));
        let actualText = await element.getAttribute('validationMessage');
        
        assert.strictEqual(actualText, expectedMessage, "TC01 FAILED: Empty Login Validation");
        console.log("TC01 PASSED: Empty Login Field Validation");
    } finally 
    {
        await recordPause(driver1);
        await driver1.quit();
    }

    // TC02: Fill and Submit Login Form
    let driver2 = await setupSilentChromeDriver();
    try 
    {
        await driver2.get(BASE_URL + "/loginSignUp");
        await driver2.manage().window().maximize();
        await closePopupIfPresent(driver2);

        let emailInput = await driver2.findElement(By.css(".loginSignUpTabsContentLogin input[type='email']"));
        await emailInput.sendKeys("hunch@danhill.com");
        
        let passInput = await driver2.findElement(By.css(".loginSignUpTabsContentLogin input[type='password']"));
        await passInput.sendKeys("hunch_admin_67");

        let loginBtn = await driver2.findElement(By.xpath("//button[text()='Log In']"));
        
        let expectedMessage = "hunch@danhill.com";
        let actualText = await emailInput.getAttribute("value");
        
        await loginBtn.click();
        
        assert.strictEqual(actualText, expectedMessage, "TC02 FAILED: Login Form Fill");
        console.log("TC02 PASSED: Successfully Filled and Submitted Login Form");
    } finally 
    {
        await recordPause(driver2);
        await driver2.quit();
    }

    // TC03: Toggle to Register Tab and Fill Form
    let driver3 = await setupSilentChromeDriver();
    try 
    {
        await driver3.get(BASE_URL + "/loginSignUp");
        await driver3.manage().window().maximize();
        await closePopupIfPresent(driver3);

        await driver3.findElement(By.xpath("//p[text()='Register']")).click();
        await driver3.sleep(1000); 
        
        let usernameInput = await driver3.findElement(By.css(".loginSignUpTabsContentRegister input[type='text']"));
        await usernameInput.sendKeys("Harvuinn");
        
        let emailInput = await driver3.findElement(By.css(".loginSignUpTabsContentRegister input[type='email']"));
        await emailInput.sendKeys("harvuinn@danhill.com");
        
        let passInput = await driver3.findElement(By.css(".loginSignUpTabsContentRegister input[type='password']"));
        await passInput.sendKeys("harvuinn!123");
        
        let registerBtn = await driver3.findElement(By.xpath("//button[text()='Register']"));
        
        let expectedMessage = "Harvuinn";
        let actualText = await usernameInput.getAttribute("value");
        
        await registerBtn.click();
        
        assert.strictEqual(actualText, expectedMessage, "TC03 FAILED: Register Form Fill");
        console.log("TC03 PASSED: Successfully Filled and Submitted Register Form");
    } finally 
    {
        await recordPause(driver3);
        await driver3.quit();
    }
}

// 2. PRODUCT TESTING
async function productTesting() 
{
    console.log("\nStarting Product Testing:");

    // TC04: View Product List (Shop Page)
    let driver4 = await setupSilentChromeDriver();
    try 
    {
        await driver4.get(BASE_URL + "/shop");
        await driver4.manage().window().maximize();
        await closePopupIfPresent(driver4);

        let expectedMessage = "THE SHOP";
        let element = await driver4.findElement(By.xpath("//a[text()='The Shop']"));
        let actualText = await element.getText();
        
        assert.strictEqual(actualText.toUpperCase(), expectedMessage, "TC04 FAILED: View Product List");
        console.log("TC04 PASSED: View Product List on Shop Page");
    } finally 
    {
        await recordPause(driver4);
        await driver4.quit();
    }

    // TC05: Search/Filter Product Brand
     let driver5 = await setupSilentChromeDriver();
    try 
    {
        await driver5.get(BASE_URL + "/shop");
        await driver5.manage().window().maximize();
        await closePopupIfPresent(driver5);

        let searchInput = await driver5.findElement(By.css(".searchBar input"));
        await scrollToElement(driver5, searchInput); 
        await searchInput.sendKeys("Adidas");
        await driver5.sleep(1000);
        
        let expectedMessage = "ADIDAS";
        let element = await driver5.findElement(By.xpath("//label[text()='Adidas']"));
        let actualText = await element.getText();
        
        assert.strictEqual(actualText.toUpperCase(), expectedMessage, "TC05 FAILED: Brand Filter");
        console.log("TC05 PASSED: Search/Filter Product by Brand");
    } finally 
    {
        await recordPause(driver5);
        await driver5.quit();
    }


    // TC06: View Product Details
    let driver6 = await setupSilentChromeDriver();
    try 
    {
        await driver6.get(BASE_URL + "/shop");
        await driver6.manage().window().maximize();
        await closePopupIfPresent(driver6);

        await driver6.findElement(By.className("sdProduct_front")).click();
        await driver6.wait(until.elementLocated(By.xpath("//h1[contains(text(), 'Jacket')]")), 5000);
        
        let expectedMessage = "LIGHTWEIGHT PUFFER JACKET WITH A HOOD";
        let element = await driver6.findElement(By.css(".productName h1"));
        let actualText = await element.getText();
        
        assert.strictEqual(actualText.toUpperCase(), expectedMessage, "TC06 FAILED: Product Details View");
        console.log("TC06 PASSED: View Product Details Page");
    } finally 
    {
        await recordPause(driver6);
        await driver6.quit();
    }

    // TC07: Interactive Image Gallery
    let driver7 = await setupSilentChromeDriver();
    try 
    {
        await driver7.get(BASE_URL + "/product");
        await driver7.manage().window().maximize();
        await closePopupIfPresent(driver7);

        let element = await driver7.findElement(By.css(".productFullImg img"));
        let initialSrc = await element.getAttribute("src");
        
        await driver7.findElement(By.xpath("//div[@class='productThumb']/img[2]")).click();
        await driver7.sleep(500);
        
        let actualText = await element.getAttribute("src");
        assert.notStrictEqual(actualText, initialSrc, "TC07 FAILED: Image Gallery Check");
        console.log("TC07 PASSED: Interactive Image Gallery Works");
    } finally 
    {
        await recordPause(driver7);
        await driver7.quit();
    }

    // TC08: Select Product Size
    let driver8 = await setupSilentChromeDriver();
    try 
    {
        await driver8.get(BASE_URL + "/product");
        await driver8.manage().window().maximize();
        await closePopupIfPresent(driver8);

        await driver8.findElement(By.xpath("//button[text()='M']")).click();
        await driver8.sleep(500);
        
        let expectedMessage = "rgb(0, 0, 0)";
        let element = await driver8.findElement(By.xpath("//button[text()='M']"));
        let actualText = await element.getCssValue("border-color");
        
        assert.strictEqual(actualText, expectedMessage, "TC08 FAILED: Size Selection");
        console.log("TC08 PASSED: Select Product Size");
    } finally 
    {
        await recordPause(driver8);
        await driver8.quit();
    }
    
    // TC09: Add Product to Wishlist
    let driver9 = await setupSilentChromeDriver();
    try 
    {
        await driver9.get(BASE_URL + "/product");
        await driver9.manage().window().maximize();
        await closePopupIfPresent(driver9);

        let wishlistBtn = await driver9.findElement(By.xpath("//p[text()='Add to Wishlist']/parent::button"));
        await driver9.executeScript("arguments[0].click();", wishlistBtn);
        
        let expectedMessage = "ADD TO WISHLIST";
        let element = await driver9.findElement(By.xpath("//p[text()='Add to Wishlist']"));
        let actualText = await element.getText();
        
        assert.strictEqual(actualText.toUpperCase(), expectedMessage, "TC09 FAILED: Add to Wishlist");
        console.log("TC09 PASSED: Add Product to Wishlist");
    } finally 
    {
        await recordPause(driver9);
        await driver9.quit();
    }
}

// 3. CART TESTING
async function cartTesting() 
{
    console.log("\nStarting Cart Testing:");

    // TC10: Add Product to Cart
    let driver10 = await setupSilentChromeDriver();
    try 
    {
        await driver10.get(BASE_URL + "/product");
        await driver10.manage().window().maximize();
        await closePopupIfPresent(driver10);

        await driver10.findElement(By.xpath("//button[text()='Add to Cart']")).click();
        await driver10.sleep(1000);
        
        let expectedMessage = "1";
        let element = await driver10.findElement(By.css(".MuiBadge-badge"));
        let actualText = await element.getText();
        
        assert.strictEqual(actualText, expectedMessage, "TC10 FAILED: Add to Cart");
        console.log("TC10 PASSED: Add Product to Cart");
    } finally 
    {
        await recordPause(driver10);
        await driver10.quit();
    }

    // TC11: Increment Cart Quantity
    let driver11 = await setupSilentChromeDriver();
    try 
    {
        await driver11.get(BASE_URL + "/product");
        await driver11.manage().window().maximize();
        await closePopupIfPresent(driver11);

        await driver11.findElement(By.xpath("//button[text()='Add to Cart']")).click();
        await driver11.sleep(1000);
        await driver11.findElement(By.css(".navBar a[href='/cart']")).click();
        await driver11.sleep(1500);

        let increaseBtn = await driver11.findElement(By.xpath("//div[@class='ShoppingBagTableQuantity']/button[text()='+']"));
        await increaseBtn.click();
        await driver11.sleep(1000);
        
        let expectedMessage = "2";
        let element = await driver11.findElement(By.css(".ShoppingBagTableQuantity input"));
        let actualText = await element.getAttribute("value");
        
        assert.strictEqual(actualText, expectedMessage, "TC11 FAILED: Update Quantity");
        console.log("TC11 PASSED: Increment Cart Quantity");
    } finally 
    {
        await recordPause(driver11);
        await driver11.quit();
    }

    // TC12: Validate Total Cart Price
    let driver12 = await setupSilentChromeDriver();
    try 
    {
        await driver12.get(BASE_URL + "/product");
        await driver12.manage().window().maximize();
        await closePopupIfPresent(driver12);

        await driver12.findElement(By.xpath("//button[text()='Add to Cart']")).click();
        await driver12.sleep(1000);
        await driver12.findElement(By.css(".navBar a[href='/cart']")).click();
        await driver12.sleep(1500);

        let increaseBtn = await driver12.findElement(By.xpath("//div[@class='ShoppingBagTableQuantity']/button[text()='+']"));
        await increaseBtn.click();
        await driver12.sleep(1000);

        let expectedMessage = "$196.00";
        let element = await driver12.findElement(By.xpath("//th[text()='Total']/following-sibling::td"));
        let actualText = await element.getText();
        
        assert.strictEqual(actualText, expectedMessage, "TC12 FAILED: Total Price Calculation");
        console.log("TC12 PASSED: Validate Total Cart Price");
    } finally 
    {
        await recordPause(driver12);
        await driver12.quit();
    }

    // TC13: Remove Item from Cart
    let driver13 = await setupSilentChromeDriver();
    try 
    {
        await driver13.get(BASE_URL + "/product");
        await driver13.manage().window().maximize();
        await closePopupIfPresent(driver13);

        await driver13.findElement(By.xpath("//button[text()='Add to Cart']")).click();
        await driver13.sleep(1000);
        await driver13.findElement(By.css(".navBar a[href='/cart']")).click();
        await driver13.sleep(1500);

        await driver13.findElement(By.css(".shoppingBagTable tbody tr td:last-child svg")).click();
        await driver13.sleep(1000);
        
        let expectedMessage = "YOUR CART IS EMPTY!";
        let element = await driver13.findElement(By.xpath("//span[text()='Your cart is empty!']"));
        let actualText = await element.getText();
        
        assert.strictEqual(actualText.toUpperCase(), expectedMessage, "TC13 FAILED: Remove from Cart");
        console.log("TC13 PASSED: Remove Item from Cart");
    } finally 
    {
        await recordPause(driver13);
        await driver13.quit();
    }

    // TC14: Display Empty Cart Elements
    let driver14 = await setupSilentChromeDriver();
    try 
    {
        await driver14.get(BASE_URL + "/cart");
        await driver14.manage().window().maximize();
        await closePopupIfPresent(driver14);

        let expectedMessage = "SHOP NOW";
        let element = await driver14.wait(until.elementLocated(By.xpath("//button[text()='Shop Now']")), 5000);
        let actualText = await element.getText();
        
        assert.strictEqual(actualText.toUpperCase(), expectedMessage, "TC14 FAILED: Empty Cart Display");
        console.log("TC14 PASSED: Display Empty Cart Actions");
    } finally 
    {
        await recordPause(driver14);
        await driver14.quit();
    }
}

// 4. CHECKOUT TESTING
async function checkoutTesting() 
{
    console.log("\nStarting Checkout Testing:");

    // TC15: Proceed to Checkout Page
    let driver15 = await setupSilentChromeDriver();
    try 
    {
        await driver15.get(BASE_URL + "/product");
        await driver15.manage().window().maximize();
        await closePopupIfPresent(driver15);

        await driver15.findElement(By.xpath("//button[text()='Add to Cart']")).click();
        await driver15.sleep(1000);
        await driver15.findElement(By.css(".navBar a[href='/cart']")).click();
        await driver15.sleep(1500);

        let checkoutBtn = await driver15.wait(until.elementLocated(By.xpath("//button[text()='Proceed to Checkout']")), 5000);
        await driver15.executeScript("arguments[0].click();", checkoutBtn);
        await driver15.wait(until.elementLocated(By.xpath("//h4[text()='Billing Details']")), 5000);
        
        let expectedMessage = "BILLING DETAILS";
        let element = await driver15.findElement(By.xpath("//h4[text()='Billing Details']"));
        let actualText = await element.getText();
        
        assert.strictEqual(actualText.toUpperCase(), expectedMessage, "TC15 FAILED: Proceed to Checkout");
        console.log("TC15 PASSED: Proceed to Checkout Page");
    } finally 
    {
        await recordPause(driver15);
        await driver15.quit();
    }

    // TC16: Fill Checkout Form Data
    let driver16 = await setupSilentChromeDriver();
    try 
    {
        await driver16.get(BASE_URL + "/product");
        await driver16.manage().window().maximize();
        await closePopupIfPresent(driver16);

        await driver16.findElement(By.xpath("//button[text()='Add to Cart']")).click();
        await driver16.sleep(1000);
        await driver16.findElement(By.css(".navBar a[href='/cart']")).click();
        await driver16.sleep(1500);

        let checkoutBtn = await driver16.wait(until.elementLocated(By.xpath("//button[text()='Proceed to Checkout']")), 5000);
        await driver16.executeScript("arguments[0].click();", checkoutBtn);
        await driver16.wait(until.elementLocated(By.xpath("//h4[text()='Billing Details']")), 5000);

        await driver16.findElement(By.css("input[placeholder='First Name']")).sendKeys("Hunch");
        await driver16.findElement(By.css("input[placeholder='Last Name']")).sendKeys("Danhill");
        await driver16.findElement(By.css("input[placeholder='Company Name (optional)']")).sendKeys("Danhill Corp");
        
        let countrySelect = await driver16.findElement(By.css("select[name='country']"));
        await countrySelect.sendKeys("Finland");
        
        let streetAddress1 = await driver16.findElement(By.css("input[placeholder='Street Address*']"));
        await streetAddress1.sendKeys("67 SixSeven Street");
        let streetAddress2 = await driver16.findElement(By.css("input[placeholder='']")); 
        await streetAddress2.sendKeys("Apt 67");
        
        await driver16.findElement(By.css("input[placeholder='Town / City *']")).sendKeys("Doonsamay");
        await driver16.findElement(By.css("input[placeholder='Postcode / ZIP *']")).sendKeys("6767");
        await driver16.findElement(By.css("input[placeholder='Phone *']")).sendKeys("096789101112");
        await driver16.findElement(By.css("input[placeholder='Your Mail *']")).sendKeys("hunch@danhill.com");
        
        let orderNotes = await driver16.findElement(By.css("textarea[placeholder='Order Notes (Optional)']"));
        await scrollToElement(driver16, orderNotes);
        await orderNotes.sendKeys("Please leave package with doorman.");
        
        let expectedMessage = "Hunch";
        let element = await driver16.findElement(By.css("input[placeholder='First Name']"));
        let actualText = await element.getAttribute("value");
        
        assert.strictEqual(actualText, expectedMessage, "TC16 FAILED: Fill All Checkout Form Fields");
        console.log("TC16 PASSED: Filled All Checkout Form Data");
    } finally 
    {
        await recordPause(driver16);
        await driver16.quit();
    }

    // TC17: Select Cash on Delivery Payment
    let driver17 = await setupSilentChromeDriver();
    try 
    {
        await driver17.get(BASE_URL + "/product");
        await driver17.manage().window().maximize();
        await closePopupIfPresent(driver17);

        await driver17.findElement(By.xpath("//button[text()='Add to Cart']")).click();
        await driver17.sleep(1000);
        await driver17.findElement(By.css(".navBar a[href='/cart']")).click();
        await driver17.sleep(1500);

        let checkoutBtn = await driver17.wait(until.elementLocated(By.xpath("//button[text()='Proceed to Checkout']")), 5000);
        await driver17.executeScript("arguments[0].click();", checkoutBtn);
        await driver17.wait(until.elementLocated(By.xpath("//h4[text()='Billing Details']")), 5000);

        let codRadio = await driver17.findElement(By.css("input[value='Cash on delivery']"));
        await scrollToElement(driver17, codRadio);
        await driver17.executeScript("arguments[0].click();", codRadio);
        
        let expectedMessage = true;
        let actualText = await codRadio.isSelected();
        
        assert.strictEqual(actualText, expectedMessage, "TC17 FAILED: Payment Method Selection");
        console.log("TC17 PASSED: Selected Cash on Delivery Payment");
    } finally 
    {
        await recordPause(driver17);
        await driver17.quit();
    }

    // TC18: Submit Order Execution
    let driver18 = await setupSilentChromeDriver();
    try 
    {
        await driver18.get(BASE_URL + "/product");
        await driver18.manage().window().maximize();
        await closePopupIfPresent(driver18);

        await driver18.findElement(By.xpath("//button[text()='Add to Cart']")).click();
        await driver18.sleep(1000);
        await driver18.findElement(By.css(".navBar a[href='/cart']")).click();
        await driver18.sleep(1500);

        let checkoutBtn = await driver18.wait(until.elementLocated(By.xpath("//button[text()='Proceed to Checkout']")), 5000);
        await driver18.executeScript("arguments[0].click();", checkoutBtn);

        let placeOrderBtn = await driver18.wait(until.elementLocated(By.xpath("//button[text()='Place Order']")), 5000);
        await driver18.executeScript("arguments[0].click();", placeOrderBtn);
        await driver18.wait(until.elementLocated(By.xpath("//h3[contains(text(),'Your order is completed!')]")), 5000);
        
        let expectedMessage = "YOUR ORDER IS COMPLETED!";
        let element = await driver18.findElement(By.xpath("//h3[contains(text(),'Your order is completed!')]"));
        let actualText = await element.getText();
        
        assert.strictEqual(actualText.toUpperCase(), expectedMessage, "TC18 FAILED: Submit Order");
        console.log("TC18 PASSED: Submit Order Execution");
    } finally 
    {
        await recordPause(driver18);
        await driver18.quit();
    }

    // TC19: Validate Specific Order Confirmation Details
    let driver19 = await setupSilentChromeDriver();
    try 
    {
        await driver19.get(BASE_URL + "/product");
        await driver19.manage().window().maximize();
        await closePopupIfPresent(driver19);

        await driver19.findElement(By.xpath("//button[text()='Add to Cart']")).click();
        await driver19.sleep(1000);
        await driver19.findElement(By.css(".navBar a[href='/cart']")).click();
        await driver19.sleep(1500);

        let checkoutBtn = await driver19.wait(until.elementLocated(By.xpath("//button[text()='Proceed to Checkout']")), 5000);
        await driver19.executeScript("arguments[0].click();", checkoutBtn);

        let placeOrderBtn = await driver19.wait(until.elementLocated(By.xpath("//button[text()='Place Order']")), 5000);
        await driver19.executeScript("arguments[0].click();", placeOrderBtn);
        await driver19.wait(until.elementLocated(By.xpath("//h3[contains(text(),'Your order is completed!')]")), 5000);
        
        let expectedMessage = "Lightweight Puffer Jacket x 1";
        let element = await driver19.findElement(By.css(".orderItems table tbody tr td:first-child"));
        let actualText = await element.getText();
        
        assert.strictEqual(actualText, expectedMessage, "TC19 FAILED: Specific Confirmation");
        console.log("TC19 PASSED: Validated exact product and quantity in Order Confirmation");
    } finally 
    {
        await recordPause(driver19);
        await driver19.quit();
    }

    // TC20: Checkout Disabled for Empty Cart
    let driver20 = await setupSilentChromeDriver();
    try 
    {
        await driver20.get(BASE_URL + "/cart");
        await driver20.manage().window().maximize();
        await closePopupIfPresent(driver20);

        let expectedMessage = false;
        let element = await driver20.findElement(By.xpath("//button[text()='Proceed to Checkout']"));
        let actualText = await element.isEnabled();
        
        assert.strictEqual(actualText, expectedMessage, "TC20 FAILED: Empty Cart Checkout Prevented");
        console.log("TC20 PASSED: Checkout Disabled for Empty Cart");
    } finally 
    {
        await recordPause(driver20);
        await driver20.quit();
    }
}