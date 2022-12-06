const mongoose = require("mongoose");

const d = new mongoose.Schema({
  guildid: { type: String },
  channelid: { type: String },
  messageid: { type: String },
});

module.exports = mongoose.model("뮤직셋업 리스트", d);