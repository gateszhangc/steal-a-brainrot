import fs from 'fs';

// Read the original body HTML
const originalBody = fs.readFileSync('./data/contact-us-body.html', 'utf8');

// Add custom JavaScript before the closing script tags
const customScript = `
<script>
// Replace the form submission handler
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contact-form');
  const submitButton = document.getElementById('fcf-button');
  const statusDiv = document.getElementById('fcf-status');
  const errorDiv = document.getElementById('contact_err');
  const thankYouDiv = document.getElementById('fcf-thank-you');
  const formDiv = document.getElementById('fcf-form');

  // Form validation
  function validateForm() {
    const name = document.getElementById('Name').value.trim();
    const email = document.getElementById('Email').value.trim();
    const message = document.getElementById('Message').value.trim();
    const checkbox = document.getElementById('contactChecked').checked;

    // Clear previous errors
    errorDiv.innerHTML = '';

    // Validate name
    if (!name) {
      errorDiv.innerHTML = '<span class="error">Please enter your name.</span>';
      return false;
    }

    // Validate email
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errorDiv.innerHTML = '<span class="error">Please enter a valid email address.</span>';
      return false;
    }

    // Validate message
    if (!message || message.length < 10) {
      errorDiv.innerHTML = '<span class="error">Message must be at least 10 characters long.</span>';
      return false;
    }

    // Validate checkbox
    if (!checkbox) {
      errorDiv.innerHTML = '<span class="error">Please accept the terms and conditions.</span>';
      return false;
    }

    return true;
  }

  // Handle form submission
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      // Disable submit button and show loading
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      statusDiv.innerHTML = '';

      try {
        const formData = {
          Name: document.getElementById('Name').value.trim(),
          Email: document.getElementById('Email').value.trim(),
          Website: document.getElementById('Website').value.trim(),
          Topic: document.getElementById('Topic').value,
          Message: document.getElementById('Message').value.trim(),
          contactChecked: document.getElementById('contactChecked').checked
        };

        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
          // Show thank you message
          formDiv.style.display = 'none';
          thankYouDiv.style.display = 'block';
        } else {
          // Show error message
          statusDiv.innerHTML = '<span class="error">' + result.message + '</span>';
        }
      } catch (error) {
        console.error('Form submission error:', error);
        statusDiv.innerHTML = '<span class="error">An error occurred. Please try again later.</span>';
      } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
      }
    });
  }

  // Remove the old runValidate call since we're handling validation ourselves
  if (typeof runValidate === 'function') {
    // Don't call the original validation function
  }
});
</script>`;

// Find the position before the closing script tags and insert our custom script
const insertPosition = originalBody.indexOf('<script>window.addEventListener("DOMContentLoaded", function() {');
if (insertPosition !== -1) {
  const updatedBody = originalBody.substring(0, insertPosition) +
                     customScript +
                     originalBody.substring(insertPosition);

  fs.writeFileSync('./data/contact-us-body.html', updatedBody);
  console.log('Updated contact-us body with custom form handling');
} else {
  console.error('Could not find insertion point for custom script');
}