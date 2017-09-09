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
    } else if (session.message.text.toLowerCase().contains('http://chiasenhac.vn')) {
        require('./csn')(session);
    } else if (session.message.text.toLowerCase().contains('làm sao')) {
        session.send(
            `Anh ơiiiiii, anh muốn "ấy" thì phải làm vầy nè:
1. Anh đưa link Fshare vô em, vầy nè anh: @iBot (là em đó, hí hí) https://www.fshare.vn/file/2GWXN9YU2ENQ
2. Hoặc là link ChiaSeNhac cũng được nha anh, thí dụ như: @iBot http://chiasenhac.vn/nhac-hot/dusk-till-dawn~zayn-sia~tsvd53t0qmhwfn.html
3. Mai mốt em còn nhiều trò vui lắm, từ từ em chỉ anh nghe!
            `);
    } else {
        session.send(`Anh à, nói gì mà em hổng hiểu, anh nói lại i.`);
    }
});
