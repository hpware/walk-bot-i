import { CommandInteraction } from 'discord.js';

export const command = {
  name: 'hi',
  description: 'Replies with a greeting!',
  execute: async (interaction: CommandInteraction) => {
    await interaction.reply('Hello there!');
  },
};
