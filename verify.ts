import { CommandInteraction, GuildMember, Role } from 'discord.js';

export const command = {
  name: 'verify',
  description: 'Verify your account to gain access to the server.',
  execute: async (interaction: CommandInteraction) => {
    const roleName = 'Verified';
    const member = interaction.member as GuildMember;

    // Check if the user already has the role
    if (member.roles.cache.some(role => role.name === roleName)) {
      await interaction.reply({ content: 'You are already verified!', ephemeral: true });
      return;
    }

    // Find the role in the server
    const role = interaction.guild?.roles.cache.find(r => r.name === roleName);

    if (!role) {
      await interaction.reply({ content: 'Verification role not found. Please contact an administrator.', ephemeral: true });
      return;
    }

    // Assign the role to the user
    try {
      await member.roles.add(role);
      await interaction.reply({ content: `You have been verified! Welcome to the server, ${member.user.username}.`, ephemeral: true });
    } catch (error) {
      console.error('Error assigning role:', error);
      await interaction.reply({ content: 'There was an error verifying your account. Please try again later.', ephemeral: true });
    }
  }
};
