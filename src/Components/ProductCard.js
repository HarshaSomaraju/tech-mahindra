import React from 'react';
import {Button, Card, CardActions, CardContent, CardMedia, Typography} from "@mui/material";

export default function ProductCard(props) {

    const {product} = props;
    // console.log('product');
    // console.log(product);


    return (
        <Card sx={{ maxWidth: 345}} >
            <CardMedia
                component="img"
                height="300"
                image={product.imageLink}
                alt={product.name}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {product.name}
                </Typography>
                <Typography gutterBottom variant="h5" component="div">
                    Rs. {product.price}
                </Typography>
            </CardContent>
            <CardActions>
                <Button variant="contained">Add to Cart</Button>
                <Button variant="contained">Buy</Button>
            </CardActions>
        </Card>
    );
}