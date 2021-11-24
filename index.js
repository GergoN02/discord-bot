import DiscordJS, { Intents } from "discord.js"
import dotenv from "dotenv"

dotenv.config()

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
})

let counter = 0;
let lastSender = 0;

client.on('ready', () => {
    console.log("Music Bot is Online!");

    const guildId = "913070284800688129"
    const guild = client.guilds.cache.get(guildId)
    let commands

    if (guild) {
        commands = guild.commands
    } else {
        commands = client.application?.commands
    }

    commands?.create({
        name: 'marco',
        description: 'Replies with polo',
    })

    commands?.create({
        name: 'add',
        description: 'Performs addition',
        options: [
            {
                name: 'number1',
                description: '1st number',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
            }, 
            {
                name: 'number2',
                description: '2nd number',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
            }
            

        ]
    })
})


client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) {
        return
    }

    const { commandName, options } = interaction 
    
    if (commandName === "marco") {
        interaction.reply({
            content: "polo",
            ephemeral: false,
        })
    } else if (commandName === 'add') {
        const number1 = options.getNumber('number1') || 0
        const number2 = options.getNumber('number2') || 0
        interaction.reply({
            content: 'The sum of ' + number1 + ' and ' + number2 + ` is equal to ${number1 + number2}`,
            ephemeral: false,
        })
    }

})


client.on("messageCreate", (message) => {
    if (message.content === "marco") {
        message.reply({
            content: "polo",
        })
    } else if (message.channel.name === 'count'){
        let number = parseInt(message.content);
        if (message.content > 0) {
            if (lastSender !== message.author.id) {
                if (number == counter + 1){
                    lastSender = message.author.id;
                    counter++;
                    message.react("YES");
                } else {
                    counter = 0;
                    lastSender = null;
                    message.react("NO");
                    message.channel.send(`<@!${message.author.id}> You've ruined the count! Try again!`)
                }
            } else {
                counter = 0;
                lastSender = null;
                message.react("NO");
                message.channel.send (`<!${message.author.id}> You can't count two numbers in a row. Try again!`)
            }
        } 
    }
})




client.login(process.env.TOKEN)
