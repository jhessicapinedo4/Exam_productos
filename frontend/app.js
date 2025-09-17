const API_URL = window.location.origin + "/api/productos";

// Elementos del DOM
const form = document.getElementById("productoForm");
const tabla = document.getElementById("tablaProductos");
const productoIdInput = document.getElementById("productoId");
const formTitle = document.getElementById("form-title");
const btnCancel = document.getElementById("btnCancel");
const searchInput = document.getElementById("searchInput");

// Modal
const modal = document.getElementById("modalProducto");
const spanClose = document.querySelector(".close");
const verNombre = document.getElementById("verNombre");
const verDescripcion = document.getElementById("verDescripcion");
const verPrecio = document.getElementById("verPrecio");
const verStock = document.getElementById("verStock");
const verCategoria = document.getElementById("verCategoria");

// Cargar productos al inicio
document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
  setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
  // Cerrar modal
  spanClose.onclick = () => { modal.style.display = "none"; };
  window.onclick = (e) => { if(e.target == modal) modal.style.display = "none"; };
  
  // Crear o actualizar producto
  form.addEventListener("submit", handleFormSubmit);
  
  // Cancelar edición
  btnCancel.addEventListener("click", resetForm);
  
  // Búsqueda en tiempo real
  searchInput.addEventListener("input", buscarProductos);
}

// Manejar envío del formulario
async function handleFormSubmit(e) {
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

  try {
    const res = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto)
    });

    const data = await res.json();
    if(data.success) {
      mostrarNotificacion(productoIdInput.value ? "Producto actualizado correctamente" : "Producto agregado correctamente", "success");
      resetForm();
      cargarProductos();
    } else {
      mostrarNotificacion("Error: " + data.message, "error");
    }
  } catch (error) {
    mostrarNotificacion("Error de conexión: " + error.message, "error");
  }
}

// Resetear formulario
function resetForm() {
  form.reset();
  productoIdInput.value = "";
  formTitle.textContent = "Agregar Producto";
  btnCancel.style.display = "none";
}

// Listar productos
async function cargarProductos() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    tabla.innerHTML = "";
    
    if (data.data && data.data.length > 0) {
      data.data.forEach((p) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${p.nombre}</td>
          <td>S/ ${p.precio.toFixed(2)}</td>
          <td>${p.stock}</td>
          <td>${p.categoria}</td>
          <td>
            <div class="action-buttons">
              <button class="action-btn btn-success" onclick="verProducto('${p._id}')">Ver</button>
              <button class="action-btn btn-warning" onclick="editarProducto('${p._id}')">Editar</button>
              <button class="action-btn btn-danger" onclick="eliminarProducto('${p._id}')">Eliminar</button>
            </div>
          </td>
        `;
        tabla.appendChild(row);
      });
    } else {
      tabla.innerHTML = `
        <tr>
          <td colspan="5" class="no-data">No hay productos registrados</td>
        </tr>
      `;
    }
  } catch (error) {
    tabla.innerHTML = `
      <tr>
        <td colspan="5" class="no-data">Error al cargar los productos</td>
      </tr>
    `;
    mostrarNotificacion("Error de conexión: " + error.message, "error");
  }
}

// Buscar productos
function buscarProductos() {
  const searchTerm = searchInput.value.toLowerCase();
  const rows = tabla.getElementsByTagName("tr");
  
  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    let match = false;
    
    for (let j = 0; j < cells.length - 1; j++) { // Excluir la columna de acciones
      if (cells[j]) {
        const cellText = cells[j].textContent || cells[j].innerText;
        if (cellText.toLowerCase().indexOf(searchTerm) > -1) {
          match = true;
          break;
        }
      }
    }
    
    rows[i].style.display = match ? "" : "none";
  }
}

// Ver producto en modal
async function verProducto(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const data = await res.json();
    
    if(data.success) {
      verNombre.textContent = data.data.nombre;
      verDescripcion.textContent = data.data.descripcion;
      verPrecio.textContent = `S/ ${data.data.precio.toFixed(2)}`;
      verStock.textContent = data.data.stock;
      verCategoria.textContent = data.data.categoria;
      modal.style.display = "block";
    } else {
      mostrarNotificacion("Error: " + data.message, "error");
    }
  } catch (error) {
    mostrarNotificacion("Error de conexión: " + error.message, "error");
  }
}

// Editar producto (cargar datos al formulario)
async function editarProducto(id) {
  try {
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
      
      formTitle.textContent = "Editar Producto";
      btnCancel.style.display = "inline-block";
      
      // Scroll suave al formulario
      document.querySelector('.form-section').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    } else {
      mostrarNotificacion("Error: " + data.message, "error");
    }
  } catch (error) {
    mostrarNotificacion("Error de conexión: " + error.message, "error");
  }
}

// Eliminar producto
async function eliminarProducto(id) {
  if(!confirm("¿Estás seguro de eliminar este producto?")) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    const data = await res.json();
    
    if(data.success) {
      mostrarNotificacion("Producto eliminado correctamente", "success");
      cargarProductos();
    } else {
      mostrarNotificacion("Error: " + data.message, "error");
    }
  } catch (error) {
    mostrarNotificacion("Error de conexión: " + error.message, "error");
  }
}

// Mostrar notificación
function mostrarNotificacion(mensaje, tipo) {
  // Crear elemento de notificación
  const notificacion = document.createElement("div");
  notificacion.className = `notificacion ${tipo}`;
  notificacion.textContent = mensaje;
  
  // Estilos para la notificación
  notificacion.style.position = "fixed";
  notificacion.style.top = "20px";
  notificacion.style.right = "20px";
  notificacion.style.padding = "15px 20px";
  notificacion.style.borderRadius = "5px";
  notificacion.style.color = "white";
  notificacion.style.zIndex = "10000";
  notificacion.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  notificacion.style.opacity = "0";
  notificacion.style.transition = "opacity 0.3s";
  
  if (tipo === "success") {
    notificacion.style.background = "var(--success-color)";
  } else {
    notificacion.style.background = "var(--danger-color)";
  }
  
  document.body.appendChild(notificacion);
  
  // Mostrar con animación
  setTimeout(() => {
    notificacion.style.opacity = "1";
  }, 10);
  
  // Ocultar y eliminar después de 3 segundos
  setTimeout(() => {
    notificacion.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(notificacion);
    }, 300);
  }, 3000);
}