let productosDB = []; // Variable global para guardar los productos

// Función para mostrar el modal del carrito
function mostrarModalCarrito() {
    const modal = document.getElementById("modal-carrito");
    const listaCarrito = document.getElementById("lista-carrito");
    const totalCarrito = document.getElementById("total-carrito");
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    listaCarrito.innerHTML = ""; // Limpiar lista antes de llenar

    if (carrito.length === 0) {
        listaCarrito.innerHTML = "<p>No hay productos en el carrito.</p>";
        totalCarrito.textContent = "Total: $0.00";
    } else {
        let totalPrecio = 0;
       
        
        const conteoProductos = {};
        carrito.forEach(id => {
            conteoProductos[id] = (conteoProductos[id] || 0) + 1;
        });

        // Mostrar productos únicos con su cantidad y botón de eliminar
        for (const id in conteoProductos) {
            const cantidad = conteoProductos[id];
            const producto = productosDB.find(p => p.id === id); 
            if (!producto) continue; // Si el producto no se encuentra, salta al siguiente
           
            const precioUnitario = parseFloat(producto.price);
            const subtotal = precioUnitario * cantidad;
            totalPrecio += subtotal;
           
            const item = document.createElement("div");
            item.className = "item-carrito";
            item.innerHTML = `
                <span><strong>${producto.title}</strong> x ${cantidad}</span>
                <span class="item-precio">$${subtotal.toFixed(0)}</span>
                <button class="eliminar-uno" data-id="${producto.id}">-</button>
            `;
            listaCarrito.appendChild(item);
        }
       
        totalCarrito.textContent = `Total: $${totalPrecio.toFixed(0)}`;
    }

    modal.style.display = "block";
    
    document.querySelectorAll(".eliminar-uno").forEach(button => {
        button.addEventListener("click", function() {
            const idAEliminar = this.dataset.id;
            eliminarDelCarrito(idAEliminar);
        });
    });
}

// Función para cerrar el modal
function cerrarModal() {
    document.getElementById("modal-carrito").style.display = "none";
}

// Función para manejar clicks fuera del modal
function manejarClicksModal(event) {
    const modal = document.getElementById("modal-carrito");
    if (event.target === modal || event.target.classList.contains("cerrar-modal")) {
        cerrarModal();
    }
}

// Función para actualizar el contador del carrito
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const contador = document.getElementById("contador-carrito");

    if (contador) {
        contador.textContent = carrito.length > 9 ? "9+" : carrito.length;
       
        if (carrito.length > 0) {
            contador.style.display = "flex";
        } else {
            contador.style.display = "none";
        }
    }
}

// Función para agregar productos al carrito
function agregarAlCarrito(idProducto) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.push(idProducto);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
    console.log(`Producto con ID ${idProducto} agregado al carrito.`);
}

// *** NUEVA FUNCIÓN: Eliminar una instancia de un producto del carrito ***
function eliminarDelCarrito(idProducto) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    
    // Encontrar el índice de la primera aparición del producto
    const index = carrito.indexOf(idProducto);

    if (index > -1) {
        carrito.splice(index, 1); // Eliminar solo una ocurrencia
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarContadorCarrito();
        mostrarModalCarrito(); // Vuelve a mostrar el modal para actualizar la lista
        console.log(`Una instancia de ${idProducto} eliminada.`);
    } else {
        console.log(`El producto con ID ${idProducto} no se encontró en el carrito.`);
    }
}


// Función para vaciar el carrito
function vaciarCarrito() {
    localStorage.removeItem("carrito");
    actualizarContadorCarrito();
    cerrarModal();
    console.log("Carrito vaciado.");
}

// Función para preparar y redirigir a la página de pago
function pagar() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        alert("El carrito está vacío. Agrega productos antes de pagar.");
        return;
    }

    const productosCompra = [];
    let totalCompra = 0;

    // Contar la cantidad de cada producto para el pago
    const conteoProductos = {};
    carrito.forEach(id => {
        conteoProductos[id] = (conteoProductos[id] || 0) + 1;
    });

    for (const id in conteoProductos) {
        const cantidad = conteoProductos[id];
        const producto = productosDB.find(p => p.id === id);
        if (producto) {
            productosCompra.push({
                id: producto.id,
                nombre: producto.title,
                precioUnitario: parseFloat(producto.price),
                cantidad: cantidad,
                subtotal: parseFloat(producto.price) * cantidad
            });
            totalCompra += parseFloat(producto.price) * cantidad;
        }
    }

    localStorage.setItem('productos', JSON.stringify(productosCompra));
    localStorage.setItem('total', totalCompra.toFixed(0));

    window.location.href = 'compra.html';
}

// --- Inicialización cuando el DOM está listo ---
document.addEventListener("DOMContentLoaded", () => {
    const productosEnHTML = document.querySelectorAll(".producto"); 
    productosDB = Array.from(productosEnHTML).map(card => {
        return {
            id: card.dataset.id,         
            title: card.dataset.title,   
            price: card.dataset.price,
            image: card.dataset.image    
        };
    });

    console.log("Productos cargados desde HTML:", productosDB);

    const botonesComprar = document.querySelectorAll(".boton-comprar");
    botonesComprar.forEach(button => {
        button.addEventListener("click", function() {
            const productoCard = this.closest(".producto");
            if (productoCard && productoCard.dataset.id) {
                agregarAlCarrito(productoCard.dataset.id);
            }
        });
    });
    
    actualizarContadorCarrito();
       
    document.getElementById("icono-carrito")?.addEventListener("click", mostrarModalCarrito);
    document.getElementById("vaciar-carrito")?.addEventListener("click", vaciarCarrito);
    document.getElementById("pagar")?.addEventListener("click", pagar);
    window.addEventListener("click", manejarClicksModal);
});