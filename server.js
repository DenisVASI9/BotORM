const config = require('./config.json')
const mongoose = require('mongoose')
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const {User} = require("./models/users")
const {MessageSchema, CommercialMessageSchema} = require("./models/message")
const cors = require('@koa/cors')
const {Telegraf} = require('telegraf')

const server = async () => {

    try {
        console.log('connect to database')
        await mongoose.connect(config.database, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    } catch (e) {
        console.log(e)
        process.exit(1)
    }

    const bot = new Telegraf(config.telegram_token)

    bot.start(async (ctx) => {
        const user = await User.findOne({
            userId: ctx.update.message.from.id
        })

        if (user === null) {
            const user = new User({
                userId: ctx.update.message.from.id,
                chatId: ctx.update.message.chat.id
            })
            await user.save()
        }
    })

    await bot.launch()

    const app = new Koa()
    const router = new Router()
    app.use(bodyParser())
    app.use(cors())

    router
        .post('/api/message/commercial', async ctx => {
            try {
                await CommercialMessageSchema.validateAsync(ctx.request.body)
            } catch (error) {
                const lastError = error.details.pop()
                return ctx.body = lastError.message
            }
            try {
                const users = await User.find({})
                users.map(user => {
                    bot.telegram.sendMessage(user.chatId, `
                    Заявка на получение коммерческого предложения
                    Телефон: ${ctx.request.body.phone}
                    Email:  ${ctx.request.body.email}
                    Имя: ${ctx.request.body.name}
                    `)
                })
                return ctx.body = "ok!"
            } catch (error) {
                return ctx.body = error.message
            }
        })
        .post('/api/message/analysis', async ctx => {
            try {
                await MessageSchema.validateAsync(ctx.request.body)
            } catch (error) {
                const lastError = error.details.pop()
                return ctx.body = lastError.message
            }
            try {
                const users = await User.find({})
                users.map(user => {
                    bot.telegram.sendMessage(user.chatId,
                        `
                        Заявка на анализ компании
                    Телефон: ${ctx.request.body.phone} 
                    Сообщение: ${ctx.request.body.message}
                    Имя: ${ctx.request.body.name}
                    Компания: ${ctx.request.body.company}
                    Сфера: ${ctx.request.body.sphere}
                    Город: ${ctx.request.body.city}
                    Email: ${ctx.request.body.email}
                    `)
                })
                return ctx.body = "ok!"
            } catch (error) {
                return ctx.body = error.message
            }
        })
    try {
        console.log('launch server')
        app
            .use(router.routes())
            .use(router.allowedMethods())

        app.listen(config.port)
    } catch (e) {
        console.log(e)
        process.exit(1)
    }

    return config
}

server().then(config => {
    console.log('server running in: ' + config.port)
})
