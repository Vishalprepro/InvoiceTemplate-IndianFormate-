 window.onload = function () {
            // Parse the query string to get the data object
            const params = new URLSearchParams(window.location.search);
            const dataString = params.get('data');

            if (!dataString) {
                console.error('No data found in the query string.');
                return;
            }

            let data;
            try {
                data = JSON.parse(decodeURIComponent(dataString));
            } catch (error) {
                console.error('Failed to parse JSON data:', error);
                return;
            }

           // console.log('Parsed Data:', data);

            function createTable(data) {
                const tableContainer = document.getElementById('tableContainer');
                

                const invoiceNo = data[`invoiceNo`];

                const kppTable = document.createElement('table');
                kppTable.classList.add('kpp');

                const row1 = document.createElement('tr');
                const cell1 = document.createElement('td');
                cell1.setAttribute('colspan', '2');
                cell1.style.height = '40px';
                cell1.style.textAlign = 'left';
                cell1.style.verticalAlign = 'top';
                cell1.innerHTML = '<b>YourCompanyDetails</b>';
                row1.appendChild(cell1);
                kppTable.appendChild(row1);

                const row2 = document.createElement('tr');
                const cell2 = document.createElement('td');
                cell2.style.height = '40px';
                cell2.style.background = 'white';
                cell2.style.textAlign = 'left';
                cell2.style.verticalAlign = 'top';
                cell2.innerHTML = `Buyer (Bill to)<br><strong>${data.name}</strong><br>${data.address}<br><b>GSTIN/UIN &nbsp;&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;:${data. GSTIN}</b><br>State Name&nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;   :&nbsp;${data.statename},&nbsp; Code &nbsp; :&nbsp; ${data.statecode}`;
                row2.appendChild(cell2);
                kppTable.appendChild(row2);

                const kpp2Table = document.createElement('table');
                kpp2Table.classList.add('kpp2');

                const row3Data = [
                    [`Invoice No. &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;e-Way Bill No.<br><b>${invoiceNo || ''}</b>`, `Dated<br><b>${data.todaysDate || ''}</b><br>`],
                    [`Delivery Note<br>${data.delivery || ''}`, `Mode/Terms of Payment<br>${data.paymentMode || ''}`],
                    [`Reference No. & Date.<br>${data.referenceNo || ''}`, `Other References<br>${data.otherReferences || ''}`],
                    [`Buyer's Order No.<br>${data.orderNo || ''}`, `Dated<br>${data.onDate || ''}`],
                    [`Dispatch Doc No.<br>${data.dispatchDocNo || ''}`, `Delivery Note Date<br>${data.deliveryNoteDate || ''}`],
                    [`Dispatch through<br>${data.dispatchThrough || ''}`, `Destination<br>${data.destination || ''}`],
                    [`Bill of Lading/LR-RR No.<br>${data.billOfLading || ''}`, `Motor Vehicle No.<br>${data.motorVehicleNo || ''}`],
                    [`Terms of Delivery<br><br><br>${data.terms || ''}`]
                ];

                row3Data.forEach(rowData => {
                    const row = document.createElement('tr');
                    rowData.forEach((cellText, index) => {
                        const cell = document.createElement('td');
                        cell.innerHTML = cellText;
                        cell.style.textAlign = 'left';
                        row.appendChild(cell);
                    });
                    kpp2Table.appendChild(row);
                });

                tableContainer.appendChild(kppTable);
                tableContainer.appendChild(kpp2Table);
            }

            
    
            function addRows(data) {
                const contentDiv = document.getElementById('content');
                const products = data.products;
                const tableBody = document.querySelector('#dataTable tbody');
                tableBody.innerHTML = '';

                let totalQuantity = 0;
                let totalAmount = 0;
                let rateValues = '';
                let amounts = '';
                let cgstRates = '';
                let cgstAmounts = [];
                let sgstRates = '';
                let sgstAmounts = [];
                let discgstAmount = 0;
                let dissgstAmount = 0;
                let displaycgstAmounts = 0;
                let taxableValues = "";
                let totaltaxableValue = 0;
                //let productAmounts = {};
                let index = 0;
                let totalamount2=0;
                const allProducts = [];
                let justTotal = [];
                let taxableValue = [];
                //const groupedProducts = [];
                
                //const gstGroups = {};
                for(let i=0;i<products.length;i++) {
                     const product = products[i];
                    allProducts.push({ ...product });
                }
                const uniqueGSTRatesMap = new Map();
                const cgstAmountDisplay = document.getElementById('cgstAmountDisplay');

                for (let i = 0; i < allProducts.length; i++) {
                    const product = allProducts[i];
                    const gstRate = product.gstRate;
                    const amount = product.rate * product.quantity;

                    if (!uniqueGSTRatesMap.has(gstRate)) {
                        uniqueGSTRatesMap.set(gstRate, amount); // Store the amount for the unique GST rate
                    } else {
                        const existingAmount = uniqueGSTRatesMap.get(gstRate);
                        uniqueGSTRatesMap.set(gstRate, existingAmount + amount); // Add to the existing amount for the same GST rate
                    }
                }

                const uniqueGSTRatesArray = Array.from(uniqueGSTRatesMap, ([gstRate, amount]) => ({ gstRate, amount }));
                 uniqueGSTRatesArray.forEach(item => {
                    const cgstRate = item.gstRate / 2;
                    const sgstRate = item.gstRate / 2;
                    const cgstAmount = (cgstRate / 100) * item.amount;
                    const sgstAmount = (sgstRate / 100) * item.amount;
                    const cgstsgst = cgstAmount + sgstAmount; // Calculate cgstsgst here

                     taxableValue.push(cgstsgst);
                    

                    cgstRates += `${cgstRate}%<br>`;
                    sgstRates += `${sgstRate}%<br>`;
                    cgstAmounts.push(formatNumberWithCommas(cgstAmount.toFixed(2)));
                    sgstAmounts.push(formatNumberWithCommas(sgstAmount.toFixed(2)));
                     justTotal.push(formatNumberWithCommas(item.amount.toFixed(2)));
                     discgstAmount += parseFloat(cgstAmount);
                     dissgstAmount += parseFloat(sgstAmount);
                      
                });
             const reversedTaxableValues = [];
                for (let i = taxableValue.length - 1; i >= 0; i--) {
                    const cgstsgst = taxableValue[i];
                    reversedTaxableValues.push(formatNumberWithCommas(cgstsgst.toFixed(2)));
                    totaltaxableValue += cgstsgst;
                }

                // Join the reversedTaxableValues array in reverse order to get taxableValues in reverse
                taxableValues = reversedTaxableValues.reverse().join('<br>');

                

                    
                products.forEach((product, index) => {
                    const row = document.createElement('tr');
                    row.className = 'no-upper-border'; // Apply class to remove upper border

                    const sno = index + 1;
                    const description = product.description;
                    const hsn = product.hsn;
                    const gst = product.gstRate;
                    const quantity = product.quantity;
                    const rate = parseFloat(product.rate).toFixed(2);
                    const amount = (parseFloat(quantity) * parseFloat(rate)).toFixed(2);
                    
                    
                      


                    const cells = [sno, description,`${quantity} pcs`,  rate, hsn ,`${gst}%`, amount];
                 // const cells = [sno, description, hsn, `${gst}%`,`${quantity} pcs` , rate, `pcs `, disc, amount];

                    cells.forEach((cellValue, i) => {
                        const cell = document.createElement('td');
                        if (i === 1) { // Description cell
                            const descriptionDiv = document.createElement('div');
                            descriptionDiv.className = 'description-cell';
                            descriptionDiv.innerHTML = cellValue;
                            cell.appendChild(descriptionDiv);
                        } else {
                            cell.textContent = cellValue;
                            if (i === 2) { // Quantity cell
                                totalQuantity += parseFloat(cellValue) || 0;
                                cell.innerHTML = `<b>${cellValue}</b>`;
                            }
                            if (i === 3) { // Rate cell
                                rateValues += `${cellValue}`;
                            }
                            if (i === 6) { // Amount cell
                                totalAmount += parseFloat(cellValue) || 0;
                                amounts += `${cellValue}<br>`;
                                cell.innerHTML = `<b>${formatNumberWithCommas(cellValue)}</b>`;
                            }
                        }
                        row.appendChild(cell);
                    });

                    tableBody.appendChild(row);
                    index++;
                });

                // Add a row for the total amount
                const totalAmountRow = document.createElement('tr');
                totalAmountRow.className = 'no-upper-border'; // Apply class to remove upper border
                for (let i = 0; i < 9; i++) {
                    const cell = document.createElement('td');
                    if (i === 6) { // Amount column
                        cell.innerHTML = `<hr>${formatNumberWithCommas(totalAmount.toFixed(2))}`; // Differentiating total amount with a horizontal line
                    }
                    totalAmountRow.appendChild(cell);
                }
                tableBody.appendChild(totalAmountRow);

                // Add a row for CGST and SGST in the second column
                const cgstSgstRow = document.createElement('tr');
                cgstSgstRow.className = 'no-upper-border-for-taxes'; // Apply class to remove upper border
                for (let i = 0; i < 9; i++) {
                    const cell = document.createElement('td');
                    if (i === 1) { // Second column
                        cell.innerHTML = `<div class="taxes">CGST<br>SGST<br><br></div>`;
                    }
                    if (i === 6) { // Amount column
                        cell.innerHTML = `<div>${formatNumberWithCommas(discgstAmount.toFixed(2))}<br>${formatNumberWithCommas(dissgstAmount.toFixed(2))}</div>`;
                    }
                    cell.style.border = '1px solid black';
                    cgstSgstRow.appendChild(cell);
                }
                tableBody.appendChild(cgstSgstRow);

                // Add a row for the total quantity and amount summary
                let allovertotal= totalAmount + totaltaxableValue;
                const totalRow = document.createElement('tr');
                totalRow.className = 'summary-row';
                for (let i = 0; i < 9; i++) {
                    const cell = document.createElement('td');
                    if (i === 1) { // Description column
                        cell.textContent = 'Total';
                    }
                    if (i === 2) { // Quantity column
                        cell.innerHTML = `<b>${formatNumberWithCommas(totalQuantity)} pcs</b>`;
                    }
                    if (i === 6) { // Amount column
                        cell.innerHTML = `<b>₹ ${formatNumberWithCommas(allovertotal.toFixed(2))}</b>`;
                    }
                    totalRow.appendChild(cell);
                }
                tableBody.appendChild(totalRow);

                const totalAmountWords = numberToWords(allovertotal);

                const newTable = document.createElement('table');
                newTable.innerHTML = `
                <tbody>
                    <tr>
                        <td colspan="9" style="border: none; text-align: left;">Amount Chargeable (in words)</td>
                        <td colspan="9" style="border: none; text-align: right;">E. & O.E</td>
                    </tr>
                    <tr>
                        <td colspan="9" style="border: none; text-align: left;"><b>INR&nbsp;${totalAmountWords}</b></td>
                    </tr>
                </tbody>
            `;
                //document.body.appendChild(newTable);
                contentDiv.appendChild(newTable);

                
                


                const newtable2 = document.createElement('table');
                newtable2.innerHTML = `
                <thead>
                    <tr>
                        <th rowspan="2" style="width:60%; background: none; text-align:right; ">Taxable<br> Value</th>
                        <th colspan="2" style="background: none;">Central Tax</th>
                        <th colspan="2" style="background: none;">State Tax</th>
                        <th rowspan="2" style="background: none;">Total Tax Amount</th>
                    </tr>
                    <tr>
                        <th style="background: none;">Rate</th>
                        <th style="background: none;">Amount</th>
                        <th style="background: none;">Rate</th>
                        <th style="background: none;">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><!--central table-->
                        <td style="text-align:right;">${justTotal.join('<br>')}</td>
                        <td>${cgstRates.slice(0, -2)}</td><!--cgstrate table-->
                        <td>${cgstAmounts.join('<br>')}</td><!--cgstAmount table-->
                        <td>${sgstRates.slice(0, -2)}</td>
                        <td>${sgstAmounts.join('<br>')}</td>
                        <td>${taxableValues}</td>
                    </tr>
                    <tr>
                        <td style="text-align:right;"><b>Total:&nbsp;${formatNumberWithCommas(totalAmount.toFixed(2))}</b></td>
                        <td>&nbsp;</td>
                        <td><b>${formatNumberWithCommas(discgstAmount.toFixed(2))}</b></td>
                        <td>&nbsp;</td>
                        <td><b>${formatNumberWithCommas(dissgstAmount.toFixed(2))}</b></td>
                        <td><b>${formatNumberWithCommas(totaltaxableValue.toFixed(2))}</b></td>
                    </tr>
                </tbody>
            `;
                const style = document.createElement('style');
                style.textContent = `
                table, th, td {
                    border: 1px solid black;
                    border-collapse: collapse;
                }
                th, td {
                    padding: 8px;
                    text-align: center;
                }
            `;
                document.head.append(style);
                //document.body.appendChild(newtable2);
                contentDiv.appendChild(newtable2);
                 
                const newtable1 = document.createElement('table');
                newtable1.className = 'bank-details';
                newtable1.innerHTML = `
                <thead style="background: none;">
                    <tr>
                    </tr>
                    <tr>
                        <td style="width:5000px; border:none; text-align:left; background: none;">Tax Amount (in words):&nbsp; <b>INR &nbsp; ${totalAmountWords}</b></td>
                    </tr>
                    <tr>
                        <th style="border:none; background-color:none; color:none; background: none;">&nbsp;</th>
                    </tr>
                    <tr>
                        <td style="border:none;">
                            <th style="border:none; text-align:left; background: none;">Company’s Bank Details</th>
                        </td>
                    </tr>
                    <tr>
                        <td style="border:none;">
                            <th style="border:none; background: none; text-align:left;">A/c Holder’s Name&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;{yourcompanyname} </th>
                        </td>
                    </tr>
                    <tr>
                        <td style="border:none;">
                            <th style="border:none; background: none; text-align:left;">Bank Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {yourbankname}</th>
                        </td>
                    </tr>
                    <tr>
                        <td style="border:none;">
                            <th style="border:none;  background: none; text-align:left;">A/c&nbsp;No.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {yourcomapnybannumber}</th>
                        </td>
                    </tr>
                    <tr>
                        <td style="border:none;">
                            <th style="border:none; background: none; text-align:left;">Branch & IFS Code&nbsp;&nbsp;&nbsp;:{yourbankIFSnumber}</th>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr class="declaration">
                        <td style="border:none; text-align:left; background: none;">
                            <span style="border-bottom: 1px solid black; verticalAlign = 'bottom';">Declaration</span>
                            <div style="text-align:left; verticalAlign = 'bottom';">We declare that this invoice shows the actual price of the</div>
                            <div style="text-align:left; verticalAlign = 'bottom';">goods described and that all particulars are true and correct.</div>
                        </td>
                        <td  class="signature">
                            <div style="font-weight:bold; margin-bottom: 10px; ">for {nameof your company}</div>
                            <img src="" style="width: 30%; height: 50%; margin-bottom: 5px;"><!--your signature-->
                            <div style=" text-align:center;">
        Authorised Signatory</div>
        </td>
                        
                    </tr>
                </tbody>
            `;
               // document.body.appendChild(newtable1);
                contentDiv.appendChild(newtable1);

            }

            function formatNumberWithCommas(x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }

            function numberToWords(number) {
    const a = [
        '', 'One', 'Two', 'Three', 'Four',
        'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven',
        'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
        'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const b = [
        '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty',
        'Seventy', 'Eighty', 'Ninety'
    ];

    const convertMillions = num => {
        if (num >= 1000000) {
            return convertMillions(Math.floor(num / 1000000)) + " Million " + convertThousands(num % 1000000);
        } else {
            return convertThousands(num);
        }
    };

    const convertThousands = num => {
        if (num >= 1000) {
            return convertThousands(Math.floor(num / 1000)) + " Thousand " + convertHundreds(num % 1000);
        } else {
            return convertHundreds(num);
        }
    };

    const convertHundreds = num => {
        if (num > 99) {
            return a[Math.floor(num / 100)] + " Hundred " + convertTens(num % 100);
        } else {
            return convertTens(num);
        }
    };

    const convertTens = num => {
        if (num < 20) {
            return a[num];
        } else {
            return b[Math.floor(num / 10)] + " " + a[num % 10];
        }
    };

    // Split number into rupees and paisa
    const parts = number.toFixed(2).split(".");
    const rupees = parseInt(parts[0], 10);
    const paisa = parseInt(parts[1], 10);

    let rupeesInWords = convertMillions(rupees);
    let paisaInWords = convertTens(paisa);

    return rupeesInWords + " Rupees " + (paisa > 0 ? paisaInWords + " Paisa" : "");
}

            // Call the functions
            createTable(data);
            addRows(data);

        const button = document.createElement('button');
        button.innerText = 'Download Image';
        button.id = 'downloadBtn';
        document.body.appendChild(button);

        button.addEventListener('click', function () {
            const element = document.getElementById('content');

            // Set a higher scale for better quality
            html2canvas(element, { useCORS: true, allowTaint: false, scale: 4 }).then(canvas => {
                // Increase the width of the image
                const desiredWidth = 2000; // Change this value to the desired width
                const scaleFactor = desiredWidth / canvas.width;
                const scaledCanvas = document.createElement('canvas');
                scaledCanvas.width = desiredWidth;
                scaledCanvas.height = canvas.height * scaleFactor;
                const ctx = scaledCanvas.getContext('2d');

                // Enable image smoothing for better quality
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                ctx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);

                const link = document.createElement('a');
                link.download = 'content.jpg';
                link.href = scaledCanvas.toDataURL('image/jpeg', 1.0); // Use maximum quality setting
                link.click();
            }).catch(err => {
                console.error('Error generating image:', err);
            });
        });

        const buttonPDF = document.createElement('button');
        buttonPDF.innerText = 'Download PDF';
        buttonPDF.id = 'downloadPDFBtn';
        document.body.appendChild(buttonPDF);

        buttonPDF.addEventListener('click', function () {
            const element = document.getElementById('content');

            // Increase the font size before capturing
            element.style.fontSize = '18pt';

            html2canvas(element, { useCORS: true, allowTaint: false, scale: 2 }).then(canvas => {
                const imgData = canvas.toDataURL('image/jpeg', 0.98);

                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4'); // A4 size PDF
                const pdfWidth = 210; // A4 width in mm
                const pdfHeight = 297; // A4 height in mm

                // Calculate the aspect ratio and adjust height accordingly
                const imgProps = pdf.getImageProperties(imgData);
                const imgWidth = pdfWidth - 20; // Add 10mm padding on each side
                const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

                // Adjust the height if it exceeds the page height
                let adjustedHeight = imgHeight;
                if (imgHeight > pdfHeight - 20) { // Consider the padding for height
                    adjustedHeight = pdfHeight - 20;
                }

                const xOffset = 10; // 10mm padding from the left
                const yOffset = 10; // 10mm padding from the top

                pdf.addImage(imgData, 'JPEG', xOffset, yOffset, imgWidth, adjustedHeight);
                pdf.save('content.pdf');

                // Revert the font size back to its original state
                element.style.fontSize = '';
            }).catch(err => {
                console.error('Error generating PDF:', err);
            });
        });


        }