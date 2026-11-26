type Category = "Laptop" | "Mouse" | "Keyboard";

interface Product {
    id: number;
    name: string;
    category: Category;
    price: number;
    stock: number;
    isActive: boolean;
}

interface OrderItem {
    productId: number;
    quantity: number;
}

const products: Product[] = [
  { id: 1, name: "Acer Aspire 15",          category: "Laptop",   price: 15000, stock: 3,  isActive: true },
  { id: 2, name: "ASUS Vivobook 15",        category: "Laptop",   price: 18000, stock: 2,  isActive: true },
  { id: 3, name: "Lenovo IdeaPad 3",        category: "Laptop",   price: 20000, stock: 0,  isActive: true },
  { id: 4, name: "Logitech M331",           category: "Mouse",    price: 500,   stock: 20, isActive: true },
  { id: 5, name: "Logitech M190",           category: "Mouse",    price: 400,   stock: 25, isActive: true },
  { id: 6, name: "เมาส์รุ่นเก่า (เลิกขาย)", category: "Mouse",    price: 300,   stock: 10, isActive: false },
  { id: 7, name: "Logitech K120",           category: "Keyboard", price: 350,   stock: 30, isActive: true },
  { id: 8, name: "Keychron K2",             category: "Keyboard", price: 3000,  stock: 5,  isActive: true },
  { id: 9, name: "Rapoo V500",              category: "Keyboard", price: 1000,  stock: 10, isActive: true },
];

function getAvailableProducts(products: Product[]): Product[] {
    return products.filter((p) => p.isActive && p.stock > 0);
}

function applyDiscountByCategory(
    product: Product[],
    category: Category,
    discountPercent: number
): Product[] {
    if (discountPercent < 0 || discountPercent > 100) {
        throw new Error("discountPercent ต้องอยู่ระหว่าง 0 ถึง 100");
    }

    return products.map((p) =>
        p.category === category
            ? {...p, price: p.price * (1 - discountPercent / 100)}
            : p
    )
};

function calculateInventoryValue(products: Product[]): number {
    return products.reduce((sum, p ) => sum + p.price * p.stock, 0)
}

function summarizeInventoryByCategory(products: Product[]): Record<Category, number> {
    return products.reduce(
        (acc, p) => {
            acc[p.category] += p.price * p.stock;
            return acc;
        },
        { Laptop: 0, Mouse: 0, Keyboard: 0 } as Record<Category, number>
    );
}

function fetchProductById(id: number): Promise<Product> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const product = products.find((p) => p.id === id);

            if (product) {
                resolve(product);
            } else {
                reject(new Error(`ไม่พบสินค้า id ${id}`));
            }
        }, 1000);
    });
}


async function processCustomerOrder(items: OrderItem[]): Promise<void> {
    const succeeded: string[] = [];
    const failed: string[] = [];
    let total = 0;

    for (const item of items) {
        try {
            if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
                throw new Error(
                    `สินค้า id ${item.productId}: quantity ต้องเป็นจำนวนเต็มบวก (ได้ ${item.quantity})`
                );
            }

            const product = await fetchProductById(item.productId);

            if (product.stock < item.quantity) {
                throw new Error(
                    `${product.name}: สต็อกไม่พอ (มี ${product.stock}, สั่งมา ${item.quantity})`
                );
            }


            const subtotal = product.price * item.quantity;
            total = total + subtotal;
            succeeded.push(`${product.name} x${item.quantity} = ${subtotal}`);
        } catch (error) {
            const message = (error as Error).message;
            failed.push(message);
        }
    }

    console.log("ใบเสร็จ");

    console.log("สำเร็จ");
    if (succeeded.length > 0) {
        console.log(succeeded.join("\n"));
    } else {
        console.log("- ไม่มี");
    }

    console.log("ล้มเหลว");
    if (failed.length > 0) {
        console.log(failed.join("\n"));
    } else {
        console.log("- ไม่มี");
    }

    console.log(`ยอดรวม ${total} บาท`)
}

async function runTests() {
    console.log("ปกติ")
    await processCustomerOrder([
        { productId: 1, quantity: 1},
        { productId: 4, quantity: 2},
    ]);
    console.log("ไม่มีจริง");
    await processCustomerOrder([{ productId: 999, quantity: 1}]);

    console.log("เกินที่มีอยู๋")
    await processCustomerOrder([{ productId: 2, quantity: 100}]);

    console.log("เคสติดลบ")
    await processCustomerOrder([
        { productId: 1, quantity: 0 },
        { productId: 1, quantity: -3 },
    ]);

    console.log("สำหรับโจทย์ท้าทาย ข.")
    await processCustomerOrder([
        { productId:1, quantity: 1},
        { productId: 999, quantity: 1},
        { productId: 7, quantity: 2},
    ]);
}

runTests();
//console.log(getAvailableProducts(products).length);
//console.log(applyDiscountByCategory(products, "Laptop", 10)
//    .map((p) => `${p.name} ${p.price}`));
//console.log(products[3]?.price);
//console.log(calculateInventoryValue(products));

//const summary = summarizeInventoryByCategory(products);
//console.log(summary);
//console.log(summary.Laptop + summary.Mouse + summary.Keyboard === calculateInventoryValue(products));

