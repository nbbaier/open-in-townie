# Val Town Townie Opener

A browser extension that adds a button to Val Town val pages to open them in Townie.

## How it Works

When you are viewing a val on a Val Town page with a URL like `https://www.val.town/x/username/valname`:

1. This extension detects you are on such a page.
2. It injects an "Open in Townie" button onto the page.
3. When you click this button:
   -  The extension extracts the `username` and `valname` from the URL.
   -  It calls the Val Town API (`https://api.val.town/v2/alias/vals/username/valname`) to get the unique ID of the val.
   -  It then redirects your browser to `https://townie.val.run/chat/ID`, opening the val in the Townie application.

## Installation (for Chrome/Chromium-based browsers)

1. **Download the Extension:**

   -  You can download the files as a ZIP from the repository (e.g., by clicking "Code" then "Download ZIP" on GitHub) and unzip it on your computer.
      OR
   -  Clone the repository using git.

2. **Open Chrome/Chromium and go to Extensions:**

   -  Type `chrome://extensions` in your address bar and press Enter.

3. **Enable Developer Mode:**

   -  In the top right corner of the Extensions page, toggle the "Developer mode" switch to the ON position.

4. **Load the Extension:**

   -  Click the "Load unpacked" button that appears.
   -  In the file dialog, navigate to the directory where you unzipped/cloned the extension files.
   -  Select the main folder of the extension (the one containing `manifest.json`).
   -  Click "Select Folder".

5. The "Val Town Townie Opener" extension should now be installed and active. You'll see its icon (if applicable) and it will function on Val Town pages.

## Permissions Used

This extension requests the following permissions:

-  `activeTab`: This permission is used to allow the extension to interact with the currently active Val Town page. Specifically, it's needed to:
   -  Add the "Open in Townie" button to the page.
   -  Access the page's URL to extract the username and val name.
-  `host_permissions` for `https://api.val.town/*`: This permission is required to allow the extension to make requests to the Val Town API. This is essential for fetching the val's ID, which is needed to construct the Townie URL.
