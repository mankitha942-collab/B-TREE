// =====================================================
// AVL TREE IMPLEMENTATION
// =====================================================

class AVLNode {

    constructor(stock) {

        this.stock = stock;

        this.left = null;

        this.right = null;

        this.height = 1;
    }
}


class AVLTree {

    constructor() {

        this.root = null;
    }


    // Get height
    getHeight(node) {

        if (node === null) {
            return 0;
        }

        return node.height;
    }


    // Get balance factor
    getBalance(node) {

        if (node === null) {
            return 0;
        }

        return (
            this.getHeight(node.left) -
            this.getHeight(node.right)
        );
    }


    // Update height
    updateHeight(node) {

        node.height =
            1 +
            Math.max(
                this.getHeight(node.left),
                this.getHeight(node.right)
            );
    }


    // Right rotation
    rotateRight(y) {

        const x = y.left;

        const T2 = x.right;

        x.right = y;

        y.left = T2;

        this.updateHeight(y);

        this.updateHeight(x);

        return x;
    }


    // Left rotation
    rotateLeft(x) {

        const y = x.right;

        const T2 = y.left;

        y.left = x;

        x.right = T2;

        this.updateHeight(x);

        this.updateHeight(y);

        return y;
    }


    // Insert stock
    insert(node, stock) {

        if (node === null) {

            return new AVLNode(stock);
        }


        // Sort by price
        if (stock.price < node.stock.price) {

            node.left =
                this.insert(node.left, stock);

        } else {

            node.right =
                this.insert(node.right, stock);
        }


        // Update height
        this.updateHeight(node);


        // Check balance
        const balance =
            this.getBalance(node);


        // Left Left
        if (
            balance > 1 &&
            stock.price < node.left.stock.price
        ) {

            return this.rotateRight(node);
        }


        // Right Right
        if (
            balance < -1 &&
            stock.price >= node.right.stock.price
        ) {

            return this.rotateLeft(node);
        }


        // Left Right
        if (
            balance > 1 &&
            stock.price >= node.left.stock.price
        ) {

            node.left =
                this.rotateLeft(node.left);

            return this.rotateRight(node);
        }


        // Right Left
        if (
            balance < -1 &&
            stock.price < node.right.stock.price
        ) {

            node.right =
                this.rotateRight(node.right);

            return this.rotateLeft(node);
        }


        return node;
    }


    // Public insert function
    add(stock) {

        this.root =
            this.insert(this.root, stock);
    }


    // Find minimum
    findMin(node) {

        let current = node;

        while (current.left !== null) {

            current = current.left;
        }

        return current;
    }


    // Find maximum
    findMax(node) {

        let current = node;

        while (current.right !== null) {

            current = current.right;
        }

        return current;
    }


    // In-order traversal
    inOrder(node, result = []) {

        if (node !== null) {

            this.inOrder(node.left, result);

            result.push(node.stock);

            this.inOrder(node.right, result);
        }

        return result;
    }


    // Get all stocks sorted by price
    getSortedStocks() {

        return this.inOrder(this.root);
    }


    // Get cheapest
    getCheapest() {

        if (this.root === null) {
            return null;
        }

        return this.findMin(this.root).stock;
    }


    // Get most expensive
    getMostExpensive() {

        if (this.root === null) {
            return null;
        }

        return this.findMax(this.root).stock;
    }


    // Get median
    getMedian() {

        const stocks =
            this.getSortedStocks();

        if (stocks.length === 0) {
            return null;
        }

        const middle =
            Math.floor(stocks.length / 2);

        if (stocks.length % 2 === 1) {

            return stocks[middle].price;

        } else {

            return (
                stocks[middle - 1].price +
                stocks[middle].price
            ) / 2;
        }
    }
}


// =====================================================
// STOCK DATA
// =====================================================

let stocks = [

    {
        symbol: "AAPL",
        name: "Apple Inc.",
        price: 227.50,
        previousPrice: 226.80
    },

    {
        symbol: "TSLA",
        name: "Tesla Inc.",
        price: 248.20,
        previousPrice: 250.10
    },

    {
        symbol: "MSFT",
        name: "Microsoft",
        price: 415.70,
        previousPrice: 412.90
    },

    {
        symbol: "AMZN",
        name: "Amazon",
        price: 188.40,
        previousPrice: 187.20
    },

    {
        symbol: "GOOGL",
        name: "Alphabet",
        price: 164.30,
        previousPrice: 163.80
    },

    {
        symbol: "NVDA",
        name: "NVIDIA",
        price: 138.60,
        previousPrice: 136.90
    },

    {
        symbol: "META",
        name: "Meta Platforms",
        price: 572.40,
        previousPrice: 568.20
    }

];


// =====================================================
// BUILD AVL TREE
// =====================================================

