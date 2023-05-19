const express = require('express');
const jsonServer = require('json-server');

const app = express();

app.use('/api', jsonServer.router('db.json'));

app.get('/followers/:userId', (req, res) => {
  const { userId } = req.params;


  const db = jsonServer.router('db.json');
  const user = db.db.get('users').find({ id: parseInt(userId) }).value();

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Fetch the followers of the user
  const followers = db.db
    .get('users')
    .filter((u) => user.followers.includes(u.id))
    .map('username')
    .value();

  let tableHtml = `
    <h1>Followers of User: ${user.username}</h1>
    <table>
      <thead>
        <tr>
          <th>Username</th>
        </tr>
      </thead>
      <tbody>
  `;

  followers.forEach((follower) => {
    tableHtml += `<tr><td>${follower}</td></tr>`;
  });

  tableHtml += `
      </tbody>
    </table>
  `;

  // Send the HTML table as the response
  res.send(tableHtml);
});

//GET request to http://localhost:3000/followers/:userId

// Start the server
const port = 3030;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
