const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Welcome to the Interview Backend!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});