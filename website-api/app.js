// La URL de tu API de Spring Boot
const API_URL = "http://localhost:8080/api/productos"; 
let todosLosProductos = [];

// ==========================================
// 1. LISTAR: Petición GET al iniciar la página
// ==========================================
async function cargarApp() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error al conectar con la API");
        
        todosLosProductos = await response.json();
        renderizar(todosLosProductos);
    } catch (error) {
        console.error("Error:", error);
        document.getElementById('productos-contenedor').innerHTML = 
            `<div class="alert alert-danger w-100 text-center">Asegúrate de que tu proyecto en NetBeans esté corriendo. No se pudo conectar a la API.</div>`;
    }
}

// ==========================================
// 2. CREAR: Petición POST desde el formulario
// ==========================================
document.getElementById('form-crear-producto').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario

    // Capturamos los datos que escribiste
    const nuevoProducto = {
        title: document.getElementById('input-titulo').value,
        price: parseInt(document.getElementById('input-precio').value),
        stock: parseInt(document.getElementById('input-stock').value),
        image: document.getElementById('input-imagen').value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // Le decimos a Java que enviamos un JSON
            body: JSON.stringify(nuevoProducto)
        });

        if (response.ok) {
            alert("¡Producto publicado con éxito!");
            document.getElementById('form-crear-producto').reset(); // Limpia el formulario
            cargarApp(); // Recargamos la lista para ver el nuevo producto
        }
    } catch (error) {
        alert("Error al guardar el producto.");
    }
});

// ==========================================
// 3. ELIMINAR: Petición DELETE desde el botón
// ==========================================
async function confirmarEliminacion(id) {
    if (confirm("¿Eliminar este producto permanentemente?")) {
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

            if (response.ok) {
                // Borramos la tarjeta de la pantalla visualmente
                const elemento = document.getElementById(`producto-${id}`);
                elemento.remove();
            }
        } catch (error) {
            alert("Error al intentar eliminar el producto.");
        }
    }
}

// ==========================================
// FUNCIONES VISUALES (Renderizado)
// ==========================================
function renderizar(lista) {
    const container = document.getElementById('productos-contenedor');
    container.innerHTML = ''; 

    lista.forEach(product => {
        container.innerHTML += `
            <div class="col-12 col-sm-6 col-md-4 col-lg-3" id="producto-${product.id}">
                <div class="card product-card">
                    <div class="card-img-container">
                        <img src="${product.image}" class="card-img-top" alt="${product.title}">
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h5 class="price-text mb-1">$${product.price.toLocaleString('es-CO', {minimumFractionDigits: 0})}</h5>
                        <p class="stock-text mb-2">Stock: ${product.stock}</p>
                        <p class="card-title text-truncate" title="${product.title}">${product.title}</p>
                        
                        <div class="d-flex gap-2 mt-auto">
                            <button class="btn btn-primary w-100" style="background-color: #3483fa; border: none;">Comprar</button>
                            <button class="btn btn-outline-danger" onclick="confirmarEliminacion(${product.id})">🗑️</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

// Iniciar la app cuando cargue la página
document.addEventListener('DOMContentLoaded', cargarApp);
