const fs = require('fs');
const express = require('express');
const cors = require('cors'); // Import the 'cors' module
const app = express();
const port = 3010;

// Enable CORS only for 'http://localhost:3000'
app.use(cors({
    origin: 'http://localhost:3000',
}));

app.use(express.json());

// Kullanıcı kayıtlarını kontrol etmek ve dosyadan okumak için bir yardımcı fonksiyon
function getUsers() {
  try {
    const usersData = fs.readFileSync('users.json', 'utf-8');
    return JSON.parse(usersData) || [];
  } catch (error) {
    return [];
  }
}

// Kullanıcı kayıtlarını dosyaya eklemek için bir yardımcı fonksiyon
function saveUser(user) {
  const existingUsers = getUsers();
  existingUsers.push(user);

  // Dosyanın var olup olmadığını kontrol et ve gerekirse oluştur
  try {
    fs.accessSync('users.json');
  } catch (error) {
    // Dosya yoksa oluştur
    fs.writeFileSync('users.json', '');
  }

  // Dosyaya ekleme yap
  fs.appendFileSync('users.json', JSON.stringify(existingUsers, null, 4) + "\n");
}


app.post('/register', (req, res) => {
  const { email, password, publicKey, privateKey } = req.body;

  if (!email || !password || !publicKey || !privateKey) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Kullanıcı bilgilerini kontrol et
  const existingUsers = require('./users.json');
  if (isUserExists(existingUsers, email)) {
    return res.status(409).json({ error: 'User with this email already exists' });
  }

  const user = {
    email,
    password,
    publicKey,
    privateKey,
  };

  // Kullanıcı bilgilerini dosyaya ekleyin
  saveUser(existingUsers, user);

  res.json({ success: true, message: 'User registered successfully' });
});

// E-posta adresine sahip kullanıcının varlığını kontrol et
function isUserExists(existingUsers, email) {
  return existingUsers.some(user => user.email === email);
}

// Kullanıcı bilgilerini dosyaya ekleyen fonksiyon
function saveUser(existingUsers, user) {
  const fs = require('fs');
  existingUsers.push(user);
  fs.writeFileSync('./users.json', JSON.stringify(existingUsers));
}


const users = require('./users.json');

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  // Kullanıcıyı bul
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Başarılı giriş durumunda token veya diğer bilgileri döndür
  res.json({ success: true, token: user.token, publicKey: user.publicKey, privateKey: user.privateKey });
  console.log('User publicKey:', user.publicKey);

});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
