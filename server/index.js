require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Employee = require('./models/Employee');

const app = express();

// --- DEPLOYMENT FIX: CORS ---
// origin: '*'  
app.use(cors({ origin: '*' }));
app.use(express.json());

// --- DEPLOYMENT FIX: MONGO CONNECTION ---
const MONGO_URI = process.env.MONGO_URI; 

mongoose.connect(MONGO_URI)
  .then(() => console.log("🚀 MongoDB Online!"))
  .catch(err => console.error("❌ DB Error:", err));

// --- AI LOGIC FUNCTION ---
const calculateAIFields = (data) => {
    const satisfaction = Math.min(Number(data.satisfaction) || 0, 10);
    const peerRating = Math.min(Number(data.peerRating) || 0, 5);
    const workLoad = Number(data.workLoad) || 0;
    const attendance = Math.min(Number(data.attendance) || 0, 100);

    let prodScore = (satisfaction * 5) + (peerRating * 10);
    if (workLoad > 50) prodScore -= (workLoad - 50) * 2;
    if (attendance < 80) prodScore -= 10;

    return {
        productivity: Math.max(0, Math.min(prodScore, 100)),
        attritionRisk: Math.min(100, Math.max(0, (10 - satisfaction) * 10 + (workLoad > 60 ? 20 : 0))),
        aiRecommendation: prodScore > 80 ? "Elite Asset" : prodScore < 40 ? "Burnout Risk" : "Stable"
    };
};

// --- API ROUTES ---
app.get('/api/employees', async (req, res) => {
    try {
        const emps = await Employee.find().sort({ createdAt: -1 });
        res.json(emps);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/employees', async (req, res) => {
    try {
        const aiFields = calculateAIFields(req.body);
        const newEmp = new Employee({ ...req.body, ...aiFields });
        await newEmp.save();
        res.status(201).json(newEmp);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

app.put('/api/employees/:id', async (req, res) => {
    try {
        const aiFields = calculateAIFields(req.body);
        const updatedEmp = await Employee.findByIdAndUpdate(
            req.params.id, 
            { ...req.body, ...aiFields }, 
            { new: true }
        );
        res.json(updatedEmp);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

app.delete('/api/employees/:id', async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- DEPLOYMENT FIX: DYNAMIC PORT ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));