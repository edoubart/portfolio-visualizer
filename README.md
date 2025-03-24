# Portfolio Visualizer

A self, local hosted, databaseless, data-driven portfolio visualizer

The main purpose of this project is to facilitate the management of one's
portfolio by having the user running is own web application locally, safely
owning and controlling his data, dynamically fetching asset prices from
reliable sources, and bringing financial data to life with powerful
visualizations in order to help him make better financial decisions.

Common portfolio management applications require their users to sign up, login
and create their portfolio online. The data is then persisted in a database,
stored on a server, and too often used and/or sold without users being fully
aware. Remember the well-known adage "If something is free, you are the
product!". This is problematic because it could expose one's portfolio and lead
to financial voyeurism.
That is the reason why the portfolio visualizer has been developed with a self,
local hosted approach in mind, and runs without a database.
The user's portfolio is only stored locally, in a JSON file following a given
format, that the user creates, validates, controls and keeps for himself.
Prices are programatically fetched from APIs (CoinGecko, currencylayer and
"Yahoo! Finance"), data is then compiled and rendered analytically and visually.

Instead of keeping track of your portfolio in one or multiple spreadsheet(s),
and having to update asset prices manually everyday, which could be redundant
and time consuming, just create a portfolio JSON file following the template(s)
provided with your own data, and get access to latest prices and powerful
visualization that will help you make better financial decisions!

## Technologies Used

The portfolio visualizer is written in JavaScript using modern web standards
(HTML, CSS & SVG), best practices and leveraging the following technologies:
  - React: User Interface;
  - Semantic UI: Development Framework (Sub Components);
  - Redux: Predictable State Container;
  - D3: Data-Driven Documents (Visualizations);
  - JSON Schema: Vocabulary for annotating and validating JSON documents.

## APIs Used

The portfolio visualizer is fetching the latest asset prices using the following
APIs:
  - CoinGecko API (cryptos): The most comprehensive cryptocurrency API powered 
by the world’s largest independent crypto data aggregator;
  - currencylayer API (metals): Reliable exchange rates & currency conversion
for business;
  - "Yahoo! Finance API" (via RapidAPI) (stocks): While the official Yahoo!
Finance API has been discontinued, RapidAPI has made available to use an
unofficial "Yahoo! Finance API" that works just as well as the previous one.

Note: The currently chosen APIs are subject to change in the future if better,
more reliable sources of data arise.

## Available Visualizations

The current available portfolio visualizations are:
  - Donut Chart: This chart shows the overall allocation by asset of the
portfolio, comparing an asset to the whole regardless of asset classes.
The portfolio total value is occupying the center of the donut.
  - Sunburst: This radial equivalent to space-filling visualization
(what we call "icicle") was originally created by John Stasko. It is commonly
used to visualize software packages and file systems with nested architectures.
Here, it has been adapted to show the cumulative allocations of asset classes
and assets subtrees of the portfolio.
  - Zoomable Sunburst: This is a variant of the above diagram that shows only
two layers of the hierarchy at the time, but with the abilty to drill down the
portfolio, its asset classes and assets. Click a node to zoom in, or the center
to zoom out.
  - Icicle: This space-filling visualization, the Cartesian equivalent to
sunburst, shows the cumulative allocations of asset classes and assets subtrees
of the portfolio values of subtrees.
  - Zoomable Icicle: This is a variant of the above diagram that shows only
three layers of the hierarchy at the time, but with the abilty to drill down the
portfolio, its asset classes and assets. Click a node to zoom in, or the center
to zoom out.

## Instructions

### Download and Install Node.js

Go to the [Node.js](https://nodejs.org/en/download/)'s website, download and
install Node.js for your platform.

### Download Portfolio Visualizer's Source Code

Go to the link that was given to you, and download source code.

### Install Dependencies

Open a terminal, go to the source code directory, and run the following command:
`yarn install`

This will install all the dependencies required by the application.

### Sign Up for APIs

First, you need to copy the `.env.example` file and rename it `.env`. This file
will contain your own environment variables.

Next, you need to sign up for the different APIs that the portfolio visualizer is
using as sources of data in order to get your different API access keys.

APIs:
  - CoinGecko API (cryptos): The CoinGecko API is 100% free which is not only
rare, but amazing! Indeed, no keys are required and it is publicly available.
Therefore, if your portfolio is only made of 'cryptos', and doesn't have any
'metals' or 'stocks', you don't have to sign up for any other API.
  - currencylayer API (metals):
    1. Go to the [currencylayer](https://currencylayer.com/)'s website;
    2. Sign up for free;
    3. Go to your Dashboard;
    4. Get "Your API Access Key" (Copy);
    5. Paste it in your `.env` file as value for `REACT_APP_PROVIDER_METALS_CURRENCY_LAYER_API_KEY`;
    6. Now you have access to 250 requests for free. Don't consume them all by
 refreshing the page like a maniac! :).
  - "Yahoo! Finance API" (via RapidAPI) (stocks):
    1. Go to the [RapidAPI](https://rapidapi.com/)'s website;
    2. Sign up for free;
    3. Go to the ["Yahoo! Finance API"](https://rapidapi.com/apidojo/api/yahoo-finance1/)'s hub page by API Dojo;
    4. Subscribe to API;
    5. Get your "X-RapidAPI-Key" (Copy);
    6. Paste it in your `.env` file as value for `REACT_APP_PROVIDER_STOCKS_YAHOO_FINANCE_API_KEY`;
    7. Now you have access to 500 requests per month (hard limit) for free.

### Available Scripts

In the project directory, you can run:

#### `yarn validate`

Validates your portfolio JSON file before running the app.

Usage: `yarn validate -- -d src/data/recommended-portfolio/index.json`

#### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

#### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

#### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

#### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

#### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

#### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

#### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
