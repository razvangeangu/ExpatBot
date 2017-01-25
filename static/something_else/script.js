// initialize the bot 
var config = {
    // what inputs should the bot listen to? this selector should point to at least one input field 
    inputs: '#humanInput',
    // if you want to show the capabilities of the bot under the search input 
    inputCapabilityListing: true,
    // optionally, you can specify which conversation engines the bot should use, e.g. webknox, spoonacular, or duckduckgo 
    engines: [ChatBot.Engines.duckduckgo()],
    // you can specify what should happen to newly added messages 
    addChatEntryCallback: function(entryDiv, text, origin) {
        entryDiv.slideDown();
    }
};
ChatBot.init(config);

ChatBot.setBotName("Expat Bot");

// 1. parameter: the pattern to listen for 
// 2. parameter: either "response" to respond or "rewrite" to rewrite the request 
// 3. parameter: either the response or the rewrite value, or undefined if nothing should happen 
// 4. parameter: a callback function that gets the matches of the pattern 
// 5. parameter: a description of that pattern, this is used to tell the user what he can say. Use quotes '' to mark phrases and [] to mark placeholders 
function addPattern(pattern, responseString, callback, placeholders) {
    ChatBot.addPattern(pattern, "response", responseString, callback, placeholders)
}

// ChatBot.addPattern("^hi$", "response", "Howdy, friend", undefined, "Say 'Hi' to be greeted back.");
// ChatBot.addPattern("^bye$", "response", "See you later buddy", undefined, "Say 'Bye' to end the conversation.");
// ChatBot.addPattern("(?:my name is|I'm|I am) (.*)", "response", "hi $1, thanks for talking to me today", function (matches) {
//     ChatBot.setHumanName(matches[1]);
// },"Say 'My name is [your name]' or 'I am [name]' to be called that by the bot");
// ChatBot.addPattern("(what is the )?meaning of life", "response", "42", undefined, "Say 'What is the meaning of life' to get the answer.");
// ChatBot.addPattern("compute ([0-9]+) plus ([0-9]+)", "response", undefined, function (matches) {
//     ChatBot.addChatEntry("That would be "+(1*matches[1]+1*matches[2])+".","bot");
// },"Say 'compute [number] plus [number]' to make the bot your math monkey");

// Create API call for querry
// Figure out what querries should we include
