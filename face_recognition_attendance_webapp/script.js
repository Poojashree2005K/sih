
function chatbot(input) {
    let output = "";
    input = input.toLowerCase();
    if (input.includes("hello") || input.includes("hi")) {
        output = "Hello, nice to meet you!";
    } else if (input.includes("how are you")) {
        output = "I'm doing fine, thank you for asking.";
    } else if (input.includes("what is your name?")) {
        output = "My name is Jarvis, I'm a chatbot.";
    } else if (input.includes("what can you do?")) {
        output = "I can chat with you and answer some simple questions.";
    } else if (input.includes("how do i enroll in a new course?")) {
        output = "To enroll in a new course, log into your student portal, navigate to the 'Courses' section, and select 'Enroll in a Course.' Follow the prompts to complete your enrollment.";
    } else if (input.includes("how can i check my grades?")) {
        output = "You can check your grades by logging into your student portal and navigating to the 'Grades' section. Your grades for each course will be listed there.";
    } else if (input.includes("what are the library hours?")) {
        output = "The library is open from 8 AM to 10 PM on weekdays and from 10 AM to 6 PM on weekends.";
    } else if (input.includes("how can i check my attendance record?")) {
        output = "You can check your attendance record by logging into the student portal and navigating to the 'Attendance' section.";
    } else if (input.includes("how do i reset my password?")) {
        output = "To reset your password, go to the student portal login page and click on 'Forgot Password.' Follow the instructions sent to your registered email.";
    } else if (input.includes("how do i submit an assignment online?")) {
        output = "To submit an assignment online, go to the 'Assignments' section of your course, click on the assignment you want to submit, and upload your file. Make sure to click 'Submit' after uploading.";
    } else if (input.includes("what are the bus routes to campus?")) {
        output = "You can find the bus routes to campus in the 'Transportation' section of your student portal. It includes maps and schedules for all available routes.";
    } else if (input.includes("how do i get a parking permit?")) {
        output = "To get a parking permit, log into your student portal, go to the 'Parking Services' section, and fill out the application form. You can pick up your permit at the campus security office.";
    } else {
        output = "Sorry, I don't understand that. Please try something else.";
    }
    return output;
}

// Display the user message on the chat
function displayUserMessage(message) {
    let chat = document.getElementById("chat");
    let userMessage = document.createElement("div");
    userMessage.classList.add("message");
    
    let userAvatar = document.createElement("img");
    userAvatar.src = "bot.jpg";
    userAvatar.alt = "User Avatar";
    userAvatar.style.width = "20px";
    userAvatar.style.height = "20px";
    userMessage.appendChild(userAvatar);
    
    let userText = document.createElement("p");
    userText.classList.add("text");
    userText.innerHTML = message;
    userMessage.appendChild(userText);
    
    chat.appendChild(userMessage);
    chat.scrollTop = chat.scrollHeight;
}

// Display the bot message on the chat
function displayBotMessage(message) {
    let chat = document.getElementById("chat");
    let botMessage = document.createElement("div");
    botMessage.classList.add("message");
    
    let botAvatar = document.createElement("img");
    botAvatar.src = "avatar.jpg";
    botAvatar.alt = "Bot Avatar";
    botAvatar.style.width = "20px";
    botAvatar.style.height = "20px";
    botMessage.appendChild(botAvatar);
    
    let botText = document.createElement("p");
    botText.classList.add("text");
    botText.innerHTML = message;
    botMessage.appendChild(botText);
    
    chat.appendChild(botMessage);
    chat.scrollTop = chat.scrollHeight;
}

// Send the user message and get the bot response
function sendMessage() {
    let input = document.getElementById("input").value.trim();
    if (input) {
        displayUserMessage(input);
        let output = chatbot(input);
        setTimeout(function() {
            displayBotMessage(output);
        }, 1000);
        document.getElementById("input").value = "";
    }
}

// Add a click event listener to the button
document.getElementById("button").addEventListener("click", sendMessage);

// Add a keypress event listener to the input
document.getElementById("input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});
