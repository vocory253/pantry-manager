'use client'
import Image from 'next/image'
import {useState, useEffect} from 'react'
import {firestore} from '@/firebase'
import {Box, Typography, Modal, Stack, TextField, Button, Snackbar, Alert} from '@mui/material'
import {collection, query, getDocs, deleteDoc, getDoc, setDoc, doc} from 'firebase/firestore';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [lowStockItem, setLowStockItem] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];

    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        quantity: doc.data().quantity,
        expiration: doc.data().expiration,
      });
    });

    setInventory(inventoryList);
    checkLowStock(inventoryList);
  };

  const checkLowStock = (inventoryList) => {
    const lowStockItem = inventoryList.find(item => item.quantity === 1);
    if (lowStockItem) {
      setLowStockItem(lowStockItem.name);
      setShowSnackbar(true);
    }
  };

  const addItem = async (item, expirationDate, quantity = 1) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if(docSnap.exists()){
      const {quantity: currentQuantity, expiration} = docSnap.data();
      await setDoc(docRef, {
        quantity: currentQuantity + quantity,
        expiration: expirationDate || expiration
      });
    } 
    else {
      await setDoc(docRef, {
        quantity: quantity,
        expiration: expirationDate
      });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if(docSnap.exists()){
      const {quantity, expiration} = docSnap.data();
      if(quantity === 1){
        await deleteDoc(docRef);
      } 
      else {
        await setDoc(docRef, {
          quantity: quantity - 1,
          expiration: expiration
        });
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose= () => setOpen(false);
  const handleCloseSnackbar = () => setShowSnackbar(false);

  return (
    <>
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      flexDirection ="column"
      justifyContent="center" 
      alignItems="center" 
      gap={2}
    >

      <Typography variant="h2">Pantry Manager</Typography>
      <TextField
          label="Search Items"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="large"
          inputProps={{ style: { width: '300px' } }}
      />

      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid black"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)"
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="column" spacing={2}>
            <TextField 
              label="Item Name"
              variant="outlined" 
              fullWidth 
              value={itemName} 
              onChange={(e) => {
                setItemName(e.target.value)
              }} 
            />
            <TextField 
              label="Expiration Date"
              variant="outlined" 
              fullWidth 
              type="date"
              InputLabelProps={{ shrink: true }}
              value={expirationDate} 
              onChange={(e) => setExpirationDate(e.target.value)}
            />
            <TextField 
              label="Quantity"
              variant="outlined" 
              fullWidth 
              type="number"
              value={quantity} 
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <Button variant="outlined" onClick={() => {
              addItem(itemName, expirationDate, quantity);
              setItemName('');
              setExpirationDate('');
              setQuantity(1);
              handleClose();
            }}
            >Add</Button>
          </Stack>
        </Box>
      </Modal>

      <Button variant="contained" onClick={() => {
        handleOpen();
      }}>
        Add New Item
      </Button>

      <Box border="1px solid #333">
        <Box width="1200px" height="75px" bgcolor="#ADD8E6" display="flex" alignItems="center" justifyContent="space-between" padding={5}>
          <Typography variant="h4" color="#333">
            Item Name
          </Typography>
          <Typography variant="h4" color="#333">
            Quantity
          </Typography>
          <Typography variant="h4" color="#333">
            Expiration Date
          </Typography>
        </Box>

        <Stack width="1200px" height="350px" spacing={2} overflow="auto">
          {filteredInventory.map(({name, quantity, expiration}) => (
            <Box key={name} 
              width="100%" 
              minHeight="150px" 
              display="flex" 
              alignItems="center" 
              justifyContent="space-between" 
              bgcolor="#f0f0f0" 
              padding={5}
            >

              <Typography 
                variant="h3" 
                color="#333" 
                textAlign="center"
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>

              <Stack direction="column" spacing={2}>
                <Typography 
                  variant="h3" 
                  color="#333" 
                  textAlign="center"
                >
                  {quantity}
                </Typography>

                <Stack direction="row" spacing={2}>
                  <Button variant="contained" onClick= {() => {
                    addItem(name)
                  }}>+</Button>

                  <Button variant="contained" onClick= {() => {
                    removeItem(name)
                  }}>-</Button>
                </Stack>
              </Stack>

              <Typography 
                variant="h6" 
                color="#666" 
                textAlign="left"
              >
                Expires: {expiration || 'No date set'}
              </Typography>

            </Box>
          ))}
        </Stack>
      </Box>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="warning" sx={{ width: '100%' }}>
          Low stock alert! Only 1 item left for {lowStockItem}.
        </Alert>
      </Snackbar>

    </Box>
    </>
  );
}
