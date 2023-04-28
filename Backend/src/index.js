import app from './app.js'
import './db/mongoose.js'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Listning...... at ${PORT}`)
})