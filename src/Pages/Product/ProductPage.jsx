import { useEffect, useState } from "react";
import { get } from "../../utils/httpClient";
import { useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import RemoveIcon from "@mui/icons-material/Remove";
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ProductPage() {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState([]);
  const [editedPrice, setEditedPrice] = React.useState(0);
  const [count, setCount] = useState(0);
  const [amount, setAmount] = React.useState(0);
  const { id } = useParams();
  const [products, setProduct] = useState("");
  const navigate = useNavigate();

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAdd = () => {
    setCount(count + 1);
  };
  const handleRemove = () => {
    setCount(count - 1);
    if (count === 0) {
      setCount(count);
    }
  };

  const handlePriceChange = (event) => {
    setEditedPrice(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const loadUser = () => {
    try {
      const userAuthData = localStorage.getItem("userAuth");
      setUser(userAuthData ? JSON.parse(userAuthData) : null);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadProduct();
    loadUser();
    const userAuth = JSON.parse(localStorage.getItem("userAuth"));
    setIsAdmin(userAuth?.is_admin || false);
  }, [id]);

  const handleBuy = async () => {
    if (count !== 0) {
      const newAmount = products[0].amount - count;
      try {
        const res = await axios.patch(`http://localhost:3000/products/${id}`, {
          amount: newAmount,
        });
        setCount(0);
      } catch (error) {
        console.log("Error editing product:", error);
      }
      try {
        if (!user || !user.id) {
          console.error("User is not logged in");
          return;
        }
        const res = await axios.post("http://localhost:3000/sales", {
          user_id: user.id,
          product_id: id,
        });
        if (res.error) {
          console.error("Error Buying:", response.error);
        } else {
          console.log("buy successfully");
          loadProduct();
        }
      } catch (error) {
        console.error("Error adding buy:", error);
      }
    }
  };

  const handleEdit = async () => {
    try {
      const res = await axios.put(`http://localhost:3000/products/${id}`, {
        amount: amount,
        price: editedPrice,
      });
      handleCloseDialog();
      loadProduct();
    } catch (error) {
      console.log("Error editing product:", error);
    }
  };
  const handelDelete = async () => {
    try {
      const res = await axios.delete(`http://localhost:3000/products/${id}`);
      navigate("/");
      loadProduct();
    } catch (error) {
      console.log("Error delete product:", error);
    }
  };

  const loadProduct = async () => {
    try {
      const res = await get(`/products/${id}`);
      setAmount(res.data.amount);
      setProduct(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!products) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardContent>
        <Typography color="textSecondary" variant="h6" gutterBottom>
          Brand: {products[0]?.brand}
        </Typography>
        <Typography variant="body2" component="h2">
          Name: {products[0]?.name}
        </Typography>
        {isAdmin && (
          <Typography variant="body2" component="h2">
            Amount: {products[0]?.amount}
          </Typography>
        )}
        <Typography variant="body2" component="h2">
          Category: {products[0]?.category}
        </Typography>
        <Typography variant="body2" component="p">
          Description: {products[0]?.description}
        </Typography>
        <Typography variant="body2" component="p">
          Price: {products[0]?.price}
        </Typography>
      </CardContent>
      {isAdmin && <Button onClick={handleOpenDialog}>Edit</Button>}
      {isAdmin && <Button onClick={handelDelete}>delete</Button>}
      <div
        style={{ display: "flex", alignItems: "center", flexdirection: "row" }}
      >
        {user && !isAdmin && (
          <IconButton>
            <span>
              <RemoveIcon onClick={handleRemove} />
            </span>
          </IconButton>
        )}
        {user && !isAdmin && <div>{count}</div>}
        {user && !isAdmin && (
          <IconButton>
            <span>
              <AddIcon onClick={handleAdd} />
            </span>
          </IconButton>
        )}
      </div>
      {user && !isAdmin && <Button onClick={handleBuy}>Buy</Button>}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            handleCloseDialog();
          },
        }}
      >
        <DialogTitle>Edit Products</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="amount"
            name="amount"
            label="amount"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleAmountChange}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="price"
            name="price"
            label="price"
            type="text"
            fullWidth
            variant="standard"
            onChange={handlePriceChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleEdit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
