import './App.css';
import LoadingButton from '@mui/lab/LoadingButton';
import React, {useState, useEffect} from 'react'
import axios from 'axios';
import {
    Box,
    Button,
    Container, Dialog, DialogContent, DialogTitle,
    FormControl,
    Grid, IconButton, InputAdornment,
    InputLabel,
    MenuItem,
    Select, Snackbar, Stack, TextField,
    Typography
} from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import ProductCard from "./Components/ProductCard";
import PropTypes from "prop-types";
import CloseIcon from '@mui/icons-material/Close';

// Dialogue
const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
  const [products, setProducts] = useState();
  const [allProducts, setAllProducts] = useState();
  const [addProduct, setAddProduct] = useState(false);

  const [productName, setProductName] = useState("");
  const [productsType, setProductsType] = useState("Download");
  const [productImageLink, setProductImageLink] = useState("");
  const [productPrice, setProductPrice] = useState("");

    const [nameErr, setNameErr] = useState(false);
    const [imageLinkErr, setImageLinkErr] = useState(false);
    const [priceErr, setPriceErr] = useState(false);

    // Open toggle for modal
    const [open, setOpen] = React.useState(false);

    // Success/Unsuccess message toggle
    const [success, setSuccess] = React.useState(false);
    const [unsuccess, setUnsuccess] = React.useState(false);

    const resetConstants = () => {
        setProductName("");
        setProductImageLink("");
        setProductPrice("");
    }

    const resetErrs = () => {
        setNameErr(false);
        setImageLinkErr(false);
        setPriceErr(null);
    }

    const isURL = (str) => {
        const urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
        const url = new RegExp(urlRegex, 'i');
        return str.length < 2083 && url.test(str);
    }


    // To handle closing of adding product success message
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSuccess(false);
        setUnsuccess(false);
    };

    // Adding product form submission
    const handleAddProduct = (e) => {
        e.preventDefault();
        resetErrs();

        if(productName.length === 0){
            setNameErr(true);
            return;
        }

        else if(productImageLink.length === 0 || !isURL(productImageLink)){
            setImageLinkErr(true);
            return;
        }

        else if(productPrice===""){
            setPriceErr(true);
            return;
        }

        setAddProduct(true);

        axios
            .post("/api/products/", {
                name: productName,
                type: productsType,
                imageLink: productImageLink,
                price: productPrice
            })
            .then(()=> {
                console.log("Successfully added product");
                setAddProduct(false);
                setSuccess(true);
                resetConstants();
            })
            .catch((e)=>{
                console.log(e);
                setAddProduct(false);
            })

    }

    useEffect(() => {
    axios
        .get("/api/products/")
        .then((prod) => {
            setAllProducts(prod.data);
            // console.log('prod');
            // console.log(prod);
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
        <Stack spacing={2} mb={5}>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-standard-label">Product Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={productsType}
                            onChange={(e)=>{setProductsType(e.target.value);}}
                            label="Product Type"
                        >
                            <MenuItem value={"Download"}>Download</MenuItem>
                            <MenuItem value={"Subscription"}>Subscription</MenuItem>
                            <MenuItem value={"Delivery"}>Delivery</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <Button color="error" variant="contained" onClick={()=>setOpen(true)}>Add Product</Button>
                </Grid>
            </Grid>

          <Grid container rowSpacing={{ xs: 2, md: 3 }}>
              { products &&
                products.map((product, index)=> (
                    <Grid item xs={12} md={4} key={index}>
                        <ProductCard product={product}/>
                    </Grid>
                ))
              }
          </Grid>
      </Stack>
      <Dialog
          open={open}
          onClose={()=>setOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
      >
          <Box >
              <BootstrapDialogTitle id="modal-modal-title" onClose={()=>setOpen(false)}>
                  Add new {productsType} product
              </BootstrapDialogTitle >
              <DialogContent >
                  <Box
                      component="form"
                      sx={{
                          '& > :not(style)': { m: 1, mt: 2 },
                      }}
                  >
                      <TextField
                          fullWidth
                          placeholder="Name"
                          label="Name"
                          variant="filled"
                          value={productName}
                          onChange={(e)=>setProductName(e.target.value)}
                          error ={nameErr}
                          helperText={nameErr? "Please enter name": ""}
                      />
                      <TextField
                          fullWidth
                          placeholder="https://www..."
                          label="Image Link"
                          variant="filled"
                          value={productImageLink}
                          onChange={(e)=>setProductImageLink(e.target.value)}
                          error ={imageLinkErr}
                          helperText={imageLinkErr? "Please enter proper image link": ""}
                      />
                      <TextField
                          InputProps={{
                              startAdornment: <InputAdornment position="start">Rs </InputAdornment>,
                          }}

                          type="number"
                          label="Price"
                          variant="filled"
                          fullWidth
                          value={productPrice}
                          onChange={(e)=>setProductPrice(e.target.value)}
                          error ={priceErr}
                          helperText={priceErr? "Please enter product price": ""}
                      />
                      <TextField
                          disabled
                          fullWidth
                          id="filled-disabled"
                          label="Product type"
                          defaultValue={productsType}
                          variant="filled"
                      />
                      <LoadingButton type="submit" onClick={handleAddProduct} loading={addProduct} loadingIndicator="Adding..." variant="outlined">
                          Add Product
                      </LoadingButton>
                      <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
                          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                              Product added Successfully!
                          </Alert>
                      </Snackbar>
                      <Snackbar open={unsuccess} autoHideDuration={6000} onClose={handleClose}>
                          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                              Could not add the product
                          </Alert>
                      </Snackbar>
                  </Box >
              </DialogContent >
          </Box>
      </Dialog>
    </Container>
  );
}

export default App;
