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

// --- Function to create and add the button ---
function addTownieButton() {
	// Check if the button already exists
	if (document.getElementById("open-in-townie-btn")) {
		// Ensure it's visible and enabled if it exists but was in an error state
		const existingButton = document.getElementById("open-in-townie-btn");
		if (existingButton.textContent.includes("Error")) {
			existingButton.textContent = "Open in Townie";
		}
		existingButton.disabled = false;
		return; // Button already exists, do nothing more
	}

	const button = document.createElement("button");
	button.id = "open-in-townie-btn";
	button.textContent = "Open in Townie";
	button.addEventListener("click", openTownie);
	document.body.appendChild(button);
	console.log("Townie button added/ensured on page.");
}

addTownieButton();

const observer = new MutationObserver((mutationsList, observerInstance) => {
	if (!document.getElementById("open-in-townie-btn")) {
		console.log("Townie button was removed from DOM, re-adding.");
		addTownieButton();
	}
});

observer.observe(document.body, { childList: true, subtree: true });

window.addEventListener("beforeunload", () => {
	observer.disconnect();
});
