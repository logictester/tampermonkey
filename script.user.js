// ==UserScript==
// @name         Shelter Insurance Skin
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Re-skin InsurGroup demo with Shelter Insurance Skin
// @author       Alex Basin & Gur Talmor
// @match        https://b2b-noram.tryciam.onewelcome.io/*
// @match        https://insurgroup-noram.tryciam.onewelcome.io/*
// @match        https://b2b-workforceusaws.platform.ritm.iwelcome.com/*
// @match        https://www.mailinator.com/*
// @match        https://insurgroup-insurgroupusaws.platform.ritm.iwelcome.com/*
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
    const newFaviconURL = "https://productpod-shelter-deployment.tryciam.onewelcome.io/portal/login/ui/resources/theme/img/shelter-insurance-favicon.svg";
    const shouldReplaceBackgroundImages = false;

    const mainPageButtonURLs = {
        "employee": "https://productpod-shelter-deployment.tryciam.onewelcome.io/portal/login/ui/resources/theme/img/employee-b.png",
        "partner": "https://productpod-shelter-deployment.tryciam.onewelcome.io/portal/login/ui/resources/theme/img/partner-b.png",
        "support": "https://productpod-shelter-deployment.tryciam.onewelcome.io/portal/login/ui/resources/theme/img/support-b.png",
        "consumer": "https://productpod-shelter-deployment.tryciam.onewelcome.io/portal/login/ui/resources/theme/img/consumer-b.png",
        "restButton": "https://productpod-shelter-deployment.tryciam.onewelcome.io/portal/login/ui/resources/theme/img/rest-b.png"
    };

    const newLogo = {
        "url": "https://www.shelterinsurance.com/media/shelterinsurance/styleassets/images/new/logo.svg",
        "width": "150px",
        "height": "auto",
        "position": "relative",
        "top": "-30px",
        "marginBottom": "20px"
    };

    const backgroundImages = {
        'https://b2b-noram.tryciam.onewelcome.io/workforce/login/ui/resources/theme/img/insurgroup-background.png': 'https://www.frommers.com/system/media_items/attachments/000/869/453/s980/Travel_Insurance.webp?1663185729'
    };

    const consumerLogos = {
        "insurcar": "https://productpod-shelter-deployment.tryciam.onewelcome.io/portal/login/ui/resources/theme/img/shelter-icar.png",
        "insurlife": "https://productpod-shelter-deployment.tryciam.onewelcome.io/portal/login/ui/resources/theme/img/shelter-ilife.png"
    };

    /* ********************
    **    MAIN LOGIC     **
    ** *******************/
    console.log("Starting Tampermonkey script");

    // Use setInterval to repeatedly check if the page has fully loaded
    const checkPageLoad = setInterval(() => {
        if (document.readyState === 'complete') {
            console.log("Page fully loaded");

            // Run functions that are relevant for all pages
            replaceTitle(targetStringToReplace, newPageTitle);
            replaceFavicon(newFaviconURL);
            if (shouldReplaceBackgroundImages) {
                replaceBackgroundImages(backgroundImages);
            }

            // Observe changes to the document's title
            const observer = new MutationObserver(() => {
                replaceTitle(targetStringToReplace, newPageTitle);
                replaceFavicon(newFaviconURL);
            });
            observer.observe(document.querySelector('title'), { childList: true });

            // Detect the page we're on
            const currentURL = window.location.href;
            console.log("Current URL: ", currentURL);

            // Define regex patterns for different pages
            const loginRegex = /^https:\/\/b2b-noram\.tryciam\.onewelcome\.io\/[^\/]+\/login\/?.*$/;
            const passwordResetRegex = /^https:\/\/b2b-noram\.tryciam\.onewelcome\.io\/[^\/]+\/passwordreset\/?/;
            const consumersRegex = /^https:\/\/insurgroup-noram\.tryciam\.onewelcome\.io\/insurgroup\/products\/?$/;
            const ritmRegex = /^https:\/\/b2b-workforceusaws\.platform\.ritm\.iwelcome\.com\/?/;
            const ritmRegex2 = /^https:\/\/insurgroup-insurgroupusaws\.platform\.ritm\.iwelcome\.com\/?/;
            const consumerAppRegex = /^https:\/\/insurgroup-noram\.tryciam\.onewelcome\.io\/[^\/]+\/?/;
            const mailinatorRegex = /^https:\/\/www\.mailinator\.com\/?/;
            const registrationRegex = /^https:\/\/b2b-noram\.tryciam\.onewelcome\.io\/[^\/]+\/registration\/?/;

            // Run the different functions for the different pages
            if (currentURL.includes("https://b2b-noram.tryciam.onewelcome.io/portal/login")) {
                homePage(newBaseColor, newLogo, mainPageButtonURLs);
            } else if (loginRegex.test(currentURL)) {
                loginPage(newBaseColor, newLogo);
            } else if (passwordResetRegex.test(currentURL)) {
                passwordResetPage(newBaseColor, newLogo);
            } else if (consumersRegex.test(currentURL)) {
                consumersPage(newBaseColor, newLogo);
            } else if (ritmRegex.test(currentURL) || ritmRegex2.test(currentURL)) {
                ritmPage(newBaseColor, newLogo, newPageTitle);
            } else if (consumerAppRegex.test(currentURL) && !currentURL.includes('insurgroup/login')) {
                consumerAppPage(targetStringToReplace, newPageTitle, currentURL, consumerLogos);
            } else if (consumerAppRegex.test(currentURL) && currentURL.includes('insurgroup/login')) {
                supportPage(newBaseColor, newLogo);
            } else if (mailinatorRegex.test(currentURL)) {
                mailinatorPage(newBaseColor, newLogo, targetStringToReplace, newPageTitle);
                document.addEventListener('DOMContentLoaded', () => {
                    mailinatorPage(newBaseColor, newLogo, targetStringToReplace, newPageTitle);
                });
            } else if (registrationRegex.test(currentURL)) {
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
            loginButton.style.setProperty('background-color', baseColor, 'important');
            loginButton.style.setProperty('color', '#FFFFFF', 'important');
        }
    }

    function passwordResetPage(baseColor, newLogo) {
        console.log("passwordResetPage running!");
        const observer = new MutationObserver(() => {
            replaceLogo(newLogo);
            styleElementsByText('EN', baseColor);
            changeIdBackgroundColor('pwd_reset_user_identification_step-submit-Submit-button_container', baseColor);
            styleElementsByText('Help', baseColor);
            styleElementsByText('Password reset', baseColor, false);

            const textfield = document.querySelector('#pwd_reset_user_identification_step-TEXT_FIELD-email-input_container-input');
            const parentElement = textfield.parentElement;
            parentElement.classList.forEach(className => {
                changePseudoElementBorderColorByClassName(className, baseColor);
            });

            const labelElement = document.querySelector('#pwd_reset_user_identification_step-TEXT_FIELD-email-input_container label');
            labelElement.classList.forEach(className => {
                changeClassColor(className, baseColor);
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function consumersPage(baseColor) {
        console.log("consumersPage running!");
        const backLinkButton = document.getElementById('products-REDIRECT_BUTTON-backToPortalButton-redirectButton');
        backLinkButton.classList.forEach(className => {
            changeClassColor(className, baseColor);
        });

        const logoDiv = document.getElementById('workflow-header-logo');
        if (logoDiv) {
            logoDiv.style.background = `url("${consumerLogos.insurcar}")`;
            logoDiv.style.backgroundSize = 'contain'; // Ensure the image scales properly
            logoDiv.style.backgroundRepeat = 'no-repeat'; // Prevent tiling
        }
    }

    function ritmPage(baseColor, newLogo, newString) {
        console.log("ritmPage running!");
        changeClassBackgroundColor('lang-selector', baseColor);
        changeClassBackgroundColor('MuiLinearProgress-barColorPrimary', baseColor);

        const body = document.querySelector('body');
        if (!body) {
            return;
        }
        const updateBrandColor = () => {
            body.style.setProperty('--brand', baseColor);
            const newColorWithAlpha = hexToRGBA(baseColor, 0.2);
            body.style.setProperty('--brand-c-hover', newColorWithAlpha);
            body.style.setProperty('--brand-hover', newColorWithAlpha);
            body.style.setProperty('--brand-c-selected', newColorWithAlpha);
            body.style.setProperty('--brand-selected', newColorWithAlpha);
        };

        const observer = new MutationObserver(() => {
            updateBrandColor();
        });
        observer.observe(body, { attributes: true, attributeFilter: ['style'] });
        updateBrandColor();

        const logoElement = document.querySelector('img[alt="RITM"]');
        if (logoElement) {
            logoElement.src = newLogo.url;
            logoElement.style.width = '50px';
        }

        const companyNameElement = logoElement.parentElement.nextElementSibling;
        companyNameElement.innerHTML = newString;
    }

    function consumerAppPage(textToReplace, newText, url, consumerLogos) {
        console.log("consumerAppPage running!");
        const elementToReplaceTextIn = document.getElementById('loginLinkfooter.insurgroup');
        if (elementToReplaceTextIn) {
            elementToReplaceTextIn.innerText = elementToReplaceTextIn.innerText.replace(textToReplace, newText);
        }

        if (url.includes('insurcar')) {
            console.log("InsureCar page detected!");
            replaceImageInPlaceUsingAltName("InsurCar logo placeholder", consumerLogos.insurcar);
            replaceImageInPlaceUsingAltName("logo", consumerLogos.insurcar);
        } else if (url.includes('insurlife')) {
            console.log("InsureLife page detected!");
            replaceImageInPlaceUsingAltName("InsurLife logo placeholder", consumerLogos.insurlife);
            replaceImageInPlaceUsingAltName("logo", consumerLogos.insurlife);
        }

        const observer = new MutationObserver(() => {
            if (url.includes('insurcar')) {
                replaceImageInPlaceUsingAltName("InsurCar logo placeholder", consumerLogos.insurcar);
                replaceImageInPlaceUsingAltName("logo", consumerLogos.insurcar);
            }
            const logoSecondaryDiv = document.getElementById('workflow-header-logo');
            if (logoSecondaryDiv) {
                logoSecondaryDiv.style.background = `url("${consumerLogos.insurcar}")`;
                logoSecondaryDiv.style.backgroundSize = 'contain';
                logoSecondaryDiv.style.backgroundRepeat = 'no-repeat';
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function mailinatorPage(baseColor, newLogo, textToReplace, newText) {
        console.log("mailinatorPage running!");
        const observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeName === 'TD' || node.nodeName === 'H3') {
                        if (node.innerText.includes(textToReplace)) {
                            node.innerText = node.innerText.replace(textToReplace, newText);
                        }
                    } else if (node.querySelectorAll) {
                        node.querySelectorAll('td').forEach(td => {
                            if (td.innerText.includes(textToReplace)) {
                                td.innerText = td.innerText.replace(textToReplace, newText);
                            }
                        });
                        node.querySelectorAll('h3').forEach(h3 => {
                            if (h3.innerText.includes(textToReplace)) {
                                h3.innerText = h3.innerText.replace(textToReplace, newText);
                            }
                        });
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });

        document.querySelectorAll('td').forEach(td => {
            if (td.innerText.includes(textToReplace)) {
                td.innerText = td.innerText.replace(textToReplace, newText);
            }
        });

        document.querySelectorAll('h3').forEach(h3 => {
            if (h3.innerText.includes(textToReplace)) {
                h3.innerText = h3.innerText.replace(textToReplace, newText);
            }
        });
    }

    function registrationPage(baseColor, newLogo, textToReplace, newText) {
        console.log("registrationPage running!");
        const observer = new MutationObserver(() => {
            const spanTextElement = document.getElementById('registration_step3-FORM_TITLE-FormTitle-formTitle_container-h1');
            if (spanTextElement) {
                spanTextElement.style.setProperty('color', baseColor, 'important');
            }

            const passwordTipsLink = document.getElementById('registration_step3-REDIRECT-redirect-link');
            if (passwordTipsLink) {
                passwordTipsLink.style.setProperty('color', baseColor, 'important');
            }

            const textfield = document.getElementById('newPasswordId');
            const parentElement = textfield.parentElement;
            const beforeSibling = parentElement.previousElementSibling;

            beforeSibling.classList.forEach(className => {
                changeClassColor(`${className}`, baseColor);
            });

            parentElement.classList.forEach(className => {
                changePseudoElementBorderColorByClassName(className, baseColor);
            });

            const labelElementContainer = textfield.parentElement;
            labelElementContainer.classList.forEach(className => {
                changeClassColor(className, baseColor);
            });

            const continueButton = document.getElementById('registration_step3-submit-Submit-button_container');
            continueButton.style.setProperty('background-color', baseColor, 'important');
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function supportPage(baseColor, newLogo) {
        console.log("supportPage running!");
        loginPage(baseColor, newLogo);

        const loginButton = document.getElementById('consumerSocialButton');
        if (loginButton) {
            loginButton.style.setProperty('background-color', baseColor, 'important');
            loginButton.style.setProperty('color', '#FFFFFF', 'important');
            const imageElement = loginButton.querySelector('img');
            if (imageElement) {
                imageElement.src = newLogo.url;
            }
        }
    }

    /* ********************
    **    FUNCTIONS      **
    ** *******************/
    function replaceTitle(titleToReplace, newTitle) {
        console.log("replaceTitle called");
        if (document.title.includes(titleToReplace)) {
            document.title = document.title.replace(titleToReplace, newTitle);
        }
    }

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
        } else {
            logoElement = document.getElementById('workflow-header-logo');
            if (logoElement) {
                logoElement.style.backgroundImage = `url("${newLogo.url}")`;
                logoElement.style.position = 'fixed';
                logoElement.style.marginLeft = '255px';
            }
        }
    }

    function replaceImageInPlaceUsingAltName(imageAltName, newImageURL) {
        console.log("replaceImageInPlaceUsingAltName called");
        const imageElement = document.querySelector(`[alt="${imageAltName}"]`);
        if (imageElement) {
            imageElement.src = newImageURL;
        }
    }

    function styleElementsByText(text, color, includeUnderline = true) {
        const xpath = `//*[normalize-space(text())='${text}']`;
        const result = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
        );
        for (let i = 0; i < result.snapshotLength; i++) {
            const element = result.snapshotItem(i);
            element.style.setProperty('color', color, 'important');
            if (includeUnderline) {
                element.style.setProperty('text-decoration', 'underline', 'important');
                element.style.setProperty('text-decoration-color', color, 'important');
            }
        }
    }

    function changeClassColor(className, color) {
        const css = '.' + className + ' { color: ' + color + ' !important; }';
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    function changeClassBackgroundColor(className, color) {
        const css = '.' + className + ' { background-color: ' + color + ' !important; }';
        if (!css) {
            return;
        }
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    function replaceBackgroundImages(imageReplacements) {
        document.querySelectorAll('*').forEach(function(element) {
            const computedStyle = window.getComputedStyle(element);
            const backgroundImage = computedStyle.getPropertyValue('background-image');
            if (backgroundImage && backgroundImage !== 'none') {
                const urlMatch = backgroundImage.match(/url\(["']?(.*?)["']?\)/);
                if (urlMatch && urlMatch[1]) {
                    let originalUrl = urlMatch[1];
                    if (!originalUrl.startsWith('http')) {
                        originalUrl = new URL(originalUrl, window.location.href).href;
                    }
                    if (imageReplacements[originalUrl]) {
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

    function replaceFavicon(newFaviconUrl) {
        console.log("replaceFavicon called");
        document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]').forEach(favicon => favicon.remove());
        const newFavicon = document.createElement('link');
        newFavicon.rel = 'icon';
        newFavicon.href = newFaviconUrl;
        document.head.appendChild(newFavicon);
    }

    function changeIdColor(idName, color) {
        const css = '#' + idName + ' { color: ' + color + ' !important; }';
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    function changeIdBackgroundColor(idName, color) {
        const css = '#' + idName + ' { background-color: ' + color + ' !important; }';
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
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
        for (let i = 0; i < result.snapshotLength; i++) {
            const element = result.snapshotItem(i);
            element.innerHTML = toText;
        }
    }

    function hexToRGBA(hex, alpha) {
        hex = hex.replace('#', '');
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

    function styleLiElementsBySelectedState(color) {
        const liElements = document.querySelectorAll('li');
        liElements.forEach(function(li) {
            if (li.classList.contains('Mui-selected')) {
                li.style.setProperty('background-color', color, 'important');
            } else {
                const rgbaColor = hexToRGBA(color, 0.2);
                if (rgbaColor) {
                    // Uncomment if needed:
                    // li.style.setProperty('background-color', rgbaColor, 'important');
                }
            }
        });
    }

    function changePseudoElementBorderColorByClassName(classSubstring, color) {
        const css = '[class*="' + classSubstring + '"]::after { border-bottom-color: ' + color + ' !important; }';
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    function changeActiveButtonSvgFillColor(color) {
        const css = 'button.active svg { fill: ' + color + ' !important; }';
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }
})();