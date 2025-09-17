const API_URL = "http://localhost:3000/api/productos";

const form = document.getElementById("productoForm");
const tabla = document.getElementById("tablaProductos");
const productoIdInput = document.getElementById("productoId");

// Modal
const modal = document.getElementById("modalProducto");
const spanClose = document.querySelector(".close");
const verNombre = document.getElementById("verNombre");
const verDescripcion = document.getElementById("verDescripcion");
const verPrecio = document.getElementById("verPrecio");
const verStock = document.getElementById("verStock");
const verCategoria = document.getElementById("verCategoria");

// Cargar productos al inicio
document.addEventListener("DOMContentLoaded", cargarProductos);

// Cerrar modal
spanClose.onclick = () => { modal.style.display = "none"; }
window.onclick = (e) => { if(e.target == modal) modal.style.display = "none"; }

// Crear o actualizar producto
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const producto = {
    nombre: document.getElementById("nombre").value,
    descripcion: document.getElementById("descripcion").value,
    precio: parseFloat(document.getElementById("precio").value),
    stock: parseInt(document.getElementById("stock").value),
    categoria: document.getElementById("categoria").value,
  };

  let metodo = "POST";
  let url = API_URL;

  if(productoIdInput.value) {
    metodo = "PUT";
    url += `/${productoIdInput.value}`;
  }

  const res = await fetch(url, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto)
  });

  const data = await res.json();
  if(data.success) {
    alert(productoIdInput.value ? "Producto actualizado" : "Producto agregado");
    form.reset();
    productoIdInput.value = "";
    cargarProductos();
  } else {
    alert("Error: " + data.message);
  }
});

// Listar productos
async function cargarProductos() {
  const res = await fetch(API_URL);
  const data = await res.json();

  tabla.innerHTML = "";
  data.data.forEach((p) => {
    const row = `
      <tr>
        <td>${p.nombre}</td>
        <td>${p.descripcion}</td>
        <td>${p.precio}</td>
        <td>${p.stock}</td>
        <td>${p.categoria}</td>
        <td>
          <button onclick="verProducto('${p._id}')">Ver</button>
          <button onclick="editarProducto('${p._id}')">Editar</button>
          <button onclick="eliminarProducto('${p._id}')">Eliminar</button>
        </td>
      </tr>
    `;
    tabla.innerHTML += row;
  });
}

// Ver producto en modal
async function verProducto(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const data = await res.json();
  if(data.success) {
    verNombre.textContent = data.data.nombre;
    verDescripcion.textContent = data.data.descripcion;
    verPrecio.textContent = data.data.precio;
    verStock.textContent = data.data.stock;
    verCategoria.textContent = data.data.categoria;
    modal.style.display = "block";
  } else {
    alert("Error: " + data.message);
  }
}

// Editar producto (cargar datos al formulario)
async function editarProducto(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const data = await res.json();
  if(data.success) {
    const p = data.data;
    productoIdInput.value = p._id;
    document.getElementById("nombre").value = p.nombre;
    document.getElementById("descripcion").value = p.descripcion;
    document.getElementById("precio").value = p.precio;
    document.getElementById("stock").value = p.stock;
    document.getElementById("categoria").value = p.categoria;
    window.scrollTo({ top: 0, behavior: "smooth" }); // Llevar al formulario
  } else {
    alert("Error: " + data.message);
  }
}

// Eliminar producto
async function eliminarProducto(id) {
  if(!confirm("¿Eliminar este producto?")) return;

  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  const data = await res.json();
  if(data.success) {
    alert("Producto eliminado");
    cargarProductos();
  } else {
    alert("Error: " + data.message);
  }
}


