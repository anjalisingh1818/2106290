const express = require("express");
const dotenv = require("dotenv").config();
const app = express();

const port = process.env.PORT; 
const axios = require('axios');
app.get('/fetch/:company/:category', async (req, res) => {
    const { company, category} = req.params;
    if (!company || !category) {
        return res.status(400).json({ error: 'Some paramaters are missing' });
    }

    const apiUrl = `http://20.244.56.144/test/companies/${company}/categories/${category}/products`; 
    const queryParams = {
        top: req.query.top ,
        minPrice:req.query.minPrice,
        maxPrice:req.query.maxPrice
    };

    try {
        const queryString = new URLSearchParams(queryParams).toString();
        const fullUrl = `${apiUrl}?${queryString}`;
        console.log(fullUrl);
        const auth=`Bearer ${process.env.TOKEN}`
        const response = await axios.get(fullUrl, {
            headers: {
                Authorization: auth
            }
        });
        console.log(response);
        const products = response.data;

        res.json(products); 
    } catch (error) {
        console.error('Error while fetching the products:', error.message);
        res.status(500).json({ error: 'Problem while fetching' });
    }
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`); 
});