import { CommandInteraction, EmbedBuilder } from 'discord.js';

export const command = {
  name: 'help',
  description: 'Gives you a list of commands.',
  execute: async (interaction: CommandInteraction) => {
    // Create an embed
    const helpEmbed = new EmbedBuilder()
      .setColor(0x0099ff) // Set the color of the embed
      .setTitle('Commands') // Title of the embed
      .setDescription('Here is a list of available commands:') // Description
      .setThumbnail('https://i.imgur.com/AfFp7pu.png') // Thumbnail image
      .addFields(
        { name: '/help', value: 'Gives you a list of commands.', inline: true },
        { name: '/ping-pong', value: 'Replies with Pong!', inline: true },
        { name: '/hi', value: 'Replies with a greeting!', inline: true },
      );

    // Respond to the interaction with the embed
    await interaction.reply({ embeds: [helpEmbed] });
  }
};
