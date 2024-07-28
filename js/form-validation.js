// Form validation and cart clearing logic
(function () {
  'use strict';

  // Fetch the form
  const form = document.getElementById('checkout-form');

  // Function to validate form fields
  function validateForm() {
    const formIsValid = form.checkValidity();
    form.classList.add('was-validated');
    return formIsValid;
  }

  // Handle form submission
  form.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    if (!validateForm()) {
      event.stopPropagation();
    } else {
      // Gather form data
      const formData = {
        firstName: form.querySelector('#firstName').value,
        lastName: form.querySelector('#lastName').value,
        email: form.querySelector('#email').value,
        address: form.querySelector('#address').value,
        address2: form.querySelector('#address2').value,
        country: form.querySelector('#country').value,
        state: form.querySelector('#state').value,
        zip: form.querySelector('#zip').value,
        paymentMethod: form.querySelector('input[name="paymentMethod"]:checked').nextElementSibling.textContent,
        cardName: form.querySelector('#cc-name').value,
        cardNumber: form.querySelector('#cc-number').value,
        expiration: form.querySelector('#cc-expiration').value,
        cvv: form.querySelector('#cc-cvv').value,
      
      };

      // Save form data to localStorage
      localStorage.setItem('formData', JSON.stringify(formData));

      // Clear the cart
      localStorage.removeItem('cart');

      // Redirect to the data display page
      window.location.href = 'data.html';
    }
  }, false);
})();
