# README - Reach QA Code Challenge #

This is the code challenge for SDETs at Reach Financial.

### How do I get set up? ###

* Clone the repo
* Ensure Node.js (for `npm` commands) is installed
* Install required packages for the repo 
    * _Currently only playwright and eslint_
    * `npm install <package-name>`
* To run the tests run the following command
    * `BROWSER=chromium npm run test:all` - to run all tests in headless mode using chromium; chromium can be replaced with any supported browser specified in the playwright.config.ts file
    * `BROWSER=firefox SPEC=tests/todo-app.spec.ts npm run test:spec` - to run a specific test file
    * `BROWSER=webkit npm run test:ui` - to run in UI mode
    * `docker run -e BROWSER=firefox {imageName:tag}` run test:all

### Who do I talk to? ###

* For questions or concerns reach out to your Reach recruiting contact
* Or feel free to reach out to me directly james.beringer@reach.com
* Documentation for playwright can be found [here](https://playwright.dev/docs)