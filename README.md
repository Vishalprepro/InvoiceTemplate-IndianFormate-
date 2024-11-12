# Invoice Generator Template

Welcome to the **Invoice Generator Template**! This web application allows you to create professional invoices with ease. It’s built using **JavaScript**, **CSS**, and **HTML**. You can customize the invoice template, add products, calculate GST (Goods and Services Tax), and download the invoice as a PDF or image. 

This README provides detailed instructions on how to set up and use the template.

---

## Features

- **User Input Form**: The `invoiceform.html` page collects all necessary details such as:
  - **Buyer’s Information**: Name, address, and contact details.
  - **Product Details**: Add product name, rate, GST rate, and quantity.
- **GST Calculation**:
  - **SGST** and **CGST** are automatically calculated based on the given GST rate.
  - **SGST** = GST/2, **CGST** = GST/2.
  - **SGST Amount** and **CGST Amount** are calculated as a percentage of the total amount for each product.
- **HSN Code Lookup**:
  - You can enter either an **HSN Code** or an **HSN Description**, and the system will automatically display the corresponding description or code.
  - HSN codes and descriptions are stored in a JSON file (imported from an Excel file).
- **Responsive Invoice Template**: Once the form is filled and submitted, the system generates an invoice with the calculated values and displays them in a clean template.
- **Words to Number**: Converts the final amount into words for a more professional touch.
- **Download Options**: Download the invoice as a **PDF** or **image** file.

---

## How It Works

1. **Fill in the Invoice Form**:
   - Open `invoiceform.html` in your browser.
   - Enter the buyer’s details, product details (name, rate, GST, quantity), and any applicable HSN codes or descriptions.
   
2. **GST Calculation**:
   - The system automatically calculates the GST breakdown, including **SGST** and **CGST**, based on the rates you input.
   - The calculated amounts are then displayed for each product.

3. **Generate and Download the Invoice**:
   - After clicking the "Submit" button, the page redirects to `radio.html`, where the full invoice is generated.
   - You will see the total amount, SGST, CGST, and the amount in words.
   - You can then download the invoice as a **PDF** or **image** file.

---

## Setup Instructions

### 1. Download the Files

- Download all the necessary files from the project directory.

### 2. Customize Your Template

- Open `script.js` in your code editor.
- Modify the following variables to reflect your company’s details:
  - **Company Name**: Replace `{your company}` with your company’s name.
  - **Bank Details**: Update the bank information, if required.
  - **GST Information**: Ensure the GST rates are set correctly for your business.

### 3. Run the Application

- Save all files after making your changes.
- Open `invoiceform.html` in your browser (you can run it on your local server or open it directly in the browser).
- If running it locally, make sure to access it through `http://localhost:5500/invoiceform.html`.

### 4. Fill in the Form

- Enter the buyer’s name, address, and contact information.
- Add product details: name, rate, quantity, and GST rate.
- Optionally, input an **HSN Code** or **HSN Description** to auto-populate the corresponding field.

### 5. Submit the Form

- After entering the details, click on the **Submit** button to generate the invoice.
- You will be redirected to a page where the invoice is displayed with all the calculations.

### 6. Download the Invoice

- After the invoice is displayed, you have the option to download the invoice as either:
  - **PDF**
  - **Image**

---

## How to Customize

### Customizing the Company Information:
- To change the company name, address, or bank details, open `script.js` and find the relevant sections to update the company’s details.

### Adding or Modifying Products:
- In the form, you can dynamically add products with their names, GST rates, and quantities.
- The GST calculations will be handled automatically based on the input.

### Modify the JSON File:
- The HSN Codes and descriptions are stored in a JSON file. You can import an **Excel file** to JSON format and replace the existing one to update or add new products.
  
---

## Technologies Used

- **HTML**: Used for structuring the form and the invoice template.
- **CSS**: For styling the invoice and form.
- **JavaScript**: For handling form inputs, performing calculations, and generating dynamic content (including the words-to-number conversion and HSN code lookup).
- **JSON**: Used for storing HSN codes and descriptions.

---

## Troubleshooting

- **Not displaying the invoice correctly**: Ensure that your browser’s developer tools console doesn’t show any JavaScript errors. If there’s an issue, check that all fields are filled out correctly.
- **GST Calculation is incorrect**: Double-check the input values (rate, quantity, GST rate) and ensure that the GST rate is divided correctly into SGST and CGST.
- **HSN Lookup not working**: Make sure that the HSN code and description JSON file is correctly formatted and linked in your HTML file.

---

## Contact

For any questions or suggestions, feel free to contact me at [adepuvishal18@gmail.com].

---

### **Enjoy creating your invoices!** 🚀

