const Messages = require("../model/messageModel");

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;//jisne request ki uski body se uski 'from' aur reciever 'to' ki id send ki gyi hai

    const messages = await Messages.find({  //data base se sender aur reciever ke sare messages fetch kar rahe hai
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {   //sare messages ko map kiya
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);//request karne wale ko response bhej rahe hain
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => { //coming from 'chatContainer'
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({//database me message ko store kar rahe hain
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};