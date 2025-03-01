import { useEffect, useState } from "react";
import { get } from "../../utils/httpClient";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Box,
  Alert
} from "@mui/material";
import { Remove as RemoveIcon, Add as AddIcon } from "@mui/icons-material";
import axios from "axios";

export default function ProductPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [openPurchaseDialog, setOpenPurchaseDialog] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [editedPrice, setEditedPrice] = useState(0);
  const [count, setCount] = useState(0);
  const [amount, setAmount] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [password, setPassword] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadProduct();
    loadUser();
    const userAuth = JSON.parse(localStorage.getItem("userAuth"));
    setIsAdmin(userAuth?.is_admin || false);
  }, [id]);

  const loadUser = () => {
    try {
      const userAuthData = localStorage.getItem("userAuth");
      setUser(userAuthData ? JSON.parse(userAuthData) : null);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const loadProduct = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await get(`/products/${id}`);
      if (res.data.length === 0) throw new Error("Product not found");
      setAmount(res.data[0].amount);
      setProduct(res.data[0]);
      setEditedPrice(res.data[0].price);
    } catch (error) {
      setError("Failed to load product. Please try again.");
    }
    setLoading(false);
  };

  const handleBuy = async () => {
    if (count > 0 && product.amount >= count) {
      setOpenPurchaseDialog(true); // Open the purchase dialog
    }
  };

  const handlePurchase = async () => {
    if (!cardNumber || !password) {
      alert("Please enter card number and password.");
      return;
    }
    try {
      // Mocking purchase process
      await axios.patch(`http://localhost:3000/products/${id}`, {
        amount: product.amount - count,
      });
      await axios.post("http://localhost:3000/sales", {
        user_id: user?.id,
        product_id: id,
      });
      setCount(0);
      loadProduct();
      setOpenPurchaseDialog(false); // Close purchase dialog on success
    } catch (error) {
      console.error("Error processing purchase:", error);
    }
  };

  const handleEdit = async () => {
    try {
      await axios.put(`http://localhost:3000/products/${id}`, {
        amount,
        price: editedPrice,
      });
      handleCloseDialog();
      loadProduct();
    } catch (error) {
      console.error("Error editing product:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/products/${id}`);
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const handleAdd = () => setCount((prev) => (prev < product.amount ? prev + 1 : prev));
  const handleRemove = () => setCount((prev) => (prev > 0 ? prev - 1 : 0));

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  return (
    <Card sx={{ 
      maxWidth: 500, 
      margin: "20px auto", 
      padding: 2, 
      backgroundColor: "#C9FFDA", 
      color: "black", 
      borderRadius: "15px", 
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)" 
    }}>
      <CardMedia
        component="img"
        height="250"
        image={product.product_image || "https://via.placeholder.com/250"}
        alt={product.name}
        sx={{ borderRadius: "10px" }}
      />
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {product.name}
        </Typography>
        <Typography color="textSecondary">Brand: {product.brand}</Typography>
        <Typography color="textSecondary">Category: {product.category}</Typography>
        <Typography variant="body1" sx={{ marginTop: 1 }}>
          {product.description}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ marginTop: 1 }}>
          Price: ${product.price}
        </Typography>
        {isAdmin && <Typography>Stock: {product.amount}</Typography>}
      </CardContent>

      {isAdmin && (
        <Box display="flex" justifyContent="space-between" p={1}>
          <Button variant="contained" color="primary" onClick={handleOpenDialog}>
            Edit
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </Box>
      )}

      {user && !isAdmin && (
        <>
          <Box display="flex" alignItems="center" justifyContent="center" my={2}>
            <IconButton onClick={handleRemove} color="error" disabled={count === 0}>
              <RemoveIcon />
            </IconButton>
            <Typography variant="h6" sx={{ mx: 2 }}>
              {count}
            </Typography>
            <IconButton onClick={handleAdd} color="primary" disabled={count >= product.amount}>
              <AddIcon />
            </IconButton>
          </Box>
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={handleBuy}
            disabled={count === 0 || product.amount === 0}
            sx={{
              backgroundColor: product.amount > 0 ? "#4CAF50" : "#757575",
              "&:hover": { backgroundColor: product.amount > 0 ? "#45A049" : "#616161" },
            }}
          >
            {product.amount > 0 ? "Buy Now" : "Out of Stock"}
          </Button>
        </>
      )}

      <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={() => navigate("/")}>
        Back to Home
      </Button>

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Amount" type="number" fullWidth value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
          <TextField margin="dense" label="Price" type="number" fullWidth value={editedPrice} onChange={(e) => setEditedPrice(Number(e.target.value))} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEdit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Purchase Dialog */}
      <Dialog open={openPurchaseDialog} onClose={() => setOpenPurchaseDialog(false)}>
        <DialogTitle>Confirm Purchase</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Total Price: ${(product.price * count).toFixed(2)}</Typography>
          <TextField
            margin="dense"
            label="Card Number"
            type="text"
            fullWidth
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPurchaseDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handlePurchase} color="primary">
            Confirm Purchase
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
