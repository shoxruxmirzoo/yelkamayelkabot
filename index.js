const telegraf = require('telegraf')

const Stage = require('telegraf/stage')
const session = require('telegraf/session')
const Scene = require('telegraf/scenes/base')
const {leave} = Stage
const stage = new Stage()

// id va tokenlar
const admin = "-1001430249749"
const token = "1080010427:AAFkbkN5K0b0SM3QnOKhXnwk5yRW4AHc6q0"

const bot = new telegraf(token) // token data.json da 
const parse = {parse_mode: "Markdown"}

// kiritish uchun 
const getName = new Scene('getName')
stage.register(getName)
const getNum = new Scene('getNum')
stage.register(getNum)
const getAddress = new Scene('getAddress')
stage.register(getAddress)
const getAboutFamily = new Scene('getAboutFamily')
stage.register(getAboutFamily)

const getDay = new Scene('getDay')
stage.register(getDay)
const getTime = new Scene('getTime')

stage.register(getTime)
const check = new Scene('check')
stage.register(check)

bot.use(session())
bot.use(stage.middleware())

bot.hears('◀ Bosh menyu', (ctx) => {
    ctx.reply(
        'Ism-familiyangizni  kiriting ⬇',
        { reply_markup: { remove_keyboard: true} }
    )
    ctx.scene.enter('getName')
})

bot.start((ctx) => {
    ctx.reply(
        `Salom, ${ctx.from.first_name}`+
        '\n\nIsm-familiyangizni  kiriting ⬇',
        { reply_markup: { remove_keyboard: true} }
    )
    ctx.scene.enter('getName')
})

// ismni kiritish
getName.command('start', async (ctx) => {
    ctx.reply(
        'Ism-familiyangizni kiriting ⬇',
        { reply_markup: { remove_keyboard: true }}
    )
    await ctx.scene.leave('getAboutFamily')
    ctx.scene.enter('getName')
})

getName.on('text', async (ctx) => {
    if (ctx.message.text === '◀ Orqaga') {
        return ctx.reply( 'Siz registratsiyaning boshidasiz. Iltimos ism familiyangizni kiriting ⬇')
    }
  ctx.session.name = ctx.message.text
  ctx.reply(
      `🏠 Manzilni to'liq kiriting\n\n1. shahar/tuman 2. ko'cha 3. uy raqami`,
      { reply_markup: { keyboard: [[ `◀ Orqaga`]], resize_keyboard: true, on_time_keyboard: true }}
  )  
  await ctx.scene.leave('getName')
  ctx.scene.enter('getAddress')
})


//yoshini kiritish
getAddress.hears( '◀ Orqaga', async (ctx) => {
    ctx.reply(
        'Ism-Familiyangizni  kiriting ⬇',
        { reply_markup: { remove_keyboard: true} }
    )
    await ctx.scene.leave('getAddress')
    ctx.scene.enter('getName')
})

getAddress.on('text', async (ctx) => {
    ctx.session.age = ctx.message.text
    ctx.reply(
        `👨‍👨‍👦‍👦 Oila haqida qisqacha ma'lumot yozing`,
        { reply_markup: { keyboard: [[ `◀ Orqaga`, `❌ O'chirish`]], resize_keyboard: true, on_time_keyboard: true }}
    )
    await ctx.scene.leave('getAddress')
    ctx.scene.enter('getAboutFamily')
} )



// Kurslarni tanlash
getAboutFamily.hears('◀ Orqaga', async (ctx) => {
    ctx.reply(
        `🏠 Manzilni to'liq kiriting\n\n1. shahar/tuman 2. ko'cha 3. uy raqami`,
        { reply_markup: { keyboard: [[ `◀ Orqaga`, `❌ O'chirish`]], resize_keyboard: true, on_time_keyboard: true }}
    )
    await ctx.scene.leave('getAboutFamily')
    ctx.scene.enter('getAddress')
})

getAboutFamily.hears([ `❌ O'chirish`, `/start`], async (ctx) => {
    ctx.reply(
        'Ism-familiyangizni kiriting ⬇',
        { reply_markup: { remove_keyboard: true }}
    )
    await ctx.scene.leave('getAboutFamily')
    ctx.scene.enter('getName')
})

getAboutFamily.on('text', async(ctx) => {
    ctx.session.course = ctx.message.text
    ctx.reply(
        `Telefon raqamingizni yuboring`,
        { reply_markup: { keyboard: [[{text: '📞 Telefon raqamni yuborish', request_contact: true}],
        [ `◀ Orqaga`, `❌ O'chirish`]], resize_keyboard: true, on_time_keyboard: true }}
    )
    await ctx.scene.leave('getAboutFamily')
    ctx.scene.enter('getNum')
})

