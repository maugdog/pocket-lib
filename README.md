POCKET-LIB
=========

Library of shared functions and modules for the Pocket platform.

Specifically, this package is intended for shared modules in the Pocket tech stack.

## Installation

  See instructions [here](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line) for creating a personal github token with `repo` access.

    $ npm install git+https://<YOUR_PERSONAL_GITHUB_TOKEN>:x-oauth-basic@github.com/maugdog/pocket-lib.git#master

  The package has some dependencies. Specifically it uses pure.css, and Google fonts.

  In your HTML file, include the following in the `<head>` tag:

    <!-- PURE CSS -->
    <link rel="stylesheet" href="https://unpkg.com/purecss@1.0.0/build/grids-min.css" />
    <link rel="stylesheet" href="https://unpkg.com/purecss@1.0.0/build/grids-responsive-min.css" />

  And for the fonts, include the following in one of your common Sass files:

    @import url('https://fonts.googleapis.com/css?family=Open+Sans:300,400,600&display=swap');

  You'll also want to import the pre-built styles for whatever modules you use as part of your vendor css bundle. For example:

    @import '/node_modules/pocket-lib/build/wizard-client.css';

## Usage - Tracker

    import React, { useEffect } from 'react';
    import { tracker } from 'pocket-lib';
    // Recommended: For "tree-shakable" imports, you can access modules individually:
    // import tracker from 'pocket-lib/build/tracker';

    export const App = () => {
      // Initialize the tracker on App/page load.
      useEffect(() => {
        tracker.blacklisted = !isClient() || isBot();
        tracker.sendToCustomService = yourCustomAPICallHere;
        tracker.start();

        // Cleanup when the App unmounts... Not typically necessary, but good practice!
        return () => tracker.stop();
      }, []);

      const onClickButton = event => {
        tracker.track('Clicked button', { customProp: 'Whatever data you want to send!' });
      };

      return (
        <div>
          Hello world!
          <button onClick={onClickButton}>Track me!</button>
        </div>
      );
    };

## Release History

* 1.0.0 Initial release
