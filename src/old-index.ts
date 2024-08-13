import { Client, Events, GatewayIntentBits, REST, Routes, Collection, ActivityType } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection<string, any>();

// Function to load commands
const loadCommands = async () => {
  const commandsPath = path.join(__dirname, '../commands');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);
    client.commands.set(command.command.name, command.command);
  }
};

// Register slash commands
const registerCommands = async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    const commands = client.commands.map(({ name, description }) => ({ name, description }));
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
};

client.once(Events.ClientReady, async (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);

  // Set the bot's activity using the ActivityType enum
  c.user.setActivity("walkbot.app | /help", { type: ActivityType.Playing });

  // Load commands and register them
  await loadCommands();
  await registerCommands();
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    await interaction.reply({ content: 'Unknown command!', ephemeral: true });
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error('Error executing command:', error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.login(process.env.DISCORD_TOKEN);
