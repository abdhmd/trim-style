import bcrypt from 'bcryptjs';

async function hashPassword() {
  const username = 'admin'; // هنا تكتب اسم المستخدم
  const password = '123'; // وهنا الباسورد اللي تبغى تشفره

  const hashedPassword = await bcrypt.hash(password, 10);

  console.log('Username:', username);
  console.log('Hashed Password:', hashedPassword);
}

hashPassword();
