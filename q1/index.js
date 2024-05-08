const express = require("express");
const dotenv = require("dotenv").config();
const app = express();

const port = process.env.PORT;
const axios = require("axios");

function randomId(price) {
  return `P${Math.floor(Math.random() * 1000) + price}`;
}
function sortFunc(products, sortBy, orderBy) {
  return products.sort((a, b) => {
    if (sortBy === "rating") {
      return orderBy === "asc" ? a.rating - b.rating : b.rating - a.rating;
    } else if (sortBy === "price") {
      return orderBy === "asc" ? a.price - b.price : b.price - a.price;
    } else if (sortBy === "company") {
      return orderBy === "asc"
        ? a.company.localeCompare(b.company)
        : b.company.localeCompare(a.company);
    } else if (sortBy === "discount") {
      return orderBy === "asc"
        ? a.discount - b.discount
        : b.discount - a.discount;
    } else {
      return 0;
    }
  });
}

app.get("/fetch/:company/:category", async (req, res) => {
  const { company, category } = req.params;
  if (!company || !category) {
    return res.status(400).json({ error: "Some paramaters are missing" });
  }

  const apiUrl = `http://20.244.56.144/test/companies/${company}/categories/${category}/products`;
  const queryParams = {
    top: req.query.top,
    minPrice: req.query.minPrice,
    maxPrice: req.query.maxPrice,
    sortBy: req.query.sortBy,
    orderBy: req.query.orderBy,
  };

  try {
    const queryString = new URLSearchParams(queryParams).toString();
    const fullUrl = `${apiUrl}?${queryString}`;
    console.log(fullUrl);
    const auth = `Bearer ${process.env.TOKEN}`;
    const response = await axios.get(fullUrl, {
      headers: {
        Authorization: auth,
      },
    });
    console.log(response);
    const products = response.data;
    const productsWithId = products.map((products) => ({
      ...products,
      id: randomId(products.price),
    }));

    const sortedProducts = sortFunc(
      productsWithId,
      queryParams.sortBy,
      queryParams.orderBy
    );

    res.json(sortedProducts);
  } catch (error) {
    console.error("Error while fetching the products:", error.message);
    res.status(500).json({ error: "Problem while fetching" });
  }
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
