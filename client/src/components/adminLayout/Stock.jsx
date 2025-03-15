import React, { useState, useEffect } from 'react';
import { Container, Alert, Form, Row, Col, Button } from 'react-bootstrap';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx'; // Importing the xlsx library for Excel export
import axios from 'axios';

const Stock = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [totalStock, setTotalStock] = useState(0);
    const [apiError, setApiError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterLowStock, setFilterLowStock] = useState(false);
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Fetch stock data on component mount
    useEffect(() => {
        const getItems = async () => {
            try {
                const response = await fetch('http://localhost:7000/item/');

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const data = await response.json();
                setItems(data);
                setFilteredItems(data);
                setTotalStock(data.reduce((acc, item) => acc + (item.stock || 0), 0));
            } catch (error) {
                console.error("Error fetching items:", error);
                setApiError("Failed to fetch items. Please try again.");
            }
        };

        getItems();
    }, []);

    // Filter items based on search and checkbox
    useEffect(() => {
        let filtered = items.filter((item) =>
            item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (filterLowStock) {
            filtered = filtered.filter((item) => isStockLow(item));
        }

        setFilteredItems(filtered);
    }, [searchQuery, filterLowStock, items]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const isStockLow = (item) => {
        const { stock, minimumStock } = item; // Assuming `item` is the full item object
        return Number(stock) <= Number(minimumStock);
    };

    const handleCheckboxChange = () => {
        setFilterLowStock(!filterLowStock);
    };

    const handleEmailSend = async (item) => {
        console.log(item)
        if (!item.supplierEmail) {
            alert("Please enter an email address.");
            return;
        }

        setIsLoading(true);

        try {
            // Send the full data for the selected item in one object
            const payload = {
                supplierEmail: item.supplierEmail,
                supplierName: item.supplierName,
                itemName: item.itemName,
                currentStock: item.stock,
                minimumStock: item.minimumStock,
            };

            await axios.post("http://localhost:7000/api/send-lowStock-mail", payload);
            alert(`Low stock email sent for ${item.itemName}.`);
        } catch (error) {
            console.error("Error sending email:", error);
            alert("Failed to send email. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Function to handle Excel file download
    const handleExcelDownload = () => {
        const ws = XLSX.utils.json_to_sheet(filteredItems.map(item => ({
            "Item Name": item.itemName || 'Unnamed Item',
            "Quantity": item.stock || 'N/A',
            "Minimum Stock": item.minimumStock ?? 'N/A'
        })));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Stock Data");

        // Trigger Excel file download
        XLSX.writeFile(wb, "stock-update.xlsx");
    };

    // Function to handle PDF file download
    const handlePdfDownload = () => {
        const pdf = new jsPDF();
        pdf.setFontSize(22);
        pdf.text("Stock Update Summary", 10, 20);
        pdf.setFontSize(12);
        pdf.text(`Total Stock: ${totalStock}`, 10, 30);

        const headerYPosition = 40;
        pdf.setFontSize(10);
        pdf.text("Item Name", 10, headerYPosition);
        pdf.text("Quantity", 60, headerYPosition);
        pdf.text("Minimum Stock", 120, headerYPosition);

        let rowYPosition = headerYPosition + 10;
        filteredItems.forEach((item) => {
            const isLowStock = isStockLow(item);
            const itemName = item.itemName || 'Unnamed Item';
            const stock = item.stock || 'N/A';
            const minimumStock = item.minimumStock ?? 'N/A';

            pdf.text(itemName, 10, rowYPosition);
            pdf.text(stock.toString(), 60, rowYPosition);
            pdf.text(minimumStock.toString(), 120, rowYPosition);
            rowYPosition += 10;

            if (isLowStock) {
                pdf.setFillColor(248, 215, 218);
                pdf.rect(0, rowYPosition - 8, 210, 10, 'F');
            }
        });

        // Trigger PDF download
        pdf.save("stock-update.pdf");
    };

    return (
        <div className="container-3">
            <Container className="list-container-1 scrollable-list-1">
                <h2 className="text-center mb-4">Stock</h2>

                {/* Email Input and Send Button */}
                <Row>
                    <Col xs='5'></Col>
                    <Col>
                        <Form.Group className="mt-3">
                            <Form.Control
                                type="email"
                                placeholder="Enter email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Button
                            variant="secondary"
                            onClick={handleEmailSend}
                            disabled={isLoading}
                            className="mt-3"
                        >
                            {isLoading ? "Sending..." : "Send Stock Data"}
                        </Button>
                    </Col>
                </Row>

                {/* Search and Filter Controls */}
                <Row style={{ paddingTop: 20 }}>
                    <Col xs='6'>
                        <Form.Group className="mb-4">
                            <Form.Control
                                type="text"
                                placeholder="Search by item name"
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </Form.Group>
                    </Col>
                    <Col>|</Col>
                    <Col xs='4'>
                        <Form.Group className="mb-2">
                            <Form.Check
                                type="checkbox"
                                label="Show only low stock items"
                                checked={filterLowStock}
                                onChange={handleCheckboxChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Error Message */}
                {apiError && <Alert variant="danger">{apiError}</Alert>}

                {/* Table Header */}
                <Row className="table-header pb-2 pt-2">
                    <Col xs={4} className="text-center"><strong>Item Name</strong></Col>
                    <Col xs={4} className="text-center"><strong>Quantity</strong></Col>
                    <Col xs={4} className="text-center"><strong>Minimum Stock</strong></Col>
                </Row>

                {/* Table Data */}
                {filteredItems.length > 0 ? (
                    filteredItems.map((item) => {
                        const isLowStock = isStockLow(item);
                        return (
                            <Row
                                key={item._id}
                                className="table-row"
                                style={{
                                    backgroundColor: isLowStock ? '#f8d7da' : '',
                                    color: isLowStock ? '#721c24' : '',
                                }}
                            >
                                <Col xs={4} className="text-center">{item.itemName || 'Unnamed Item'}</Col>
                                <Col xs={4} className="text-center">{item.stock || 'N/A'}</Col>
                                <Col xs={4} className="text-center">{item.minimumStock ?? 'N/A'}</Col>
                                {isLowStock && (
                                    <Col xs={12} className="text-center mt-2">
                                        <Button
                                            variant="danger"
                                            onClick={() => handleEmailSend(item)}
                                        >
                                            Send Low Stock Mail
                                        </Button>
                                    </Col>
                                )}
                            </Row>
                        );
                    })
                ) : (
                    <Row>
                        <Col colSpan="3" className="text-center">
                            No stock items available.
                        </Col>
                    </Row>
                )}

                {/* Total Stock */}
                <div className="mt-3">
                    <h4>Total Stock: {totalStock}</h4>
                </div>

                {/* PDF and Excel Download Buttons */}
                <Row className="mt-4">
                    <Col>
                        <Button variant="secondary" onClick={handlePdfDownload}>Download PDF</Button>
                    </Col>
                    <Col>
                        <Button variant="secondary" onClick={handleExcelDownload}>Download Excel</Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Stock;
