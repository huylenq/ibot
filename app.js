var restify = require('restify');
var builder = require('botbuilder');
//=========================================================
// Bot Setup
//=========================================================
// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 8080, function() {
    console.log('%s listening to %s', server.name, server.url);
});
// Create chat bot
var connector = new builder.ChatConnector({
    appId: "5cb567f9-3d6d-47c7-a402-647105d4ce32",
    appPassword: "ETsYFQQL28L3sUKoBXqWYPe"
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());
//Bot on
bot.on('contactRelationUpdate', function(message) {
    if (message.action === 'add') {
        var name = message.user ? message.user.name : null;
        var reply = new builder.Message()
            .address(message.address)
            .text("Hello %s... Thanks for adding me. Say 'hello' to see some great demos.", name || 'there');
        bot.send(reply);
    } else {
        // delete their data
    }
});
bot.on('typing', function(message) {
    // User is typing
});
bot.on('deleteUserData', function(message) {
    // User asked to delete their data
});
//=========================================================
// Bots Dialogs
//=========================================================
String.prototype.contains = function(content) {
    return this.indexOf(content) !== -1;
};

bot.dialog('/', function(session) {
    console.log('>>> %s', session.message.text);
    if (session.message.text.toLowerCase().contains('hello')) {
        session.send(`Hey, How are you?`);
    } else if (session.message.text.toLowerCase().startsWith('http://chiasenhac.vn')) {
        require('./csn')(session);
    } else if (session.message.text.toLowerCase().contains('help')) {
        session.send(
            `Usage:
1. [FShare link]. Example: @iBot https://www.fshare.vn/file/2GWXN9YU2ENQ
2. [Chiasenhac playlist link]. Example: @iBot http://chiasenhac.vn/nhac-hot/dusk-till-dawn~zayn-sia~tsvd53t0qmhwfn.html
3. New stuff coming in pretty soon
            `);
    } else {
        session.send(`Sorry I don't understand you...`);
    }
});
