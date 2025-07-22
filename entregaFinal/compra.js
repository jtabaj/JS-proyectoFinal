document.addEventListener("DOMContentLoaded", function () {
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    const total = localStorage.getItem('total') || 0;
    const totalNumerico = parseFloat(total) || 0;
    const totalFormateado = totalNumerico.toFixed(0);

    const resumenDiv = document.getElementById("detalle");

    let resumenTextoHTML = "";

    console.log("Resumen de compra:", productos, "Total:", totalFormateado);

    for (let i = 0; i < productos.length; i++) {
        const p = productos[i];
        resumenTextoHTML += `${p.cantidad} de ${p.nombre}: $${parseFloat(p.precioUnitario * p.cantidad).toFixed(0)}<br>`;
    }

    resumenTextoHTML += `<br><strong>Total a pagar: $${totalFormateado}</strong>`;
    resumenDiv.innerHTML = resumenTextoHTML;

    function enviarFormulario(event) {
        event.preventDefault();

        const nombreContacto = document.getElementById('nombre').value.trim();
        const emailContacto = document.getElementById('contactoEmail').value.trim();
        const telefonoContacto = document.getElementById('telefono').value.trim();

        if (!nombreContacto || !emailContacto) {
            alert("Por favor, completa con tu nombre completo y un email antes de enviar.");
            return;
        }

        let detallesCarritoParaEnvio = '';
        for (let i = 0; i < productos.length; i++) {
            const productoActual = productos[i];
            detallesCarritoParaEnvio += `${productoActual.nombre} - $${parseFloat(productoActual.precioUnitario).toFixed(0)}\n`;
        }

        document.getElementById('carritoData').value = detallesCarritoParaEnvio;
        document.getElementById('totalCarrito').value = `$${totalFormateado}`;

        // Enviar el formulario
        document.getElementById('formulario').submit();
    }

    const botonEnviar = document.getElementById('botonEnviar');

    if (botonEnviar) {
        botonEnviar.addEventListener('click', enviarFormulario);
    } else {
        console.warn("ADVERTENCIA: No se encontró el botón con ID 'botonEnviar'.");
    }
});