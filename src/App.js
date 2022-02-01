import './App.css';

import React, {useState, useEffect} from 'react'
import axios from 'axios';
import {Container, FormControl, Grid, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import ProductCard from "./Components/ProductCard";

function App() {
  const [products, setProducts] = useState();
  const [allProducts, setAllProducts] = useState();
  const [addProduct, setAddProduct] = useState();
  const [productsType, setProductsType] = useState("Download");

    const handleChange = (event) => {
        setProductsType(event.target.value);
    };

    useEffect(() => {
    axios
        .get("/api/products/")
        .then((prod) => {
            setAllProducts(prod.data);
            console.log('prod');
            console.log(prod);
        })
        .catch((err) => {
            console.log('err');
            console.log(err);
        });
  }, [addProduct]);

    useEffect(() => {
        if(allProducts){
            setProducts(allProducts.filter(x=> x.type===productsType));
        }
    }, [allProducts, productsType])

  return (
    <Container>
      <Typography variant="h2" gutterBottom component="div">Products</Typography>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-standard-label">Product Type</InputLabel>
            <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={productsType}
                onChange={handleChange}
                label="Product Type"
            >
                <MenuItem value={"Download"}>Download</MenuItem>
                <MenuItem value={"Subscription"}>Subscription</MenuItem>
                <MenuItem value={"Delivery"}>Delivery</MenuItem>
            </Select>
        </FormControl>
      <Grid container spacing={{ xs: 2, md: 3 }}>
          { products &&
            products.map((product, index)=> (
                <Grid item xs={4} >
                    <ProductCard product={product}/>
                </Grid>
            ))
          }
      </Grid>
    </Container>
  );
}

export default App;
