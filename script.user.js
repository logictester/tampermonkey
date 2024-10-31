// ==UserScript==
// @name         Shelter Insurance Skin
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Re-skin InsurGroup demo with Shelter Insurance Skin
// @author       Alex Basin & Gur Talmor
// @match        https://b2b-noram.tryciam.onewelcome.io/*
// @match        https://insurgroup-noram.tryciam.onewelcome.io/insurgroup/products/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @downloadURL  https://github.com/logictester/tampermonkey/raw/refs/heads/main/script.user.js
// @updateURL    https://github.com/logictester/tampermonkey/raw/refs/heads/main/script.user.js
// ==/UserScript==

(function() {
    'use strict';

    /* ********************
    **       GRANTS      **
    ** *******************/
    GM_addStyle(`
        li:hover {
            background-color: #0032A0 !important;
        }
    `);

    /* ********************
    **    CONSTANTS      **
    ** *******************/
    const targetStringToReplace = "InsurGroup";
    const newPageTitle = "Shelter Insurance";
    const newBaseColor = "#0032A0";
    const mainPageButtonURLs = {"employee": "https://productpod-shelter-deployment.tryciam.onewelcome.io/portal/login/ui/resources/theme/img/employee-b.png",
                                "partner": "https://productpod-shelter-deployment.tryciam.onewelcome.io/portal/login/ui/resources/theme/img/partner-b.png",
                                "support": "https://productpod-shelter-deployment.tryciam.onewelcome.io/portal/login/ui/resources/theme/img/support-b.png",
                                "consumer": "https://productpod-shelter-deployment.tryciam.onewelcome.io/portal/login/ui/resources/theme/img/consumer-b.png",
                                "restButton": "https://productpod-shelter-deployment.tryciam.onewelcome.io/portal/login/ui/resources/theme/img/rest-b.png"
                               }
    const newLogo = {"url": "https://www.shelterinsurance.com/media/shelterinsurance/styleassets/images/new/logo.svg",
                     "width": "150px",
                     "height": "auto",
                     "position": "relative",
                     "top": "-30px",
                     "marginBottom": "20px"}
    const newFaviconURL = "https://productpod-shelter-deployment.tryciam.onewelcome.io/portal/login/ui/resources/theme/img/shelter-insurance-favicon.svg";
    const shouldReplaceBackgroundImages = false;
    const backgroundImages = {'https://b2b-noram.tryciam.onewelcome.io/workforce/login/ui/resources/theme/img/insurgroup-background.png': 'https://www.frommers.com/system/media_items/attachments/000/869/453/s980/Travel_Insurance.webp?1663185729'}

    /* ********************
    **    MAIN LOGIC     **
    ** *******************/
    console.log("Starting Tampermonkey script");

    // Use setInterval to repeatedly check if the page has fully loaded
    const checkPageLoad = setInterval(() => {
        if (document.readyState === 'complete') {
            console.log("Page fully loaded");
            // Run functions that are relevant for *all* pages
            replaceTitle(targetStringToReplace, newPageTitle);
            replaceFavicon(newFaviconURL);
            if (shouldReplaceBackgroundImages) {
                replaceBackgroundImages(backgroundImages);
            }

            const observer = new MutationObserver(() => {
                replaceTitle(targetStringToReplace, newPageTitle);
                replaceFavicon(newFaviconURL);
                passwordResetPage(newBaseColor, newLogo);
            });

            // Observe changes to the document's title
            observer.observe(document.querySelector('title'), { childList: true });

            // Detect the page we're on
            const currentURL = window.location.href;
            console.log("Current URL: ", currentURL);

            // Run the different functions for the different pages
            // Login page
            const loginRegex = /^https:\/\/b2b-noram\.tryciam\.onewelcome\.io\/[^\/]+\/login\/?.*$/;

            if (currentURL.includes("https://b2b-noram.tryciam.onewelcome.io/portal/login")) {
                homePage(newBaseColor, newLogo, mainPageButtonURLs);
            } else if (loginRegex.test(currentURL)) {
                loginPage(newBaseColor, newLogo);
            }

            // Password Reset page
            const passwordResetRegex = /^https:\/\/b2b-noram\.tryciam\.onewelcome\.io\/(?:[^\/]+\/)*passwordreset\//;

            if (passwordResetRegex.test(currentURL)) {
                passwordResetPage(newBaseColor, newLogo);
            }

            // Logout page

            // Registration page

            // Clear the interval once the script has run
            clearInterval(checkPageLoad);
        }
    }, 100); // Check every 100ms until the page is fully loaded

    /* ********************
    **   PAGES FUNCTIONS **
    ** *******************/
    function homePage(baseColor, newLogo, newPageButtonURLs) {
        console.log("homePage running");
        replaceLogo(newLogo);
        changeIdBackgroundColor('employeeSocialButton', baseColor);
        changeIdBackgroundColor('partnerSocialButton', baseColor);
        changeIdBackgroundColor('supportSocialButton', baseColor);
        changeIdBackgroundColor('consumerSocialButton', baseColor);

        replaceImageInPlace("employee", newPageButtonURLs.employee);
        replaceImageInPlace("partner", newPageButtonURLs.partner);
        replaceImageInPlace("support", newPageButtonURLs.support);
        replaceImageInPlace("consumer", newPageButtonURLs.consumer);
        replaceImageInPlace("restButton", newPageButtonURLs.restButton);

        styleElementsByText("Privacy Policy", baseColor, false);
        styleElementsByText("Terms of Service", baseColor, false);

        changeIdBackgroundColor('loginLanguageMenuIcon', baseColor);
    }

    function loginPage(baseColor, newLogo) {
        console.log("loginPage function running!");

        replaceLogo(newLogo);

        // Change color of the "Forgot password?" text and its underline
        styleElementsByText('Forgot password?', baseColor);

        // Change color of the "Go back" text and its underline
        styleElementsByText('Go back', baseColor);

        styleElementsByText('EN', baseColor);

        styleLiElementsBySelectedState(baseColor);

        replaceText('InsurGroup-ID', 'Shelter-ID *');

        changeClassColor('Mui-focused', baseColor);

        changePseudoElementBorderColor('MuiInput-underline', baseColor);

        changeActiveButtonSvgFillColor(baseColor);

        changeIdColor('toPwdResetSocialButton', baseColor);
        changeIdColor('backToPortalSocialButton', baseColor);

        // Change background and text color of the "Login" button
        const loginButton = document.querySelector('#loginFormUsernameAndPasswordButton');

        if (loginButton) {
            // Override button styles with !important
            loginButton.style.setProperty('background-color', baseColor, 'important');
            loginButton.style.setProperty('color', '#FFFFFF', 'important');
        } else {
            console.log('Login button not found');
        }

    }

    function passwordResetPage(baseColor, newLogo) {
        console.log("passwordResetPage running!");
        replaceLogo(newLogo);
        styleElementsByText('EN', baseColor);
        changeIdBackgroundColor('pwd_reset_user_identification_step-submit-Submit-button_container', baseColor);
        styleElementsByText('Help', baseColor);
        styleElementsByText('Password reset', baseColor, false);
        changeClassColor('Mui-focused', baseColor);
        changePseudoElementBorderColor('MuiInput-underline', baseColor);
    }

    /* ********************
    **    FUNCTIONS      **
    ** *******************/
    function replaceTitle(titleToReplace, newTitle) {
        console.log("replaceTitle called");
        // Use a loop to continuously set the title if something is overriding it

        console.log("Current title:", document.title);
        // Check and replace the title if it includes the target string
        if (document.title.includes(titleToReplace)) {
            document.title = document.title.replace(titleToReplace, newTitle);
            console.log("Tab title successfully changed to: " + document.title);
        }
    }

    // Function to replace, resize, and reposition the logo
    function replaceLogo(newLogo) {
        console.log("replaceLogo called");
        let logoElement = document.querySelector('.logoContainer img');

        console.log("logoElement:", logoElement);

        if (logoElement) {
            logoElement.src = newLogo.url;

            if (window.getComputedStyle(logoElement).width == "232.5px") {
                logoElement.style.width = "20%";
            } else {
                logoElement.style.width = newLogo.width;
                logoElement.style.height = newLogo.height;
                logoElement.style.position = newLogo.position;
                logoElement.style.top = newLogo.top;
                logoElement.style.marginBottom = newLogo.marginBottom;
            }
        }

        if (!logoElement) {
            logoElement = document.getElementById('workflow-header-logo');
            console.log('Found new element?:', logoElement);

            const allClasses = logoElement.classList;
            console.log('All classes:', allClasses);

            for (let i = 0; i < allClasses.length; i++) {
                // for each class, get the CSS rules
                const rules = window.getComputedStyle(logoElement, '.' + allClasses[i]);

                // replace background if exists
                if (rules.backgroundImage) {
                    console.log('Found background image:', rules.backgroundImage);
                    logoElement.style.backgroundImage = `url("${newLogo.url}")`;
                    logoElement.style.position = 'fixed';
                    logoElement.style.marginLeft = '255px';
                }
            }
        }
    }

    function replaceImageInPlace(imageAltName, newImageURL) {
        const imageElement = document.querySelector(`[alt="${imageAltName}"]`);
        imageElement.src = newImageURL;
    }

    // Function to find and style elements by exact text content
    function styleElementsByText(text, color, includeUnderline=true) {
        const xpath = `//*[normalize-space(text())='${text}']`;
        const result = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
        );
        if (result.snapshotLength === 0) {
            console.log(`No elements found with text: "${text}"`);
        }
        for (let i = 0; i < result.snapshotLength; i++) {
            const element = result.snapshotItem(i);

            // Override text color with !important
            element.style.setProperty('color', color, 'important');

            // Ensure underline is present and override its color with !important
            if (includeUnderline) {
                element.style.setProperty('text-decoration', 'underline', 'important');
                element.style.setProperty('text-decoration-color', color, 'important');
            }
        }
    }

    function styleElementsBackgroundByText(text, color, includeUnderline=true) {
        const xpath = `//*[normalize-space(text())='${text}']`;
        const result = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
        );
        if (result.snapshotLength === 0) {
            console.log(`No elements found with text: "${text}"`);
        }
        for (let i = 0; i < result.snapshotLength; i++) {

            console.log(`working on element ${i}:`, element);

            const element = result.snapshotItem(i);

            // Override text color with !important
            element.style.setProperty('background-color', color, 'important');
        }
    }

    function changeClassColor(className, color) {
        // Create a CSS style rule
        var css = '.' + className + ' { color: ' + color + ' !important; }';
        var style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        // Append the style to the document head
        document.head.appendChild(style);
    }

    function replaceBackgroundImages(imageReplacements) {
        // Query all elements with background images
        document.querySelectorAll('*').forEach(function(element) {
            const computedStyle = window.getComputedStyle(element);
            const backgroundImage = computedStyle.getPropertyValue('background-image');

            if (backgroundImage && backgroundImage !== 'none') {
                // Extract the URL from the background-image property
                const urlMatch = backgroundImage.match(/url\(["']?(.*?)["']?\)/);
                if (urlMatch && urlMatch[1]) {
                    let originalUrl = urlMatch[1];

                    // Resolve relative URLs
                    if (!originalUrl.startsWith('http')) {
                        originalUrl = new URL(originalUrl, window.location.href).href;
                    }

                    if (imageReplacements[originalUrl]) {
                        // Use !important to override existing styles
                        element.style.setProperty(
                            'background-image',
                            `url("${imageReplacements[originalUrl]}")`,
                            'important'
                        );
                    }
                }
            }
        });
    }
    // Function to replace the favicon
    function replaceFavicon(newFaviconUrl) {
        console.log("replaceFavicon called");
        // Remove existing favicon(s)
        let existingFavicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
        existingFavicons.forEach(favicon => favicon.parentNode.removeChild(favicon));

        // Create a new favicon link element
        const newFavicon = document.createElement('link');
        newFavicon.rel = 'icon';
        newFavicon.href = newFaviconUrl;

        // Add the new favicon to the document head
        document.head.appendChild(newFavicon);
        console.log("Favicon replaced with: " + newFaviconUrl);
    }

    function changeIdColor(idName, color) {
        // Create a CSS style rule
        var css = '#' + idName + ' { color: ' + color + ' !important; }';
        var style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        // Append the style to the document head
        document.head.appendChild(style);
    }

    function changeIdBackgroundColor(idName, color) {
        // Create a CSS style rule
        var css = '#' + idName + ' { background-color: ' + color + ' !important; }';
        var style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        // Append the style to the document head
        document.head.appendChild(style);
    }

    function replaceText(fromText, toText) {
        const xpath = `//*[normalize-space(text())='${fromText}']`;
        const result = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
        );
        if (result.snapshotLength === 0) {
            console.log(`No elements found with text: "${fromText}"`);
        }
        for (let i = 0; i < result.snapshotLength; i++) {
            const element = result.snapshotItem(i);

            // Override text color with !important
            element.innerHTML = toText;
        }
    }

    // Helper function to convert hex color to rgba
    function hexToRGBA(hex, alpha) {
        // Remove '#' if present
        hex = hex.replace('#', '');
        // Parse r, g, b values
        let r, g, b;

        if (hex.length === 3) {
            r = parseInt(hex[0] + hex[0], 16);
            g = parseInt(hex[1] + hex[1], 16);
            b = parseInt(hex[2] + hex[2], 16);
        } else if (hex.length === 6) {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        } else {
            console.error('Invalid hex color:', hex);
            return null;
        }

        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // Function to style li elements based on selected state
    function styleLiElementsBySelectedState(color) {
        // Get all li elements
        const liElements = document.querySelectorAll('li');

        liElements.forEach(function(li) {
            let isSelected = false;

            // Determine if li is selected
            // Adjust this condition based on how the selected state is indicated
            if (li.classList.contains('Mui-selected')) {
                isSelected = true;
            }

            // Apply styles accordingly
            if (isSelected) {
                // Apply the color with full opacity
                li.style.setProperty('background-color', color, 'important');
            } else {
                // Apply the color with alpha 0.2
                const rgbaColor = hexToRGBA(color, 0.2);
                if (rgbaColor) {
                    //li.style.setProperty('background-color', rgbaColor, 'important');
                    //li.style.setProperty('transition', 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms', 'important');
                }
            }
        });
    }

    // This is used to capture the underlines colors of the text fields when selected
    function changePseudoElementBorderColor(classSubstring, color) {
        // Create a CSS style rule
        var css = '[class*="' + classSubstring + '"]::after { border-bottom-color: ' + color + ' !important; }';
        var style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        // Append the style to the document head
        document.head.appendChild(style);
    }

    function changeActiveButtonSvgFillColor(color) {
        // Create a CSS style rule
        var css = 'button.active svg { fill: ' + color + ' !important; }';
        var style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        // Append the style to the document head
        document.head.appendChild(style);
    }
})();