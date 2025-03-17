const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; // Variable to store user's message
const inputInitHeight = chatInput.scrollHeight;

// Predefined responses
const predefinedResponse = {
  "what's the most popular item?": "The Black T-Shirt.",
  "how long can it take for a refund?": "Refunds usually take 5-7 business days to process, depending on your payment method."
};

// Function to create a chat list item (for both incoming and outgoing messages)
const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", `${className}`);
  
  // Add the "Robot" icon for incoming messages
  let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  
  return chatLi; // Return chat <li> element
};

// Function to generate the predefined response
const generateResponse = (chatElement) => {
  const messageElement = chatElement.querySelector("p");

  // Check if the message matches the predefined response
  if (predefinedResponse[userMessage]) {
    messageElement.textContent = predefinedResponse[userMessage];
  } else {
    messageElement.textContent = "Sorry, I can only answer those specific questions!";
  }
  chatbox.scrollTo(0, chatbox.scrollHeight);
};

// Function to display buttons for frequently asked questions (2 buttons only)
const displayButtons = () => {
  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("buttons-container");

  // Create the first button
  const button1 = document.createElement("button");
  button1.textContent = "What's the most popular item?";
  button1.addEventListener("click", () => handleButtonClick("what's the most popular item?"));

  // Create the second button
  const button2 = document.createElement("button");
  button2.textContent = "How long can it take for a refund?";
  button2.addEventListener("click", () => handleButtonClick("how long can it take for a refund?"));

  // Append the buttons to the container
  buttonsContainer.appendChild(button1);
  buttonsContainer.appendChild(button2);

  // Add the buttons container to the chatbox
  chatbox.appendChild(buttonsContainer);
  chatbox.scrollTo(0, chatbox.scrollHeight); // Scroll to the bottom of the chatbox
};

// Function to handle button click and generate response
const handleButtonClick = (message) => {
  userMessage = message; // Assign the message based on button clicked
  chatbox.appendChild(createChatLi(userMessage, "outgoing")); // Show user's message in the chatbox

  setTimeout(() => {
    // Display "Thinking..." message while waiting for the response
    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLi); // Generate and display response
  }, 600);
};

// Function to handle sending chat via the input
const handleChat = () => {
  userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
  if (!userMessage) return;

  // Clear the input textarea and set its height to default
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  // Append the user's message to the chatbox
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {
    // Display "Thinking..." message while waiting for the response
    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLi);
  }, 600);
};

// Event listener for the "Send" button
sendChatBtn.addEventListener("click", handleChat);

// Event listener to close the chatbot
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));

// Event listener for chatbot toggler button
chatbotToggler.addEventListener("click", () => {
  document.body.classList.toggle("show-chatbot");

  // Show buttons when the chatbot is opened
  if (document.body.classList.contains("show-chatbot")) {
    displayButtons(); // Display the predefined question buttons (only two now)
  } else {
    // Optionally, hide buttons when the chatbot is closed
    const buttonsContainer = document.querySelector(".buttons-container");
    if (buttonsContainer) {
      buttonsContainer.remove(); // Remove buttons if chatbot is closed
    }
  }
});

// Event listener for adjusting input field height
chatInput.addEventListener("input", () => {
  // Adjust the height of the input textarea based on its content
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

// Event listener for "Enter" key to send chat (only for wide screens)
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
});

