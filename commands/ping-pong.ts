import { CommandInteraction } from 'discord.js';

export const command = {
  name: 'ping-pong',
  description: 'Replies with Pong!',
  execute: async (interaction: CommandInteraction) => {
    await interaction.reply('Pong!');
  },
};
