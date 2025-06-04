async function openTownie() {
	try {
		const path = window.location.pathname.split("/").filter(Boolean);
		const user = path[1];
		const val = path[2];

		console.log(user, val);

		if (!user || !val) {
			console.error(
				"Could not parse user and val from URL:",
				window.location.pathname,
			);
			alert("Error: Could not determine user/val from the URL.");
			return;
		}

		console.log(`Fetching ID for ${user}/${val}`);
		const button = document.getElementById("open-in-townie-btn");
		if (button) {
			button.textContent = "Loading...";
			button.disabled = true;
		}

		const response = await fetch(
			`https://api.val.town/v2/alias/vals/${user}/${val}`,
		);

		if (!response.ok) {
			const errorText = await response.text();
			console.error("API Error:", response.status, errorText);
			alert(
				`Error fetching val data: ${response.status}. Check console for details.`,
			);
			if (button) {
				button.textContent = "Open in Townie (Error)";
				button.disabled = false;
			}
			return;
		}

		const data = await response.json();

		if (data?.id) {
			window.location.href = `https://townie.val.run/chat/${data.id}`;
		} else {
			console.error("API response did not contain an ID:", data);
			alert("Error: Val ID not found in API response.");
			if (button) {
				button.textContent = "Open in Townie (Error)";
				button.disabled = false;
			}
		}
	} catch (error) {
		console.error("Error in openTownie function:", error);
		alert("An unexpected error occurred. Check the console.");
		const button = document.getElementById("open-in-townie-btn");
		if (button) {
			button.textContent = "Open in Townie (Error)";
			button.disabled = false;
		}
	}
}

// --- Function to find the Remix button and its parent div ---
function findRemixButtonAndParent() {
	const buttons = document.querySelectorAll("button");
	let remixButtonElement = null;

	for (const button of buttons) {
		// More specific check for Remix button, avoiding other buttons with "Remix" in text
		if (button.textContent.trim() === "Remix" && button.querySelector("svg")) {
			// Basic check for an SVG icon typically found in such buttons
			remixButtonElement = button;
		} else if (button.textContent.trim().includes("Remix")) {
			// Fallback for simpler "Remix" buttons, ensure it's not our own button
			if (button.id !== "open-in-townie-btn") {
				remixButtonElement = button;
			}
		}
	}

	if (remixButtonElement) {
		// console.log('Found Remix button:', remixButtonElement);
		let parentDivElement = remixButtonElement.parentElement;
		while (parentDivElement) {
			if (
				parentDivElement.tagName === "DIV" &&
				parentDivElement.classList.contains("flex") &&
				parentDivElement.classList.contains("items-center") &&
				parentDivElement.classList.contains("justify-end") &&
				parentDivElement.classList.contains("gap-2")
			) {
				// console.log('Found parent div for Remix button:', parentDivElement);
				return { parentDiv: parentDivElement, remixButton: remixButtonElement };
			}
			parentDivElement = parentDivElement.parentElement;
		}
		console.log("Parent div not found for Remix button.");
	} else {
		console.log("Remix button not found.");
	}
	return null;
}

// --- Function to create and add the button ---
function addTownieButton() {
	const targetLocation = findRemixButtonAndParent();

	if (!targetLocation) {
		console.log(
			"Target location for Townie button not found. Button not added.",
		);
		// Optionally, fall back to adding to body or hide if it must be next to Remix
		// For now, we just don't add it if the specific spot isn't found.
		return;
	}

	const { parentDiv, remixButton } = targetLocation;

	let townieButton = document.getElementById("open-in-townie-btn");
	const buttonClasses =
		"inline-flex items-center justify-center flex-shrink-0 gap-x-1 rounded whitespace-nowrap enabled:cursor-pointer disabled:cursor-not-allowed select-none font-regular h-min outline-0 focus-visible:ring-1 focus-visible:ring-offset-1 transition group border border-gray-200 font-semibold stroke-2 group text-gray-800 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:hover:bg-gray-50 disabled:hover:text-gray-500 disabled:hover:border-gray-200 focus-visible:ring-blue-500 active:bg-blue-100 nightwind-prevent dark:text-gray-200 dark:bg-gray-900 dark:border-gray-800 dark:hover:bg-blue-900 dark:hover:border-blue-500 dark:disabled:text-gray-500 dark:disabled:bg-gray-900 dark:disabled:border-gray-800 text-sm py-1 px-2 aria-expanded:border-gray-500";

	if (townieButton) {
		// Button already exists
		if (townieButton.textContent.includes("Error")) {
			townieButton.textContent = "Open in Townie";
		}
		townieButton.disabled = false;
		townieButton.className = buttonClasses; // Apply classes to existing button

		// Ensure it's in the correct place
		if (
			townieButton.nextSibling !== remixButton &&
			remixButton.nextSibling !== townieButton
		) {
			// If it's not already next to the remix button, move it.
			// This handles cases where the page structure might have shifted but button survived.
			remixButton.parentNode.insertBefore(
				townieButton,
				remixButton.nextSibling,
			);
		}
		console.log(
			"Townie button ensured at correct location with correct styles.",
		);
		return;
	}

	// Create the button if it doesn't exist
	townieButton = document.createElement("button");
	townieButton.id = "open-in-townie-btn";
	townieButton.textContent = "Open in Townie";
	townieButton.className = buttonClasses; // Apply classes to new button

	townieButton.addEventListener("click", openTownie);

	// Insert the Townie button after the Remix button
	if (remixButton.parentNode === parentDiv) {
		// Ensure parentDiv is indeed the direct parent
		parentDiv.insertBefore(townieButton, remixButton.nextSibling);
		console.log("Open in Townie button added next to Remix button.");
	} else {
		console.error(
			"Remix button's parent is not the identified target div. Button not added.",
		);
	}
}

// Initial attempt to add the button
addTownieButton();

// Observe DOM changes to re-add the button if it's removed.
// The observer watches the body, and addTownieButton() will ensure placement.
const observer = new MutationObserver((mutationsList, observerInstance) => {
	// Check if the button is still in the DOM or if the target location is available again
	if (!document.getElementById("open-in-townie-btn")) {
		console.log(
			"Townie button may have been removed or target location appeared, trying to add/ensure button.",
		);
		addTownieButton(); // This will re-check location and add if possible
	}
});

observer.observe(document.body, { childList: true, subtree: true });

window.addEventListener("beforeunload", () => {
	observer.disconnect();
});
