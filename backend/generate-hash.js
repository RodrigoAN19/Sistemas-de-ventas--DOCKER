// Script para generar hash de contraseña
const bcrypt = require('bcrypt');

const password = 'admin123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error('Error generando hash:', err);
        return;
    }
    console.log('\n=================================');
    console.log('Hash generado para: admin123');
    console.log('=================================');
    console.log(hash);
    console.log('=================================\n');
});
