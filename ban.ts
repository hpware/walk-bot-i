import { CommandInteraction, ApplicationCommandOptionType } from 'discord.js';

export const command = {
  name: 'ban',
  description: 'Ban a user from the server.',
  options: [
    {
      name: 'user',
      type: ApplicationCommandOptionType.User,
      description: 'The user to ban',
      required: true,
    },
    {
      name: 'reason',
      type: ApplicationCommandOptionType.String,
      description: 'The reason for the ban',
      required: false,
    },
  ],
  execute: async (interaction: CommandInteraction) => {
    if (!interaction.memberPermissions?.has('BAN_MEMBERS')) {
      await interaction.reply({ content: 'You do not have permission to ban members.', ephemeral: true });
      return;
    }

    const user = interaction.options.getUser('user', true);
    const reason = interaction.options.getString('reason') || 'No reason provided';

    const member = interaction.guild?.members.cache.get(user.id);

    if (!member) {
      await interaction.reply({ content: 'User not found in the server.', ephemeral: true });
      return;
    }

    try {
      await member.ban({ reason });
      await interaction.reply({ content: `${user.tag} has been banned from the server. Reason: ${reason}` });
    } catch (error) {
      console.error('Error banning member:', error);
      await interaction.reply({ content: 'There was an error trying to ban the member.', ephemeral: true });
    }
  },
};
