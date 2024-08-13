import { CommandInteraction, ApplicationCommandOptionType } from 'discord.js';

export const command = {
  name: 'kick',
  description: 'Kick a user from the server.',
  options: [
    {
      name: 'user',
      type: ApplicationCommandOptionType.User,
      description: 'The user to kick',
      required: true,
    },
    {
      name: 'reason',
      type: ApplicationCommandOptionType.String,
      description: 'The reason for the kick',
      required: false,
    },
  ],
  execute: async (interaction: CommandInteraction) => {
    if (!interaction.memberPermissions?.has('KICK_MEMBERS')) {
      await interaction.reply({ content: 'You do not have permission to kick members.', ephemeral: true });
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
      await member.kick(reason);
      await interaction.reply({ content: `${user.tag} has been kicked from the server. Reason: ${reason}` });
    } catch (error) {
      console.error('Error kicking member:', error);
      await interaction.reply({ content: 'There was an error trying to kick the member.', ephemeral: true });
    }
  },
};
