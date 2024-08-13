import { Client, Events, GatewayIntentBits, REST, Routes, Collection, ActivityType } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import readline from 'readline';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection<string, any>();

let runInBackground = false; // Controls whether the bot runs in the background

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

// Listen for interactions
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    await interaction.reply({ content: 'Unknown command!', ephemeral: true });
    return;
  }

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error('Error executing command:', error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.once(Events.ClientReady, async (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);

  c.user.setActivity("walkbot.app | /help", { type: ActivityType.Playing });

  await loadCommands();
  await registerCommands();

  // Start console interface
  if (!runInBackground) {
    startConsoleInterface();
  }
});

// Start the bot
client.login(process.env.DISCORD_TOKEN);

// Console Interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const startConsoleInterface = () => {
  rl.setPrompt('Bot> ');
  rl.prompt();

  rl.on('line', async (line) => {
    const input = line.trim().toLowerCase();

    if (input === 'reload') {
      await loadCommands();
      await registerCommands();
      console.log('Commands reloaded.');
    } else if (input === 'background') {
      runInBackground = !runInBackground;
      console.log(`Running in background: ${runInBackground}`);
      if (runInBackground) {
        rl.pause(); // Stop listening to the console
      } else {
        rl.resume(); // Resume listening to the console
      }
    } else if (input === 'exit') {
      console.log('Shutting down...');
      client.destroy();
      process.exit(0);
    } else {
      console.log(`Unknown command: ${input}`);
    }

    rl.prompt();
  });
};
