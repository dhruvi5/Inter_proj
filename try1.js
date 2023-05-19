const express = require('express');
const jsonServer = require('json-server');
const { createReadStream } = require('fs');

const app = express();
const router = jsonServer.router('db.json');

app.use(express.json());

app.get('/', (req, res, next) => {
  const stream = createReadStream('index.html');
  stream.pipe(res);
});

app.post('/followers/:userId', (req, res, next) => {
  const userId = req.params.userId;

  console.log('Received userId:', userId);

  const users = router.db.getState().users;
  console.log('All users:', users);

  const user = users.find((u) => u.id === parseInt(userId));

  console.log('Matched user:', user);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const followers = users
    .filter((u) => user.followers.includes(u.id))
    .map((u) => u.username);

  console.log('Followers:', followers);

  res.json({ followers });
});

const port = 3030;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