// o'qish kunlarini kiritish

///////////////////////
getNum.hears('◀ Orqaga', async (ctx) => {
    ctx.reply(
        `👨‍👨‍👦‍👦 Oila haqida qisqacha ma'lumot yozing`,
        { reply_markup: { keyboard: [[ `◀ Orqaga`, `❌ O'chirish`]], resize_keyboard: true, on_time_keyboard: true }}
    )
    await ctx.scene.leave('getNum')
    ctx.scene.enter('getAboutFamily')
})


getNum.hears([`❌ O'chirish`, `/start`], async (ctx) => {
    ctx.reply(
        'Ism-familiyangizni kiriting ⬇',
        { reply_markup: { remove_keyboard: true }}
    )
    await ctx.scene.leave('getNum')
    ctx.scene.enter('getName')
    ctx.session = null
})

getNum.on('contact', async (ctx) => {
    ctx.session.num = ctx.message.contact.phone_number
    ctx.reply (
        `📌 Saqlangan ma'lumotlar\n\n\n👤 Ism-Familiya: ${ctx.session.name}\n\n🏠 Manzil: ${ctx.session.age}\n\n👨‍👨‍👦‍👦 Oila haqida: ${ctx.session.course}\n\n📞 Telefon raqam: ${ctx.session.num}`,
        { reply_markup: { keyboard: [[ `✅ Jo'natish`],
            [ `◀ Orqaga`, `❌ O'chirish`]], resize_keyboard: true, on_time_keyboard: true }, parse_mode: 'markdown'}
    )
    ctx.reply(
        `❗ Ma'lumotlarni qayta tekshirib ko'ring.\n\n"✅ Jo'natish" tugmasini bosing.`
    )
    await ctx.scene.leave('getNum')
    ctx.scene.enter('check')
})



check.hears(`✅ Jo'natish`, async (ctx) => {
    ctx.reply(
        `✅ Raxmat. Siz ro'yxatga olindingiz.\nTez orada siz bilan bog'lanamiz 😊` +
        `\n\nYelkama-yelka - Qo'qon Koronavirusga qarshi "Mehr muruvvat" jamoat xayriya fondi.\n\nKoronavirusni birgalikda yengamiz!\n\n📞 Telefon: +998999232523\n📩 Telegram kanal: @yelkamayelka`,     
        { reply_markup: { keyboard: [['◀ Bosh menyu']], resize_keyboard: true, on_time_keyboard: true } }
        // { reply_markup: { remove_keyboard: true} }
    )


    //adminga xabar yuborish
    bot.telegram.sendMessage(admin,
        `👤 Ism-Familiya: ${ctx.session.name}\n\n📩 Username: @${ctx.from.username}\n\n🏠 Manzil: ${ctx.session.age}\n\n👨‍👨‍👦‍👦 Oila haqida: ${ctx.session.course}\n\n📞 Telefon raqami: ${ctx.session.num}` )
    

    // console.log(`Yangi a'zo!\n\nIsm-Familiya: [${ctx.session.name}]\nUsername: @${ctx.from.username}\nYoshi: ${ctx.session.age}\nKurs: ${ctx.session.course}\nKunlar: ${ctx.session.day}\nVaqt: ${ctx.session.time}` +
    // `\nTelefon raqami: ${ctx.session.num}\n`);
    console.log(`Name: ${ctx.from.first_name} User: ${ctx.from.username}`)

    await ctx.scene.leave('main')
    ctx.session = null
})



check.hears('◀ Orqaga', async (ctx) => {
    ctx.reply(
        `Telefon raqamingizni yuboring`,
        { reply_markup: { keyboard: [[{text: '📞 Telefon raqamni yuborish', request_contact: true}],
        [ `◀ Orqaga`, `❌ O'chirish`]], resize_keyboard: true, on_time_keyboard: true }}
    )
    await ctx.scene.leave('check')
    ctx.scene.enter('getNum')
})

check.hears([`❌ O'chirish`, `/start`], async (ctx) => {
    ctx.reply(
        'Ism-Familiyangizni kiriting',
        { reply_markup: { remove_keyboard: true }}
    )
    await ctx.scene.leave('check')
    ctx.scene.enter('getName')

    ctx.session = null
})



console.log('Bot is LIVE');

bot.startPolling()