let avlTree = new AVLTree();


function rebuildTree() {

    avlTree = new AVLTree();

    stocks.forEach(stock => {

        avlTree.add(stock);

    });
}


// =====================================================
// DISPLAY STOCKS
// =====================================================

function renderStocks() {

    rebuildTree();

    const table =
        document.getElementById("stockTable");

    table.innerHTML = "";


    const sortedStocks =
        avlTree.getSortedStocks();


    sortedStocks.forEach(stock => {

        const change =
            stock.price -
            stock.previousPrice;


        const percentage =
            (change /
                stock.previousPrice) *
            100;


        const direction =
            change >= 0
                ? "up"
                : "down";


        const arrow =
            change >= 0
                ? "▲"
                : "▼";


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td class="symbol">
                ${stock.symbol}
            </td>

            <td class="company">
                ${stock.name}
            </td>

            <td class="price">
                $${stock.price.toFixed(2)}
            </td>

            <td class="change ${direction}">

                ${arrow}
                ${Math.abs(change).toFixed(2)}

                (${Math.abs(percentage).toFixed(2)}%)

            </td>

            <td>
                ${getStockHeight(stock)}
            </td>

            <td>

                <button
                    class="delete-btn"
                    onclick="deleteStock('${stock.symbol}')"
                >
                    Delete
                </button>

            </td>

        `;

        table.appendChild(row);

    });


    updateStatistics();
}


// =====================================================
// FIND AVL NODE HEIGHT FOR STOCK
// =====================================================

function getStockHeight(stock) {

    function search(node) {

        if (node === null) {
            return 0;
        }


        if (node.stock.symbol === stock.symbol) {

            return node.height;
        }


        const left =
            search(node.left);

        if (left !== 0) {
            return left;
        }


        return search(node.right);
    }

    return search(avlTree.root);
}


// =====================================================
// UPDATE STATISTICS
// =====================================================

function updateStatistics() {

    const cheapest =
        avlTree.getCheapest();

    const expensive =
        avlTree.getMostExpensive();

    const median =
        avlTree.getMedian();


    if (cheapest) {

        document.getElementById(
            "cheapest"
        ).textContent =
            "$" +
            cheapest.price.toFixed(2);

        document.getElementById(
            "cheapestName"
        ).textContent =
            cheapest.symbol;
    }


    if (expensive) {

        document.getElementById(
            "expensive"
        ).textContent =
            "$" +
            expensive.price.toFixed(2);

        document.getElementById(
            "expensiveName"
        ).textContent =
            expensive.symbol;
    }


    if (median !== null) {

        document.getElementById(
            "median"
        ).textContent =
            "$" +
            median.toFixed(2);
    }


    document.getElementById(
        "stockCount"
    ).textContent =
        stocks.length;
}


// =====================================================
// SIMULATE LIVE PRICE UPDATE
// =====================================================

function updatePrices() {

    stocks.forEach(stock => {

        stock.previousPrice =
            stock.price;


        // Random price movement
        const movement =
            (Math.random() - 0.5) *
            4;


        stock.price += movement;


        // Prevent negative price
        if (stock.price < 1) {

            stock.price = 1;
        }


        stock.price =
            Number(
                stock.price.toFixed(2)
            );

    });


    renderStocks();
}


// =====================================================
// ADD NEW STOCK
// =====================================================

function addStock() {

    const symbol =
        document
            .getElementById("symbolInput")
            .value
            .trim()
            .toUpperCase();


    const name =
        document
            .getElementById("nameInput")
            .value
            .trim();


    const price =
        Number(
            document
                .getElementById("priceInput")
                .value
        );


    if (
        !symbol ||
        !name ||
        !price ||
        price <= 0
    ) {

        alert(
            "Please enter valid stock details."
        );

        return;
    }


    const exists =
        stocks.some(
            stock =>
                stock.symbol === symbol
        );


    if (exists) {

        alert(
            "This stock already exists."
        );

        return;
    }


    stocks.push({

        symbol: symbol,

        name: name,

        price: price,

        previousPrice: price

    });


    document.getElementById(
        "symbolInput"
    ).value = "";


    document.getElementById(
        "nameInput"
    ).value = "";


    document.getElementById(
        "priceInput"
    ).value = "";


    renderStocks();
}


// =====================================================
// DELETE STOCK
// =====================================================

function deleteStock(symbol) {

    stocks =
        stocks.filter(
            stock =>
                stock.symbol !== symbol
        );


    renderStocks();
}


// =====================================================
// INITIAL RENDER
// =====================================================

renderStocks();


// =====================================================
// AUTOMATIC REAL-TIME SIMULATION
// =====================================================

// Update every 3 seconds

setInterval(() => {

    updatePrices();

}, 3000);
