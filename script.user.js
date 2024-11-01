// ==UserScript==
// @name         Shelter Insurance Skin
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Re-skin InsurGroup demo with Shelter Insurance Skin
// @author       Alex Basin & Gur Talmor
// @match        https://b2b-noram.tryciam.onewelcome.io/*
// @match        https://insurgroup-noram.tryciam.onewelcome.io/*
// @match        https://b2b-workforceusaws.platform.ritm.iwelcome.com/*
// @match        https://www.mailinator.com/*
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
    const consumerLogos = {"insurcar": "https://productpod-shelter-deployment.tryciam.onewelcome.io/portal/login/ui/resources/theme/img/shelter-icar.png",
                            "insurlife": "https://productpod-shelter-deployment.tryciam.onewelcome.io/portal/login/ui/resources/theme/img/shelter-ilife.png"}

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
            // URL lloks like: https://b2b-noram.tryciam.onewelcome.io/workforce/passwordreset/ - the workforce can be other things as well - but the passwordreset has to be there
            const passwordResetRegex = /^https:\/\/b2b-noram\.tryciam\.onewelcome\.io\/[^\/]+\/passwordreset\/?/;

            if (passwordResetRegex.test(currentURL)) {
                passwordResetPage(newBaseColor, newLogo);
            }

            // Consumers page
            const consumersRegex = /^https:\/\/insurgroup-noram\.tryciam\.onewelcome\.io\/insurgroup\/products\/?$/;

            if (consumersRegex.test(currentURL)) {
                consumersPage(newBaseColor, newLogo);
            }

            // RITM pages
            //URL looks like: https://b2b-workforceusaws.platform.ritm.iwelcome.com/*
            // can contain just / or more at the end
            const ritmRegex = /^https:\/\/b2b-workforceusaws\.platform\.ritm\.iwelcome\.com\/?/;

            if (ritmRegex.test(currentURL)) {
                ritmPage(newBaseColor, newLogo, newPageTitle);
            }

            // Consumer application pages
            //URL looks like: https://insurgroup-noram.tryciam.onewelcome.io/insurlife/login/ - insurlife can be other things as well, like insurcar or roadhelp like https://insurgroup-noram.tryciam.onewelcome.io/roadhelp/login/ 
            const consumerAppRegex = /^https:\/\/insurgroup-noram\.tryciam\.onewelcome\.io\/[^\/]+\/?$/;

            if (consumerAppRegex.test(currentURL)) {
                consumerAppPage(targetStringToReplace, newPageTitle, currentURL, consumerLogos);
            }

            // Invitation - Mailinator page
            //URL looks like: https://www.mailinator.com/
            const mailinatorRegex = /^https:\/\/www\.mailinator\.com\/?/;

            if (mailinatorRegex.test(currentURL)) {
                mailinatorPage(newBaseColor, newLogo, targetStringToReplace, newPageTitle);

                document.addEventListener('DOMContentLoaded', () => {
                    // Your mailinatorPage function call here
                    mailinatorPage(newBaseColor, newLogo, targetStringToReplace, newPageTitle);
                });
            }

            // Registration page
            const registrationRegex = /^https:\/\/b2b-noram\.tryciam\.onewelcome\.io\/[^\/]+\/registration\/?/;

            if (registrationRegex.test(currentURL)) {
                registrationPage(newBaseColor, newLogo, targetStringToReplace, newPageTitle);
            }

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

        replaceImageInPlaceUsingAltName("employee", newPageButtonURLs.employee);
        replaceImageInPlaceUsingAltName("partner", newPageButtonURLs.partner);
        replaceImageInPlaceUsingAltName("support", newPageButtonURLs.support);
        replaceImageInPlaceUsingAltName("consumer", newPageButtonURLs.consumer);
        replaceImageInPlaceUsingAltName("restButton", newPageButtonURLs.restButton);

        styleElementsByText("Privacy Policy", baseColor, false);
        styleElementsByText("Terms of Service", baseColor, false);

        changeIdBackgroundColor('loginLanguageMenuIcon', baseColor);
    }

    function loginPage(baseColor, newLogo) {
        console.log("loginPage function running!");

        replaceLogo(newLogo);
        styleElementsByText('Forgot password?', baseColor);
        styleElementsByText('Go back', baseColor);
        styleElementsByText('EN', baseColor);
        styleLiElementsBySelectedState(baseColor);
        replaceText('InsurGroup-ID', 'Shelter-ID *');
        changeClassColor('Mui-focused', baseColor);
        changePseudoElementBorderColorByClassName('MuiInput-underline', baseColor);
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

        const observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                // Check if new nodes have been added
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        replaceLogo(newLogo);
                        styleElementsByText('EN', baseColor);
                        changeIdBackgroundColor('pwd_reset_user_identification_step-submit-Submit-button_container', baseColor);
                        styleElementsByText('Help', baseColor);
                        styleElementsByText('Password reset', baseColor, false);

                        // Get the textfield element
                        const textfield = document.querySelector('#pwd_reset_user_identification_step-TEXT_FIELD-email-input_container-input');
                        const parentElement = textfield.parentElement;
                        const parentElementClasses = parentElement.classList;

                        // For each class, change the border-bottom-color using changePseudoElementBorderColorByClassName
                        parentElementClasses.forEach(className => {
                            changePseudoElementBorderColorByClassName(className, baseColor);
                        });

                        // Get the label element
                        const labelElementContainer = document.querySelector('#pwd_reset_user_identification_step-TEXT_FIELD-email-input_container');
                        const labelElement = labelElementContainer.querySelector('label');
                        const labelElementClasses = labelElement.classList;

                        // For each class, change the color using changeClassColor
                        labelElementClasses.forEach(className => {
                            changeClassColor(className, baseColor);
                        });
                    });
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }
    
    function consumersPage(baseColor, newLogo) {
        console.log("consumersPage running!");
        
        // This actually replaces all of the text colors on the page since the same class is used for all of them
        const backLinkButton = document.getElementById('products-REDIRECT_BUTTON-backToPortalButton-redirectButton');
        const backLinkButtonClasses = backLinkButton.classList;

        // For each class, change the color using changeClassColor
        backLinkButtonClasses.forEach(className => {
            changeClassColor(className, baseColor);
        });
    }

    function ritmPage(baseColor, newLogo, newString) {
        console.log("ritmPage running!");
    
        changeClassBackgroundColor('lang-selector', baseColor);
        changeClassBackgroundColor('MuiLinearProgress-barColorPrimary', baseColor);
    
        const body = document.querySelector('body');
    
        // Function to update the --brand variable
        const updateBrandColor = () => {
            //const currentBrandColor = getComputedStyle(body).getPropertyValue('--brand').trim();    
            body.style.setProperty('--brand', baseColor);
            
            //const currentBrandListHoverColor = getComputedStyle(body).getPropertyValue('--brand-c-hover').trim();
            const newColorWithAlpha = hexToRGBA(baseColor, 0.2);
            body.style.setProperty('--brand-c-hover', newColorWithAlpha);
            body.style.setProperty('--brand-hover', newColorWithAlpha);
            body.style.setProperty('--brand-c-selected', newColorWithAlpha);
            body.style.setProperty('--brand-selected', newColorWithAlpha);
        };
    
        // Create a MutationObserver to watch for changes to the style attribute
        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.attributeName === 'style') {   
                    updateBrandColor();
                }
            }
        });
    
        // Start observing the body element for attribute changes
        observer.observe(body, { attributes: true, attributeFilter: ['style'] });
    
        // In case the style attribute is already set, call updateBrandColor immediately
        updateBrandColor();

        // Change the logo - logo has an alt named "RITM"
        const logoElement = document.querySelector('img[alt="RITM"]');
        logoElement.src = newLogo.url;
        logoElement.style.width = '50px';

        // Grab the next element after the logo (the logo is within an anchor tag - so right after the anchor tag) this is the company name
        const anchorElement = logoElement.parentElement;
        const companyNameElement = anchorElement.nextElementSibling;
        companyNameElement.innerHTML = newString;

    }

    function consumerAppPage(textToReplace, newText, url, consumerLogos) {
        console.log("consumerAppPage running!");

        const elementToReplaceTextIn = document.getElementById('loginLinkfooter.insurgroup');

        // replace just the text in this element
        let currentText = elementToReplaceTextIn.innerText;
        elementToReplaceTextIn.innerText = currentText.replace(textToReplace, newText);

        if (url.includes('insurcar')) {
            console.log("InsureCar page detected!");
            console.log('URL:', consumerLogos.insurcar);
            replaceImageInPlaceUsingAltName("InsurCar logo placeholder", consumerLogos.insurcar);
            replaceImageInPlaceUsingAltName("logo", consumerLogos.insurcar);

            const logoSecondaryDiv = document.getElementById('workflow-header-logo');
            console.log('logoSecondaryDiv:', logoSecondaryDiv);
            if (logoSecondaryDiv) {
                console.log('logoSecondaryDiv FOUND:', logoSecondaryDiv);
                const logoClass = logoSecondaryDiv.classList[0];
                logoClass.style.background = `url("${consumerLogos.insurcar}")`;
            }
        }

        const observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                // Check if new nodes have been added
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (url.includes('insurcar')) {
                            console.log("InsureCar page detected!");
                            replaceImageInPlaceUsingAltName("InsurCar logo placeholder", consumerLogos.insurcar);
                            replaceImageInPlaceUsingAltName("logo", consumerLogos.insurcar);
                        }
                    });
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

    }

    function mailinatorPage(baseColor, newLogo, textToReplace, newText) {
        console.log("mailinatorPage running!");

        const observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                // Check if new nodes have been added
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        // If the added node is a <td> element
                        if (node.nodeName === 'TD' || node.nodeName === 'H3') {
                            if (node.innerText.includes(textToReplace)) {
                                node.innerText = node.innerText.replace(textToReplace, newText);
                            }
                        }
                        // If the added node contains child nodes (e.g., a table row)
                        else if (node.querySelectorAll) {
                            const tds = node.querySelectorAll('td');
                            tds.forEach(td => {
                                if (td.innerText.includes(textToReplace)) {
                                    td.innerText = td.innerText.replace(textToReplace, newText);
                                }
                            });

                            const h3s = node.querySelectorAll('h3');
                            h3s.forEach(h3 => {
                                console.log('h3:', h3);
                                if (h3.innerText.includes(textToReplace)) {
                                    h3.innerText = h3.innerText.replace(textToReplace, newText);
                                }
                            });
                        }
                    });
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        document.querySelectorAll('td').forEach(td => {
            if (td.innerText.includes(textToReplace)) {
                td.innerText = td.innerText.replace(textToReplace, newText);
            }
        });

        document.querySelectorAll('h3').forEach(h3 => {
            console.log('h3:', h3);
            if (h3.innerText.includes(textToReplace)) {
                h3.innerText = h3.innerText.replace(textToReplace, newText);
            }
        });
    }

    function registrationPage(baseColor, newLogo, textToReplace, newText) {
        console.log("registrationPage running!");
    
        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(function(mutationsList, observer) {
            // Update the color of the text of the form title
            const spanTextElement = document.getElementById('registration_step3-FORM_TITLE-FormTitle-formTitle_container-h1');
            if (spanTextElement) {    
                spanTextElement.style.setProperty('color', baseColor, 'important');
            }

            // Update the color of the "password tips" link
            const passwordTipsLink = document.getElementById('registration_step3-REDIRECT-redirect-link');
            if (passwordTipsLink) {
                passwordTipsLink.style.setProperty('color', baseColor, 'important');
            }

            // Update the textfield colors
            // Get the textfield element
            const textfield = document.getElementById('newPasswordId');
            const parentElement = textfield.parentElement;
            const beforeSibling = parentElement.previousElementSibling;

            const textfieldClasses = beforeSibling.classList;
            const specialClass = `${textfieldClasses[0]}.${textfieldClasses[1]}`;
            console.log('registrationPage->specialClass:', specialClass);

            changeClassColor(specialClass, baseColor);

            const anotherTextfieldClasses = parentElement.classList;

            // For each class, change the border-bottom-color using changePseudoElementBorderColorByClassName
            // need to change the classes with :hover as well
            anotherTextfieldClasses.forEach(className => {
                changePseudoElementBorderColorByClassName(className, baseColor);
            });

            // Get the label element
            const labelElementContainer = textfield.parentElement;
            const labelElementClasses = labelElementContainer.classList;

            // For each class, change the color using changeClassColor
            labelElementClasses.forEach(className => {
                changeClassColor(className, baseColor);
            });

            // Update the colors of the SVGs
            // Get the head element
            const headElement = document.querySelector('head');
            console.log('registrationPage->headElement:', headElement);

            // get the style element from head with the "data-meta" property of "MuiSvgIcon"
            const styleElement = headElement.querySelector('style[data-meta="MuiSvgIcon"]');
            console.log('registrationPage->styleElement:', styleElement);
            let childNodeData = styleElement.childNodes[0].data;
            console.log('registrationPage->childNode:', childNodeData);
            // print the type of the childNodeData
            console.log('registrationPage->childNodeData type:', typeof childNodeData);

            // childNodeData is a string, replace the color in the string
            childNodeData = childNodeData.replace(/#A0639A/g, baseColor);
            

            // Change the color of the Continue button
            const continueButton = document.getElementById('registration_step3-submit-Submit-button_container');
            continueButton.style.setProperty('background-color', baseColor, 'important');
        });
    
        // Start observing the document body for added nodes
        observer.observe(document.body, { childList: true, subtree: true });
    }

    /* ********************
    **    FUNCTIONS      **
    ** *******************/
    function replaceTitle(titleToReplace, newTitle) {
        console.log("replaceTitle called");
        // Use a loop to continuously set the title if something is overriding it

        // Check and replace the title if it includes the target string
        if (document.title.includes(titleToReplace)) {
            document.title = document.title.replace(titleToReplace, newTitle);
        }
    }

    // Function to replace, resize, and reposition the logo
    function replaceLogo(newLogo) {
        console.log("replaceLogo called");
        let logoElement = document.querySelector('.logoContainer img');

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

            if (logoElement) {
                const allClasses = logoElement.classList;
                
                for (let i = 0; i < allClasses.length; i++) {
                    // for each class, get the CSS rules
                    const rules = window.getComputedStyle(logoElement, '.' + allClasses[i]);

                    // replace background if exists
                    if (rules.backgroundImage) {
                        logoElement.style.backgroundImage = `url("${newLogo.url}")`;
                        logoElement.style.position = 'fixed';
                        logoElement.style.marginLeft = '255px';
                    }
                }
            }
        }
    }

    function replaceImageInPlaceUsingAltName(imageAltName, newImageURL) {
        console.log("replaceImageInPlaceUsingAltName called");
        const imageElement = document.querySelector(`[alt="${imageAltName}"]`);
        console.log('imageElement:', imageElement);
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

    function changeClassBackgroundColor(className, color) {
        // Create a CSS style rule
        var css = '.' + className + ' { background-color: ' + color + ' !important; }';
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
        console.log('replaceText called');
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
    function changePseudoElementBorderColorByClassName(classSubstring, color) {
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