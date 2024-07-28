// Function to update the cart display
function updateCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemDisplay = document.querySelector('.itemdisplay');
    const finalTotals = document.querySelector('.final');

    if (itemDisplay) {
        itemDisplay.innerHTML = ''; // Clear existing items

        if (cart.length === 0) {
            // Create and style the empty cart message
            const emptyCartMessage = document.createElement('h1');
            emptyCartMessage.className = 'display-3';
            emptyCartMessage.textContent = 'Your cart is empty.';
            emptyCartMessage.style.textAlign = 'center';
            emptyCartMessage.style.paddingTop = '100px';
            
            // Apply flexbox styling to the item display container
            itemDisplay.style.display = 'flex';
            itemDisplay.style.justifyContent = 'center';
            itemDisplay.style.alignItems = 'center';
            itemDisplay.style.minHeight = '50vh'; // Adjust as needed
            
            itemDisplay.appendChild(emptyCartMessage);

            // Reset totals to 0 when the cart is empty
            document.getElementById('total-items').textContent = '0';
            document.getElementById('subtotal').textContent = '0.00';
            document.getElementById('total-cost').textContent = '0.00';

            // Hide the final totals division
            finalTotals.style.display = 'none';
        } else {
            // Remove flexbox styling if there are items in the cart
            itemDisplay.style.display = '';
            itemDisplay.style.justifyContent = '';
            itemDisplay.style.alignItems = '';
            itemDisplay.style.minHeight = '';

            cart.forEach(item => {
                const totalPrice = item.totalPrice || 0;

                const itemDiv = document.createElement('div');
                itemDiv.classList.add('displaydiv');
                itemDiv.setAttribute('data-id', item.id); // Use a unique ID
                itemDiv.setAttribute('data-price', item.price);
                itemDiv.innerHTML = `
                    <img src="${item.image || 'default-image.jpg'}" alt="${item.name || 'Product Image'}">
                    <div class="product-info">
                        ${item.name || 'Product Name'}
                        <br>
                        ${item.description || 'No Description'}
                    </div>
                    <div class="price-info">
                        <div class="qty">
                            <button class="qty-btn qty-increase">+</button>
                            <span class="qty-value">${item.quantity || 1}</span>
                            <button class="qty-btn qty-decrease">-</button>
                        </div>
                        <div class="productprice">Total price: $<span class="total-price">${totalPrice.toFixed(2)}</span></div>
                        <button class="remove-btn">Remove</button>
                    </div>
                `;
                itemDisplay.appendChild(itemDiv);
            });

            // Update totals
            const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
            const subtotal = cart.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
            const tax = subtotal * 0.09; // Example 9% tax
            const totalCost = subtotal + tax;

            document.getElementById('total-items').textContent = totalItems;
            document.getElementById('subtotal').textContent = subtotal.toFixed(2);
            document.getElementById('total-cost').textContent = totalCost.toFixed(2);

            // Show the final totals division
            finalTotals.style.display = 'block';
        }
    }
}

// Event listener for the document load
document.addEventListener('DOMContentLoaded', () => {
    updateCart();
});

// Function to change item quantity
function changeQuantity(button, change) {
    const itemDiv = button.closest('.displaydiv');
    const quantitySpan = itemDiv.querySelector('.qty-value');
    const priceSpan = itemDiv.querySelector('.total-price');
    let quantity = parseInt(quantitySpan.textContent, 10);
    const pricePerItem = parseFloat(itemDiv.getAttribute('data-price'));

    if (quantity === 1 && change === -1) {
        removeItem(button); // Call removeItem if quantity is 1 and decrease button is clicked
    } else {
        quantity += change;
        quantitySpan.textContent = quantity;
        priceSpan.textContent = (quantity * pricePerItem).toFixed(2);

        // Update localStorage
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const itemId = itemDiv.getAttribute('data-id');
        const cartItem = cart.find(item => item.id === itemId);
        if (cartItem) {
            cartItem.quantity = quantity;
            cartItem.totalPrice = quantity * pricePerItem;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart(); // Ensure the cart display is updated
        }
    }
}

// Function to remove an item from the cart
function removeItem(button) {
    const itemDiv = button.closest('.displaydiv');
    const itemId = itemDiv.getAttribute('data-id');

    // Remove item from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));

    // Remove item from display
    itemDiv.remove();

    // Update the cart display
    updateCart();
}

// Event delegation for quantity and remove buttons
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('qty-increase')) {
        changeQuantity(event.target, 1);
    } else if (event.target.classList.contains('qty-decrease')) {
        changeQuantity(event.target, -1);
    } else if (event.target.classList.contains('remove-btn')) {
        removeItem(event.target);
    }
});

// Function to show add to cart modal
function showAddToCartModal() {
    const addToCartModal = new bootstrap.Modal(document.getElementById('addToCartModal'));
    addToCartModal.show();

    setTimeout(() => {
        addToCartModal.hide();
    }, 1000);
}

// Function to add an item to the cart
function addToCart(name, price, id, image, description) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(cartItem => cartItem.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
        existingItem.totalPrice = existingItem.quantity * price;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1,
            totalPrice: price,
            image: image, 
            description: description
        });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    showAddToCartModal(); // Show the modal when an item is added
}
