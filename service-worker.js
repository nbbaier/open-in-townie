chrome.action.onClicked.addListener((tab) => {
	const allowedDomains = ["https://www.val.town/x/"];

	const isAllowed = allowedDomains.some((domain) => tab.url.startsWith(domain));

	if (isAllowed && !tab.url.includes("chrome://")) {
		chrome.scripting.executeScript({
			target: { tabId: tab.id },
			function: async () => {
				console.log("Opening val in Townie");
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
				}
			},
		});
	}
});
