module.exports = async (WDR, Functions, Message, Member, AreaArray) => {
  let query = `
    SELECT
        *
    FROM
        wdr_users
    WHERE
        user_id = ${Member.id}
          AND
        guild_id = ${Message.guild.id};
  `;
  WDR.wdrDB.query(
    query,
    function(error, user, fields) {
      user = user[0];
      if (error) {
        WDR.Console.error(WDR, "[sub/loc/view.js] Error Fetching User to View Locations.", [query, error]);
        return Message.reply("There has been an error, please contact an Admin to fix.").then(m => m.delete({
          timeout: 10000
        }));
      } else {

        if (JSON.stringify(Member.db.locations) != JSON.stringify(user.locations)) {
          Member.db.locations = user.locations;
        }

        let location_list = "";
        if (user.locations) {
          let locations = Object.keys(user.locations).map(i => user.locations[i]);
          if (locations.length > 0) {
            locations.forEach((location, i) => {
              location_list += "**" + (i + 1) + " - " + location.name + "**\n" +
                "　Radius: `" + location.radius + "` km(s)\n";
            });
          } else {
            location_list = false;
          }
        } else {
          location_list = false;
        }

        if (location_list) {
          let area_subs = new WDR.DiscordJS.MessageEmbed()
            .setAuthor(Member.db.user_name, Member.user.displayAvatarURL())
            .setTitle("Your Locations:")
            .setDescription(location_list)
            .setFooter("You can type 'set', 'create', 'view', 'modify', or \'delete\'.");
          Message.channel.send(area_subs).catch(console.error).then(BotMsg => {
            return Functions.OptionCollect(WDR, Functions, "view", Message, BotMsg, Member);
          });
        } else {
          let no_locations = new WDR.DiscordJS.MessageEmbed()
            .setAuthor(Member.db.user_name, Member.user.displayAvatarURL())
            .setTitle("You do not have any Locations.")
            .setFooter("You can type 'set', 'create', 'view', 'modify', or \'delete\'.");
          Message.channel.send(no_locations).catch(console.error).then(BotMsg => {
            return Functions.OptionCollect(WDR, Functions, "view", Message, BotMsg, Member);
          });
        }
      }
    }
  );
}