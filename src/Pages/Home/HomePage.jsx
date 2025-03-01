import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { get } from "../../utils/httpClient";
import axios from "axios";
import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { CardActionArea } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import AddIcon from "@mui/icons-material/Add";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import InputLabel from "@mui/material/InputLabel";
import { useNavigate } from "react-router-dom";
import CardMedia from "@mui/material/CardMedia";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));


const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function HomePage() {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [searchQuery, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [rerender, setRerender] = useState(false);

  const hanleOpenPage = (productId) => {
    navigate(`/productPage/${productId}`);
  };

  const [isAdmin, setIsAdmin] = useState(false);
  const userAuth = JSON.parse(localStorage.getItem("userAuth"));
  useEffect(() => {
    loadProducts();
    setIsAdmin(userAuth?.is_admin || false);
  }, [rerender]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleOpenaddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const [newProductData, setNewProductData] = useState({
    brand: "",
    name: "",
    description: "",
    amount: "",
    category: "",
    price: "",
    product_image: "",
  });

  const handleAddProduct = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/products",
        newProductData
      );
      setNewProductData({
        brand: "",
        name: "",
        description: "",
        amount: "",
        category: "",
        price: "",
        product_image: "",
      });
      loadProducts(res);
      handleCloseAddDialog();
    } catch (error) {
      console.log(error);
    }
  };
  const loadProducts = async () => {
    try {
      const { data } = await get("/products");
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleInputChange = (event) => {
    try {
      const { name, value } = event.target;
      setNewProductData({ ...newProductData, [name]: value });
    } catch (error) {
      console.log(error);
    }
  };

  const [openAddDialog, setOpenAddDialog] = React.useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSearch = () => {
    try {
      if (searchQuery === "") {
        setFilteredProducts(products);
      } else {
        const filtered = products.filter((product) => {
          return (
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchQuery.toLowerCase())
          );
        });
        setFilteredProducts(filtered);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSortByPrice = () => {
    try {
      let sortedProducts = [...products];
      sortedProducts.sort((a, b) => a.price - b.price);
      setFilteredProducts(sortedProducts);
    } catch (error) {
      console.log(error);
    }
  };
  const logout = () => {
    localStorage.setItem("userAuth", null);
    setRerender(!rerender);
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed">
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Link
              to="/LoginPage"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Typography variant="body1" sx={{ ml: 1 }}>
                Login / Sign Up
              </Typography>
            </Link>
            <Search>
              <IconButton onClick={handleSearch}>
                    <SearchIcon />
              </IconButton>
              <StyledInputBase
                value={searchQuery}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Brand or Name"
                inputProps={{ "aria-label": "search" }}
            />
            </Search>
            <Tooltip title="Sort Product">
              <IconButton onClick={handleSortByPrice}>
                <Box display="flex" alignItems="center">
                  <ArrowDownwardIcon />
                  <Typography variant="body2" sx={{ marginLeft: 1 }}>
                    Sort by Price
                  </Typography>
                </Box>
              </IconButton>
            </Tooltip>

            {isAdmin && (
              <Tooltip title="Add Product">
                <IconButton onClick={handleOpenaddDialog}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            )}
            {userAuth && (
              <Button onClick={logout} variant="contained">
                Log Out
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
          marginTop: "110px",
        }}
      >
        <Card
          sx={{
            display: "flex",
            flexWrap: "wrap",
            width: "100%",
            gap: "10px",
            height: "100%",
          }}
        >
          {filteredProducts?.map((t) => (
            <CardActionArea
              key={t.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                margin: "15px",
                padding: "15px",
                height: "100%",
                width: "30%",
                border: "1px solid #ccc",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "scale(1.1)",
                  boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
                },
              }}
            >
              <CardMedia
                component="img"
                height="270"
                image={t.product_image}
                alt="phone image"
                sx={{ borderRadius: "8px" }}
              />
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h6" color="text.primary" fontWeight="bold">
                  {t.brand}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {t.name}
                </Typography>
                <Typography variant="body1" color="primary" fontWeight="bold">
                  {t.price}
                </Typography>
                <Box
                  onClick={() => hanleOpenPage(t.id)}
                  sx={{
                    marginTop: "10px",
                    padding: "8px 12px",
                    backgroundColor: "#1976d2",
                    color: "white",
                    borderRadius: "5px",
                    display: "inline-block",
                    cursor: "pointer",
                    transition: "background 0.3s",
                    "&:hover": {
                      backgroundColor: "#155a9a",
                    },
                  }}
                >
                  Show Details
                </Box>
              </CardContent>
            </CardActionArea>
          ))}
        </Card>
      </Box>
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            handleCloseDialog();
          },
        }}
      >
        <DialogTitle>Add Product</DialogTitle>
        <DialogContent>
          <InputLabel size="normal" focused>
            Brand:
          </InputLabel>
          <TextField
            name="brand"
            value={newProductData.brand}
            onChange={handleInputChange}
          />
          <InputLabel size="normal" focused>
            Name:
          </InputLabel>
          <TextField
            name="name"
            value={newProductData.name}
            onChange={handleInputChange}
          />
          <InputLabel size="normal" focused>
            Description:
          </InputLabel>
          <TextField
            name="description"
            value={newProductData.description}
            onChange={handleInputChange}
          />
          <InputLabel size="normal" focused>
            Amount:
          </InputLabel>
          <TextField
            name="amount"
            value={newProductData.amount}
            onChange={handleInputChange}
          />
          <InputLabel size="normal" focused>
            Category:
          </InputLabel>
          <TextField
            name="category"
            value={newProductData.category}
            onChange={handleInputChange}
          />
          <InputLabel size="normal" focused>
            Price:
          </InputLabel>
          <TextField
            name="price"
            value={newProductData.price}
            onChange={handleInputChange}
          />
          <InputLabel size="normal" focused>
            Photo URL:
          </InputLabel>
          <TextField
            name="product_image"
            value={newProductData.product_image}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button onClick={handleAddProduct}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
