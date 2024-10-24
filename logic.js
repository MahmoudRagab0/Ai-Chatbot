const chat_body = document.querySelector(".chat-body");
const message_input = document.querySelector(".message-input");
const send_message_btn = document.querySelector(".send-message");
const data_element = document.querySelector(".date");

const API_KEY = `AIzaSyA7n3BzkCTTPplPmLD9Yb82V2kJuIj32WI`;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const userData = {
    message: null,
};

function cleanText(input) {
    return input
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/##/g, "")
        .replace(/\n+/g, "\n")
        .trim();
}

const generateBotResponse = async (inComingMessage) => {
    const message_element = inComingMessage.querySelector(".message-text");

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: userData.message }] }],
        }),
    };

    try {
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error.message);

        const api_response_text = cleanText(
            data.candidates[0].content.parts[0].text
        );
        message_element.innerText = api_response_text;
    } catch (error) {
        message_element.innerText =
            "Sorry for the service issue. We'll fix it soon. Thank you!";
        message_element.style.color = "#ff0000";
        console.error("Error:", error);
    } finally {
        chat_body.scrollTo({
            top: chat_body.scrollHeight,
            behavior: "smooth",
        });
    }
};

data_element.textContent = `${new Date().getDate()} ${new Date().toLocaleString(
    "en-US",
    { month: "short" }
)} ${new Date().getFullYear()}`;

function createMessageElement(content, classes) {
    const div = document.createElement("div");
    div.classList.add("message", classes);
    div.innerHTML = content;
    return div;
}

function handleOutgoingMessage(e) {
    e.preventDefault();
    userData.message = cleanText(message_input.value.trim()); // تنظيف الرسالة قبل الإرسال
    message_input.value = "";

    const message_content = `<div class="message-text">${userData.message}</div>`;
    const outgoingMessage = createMessageElement(message_content, "user-message");

    chat_body.appendChild(outgoingMessage);

    setTimeout(() => {
        const message_load = `
            <svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
                <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
            </svg>
            <div class="message-text">
                <div class="thinking-indicator">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
            </div>`;

        const incomingMessage = createMessageElement(message_load, "bot-message");
        chat_body.appendChild(incomingMessage);

        generateBotResponse(incomingMessage);
    }, 500);
}

message_input.addEventListener("keydown", (e) => {
    const user_message = e.target.value.trim();
    if (e.key === "Enter" && user_message) {
        handleOutgoingMessage(e);
    }
});

send_message_btn.addEventListener("click", (e) => {
    handleOutgoingMessage(e);
});


const picker_emoji = new EmojiMart.Picker({
    searchPosition: "none",
    previewPosition: "none",
    theme: "light",
    set: "google",
    onClickOutside: (e) => {
        if (e.target.id === "emoji-mart") {
            document.body.classList.toggle("show-emoji-picker")
        } else {
            document.body.classList.remove("show-emoji-picker")
        }
    },
    onEmojiSelect: (emoji_Selected) => {
        const { selectionStart: start, selectionEnd: end } = message_input;
        message_input.setRangeText(emoji_Selected.native, start, end, "end")
        message_input.focus()
    }

})

document.querySelector(".chat-form").appendChild(picker_emoji)